// Generated from server/ by npm run build. Edit those files, not this one.

// play/js/shared/rules.js
var SX = 4096;
var SY = 96;
var SZ = 4096;
var CHUNK = 16;
var CYCLE_MS = 20 * 60 * 1e3;
var dayPhaseAt = (t) => (t % CYCLE_MS + CYCLE_MS) % CYCLE_MS / CYCLE_MS;
var sunUpAt = (t) => Math.sin(dayPhaseAt(t) * Math.PI * 2) > 0;
var CHUNKS_PER_REQUEST = 32;
var MAX_HP = 20;
var REACH = 3;
var NAME_RE = /^[A-Za-z0-9_]{3,16}$/;
var SKIN_PRESETS = [
  { id: "wanderer", name: "Wanderer" },
  { id: "ranger", name: "Ranger", slim: true },
  { id: "miner", name: "Miner" },
  { id: "knight", name: "Knight" },
  { id: "astronaut", name: "Astronaut" },
  { id: "wizard", name: "Wizard" },
  { id: "farmer", name: "Farmer" },
  { id: "robot", name: "Robot" },
  { id: "ninja", name: "Ninja" },
  { id: "scout", name: "Scout", slim: true }
];

// server/util.js
function clamp(v, lo, hi) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : lo;
}
function hashString(s) {
  let h = 0;
  for (const c of s) h = h * 31 + c.charCodeAt(0) >>> 0;
  return h;
}
var colorFor = (key2) => `hsl(${hashString(key2) % 360}, 70%, 55%)`;
function fromBase64(text) {
  const bin = atob(text);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
function toBase64(bytes) {
  let bin = "";
  for (let i = 0; i < bytes.length; i += 32768) bin += String.fromCharCode(...bytes.subarray(i, i + 32768));
  return btoa(bin);
}

// server/profiles.js
var MAX_SKIN_BYTES = 24 * 1024;
var error = (message, status) => Response.json({ error: message }, { status });
function defaultProfile(userId, email) {
  let name = (email.split("@")[0] || "player").replace(/[^A-Za-z0-9_]/g, "_").slice(0, 16);
  if (name.length < 3) name = `${name}_player`.slice(0, 16);
  const preset = SKIN_PRESETS[hashString(userId) % SKIN_PRESETS.length];
  return { name, skin: `preset:${preset.id}`, model: preset.slim ? "slim" : "classic" };
}
function guestProfile(guestId) {
  const h = hashString(guestId);
  const preset = SKIN_PRESETS[h % SKIN_PRESETS.length];
  return { name: `Guest${100 + h % 900}`, skin: `preset:${preset.id}`, model: preset.slim ? "slim" : "classic" };
}
var profileKey = (userId, guestId) => userId || (guestId ? `guest:${guestId}` : "");
async function loadProfile(env, { userId = "", email = "", guestId = "", fallback = "" }) {
  const key2 = profileKey(userId, guestId);
  const row = key2 && await env.DB.prepare("SELECT name, skin, model FROM profiles WHERE user_id = ?1").bind(key2).first();
  if (row) return { name: row.name, skin: row.skin, model: row.model };
  return userId ? defaultProfile(userId, email) : guestProfile(guestId || fallback);
}
async function forgetGuestProfile(env, guestId) {
  await env.DB.prepare("DELETE FROM profiles WHERE user_id = ?1").bind(profileKey("", guestId)).run();
}
async function profileApi(request, env) {
  const userId = request.headers.get("X-Yard-User-Id") ?? "";
  const email = request.headers.get("X-Yard-Email") ?? "";
  const guestId = userId ? "" : request.headers.get("X-Yard-Guest-Id") ?? "";
  const key2 = profileKey(userId, guestId);
  if (!key2) return Response.json({ error: "Sign in, or play as a guest.", guest: "__yard/auth/guest" }, { status: 401 });
  if (request.method === "GET") {
    return Response.json({ profile: await loadProfile(env, { userId, email, guestId }), guest: !userId });
  }
  if (request.method !== "PUT") return error("Use GET or PUT.", 405);
  if (Number(request.headers.get("Content-Length") ?? 0) > 64 * 1024) return error("That skin is too large.", 413);
  let body;
  try {
    body = await request.json();
  } catch {
    return error("Send JSON.", 400);
  }
  const name = String(body.name ?? "").trim();
  if (!NAME_RE.test(name)) return error("Names are 3\u201316 letters, digits or underscores.", 400);
  const model = body.model === "slim" ? "slim" : "classic";
  let skin = String(body.skin ?? "");
  if (!userId && !skin.startsWith("preset:")) return error("Sign in to use your own skin.", 403);
  if (skin === "upload") {
    let png;
    try {
      png = fromBase64(String(body.png ?? ""));
    } catch {
      return error("The skin upload was garbled.", 400);
    }
    const problem = checkSkinPng(png);
    if (problem) return error(problem, 400);
    skin = `custom:${await saveSkin(env, png, key2)}`;
  } else if (skin.startsWith("preset:")) {
    if (!SKIN_PRESETS.some((p) => p.id === skin.slice(7))) return error("No such skin.", 400);
  } else if (/^custom:[0-9a-f]{32}$/.test(skin)) {
    const known = await env.DB.prepare("SELECT 1 AS ok FROM skins WHERE id = ?1").bind(skin.slice(7)).first();
    if (!known) return error("No such skin.", 400);
  } else {
    return error("Pick a skin.", 400);
  }
  await env.DB.prepare(
    `INSERT INTO profiles (user_id, name, skin, model, updated_at) VALUES (?1, ?2, ?3, ?4, ?5)
     ON CONFLICT (user_id) DO UPDATE SET name = excluded.name, skin = excluded.skin, model = excluded.model, updated_at = excluded.updated_at`
  ).bind(key2, name, skin, model, Date.now()).run();
  return Response.json({ profile: { name, skin, model } });
}
function checkSkinPng(png) {
  if (png.length > MAX_SKIN_BYTES) return "Skins must be under 24 KB.";
  const sig = [137, 80, 78, 71, 13, 10, 26, 10];
  if (png.length < 33 || sig.some((b, i) => png[i] !== b)) return "Skins must be PNG images.";
  const view = new DataView(png.buffer, png.byteOffset, png.byteLength);
  if (view.getUint32(16) !== 64 || view.getUint32(20) !== 64) return "Skins must be 64\xD764 pixels.";
  return null;
}
async function saveSkin(env, png, owner) {
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", png));
  const id = [...digest.slice(0, 16)].map((b) => b.toString(16).padStart(2, "0")).join("");
  await env.DB.prepare("INSERT INTO skins (id, png, owner, created_at) VALUES (?1, ?2, ?3, ?4) ON CONFLICT (id) DO NOTHING").bind(id, toBase64(png), owner, Date.now()).run();
  return id;
}
async function serveSkin(env, id) {
  const row = await env.DB.prepare("SELECT png FROM skins WHERE id = ?1").bind(id).first();
  if (!row) return new Response("Not found", { status: 404 });
  return new Response(fromBase64(row.png), {
    headers: { "Content-Type": "image/png", "Cache-Control": "private, max-age=31536000, immutable" }
  });
}

// play/js/world/blocks.js
var AIR = 0;
var GRASS = 1;
var DIRT = 2;
var STONE = 3;
var SAND = 4;
var LOG = 5;
var LEAVES = 6;
var PLANKS = 7;
var BRICK = 8;
var GLASS = 9;
var LAMP = 10;
var WATER = 11;
var T = {
  grassTop: 0,
  grassSide: 1,
  dirt: 2,
  stone: 3,
  sand: 4,
  logSide: 5,
  logTop: 6,
  leaves: 7,
  planks: 8,
  brick: 9,
  glass: 10,
  lamp: 11,
  water: 12,
  strawberry: 13
  // items that aren't blocks have tiles here too (shared/items.js)
};
var DEF = [];
DEF[AIR] = { name: "Air", opaque: false, solid: false, filter: 0, emit: 0 };
function def(id, name, tex, opts = {}) {
  DEF[id] = { name, tex, opaque: true, solid: true, filter: 0, emit: 0, hard: 0.5, ...opts };
}
def(GRASS, "Grass", [T.grassTop, T.grassSide, T.dirt], { hard: 0.45, sound: "grass" });
def(DIRT, "Dirt", [T.dirt, T.dirt, T.dirt], { hard: 0.375, sound: "gravel" });
def(STONE, "Stone", [T.stone, T.stone, T.stone], { hard: 1.25, sound: "stone" });
def(SAND, "Sand", [T.sand, T.sand, T.sand], { hard: 0.375, sound: "sand" });
def(LOG, "Log", [T.logTop, T.logSide, T.logTop], { hard: 1, sound: "wood" });
def(LEAVES, "Leaves", [T.leaves, T.leaves, T.leaves], { opaque: false, filter: 1, hard: 0.15, sound: "leaves" });
def(PLANKS, "Planks", [T.planks, T.planks, T.planks], { hard: 0.8, sound: "wood" });
def(BRICK, "Brick", [T.brick, T.brick, T.brick], { hard: 1.75, sound: "stone" });
def(GLASS, "Glass", [T.glass, T.glass, T.glass], { opaque: false, hard: 0.225, sound: "glass" });
def(LAMP, "Lamp", [T.lamp, T.lamp, T.lamp], { emit: 15, hard: 0.225, sound: "glass" });
def(WATER, "Water", [T.water, T.water, T.water], { opaque: false, solid: false, filter: 2, water: true });
var PLACEABLE = [GRASS, DIRT, STONE, SAND, LOG, LEAVES, PLANKS, BRICK, GLASS, LAMP];
var canSet = (b) => b === AIR || PLACEABLE.includes(b);

// play/js/core/noise.js
function hash(seed, x, z) {
  let h = (seed ^ Math.imul(x, 374761393) ^ Math.imul(z, 668265263)) >>> 0;
  h = Math.imul(h ^ h >>> 13, 1274126177) >>> 0;
  return ((h ^ h >>> 16) >>> 0) / 4294967296;
}
function valueNoise(seed, x, z, period = 0) {
  const wrap = (v) => period ? (v % period + period) % period : v;
  const x0 = Math.floor(x), z0 = Math.floor(z);
  const fx = x - x0, fz = z - z0;
  const sx = fx * fx * (3 - 2 * fx), sz = fz * fz * (3 - 2 * fz);
  const a = hash(seed, wrap(x0), wrap(z0)), b = hash(seed, wrap(x0 + 1), wrap(z0));
  const c = hash(seed, wrap(x0), wrap(z0 + 1)), d = hash(seed, wrap(x0 + 1), wrap(z0 + 1));
  return a + (b - a) * sx + (c - a) * sz + (a - b - c + d) * sx * sz;
}

// play/js/world/chunk.js
var CHUNK_VOLUME = CHUNK * SY * CHUNK;
var li = (x, y, z) => x + CHUNK * (z + CHUNK * y);
var Chunk = class {
  constructor(cx, cz) {
    this.cx = cx;
    this.cz = cz;
    this.blocks = new Uint8Array(CHUNK_VOLUME);
    this.sky = new Uint8Array(CHUNK_VOLUME);
    this.blk = new Uint8Array(CHUNK_VOLUME);
    this.requested = false;
    this.ready = false;
    this.lit = false;
    this.meshed = false;
  }
};

// play/js/world/terrain.js
var SEA = 30;
var smoothstep = (e0, e1, x) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};
function heightAt(seed, x, z) {
  const continent = valueNoise(seed + 3, x / 220, z / 220);
  const ridge = 1 - Math.abs(valueNoise(seed + 4, x / 90, z / 90) * 2 - 1);
  const detail = valueNoise(seed, x / 24, z / 24) * 0.6 + valueNoise(seed + 1, x / 10, z / 10) * 0.3 + valueNoise(seed + 2, x / 4, z / 4) * 0.1;
  const h = 14 + continent * 26 + detail * 12 + ridge ** 3 * 42 * smoothstep(0.45, 0.75, continent);
  return Math.max(2, Math.min(SY - 12, Math.floor(h)));
}
var surfaceOf = (h) => h >= 64 ? STONE : h <= SEA + 1 ? SAND : GRASS;
var treeAt = (seed, x, z, h) => h > SEA + 1 && h < 62 && hash(seed + 7, x, z) < 0.012;
function findSpawn(seed) {
  const cx = SX / 2, cz = SZ / 2;
  for (let r = 0; r < 512; r += 4)
    for (let i = 0; i < Math.max(1, r * 2); i++) {
      const a = i / Math.max(1, r * 2) * Math.PI * 2;
      const x = Math.floor(cx + Math.cos(a) * r), z = Math.floor(cz + Math.sin(a) * r);
      const h = heightAt(seed, x, z);
      if (surfaceOf(h) === GRASS) return [x + 0.5, z + 0.5];
    }
  return [cx + 0.5, cz + 0.5];
}
function generate(c, seed) {
  const M = 2, W = CHUNK + 2 * M;
  const x0 = c.cx * CHUNK, z0 = c.cz * CHUNK;
  const heights = new Int16Array(W * W);
  for (let dz = -M; dz < CHUNK + M; dz++)
    for (let dx = -M; dx < CHUNK + M; dx++) heights[dx + M + W * (dz + M)] = heightAt(seed, x0 + dx, z0 + dz);
  const b = c.blocks;
  for (let z = 0; z < CHUNK; z++)
    for (let x = 0; x < CHUNK; x++) {
      const h = heights[x + M + W * (z + M)];
      const top = surfaceOf(h);
      const under = top === GRASS ? DIRT : top;
      for (let y = 0; y <= h; y++) b[li(x, y, z)] = y === h ? top : y > h - 4 ? under : STONE;
      for (let y = h + 1; y <= SEA; y++) b[li(x, y, z)] = WATER;
    }
  const put = (x, y, z, id, force) => {
    if (x < 0 || z < 0 || x >= CHUNK || z >= CHUNK || y < 0 || y >= SY) return;
    const i = li(x, y, z);
    if (force || b[i] === AIR) b[i] = id;
  };
  for (let dz = -M; dz < CHUNK + M; dz++)
    for (let dx = -M; dx < CHUNK + M; dx++) {
      const wx = x0 + dx, wz = z0 + dz;
      const h = heights[dx + M + W * (dz + M)];
      if (!treeAt(seed, wx, wz, h)) continue;
      for (let y = h + 1; y <= h + 4; y++) put(dx, y, dz, LOG, true);
      for (let dy = 3; dy <= 6; dy++) {
        const r = dy >= 5 ? 1 : 2;
        for (let ox = -r; ox <= r; ox++)
          for (let oz = -r; oz <= r; oz++) {
            if (r === 2 && Math.abs(ox) === 2 && Math.abs(oz) === 2 && hash(seed + dy, wx + ox, wz + oz) < 0.5) continue;
            put(dx + ox, h + dy, dz + oz, LEAVES, false);
          }
      }
    }
}

// play/js/shared/items.js
var STRAWBERRY = 256;
var ITEMS = {};
for (const b of PLACEABLE) ITEMS[b] = { name: DEF[b].name, tile: DEF[b].tex[1], block: b };
ITEMS[STRAWBERRY] = { name: "Strawberry", tile: T.strawberry, food: 2 };
var isItem = (id) => Number.isInteger(id) && Object.hasOwn(ITEMS, id);
var CREATIVE_ITEMS = [...PLACEABLE, STRAWBERRY];

// play/js/shared/inventory.js
var SLOTS = 36;
var HOTBAR_SLOTS = 9;
var STACK = 64;
var MODES = ["survival", "creative"];
var emptyInventory = () => ({ slots: Array(SLOTS).fill(null), cursor: null });
var DROPS = { [GRASS]: DIRT, [GLASS]: AIR, [LEAVES]: AIR, [WATER]: AIR };
var dropOf = (b) => DROPS[b] ?? b;
var isStack = (s) => Array.isArray(s) && s.length === 2 && isItem(s[0]) && Number.isInteger(s[1]) && s[1] >= 1 && s[1] <= STACK;
function fill(inv, b, n, lo, hi) {
  for (const pass of ["merge", "empty"])
    for (let i = lo; i < hi && n > 0; i++) {
      const s = inv.slots[i];
      if (pass === "merge" ? s?.[0] === b && s[1] < STACK : !s) {
        const put = Math.min(n, STACK - (s?.[1] ?? 0));
        inv.slots[i] = [b, (s?.[1] ?? 0) + put];
        n -= put;
      }
    }
  return n;
}
var addItem = (inv, b, n) => fill(inv, b, n, 0, SLOTS);
function removeFrom(inv, slot, n) {
  const s = inv.slots[slot];
  if (!s || n < 1) return null;
  const take = Math.min(n, s[1]);
  inv.slots[slot] = s[1] > take ? [s[0], s[1] - take] : null;
  return [s[0], take];
}
function quickMove(inv, slot) {
  const s = inv.slots[slot];
  if (!s) return false;
  const [lo, hi] = slot < HOTBAR_SLOTS ? [HOTBAR_SLOTS, SLOTS] : [0, HOTBAR_SLOTS];
  inv.slots[slot] = null;
  const n = fill(inv, s[0], s[1], lo, hi);
  inv.slots[slot] = n ? [s[0], n] : null;
  return n < s[1];
}
function clickSlot(inv, slot, button, shift) {
  if (!Number.isInteger(slot) || slot < 0 || slot >= SLOTS) return false;
  if (shift) return quickMove(inv, slot);
  const s = inv.slots[slot], c = inv.cursor;
  if (!c) {
    if (!s) return false;
    const take = button === 2 ? Math.ceil(s[1] / 2) : s[1];
    inv.cursor = [s[0], take];
    inv.slots[slot] = s[1] > take ? [s[0], s[1] - take] : null;
    return true;
  }
  if (!s || s[0] === c[0]) {
    const room = STACK - (s?.[1] ?? 0);
    const put = Math.min(button === 2 ? 1 : c[1], room);
    if (put <= 0) return false;
    inv.slots[slot] = [c[0], (s?.[1] ?? 0) + put];
    inv.cursor = c[1] > put ? [c[0], c[1] - put] : null;
    return true;
  }
  inv.slots[slot] = c;
  inv.cursor = s;
  return true;
}

// server/terrain.js
var CACHE = 64;
async function blockAt(room, x, y, z) {
  if (x < 0 || z < 0 || x >= SX || z >= SZ || y >= SY) return AIR;
  if (y < 0) return STONE;
  const edit = room.ctx.storage.sql.exec("SELECT b FROM edits WHERE x = ? AND y = ? AND z = ?", x, y, z).toArray()[0];
  if (edit) return edit.b;
  const { seed } = await worldRecord(room);
  return terrainChunk(room, seed, x >> 4, z >> 4).blocks[li(x & 15, y, z & 15)];
}
function terrainReader(room, seed) {
  const edits = /* @__PURE__ */ new Map();
  const editsIn = (cx, cz) => {
    const key2 = `${cx},${cz}`;
    let m = edits.get(key2);
    if (!m) {
      m = /* @__PURE__ */ new Map();
      for (const r of room.ctx.storage.sql.exec("SELECT x, y, z, b FROM edits WHERE cx = ? AND cz = ?", cx, cz))
        m.set(`${r.x},${r.y},${r.z}`, r.b);
      edits.set(key2, m);
    }
    return m;
  };
  const at = (x, y, z) => {
    if (x < 0 || z < 0 || x >= SX || z >= SZ || y >= SY) return AIR;
    if (y < 0) return STONE;
    const cx = Math.floor(x / CHUNK), cz = Math.floor(z / CHUNK);
    const edit = editsIn(cx, cz).get(`${x},${y},${z}`);
    if (edit !== void 0) return edit;
    return terrainChunk(room, seed, cx, cz).blocks[li(x & 15, y, z & 15)];
  };
  return {
    at,
    // The highest block in a column that isn't air, as [y, block]; null if
    // there's none.
    top(x, z) {
      for (let y = SY - 1; y >= 0; y--) {
        const b = at(x, y, z);
        if (b !== AIR) return [y, b];
      }
      return null;
    }
  };
}
function terrainChunk(room, seed, cx, cz) {
  room.terrain ??= /* @__PURE__ */ new Map();
  const key2 = `${seed}:${cx}:${cz}`;
  let c = room.terrain.get(key2);
  if (c) {
    room.terrain.delete(key2);
  } else {
    c = new Chunk(cx, cz);
    generate(c, seed);
    if (room.terrain.size >= CACHE) room.terrain.delete(room.terrain.keys().next().value);
  }
  room.terrain.set(key2, c);
  return c;
}

// server/items.js
var BREAK_DELAY_MS = 500;
var THROW_DELAY_MS = 2e3;
var LIFETIME_MS = 5 * 60 * 1e3;
var MAX_ITEMS = 500;
var PICKUP_RANGE = 8;
function setupItems(room) {
  const sql = room.ctx.storage.sql;
  sql.exec(
    "CREATE TABLE IF NOT EXISTS items (id TEXT PRIMARY KEY, b INTEGER, n INTEGER, x REAL, y REAL, z REAL, vx REAL, vy REAL, vz REAL, cx INTEGER, cz INTEGER, born INTEGER, pickup_at INTEGER)"
  );
  sql.exec("CREATE INDEX IF NOT EXISTS items_chunk ON items (cx, cz)");
}
function publicItem(r, now = Date.now()) {
  return { id: r.id, b: r.b, n: r.n, p: [r.x, r.y, r.z], v: [r.vx, r.vy, r.vz], age: now - r.born, wait: Math.max(0, r.pickup_at - now) };
}
var round = (v) => Math.round(v * 1e3) / 1e3;
function spawnItem(room, b, n, p, v, delayMs = BREAK_DELAY_MS) {
  const sql = room.ctx.storage.sql;
  const now = Date.now();
  const r = {
    id: crypto.randomUUID().slice(0, 8),
    b,
    n,
    x: round(p[0]),
    y: round(p[1]),
    z: round(p[2]),
    vx: round(v[0]),
    vy: round(v[1]),
    vz: round(v[2]),
    cx: Math.floor(p[0] / CHUNK),
    cz: Math.floor(p[2] / CHUNK),
    born: now,
    pickup_at: now + delayMs
  };
  sql.exec("INSERT INTO items VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", ...Object.values(r));
  room.broadcast(null, { type: "item", item: publicItem(r, now) });
  const extra = sql.exec("SELECT COUNT(*) AS n FROM items").toArray()[0].n - MAX_ITEMS;
  if (extra > 0) {
    for (const old of sql.exec("SELECT id FROM items ORDER BY born LIMIT ?", extra).toArray()) removeItem(room, old.id);
  }
}
function removeItem(room, id, by) {
  room.ctx.storage.sql.exec("DELETE FROM items WHERE id = ?", id);
  room.broadcast(null, { type: "itemgone", id, by });
}
function itemsIn(room, cx, cz) {
  const now = Date.now();
  const sql = room.ctx.storage.sql;
  sql.exec("DELETE FROM items WHERE born < ?", now - LIFETIME_MS);
  return sql.exec("SELECT * FROM items WHERE cx = ? AND cz = ?", cx, cz).toArray().map((r) => publicItem(r, now));
}
function clearItems(room) {
  room.ctx.storage.sql.exec("DELETE FROM items");
}
var itemMessages = {
  // A player walked into an item. The first to ask gets it; what doesn't
  // fit in their inventory stays on the ground.
  pickup(room, ws, player, msg) {
    if (typeof msg.id !== "string" || player.dead) return;
    const r = room.ctx.storage.sql.exec("SELECT * FROM items WHERE id = ?", msg.id).toArray()[0];
    const now = Date.now();
    if (!r || now < r.pickup_at || now - r.born > LIFETIME_MS) return;
    if (Math.hypot(r.x - player.p[0], r.y - player.p[1], r.z - player.p[2]) > PICKUP_RANGE) return;
    const left = giveItem(room, player, r.b, r.n);
    if (left === r.n) return;
    if (!left) return removeItem(room, r.id, player.id);
    room.ctx.storage.sql.exec("UPDATE items SET n = ? WHERE id = ?", left, r.id);
    room.broadcast(null, { type: "item", item: publicItem({ ...r, n: left }, now) });
  }
};

// server/inventory.js
var EAT_MS = 1500;
function setupInventories(room) {
  room.ctx.storage.sql.exec("CREATE TABLE IF NOT EXISTS players (uid TEXT PRIMARY KEY, mode TEXT, inv TEXT, cursor TEXT)");
}
var keyOf = (player) => player.uid || `guest:${player.guest || player.id}`;
function stateOf(room, player) {
  room.states ??= /* @__PURE__ */ new Map();
  const key2 = keyOf(player);
  let state = room.states.get(key2);
  if (state) return state;
  const row = room.ctx.storage.sql.exec("SELECT mode, inv, cursor FROM players WHERE uid = ?", key2).toArray()[0];
  state = { mode: "survival", ...emptyInventory() };
  if (row) {
    state.mode = MODES.includes(row.mode) ? row.mode : "survival";
    const slots = JSON.parse(row.inv ?? "[]");
    for (let i = 0; i < SLOTS; i++) state.slots[i] = isStack(slots[i]) ? slots[i] : null;
    const cursor = JSON.parse(row.cursor ?? "null");
    state.cursor = isStack(cursor) ? cursor : null;
  }
  room.states.set(key2, state);
  return state;
}
function saveState(room, player) {
  const state = stateOf(room, player);
  room.ctx.storage.sql.exec(
    "INSERT INTO players (uid, mode, inv, cursor) VALUES (?, ?, ?, ?) ON CONFLICT (uid) DO UPDATE SET mode = excluded.mode, inv = excluded.inv, cursor = excluded.cursor",
    keyOf(player),
    state.mode,
    JSON.stringify(state.slots),
    JSON.stringify(state.cursor)
  );
  const msg = { type: "inventory", inv: state.slots, cursor: state.cursor };
  for (const ws of socketsOf(room, player)) room.send(ws, msg);
}
function socketsOf(room, player) {
  const key2 = keyOf(player);
  return room.ctx.getWebSockets().filter((s) => {
    const p = s.deserializeAttachment();
    return p && keyOf(p) === key2;
  });
}
function adoptGuest(room, uid, guestId) {
  const sql = room.ctx.storage.sql;
  const from = `guest:${guestId}`;
  if (!sql.exec("SELECT 1 FROM players WHERE uid = ?", uid).toArray().length) {
    sql.exec("UPDATE players SET uid = ? WHERE uid = ?", uid, from);
  }
  sql.exec("DELETE FROM players WHERE uid = ?", from);
  room.states?.delete(from);
  room.states?.delete(uid);
}
function giveItem(room, player, b, n) {
  const left = addItem(stateOf(room, player), b, n);
  if (left < n) saveState(room, player);
  return left;
}
function setMode(room, player, mode) {
  stateOf(room, player).mode = mode;
  saveState(room, player);
  for (const ws of socketsOf(room, player)) {
    const p = ws.deserializeAttachment();
    p.mode = mode;
    ws.serializeAttachment(p);
    room.broadcast(null, { type: "mode", id: p.id, mode });
  }
}
function dropAll(room, player) {
  const state = stateOf(room, player);
  const stacks = [...state.slots, state.cursor].filter(Boolean);
  if (!stacks.length) return;
  Object.assign(state, emptyInventory());
  saveState(room, player);
  const [x, y, z] = player.p;
  for (const [b, n] of stacks) {
    const a = Math.random() * Math.PI * 2, speed = 1 + Math.random() * 2.5;
    spawnItem(room, b, n, [x, y + 1, z], [Math.cos(a) * speed, 4 + Math.random() * 2, Math.sin(a) * speed], THROW_DELAY_MS);
  }
}
function throwStack(room, player, [b, n]) {
  const [x, y, z] = player.p;
  const c = Math.cos(player.rx);
  const dir = [-Math.sin(player.ry) * c, Math.sin(player.rx), -Math.cos(player.ry) * c];
  const eye = [x + dir[0] * 0.3, y + 1.3, z + dir[2] * 0.3];
  spawnItem(room, b, n, eye, [dir[0] * 6, dir[1] * 6 + 2, dir[2] * 6], THROW_DELAY_MS);
}
var inventoryMessages = {
  // A click on a slot in the inventory screen.
  invclick(room, ws, player, msg) {
    if (player.dead) return;
    if (clickSlot(stateOf(room, player), msg.slot, msg.button === 2 ? 2 : 0, !!msg.shift)) saveState(room, player);
  },
  // The inventory screen closed: the held stack goes back, or falls if
  // there's no room.
  invclose(room, ws, player) {
    const state = stateOf(room, player);
    if (!state.cursor) return;
    const [b, n] = state.cursor;
    state.cursor = null;
    const left = addItem(state, b, n);
    saveState(room, player);
    if (left) throwStack(room, player, [b, left]);
  },
  // Q drops one item of a slot (all: the whole stack); with cursor, the
  // stack held in the inventory screen.
  drop(room, ws, player, msg) {
    if (player.dead) return;
    const state = stateOf(room, player);
    let stack;
    if (msg.cursor) {
      stack = state.cursor;
      state.cursor = null;
    } else if (Number.isInteger(msg.slot) && msg.slot >= 0 && msg.slot < SLOTS) {
      stack = removeFrom(state, msg.slot, msg.all ? STACK : 1);
    }
    if (!stack) return;
    saveState(room, player);
    throwStack(room, player, stack);
  },
  // Eating: the player started holding Place with food in a hotbar slot...
  eatstart(room, ws, player, msg) {
    if (!Number.isInteger(msg.slot) || msg.slot < 0 || msg.slot >= HOTBAR_SLOTS) return;
    Object.assign(player, { eatAt: Date.now(), eatSlot: msg.slot });
    ws.serializeAttachment(player);
  },
  // ...and held it long enough: one is eaten (except in creative) and heals.
  eat(room, ws, player, msg) {
    const state = stateOf(room, player);
    const food = ITEMS[state.slots[player.eatSlot]?.[0]]?.food;
    const ready = player.eatAt && msg.slot === player.eatSlot && Date.now() - player.eatAt >= EAT_MS;
    player.eatAt = 0;
    ws.serializeAttachment(player);
    if (!ready || !food || player.dead || player.hp >= MAX_HP) return;
    if (state.mode !== "creative") {
      removeFrom(state, msg.slot, 1);
      saveState(room, player);
    }
    player.hp = Math.min(MAX_HP, player.hp + food);
    ws.serializeAttachment(player);
    room.send(ws, { type: "health", hp: player.hp });
    room.broadcast(ws, { type: "eat", id: player.id });
  },
  // The creative screen: take any item, or delete what you hold. target
  // is "cursor" or a hotbar slot; item a stack, or null to clear it.
  creative(room, ws, player, msg) {
    const state = stateOf(room, player);
    if (state.mode !== "creative") return;
    if (msg.item !== null && !isStack(msg.item)) return;
    const item = msg.item;
    if (msg.target === "cursor") state.cursor = item;
    else if (Number.isInteger(msg.target) && msg.target >= 0 && msg.target < HOTBAR_SLOTS) state.slots[msg.target] = item;
    else return;
    saveState(room, player);
  }
};

// play/js/shared/mobs.js
var MOBS = {
  // A garden gnome: stands about the yard, shuffles off now and then, runs
  // when hit, and leaves strawberries from its garden.
  gnome: {
    name: "Gnome",
    hp: 10,
    box: [0.5, 0.95],
    walk: 1.1,
    panic: 2.6,
    drops: [[STRAWBERRY, 1, 3]],
    spawn: { on: [GRASS], group: [2, 3], near: 6 },
    ai: ["panic", "wander"]
  }
};
var isMobKind = (kind) => typeof kind === "string" && Object.hasOwn(MOBS, kind);
function segmentTime(a, b, speed) {
  const flat = Math.hypot(b[0] - a[0], b[2] - a[2]);
  const drop = a[1] - b[1];
  return Math.max(flat, 0.3) / speed + (drop > 0 ? Math.sqrt(drop / 8) : 0);
}
function pathDuration(path, speed) {
  let t = 0;
  for (let i = 1; i < path.length; i++) t += segmentTime(path[i - 1], path[i], speed);
  return t;
}
var clamp01 = (v) => Math.max(0, Math.min(1, v));
function pathAt(path, speed, elapsed, yaw = 0) {
  let t = Math.max(0, elapsed);
  for (let i = 1; i < path.length; i++) {
    const a = path[i - 1], b = path[i];
    const dx = b[0] - a[0], dz = b[2] - a[2], dy = b[1] - a[1];
    if (dx || dz) yaw = Math.atan2(-dx, -dz);
    const len = segmentTime(a, b, speed);
    if (t >= len) {
      t -= len;
      continue;
    }
    const f = t / len;
    let y = a[1], hop = 0;
    if (dy > 0) {
      const k = clamp01(f / 0.4);
      y += dy * k;
      hop = Math.sin(k * Math.PI) * 0.3;
    } else if (dy < 0) {
      const k = dx || dz ? clamp01((f - 0.45) / 0.55) : f;
      y += dy * k * k;
    }
    return { x: a[0] + 0.5 + dx * f, y, z: a[2] + 0.5 + dz * f, yaw, hop, cell: f < 0.5 ? i - 1 : i, done: false };
  }
  const e = path[path.length - 1];
  return { x: e[0] + 0.5, y: e[1], z: e[2] + 0.5, yaw, hop: 0, cell: path.length - 1, done: true };
}

// server/combat.js
var REACH_SLACK = 3;
var IMMUNE_MS = 500;
var ATTACK_MS = 200;
var REGEN_MS = 3800;
function damage(room, ws, victim, amount, { by, knock, cause, force } = {}) {
  if (victim.mode === "creative") {
    if (cause === "void") room.send(ws, { type: "teleport", spawn: true });
    return;
  }
  const now = Date.now();
  if (victim.dead || !force && now - victim.hurtAt < IMMUNE_MS) return;
  victim.hp = Math.max(0, victim.hp - amount);
  victim.hurtAt = now;
  victim.regenAt = now;
  victim.dead = victim.hp === 0;
  ws.serializeAttachment(victim);
  room.broadcast(null, { type: "hurt", id: victim.id, hp: victim.hp, by: by?.id, knock });
  if (!victim.dead) return;
  const text = by ? `${victim.name} was slain by ${by.name}` : cause === "void" ? `${victim.name} fell out of the world` : `${victim.name} fell from a high place`;
  room.broadcast(null, { type: "death", id: victim.id, text });
  dropAll(room, victim);
}
var combatMessages = {
  // A punch: both alive, close enough, not too fast. The victim's client
  // applies the knockback, pushed away from the attacker.
  attack(room, ws, player, msg) {
    if (typeof msg.id !== "string") return;
    const now = Date.now();
    const target = room.socketOf(msg.id);
    const victim = target?.deserializeAttachment();
    if (!victim || victim.id === player.id || player.dead || victim.dead) return;
    if (now - player.attackAt < ATTACK_MS) return;
    const dx = victim.p[0] - player.p[0], dz = victim.p[2] - player.p[2];
    if (Math.hypot(dx, victim.p[1] - player.p[1], dz) > REACH + REACH_SLACK) return;
    player.attackAt = now;
    ws.serializeAttachment(player);
    const len = Math.hypot(dx, dz) || 1;
    damage(room, target, victim, msg.crit ? 2 : 1, { by: player, knock: [dx / len, dz / len, msg.sprint ? 1.8 : 1] });
  },
  // Damage players do to themselves (falling) is theirs to report.
  fall(room, ws, player, msg) {
    if (!Number.isInteger(msg.dmg) || msg.dmg <= 0) return;
    damage(room, ws, player, Math.min(msg.dmg, MAX_HP * 10), { cause: msg.void ? "void" : "fall", force: !!msg.void });
  },
  regen(room, ws, player) {
    const now = Date.now();
    if (player.dead || player.hp >= MAX_HP || now - player.regenAt < REGEN_MS) return;
    player.hp += 1;
    player.regenAt = now;
    ws.serializeAttachment(player);
    room.send(ws, { type: "health", hp: player.hp });
  },
  respawn(room, ws, player) {
    if (!player.dead) return;
    Object.assign(player, { hp: MAX_HP, dead: false, hurtAt: 0, regenAt: Date.now() });
    ws.serializeAttachment(player);
    room.broadcast(null, { type: "respawn", id: player.id, hp: player.hp });
  }
};

// server/mobs/path.js
var DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
var solid = (b) => DEF[b].solid;
var key = ([x, y, z]) => `${x},${y},${z}`;
function standable(r, x, y, z) {
  if (x < 0 || z < 0 || x >= SX || z >= SZ || y < 1 || y >= SY - 1) return false;
  const feet = r.at(x, y, z);
  return !solid(feet) && !DEF[feet].water && solid(r.at(x, y - 1, z));
}
function step(r, [x, y, z], dx, dz) {
  const nx = x + dx, nz = z + dz;
  if (dx && dz && (solid(r.at(nx, y, z)) || solid(r.at(x, y, nz)))) return null;
  if (solid(r.at(nx, y, nz))) {
    return !solid(r.at(x, y + 1, z)) && standable(r, nx, y + 1, nz) ? [nx, y + 1, nz] : null;
  }
  for (let ny = y; ny >= y - 3; ny--) {
    if (standable(r, nx, ny, nz)) return [nx, ny, nz];
    const b = r.at(nx, ny, nz);
    if (solid(b) || DEF[b].water) return null;
  }
  return null;
}
function planToward(r, from, tx, tz, maxSteps) {
  const path = [from];
  const seen = /* @__PURE__ */ new Set([key(from)]);
  const dist = (c) => (c[0] + 0.5 - tx) ** 2 + (c[2] + 0.5 - tz) ** 2;
  let cur = from;
  for (let i = 0; i < maxSteps && dist(cur) > 1; i++) {
    let best = null, bestD = dist(cur);
    for (const [dx, dz] of DIRS) {
      const next = step(r, cur, dx, dz);
      if (!next || seen.has(key(next))) continue;
      const d = dist(next);
      if (d < bestD) best = next, bestD = d;
    }
    if (!best) break;
    path.push(best);
    seen.add(key(best));
    cur = best;
  }
  return path.length > 1 ? path : null;
}
function planWander(r, from) {
  const a = Math.random() * Math.PI * 2, d = 3 + Math.random() * 7;
  return planToward(r, from, from[0] + 0.5 + Math.cos(a) * d, from[2] + 0.5 + Math.sin(a) * d, 16);
}
function planFlee(r, from, [ax, az], steps = 5) {
  const a = Math.atan2(from[2] + 0.5 - az, from[0] + 0.5 - ax) + (Math.random() - 0.5) * 1.2;
  return planToward(r, from, from[0] + 0.5 + Math.cos(a) * 8, from[2] + 0.5 + Math.sin(a) * 8, steps);
}
function settle(r, [x, y, z]) {
  for (let up = 0; up < 4 && solid(r.at(x, y, z)); up++) y++;
  while (y > 1 && !solid(r.at(x, y - 1, z)) && !DEF[r.at(x, y, z)].water) y--;
  return [x, y, z];
}

// server/mobs/brain.js
var PANIC_MS = 5e3;
var GOALS = {
  // For a few seconds after being hit: run, away from whoever did it.
  panic(m, r, cell, now) {
    if (!(now < m.panicUntil)) return null;
    const path = planFlee(r, cell, m.panicFrom) ?? planWander(r, cell);
    return path ? { path, speed: MOBS[m.kind].panic } : { wait: 250 };
  },
  // Stand about for a few seconds, then stroll somewhere nearby.
  wander(m, r, cell) {
    m.rested = !m.rested;
    if (m.rested) return { wait: 2e3 + Math.random() * 6e3 };
    const path = planWander(r, cell);
    return path ? { path, speed: MOBS[m.kind].walk } : { wait: 1e3 };
  }
};
function decide(m, r, cell, now) {
  for (const goal of MOBS[m.kind].ai) {
    const plan = GOALS[goal](m, r, cell, now);
    if (plan) return plan;
  }
  return { wait: 2e3 };
}

// server/mobs/spawn.js
var MAX_MOBS = 150;
var NEAR_R = 64;
var FAR_R = 128;
var TRIES = 4;
var SPAWNERS = Object.keys(MOBS).filter((k) => MOBS[k].spawn);
var randInt = (lo, hi) => lo + Math.floor(Math.random() * (hi - lo + 1));
function spawnCell(r, x, z, rule) {
  const top = r.top(x, z);
  if (!top || !rule.on.includes(top[1])) return null;
  const cell = [x, top[0] + 1, z];
  return standable(r, ...cell) ? cell : null;
}
function makeRoom(room, players, now) {
  const mobs = mobsOf(room);
  if (mobs.size < MAX_MOBS) return true;
  let far = null, farD = FAR_R;
  for (const m of mobs.values()) {
    const p = mobPos(m, now);
    const d = Math.min(...players.map((q) => Math.hypot(q.p[0] - p.x, q.p[2] - p.z)));
    if (d > farD) far = m, farD = d;
  }
  if (far) removeMob(room, far);
  return !!far;
}
function naturalSpawn(room, r, players, now) {
  if (!SPAWNERS.length) return;
  const mobs = [...mobsOf(room).values()].map((m) => mobPos(m, now));
  for (const player of players) {
    const [px, , pz] = player.p;
    const near = mobs.filter((p) => Math.hypot(p.x - px, p.z - pz) < NEAR_R).length;
    for (let i = 0; i < TRIES; i++) {
      const kind = SPAWNERS[Math.floor(Math.random() * SPAWNERS.length)];
      const rule = MOBS[kind].spawn;
      if (near >= rule.near) continue;
      const a = Math.random() * Math.PI * 2, d = 24 + Math.random() * 24;
      const x = Math.floor(px + Math.cos(a) * d), z = Math.floor(pz + Math.sin(a) * d);
      if (!spawnCell(r, x, z, rule)) continue;
      for (let n = randInt(...rule.group); n > 0; n--) {
        const cell = spawnCell(r, x + randInt(-2, 2), z + randInt(-2, 2), rule);
        if (cell && makeRoom(room, players, now)) addMob(room, kind, cell);
      }
      break;
    }
  }
}
function summon(room, r, kind, [x, y, z], players) {
  if (!makeRoom(room, players, Date.now())) return null;
  return addMob(room, kind, settle(r, [Math.floor(x), Math.floor(y), Math.floor(z)]));
}

// server/mobs/index.js
var AWAKE_R = 96;
var SPAWN_EVERY_MS = 5e3;
var MIN_TICK_MS = 250;
var LATE_MS = 1e3;
var KNOCK_SPEED = 7;
function setupMobs(room) {
  room.ctx.storage.sql.exec(
    "CREATE TABLE IF NOT EXISTS mobs (id TEXT PRIMARY KEY, kind TEXT, x INTEGER, y INTEGER, z INTEGER, ry REAL, hp INTEGER)"
  );
}
function mobsOf(room) {
  if (room.mobs) return room.mobs;
  room.mobs = /* @__PURE__ */ new Map();
  const now = Date.now();
  const known = Object.keys(MOBS);
  room.ctx.storage.sql.exec(`DELETE FROM mobs WHERE kind NOT IN (${known.map(() => "?").join(", ")})`, ...known);
  for (const r of room.ctx.storage.sql.exec("SELECT * FROM mobs")) {
    room.mobs.set(r.id, {
      id: r.id,
      kind: r.kind,
      hp: r.hp,
      path: [[r.x, r.y, r.z]],
      speed: MOBS[r.kind].walk,
      start: now,
      ry: r.ry,
      until: now + Math.random() * 3e3
    });
  }
  return room.mobs;
}
var publicMob = (m, now = Date.now()) => ({
  id: m.id,
  kind: m.kind,
  hp: m.hp,
  path: m.path,
  speed: m.speed,
  age: now - m.start,
  ry: m.ry
});
var allMobs = (room) => [...mobsOf(room).values()].map((m) => publicMob(m));
var mobPos = (m, now) => pathAt(m.path, m.speed, (now - m.start) / 1e3, m.ry);
var cellOf = (m, now) => m.path[mobPos(m, now).cell];
var alivePlayers = (room) => room.ctx.getWebSockets().map((s) => s.deserializeAttachment()).filter((p) => p && !p.dead);
async function readerFor(room) {
  const { seed } = await worldRecord(room);
  return terrainReader(room, seed);
}
function save(room, m) {
  const [x, y, z] = m.path[m.path.length - 1];
  room.ctx.storage.sql.exec(
    "INSERT INTO mobs (id, kind, x, y, z, ry, hp) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT (id) DO UPDATE SET x = excluded.x, y = excluded.y, z = excluded.z, ry = excluded.ry, hp = excluded.hp",
    m.id,
    m.kind,
    x,
    y,
    z,
    m.ry,
    m.hp
  );
}
function setPath(room, m, path, speed, now) {
  m.ry = mobPos(m, now).yaw;
  Object.assign(m, { path, speed, start: now });
  m.ry = pathAt(path, speed, Infinity, m.ry).yaw;
  m.until = now + pathDuration(path, speed) * 1e3;
  save(room, m);
  room.broadcast(null, { type: "mob", mob: publicMob(m, now) });
}
function addMob(room, kind, cell) {
  const now = Date.now();
  const m = {
    id: crypto.randomUUID().slice(0, 8),
    kind,
    hp: MOBS[kind].hp,
    path: [cell],
    speed: MOBS[kind].walk,
    start: now,
    ry: Math.random() * Math.PI * 2,
    until: now + 1e3 + Math.random() * 3e3
  };
  mobsOf(room).set(m.id, m);
  save(room, m);
  room.broadcast(null, { type: "mob", mob: publicMob(m, now) });
  return m;
}
function removeMob(room, m) {
  mobsOf(room).delete(m.id);
  room.ctx.storage.sql.exec("DELETE FROM mobs WHERE id = ?", m.id);
  room.broadcast(null, { type: "mobgone", id: m.id });
}
function clearMobs(room) {
  room.ctx.storage.sql.exec("DELETE FROM mobs");
  room.mobs = /* @__PURE__ */ new Map();
}
async function hurtMob(room, m, amount, { from, strength = 1 } = {}) {
  const now = Date.now();
  if (now - (m.hurtAt ?? 0) < IMMUNE_MS) return;
  m.hurtAt = now;
  m.hp = Math.max(0, m.hp - amount);
  room.broadcast(null, { type: "mobhurt", id: m.id, hp: m.hp });
  if (!m.hp) return killMob(room, m, now);
  if (from) {
    Object.assign(m, { panicUntil: now + PANIC_MS, panicFrom: from, rested: false });
    const cell = cellOf(m, now);
    const knock = planFlee(await readerFor(room), cell, from, strength);
    setPath(room, m, knock ?? [cell], KNOCK_SPEED, now);
    await wakeMobs(room, true);
  } else {
    save(room, m);
  }
}
function killMob(room, m, now) {
  const p = mobPos(m, now);
  mobsOf(room).delete(m.id);
  room.ctx.storage.sql.exec("DELETE FROM mobs WHERE id = ?", m.id);
  room.broadcast(null, { type: "mobdeath", id: m.id });
  for (const [item, least, most] of MOBS[m.kind].drops) {
    const n = least + Math.floor(Math.random() * (most - least + 1));
    const a = Math.random() * Math.PI * 2;
    if (n > 0) spawnItem(room, item, n, [p.x, p.y + 0.5, p.z], [Math.cos(a), 3, Math.sin(a)], BREAK_DELAY_MS);
  }
}
async function wakeMobs(room, soon = false) {
  const at = Date.now() + (soon ? 0 : MIN_TICK_MS);
  const set = await room.ctx.storage.getAlarm();
  if (set === null || set > at) await room.ctx.storage.setAlarm(at);
}
async function mobTick(room) {
  if (!room.ctx.getWebSockets().length) return;
  const now = Date.now();
  const players = alivePlayers(room);
  const world = await worldRecord(room);
  const r = terrainReader(room, world.seed);
  let next = now + SPAWN_EVERY_MS;
  try {
    for (const m of mobsOf(room).values()) {
      const p = mobPos(m, now);
      if (!players.some((q) => Math.hypot(q.p[0] - p.x, q.p[2] - p.z) < AWAKE_R)) continue;
      if (now >= m.until) {
        const plan = decide(m, r, m.path[p.cell], now);
        if (plan.path) setPath(room, m, plan.path, plan.speed, now);
        else m.until = now + plan.wait;
      }
      next = Math.min(next, m.until);
    }
    if (now >= (room.spawnAt ?? 0)) {
      room.spawnAt = now + SPAWN_EVERY_MS;
      if (sunUpAt(now + world.timeOffset)) naturalSpawn(room, r, players, now);
    }
    next = Math.min(next, room.spawnAt);
  } finally {
    room.tickDue = Math.max(next, now + MIN_TICK_MS);
    await room.ctx.storage.setAlarm(Math.min(room.tickDue, world.resetAt));
  }
}
async function summonMobs(room, kind, n, at) {
  const r = await readerFor(room);
  let made = 0;
  for (let i = 0; i < n; i++) if (summon(room, r, kind, at, alivePlayers(room))) made++;
  if (made) await wakeMobs(room);
  return made;
}
async function tickIfLate(room) {
  if (Date.now() >= (room.tickDue ?? 0) + LATE_MS) await mobTick(room);
}
async function noticeEdit(room, x, y, z) {
  const now = Date.now();
  let r = null;
  for (const m of mobsOf(room).values()) {
    const at = mobPos(m, now);
    const ahead = m.path.slice(at.cell);
    if (!ahead.some((c) => c[0] === x && c[2] === z && y >= c[1] - 1 && y <= c[1] + 1)) continue;
    r ??= await readerFor(room);
    const cell = m.path[at.cell];
    const to = settle(r, cell);
    setPath(room, m, to[1] === cell[1] ? [cell] : [cell, to], MOBS[m.kind].walk, now);
    const fell = cell[1] - to[1];
    if (fell > 3) await hurtMob(room, m, fell - 3);
  }
  if (r) await wakeMobs(room, true);
}
var mobMessages = {
  // A player hit a mob: alive, near enough, not too fast. As with players,
  // a falling hit is critical and a sprinting one knocks further.
  async hitmob(room, ws, player, msg) {
    if (typeof msg.id !== "string" || player.dead) return;
    const m = mobsOf(room).get(msg.id);
    const now = Date.now();
    if (!m || now - player.attackAt < ATTACK_MS) return;
    const p = mobPos(m, now);
    if (Math.hypot(p.x - player.p[0], p.y - player.p[1], p.z - player.p[2]) > REACH + REACH_SLACK) return;
    player.attackAt = now;
    ws.serializeAttachment(player);
    await hurtMob(room, m, msg.crit ? 2 : 1, { from: [player.p[0], player.p[2]], strength: msg.sprint ? 2 : 1 });
  }
};

// server/edits.js
var RESET_MS = 10 * 60 * 1e3;
var resetAfter = (t) => (Math.floor(t / RESET_MS) + 1) * RESET_MS;
function setupStorage(room) {
  const sql = room.ctx.storage.sql;
  sql.exec("CREATE TABLE IF NOT EXISTS edits (cx INTEGER, cz INTEGER, x INTEGER, y INTEGER, z INTEGER, b INTEGER, PRIMARY KEY (x, y, z))");
  sql.exec("CREATE INDEX IF NOT EXISTS edits_chunk ON edits (cx, cz)");
}
async function worldRecord(room) {
  const storage = room.ctx.storage;
  let world = await storage.get("world");
  if (!world) {
    storage.sql.exec("DROP TABLE IF EXISTS blocks");
    await storage.delete("seed");
    world = { seed: Math.floor(Math.random() * 2 ** 31), gen: 1, timeOffset: 0, resetAt: resetAfter(Date.now()) };
    await storage.put("world", world);
  }
  world.resetAt ??= 0;
  return world;
}
async function saveWorldRecord(room, world) {
  await room.ctx.storage.put("world", world);
}
async function restartWorld(room, seed) {
  const world = await worldRecord(room);
  world.seed = seed;
  world.gen += 1;
  world.resetAt = resetAfter(Date.now());
  room.ctx.storage.sql.exec("DELETE FROM edits");
  clearItems(room);
  clearMobs(room);
  room.terrain = null;
  await saveWorldRecord(room, world);
  const spawn = spawnPoint(room, seed);
  for (const ws of room.ctx.getWebSockets()) {
    const player = ws.deserializeAttachment();
    if (!player) continue;
    player.p = spawn;
    ws.serializeAttachment(player);
  }
  room.broadcast(null, { type: "reset", seed, gen: world.gen, resetAt: world.resetAt, spawn });
  return world;
}
function spawnPoint(room, seed) {
  const [x, z] = findSpawn(seed);
  const r = terrainReader(room, seed);
  let y = SY - 1;
  while (y > 0 && !DEF[r.at(Math.floor(x), y - 1, Math.floor(z))].solid) y--;
  return [x, y, z];
}
async function renewIfDue(room) {
  const world = await worldRecord(room);
  if (Date.now() < world.resetAt) return;
  await restartWorld(room, Math.floor(Math.random() * 2 ** 31));
  room.broadcast(null, { type: "system", text: "The world has been reset. It resets every 10 minutes." });
}
var worldMessages = {
  // The edits and items in each chunk asked for, one message per chunk.
  async chunks(room, ws, player, msg) {
    if (!Array.isArray(msg.list)) return;
    const { gen } = await worldRecord(room);
    for (const c of msg.list.slice(0, CHUNKS_PER_REQUEST)) {
      if (!Array.isArray(c)) continue;
      const [cx, cz] = c;
      if (![cx, cz].every(Number.isInteger) || cx < 0 || cz < 0 || cx >= SX / CHUNK || cz >= SZ / CHUNK) continue;
      const edits = room.ctx.storage.sql.exec("SELECT x, y, z, b FROM edits WHERE cx = ? AND cz = ?", cx, cz).toArray().map((r) => [r.x, r.y, r.z, r.b]);
      room.send(ws, { type: "chunkdata", gen, cx, cz, edits, items: itemsIn(room, cx, cz) });
    }
  },
  // A block broken (b is air) or placed from hotbar slot `slot`. The bottom
  // layer can't be changed. In survival, breaking drops the block and
  // placing uses one up; a refused change is undone on the sender's screen.
  async set(room, ws, player, { x, y, z, b, slot }) {
    if (![x, y, z, b].every(Number.isInteger)) return;
    if (x < 0 || y < 1 || z < 0 || x >= SX || y >= SY || z >= SZ || !canSet(b) || player.dead) return;
    const old = await blockAt(room, x, y, z);
    const state = stateOf(room, player);
    const survival = state.mode === "survival";
    const undo = () => room.send(ws, { type: "set", x, y, z, b: old, undo: true });
    if (b === AIR) {
      if (old === AIR || old === WATER) return undo();
      const drop = dropOf(old);
      if (survival && drop !== AIR) {
        const a = Math.random() * Math.PI * 2;
        spawnItem(room, drop, 1, [x + 0.5, y + 0.25, z + 0.5], [Math.cos(a) * 1.2, 3, Math.sin(a) * 1.2]);
      }
    } else {
      if (old !== AIR && old !== WATER) return undo();
      if (survival) {
        const ok = Number.isInteger(slot) && slot >= 0 && slot < HOTBAR_SLOTS && state.slots[slot]?.[0] === b;
        if (!ok) {
          saveState(room, player);
          return undo();
        }
        removeFrom(state, slot, 1);
        saveState(room, player);
      }
    }
    room.ctx.storage.sql.exec(
      "INSERT INTO edits (cx, cz, x, y, z, b) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT (x, y, z) DO UPDATE SET b = excluded.b",
      Math.floor(x / CHUNK),
      Math.floor(z / CHUNK),
      x,
      y,
      z,
      b
    );
    room.broadcast(null, { type: "set", x, y, z, b });
    await noticeEdit(room, x, y, z);
  }
};

// server/players.js
function publicPlayer({ uid, guest, email, hurtAt, attackAt, regenAt, eatAt, eatSlot, ...p }) {
  return { ...p, guest: !!guest };
}
var playerMessages = {
  move(room, ws, player, msg) {
    if (!Array.isArray(msg.p)) return;
    player.p = [clamp(msg.p[0], -8, SX + 8), clamp(msg.p[1], -64, SY + 64), clamp(msg.p[2], -8, SZ + 8)];
    player.ry = clamp(msg.ry, -1e3, 1e3);
    player.rx = clamp(msg.rx, -1.6, 1.6);
    player.s = Number.isInteger(msg.s) ? msg.s & 3 : 0;
    ws.serializeAttachment(player);
    room.broadcast(ws, { type: "move", id: player.id, p: player.p, ry: player.ry, rx: player.rx, s: player.s });
  },
  // Latency checks: the time comes straight back.
  ping(room, ws, player, msg) {
    if (Number.isFinite(msg.t)) room.send(ws, { type: "pong", t: msg.t });
  },
  swing(room, ws, player) {
    room.broadcast(ws, { type: "swing", id: player.id });
  },
  // The player saved a new look; read it back from the database rather than
  // trusting the message.
  async profile(room, ws, player) {
    const guestId = player.uid || player.guest === player.id ? "" : player.guest;
    Object.assign(player, await loadProfile(room.env, { userId: player.uid, email: player.email, guestId, fallback: player.id }));
    ws.serializeAttachment(player);
    room.broadcast(null, { type: "profile", player: publicPlayer(player) });
  },
  chat(room, ws, player, msg) {
    if (typeof msg.text !== "string") return;
    const text = msg.text.trim().slice(0, 200);
    if (text) room.broadcast(null, { type: "chat", name: player.name, color: player.color, admin: player.admin, text });
  }
};

// server/commands.js
var COMMANDS = {
  help: {
    usage: "/help",
    about: "list the commands you can use",
    run(room, ws, player) {
      const lines = Object.values(COMMANDS).filter((c) => !c.admin || player.admin).map((c) => `${c.usage} \u2014 ${c.about}${c.admin ? " (team)" : ""}`);
      room.reply(ws, ["Commands:", ...lines].join("\n"));
    }
  },
  who: {
    usage: "/who",
    about: "list who's online",
    run(room, ws) {
      const names = room.players().map((p) => p.admin ? `\u2605${p.name}` : p.name);
      room.reply(ws, `Online (${names.length}): ${names.join(", ")}`);
    }
  },
  kill: {
    usage: "/kill",
    about: "die and respawn",
    run(room, ws, player) {
      if (player.mode === "creative") return room.reply(ws, "You can't be hurt in creative mode.", true);
      damage(room, ws, player, MAX_HP * 10, { cause: "void", force: true });
    }
  },
  gamemode: {
    usage: "/gamemode [survival|creative]",
    about: "switch between survival and creative",
    run(room, ws, player, args) {
      const names = { survival: "survival", s: "survival", 0: "survival", creative: "creative", c: "creative", 1: "creative" };
      const current = stateOf(room, player).mode;
      const mode = args[0] === void 0 ? current === "creative" ? "survival" : "creative" : names[args[0]];
      if (!mode) return room.reply(ws, "Usage: /gamemode [survival|creative]", true);
      setMode(room, player, mode);
      room.reply(ws, `Your game mode is now ${mode[0].toUpperCase()}${mode.slice(1)}.`);
    }
  },
  summon: {
    usage: "/summon <mob> [count]",
    about: "creative: bring mobs to where you stand",
    async run(room, ws, player, args) {
      const usage = `Usage: /summon <mob> [count], with mob one of: ${Object.keys(MOBS).join(", ")}`;
      if (player.mode !== "creative") return room.reply(ws, "/summon only works in creative mode.", true);
      const n = args[1] === void 0 ? 1 : Number(args[1]);
      if (!isMobKind(args[0]) || !Number.isInteger(n) || n < 1 || n > 10) return room.reply(ws, usage, true);
      const made = await summonMobs(room, args[0], n, player.p);
      if (!made) return room.reply(ws, "There are too many mobs in this world.", true);
      room.reply(ws, `Summoned ${made} ${MOBS[args[0]].name.toLowerCase()}${made > 1 ? "s" : ""}.`);
    }
  },
  spawn: {
    usage: "/spawn",
    about: "go back to spawn",
    run(room, ws) {
      room.send(ws, { type: "teleport", spawn: true });
    }
  },
  time: {
    admin: true,
    usage: "/time day|noon|night|midnight",
    about: "set the time of day for everyone",
    async run(room, ws, player, args) {
      const phases = { day: 0.04, noon: 0.25, night: 0.54, midnight: 0.75 };
      const target = phases[args[0]];
      if (target === void 0) return room.reply(ws, "Usage: /time day|noon|night|midnight", true);
      const world = await worldRecord(room);
      const now = Date.now();
      world.timeOffset = ((target * CYCLE_MS - now % CYCLE_MS) % CYCLE_MS + CYCLE_MS) % CYCLE_MS;
      await saveWorldRecord(room, world);
      room.broadcast(null, { type: "time", now, timeOffset: world.timeOffset });
      room.broadcast(null, { type: "system", text: `${player.name} set the time to ${args[0]}` });
    }
  },
  restart: {
    admin: true,
    usage: "/restart [seed]",
    about: "wipe every build and generate a new world",
    async run(room, ws, player, args) {
      let seed = Math.floor(Math.random() * 2 ** 31);
      if (args[0] !== void 0) {
        seed = Number(args[0]);
        if (!Number.isInteger(seed) || seed < 0 || seed >= 2 ** 31) {
          return room.reply(ws, "Usage: /restart [seed], with a whole number below 2147483648", true);
        }
      }
      await restartWorld(room, seed);
      room.broadcast(null, { type: "system", text: `${player.name} restarted the world (seed ${seed})` });
    }
  }
};
var commandMessages = {
  async command(room, ws, player, msg) {
    if (typeof msg.text !== "string") return;
    const [name, ...args] = msg.text.trim().replace(/^\//, "").split(/\s+/);
    const key2 = name?.toLowerCase();
    const command = Object.hasOwn(COMMANDS, key2) ? COMMANDS[key2] : null;
    if (!command) return room.reply(ws, `Unknown command /${name}. Try /help`, true);
    if (command.admin && !player.admin) return room.reply(ws, `/${name} is only for the project's team.`, true);
    await command.run(room, ws, player, args.map((a) => a.toLowerCase()));
  }
};

// server/room.js
var HANDLERS = {
  ...worldMessages,
  ...playerMessages,
  ...combatMessages,
  ...commandMessages,
  ...inventoryMessages,
  ...itemMessages,
  ...mobMessages
};
var World = class {
  constructor(ctx, env) {
    this.ctx = ctx;
    this.env = env;
    setupStorage(this);
    setupInventories(this);
    setupItems(this);
    setupMobs(this);
  }
  async fetch(request) {
    if (request.headers.get("Upgrade") !== "websocket") {
      return new Response("Expected a WebSocket", { status: 426 });
    }
    await renewIfDue(this);
    const world = await worldRecord(this);
    const userId = request.headers.get("X-Yard-User-Id") ?? "";
    const email = request.headers.get("X-Yard-Email") ?? "";
    const id = crypto.randomUUID().slice(0, 8);
    const guestId = request.headers.get("X-Yard-Guest-Id") ?? "";
    const guest = userId ? "" : guestId || id;
    const signedInGuest = !!(userId && guestId);
    if (signedInGuest) {
      adoptGuest(this, userId, guestId);
      await forgetGuestProfile(this.env, guestId);
    }
    const profile = await loadProfile(this.env, { userId, email, guestId: userId ? "" : guestId, fallback: id });
    const player = {
      id,
      uid: userId,
      guest,
      email,
      ...profile,
      color: colorFor(userId || guest),
      // Members of the team that owns the project: Yard's edge sends
      // X-Yard-Entitlement: team for them, and clients can't forge it.
      admin: request.headers.get("X-Yard-Entitlement") === "team",
      p: [SX / 2, SY, SZ / 2],
      ry: 0,
      rx: 0,
      s: 0,
      hp: MAX_HP,
      dead: false,
      hurtAt: 0,
      attackAt: 0,
      regenAt: 0
    };
    const state = stateOf(this, player);
    player.mode = state.mode;
    const pair = new WebSocketPair();
    const server = pair[1];
    const others = this.players();
    this.ctx.acceptWebSocket(server, [id]);
    server.serializeAttachment(player);
    this.send(server, {
      type: "welcome",
      self: publicPlayer(player),
      inv: state.slots,
      cursor: state.cursor,
      seed: world.seed,
      gen: world.gen,
      size: [SX, SY, SZ],
      now: Date.now(),
      timeOffset: world.timeOffset,
      resetAt: world.resetAt,
      players: others,
      mobs: allMobs(this),
      forgetGuest: signedInGuest
    });
    this.broadcast(server, { type: "join", player: publicPlayer(player) });
    await wakeMobs(this);
    return new Response(null, { status: 101, webSocket: pair[0] });
  }
  async webSocketMessage(ws, message) {
    if (typeof message !== "string") return;
    let msg;
    try {
      msg = JSON.parse(message);
    } catch {
      return;
    }
    const player = ws.deserializeAttachment();
    const handler = Object.hasOwn(HANDLERS, msg?.type) ? HANDLERS[msg.type] : null;
    if (player && handler) await handler(this, ws, player, msg);
    await tickIfLate(this);
  }
  // Mobs think on the room's alarm while anyone is here (mobs/index.js), and
  // it wakes the room when the world is due to reset (edits.js).
  async alarm() {
    await renewIfDue(this);
    await mobTick(this);
  }
  webSocketClose(ws) {
    this.leave(ws);
  }
  webSocketError(ws) {
    this.leave(ws);
  }
  leave(ws) {
    const player = ws.deserializeAttachment();
    if (player) this.broadcast(ws, { type: "leave", id: player.id });
  }
  // ---------------------------------------------------------------- helpers
  // Everyone online, as others may see them.
  players() {
    return this.ctx.getWebSockets().map((s) => s.deserializeAttachment()).filter(Boolean).map(publicPlayer);
  }
  // The socket of the player with this id.
  socketOf(id) {
    return this.ctx.getWebSockets().find((s) => s.deserializeAttachment()?.id === id);
  }
  send(ws, event) {
    ws.send(JSON.stringify(event));
  }
  // A private line in one player's chat.
  reply(ws, text, error2 = false) {
    this.send(ws, { type: "system", text, error: error2 });
  }
  // Sends to everyone but sender (null for everyone).
  broadcast(sender, event) {
    const data = JSON.stringify(event);
    for (const socket of this.ctx.getWebSockets()) {
      if (socket === sender) continue;
      try {
        socket.send(data);
      } catch {
      }
    }
  }
};

// server/index.js
var index_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/_service.js") return new Response("Not found", { status: 404 });
    if (url.pathname === "/api/profile") return profileApi(request, env);
    const skin = url.pathname.match(/^\/skins\/([0-9a-f]{32})\.png$/);
    if (skin && request.method === "GET") return serveSkin(env, skin[1]);
    if (url.pathname === "/ws" && request.method === "GET") {
      const raw = (url.searchParams.get("world") ?? "main").toLowerCase();
      const name = /^[a-z0-9-]{1,32}$/.test(raw) ? raw : "main";
      return env.WORLDS.get(env.WORLDS.idFromName(name)).fetch(request);
    }
    return env.ASSETS.fetch(request);
  }
};
export {
  World,
  index_default as default
};
