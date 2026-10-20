// Terrain generation: a pure function of the seed, so every client builds
// the same world and only edits travel over the network.
import { SX, SY, SZ, CHUNK } from "../shared/rules.js";
import { AIR, GRASS, DIRT, STONE, SAND, LOG, LEAVES, WATER } from "./blocks.js";
import { hash, valueNoise } from "../core/noise.js";
import { li } from "./chunk.js";

export const SEA = 30;

const smoothstep = (e0, e1, x) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

// Surface height of a column: continents, ridged mountains on the higher
// ground, and the small hills from before on top.
export function heightAt(seed, x, z) {
  const continent = valueNoise(seed + 3, x / 220, z / 220);
  const ridge = 1 - Math.abs(valueNoise(seed + 4, x / 90, z / 90) * 2 - 1);
  const detail =
    valueNoise(seed, x / 24, z / 24) * 0.6 + valueNoise(seed + 1, x / 10, z / 10) * 0.3 + valueNoise(seed + 2, x / 4, z / 4) * 0.1;
  const h = 14 + continent * 26 + detail * 12 + ridge ** 3 * 42 * smoothstep(0.45, 0.75, continent);
  return Math.max(2, Math.min(SY - 12, Math.floor(h)));
}

const surfaceOf = (h) => (h >= 64 ? STONE : h <= SEA + 1 ? SAND : GRASS);
const treeAt = (seed, x, z, h) => h > SEA + 1 && h < 62 && hash(seed + 7, x, z) < 0.012;

// Land near the middle of the world, searched outwards in rings.
export function findSpawn(seed) {
  const cx = SX / 2, cz = SZ / 2;
  for (let r = 0; r < 512; r += 4)
    for (let i = 0; i < Math.max(1, r * 2); i++) {
      const a = (i / Math.max(1, r * 2)) * Math.PI * 2;
      const x = Math.floor(cx + Math.cos(a) * r), z = Math.floor(cz + Math.sin(a) * r);
      const h = heightAt(seed, x, z);
      if (surfaceOf(h) === GRASS) return [x + 0.5, z + 0.5];
    }
  return [cx + 0.5, cz + 0.5];
}

// Builds a chunk from the seed alone. Trees rooted up to two blocks outside
// it are scanned too, so a tree crossing a chunk edge comes out whole
// without either chunk depending on the other.
export function generate(c, seed) {
  const M = 2, W = CHUNK + 2 * M;
  const x0 = c.cx * CHUNK, z0 = c.cz * CHUNK;
  const heights = new Int16Array(W * W);
  for (let dz = -M; dz < CHUNK + M; dz++)
    for (let dx = -M; dx < CHUNK + M; dx++) heights[dx + M + W * (dz + M)] = heightAt(seed, x0 + dx, z0 + dz);

  const b = c.blocks;
  for (let z = 0; z < CHUNK; z++)
    for (let x = 0; x < CHUNK; x++) {
      const h = heights[x + M + W * (z + M)];
      const top = surfaceOf(h);
      const under = top === GRASS ? DIRT : top;
      for (let y = 0; y <= h; y++) b[li(x, y, z)] = y === h ? top : y > h - 4 ? under : STONE;
      for (let y = h + 1; y <= SEA; y++) b[li(x, y, z)] = WATER;
    }

  // Trunks always win; leaves only fill air, so overlapping trees come out
  // the same whichever is placed first.
  const put = (x, y, z, id, force) => {
    if (x < 0 || z < 0 || x >= CHUNK || z >= CHUNK || y < 0 || y >= SY) return;
    const i = li(x, y, z);
    if (force || b[i] === AIR) b[i] = id;
  };
  for (let dz = -M; dz < CHUNK + M; dz++)
    for (let dx = -M; dx < CHUNK + M; dx++) {
      const wx = x0 + dx, wz = z0 + dz;
      const h = heights[dx + M + W * (dz + M)];
      if (!treeAt(seed, wx, wz, h)) continue;
      for (let y = h + 1; y <= h + 4; y++) put(dx, y, dz, LOG, true);
      for (let dy = 3; dy <= 6; dy++) {
        const r = dy >= 5 ? 1 : 2;
        for (let ox = -r; ox <= r; ox++)
          for (let oz = -r; oz <= r; oz++) {
            if (r === 2 && Math.abs(ox) === 2 && Math.abs(oz) === 2 && hash(seed + dy, wx + ox, wz + oz) < 0.5) continue;
            put(dx + ox, h + dy, dz + oz, LEAVES, false);
          }
      }
    }
}
