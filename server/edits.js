// The world's record (seed, generation, clock) and the block edits made on
// top of its terrain, stored per chunk so clients fetch only the chunks
// around them.
import { SX, SY, SZ, CHUNK, CHUNKS_PER_REQUEST } from "../play/js/shared/rules.js";
import { AIR, WATER, canSet } from "../play/js/world/blocks.js";
import { dropOf, removeFrom, HOTBAR_SLOTS } from "../play/js/shared/inventory.js";
import { blockAt } from "./terrain.js";
import { stateOf, saveState } from "./inventory.js";
import { spawnItem, itemsIn, clearItems } from "./items.js";
import { noticeEdit, clearMobs } from "./mobs/index.js";

export function setupStorage(room) {
  const sql = room.ctx.storage.sql;
  sql.exec("CREATE TABLE IF NOT EXISTS edits (cx INTEGER, cz INTEGER, x INTEGER, y INTEGER, z INTEGER, b INTEGER, PRIMARY KEY (x, y, z))");
  sql.exec("CREATE INDEX IF NOT EXISTS edits_chunk ON edits (cx, cz)");
}

// The world record { seed, gen, timeOffset }, created on first use. v1 kept a
// small world in a blocks table and a seed key; the big world starts fresh
// without them.
export async function worldRecord(room) {
  const storage = room.ctx.storage;
  let world = await storage.get("world");
  if (!world) {
    storage.sql.exec("DROP TABLE IF EXISTS blocks");
    await storage.delete("seed");
    world = { seed: Math.floor(Math.random() * 2 ** 31), gen: 1, timeOffset: 0 };
    await storage.put("world", world);
  }
  return world;
}

export async function saveWorldRecord(room, world) {
  await room.ctx.storage.put("world", world);
}

// A new world: a new seed, every edit gone. gen goes up so clients ignore
// chunk data still on its way from the old one.
export async function restartWorld(room, seed) {
  const world = await worldRecord(room);
  world.seed = seed;
  world.gen += 1;
  room.ctx.storage.sql.exec("DELETE FROM edits");
  clearItems(room);
  clearMobs(room);
  room.terrain = null;
  await saveWorldRecord(room, world);
  return world;
}

export const worldMessages = {
  // The edits and items in each chunk asked for, one message per chunk.
  async chunks(room, ws, player, msg) {
    if (!Array.isArray(msg.list)) return;
    const { gen } = await worldRecord(room);
    for (const c of msg.list.slice(0, CHUNKS_PER_REQUEST)) {
      if (!Array.isArray(c)) continue;
      const [cx, cz] = c;
      if (![cx, cz].every(Number.isInteger) || cx < 0 || cz < 0 || cx >= SX / CHUNK || cz >= SZ / CHUNK) continue;
      const edits = room.ctx.storage.sql
        .exec("SELECT x, y, z, b FROM edits WHERE cx = ? AND cz = ?", cx, cz)
        .toArray()
        .map((r) => [r.x, r.y, r.z, r.b]);
      room.send(ws, { type: "chunkdata", gen, cx, cz, edits, items: itemsIn(room, cx, cz) });
    }
  },

  // A block broken (b is air) or placed from hotbar slot `slot`. The bottom
  // layer can't be changed. In survival, breaking drops the block and
  // placing uses one up; a refused change is undone on the sender's screen.
  async set(room, ws, player, { x, y, z, b, slot }) {
    if (![x, y, z, b].every(Number.isInteger)) return;
    if (x < 0 || y < 1 || z < 0 || x >= SX || y >= SY || z >= SZ || !canSet(b) || player.dead) return;
    const old = await blockAt(room, x, y, z);
    const state = stateOf(room, player);
    const survival = state.mode === "survival";
    const undo = () => room.send(ws, { type: "set", x, y, z, b: old, undo: true });
    if (b === AIR) {
      if (old === AIR || old === WATER) return undo();
      const drop = dropOf(old);
      if (survival && drop !== AIR) {
        const a = Math.random() * Math.PI * 2;
        spawnItem(room, drop, 1, [x + 0.5, y + 0.25, z + 0.5], [Math.cos(a) * 1.2, 3, Math.sin(a) * 1.2]);
      }
    } else {
      if (old !== AIR && old !== WATER) return undo();
      if (survival) {
        const ok = Number.isInteger(slot) && slot >= 0 && slot < HOTBAR_SLOTS && state.slots[slot]?.[0] === b;
        if (!ok) {
          saveState(room, player); // puts their hotbar right too
          return undo();
        }
        removeFrom(state, slot, 1);
        saveState(room, player);
      }
    }
    room.ctx.storage.sql.exec(
      "INSERT INTO edits (cx, cz, x, y, z, b) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT (x, y, z) DO UPDATE SET b = excluded.b",
      Math.floor(x / CHUNK), Math.floor(z / CHUNK), x, y, z, b,
    );
    room.broadcast(null, { type: "set", x, y, z, b });
    await noticeEdit(room, x, y, z);
  },
};
