// Character profiles, in the project database (env.DB): a name, a skin and
// an arm model per Yard user. A skin is a preset the client paints, or an
// uploaded Minecraft-format PNG stored once per distinct image.
//
// Guests (signed out) are known by Yard's guest id (X-Yard-Guest-Id; the
// page asks for one at __yard/auth/guest) and their profiles are stored the
// same way, under "guest:<id>". They start as GuestNNN with a preset and
// can't upload skins.
import { NAME_RE, SKIN_PRESETS } from "../play/js/shared/rules.js";
import { hashString, fromBase64, toBase64 } from "./util.js";

const MAX_SKIN_BYTES = 24 * 1024;

const error = (message, status) => Response.json({ error: message }, { status });

// A new player's profile: their email name, and a preset skin picked from
// their user id so people look different before they choose.
function defaultProfile(userId, email) {
  let name = (email.split("@")[0] || "player").replace(/[^A-Za-z0-9_]/g, "_").slice(0, 16);
  if (name.length < 3) name = `${name}_player`.slice(0, 16);
  const preset = SKIN_PRESETS[hashString(userId) % SKIN_PRESETS.length];
  return { name, skin: `preset:${preset.id}`, model: preset.slim ? "slim" : "classic" };
}

// A new guest's profile: GuestNNN and a preset, both picked from their id.
function guestProfile(guestId) {
  const h = hashString(guestId);
  const preset = SKIN_PRESETS[h % SKIN_PRESETS.length];
  return { name: `Guest${100 + (h % 900)}`, skin: `preset:${preset.id}`, model: preset.slim ? "slim" : "classic" };
}

// Whose profile a request is: the signed-in user, else the guest, else
// nobody ("").
export const profileKey = (userId, guestId) => userId || (guestId ? `guest:${guestId}` : "");

// The profile of a user (userId, email) or a guest (guestId). A visitor
// with neither (no guest id yet) gets a guest profile picked from fallback.
export async function loadProfile(env, { userId = "", email = "", guestId = "", fallback = "" }) {
  const key = profileKey(userId, guestId);
  const row = key && (await env.DB.prepare("SELECT name, skin, model FROM profiles WHERE user_id = ?1").bind(key).first());
  if (row) return { name: row.name, skin: row.skin, model: row.model };
  return userId ? defaultProfile(userId, email) : guestProfile(guestId || fallback);
}

// A guest signed in: their guest profile is no longer needed.
export async function forgetGuestProfile(env, guestId) {
  await env.DB.prepare("DELETE FROM profiles WHERE user_id = ?1").bind(profileKey("", guestId)).run();
}

// GET /api/profile reads the player's profile (signed in, or a guest) and
// whether they're a guest; PUT saves it. PUT takes { name, model, skin }
// where skin is "preset:<id>", an existing "custom:<id>", or "upload" with
// png holding the base64 of a 64×64 PNG (guests: presets only). With no
// identity at all, 401: the page should get a guest id and ask again.
export async function profileApi(request, env) {
  const userId = request.headers.get("X-Yard-User-Id") ?? "";
  const email = request.headers.get("X-Yard-Email") ?? "";
  const guestId = userId ? "" : request.headers.get("X-Yard-Guest-Id") ?? "";
  const key = profileKey(userId, guestId);
  if (!key) return Response.json({ error: "Sign in, or play as a guest.", guest: "__yard/auth/guest" }, { status: 401 });

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
  if (!NAME_RE.test(name)) return error("Names are 3–16 letters, digits or underscores.", 400);
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
    skin = `custom:${await saveSkin(env, png, key)}`;
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
     ON CONFLICT (user_id) DO UPDATE SET name = excluded.name, skin = excluded.skin, model = excluded.model, updated_at = excluded.updated_at`,
  )
    .bind(key, name, skin, model, Date.now())
    .run();
  return Response.json({ profile: { name, skin, model } });
}

// Why a PNG can't be a skin, or null when it can: it must be a real PNG,
// 64×64 (the client converts old 64×32 skins first) and small.
function checkSkinPng(png) {
  if (png.length > MAX_SKIN_BYTES) return "Skins must be under 24 KB.";
  const sig = [137, 80, 78, 71, 13, 10, 26, 10];
  if (png.length < 33 || sig.some((b, i) => png[i] !== b)) return "Skins must be PNG images.";
  const view = new DataView(png.buffer, png.byteOffset, png.byteLength);
  if (view.getUint32(16) !== 64 || view.getUint32(20) !== 64) return "Skins must be 64×64 pixels.";
  return null;
}

// Stores a skin under the hash of its bytes, so the same image is stored
// once; returns its id.
async function saveSkin(env, png, owner) {
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", png));
  const id = [...digest.slice(0, 16)].map((b) => b.toString(16).padStart(2, "0")).join("");
  await env.DB.prepare("INSERT INTO skins (id, png, owner, created_at) VALUES (?1, ?2, ?3, ?4) ON CONFLICT (id) DO NOTHING")
    .bind(id, toBase64(png), owner, Date.now())
    .run();
  return id;
}

// A skin's PNG. Ids are content hashes, so a skin never changes and caches
// forever.
export async function serveSkin(env, id) {
  const row = await env.DB.prepare("SELECT png FROM skins WHERE id = ?1").bind(id).first();
  if (!row) return new Response("Not found", { status: 404 });
  return new Response(fromBase64(row.png), {
    headers: { "Content-Type": "image/png", "Cache-Control": "private, max-age=31536000, immutable" },
  });
}
