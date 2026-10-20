// Where mobs come from: natural spawning around players (by day, on the
// blocks each kind likes) and /summon. Animals never despawn, as in
// Minecraft; at the cap, the mob farthest from everyone makes room.
import { MOBS } from "../../play/js/shared/mobs.js";
import { addMob, mobsOf, mobPos, removeMob } from "./index.js";
import { standable, settle } from "./path.js";

const MAX_MOBS = 150; // per world
const NEAR_R = 64; // how near a player counts toward a kind's spawn.near
const FAR_R = 128; // a mob this far from everyone may go to make room
const TRIES = 4;

const SPAWNERS = Object.keys(MOBS).filter((k) => MOBS[k].spawn);
const randInt = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));

// The cell on top of column (x, z), if a mob of this rule can spawn there.
function spawnCell(r, x, z, rule) {
  const top = r.top(x, z);
  if (!top || !rule.on.includes(top[1])) return null;
  const cell = [x, top[0] + 1, z];
  return standable(r, ...cell) ? cell : null;
}

// Makes room for one more mob; false if every mob is near someone.
function makeRoom(room, players, now) {
  const mobs = mobsOf(room);
  if (mobs.size < MAX_MOBS) return true;
  let far = null, farD = FAR_R;
  for (const m of mobs.values()) {
    const p = mobPos(m, now);
    const d = Math.min(...players.map((q) => Math.hypot(q.p[0] - p.x, q.p[2] - p.z)));
    if (d > farD) (far = m), (farD = d);
  }
  if (far) removeMob(room, far);
  return !!far;
}

// For each player with few mobs around: a group, somewhere 24–48 blocks off.
export function naturalSpawn(room, r, players, now) {
  if (!SPAWNERS.length) return;
  const mobs = [...mobsOf(room).values()].map((m) => mobPos(m, now));
  for (const player of players) {
    const [px, , pz] = player.p;
    const near = mobs.filter((p) => Math.hypot(p.x - px, p.z - pz) < NEAR_R).length;
    for (let i = 0; i < TRIES; i++) {
      const kind = SPAWNERS[Math.floor(Math.random() * SPAWNERS.length)];
      const rule = MOBS[kind].spawn;
      if (near >= rule.near) continue;
      const a = Math.random() * Math.PI * 2, d = 24 + Math.random() * 24;
      const x = Math.floor(px + Math.cos(a) * d), z = Math.floor(pz + Math.sin(a) * d);
      if (!spawnCell(r, x, z, rule)) continue;
      for (let n = randInt(...rule.group); n > 0; n--) {
        const cell = spawnCell(r, x + randInt(-2, 2), z + randInt(-2, 2), rule);
        if (cell && makeRoom(room, players, now)) addMob(room, kind, cell);
      }
      break; // one group per player each time
    }
  }
}

// /summon: a mob at a player's feet (or on the ground below, if flying).
export function summon(room, r, kind, [x, y, z], players) {
  if (!makeRoom(room, players, Date.now())) return null;
  return addMob(room, kind, settle(r, [Math.floor(x), Math.floor(y), Math.floor(z)]));
}
