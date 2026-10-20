// Minecraft-style light: sky light falling from above and block light from
// lamps, each 0..15 and spreading one step dimmer per block.
import { SY, CHUNK } from "../shared/rules.js";
import { AIR, DEF } from "./blocks.js";
import { li } from "./chunk.js";

// Light for a chunk is computed over it and its eight neighbours (48×48
// columns) and the middle kept. Light travels at most 15 blocks, so that
// is exact, and each chunk can be (re)lit on its own.
const RW = CHUNK * 3, PLANE = RW * RW, RV = RW * SY * RW;
const rb = new Uint8Array(RV), rs = new Uint8Array(RV), rl = new Uint8Array(RV);
const fullTop = new Int16Array(PLANE);
const queue = [];
const ri = (x, y, z) => x + RW * (z + RW * y);

export function lightChunk(world, c) {
  rb.fill(AIR);
  for (let dz = -1; dz <= 1; dz++)
    for (let dx = -1; dx <= 1; dx++) {
      const n = world.get(c.cx + dx, c.cz + dz);
      if (!n) continue; // outside the world: open air
      const ox = (dx + 1) * CHUNK, oz = (dz + 1) * CHUNK;
      for (let y = 0; y < SY; y++)
        for (let z = 0; z < CHUNK; z++) rb.set(n.blocks.subarray(li(0, y, z), li(0, y, z) + CHUNK), ri(ox, y, oz + z));
    }
  rs.fill(0);
  rl.fill(0);

  // Sky light falls straight down at full strength until something stops
  // or dims it; dimmed light carries on down the column.
  queue.length = 0;
  for (let z = 0; z < RW; z++)
    for (let x = 0; x < RW; x++) {
      let y = SY - 1;
      for (; y >= 0; y--) {
        const i = ri(x, y, z);
        const d = DEF[rb[i]];
        if (d.opaque || d.filter) break;
        rs[i] = 15;
      }
      fullTop[x + RW * z] = y + 1;
      let level = 15;
      for (; y >= 0; y--) {
        const i = ri(x, y, z);
        const d = DEF[rb[i]];
        if (d.opaque) break;
        level = Math.max(0, level - d.filter);
        if (!level) break;
        rs[i] = level;
        queue.push(i);
      }
    }
  // Only full-light cells beside a shorter neighbouring column can spread
  // sideways, so only those are queued.
  for (let z = 0; z < RW; z++)
    for (let x = 0; x < RW; x++) {
      const top = fullTop[x + RW * z];
      let reach = top;
      if (x > 0) reach = Math.max(reach, fullTop[x - 1 + RW * z]);
      if (x < RW - 1) reach = Math.max(reach, fullTop[x + 1 + RW * z]);
      if (z > 0) reach = Math.max(reach, fullTop[x + RW * (z - 1)]);
      if (z < RW - 1) reach = Math.max(reach, fullTop[x + RW * (z + 1)]);
      for (let y = top; y < Math.min(SY, reach); y++) queue.push(ri(x, y, z));
    }
  spread(rs);

  queue.length = 0;
  for (let i = 0; i < RV; i++) {
    const e = DEF[rb[i]].emit;
    if (e) {
      rl[i] = e;
      queue.push(i);
    }
  }
  spread(rl);

  // Copy the middle back, noting which neighbours border a change: their
  // meshes sample this chunk's edge light.
  const touched = new Uint8Array(9);
  for (let y = 0; y < SY; y++)
    for (let z = 0; z < CHUNK; z++)
      for (let x = 0; x < CHUNK; x++) {
        const si = ri(x + CHUNK, y, z + CHUNK), ci = li(x, y, z);
        if (c.sky[ci] === rs[si] && c.blk[ci] === rl[si]) continue;
        c.sky[ci] = rs[si];
        c.blk[ci] = rl[si];
        for (let oz = z === 0 ? -1 : 0; oz <= (z === CHUNK - 1 ? 1 : 0); oz++)
          for (let ox = x === 0 ? -1 : 0; ox <= (x === CHUNK - 1 ? 1 : 0); ox++) touched[ox + 1 + 3 * (oz + 1)] = 1;
      }
  return touched;
}

function spread(L) {
  for (let h = 0; h < queue.length; h++) {
    const i = queue[h];
    const l = L[i];
    if (l <= 1) continue;
    const x = i % RW, z = ((i / RW) | 0) % RW, y = (i / PLANE) | 0;
    if (x > 0) visit(L, i - 1, l);
    if (x < RW - 1) visit(L, i + 1, l);
    if (z > 0) visit(L, i - RW, l);
    if (z < RW - 1) visit(L, i + RW, l);
    if (y > 0) visit(L, i - PLANE, l);
    if (y < SY - 1) visit(L, i + PLANE, l);
  }
}

function visit(L, j, l) {
  const d = DEF[rb[j]];
  if (d.opaque) return;
  const nl = l - 1 - d.filter;
  if (nl > L[j]) {
    L[j] = nl;
    queue.push(j);
  }
}
