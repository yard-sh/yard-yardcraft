// Sound playback: footsteps, digging, breaking and placing, heard from where
// they happen. Steps, hits and breaks are the same sounds played at different
// volumes and pitches, as in Minecraft.
import { MATERIALS, VARIANTS, synthesize } from "./synth.js";

// How each use plays a material, following Minecraft: steps are quiet,
// mining hits quieter and pitched down, breaking and placing loud and a
// little low.
const USES = {
  step: { volume: 0.32, rate: 1 },
  hit: { volume: 0.26, rate: 0.6 },
  break: { volume: 0.9, rate: 0.8 },
  place: { volume: 0.9, rate: 0.8 },
};
// Short, sharp sounds read quieter at the same peak; even them out.
const LOUDNESS = { stone: 1.5, glass: 1.4, wood: 1.15 };
const HEARING = 16; // blocks; Minecraft's range for these sounds

let ctx = null, master = null;
const buffers = new Map(); // material -> [AudioBuffer]
const listener = { x: 0, y: 0, z: 0, yaw: 0 };
let volume = 1;

// Browsers allow audio only after the player interacts, so this runs from a
// click; the sounds are built the first time (a few milliseconds).
export function startSounds() {
  if (!ctx) {
    const AC = window.AudioContext ?? window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = volume;
    // A gentle low-pass over everything keeps the crackle warm, not hissy.
    const warm = ctx.createBiquadFilter();
    warm.type = "lowpass";
    warm.frequency.value = 5000;
    warm.Q.value = 0.5;
    master.connect(warm).connect(ctx.destination);
    for (const m of MATERIALS) {
      buffers.set(
        m,
        Array.from({ length: VARIANTS }, (_, v) => {
          const data = synthesize(m, v, ctx.sampleRate);
          const buf = ctx.createBuffer(1, data.length, ctx.sampleRate);
          buf.copyToChannel(data, 0);
          return buf;
        }),
      );
    }
  }
  if (ctx.state === "suspended") ctx.resume();
}

export function setVolume(v) {
  volume = v;
  if (master) master.gain.value = v;
}

export function setListener(x, y, z, yaw) {
  Object.assign(listener, { x, y, z, yaw });
}

// Plays a sound by name ("hurt", or a material) at a point in the world.
export function playSound(name, x, y, z, { volume: v = 1, rate = 1 } = {}) {
  if (!ctx || ctx.state !== "running") return;
  const dx = x - listener.x, dy = y - listener.y, dz = z - listener.z;
  const dist = Math.hypot(dx, dy, dz);
  const falloff = Math.max(0, 1 - dist / HEARING);
  if (falloff <= 0) return;
  const variants = buffers.get(name);
  const src = ctx.createBufferSource();
  src.buffer = variants[Math.floor(Math.random() * variants.length)];
  src.playbackRate.value = rate * (0.92 + Math.random() * 0.16);
  const g = ctx.createGain();
  g.gain.value = v * falloff * (LOUDNESS[name] ?? 1);
  const pan = ctx.createStereoPanner();
  // The listener's right is (cos yaw, 0, -sin yaw).
  const side = dist > 0.5 ? (dx * Math.cos(listener.yaw) - dz * Math.sin(listener.yaw)) / dist : 0;
  pan.pan.value = side * 0.7;
  src.connect(g).connect(pan).connect(master);
  src.start();
}

// Plays a block's sound for a use ("step", "hit", "break" or "place") at a
// point in the world: quieter with distance, panned left or right.
export function playBlockSound(def, use, x, y, z, gain = 1) {
  if (!def?.sound) return;
  // Glass breaks with its own shatter; Minecraft's glass does too.
  const material = use === "break" && def.sound === "glass" ? "shatter" : def.sound;
  playSound(material, x, y, z, { volume: USES[use].volume * gain, rate: USES[use].rate });
}
