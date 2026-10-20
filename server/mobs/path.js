// Finding a way across the blocks: which cells a mob can stand in, which
// steps it can take (up one block, or down at most three, never cutting a
// corner), and short paths toward or away from somewhere. r is a terrain
// reader (terrainReader in ../terrain.js).
import { SX, SY, SZ } from "../../play/js/shared/rules.js";
import { DEF } from "../../play/js/world/blocks.js";

const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
const solid = (b) => DEF[b].solid;
const key = ([x, y, z]) => `${x},${y},${z}`;

// Feet in an open, dry cell, on something solid.
export function standable(r, x, y, z) {
  if (x < 0 || z < 0 || x >= SX || z >= SZ || y < 1 || y >= SY - 1) return false;
  const feet = r.at(x, y, z);
  return !solid(feet) && !DEF[feet].water && solid(r.at(x, y - 1, z));
}

// The cell reached stepping (dx, dz) from a cell, or null if it can't.
function step(r, [x, y, z], dx, dz) {
  const nx = x + dx, nz = z + dz;
  if (dx && dz && (solid(r.at(nx, y, z)) || solid(r.at(x, y, nz)))) return null;
  if (solid(r.at(nx, y, nz))) {
    // Up a step, if there's room to hop.
    return !solid(r.at(x, y + 1, z)) && standable(r, nx, y + 1, nz) ? [nx, y + 1, nz] : null;
  }
  for (let ny = y; ny >= y - 3; ny--) {
    if (standable(r, nx, ny, nz)) return [nx, ny, nz];
    const b = r.at(nx, ny, nz);
    if (solid(b) || DEF[b].water) return null;
  }
  return null; // a drop of more than three blocks
}

// Steps greedily toward (tx, tz) for at most maxSteps; null if it can't
// get anywhere nearer.
function planToward(r, from, tx, tz, maxSteps) {
  const path = [from];
  const seen = new Set([key(from)]);
  const dist = (c) => (c[0] + 0.5 - tx) ** 2 + (c[2] + 0.5 - tz) ** 2;
  let cur = from;
  for (let i = 0; i < maxSteps && dist(cur) > 1; i++) {
    let best = null, bestD = dist(cur);
    for (const [dx, dz] of DIRS) {
      const next = step(r, cur, dx, dz);
      if (!next || seen.has(key(next))) continue;
      const d = dist(next);
      if (d < bestD) (best = next), (bestD = d);
    }
    if (!best) break;
    path.push(best);
    seen.add(key(best));
    cur = best;
  }
  return path.length > 1 ? path : null;
}

// A stroll to somewhere within ten blocks.
export function planWander(r, from) {
  const a = Math.random() * Math.PI * 2, d = 3 + Math.random() * 7;
  return planToward(r, from, from[0] + 0.5 + Math.cos(a) * d, from[2] + 0.5 + Math.sin(a) * d, 16);
}

// A dash away from the point (ax, az), a little to one side or the other.
// steps: how far to go.
export function planFlee(r, from, [ax, az], steps = 5) {
  const a = Math.atan2(from[2] + 0.5 - az, from[0] + 0.5 - ax) + (Math.random() - 0.5) * 1.2;
  return planToward(r, from, from[0] + 0.5 + Math.cos(a) * 8, from[2] + 0.5 + Math.sin(a) * 8, steps);
}

// Where a mob in this cell ends up if the blocks around it changed: up out
// of a block placed in it, or down onto whatever is below.
export function settle(r, [x, y, z]) {
  for (let up = 0; up < 4 && solid(r.at(x, y, z)); up++) y++;
  while (y > 1 && !solid(r.at(x, y - 1, z)) && !DEF[r.at(x, y, z)].water) y--;
  return [x, y, z];
}
