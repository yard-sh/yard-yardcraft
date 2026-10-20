// Everything painted pixel by pixel at start-up: the block atlas, the crack
// overlays, the clouds, the sun and moon. No image files to load.
import * as THREE from "three";
import { T, ATLAS_TILES } from "../world/blocks.js";
import { mulberry32, valueNoise } from "../core/noise.js";

// A crisp, unfiltered texture from a canvas, for pixel art.
export function pixelTexture(canvas) {
  const tex = new THREE.CanvasTexture(canvas);
  tex.magFilter = tex.minFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// ---------------------------------------------------------------- blocks

// Paints every block texture into one canvas, 16 px per tile.
export function paintAtlas() {
  const S = 16;
  const cv = document.createElement("canvas");
  cv.width = cv.height = S * ATLAS_TILES;
  const g = cv.getContext("2d");
  const img = g.createImageData(cv.width, cv.height);
  const rnd = mulberry32(20261006);
  const tint = (c, k) => [c[0] * k, c[1] * k, c[2] * k, c[3] ?? 255];
  const speck = (c, amt) => tint(c, 1 - amt + rnd() * amt * 2);
  const paint = (tile, fn) => {
    const ox = (tile % ATLAS_TILES) * S, oy = Math.floor(tile / ATLAS_TILES) * S;
    for (let y = 0; y < S; y++)
      for (let x = 0; x < S; x++) {
        const c = fn(x, y);
        const i = ((oy + y) * cv.width + ox + x) * 4;
        img.data[i] = c[0];
        img.data[i + 1] = c[1];
        img.data[i + 2] = c[2];
        img.data[i + 3] = c[3] ?? 255;
      }
  };

  const grassC = [96, 158, 54], dirtC = [134, 96, 67], stoneC = [126, 126, 128];
  const barkC = [102, 80, 48], plankC = [182, 144, 90], brickC = [152, 70, 56];
  const edge = (x, y) => x === 0 || y === 0 || x === S - 1 || y === S - 1;
  const dirt = () => {
    const r = rnd();
    if (r < 0.08) return speck(tint(dirtC, 0.7), 0.1);
    if (r < 0.14) return speck(tint(dirtC, 1.18), 0.1);
    return speck(dirtC, 0.1);
  };

  paint(T.grassTop, () => {
    const c = speck(grassC, 0.16);
    return rnd() < 0.12 ? tint(c, 0.8) : c;
  });
  const fringe = Array.from({ length: S }, () => 2 + Math.floor(rnd() * 3));
  paint(T.grassSide, (x, y) => {
    if (y < fringe[x]) return speck(grassC, 0.14);
    if (y === fringe[x] && rnd() < 0.5) return speck(tint(grassC, 0.75), 0.1);
    return dirt();
  });
  paint(T.dirt, dirt);
  paint(T.stone, () => {
    const r = rnd();
    if (r < 0.12) return speck(tint(stoneC, 0.8), 0.05);
    if (r < 0.18) return speck(tint(stoneC, 1.14), 0.05);
    return speck(stoneC, 0.07);
  });
  paint(T.sand, () => (rnd() < 0.1 ? speck([200, 186, 140], 0.05) : speck([222, 210, 160], 0.05)));
  const bark = Array.from({ length: S }, () => 0.82 + rnd() * 0.28);
  paint(T.logSide, (x) => {
    const c = speck(tint(barkC, bark[x]), 0.08);
    return x % 5 === 2 && rnd() < 0.6 ? tint(c, 0.75) : c;
  });
  paint(T.logTop, (x, y) => {
    const d = Math.max(Math.abs(x - 7.5), Math.abs(y - 7.5));
    if (d > 6.5) return speck(barkC, 0.08);
    return speck(Math.floor(d) % 2 ? [176, 140, 88] : [150, 116, 70], 0.06);
  });
  paint(T.leaves, () => {
    if (rnd() < 0.2) return [0, 0, 0, 0];
    const c = speck([58, 128, 40], 0.2);
    return rnd() < 0.2 ? tint(c, 0.72) : c;
  });
  paint(T.planks, (x, y) => {
    const row = y >> 2;
    if (y % 4 === 3) return speck(tint(plankC, 0.6), 0.05);
    if (x === (row % 2 ? 4 : 12)) return speck(tint(plankC, 0.7), 0.05);
    return speck(tint(plankC, 0.92 + (row % 2) * 0.08), 0.06);
  });
  paint(T.brick, (x, y) => {
    const off = (y >> 2) % 2 ? 4 : 0;
    if (y % 4 === 3 || (x + off) % 8 === 7) return speck([184, 178, 168], 0.05);
    return speck(brickC, 0.12);
  });
  paint(T.glass, (x, y) => {
    if (edge(x, y)) return [214, 234, 240, 255];
    const streak = (x - y === 4 && x >= 6 && x <= 10) || (x - y === 7 && x >= 10 && x <= 12);
    return streak ? [238, 246, 250, 255] : [0, 0, 0, 0];
  });
  paint(T.lamp, (x, y) => {
    if (edge(x, y)) return speck([176, 120, 50], 0.1);
    return rnd() < 0.25 ? speck([255, 242, 186], 0.04) : speck([250, 204, 110], 0.1);
  });
  paint(T.water, () => (rnd() < 0.1 ? [96, 146, 232, 175] : [...speck([50, 96, 204], 0.08).slice(0, 3), 175]));

  // Items that aren't blocks: drawn on a clear background, as sprites.
  // A strawberry: a red berry narrowing to a point, with yellow seeds, a
  // darker outline and a crown of green leaves.
  const berryHalf = (y) => (y < 4 || y > 14 ? 0 : 5.6 - 5 * ((y - 4) / 10) ** 1.6);
  paint(T.strawberry, (x, y) => {
    const dx = Math.abs(x + 0.5 - 8);
    const leafHalf = [0.6, 0.6, 2.5, 5, 4][y] ?? 0;
    if (dx < leafHalf) return y < 2 ? [58, 110, 38, 255] : speck([86, 160, 58], 0.12);
    const half = berryHalf(y);
    if (dx >= half) return [0, 0, 0, 0];
    if (dx >= half - 1 || y === 14) return speck([140, 22, 34], 0.05);
    return (x * 3 + y * 2) % 7 === 0 ? [248, 222, 120, 255] : speck([218, 40, 54], 0.08);
  });

  g.putImageData(img, 0, 0);
  return cv;
}

// One tile of the atlas as a 16×16 canvas, for icons.
export function tileIcon(atlas, tile) {
  const icon = document.createElement("canvas");
  icon.width = icon.height = 16;
  const x = (tile % ATLAS_TILES) * 16, y = Math.floor(tile / ATLAS_TILES) * 16;
  icon.getContext("2d").drawImage(atlas, x, y, 16, 16, 0, 0, 16, 16);
  return icon;
}

// Ten 16×16 crack overlays, one per stage of breaking a block, drawn the
// way Minecraft's are: one-pixel jagged cracks that run from near the middle
// out to the edges, sprout side branches, and fill in with fine hairline
// cracks until the block is a web. Every crack pixel is ranked by when it
// appears, and each stage shows a growing share of them.
export const CRACK_STAGES = 10;
export function paintCracks() {
  const S = 16;
  const rnd = mulberry32(4242);
  const DIRS = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
  const born = new Float32Array(S * S).fill(Infinity);
  const depthOf = new Uint8Array(S * S);
  const pixels = [];

  // Walks a crack in pixel steps, wobbling at most 45° off its heading, and
  // sometimes forks a shorter branch off to the side.
  function crack(x, y, dir, t0, len, depth) {
    let d = dir;
    for (let step = 1; step <= len; step++) {
      if (rnd() < 0.4) d = (dir + (rnd() < 0.5 ? 1 : 7)) % 8;
      else if (rnd() < 0.5) d = dir;
      x += DIRS[d][0];
      y += DIRS[d][1];
      if (x < 0 || y < 0 || x >= S || y >= S) return;
      const i = x + S * y, t = t0 + step;
      if (t < born[i]) {
        if (born[i] === Infinity) pixels.push(i);
        born[i] = t;
        depthOf[i] = depth;
      }
      if (depth < 2 && rnd() < 0.16) {
        const turn = rnd() < 0.5 ? 2 : 6; // 90° either way
        crack(x, y, (dir + turn + (rnd() < 0.5 ? 0 : rnd() < 0.5 ? 1 : 7)) % 8, t, 3 + Math.floor(rnd() * 4), depth + 1);
      }
    }
  }

  // Main cracks: five headings, spread out, from a point near the middle.
  const cx = 7 + Math.floor(rnd() * 2), cy = 7 + Math.floor(rnd() * 2);
  born[cx + S * cy] = 0;
  pixels.push(cx + S * cy);
  const start = Math.floor(rnd() * 8);
  for (const k of [0, 2, 3, 5, 6]) crack(cx, cy, (start + k) % 8, 0, 12, 0);
  // Hairline cracks off existing ones, appearing last.
  const late = Math.max(...pixels.map((i) => born[i])) + 1;
  for (let n = 0; n < 12; n++) {
    const from = pixels[Math.floor(rnd() * pixels.length)];
    crack(from % S, Math.floor(from / S), Math.floor(rnd() * 8), late + rnd() * 6, 2 + Math.floor(rnd() * 3), 2);
  }

  // Earliest first; stage n shows ((n + 1) / 10)^1.4 of them, so the first
  // cracks are small and the last stages fill in fast.
  const order = [...pixels].sort((a, b) => born[a] - born[b]);
  return Array.from({ length: CRACK_STAGES }, (_, stage) => {
    const cv = document.createElement("canvas");
    cv.width = cv.height = S;
    const g = cv.getContext("2d");
    const img = g.createImageData(S, S);
    const shown = Math.ceil(order.length * ((stage + 1) / CRACK_STAGES) ** 1.4);
    for (const i of order.slice(0, shown)) img.data[i * 4 + 3] = depthOf[i] < 2 ? 125 : 85;
    g.putImageData(img, 0, 0);
    return cv;
  });
}

// ---------------------------------------------------------------- sky

// Blocky clouds that tile seamlessly.
export function paintClouds() {
  const S = 64;
  const cv = document.createElement("canvas");
  cv.width = cv.height = S;
  const g = cv.getContext("2d");
  const img = g.createImageData(S, S);
  for (let y = 0; y < S; y++)
    for (let x = 0; x < S; x++) {
      const n = valueNoise(99, x / 8, y / 8, 8) * 0.7 + valueNoise(98, x / 4, y / 4, 16) * 0.3;
      const i = (y * S + x) * 4;
      img.data.fill(255, i, i + 3);
      img.data[i + 3] = n > 0.58 ? 225 : 0;
    }
  g.putImageData(img, 0, 0);
  return cv;
}

// A square sun or moon: a bright middle in a softer rim.
export function discTexture(inner, outer) {
  const cv = document.createElement("canvas");
  cv.width = cv.height = 32;
  const g = cv.getContext("2d");
  g.fillStyle = outer;
  g.fillRect(4, 4, 24, 24);
  g.fillStyle = inner;
  g.fillRect(8, 8, 16, 16);
  return pixelTexture(cv);
}
