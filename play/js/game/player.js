// Your body: walking, sprinting, sneaking, swimming and flying with
// Minecraft's numbers, collisions, fall damage, footsteps and spawning.
import * as THREE from "three";
import { SY, MAX_HP } from "../shared/rules.js";
import { AIR, WATER, DEF } from "../world/blocks.js";
import { findSpawn } from "../world/terrain.js";
import { settings } from "../core/settings.js";
import { playBlockSound } from "../audio/sounds.js";
import { send } from "../net.js";
import { game, player, health, eyePos, controls, blockAt, solidAt } from "./state.js";

// Blocks per second. Sprint with a double-tapped W or Ctrl while moving
// forward; Shift sneaks on foot and sinks while flying.
const WALK = 4.317, SPRINT = 5.612, SNEAK = 1.31;
const FLY_SPEED = 10.92, FLY_SPRINT = 21.6, FLY_CLIMB = 7.5;
const JUMP = 9, GRAVITY = 28;
const WATER_EXIT = 7.5; // upward speed when climbing out onto a bank
export const HALF_W = 0.3, HEIGHT = 1.8, EYE = 1.62, SNEAK_EYE = 1.27;
// A footstep every 1.67 blocks walked, as in Minecraft.
export const STEP_EVERY = 1 / 0.6;

function collides(p) {
  const x0 = Math.floor(p.x - HALF_W), x1 = Math.floor(p.x + HALF_W - 1e-6);
  const y0 = Math.floor(p.y), y1 = Math.floor(p.y + HEIGHT - 1e-6);
  const z0 = Math.floor(p.z - HALF_W), z1 = Math.floor(p.z + HALF_W - 1e-6);
  for (let x = x0; x <= x1; x++)
    for (let y = y0; y <= y1; y++)
      for (let z = z0; z <= z1; z++) if (solidAt(x, y, z)) return true;
  return false;
}

// Whether any block is under the player's feet, for sneaking's edge guard.
function supported(p) {
  const y = Math.floor(p.y - 0.05);
  for (let x = Math.floor(p.x - HALF_W); x <= Math.floor(p.x + HALF_W - 1e-6); x++)
    for (let z = Math.floor(p.z - HALF_W); z <= Math.floor(p.z + HALF_W - 1e-6); z++) if (solidAt(x, y, z)) return true;
  return false;
}

// The block a player at p stands on: under the middle, else under a corner
// (standing on an edge).
export function groundBlock(p) {
  const y = Math.floor(p.y - 0.2);
  let b = blockAt(Math.floor(p.x), y, Math.floor(p.z));
  if (b > 0 && DEF[b].solid) return b;
  for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    b = blockAt(Math.floor(p.x + dx * HALF_W), y, Math.floor(p.z + dz * HALF_W));
    if (b > 0 && DEF[b].solid) return b;
  }
  return AIR;
}

// Where the player looks, as a unit vector.
export function lookDir(out = new THREE.Vector3()) {
  const c = Math.cos(player.pitch);
  return out.set(-Math.sin(player.yaw) * c, Math.sin(player.pitch), -Math.cos(player.yaw) * c);
}

// ---------------------------------------------------------------- spawning

// Spawn on land near the middle of the world; the player is placed once
// that chunk (with its edits) has loaded.
export function spawn() {
  const [x, z] = findSpawn(game.world.seed);
  player.pos.set(x, SY, z);
  player.vel.set(0, 0, 0);
  player.flying = false;
  player.sprinting = false;
  player.fallDist = 0;
  player.knock.x = player.knock.z = 0;
  health.voidSent = false;
  game.spawnPending = true;
}

function finishSpawn() {
  const x = Math.floor(player.pos.x), z = Math.floor(player.pos.z);
  if (!game.world.get(x >> 4, z >> 4)?.ready) return;
  let y = SY - 1;
  while (y > 0 && !DEF[blockAt(x, y - 1, z)].solid) y--;
  player.pos.y = y;
  game.spawnPending = false;
}

// ---------------------------------------------------------------- movement

export function step(dt) {
  const p = player.pos;
  eyePos.set(p.x, p.y + player.eye, p.z);
  // Hold still until the ground here has loaded.
  if (game.spawnPending) return finishSpawn();
  if (!game.world.get(Math.floor(p.x) >> 4, Math.floor(p.z) >> 4)?.ready) return;

  const { keys } = controls;
  const shift = keys.has("ShiftLeft") || keys.has("ShiftRight");
  // Keys and the touch joystick add up; the joystick is analog, so a half
  // push walks at half speed.
  let fx = controls.move.x, fz = controls.move.z;
  if (keys.has("KeyW")) fz -= 1;
  if (keys.has("KeyS")) fz += 1;
  if (keys.has("KeyA")) fx -= 1;
  if (keys.has("KeyD")) fx += 1;
  const forward = fz < -0.5;
  const swimming = !player.flying && blockAt(Math.floor(p.x), Math.floor(p.y + 0.4), Math.floor(p.z)) === WATER;
  const sneaking = shift && !player.flying && !swimming;
  player.sneaking = sneaking;
  // Sprinting lasts while moving forward; Ctrl starts it too. Sneaking stops it.
  if (forward && (keys.has("ControlLeft") || keys.has("ControlRight") || controls.sprintArmed)) {
    player.sprinting = true;
    controls.sprintArmed = false;
  }
  if (!forward || sneaking) player.sprinting = false;
  let speed = player.flying
    ? player.sprinting ? FLY_SPRINT : FLY_SPEED
    : sneaking ? SNEAK : player.sprinting ? SPRINT : WALK;
  if (swimming) speed *= 0.55;
  const len = Math.max(1, Math.hypot(fx, fz));
  const sin = Math.sin(player.yaw), cos = Math.cos(player.yaw);
  player.vel.x = ((fx * cos + fz * sin) / len) * speed + player.knock.x;
  player.vel.z = ((-fx * sin + fz * cos) / len) * speed + player.knock.z;
  const drag = Math.exp(-dt * (player.onGround ? 10 : 1.5));
  player.knock.x *= drag;
  player.knock.z *= drag;
  if (player.flying) {
    // No gravity: Space rises, Shift sinks, and letting go eases to a hover.
    const climb = ((keys.has("Space") ? 1 : 0) - (shift ? 1 : 0)) * FLY_CLIMB;
    player.vel.y += (climb - player.vel.y) * Math.min(1, dt * 10);
  } else if (swimming) {
    player.vel.y = Math.max(player.vel.y - 10 * dt, -3);
    if (keys.has("Space")) player.vel.y = Math.min(player.vel.y + 30 * dt, 4);
  } else {
    player.vel.y = Math.max(player.vel.y - GRAVITY * dt, -40);
    if (keys.has("Space") && player.onGround) player.vel.y = JUMP;
  }

  const wasOnGround = player.onGround;
  const fallSpeed = -player.vel.y;
  const wantX = player.vel.x, wantZ = player.vel.z;
  const start = p.clone();
  const bumped = move(p, dt, sneaking && wasOnGround);

  // Auto-jump: walking into a one-block step hops up it, as on Minecraft's
  // touch controls. Only when there's room above the step.
  const want = Math.hypot(wantX, wantZ);
  if (bumped && settings.autoJump && player.onGround && !sneaking && !player.flying && !swimming && want > 1) {
    const ahead = p.clone();
    ahead.x += (wantX * 0.35) / want;
    ahead.z += (wantZ * 0.35) / want;
    ahead.y += 1.01;
    if (!collides(ahead)) player.vel.y = JUMP;
  }

  // Climbing out of water: swimming into a bank with room above it lifts you
  // onto it, as in Minecraft (a swim stroke alone can't clear the edge).
  const inWater = swimming || blockAt(Math.floor(p.x), Math.floor(p.y), Math.floor(p.z)) === WATER;
  if (bumped && inWater && !player.flying && want > 0.1) {
    const ahead = p.clone();
    ahead.x += (wantX * 0.35) / want;
    ahead.z += (wantZ * 0.35) / want;
    ahead.y += 1.01;
    if (!collides(ahead)) player.vel.y = Math.max(player.vel.y, WATER_EXIT);
  }

  fallDamage(start, wasOnGround, swimming);
  footsteps(start, wasOnGround, fallSpeed, sneaking);

  // Crouch the camera while sneaking; dead, the view sinks to the ground.
  const eyeTarget = health.dead ? 0.3 : sneaking ? SNEAK_EYE : EYE;
  player.eye += (eyeTarget - player.eye) * Math.min(1, dt * (health.dead ? 6 : 15));
  eyePos.set(p.x, p.y + player.eye, p.z);
}

// Moves p by the velocity one axis at a time, stopping at blocks; sneaking
// (edgeGuard) never walks off an edge. Returns whether it walked into a wall.
function move(p, dt, edgeGuard) {
  let bumped = false;
  player.onGround = false;
  for (const axis of ["x", "y", "z"]) {
    const before = p[axis];
    p[axis] += player.vel[axis] * dt;
    if (axis !== "y" && edgeGuard && !supported(p)) {
      p[axis] = before;
      continue;
    }
    if (!collides(p)) continue;
    p[axis] = before;
    if (axis !== "y") {
      bumped = true;
    } else if (player.vel.y < 0) {
      player.onGround = true;
      player.flying = false; // touching down ends flight, as in Minecraft
      // Land flush on the block below instead of hovering where the step stopped.
      p.y = Math.floor(before);
      if (collides(p)) p.y = before;
    }
    player.vel[axis] = 0;
  }
  return bumped;
}

// Falling more than 3 blocks hurts, a point per block beyond that; falling
// out of the world kills. The server deals the damage.
function fallDamage(start, wasOnGround, swimming) {
  const p = player.pos;
  if (player.flying || swimming || health.dead) player.fallDist = 0;
  else if (p.y < start.y) player.fallDist += start.y - p.y;
  if (player.onGround) {
    const dmg = Math.ceil(player.fallDist - 3);
    if (!wasOnGround && dmg > 0) send({ type: "fall", dmg });
    player.fallDist = 0;
  }
  if (p.y < -20 && !health.voidSent && !health.dead) {
    health.voidSent = true;
    send({ type: "fall", dmg: MAX_HP * 10, void: true });
  }
}

// Footsteps, quieter when sneaking, and a heavier one on landing.
function footsteps(start, wasOnGround, fallSpeed, sneaking) {
  const p = player.pos;
  if (!player.onGround) {
    player.stepDist = STEP_EVERY * 0.7; // the first step comes soon after landing
    return;
  }
  const under = DEF[groundBlock(p)];
  if (!wasOnGround && fallSpeed > 6) playBlockSound(under, "step", p.x, p.y, p.z, 1.6);
  player.stepDist += Math.hypot(p.x - start.x, p.z - start.z);
  if (player.stepDist > STEP_EVERY) {
    player.stepDist = 0;
    playBlockSound(under, "step", p.x, p.y, p.z, sneaking ? 0.5 : 1);
  }
}

// ---------------------------------------------------------------- network

// Tells the room where you are, ten times a second at most and only when
// something changed. breaking: whether you're breaking a block (others see
// your arm swing and hear the knocks).
let lastSent = 0, lastPose = "";
export function sendPose(now, breaking) {
  if (now - lastSent < 100 || game.spawnPending) return;
  lastSent = now;
  const round = (v) => Math.round(v * 100) / 100;
  const p = [round(player.pos.x), round(player.pos.y), round(player.pos.z)];
  const ry = round(player.yaw), rx = round(player.pitch);
  const s = (player.sneaking ? 1 : 0) | (breaking ? 2 : 0);
  const pose = `${p}|${ry}|${rx}|${s}`;
  if (pose === lastPose) return;
  lastPose = pose;
  send({ type: "move", p, ry, rx, s });
}
