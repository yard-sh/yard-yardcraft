// Turns a chunk into mesh arrays: one quad per visible block face, with
// smooth light and corner shading baked into each vertex.
import { SY, CHUNK } from "../shared/rules.js";
import { AIR, STONE, GLASS, WATER, DEF, tileUV } from "./blocks.js";
import { li } from "./chunk.js";

// Faces: neighbour direction, CCW corners seen from outside, which texture
// (0 top, 1 side, 2 bottom) and a fixed directional shade. Each corner also
// carries the three cells around it on the face's outer side, for smooth
// light and ambient occlusion.
const FACES = [
  { d: [1, 0, 0], c: [[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]], k: 1, s: 0.86 },
  { d: [-1, 0, 0], c: [[0, 0, 1], [0, 1, 1], [0, 1, 0], [0, 0, 0]], k: 1, s: 0.86 },
  { d: [0, 1, 0], c: [[0, 1, 1], [1, 1, 1], [1, 1, 0], [0, 1, 0]], k: 0, s: 1.0 },
  { d: [0, -1, 0], c: [[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]], k: 2, s: 0.6 },
  { d: [0, 0, 1], c: [[1, 0, 1], [1, 1, 1], [0, 1, 1], [0, 0, 1]], k: 1, s: 0.76 },
  { d: [0, 0, -1], c: [[0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]], k: 1, s: 0.76 },
];
for (const f of FACES) {
  const axis = f.d.findIndex((v) => v !== 0);
  const u = (axis + 1) % 3, v = (axis + 2) % 3;
  f.corners = f.c.map((c) => {
    const s1 = [...f.d], s2 = [...f.d];
    s1[u] += c[u] ? 1 : -1;
    s2[v] += c[v] ? 1 : -1;
    const s3 = [...s1];
    s3[v] += c[v] ? 1 : -1;
    // Texture coordinates: sides stand upright, tops and bottoms use x/z.
    const uv = axis === 1 ? [c[0], c[2]] : axis === 0 ? [c[2], c[1]] : [c[0], c[1]];
    return { c, s1, s2, s3, uv };
  });
}
const AO = [0.45, 0.65, 0.82, 1.0];

function drawFace(b, nb) {
  if (DEF[nb].opaque) return false;
  if (b === WATER) return nb !== WATER;
  if (b === GLASS) return nb !== GLASS;
  return true;
}

function meshData() {
  return { pos: [], nor: [], uv: [], light: [], ind: [] };
}

// Mesh arrays for a chunk in its own coordinates (place it at cx*16, cz*16).
// Reads one block into the neighbours for face culling and corner light.
export function meshChunk(world, c) {
  const nb = [];
  for (let dz = -1; dz <= 1; dz++) for (let dx = -1; dx <= 1; dx++) nb.push(world.get(c.cx + dx, c.cz + dz));
  const at = (x, z) => nb[(x >> 4) + 1 + 3 * ((z >> 4) + 1)];
  const blockAt = (x, y, z) => {
    if (y < 0) return STONE;
    if (y >= SY) return AIR;
    const n = at(x, z);
    return n ? n.blocks[li(x & 15, y, z & 15)] : AIR;
  };
  const opaqueAt = (x, y, z) => DEF[blockAt(x, y, z)].opaque;
  const skyAt = (x, y, z) => {
    if (y >= SY) return 15;
    if (y < 0) return 0;
    const n = at(x, z);
    return n ? n.sky[li(x & 15, y, z & 15)] : 15;
  };
  const blkAt = (x, y, z) => {
    if (y < 0 || y >= SY) return 0;
    const n = at(x, z);
    return n ? n.blk[li(x & 15, y, z & 15)] : 0;
  };

  const solid = meshData(), water = meshData();
  const lit = [0, 0, 0, 0];
  for (let y = 0; y < SY; y++)
    for (let z = 0; z < CHUNK; z++)
      for (let x = 0; x < CHUNK; x++) {
        const b = c.blocks[li(x, y, z)];
        if (!b) continue;
        const d = DEF[b];
        const out = d.water ? water : solid;
        const lowTop = b === WATER && blockAt(x, y + 1, z) !== WATER;
        for (const f of FACES) {
          const nx = x + f.d[0], ny = y + f.d[1], nz = z + f.d[2];
          if (ny < 0) continue;
          if (!drawFace(b, blockAt(nx, ny, nz))) continue;
          const tile = d.tex[f.k];
          const base = out.pos.length / 3;
          for (let ci = 0; ci < 4; ci++) {
            const k = f.corners[ci];
            const o1 = opaqueAt(x + k.s1[0], y + k.s1[1], z + k.s1[2]);
            const o2 = opaqueAt(x + k.s2[0], y + k.s2[1], z + k.s2[2]);
            const o3 = (o1 && o2) || opaqueAt(x + k.s3[0], y + k.s3[1], z + k.s3[2]);
            const ao = o1 && o2 ? 0 : 3 - o1 - o2 - o3;
            // Smooth light: average the open cells around this corner.
            let s = skyAt(nx, ny, nz), l = blkAt(nx, ny, nz), cnt = 1;
            if (!o1) (s += skyAt(x + k.s1[0], y + k.s1[1], z + k.s1[2])), (l += blkAt(x + k.s1[0], y + k.s1[1], z + k.s1[2])), cnt++;
            if (!o2) (s += skyAt(x + k.s2[0], y + k.s2[1], z + k.s2[2])), (l += blkAt(x + k.s2[0], y + k.s2[1], z + k.s2[2])), cnt++;
            if (!o3) (s += skyAt(x + k.s3[0], y + k.s3[1], z + k.s3[2])), (l += blkAt(x + k.s3[0], y + k.s3[1], z + k.s3[2])), cnt++;
            let ls = s / cnt / 15, lb = l / cnt / 15, la = AO[ao] * f.s;
            if (d.emit) (lb = 1), (la = 1); // glowing blocks are lit by themselves
            out.pos.push(x + k.c[0], y + (lowTop && k.c[1] ? 0.875 : k.c[1]), z + k.c[2]);
            out.nor.push(f.d[0], f.d[1], f.d[2]);
            out.uv.push(...tileUV(tile, k.uv[0], k.uv[1]));
            out.light.push(ls, lb, la);
            lit[ci] = la * Math.max(ls, lb);
          }
          // Split the quad along its brighter diagonal so corner shading
          // reads as a smooth gradient rather than a streak.
          if (lit[0] + lit[2] >= lit[1] + lit[3]) out.ind.push(base, base + 1, base + 2, base, base + 2, base + 3);
          else out.ind.push(base, base + 1, base + 3, base + 1, base + 2, base + 3);
        }
      }
  return { solid, water };
}
