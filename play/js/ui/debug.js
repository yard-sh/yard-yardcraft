// The top-left corner: the connection state while connecting, otherwise a
// hint, and the debug screen (F3, as in Minecraft; tap the hint on touch)
// with frame rate, latency, position and what the engine is doing.
import { SY, MAX_HP } from "../shared/rules.js";
import { DEF } from "../world/blocks.js";
import { settings } from "../core/settings.js";
import { $, el } from "../core/dom.js";
import { renderer } from "../render/renderer.js";
import { dayPhase } from "../render/sky.js";
import { worldName, latency } from "../net.js";
import { game, player, health, blockAt } from "../game/state.js";
import { raycast } from "../game/raycast.js";
import { VIEW_NAMES } from "../game/camera.js";
import { others } from "../entities/players.js";
import { itemsNear } from "../entities/items.js";
import { mobsNear, mobCount } from "../entities/mobs.js";
import { touchMode } from "../input/session.js";

const statusEl = $("status");
const debugEl = $("debug");
const REFRESH_MS = 250;
let open = false;
let connection = "Connecting…"; // shown instead of the hint; null once connected

// Frame rate, measured over each refresh (real time: the frame loop's dt is
// capped for the physics).
let frames = 0, since = performance.now(), lastRefresh = 0;
let fps = 0, frameMs = 0;

// What the corner says while the debug screen is closed: the connection
// state, or how to open it.
export function setConnection(text) {
  connection = text;
  renderCorner();
}

function renderCorner() {
  statusEl.textContent = connection ?? (touchMode() ? "Tap for debug info" : "F3 for debug info");
  statusEl.hidden = open && !connection;
  debugEl.hidden = !open;
}

export function toggleDebug() {
  open = !open;
  lastRefresh = 0; // draw it right away
  renderCorner();
}
statusEl.addEventListener("click", () => touchMode() && !connection && toggleDebug());
debugEl.addEventListener("click", () => touchMode() && toggleDebug());

// Each frame; redraws the screen a few times a second while it's open.
export function updateDebug(now) {
  frames++;
  if (now - since >= REFRESH_MS) {
    fps = Math.round((frames * 1000) / (now - since));
    frameMs = (now - since) / frames;
    frames = 0;
    since = now;
  }
  if (now - lastRefresh < REFRESH_MS) return;
  lastRefresh = now;
  renderCorner();
  if (open) debugEl.replaceChildren(...lines().map(([left, right]) => el("div", {}, el("b", { textContent: left }), right)));
}

const fixed = (v, n = 2) => v.toFixed(n);
const FACING = ["north (-Z)", "west (-X)", "south (+Z)", "east (+X)"];

function lines() {
  const p = player.pos, world = game.world;
  const bx = Math.floor(p.x), by = Math.floor(p.y), bz = Math.floor(p.z);
  const yaw = ((player.yaw % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  const [sky, blk] = world ? world.getLight(bx, Math.min(SY - 1, by), bz) : [15, 0];
  const hit = world ? raycast(8)?.hit : null;
  let meshed = 0;
  for (const c of world?.chunks.values() ?? []) meshed += c.meshed;
  const hours = (dayPhase * 24 + 6) % 24; // sunrise is 6:00
  const clock = `${String(Math.floor(hours)).padStart(2, "0")}:${String(Math.floor((hours % 1) * 60)).padStart(2, "0")}`;
  const motion = [
    player.flying ? "flying" : player.onGround ? "on ground" : "in the air",
    player.sprinting && "sprinting",
    player.sneaking && "sneaking",
  ].filter(Boolean);
  const { render, memory } = renderer.info;
  return [
    ["Yardcraft ", `world “${worldName}” · seed ${world?.seed ?? "?"} · generation ${world?.gen ?? "?"}`],
    ["Performance ", `${fps} fps (${fixed(frameMs, 1)} ms/frame)`],
    ["Latency ", latency === null ? "measuring…" : `${latency} ms`],
    ["XYZ ", `${fixed(p.x, 3)} / ${fixed(p.y, 3)} / ${fixed(p.z, 3)}`],
    ["Block ", `${bx} ${by} ${bz} · chunk ${bx >> 4} ${bz >> 4} (at ${bx & 15} ${bz & 15})`],
    ["Facing ", `${FACING[Math.round(yaw / (Math.PI / 2)) % 4]} · yaw ${fixed((yaw * 180) / Math.PI, 1)}° pitch ${fixed((player.pitch * 180) / Math.PI, 1)}°`],
    ["Looking at ", hit ? `${DEF[blockAt(...hit)]?.name ?? "?"} at ${hit.join(" ")}` : "nothing"],
    ["Light ", `sky ${sky} · block ${blk}`],
    ["Moving ", `${motion.join(", ")} · ${fixed(Math.hypot(player.vel.x, player.vel.z))} blocks/s`],
    ["Mode ", game.mode],
    ["Health ", `${health.hp}/${MAX_HP}${health.dead ? " (dead)" : ""}`],
    ["Items ", `${itemsNear(32)} on the ground within 32 blocks`],
    ["Mobs ", `${mobsNear(32)} within 32 blocks · ${mobCount()} known`],
    ["Time ", `${clock} (day ${fixed(dayPhase * 100, 0)}%)`],
    ["Players ", `${others.size + (game.self ? 1 : 0)} online`],
    ["Chunks ", `${world?.chunks.size ?? 0} loaded · ${meshed} drawn · render distance ${settings.distance}`],
    ["Renderer ", `${render.calls} draw calls · ${Math.round(render.triangles / 1000)}k triangles · ${memory.geometries} geometries`],
    ["Graphics ", `shadows ${settings.shadows ? "on" : "off"} · fov ${settings.fov} · ${VIEW_NAMES[settings.view].toLowerCase()} · ${innerWidth}×${innerHeight} @${fixed(renderer.getPixelRatio(), 1)}x`],
  ];
}
