// Rules the client and the server share. The server's bundle imports this
// file too (see server/), so it must not touch browser APIs.

// The world: 4096 × 96 × 4096 blocks, loaded in 16 × 16 columns (chunks).
export const SX = 4096, SY = 96, SZ = 4096;
export const CHUNK = 16;

// One day in milliseconds; phase 0 is sunrise. The server keeps the clock.
export const CYCLE_MS = 20 * 60 * 1000;

// How far through the day the world clock t is, 0..1 (0 sunrise, 0.5
// sunset); and whether the sun is up then.
export const dayPhaseAt = (t) => (((t % CYCLE_MS) + CYCLE_MS) % CYCLE_MS) / CYCLE_MS;
export const sunUpAt = (t) => Math.sin(dayPhaseAt(t) * Math.PI * 2) > 0;

// The most chunks a client asks the server for in one message.
export const CHUNKS_PER_REQUEST = 32;

// Health, Minecraft's numbers: 20 points, shown as 10 hearts.
export const MAX_HP = 20;

// How far a player reaches to hit another, in blocks (Minecraft's survival
// reach). The server allows a little more, for lag.
export const REACH = 3;

// Character names: 3–16 letters, digits or underscores.
export const NAME_RE = /^[A-Za-z0-9_]{3,16}$/;

// The preset skins. The client paints them (js/skins/presets.js); slim ones
// have Alex-style three-pixel arms.
export const SKIN_PRESETS = [
  { id: "wanderer", name: "Wanderer" },
  { id: "ranger", name: "Ranger", slim: true },
  { id: "miner", name: "Miner" },
  { id: "knight", name: "Knight" },
  { id: "astronaut", name: "Astronaut" },
  { id: "wizard", name: "Wizard" },
  { id: "farmer", name: "Farmer" },
  { id: "robot", name: "Robot" },
  { id: "ninja", name: "Ninja" },
  { id: "scout", name: "Scout", slim: true },
];
