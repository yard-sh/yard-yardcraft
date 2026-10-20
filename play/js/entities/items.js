// Items lying in the world: little spinning blocks that fall, slide and
// settle (Minecraft's item physics), and get picked up when you walk into
// them. The server says where each started and how it was thrown; every
// client runs the same fall from there.
import * as THREE from "three";
import { STACK } from "../shared/inventory.js";
import { playSound } from "../audio/sounds.js";
import { scene, atlas } from "../render/renderer.js";
import { itemGeometry, isFlatItem } from "../render/item-mesh.js";
import { modelLight } from "../render/sky.js";
import { on, send } from "../net.js";
import { game, player, health, solidAt } from "../game/state.js";
import { inventory } from "../game/inventory.js";
import { others } from "./players.js";

const LIFETIME_MS = 5 * 60 * 1000;
const SIZE = 0.25, HALF = SIZE / 2;
const GRAVITY = 16; // blocks/s², Minecraft's 0.04 per tick
const AIR_DRAG = Math.pow(0.98, 20), GROUND_DRAG = Math.pow(0.6 * 0.98, 20); // per second
const SHOW_WITHIN = 80; // blocks; farther items are hidden and left still
const ASK_EVERY_MS = 300;

const items = new Map(); // id -> item

function solidBox(p) {
  for (const y of [p.y, p.y + SIZE - 1e-3])
    for (const x of [p.x - HALF, p.x + HALF])
      for (const z of [p.z - HALF, p.z + HALF]) if (solidAt(Math.floor(x), Math.floor(y), Math.floor(z))) return true;
  return false;
}

function stepItem(it, dt) {
  const p = it.pos, v = it.vel;
  // Inside a block (placed on, or spilled into a wall): pop out on top.
  for (let i = 0; i < 3 && solidBox(p); i++) p.y = Math.floor(p.y) + 1;
  v.y -= GRAVITY * dt;
  it.onGround = false;
  for (const axis of ["x", "y", "z"]) {
    p[axis] += v[axis] * dt;
    if (!solidBox(p)) continue;
    p[axis] -= v[axis] * dt;
    if (axis === "y" && v.y < 0) it.onGround = true;
    v[axis] = 0;
  }
  const drag = Math.pow(it.onGround ? GROUND_DRAG : AIR_DRAG, dt);
  v.x *= drag;
  v.z *= drag;
  v.y *= Math.pow(AIR_DRAG, dt);
}

// How many little cubes show a stack, as in Minecraft.
const cubesFor = (n) => (n === 1 ? 1 : n <= 16 ? 2 : n <= 32 ? 3 : 4);

// Blocks are little cubes in a loose heap; flat items stand up as sprites,
// stacked a little apart.
function buildCubes(it) {
  it.group.clear();
  const geo = itemGeometry(it.b), flat = isFlatItem(it.b);
  for (let i = 0, k = cubesFor(it.n); i < k; i++) {
    const m = new THREE.Mesh(geo, it.material);
    if (flat) {
      m.scale.setScalar(SIZE * 2);
      m.position.set(i * 0.03, 0.15 + i * 0.03, -i * 0.04);
    } else {
      m.scale.setScalar(SIZE);
      m.position.set(i ? (((i * 37) % 7) / 7 - 0.5) * 0.12 : 0, i * 0.03, i ? (((i * 53) % 5) / 5 - 0.5) * 0.12 : 0);
    }
    m.castShadow = true;
    it.group.add(m);
  }
}

// Adds an item the server told us about, or updates its count.
export function showItem(msg) {
  const now = performance.now();
  const old = items.get(msg.id);
  if (old) {
    if (old.n !== msg.n) (old.n = msg.n), buildCubes(old);
    return;
  }
  const it = {
    id: msg.id,
    b: msg.b,
    n: msg.n,
    pos: new THREE.Vector3(...msg.p),
    vel: new THREE.Vector3(...msg.v),
    bornAt: now - msg.age,
    readyAt: now + msg.wait,
    askedAt: 0,
    onGround: false,
    leaving: null, // { to, t } while flying into whoever picked it up
    group: new THREE.Group(),
    material: new THREE.MeshLambertMaterial({ map: atlas, alphaTest: 0.5 }),
    spin: Math.random() * Math.PI * 2,
  };
  buildCubes(it);
  // Catch up on the fall it's had since it was dropped.
  for (let t = Math.min(msg.age / 1000, 3); t > 0; t -= 0.05) stepItem(it, 0.05);
  scene.add(it.group);
  items.set(it.id, it);
}

function removeItem(it) {
  scene.remove(it.group);
  it.material.dispose();
  items.delete(it.id);
}

export function clearItems() {
  for (const it of [...items.values()]) removeItem(it);
}

// Whether a stack of item b would fit (at least partly) in your inventory.
const hasRoom = (b) => inventory.slots.some((s) => !s || (s[0] === b && s[1] < STACK));

export function updateItems(dt, now) {
  const p = player.pos;
  for (const it of items.values()) {
    if (now - it.bornAt > LIFETIME_MS) {
      removeItem(it);
      continue;
    }
    if (it.leaving) {
      // Picked up: fly into the picker, then go.
      it.leaving.t += dt / 0.15;
      it.group.position.lerp(it.leaving.to, Math.min(1, it.leaving.t));
      if (it.leaving.t >= 1) removeItem(it);
      continue;
    }
    const near = Math.abs(it.pos.x - p.x) < SHOW_WITHIN && Math.abs(it.pos.z - p.z) < SHOW_WITHIN;
    it.group.visible = near;
    if (!near) continue;
    stepItem(it, dt);
    // Spinning and bobbing, as items do.
    it.spin += dt * 1.6;
    it.group.position.set(it.pos.x, it.pos.y + 0.1 + Math.sin(it.spin * 1.3) * 0.05, it.pos.z);
    it.group.rotation.y = it.spin;
    it.material.color.setScalar(modelLight(it.pos.x, it.pos.y + 0.2, it.pos.z));

    // Walking into it picks it up (your reach for items, as in Minecraft:
    // a block around you, half a block above and below).
    const dx = Math.abs(it.pos.x - p.x), dz = Math.abs(it.pos.z - p.z), dy = it.pos.y - p.y;
    const touching = dx < 1.3 && dz < 1.3 && dy > -0.5 && dy < 2.3;
    if (touching && game.self && !health.dead && now >= it.readyAt && now - it.askedAt > ASK_EVERY_MS && hasRoom(it.b)) {
      it.askedAt = now;
      send({ type: "pickup", id: it.id });
    }
  }
}

// How many items are within r blocks of you, for the debug screen.
export const itemsNear = (r) => [...items.values()].filter((it) => it.pos.distanceTo(player.pos) < r).length;

on("item", (msg) => showItem(msg.item));

on("itemgone", (msg) => {
  const it = items.get(msg.id);
  if (!it) return;
  const picker = msg.by === game.self?.id ? player.pos : others.get(msg.by)?.model.root.position;
  if (!picker) return removeItem(it);
  playSound("pop", it.pos.x, it.pos.y, it.pos.z, { volume: 0.35, rate: 1.4 + Math.random() * 0.6 });
  it.leaving = { to: picker.clone().setY(picker.y + 0.8), t: 0 };
});
