// Items lying in the world: dropped by breaking blocks, thrown, or spilled
// on death. The room keeps where each started and how it was thrown; every
// client runs the same short fall from there. Walking into one picks it up.
import { CHUNK } from "../play/js/shared/rules.js";
import { giveItem } from "./inventory.js";

export const BREAK_DELAY_MS = 500; // before a broken block's drop can be picked up
export const THROW_DELAY_MS = 2000; // before a thrown or spilled stack can
const LIFETIME_MS = 5 * 60 * 1000; // items vanish after 5 minutes, as in Minecraft
const MAX_ITEMS = 500; // per world; the oldest go first
const PICKUP_RANGE = 8; // blocks from where an item started (it may have rolled or been thrown)

export function setupItems(room) {
  const sql = room.ctx.storage.sql;
  sql.exec(
    "CREATE TABLE IF NOT EXISTS items (id TEXT PRIMARY KEY, b INTEGER, n INTEGER, x REAL, y REAL, z REAL, vx REAL, vy REAL, vz REAL, cx INTEGER, cz INTEGER, born INTEGER, pickup_at INTEGER)",
  );
  sql.exec("CREATE INDEX IF NOT EXISTS items_chunk ON items (cx, cz)");
}

// What clients get: position and velocity at birth, age and pickup delay
// relative to now (so clock differences don't matter).
function publicItem(r, now = Date.now()) {
  return { id: r.id, b: r.b, n: r.n, p: [r.x, r.y, r.z], v: [r.vx, r.vy, r.vz], age: now - r.born, wait: Math.max(0, r.pickup_at - now) };
}

const round = (v) => Math.round(v * 1000) / 1000;

// Drops n of block b at p moving at v (blocks per second).
export function spawnItem(room, b, n, p, v, delayMs = BREAK_DELAY_MS) {
  const sql = room.ctx.storage.sql;
  const now = Date.now();
  const r = {
    id: crypto.randomUUID().slice(0, 8), b, n,
    x: round(p[0]), y: round(p[1]), z: round(p[2]), vx: round(v[0]), vy: round(v[1]), vz: round(v[2]),
    cx: Math.floor(p[0] / CHUNK), cz: Math.floor(p[2] / CHUNK), born: now, pickup_at: now + delayMs,
  };
  sql.exec("INSERT INTO items VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", ...Object.values(r));
  room.broadcast(null, { type: "item", item: publicItem(r, now) });
  const extra = sql.exec("SELECT COUNT(*) AS n FROM items").toArray()[0].n - MAX_ITEMS;
  if (extra > 0) {
    for (const old of sql.exec("SELECT id FROM items ORDER BY born LIMIT ?", extra).toArray()) removeItem(room, old.id);
  }
}

function removeItem(room, id, by) {
  room.ctx.storage.sql.exec("DELETE FROM items WHERE id = ?", id);
  room.broadcast(null, { type: "itemgone", id, by });
}

// The items in a chunk, for a client loading it. Expired items are cleared
// out first (clients drop them on their own as they expire).
export function itemsIn(room, cx, cz) {
  const now = Date.now();
  const sql = room.ctx.storage.sql;
  sql.exec("DELETE FROM items WHERE born < ?", now - LIFETIME_MS);
  return sql.exec("SELECT * FROM items WHERE cx = ? AND cz = ?", cx, cz).toArray().map((r) => publicItem(r, now));
}

export function clearItems(room) {
  room.ctx.storage.sql.exec("DELETE FROM items");
}

export const itemMessages = {
  // A player walked into an item. The first to ask gets it; what doesn't
  // fit in their inventory stays on the ground.
  pickup(room, ws, player, msg) {
    if (typeof msg.id !== "string" || player.dead) return;
    const r = room.ctx.storage.sql.exec("SELECT * FROM items WHERE id = ?", msg.id).toArray()[0];
    const now = Date.now();
    if (!r || now < r.pickup_at || now - r.born > LIFETIME_MS) return;
    if (Math.hypot(r.x - player.p[0], r.y - player.p[1], r.z - player.p[2]) > PICKUP_RANGE) return;
    const left = giveItem(room, player, r.b, r.n);
    if (left === r.n) return;
    if (!left) return removeItem(room, r.id, player.id);
    room.ctx.storage.sql.exec("UPDATE items SET n = ? WHERE id = ?", left, r.id);
    room.broadcast(null, { type: "item", item: publicItem({ ...r, n: left }, now) });
  },
};
