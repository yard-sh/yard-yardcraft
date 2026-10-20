// Mobs in the world: their models, walking along the paths the room plans
// for them (pathAt in shared/mobs.js, the same sum the server does), legs
// swinging, heads turning to look at players, hurt and dying as players
// do, grunting now and then.
import * as THREE from "three";
import { MOBS, pathAt } from "../shared/mobs.js";
import { AIR, DEF } from "../world/blocks.js";
import { buildBoxModel, healthLook } from "../render/box-model.js";
import { MOB_LOOKS, mobTexture } from "../mobs/index.js";
import { playSound, playBlockSound } from "../audio/sounds.js";
import { scene } from "../render/renderer.js";
import { modelLight } from "../render/sky.js";
import { on } from "../net.js";
import { player } from "../game/state.js";
import { groundBlock, STEP_EVERY } from "../game/player.js";
import { rayBox } from "../game/raycast.js";
import { others } from "./players.js";

const SHOW_WITHIN = 96; // blocks; farther mobs are hidden and left still
const LOOK_WITHIN = 6; // blocks; mobs watch players this close
const GONE_AFTER_MS = 1000; // a dead mob lies there this long, then puffs away

const mobs = new Map(); // id -> mob

const angleTo = (from, to) => Math.atan2(Math.sin(to - from), Math.cos(to - from));
const between = (a, b) => a + Math.random() * (b - a);

function addMob(msg, now) {
  const look = MOB_LOOKS[msg.kind];
  if (!look || !MOBS[msg.kind]) return;
  const model = buildBoxModel(look.model, mobTexture(msg.kind));
  model.root.rotation.order = "YXZ"; // tips over sideways, whichever way it faces
  scene.add(model.root);
  const m = {
    id: msg.id,
    kind: MOBS[msg.kind],
    look,
    model,
    pos: new THREE.Vector3(),
    placed: false, // whether pos has been put anywhere yet
    yaw: msg.ry,
    moving: 0, // smoothed speed over the ground, for the walk animation
    walk: 0,
    head: { yaw: 0, pitch: 0, glanceYaw: 0, glancePitch: 0, glanceAt: 0 },
    hurtAt: -1e9,
    dead: false,
    deadAt: 0,
    soundAt: now + between(2000, 12000),
    stepDist: 0,
  };
  mobs.set(m.id, m);
  setPath(m, msg, now);
}

function setPath(m, msg, now) {
  Object.assign(m, { path: msg.path, speed: msg.speed, ry: msg.ry, hp: msg.hp, start: now - msg.age });
}

function removeMob(m) {
  scene.remove(m.model.root);
  m.model.dispose();
  mobs.delete(m.id);
}

// Replaces every mob with the room's list (on connecting).
export function setMobs(list) {
  for (const m of [...mobs.values()]) removeMob(m);
  const now = performance.now();
  for (const msg of list ?? []) addMob(msg, now);
}

const soundAt = (m, name, opts) => name && playSound(name, m.pos.x, m.pos.y + 0.6, m.pos.z, opts);

on("mob", ({ mob }) => {
  const now = performance.now();
  const m = mobs.get(mob.id);
  if (m && !m.dead) setPath(m, mob, now);
  else if (!m) addMob(mob, now);
});

on("mobhurt", (msg) => {
  const m = mobs.get(msg.id);
  if (!m) return;
  m.hp = msg.hp;
  m.hurtAt = performance.now();
  if (msg.hp > 0) soundAt(m, m.look.motion.sounds.hurt, { volume: 0.8 });
});

on("mobdeath", (msg) => {
  const m = mobs.get(msg.id);
  if (!m) return;
  Object.assign(m, { dead: true, deadAt: performance.now(), moving: 0 });
  soundAt(m, m.look.motion.sounds.death, { volume: 0.9, rate: 0.75 });
});

on("mobgone", (msg) => {
  const m = mobs.get(msg.id);
  if (m) removeMob(m);
});

// ---------------------------------------------------------------- each frame

// The nearest player (you or anyone else) within LOOK_WITHIN of a point.
function nearestPlayer(p) {
  let best = null, bestD = LOOK_WITHIN;
  const consider = (q, eye) => {
    const d = Math.hypot(q.x - p.x, q.z - p.z);
    if (d < bestD) (best = { x: q.x, y: q.y + eye, z: q.z }), (bestD = d);
  };
  consider(player.pos, player.sneaking ? 1.27 : 1.62);
  for (const o of others.values()) if (!o.dead) consider(o.model.root.position, 1.62);
  return best;
}

// The head watches the nearest player, or glances about now and then.
function turnHead(m, dt, now) {
  const head = m.model.parts[m.look.motion.head];
  if (!head) return;
  const h = m.head;
  const eye = { x: m.pos.x, y: m.pos.y + head.position.y, z: m.pos.z };
  const q = nearestPlayer(eye);
  let yaw, pitch;
  if (q && !m.dead) {
    yaw = angleTo(m.yaw, Math.atan2(-(q.x - eye.x), -(q.z - eye.z)));
    pitch = Math.atan2(q.y - eye.y, Math.hypot(q.x - eye.x, q.z - eye.z));
  } else {
    if (now > h.glanceAt) {
      h.glanceAt = now + between(2000, 6000);
      const still = Math.random() < 0.4;
      h.glanceYaw = still ? 0 : between(-0.9, 0.9);
      h.glancePitch = still ? 0 : between(-0.3, 0.2);
    }
    yaw = h.glanceYaw;
    pitch = h.glancePitch;
  }
  yaw = Math.max(-1.2, Math.min(1.2, yaw));
  pitch = Math.max(-0.7, Math.min(0.7, pitch));
  const k = Math.min(1, dt * 8);
  h.yaw += (yaw - h.yaw) * k;
  h.pitch += (pitch - h.pitch) * k;
  head.rotation.y = h.yaw;
  head.rotation.x = h.pitch;
}

export function updateMobs(dt, now) {
  updatePuffs(dt);
  const me = player.pos;
  for (const m of mobs.values()) {
    const root = m.model.root;
    if (m.dead && now - m.deadAt > GONE_AFTER_MS) {
      puff(m.pos.x, m.pos.y + m.kind.box[1] / 2, m.pos.z);
      removeMob(m);
      continue;
    }
    const at = pathAt(m.path, m.speed, (now - m.start) / 1000, m.ry);
    const near = Math.abs(at.x - me.x) < SHOW_WITHIN && Math.abs(at.z - me.z) < SHOW_WITHIN;
    root.visible = near;
    if (!near) continue;

    // Glide to where the path says it is: smooth even when a new path
    // starts from a slightly different spot.
    const last = m.pos.clone();
    if (m.dead) {
      // Lies where it fell.
    } else if (!m.placed) {
      m.pos.set(at.x, at.y + at.hop, at.z);
      m.placed = true;
    } else {
      m.pos.lerp({ x: at.x, y: at.y + at.hop, z: at.z }, 1 - Math.exp(-dt * 20));
    }
    const moved = Math.hypot(m.pos.x - last.x, m.pos.z - last.z);
    m.moving += (moved / Math.max(dt, 1e-3) - m.moving) * Math.min(1, dt * 10);
    m.yaw += angleTo(m.yaw, at.yaw) * Math.min(1, dt * 10);
    root.position.copy(m.pos);
    root.rotation.y = m.yaw;

    // Legs swing in pairs with the distance walked.
    const { legs, swing, stride } = m.look.motion;
    m.walk += m.moving * dt * stride;
    const amount = Math.min(1, m.moving / m.kind.walk) * swing;
    for (const [name, sign] of Object.entries(legs)) m.model.parts[name].rotation.x = Math.sin(m.walk) * amount * sign;
    turnHead(m, dt, now);

    // Light, the hurt flash, and tipping over when dead.
    const k = modelLight(m.pos.x, m.pos.y + 0.5, m.pos.z);
    const { red, tip } = healthLook(now, m);
    m.model.mat.color.setRGB(k, red ? k * 0.4 : k, red ? k * 0.4 : k);
    root.rotation.z = tip;
    if (!m.dead) mobSounds(m, moved, at, now);
  }
}

function mobSounds(m, moved, at, now) {
  if (now > m.soundAt) {
    m.soundAt = now + between(6000, 12000);
    soundAt(m, m.look.motion.sounds.ambient, { volume: 0.6 });
  }
  if (at.hop) return;
  m.stepDist += moved;
  if (m.stepDist > STEP_EVERY) {
    m.stepDist = 0;
    const under = groundBlock(m.pos);
    if (under !== AIR) playBlockSound(DEF[under], "step", m.pos.x, m.pos.y, m.pos.z, 0.5);
  }
}

// ---------------------------------------------------------------- death puffs

// A little cloud where a dead mob was: grey cubes that drift up and fade.
const puffs = [];
const puffGeo = new THREE.BoxGeometry(0.14, 0.14, 0.14);

function puff(x, y, z) {
  const mat = new THREE.MeshBasicMaterial({ color: 0xdddddd, transparent: true, depthWrite: false });
  const bits = Array.from({ length: 10 }, () => {
    const mesh = new THREE.Mesh(puffGeo, mat);
    mesh.position.set(x + between(-0.35, 0.35), y + between(-0.3, 0.3), z + between(-0.35, 0.35));
    scene.add(mesh);
    return { mesh, v: new THREE.Vector3(between(-0.6, 0.6), between(0.4, 1.2), between(-0.6, 0.6)) };
  });
  puffs.push({ bits, mat, t: 0 });
}

function updatePuffs(dt) {
  for (let i = puffs.length - 1; i >= 0; i--) {
    const p = puffs[i];
    p.t += dt / 0.7;
    p.mat.opacity = Math.max(0, 1 - p.t);
    for (const b of p.bits) {
      b.mesh.position.addScaledVector(b.v, dt);
      b.mesh.scale.setScalar(1 + p.t);
    }
    if (p.t < 1) continue;
    for (const b of p.bits) scene.remove(b.mesh);
    p.mat.dispose();
    puffs.splice(i, 1);
  }
}

// ---------------------------------------------------------------- queries

const boxOf = (m) => {
  const half = m.kind.box[0] / 2;
  return [m.pos.x - half, m.pos.y, m.pos.z - half, m.pos.x + half, m.pos.y + m.kind.box[1], m.pos.z + half];
};

// The living mob a ray from o along d hits first within maxDist, as
// { mob, t }, or null.
export function aimedMob(o, d, maxDist) {
  let best = null;
  for (const m of mobs.values()) {
    if (m.dead || !m.model.root.visible) continue;
    const t = rayBox(o, d, ...boxOf(m));
    if (t !== null && t < (best?.t ?? maxDist)) best = { mob: m, t };
  }
  return best;
}

// Whether any living mob is in the box (for not placing blocks in them).
export function mobInBox(x0, y0, z0, x1, y1, z1) {
  for (const m of mobs.values()) {
    if (m.dead) continue;
    const [a0, b0, c0, a1, b1, c1] = boxOf(m);
    if (a0 < x1 && a1 > x0 && b0 < y1 && b1 > y0 && c0 < z1 && c1 > z0) return true;
  }
  return false;
}

// For the debug screen: how many mobs are within r blocks of you, and in all.
export const mobsNear = (r) => [...mobs.values()].filter((m) => m.pos.distanceTo(player.pos) < r).length;
export const mobCount = () => mobs.size;
export const mobList = () => [...mobs.values()];
