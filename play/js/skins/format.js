// Player skins in Minecraft's format: a 64×64 texture laid out exactly like
// Minecraft's (1.8+), so any skin made for it maps onto our player model.
// Older 64×32 skins are converted the way Minecraft converts them.

export const SKIN_SIZE = 64;

// Every box of the player model: its size in pixels (w × h × d) and where
// its base and overlay layers start in the texture. The arms are 3 wide on
// slim (Alex-style) models.
export const PARTS = {
  head: { size: [8, 8, 8], base: [0, 0], over: [32, 0], inflate: 0.5 },
  body: { size: [8, 12, 4], base: [16, 16], over: [16, 32], inflate: 0.25 },
  armR: { size: [4, 12, 4], base: [40, 16], over: [40, 32], inflate: 0.25, arm: true },
  armL: { size: [4, 12, 4], base: [32, 48], over: [48, 48], inflate: 0.25, arm: true },
  legR: { size: [4, 12, 4], base: [0, 16], over: [0, 32], inflate: 0.25 },
  legL: { size: [4, 12, 4], base: [16, 48], over: [0, 48], inflate: 0.25 },
};

export const partSize = (part, slim) => (PARTS[part].arm && slim ? [3, 12, 4] : PARTS[part].size);

// Where each face of a box is in the texture (shared with mob models).
export { boxFaces } from "../core/box-uv.js";

// ---------------------------------------------------------------- loading

export function blankCanvas() {
  const cv = document.createElement("canvas");
  cv.width = cv.height = SKIN_SIZE;
  return cv;
}

// Turns a loaded skin image into a 64×64 canvas, or throws with a reason.
// Returns { canvas, slim } where slim is a guess from the arm's width.
export function normalizeSkin(img) {
  const w = img.naturalWidth ?? img.width, h = img.naturalHeight ?? img.height;
  if (w !== 64 || (h !== 64 && h !== 32)) throw new Error(`Skins are 64×64 or 64×32 pixels; this one is ${w}×${h}.`);
  const cv = blankCanvas();
  const g = cv.getContext("2d", { willReadFrequently: true });
  g.drawImage(img, 0, 0);
  const id = g.getImageData(0, 0, 64, 64);
  const legacy = h === 32;
  // Slim skins leave the last column pair of the right arm's back empty.
  const slim = !legacy && id.data[(20 * 64 + 54) * 4 + 3] === 0;
  if (legacy) convertLegacy(id);
  // The base layer is always opaque, as in Minecraft.
  for (const [x0, y0, x1, y1] of [[0, 0, 32, 16], [0, 16, 64, 32], [16, 48, 48, 64]])
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) id.data[(y * 64 + x) * 4 + 3] = 255;
  g.putImageData(id, 0, 0);
  return { canvas: cv, slim };
}

// 64×32 skins have no left arm or leg: Minecraft mirrors the right ones,
// face by face, into the new bottom half.
function convertLegacy(id) {
  const src = new Uint8ClampedArray(id.data);
  const copy = (x, y, dx, dy, w, h) => {
    for (let j = 0; j < h; j++)
      for (let i = 0; i < w; i++) {
        const s = ((y + j) * 64 + x + i) * 4;
        const d = ((y + dy + j) * 64 + x + dx + (w - 1 - i)) * 4;
        for (let k = 0; k < 4; k++) id.data[d + k] = src[s + k];
      }
  };
  for (const [x, y, dx, dy, w, h] of [
    [4, 16, 16, 32, 4, 4], [8, 16, 16, 32, 4, 4], [0, 20, 24, 32, 4, 12], [4, 20, 16, 32, 4, 12],
    [8, 20, 8, 32, 4, 12], [12, 20, 16, 32, 4, 12], [44, 16, -8, 32, 4, 4], [48, 16, -8, 32, 4, 4],
    [40, 20, 0, 32, 4, 12], [44, 20, -8, 32, 4, 12], [48, 20, -16, 32, 4, 12], [52, 20, -8, 32, 4, 12],
  ])
    copy(x, y, dx, dy, w, h);
  // An all-opaque hat layer in old skins was meant as no hat.
  let solid = true;
  for (let y = 0; y < 16 && solid; y++) for (let x = 32; x < 64; x++) if (src[(y * 64 + x) * 4 + 3] < 128) { solid = false; break; }
  if (solid) for (let y = 0; y < 16; y++) for (let x = 32; x < 64; x++) id.data[(y * 64 + x) * 4 + 3] = 0;
}

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("That file isn't an image this browser can read."));
    img.src = src;
  });
}

// The face (head front plus hat) at 8×8, for menus and the player list.
export function faceIcon(skin, size = 32) {
  const cv = document.createElement("canvas");
  cv.width = cv.height = size;
  const g = cv.getContext("2d");
  g.imageSmoothingEnabled = false;
  g.drawImage(skin, 8, 8, 8, 8, 0, 0, size, size);
  g.drawImage(skin, 40, 8, 8, 8, 0, 0, size, size);
  return cv;
}
