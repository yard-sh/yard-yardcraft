// The state the game's modules share: the world, who you are, your body and
// health, and what the controls ask for. Modules change these objects in
// place; nothing here does any work.
import * as THREE from "three";
import { SX, SY, SZ, MAX_HP } from "../shared/rules.js";
import { DEF } from "../world/blocks.js";

export const game = {
  world: null, // the World being played (world/world.js)
  self: null, // you, as the server describes you: id, name, skin, model, admin…
  spawned: false, // placed in the world at least once since the page loaded
  spawnPending: false, // waiting for the spawn point's chunk to load
  mode: "survival", // your game mode: "survival" or "creative"
};

export const creative = () => game.mode === "creative";

// Your body. The physics (game/player.js) moves it.
export const player = {
  pos: new THREE.Vector3(SX / 2, SY, SZ / 2),
  vel: new THREE.Vector3(),
  yaw: 0,
  pitch: 0,
  eye: 1.62, // eye height above the feet; drops while sneaking
  onGround: false,
  flying: false,
  sprinting: false,
  sneaking: false,
  stepDist: 0, // blocks walked since the last footstep
  fallDist: 0, // blocks fallen since last on the ground, for fall damage
  knock: { x: 0, z: 0 }, // knockback from being hit, fading out
};

// Where your eyes are; the camera sits here in first person.
export const eyePos = new THREE.Vector3();

// Your health. The server decides it and tells us; roll tilts the camera
// when hurt, as in Minecraft.
export const health = { hp: MAX_HP, dead: false, hurtAt: -1e9, deadAt: 0, roll: 0, regenAt: 0, voidSent: false };

// What the keyboard and touch controls are asking for. keys holds pressed
// key codes (touch buttons press keys too); move is the touch joystick,
// -1..1 with z < 0 forward; sprintArmed sprints once you move forward.
export const controls = { keys: new Set(), move: { x: 0, z: 0 }, sprintArmed: false };

// The block at a world position: -1 where the chunk isn't loaded, -2 beyond
// the world's edge.
export const blockAt = (x, y, z) => (game.world ? game.world.getBlock(x, y, z) : -1);

// Unloaded chunks and the world's edge are walls, so nobody falls through
// ground that hasn't arrived yet or walks off the world.
export const solidAt = (x, y, z) => {
  const b = blockAt(x, y, z);
  return b < 0 || DEF[b].solid;
};

// Team members get a star.
export const displayName = (p) => (p.admin ? `★${p.name}` : p.name);
