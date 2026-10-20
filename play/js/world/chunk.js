// One 16 × 96 × 16 column of the world: its blocks and its light.
import { CHUNK, SY } from "../shared/rules.js";

export const CHUNK_VOLUME = CHUNK * SY * CHUNK;

// Index of a block inside a chunk, from chunk-local coordinates.
export const li = (x, y, z) => x + CHUNK * (z + CHUNK * y);

// A chunk moves through these steps, each needing its neighbours a step
// behind it at most: generated → ready (the server's edits applied) → lit
// → meshed. An edit or new light knocks it back a step.
export class Chunk {
  constructor(cx, cz) {
    this.cx = cx;
    this.cz = cz;
    this.blocks = new Uint8Array(CHUNK_VOLUME);
    this.sky = new Uint8Array(CHUNK_VOLUME); // sky light 0..15
    this.blk = new Uint8Array(CHUNK_VOLUME); // block light 0..15
    this.requested = false; // edits asked of the server
    this.ready = false; // edits applied
    this.lit = false;
    this.meshed = false;
  }
}
