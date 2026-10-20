// The real block anywhere in the world: the stored edit there, else the
// generated terrain. Generation is the client's own code (it's deterministic),
// so the server knows what was broken without trusting the client.
import { SX, SY, SZ, CHUNK } from "../play/js/shared/rules.js";
import { AIR, STONE } from "../play/js/world/blocks.js";
import { Chunk, li } from "../play/js/world/chunk.js";
import { generate } from "../play/js/world/terrain.js";
import { worldRecord } from "./edits.js";

const CACHE = 64; // generated chunks kept per room (about 1.5 MB)

export async function blockAt(room, x, y, z) {
  if (x < 0 || z < 0 || x >= SX || z >= SZ || y >= SY) return AIR;
  if (y < 0) return STONE;
  const edit = room.ctx.storage.sql.exec("SELECT b FROM edits WHERE x = ? AND y = ? AND z = ?", x, y, z).toArray()[0];
  if (edit) return edit.b;
  const { seed } = await worldRecord(room);
  return terrainChunk(room, seed, x >> 4, z >> 4).blocks[li(x & 15, y, z & 15)];
}

// A fast, synchronous block lookup for work that reads many blocks at once
// (mobs finding their way). Each chunk's edits are read once per reader,
// so make a new one for each piece of work: it doesn't see later edits.
export function terrainReader(room, seed) {
  const edits = new Map(); // "cx,cz" -> Map("x,y,z" -> b)
  const editsIn = (cx, cz) => {
    const key = `${cx},${cz}`;
    let m = edits.get(key);
    if (!m) {
      m = new Map();
      for (const r of room.ctx.storage.sql.exec("SELECT x, y, z, b FROM edits WHERE cx = ? AND cz = ?", cx, cz))
        m.set(`${r.x},${r.y},${r.z}`, r.b);
      edits.set(key, m);
    }
    return m;
  };
  const at = (x, y, z) => {
    if (x < 0 || z < 0 || x >= SX || z >= SZ || y >= SY) return AIR;
    if (y < 0) return STONE;
    const cx = Math.floor(x / CHUNK), cz = Math.floor(z / CHUNK);
    const edit = editsIn(cx, cz).get(`${x},${y},${z}`);
    if (edit !== undefined) return edit;
    return terrainChunk(room, seed, cx, cz).blocks[li(x & 15, y, z & 15)];
  };
  return {
    at,
    // The highest block in a column that isn't air, as [y, block]; null if
    // there's none.
    top(x, z) {
      for (let y = SY - 1; y >= 0; y--) {
        const b = at(x, y, z);
        if (b !== AIR) return [y, b];
      }
      return null;
    },
  };
}

function terrainChunk(room, seed, cx, cz) {
  room.terrain ??= new Map(); // key -> Chunk, oldest first
  const key = `${seed}:${cx}:${cz}`;
  let c = room.terrain.get(key);
  if (c) {
    room.terrain.delete(key); // most recently used goes last
  } else {
    c = new Chunk(cx, cz);
    generate(c, seed);
    if (room.terrain.size >= CACHE) room.terrain.delete(room.terrain.keys().next().value);
  }
  room.terrain.set(key, c);
  return c;
}
