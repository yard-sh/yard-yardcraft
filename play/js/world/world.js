// The loaded part of the world: chunks streamed in and out around the
// player, and block and light lookups in world coordinates. Plain data
// only; game/chunks.js turns the mesh arrays into three.js meshes.
import { SX, SY, SZ, CHUNK } from "../shared/rules.js";
import { AIR, STONE, DEF } from "./blocks.js";
import { Chunk, li } from "./chunk.js";
import { generate } from "./terrain.js";
import { lightChunk } from "./light.js";
import { meshChunk } from "./mesher.js";

const CW = SX / CHUNK, CD = SZ / CHUNK; // chunks across each axis

// Chunks within the load radius of the player's chunk are generated; a chunk
// is lit once its neighbours are loaded and meshed once they are lit, so the
// visible radius is two less. Chunks beyond the radius plus two are dropped.
// The radius is the render distance setting.
export const MIN_LOAD_R = 4, MAX_LOAD_R = 24;
// How far you can see, in blocks, at a load radius.
export const viewBlocks = (loadR) => (loadR - 2) * CHUNK;

// Chunk offsets within a radius, nearest first.
const orders = new Map();
function orderFor(r) {
  if (!orders.has(r)) {
    const order = [];
    for (let dz = -r; dz <= r; dz++) for (let dx = -r; dx <= r; dx++) order.push([dx, dz]);
    order.sort((a, b) => a[0] * a[0] + a[1] * a[1] - (b[0] * b[0] + b[1] * b[1]));
    orders.set(r, order);
  }
  return orders.get(r);
}

export class World {
  constructor(seed, gen, loadR) {
    this.seed = seed;
    this.gen = gen;
    this.chunks = new Map();
    this.frames = 0;
    this.loadR = loadR;
  }

  inBounds(cx, cz) {
    return cx >= 0 && cz >= 0 && cx < CW && cz < CD;
  }

  get(cx, cz) {
    return this.inBounds(cx, cz) ? this.chunks.get(cx * CD + cz) : undefined;
  }

  // The block at a world position: -1 where the chunk isn't loaded, -2
  // beyond the world's edge.
  getBlock(x, y, z) {
    if (x < 0 || z < 0 || x >= SX || z >= SZ) return -2;
    if (y < 0) return STONE;
    if (y >= SY) return AIR;
    const c = this.chunks.get((x >> 4) * CD + (z >> 4));
    return c ? c.blocks[li(x & 15, y, z & 15)] : -1;
  }

  // Sky and block light (0..15) at a world position, for lighting players;
  // full daylight where the light isn't known yet.
  getLight(x, y, z) {
    if (y >= SY) return [15, 0];
    const c = x >= 0 && z >= 0 && x < SX && z < SZ ? this.chunks.get((x >> 4) * CD + (z >> 4)) : null;
    if (!c?.lit || y < 0) return [15, 0];
    const i = li(x & 15, y, z & 15);
    return [c.sky[i], c.blk[i]];
  }

  // Changes a loaded block and invalidates the light within 15 blocks and
  // the meshes that touch it. Returns whether anything changed.
  setBlock(x, y, z, b) {
    if (y < 0 || y >= SY || x < 0 || z < 0 || x >= SX || z >= SZ) return false;
    const c = this.chunks.get((x >> 4) * CD + (z >> 4));
    if (!c) return false;
    const i = li(x & 15, y, z & 15);
    if (c.blocks[i] === b) return false;
    c.blocks[i] = b;
    for (let dz = -1; dz <= 1; dz++)
      for (let dx = -1; dx <= 1; dx++) {
        const n = this.get(c.cx + dx, c.cz + dz);
        if (!n) continue;
        const x0 = n.cx * CHUNK, z0 = n.cz * CHUNK;
        const ddx = Math.max(x0 - x, 0, x - (x0 + CHUNK - 1));
        const ddz = Math.max(z0 - z, 0, z - (z0 + CHUNK - 1));
        if (ddx + ddz <= 15) n.lit = false;
      }
    for (let dz = -1; dz <= 1; dz++)
      for (let dx = -1; dx <= 1; dx++) {
        const n = this.get((x + dx) >> 4, (z + dz) >> 4);
        if (n) n.meshed = false;
      }
    return true;
  }

  // The server's edits for a chunk, in world coordinates.
  applyEdits(cx, cz, edits) {
    const c = this.get(cx, cz);
    if (!c) return;
    for (const [x, y, z, b] of edits) {
      if (x >> 4 !== cx || z >> 4 !== cz || y < 0 || y >= SY || !DEF[b]) continue;
      c.blocks[li(x & 15, y, z & 15)] = b;
    }
    c.ready = true;
    c.lit = false;
    c.meshed = false;
  }

  around(c, ok) {
    for (let dz = -1; dz <= 1; dz++)
      for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dz) continue;
        if (!this.inBounds(c.cx + dx, c.cz + dz)) continue; // the world's edge counts as done
        const n = this.get(c.cx + dx, c.cz + dz);
        if (!n || !ok(n)) return false;
      }
    return true;
  }

  // One streaming step around the player's chunk, nearest chunks first:
  // generate, ask the server for edits, light, mesh; drop far chunks. Heavy
  // work stops once budgetMs is spent, so no frame stalls.
  // hooks: request(chunks) asks for edits; mesh(chunk, arrays) shows a
  // mesh; unload(chunk) drops one.
  update(pcx, pcz, budgetMs, hooks) {
    const t0 = performance.now();
    const spent = () => performance.now() - t0 > budgetMs;
    const want = [];
    for (const [dx, dz] of orderFor(this.loadR)) {
      const cx = pcx + dx, cz = pcz + dz;
      if (!this.inBounds(cx, cz)) continue;
      let c = this.get(cx, cz);
      if (!c) {
        if (spent()) continue;
        c = new Chunk(cx, cz);
        generate(c, this.seed);
        this.chunks.set(cx * CD + cz, c);
      }
      if (!c.requested) want.push(c);
      if (!c.ready) continue;
      if (!c.lit) {
        if (spent() || !this.around(c, (n) => n.ready)) continue;
        const touched = lightChunk(this, c);
        c.lit = true;
        for (let i = 0; i < 9; i++) {
          if (!touched[i]) continue;
          const n = this.get(c.cx + (i % 3) - 1, c.cz + Math.floor(i / 3) - 1);
          if (n) n.meshed = false;
        }
      }
      if (!c.meshed) {
        if (spent() || !this.around(c, (n) => n.lit)) continue;
        hooks.mesh(c, meshChunk(this, c));
        c.meshed = true;
      }
    }
    if (want.length) hooks.request(want);

    if (++this.frames % 30 === 0) {
      for (const c of this.chunks.values()) {
        if (Math.max(Math.abs(c.cx - pcx), Math.abs(c.cz - pcz)) <= this.loadR + 2) continue;
        hooks.unload(c);
        this.chunks.delete(c.cx * CD + c.cz);
      }
    }
  }
}
