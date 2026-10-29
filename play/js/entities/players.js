// Everyone else in the world: their models, name tags, movement, swings and
// sounds, kept up to date from the room's messages.
import * as THREE from "three";
import { AIR, DEF } from "../world/blocks.js";
import { createPlayerModel } from "../skins/model.js";
import { skinEntry } from "../skins/cache.js";
import { playBlockSound } from "../audio/sounds.js";
import { scene } from "../render/renderer.js";
import { modelLight } from "../render/sky.js";
import { esc } from "../core/dom.js";
import { on } from "../net.js";
import { game, blockAt, displayName } from "../game/state.js";
import { EYE, SNEAK_EYE, STEP_EVERY, groundBlock } from "../game/player.js";
import { raycast } from "../game/raycast.js";
import { HIT_EVERY } from "../game/interact.js";
import { buildSelf } from "./avatar.js";
import { setMode } from "../game/inventory.js";
import { renderPlayers } from "../ui/hud.js";
import { logLine } from "../ui/chat.js";

export const others = new Map(); // id -> the player, as the server describes them, plus our own bits

function nameTag(text) {
  const c = document.createElement("canvas");
  const g = c.getContext("2d");
  const font = "bold 28px ui-monospace, Menlo, monospace";
  g.font = font;
  c.width = Math.ceil(g.measureText(text).width) + 20;
  c.height = 40;
  g.font = font; // resizing the canvas reset it
  g.fillStyle = "rgba(0,0,0,0.5)";
  g.fillRect(0, 0, c.width, c.height);
  g.fillStyle = "#fff";
  g.textBaseline = "middle";
  g.fillText(text, 10, 21);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), depthTest: false }));
  sprite.scale.set((c.width / c.height) * 0.35, 0.35, 1);
  sprite.position.y = 2.2;
  sprite.renderOrder = 10;
  return sprite;
}

// Adds a player, or rebuilds one (a new look) where they stand.
function addOther(p) {
  const old = others.get(p.id);
  removeOther(p.id);
  const model = createPlayerModel(skinEntry(p.skin).texture, p.model === "slim");
  const tag = nameTag(displayName(p));
  model.root.add(tag);
  model.root.position.fromArray(p.p);
  if (old) model.root.position.copy(old.model.root.position);
  scene.add(model.root);
  others.set(p.id, {
    ...p,
    model,
    tag,
    target: new THREE.Vector3().fromArray(p.p), // where the server says they are
    yaw: old?.yaw ?? p.ry, // the smoothed facing
    pitch: old?.pitch ?? p.rx ?? 0, // the smoothed up/down look
    deadAt: -1e9,
    speed: 0,
    last: model.root.position.clone(),
    stepDist: 0,
    hitTimer: 0,
  });
  renderPlayers();
}

function removeOther(id) {
  const o = others.get(id);
  if (!o) return;
  scene.remove(o.model.root);
  o.model.dispose();
  o.tag.material.map.dispose();
  o.tag.material.dispose();
  others.delete(id);
  renderPlayers();
}

// Replaces everyone with the room's list (on connecting).
// After a world reset, everyone is at the new spawn: jump them there rather
// than leaving them in the old world's spot until they next move.
export function moveOthersTo(p) {
  for (const o of others.values()) {
    o.target.fromArray(p);
    o.model.root.position.copy(o.target);
    o.last.copy(o.target);
  }
}

export function setOthers(list) {
  for (const id of [...others.keys()]) removeOther(id);
  for (const p of list) addOther(p);
}

// Glides each player toward where the server last put them, and animates them.
export function animateOthers(dt, now) {
  const k = 1 - Math.exp(-dt * 12);
  for (const o of others.values()) {
    const root = o.model.root;
    root.position.lerp(o.target, k);
    const moved = Math.hypot(root.position.x - o.last.x, root.position.z - o.last.z);
    o.last.copy(root.position);
    o.speed += (moved / Math.max(dt, 1e-3) - o.speed) * Math.min(1, dt * 10);
    o.yaw += Math.atan2(Math.sin(o.ry - o.yaw), Math.cos(o.ry - o.yaw)) * k;
    o.pitch += ((o.rx ?? 0) - o.pitch) * k;
    o.model.animate(dt, { yaw: o.yaw, pitch: o.pitch, speed: o.speed, sneaking: !!(o.s & 1), swinging: !!(o.s & 2) });
    o.tag.position.y = o.s & 1 ? 2.0 : 2.2;
    o.model.shade(modelLight(root.position.x, root.position.y + 1, root.position.z), now, o);
    // The dead fall over, then vanish.
    root.visible = !o.dead || now - o.deadAt < 1500;
    if (!o.dead) playerSounds(o, moved, dt);
  }
}

// A player's footsteps, and the knocks of the block they're breaking (found
// by looking where they look).
const eye = new THREE.Vector3(), dir = new THREE.Vector3();
function playerSounds(o, moved, dt) {
  const p = o.model.root.position;
  const under = Math.abs(p.y - o.target.y) < 0.3 ? groundBlock(p) : AIR;
  if (under) {
    o.stepDist += moved;
    if (o.stepDist > STEP_EVERY) {
      o.stepDist = 0;
      playBlockSound(DEF[under], "step", p.x, p.y, p.z, o.s & 1 ? 0.5 : 1);
    }
  }
  o.hitTimer -= dt;
  if (o.s & 2 && o.hitTimer <= 0) {
    o.hitTimer = HIT_EVERY;
    const pitch = o.rx ?? 0, c = Math.cos(pitch);
    eye.set(p.x, p.y + (o.s & 1 ? SNEAK_EYE : EYE), p.z);
    dir.set(-Math.sin(o.ry) * c, Math.sin(pitch), -Math.cos(o.ry) * c);
    const r = raycast(6, eye, dir);
    if (r) playBlockSound(DEF[blockAt(...r.hit)], "hit", r.hit[0] + 0.5, r.hit[1] + 0.5, r.hit[2] + 0.5);
  }
}

// ---------------------------------------------------------------- messages

const nameHtml = (p) => `<b style="color:${esc(p.color)}">${esc(displayName(p))}</b>`;

on("join", (msg) => {
  addOther(msg.player);
  logLine(`${nameHtml(msg.player)} joined`);
});

on("leave", (msg) => {
  const o = others.get(msg.id);
  if (o) logLine(`${nameHtml(o)} left`);
  removeOther(msg.id);
});

on("move", (msg) => {
  const o = others.get(msg.id);
  if (!o) return;
  o.target.fromArray(msg.p);
  if (o.snap) {
    // Back from the dead at spawn: jump there instead of gliding.
    o.model.root.position.copy(o.target);
    o.last.copy(o.target);
    o.snap = false;
  }
  o.ry = msg.ry;
  o.rx = msg.rx;
  o.s = msg.s;
});

on("swing", (msg) => others.get(msg.id)?.model.swing());

// Someone (maybe you) switched between survival and creative.
on("mode", (msg) => {
  if (msg.id === game.self?.id) setMode(msg.mode);
  else if (others.has(msg.id)) others.get(msg.id).mode = msg.mode;
});

// Someone (maybe you) saved a new name or look.
on("profile", ({ player: p }) => {
  if (p.id === game.self?.id) {
    game.self = { ...game.self, ...p };
    buildSelf();
    renderPlayers();
  } else if (others.has(p.id)) {
    const o = others.get(p.id);
    addOther({ ...p, p: o.target.toArray(), ry: o.ry, rx: o.rx, s: o.s });
  }
});
