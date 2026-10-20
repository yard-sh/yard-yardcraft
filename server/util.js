// Small helpers for the server.

// A number from v, kept within lo..hi; lo when v isn't a number.
export function clamp(v, lo, hi) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : lo;
}

// A stable hash of a string.
export function hashString(s) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

// A player's name colour, the same every time for the same user.
export const colorFor = (key) => `hsl(${hashString(key) % 360}, 70%, 55%)`;

export function fromBase64(text) {
  const bin = atob(text);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export function toBase64(bytes) {
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}
