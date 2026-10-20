// Options, remembered in this browser. Change them with setSetting(); any
// module that cares reacts through watchSetting().
import { MIN_LOAD_R, MAX_LOAD_R } from "../world/world.js";

const KEY = "yardcraft.settings";

// Phones and tablets get lighter defaults: no shadows, a shorter render
// distance and auto-jump.

// Shadow map sizes the options offer (pixels per side; bigger is sharper and
// slower). render/sky.js drops any the GPU can't do.
export const COARSE = matchMedia("(pointer: coarse)").matches;
export const SHADOW_SIZES = [1024, 2048, 4096, 8192];

export const settings = {
  sens: 100, // look sensitivity, %
  volume: 100, // %
  fov: 75,
  distance: COARSE ? 6 : 9, // render distance in chunks
  view: 0, // 0 first person, 1 behind, 2 in front
  shadows: !COARSE,
  shadowRes: 2048, // shadow map size, one of SHADOW_SIZES
  invert: false,
  hand: true,
  autoJump: COARSE,
};

// Storage can be unavailable (private windows, blocked site data).
try {
  Object.assign(settings, JSON.parse(localStorage.getItem(KEY) ?? "{}"));
} catch {}
settings.distance = Math.max(MIN_LOAD_R, Math.min(MAX_LOAD_R, Math.round(settings.distance) || 9));
if (!SHADOW_SIZES.includes(settings.shadowRes)) settings.shadowRes = 2048;

const watchers = []; // [key or "*", fn]

// Calls fn(value) whenever setting key changes; "*" hears every change.
export function watchSetting(key, fn) {
  watchers.push([key, fn]);
}

export function setSetting(key, value) {
  settings[key] = value;
  try {
    localStorage.setItem(KEY, JSON.stringify(settings));
  } catch {}
  for (const [k, fn] of watchers) if (k === key || k === "*") fn(value, key);
}
