// Mob kinds and how mobs move, shared by the client and the server.
//
// The server decides where a mob goes and sends it as a path: a list of
// block cells [x, y, z] (the cell its feet are in) walked at `speed` blocks
// per second, started `age` milliseconds ago. Both sides work out where it
// is from that with pathAt(), so nothing is sent while it walks.
//
// A kind is plain data. Its model and texture are in js/mobs/<kind>.js,
// its behaviours (the names in ai) in server/mobs/brain.js.
import { GRASS } from "../world/blocks.js";
import { STRAWBERRY } from "./items.js";

// hp: health (players have 20); box: [width, height] in blocks; walk and
// panic: speeds in blocks per second; drops: [item, least, most] on death;
// spawn: the blocks it spawns on, how many at once, and how many may be
// near a player before no more spawn; ai: its goals, most urgent first.
export const MOBS = {
  // A garden gnome: stands about the yard, shuffles off now and then, runs
  // when hit, and leaves strawberries from its garden.
  gnome: {
    name: "Gnome",
    hp: 10,
    box: [0.5, 0.95],
    walk: 1.1,
    panic: 2.6,
    drops: [[STRAWBERRY, 1, 3]],
    spawn: { on: [GRASS], group: [2, 3], near: 6 },
    ai: ["panic", "wander"],
  },
};

export const isMobKind = (kind) => typeof kind === "string" && Object.hasOwn(MOBS, kind);

// ---------------------------------------------------------------- paths

// Seconds to walk from cell a to cell b: the flat distance at speed, plus
// the time to fall if it drops.
function segmentTime(a, b, speed) {
  const flat = Math.hypot(b[0] - a[0], b[2] - a[2]);
  const drop = a[1] - b[1];
  return Math.max(flat, 0.3) / speed + (drop > 0 ? Math.sqrt(drop / 8) : 0);
}

export function pathDuration(path, speed) {
  let t = 0;
  for (let i = 1; i < path.length; i++) t += segmentTime(path[i - 1], path[i], speed);
  return t;
}

const clamp01 = (v) => Math.max(0, Math.min(1, v));

// Where a mob is `elapsed` seconds along its path: feet position (the
// middle of the cell), the way it faces (yaw, as players' yaw: 0 faces -z),
// hop (extra height while hopping up a step), the cell it's nearest
// (index into path), and whether it has arrived.
export function pathAt(path, speed, elapsed, yaw = 0) {
  let t = Math.max(0, elapsed);
  for (let i = 1; i < path.length; i++) {
    const a = path[i - 1], b = path[i];
    const dx = b[0] - a[0], dz = b[2] - a[2], dy = b[1] - a[1];
    if (dx || dz) yaw = Math.atan2(-dx, -dz);
    const len = segmentTime(a, b, speed);
    if (t >= len) {
      t -= len;
      continue;
    }
    const f = t / len;
    let y = a[1], hop = 0;
    if (dy > 0) {
      // A hop up the step at the start.
      const k = clamp01(f / 0.4);
      y += dy * k;
      hop = Math.sin(k * Math.PI) * 0.3;
    } else if (dy < 0) {
      // Walks to the edge, then falls (straight down if it isn't moving).
      const k = dx || dz ? clamp01((f - 0.45) / 0.55) : f;
      y += dy * k * k;
    }
    return { x: a[0] + 0.5 + dx * f, y, z: a[2] + 0.5 + dz * f, yaw, hop, cell: f < 0.5 ? i - 1 : i, done: false };
  }
  const e = path[path.length - 1];
  return { x: e[0] + 0.5, y: e[1], z: e[2] + 0.5, yaw, hop: 0, cell: path.length - 1, done: true };
}
