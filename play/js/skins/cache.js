// Skin textures by key ("preset:<id>" or "custom:<id>"), shared by every
// model wearing them. An uploaded skin shows a preset until its PNG arrives.
import { pixelTexture } from "../render/textures.js";
import { SKIN_SIZE, normalizeSkin, loadImage } from "./format.js";
import { presetSkin } from "./presets.js";

const skins = new Map(); // key -> { canvas, texture }
const listeners = [];

// Calls fn whenever a skin's pixels change (an upload finished loading).
export function onSkinChange(fn) {
  listeners.push(fn);
}

export const hasSkin = (key) => skins.has(key);

export function skinEntry(key) {
  let e = skins.get(key);
  if (e) return e;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = SKIN_SIZE;
  e = { canvas, texture: pixelTexture(canvas) };
  skins.set(key, e);
  if (key.startsWith("custom:")) {
    canvas.getContext("2d").drawImage(presetSkin("wanderer"), 0, 0);
    loadImage(`skins/${key.slice(7)}.png`)
      .then((img) => setSkin(key, normalizeSkin(img).canvas))
      .catch(() => {});
  } else {
    canvas.getContext("2d").drawImage(presetSkin(key.slice(7)), 0, 0);
  }
  return e;
}

// Replaces a skin's pixels; every model wearing it updates.
export function setSkin(key, src) {
  const e = skinEntry(key);
  const g = e.canvas.getContext("2d");
  g.clearRect(0, 0, SKIN_SIZE, SKIN_SIZE);
  g.drawImage(src, 0, 0);
  e.texture.needsUpdate = true;
  for (const fn of listeners) fn(key);
}
