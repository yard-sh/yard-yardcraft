// Ray tests: against the block grid, and against a box (a player).
import { WATER } from "../world/blocks.js";
import { blockAt, eyePos } from "./state.js";
import { lookDir } from "./player.js";

// Voxel DDA from o along d; returns the first block hit, the cell before it
// and the distance. Water and unloaded chunks are looked through.
export function raycast(maxDist = 6, o = eyePos, d = lookDir()) {
  let x = Math.floor(o.x), y = Math.floor(o.y), z = Math.floor(o.z);
  const sx = Math.sign(d.x), sy = Math.sign(d.y), sz = Math.sign(d.z);
  const tdx = Math.abs(1 / d.x), tdy = Math.abs(1 / d.y), tdz = Math.abs(1 / d.z);
  let tx = (sx > 0 ? x + 1 - o.x : o.x - x) * tdx;
  let ty = (sy > 0 ? y + 1 - o.y : o.y - y) * tdy;
  let tz = (sz > 0 ? z + 1 - o.z : o.z - z) * tdz;
  let prev = null, t = 0;
  while (t <= maxDist) {
    const b = blockAt(x, y, z);
    if (b > 0 && b !== WATER) return { hit: [x, y, z], prev, t };
    prev = [x, y, z];
    if (tx < ty && tx < tz) { x += sx; t = tx; tx += tdx; }
    else if (ty < tz) { y += sy; t = ty; ty += tdy; }
    else { z += sz; t = tz; tz += tdz; }
  }
  return null;
}

// Where a ray from o along d enters a box, or null if it misses.
export function rayBox(o, d, x0, y0, z0, x1, y1, z1) {
  let near = 0, far = Infinity;
  for (const [oo, dd, lo, hi] of [[o.x, d.x, x0, x1], [o.y, d.y, y0, y1], [o.z, d.z, z0, z1]]) {
    if (Math.abs(dd) < 1e-9) {
      if (oo < lo || oo > hi) return null;
      continue;
    }
    let a = (lo - oo) / dd, b = (hi - oo) / dd;
    if (a > b) [a, b] = [b, a];
    near = Math.max(near, a);
    far = Math.min(far, b);
    if (near > far) return null;
  }
  return near;
}
