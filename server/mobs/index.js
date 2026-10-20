// Mobs: the room owns every one. Each mob is a path it's walking (see
// pathAt in play/js/shared/mobs.js); clients replay the same path, so the
// room only sends something when a mob decides to do something new.
//
// The room thinks for mobs in its alarm, set for the next moment one of them
// is due to decide (at most four times a second), and only for mobs within
// AWAKE_R of a player; a message arriving when the alarm is late thinks too. With nobody connected the alarm isn't set again, so
// an empty world costs nothing.
//
// Stored in the room's SQL as where each mob will stand when its current
// path ends; the paths themselves live on room.mobs and are lost when the
// room idles, which leaves each mob standing at the end of its path.
import { REACH, sunUpAt } from "../../play/js/shared/rules.js";
import { MOBS, pathAt, pathDuration } from "../../play/js/shared/mobs.js";
import { worldRecord } from "../edits.js";
import { terrainReader } from "../terrain.js";
import { spawnItem, BREAK_DELAY_MS } from "../items.js";
import { REACH_SLACK, IMMUNE_MS, ATTACK_MS } from "../combat.js";
import { decide, PANIC_MS } from "./brain.js";
import { planFlee, settle } from "./path.js";
import { naturalSpawn, summon } from "./spawn.js";

const AWAKE_R = 96; // blocks from the nearest player a mob keeps thinking
const SPAWN_EVERY_MS = 5000;
const MIN_TICK_MS = 250;
const LATE_MS = 1000;
const KNOCK_SPEED = 7; // blocks per second, flying back from a hit

export function setupMobs(room) {
  room.ctx.storage.sql.exec(
    "CREATE TABLE IF NOT EXISTS mobs (id TEXT PRIMARY KEY, kind TEXT, x INTEGER, y INTEGER, z INTEGER, ry REAL, hp INTEGER)",
  );
}

// id -> mob, loaded once per room wake-up. A mob: { id, kind, hp, path,
// speed, start (ms), ry, until (when it next decides), plus what its goals
// keep (rested, panicUntil, panicFrom) and hurtAt }.
export function mobsOf(room) {
  if (room.mobs) return room.mobs;
  room.mobs = new Map();
  const now = Date.now();
  // Kinds that no longer exist are cleared out.
  const known = Object.keys(MOBS);
  room.ctx.storage.sql.exec(`DELETE FROM mobs WHERE kind NOT IN (${known.map(() => "?").join(", ")})`, ...known);
  for (const r of room.ctx.storage.sql.exec("SELECT * FROM mobs")) {
    room.mobs.set(r.id, {
      id: r.id, kind: r.kind, hp: r.hp, path: [[r.x, r.y, r.z]], speed: MOBS[r.kind].walk, start: now, ry: r.ry,
      until: now + Math.random() * 3000,
    });
  }
  return room.mobs;
}

// What clients get; age is relative so clocks don't need to agree.
const publicMob = (m, now = Date.now()) => ({
  id: m.id, kind: m.kind, hp: m.hp, path: m.path, speed: m.speed, age: now - m.start, ry: m.ry,
});

export const allMobs = (room) => [...mobsOf(room).values()].map((m) => publicMob(m));

export const mobPos = (m, now) => pathAt(m.path, m.speed, (now - m.start) / 1000, m.ry);

// The cell a mob is in now.
const cellOf = (m, now) => m.path[mobPos(m, now).cell];

const alivePlayers = (room) =>
  room.ctx.getWebSockets().map((s) => s.deserializeAttachment()).filter((p) => p && !p.dead);

async function readerFor(room) {
  const { seed } = await worldRecord(room);
  return terrainReader(room, seed);
}

function save(room, m) {
  const [x, y, z] = m.path[m.path.length - 1];
  room.ctx.storage.sql.exec(
    "INSERT INTO mobs (id, kind, x, y, z, ry, hp) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT (id) DO UPDATE SET x = excluded.x, y = excluded.y, z = excluded.z, ry = excluded.ry, hp = excluded.hp",
    m.id, m.kind, x, y, z, m.ry, m.hp,
  );
}

// Sends a mob walking along path (a single cell: standing there); it
// decides again when it gets there.
function setPath(room, m, path, speed, now) {
  m.ry = mobPos(m, now).yaw;
  Object.assign(m, { path, speed, start: now });
  m.ry = pathAt(path, speed, Infinity, m.ry).yaw;
  m.until = now + pathDuration(path, speed) * 1000;
  save(room, m);
  room.broadcast(null, { type: "mob", mob: publicMob(m, now) });
}

export function addMob(room, kind, cell) {
  const now = Date.now();
  const m = {
    id: crypto.randomUUID().slice(0, 8), kind, hp: MOBS[kind].hp, path: [cell], speed: MOBS[kind].walk, start: now,
    ry: Math.random() * Math.PI * 2, until: now + 1000 + Math.random() * 3000,
  };
  mobsOf(room).set(m.id, m);
  save(room, m);
  room.broadcast(null, { type: "mob", mob: publicMob(m, now) });
  return m;
}

export function removeMob(room, m) {
  mobsOf(room).delete(m.id);
  room.ctx.storage.sql.exec("DELETE FROM mobs WHERE id = ?", m.id);
  room.broadcast(null, { type: "mobgone", id: m.id });
}

export function clearMobs(room) {
  room.ctx.storage.sql.exec("DELETE FROM mobs");
  room.mobs = new Map();
}

// ---------------------------------------------------------------- health

// Hurts a mob (unless it was hit a moment ago). from: [x, z] of whoever hit
// it, which knocks it back and sends it running; strength: how far (a
// sprinting hit knocks further).
export async function hurtMob(room, m, amount, { from, strength = 1 } = {}) {
  const now = Date.now();
  if (now - (m.hurtAt ?? 0) < IMMUNE_MS) return;
  m.hurtAt = now;
  m.hp = Math.max(0, m.hp - amount);
  room.broadcast(null, { type: "mobhurt", id: m.id, hp: m.hp });
  if (!m.hp) return killMob(room, m, now);
  if (from) {
    Object.assign(m, { panicUntil: now + PANIC_MS, panicFrom: from, rested: false });
    const cell = cellOf(m, now);
    const knock = planFlee(await readerFor(room), cell, from, strength);
    setPath(room, m, knock ?? [cell], KNOCK_SPEED, now);
    await wakeMobs(room, true);
  } else {
    save(room, m);
  }
}

function killMob(room, m, now) {
  const p = mobPos(m, now);
  mobsOf(room).delete(m.id);
  room.ctx.storage.sql.exec("DELETE FROM mobs WHERE id = ?", m.id);
  room.broadcast(null, { type: "mobdeath", id: m.id });
  for (const [item, least, most] of MOBS[m.kind].drops) {
    const n = least + Math.floor(Math.random() * (most - least + 1));
    const a = Math.random() * Math.PI * 2;
    if (n > 0) spawnItem(room, item, n, [p.x, p.y + 0.5, p.z], [Math.cos(a), 3, Math.sin(a)], BREAK_DELAY_MS);
  }
}

// ---------------------------------------------------------------- thinking

// Makes sure the alarm will go off soon (on someone joining, a hit, a
// summon): within 250 ms, or at once.
export async function wakeMobs(room, soon = false) {
  const at = Date.now() + (soon ? 0 : MIN_TICK_MS);
  const set = await room.ctx.storage.getAlarm();
  if (set === null || set > at) await room.ctx.storage.setAlarm(at);
}

// The alarm: every awake mob that's due decides what to do next, and now
// and then more spawn.
export async function mobTick(room) {
  if (!room.ctx.getWebSockets().length) return; // nobody here: let it sleep
  const now = Date.now();
  const players = alivePlayers(room);
  const world = await worldRecord(room);
  const r = terrainReader(room, world.seed);
  let next = now + SPAWN_EVERY_MS;
  try {
    for (const m of mobsOf(room).values()) {
      const p = mobPos(m, now);
      if (!players.some((q) => Math.hypot(q.p[0] - p.x, q.p[2] - p.z) < AWAKE_R)) continue;
      if (now >= m.until) {
        const plan = decide(m, r, m.path[p.cell], now);
        if (plan.path) setPath(room, m, plan.path, plan.speed, now);
        else m.until = now + plan.wait;
      }
      next = Math.min(next, m.until);
    }
    if (now >= (room.spawnAt ?? 0)) {
      room.spawnAt = now + SPAWN_EVERY_MS;
      if (sunUpAt(now + world.timeOffset)) naturalSpawn(room, r, players, now);
    }
    next = Math.min(next, room.spawnAt);
  } finally {
    // Even if something above failed, keep ticking.
    room.tickDue = Math.max(next, now + MIN_TICK_MS);
    await room.ctx.storage.setAlarm(room.tickDue);
  }
}

// /summon: n mobs of a kind where a player stands; returns how many came.
export async function summonMobs(room, kind, n, at) {
  const r = await readerFor(room);
  let made = 0;
  for (let i = 0; i < n; i++) if (summon(room, r, kind, at, alivePlayers(room))) made++;
  if (made) await wakeMobs(room);
  return made;
}

// Called after every message: if the alarm is late (it can be, after the
// room idles, and yard dev doesn't always fire one set from the alarm
// itself), think now. Clients ping every 2 s, so mobs never stall for long.
export async function tickIfLate(room) {
  if (Date.now() >= (room.tickDue ?? 0) + LATE_MS) await mobTick(room);
}

// A block changed: mobs standing on it or about to walk through it stop
// where they are and drop (or climb out) to where they can stand. A fall
// of more than three blocks hurts, as it does players.
export async function noticeEdit(room, x, y, z) {
  const now = Date.now();
  let r = null;
  for (const m of mobsOf(room).values()) {
    const at = mobPos(m, now);
    const ahead = m.path.slice(at.cell);
    if (!ahead.some((c) => c[0] === x && c[2] === z && y >= c[1] - 1 && y <= c[1] + 1)) continue;
    r ??= await readerFor(room);
    const cell = m.path[at.cell];
    const to = settle(r, cell);
    setPath(room, m, to[1] === cell[1] ? [cell] : [cell, to], MOBS[m.kind].walk, now);
    const fell = cell[1] - to[1];
    if (fell > 3) await hurtMob(room, m, fell - 3);
  }
  if (r) await wakeMobs(room, true);
}

// ---------------------------------------------------------------- messages

export const mobMessages = {
  // A player hit a mob: alive, near enough, not too fast. As with players,
  // a falling hit is critical and a sprinting one knocks further.
  async hitmob(room, ws, player, msg) {
    if (typeof msg.id !== "string" || player.dead) return;
    const m = mobsOf(room).get(msg.id);
    const now = Date.now();
    if (!m || now - player.attackAt < ATTACK_MS) return;
    const p = mobPos(m, now);
    if (Math.hypot(p.x - player.p[0], p.y - player.p[1], p.z - player.p[2]) > REACH + REACH_SLACK) return;
    player.attackAt = now;
    ws.serializeAttachment(player);
    await hurtMob(room, m, msg.crit ? 2 : 1, { from: [player.p[0], player.p[2]], strength: msg.sprint ? 2 : 1 });
  },
};
