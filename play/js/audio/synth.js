// Sound synthesis: block sounds built from filtered noise bursts ("grains")
// and damped tones rather than recorded. Like Minecraft, each material has a
// few variants of one short sound; audio/sounds.js plays them.
import { mulberry32 } from "../core/noise.js";

export const MATERIALS = [
  "grass", "gravel", "sand", "stone", "wood", "leaves", "glass", "shatter", "hurt", "pop", "hum", "hup", "crunch", "burp",
];
export const VARIANTS = 4;
const LENGTH = 0.4; // seconds

// RBJ biquad coefficients.
function biquad(type, f, q, sr) {
  const w = (2 * Math.PI * Math.min(f, sr * 0.45)) / sr;
  const cos = Math.cos(w), alpha = Math.sin(w) / (2 * q);
  let b0, b1, b2;
  if (type === "lowpass") (b0 = (1 - cos) / 2), (b1 = 1 - cos), (b2 = b0);
  else if (type === "highpass") (b0 = (1 + cos) / 2), (b1 = -(1 + cos)), (b2 = b0);
  else (b0 = alpha), (b1 = 0), (b2 = -alpha); // band-pass, 0 dB at the peak
  const a0 = 1 + alpha;
  return [b0 / a0, b1 / a0, b2 / a0, (-2 * cos) / a0, (1 - alpha) / a0];
}

// Adds one burst of filtered noise to out: it starts at `at` seconds, its
// noise lasts `len` and fades with time constant `decay`; the filter can ring
// on after it, which gives hard materials their click.
function grain(out, sr, rnd, { at, len, decay, f, q = 1, type = "bandpass", amp, attack = 0.0025 }) {
  const [b0, b1, b2, a1, a2] = biquad(type, f, q, sr);
  const start = Math.floor(at * sr);
  const n = Math.min(out.length - start, Math.floor((len + decay * 6) * sr));
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < n; i++) {
    const t = i / sr;
    const env = (t < attack ? t / attack : 1) * (t < len ? 1 : Math.exp(-(t - len) / decay));
    const x = (rnd() * 2 - 1) * env;
    const y = b0 * x + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
    (x2 = x1), (x1 = x), (y2 = y1), (y1 = y);
    out[start + i] += y * amp;
  }
}

// Adds a damped sine: the ring of wood or glass.
function tone(out, sr, { at, f, decay, amp }) {
  const start = Math.floor(at * sr);
  const n = Math.min(out.length - start, Math.floor(decay * 7 * sr));
  for (let i = 0; i < n; i++) {
    const t = i / sr;
    out[start + i] += Math.sin(2 * Math.PI * f * t) * Math.exp(-t / decay) * Math.min(1, t / 0.002) * amp;
  }
}

const between = (rnd, a, b) => a + (b - a) * rnd();

// Each material as grains and tones. Times cluster early (rnd() ** k), the
// way a foot or a pick lands and the material settles.
const RECIPES = {
  // Soft crunch: many tiny bright crackles over a dull thump.
  grass(out, sr, r) {
    grain(out, sr, r, { at: 0, len: 0.03, decay: 0.025, f: 320, type: "lowpass", q: 0.7, amp: 0.7 });
    for (let i = 0, n = between(r, 12, 18); i < n; i++)
      grain(out, sr, r, {
        at: 0.16 * r() ** 1.7, len: between(r, 0.002, 0.007), decay: between(r, 0.003, 0.008),
        f: between(r, 1300, 4200), q: between(r, 0.7, 1.2), amp: between(r, 0.2, 0.45),
      });
  },
  // Dirt sounds like loose gravel: lower, grittier crunches.
  gravel(out, sr, r) {
    grain(out, sr, r, { at: 0, len: 0.02, decay: 0.025, f: 240, type: "lowpass", q: 0.8, amp: 0.8 });
    for (let i = 0, n = between(r, 18, 26); i < n; i++)
      grain(out, sr, r, {
        at: 0.17 * r() ** 1.5, len: between(r, 0.003, 0.012), decay: between(r, 0.004, 0.012),
        f: between(r, 500, 2000), q: between(r, 0.9, 1.6), amp: between(r, 0.3, 0.6),
      });
  },
  // A soft hiss with a little grit.
  sand(out, sr, r) {
    grain(out, sr, r, { at: 0, len: 0.035, decay: 0.025, f: between(r, 1600, 2400), q: 0.6, amp: 0.4, attack: 0.012 });
    grain(out, sr, r, { at: 0, len: 0.02, decay: 0.03, f: 200, type: "lowpass", q: 0.7, amp: 0.35 });
    for (let i = 0, n = between(r, 8, 13); i < n; i++)
      grain(out, sr, r, {
        at: 0.1 * r() ** 1.4, len: between(r, 0.004, 0.012), decay: between(r, 0.005, 0.012),
        f: between(r, 1000, 3200), q: between(r, 0.7, 1.1), amp: between(r, 0.12, 0.28),
      });
  },
  // Hard and short: a few ringing ticks on a solid knock, then grit.
  stone(out, sr, r) {
    grain(out, sr, r, { at: 0, len: 0.004, decay: 0.018, f: between(r, 260, 420), q: 2, amp: 1.2 });
    for (let i = 0, n = between(r, 3, 6); i < n; i++)
      grain(out, sr, r, {
        at: 0.025 * r() ** 2, len: between(r, 0.001, 0.003), decay: between(r, 0.003, 0.007),
        f: between(r, 1100, 2800), q: between(r, 1.8, 3), amp: between(r, 0.4, 0.75),
      });
    for (let i = 0, n = between(r, 4, 8); i < n; i++)
      grain(out, sr, r, {
        at: between(r, 0.02, 0.12), len: 0.002, decay: between(r, 0.003, 0.006),
        f: between(r, 700, 2000), q: 1.5, amp: between(r, 0.1, 0.2),
      });
  },
  // A hollow knock: a few damped resonances and a click.
  wood(out, sr, r) {
    const f0 = between(r, 170, 300);
    tone(out, sr, { at: 0, f: f0, decay: 0.022, amp: 0.45 });
    tone(out, sr, { at: 0, f: f0 * 2.65, decay: 0.014, amp: 0.3 });
    tone(out, sr, { at: 0, f: f0 * 4.9, decay: 0.01, amp: 0.18 });
    grain(out, sr, r, { at: 0, len: 0.002, decay: 0.004, f: between(r, 1000, 1800), q: 1, amp: 0.45 });
    grain(out, sr, r, { at: 0, len: 0.01, decay: 0.02, f: f0 * 1.5, q: 1.5, amp: 0.5 });
    for (let i = 0, n = between(r, 3, 6); i < n; i++)
      grain(out, sr, r, {
        at: between(r, 0.01, 0.08), len: 0.003, decay: 0.006, f: between(r, 700, 1600), q: 2, amp: between(r, 0.1, 0.2),
      });
  },
  // A light rustle: lots of faint, high crackles, spread out.
  leaves(out, sr, r) {
    for (let i = 0, n = between(r, 22, 32); i < n; i++)
      grain(out, sr, r, {
        at: 0.2 * r() ** 1.3, len: between(r, 0.003, 0.012), decay: between(r, 0.004, 0.012),
        f: between(r, 1800, 5000), q: between(r, 0.6, 1.1), amp: between(r, 0.12, 0.32),
      });
    grain(out, sr, r, { at: 0, len: 0.04, decay: 0.04, f: 2600, q: 0.5, amp: 0.15, attack: 0.015 });
  },
  // Stepping on or tapping glass: a bright, glassy tick.
  glass(out, sr, r) {
    grain(out, sr, r, { at: 0, len: 0.003, decay: 0.012, f: between(r, 300, 450), q: 2, amp: 0.8 });
    grain(out, sr, r, { at: 0, len: 0.002, decay: 0.004, f: 2200, q: 1, amp: 0.35 });
    for (let i = 0, n = between(r, 2, 4); i < n; i++)
      tone(out, sr, { at: 0.012 * r(), f: between(r, 2600, 4800), decay: between(r, 0.008, 0.02), amp: between(r, 0.15, 0.3) });
  },
  // Breaking glass: a crack, then shards ringing as they fall.
  shatter(out, sr, r) {
    grain(out, sr, r, { at: 0, len: 0.01, decay: 0.02, f: 1800, q: 0.8, amp: 0.9 });
    grain(out, sr, r, { at: 0, len: 0.005, decay: 0.02, f: 300, type: "lowpass", amp: 0.6 });
    for (let i = 0, n = between(r, 28, 38); i < n; i++)
      grain(out, sr, r, {
        at: 0.3 * r() ** 2, len: between(r, 0.001, 0.004), decay: between(r, 0.01, 0.035),
        f: between(r, 1800, 6000), q: between(r, 3, 7), amp: between(r, 0.18, 0.45),
      });
    for (let i = 0, n = between(r, 6, 10); i < n; i++)
      tone(out, sr, { at: 0.2 * r() ** 2, f: between(r, 2000, 5000), decay: between(r, 0.015, 0.05), amp: between(r, 0.05, 0.12) });
  },
};

// A player getting hurt: a short "oof", a buzzy voice gliding down in pitch
// through the resonances of an "oo" vowel, with a puff of breath at the end.
RECIPES.hurt = (out, sr, r) => {
  const n = Math.floor(0.22 * sr);
  const voice = new Float32Array(n);
  const f0 = between(r, 150, 200);
  let phase = 0;
  for (let i = 0; i < n; i++) {
    const t = i / sr;
    phase += (f0 * (1 - 0.35 * Math.min(1, t / 0.18))) / sr;
    const env = Math.min(1, t / 0.012) * Math.exp(-Math.max(0, t - 0.05) / 0.05);
    voice[i] = ((phase % 1) * 2 - 1) * env;
  }
  for (const [f, q, amp] of [[360, 4, 1], [820, 5, 0.45], [2400, 6, 0.08]]) {
    const [b0, b1, b2, a1, a2] = biquad("bandpass", f, q, sr);
    let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
    for (let i = 0; i < n; i++) {
      const x = voice[i];
      const y = b0 * x + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
      (x2 = x1), (x1 = x), (y2 = y1), (y1 = y);
      out[i] += y * amp;
    }
  }
  grain(out, sr, r, { at: 0.09, len: 0.04, decay: 0.03, f: 1400, q: 0.7, amp: 0.05, attack: 0.02 });
};

// Picking up an item: a soft, quick "pop" that rises in pitch, like a
// bubble bursting.
RECIPES.pop = (out, sr, r) => {
  const n = Math.floor(0.07 * sr);
  const f0 = between(r, 420, 520);
  let phase = 0;
  for (let i = 0; i < n; i++) {
    const t = i / sr;
    phase += (f0 * (1 + 1.8 * (t / 0.07))) / sr;
    out[i] += Math.sin(2 * Math.PI * phase) * Math.min(1, t / 0.003) * Math.exp(-t / 0.018);
  }
};

// A voice: a buzzy pulse at pitch f0(t) (Hz, t in seconds) shaped by
// env(t), through a few formant resonances [f, q, amp] that make it sound
// like a vowel. rough adds a growl (the pulse jitters).
function voice(out, sr, r, { len, f0, env, formants, rough = 0 }) {
  const n = Math.floor(len * sr);
  const src = new Float32Array(n);
  let phase = 0;
  for (let i = 0; i < n; i++) {
    const t = i / sr;
    phase += (f0(t) * (1 + (r() * 2 - 1) * rough)) / sr;
    src[i] = ((phase % 1) * 2 - 1) * env(t);
  }
  for (const [f, q, amp] of formants) {
    const [b0, b1, b2, a1, a2] = biquad("bandpass", f, q, sr);
    let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
    for (let i = 0; i < n; i++) {
      const x = src[i];
      const y = b0 * x + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
      (x2 = x1), (x1 = x), (y2 = y1), (y1 = y);
      out[i] += y * amp;
    }
  }
}

// A gnome humming to itself: a soft, wavering little tune of three notes.
RECIPES.hum = (out, sr, r) => {
  const base = between(r, 300, 360);
  const notes = [1, between(r, 1.1, 1.26), between(r, 0.88, 1)];
  voice(out, sr, r, {
    len: 0.38,
    f0: (t) => base * notes[Math.min(2, Math.floor(t / 0.125))] * (1 + 0.015 * Math.sin(t * 40)),
    env: (t) => Math.min(1, t / 0.03) * Math.exp(-Math.max(0, t - 0.28) / 0.04) * (0.7 + 0.3 * Math.cos(((t % 0.125) / 0.125) * Math.PI * 2)),
    formants: [[420, 3, 1], [900, 5, 0.25]],
  });
};

// A gnome hit: a squeaky, startled "hup!" that jumps up in pitch.
RECIPES.hup = (out, sr, r) => {
  const f = between(r, 520, 640);
  voice(out, sr, r, {
    len: 0.2,
    f0: (t) => f * (1 + 0.7 * Math.min(1, t / 0.05) - 0.3 * Math.max(0, (t - 0.08) / 0.12)),
    env: (t) => Math.min(1, t / 0.006) * Math.exp(-Math.max(0, t - 0.09) / 0.035),
    formants: [[700, 3, 1], [1700, 4, 0.5], [3000, 6, 0.12]],
    rough: 0.02,
  });
};

// Eating: a short, wet crunch.
RECIPES.crunch = (out, sr, r) => {
  grain(out, sr, r, { at: 0, len: 0.02, decay: 0.03, f: 380, type: "lowpass", q: 0.8, amp: 0.6 });
  for (let i = 0, n = between(r, 14, 22); i < n; i++)
    grain(out, sr, r, {
      at: 0.09 * r() ** 1.4, len: between(r, 0.002, 0.008), decay: between(r, 0.004, 0.01),
      f: between(r, 900, 3400), q: between(r, 0.8, 1.5), amp: between(r, 0.25, 0.5),
    });
};

// Finishing a meal: a low, rough burp.
RECIPES.burp = (out, sr, r) => {
  const f = between(r, 80, 100);
  voice(out, sr, r, {
    len: 0.36,
    f0: (t) => f * (1.1 - 0.25 * (t / 0.36)),
    env: (t) => Math.min(1, t / 0.03) * Math.exp(-Math.max(0, t - 0.2) / 0.06),
    formants: [[420, 3, 1], [900, 4, 0.5]],
    rough: 0.25,
  });
};

// One variant of a material's sound as samples, peak-normalized.
export function synthesize(material, variant, sr) {
  const out = new Float32Array(Math.floor(LENGTH * sr));
  RECIPES[material](out, sr, mulberry32(MATERIALS.indexOf(material) * 101 + variant * 7 + 1));
  let peak = 0;
  for (const v of out) peak = Math.max(peak, Math.abs(v));
  // Fade the last few milliseconds so nothing clicks off.
  const fade = Math.floor(0.01 * sr);
  for (let i = 0; i < fade; i++) out[out.length - 1 - i] *= i / fade;
  if (peak > 0) for (let i = 0; i < out.length; i++) out[i] *= 0.9 / peak;
  return out;
}
