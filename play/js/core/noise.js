// Seeded randomness and noise, shared by the terrain, textures, skins and sounds.

export function mulberry32(a) {
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hash(seed, x, z) {
  let h = (seed ^ Math.imul(x, 374761393) ^ Math.imul(z, 668265263)) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

// Smooth 2D value noise; with a period it tiles.
export function valueNoise(seed, x, z, period = 0) {
  const wrap = (v) => (period ? ((v % period) + period) % period : v);
  const x0 = Math.floor(x), z0 = Math.floor(z);
  const fx = x - x0, fz = z - z0;
  const sx = fx * fx * (3 - 2 * fx), sz = fz * fz * (3 - 2 * fz);
  const a = hash(seed, wrap(x0), wrap(z0)), b = hash(seed, wrap(x0 + 1), wrap(z0));
  const c = hash(seed, wrap(x0), wrap(z0 + 1)), d = hash(seed, wrap(x0 + 1), wrap(z0 + 1));
  return a + (b - a) * sx + (c - a) * sz + (a - b - c + d) * sx * sz;
}
