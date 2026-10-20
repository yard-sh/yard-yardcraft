// What your hands do: break blocks (hold for the block's hardness), place
// them, eat, and punch players and mobs.
import { REACH, MAX_HP } from "../shared/rules.js";
import { ITEMS } from "../shared/items.js";
import { AIR, DEF } from "../world/blocks.js";
import { playBlockSound, playSound } from "../audio/sounds.js";
import { showOutline, showCracks } from "../render/highlight.js";
import { send } from "../net.js";
import { player, eyePos, blockAt, creative, health } from "./state.js";
import { HALF_W, HEIGHT, lookDir } from "./player.js";
import { raycast, rayBox } from "./raycast.js";
import { edit } from "./chunks.js";
import { others } from "../entities/players.js";
import { aimedMob, mobInBox } from "../entities/mobs.js";
import { swingHand } from "../entities/avatar.js";
import { selectedItem, selectedSlot, usedSelected } from "./inventory.js";

// A knock every four ticks while breaking, as in Minecraft.
export const HIT_EVERY = 0.2;

// Breaking takes holding the break button for the block's hardness in
// seconds (creative breaks at once). Looking at another block, or letting go, starts over; holding on
// moves to the next block after a short pause, as in Minecraft.
const mining = { held: false, target: null, block: 0, progress: 0, cooldown: 0, hitTimer: 0 };

export const isBreaking = () => mining.held && !!mining.target;

export function stopMining() {
  mining.held = false;
  mining.target = null;
  mining.progress = 0;
  showCracks(null);
}

// Each frame: outline what you're looking at, and carry on breaking it or
// eating. active: whether you're in the game (not in a menu).
export function updateInteraction(dt, active) {
  if (!active) stopUsing();
  eatTick(dt);
  const r = active ? raycast() : null;
  showOutline(r?.hit);
  mining.cooldown = Math.max(0, mining.cooldown - dt);
  const hit = r && r.hit[1] >= 1 ? r.hit : null; // the bottom layer is the floor
  const b = hit ? blockAt(...hit) : 0;
  if (!mining.held || !hit || mining.cooldown > 0) {
    mining.target = null;
    showCracks(null);
    return;
  }
  // A new target, or the block changed under us (someone else broke it).
  if (!mining.target || mining.target.some((v, i) => v !== hit[i]) || mining.block !== b) {
    mining.target = hit;
    mining.block = b;
    mining.progress = 0;
    mining.hitTimer = 0;
  }
  mining.progress += creative() ? 1 : dt / DEF[b].hard;
  mining.hitTimer -= dt;
  const [cx, cy, cz] = [hit[0] + 0.5, hit[1] + 0.5, hit[2] + 0.5];
  if (mining.progress >= 1) {
    playBlockSound(DEF[b], "break", cx, cy, cz);
    edit(...hit, AIR);
    mining.target = null;
    mining.cooldown = 0.25;
    showCracks(null);
    return;
  }
  if (mining.hitTimer <= 0) {
    mining.hitTimer = HIT_EVERY;
    playBlockSound(DEF[b], "hit", cx, cy, cz);
  }
  showCracks(hit, mining.progress);
}

// The break/hit button (left click, or Break on touch). A player or mob in
// reach, nearer than any block, gets punched; otherwise holding breaks the
// block.
export function primaryDown() {
  const r = raycast();
  const reach = Math.min(REACH, r ? r.t : REACH);
  const target = aimedPlayer(reach);
  const mob = aimedMob(eyePos, lookDir(), target ? target.t : reach);
  if (mob) attack({ type: "hitmob", id: mob.mob.id });
  else if (target) attack({ type: "attack", id: target.player.id });
  else mining.held = true;
  // Swinging at thin air still swings, as in Minecraft.
  if (!target && !mob && !r) swingHand();
}

// ---------------------------------------------------------------- using

// The place button (right click, F, or Place on touch) going down: eat
// what you hold if it's food and you're hurt, else place it. Holding it
// keeps eating, one after another.
export function useDown() {
  using.held = true;
  if (!startEating()) placeBlock();
}

export function useUp() {
  using.held = false;
  stopEating();
}

function stopUsing() {
  if (using.held) useUp();
}

const EAT_TIME = 1.6; // seconds, as Minecraft
const using = { held: false, eating: false, slot: 0, item: null, t: 0, crunch: 0 };

export const isEating = () => using.eating;

function startEating() {
  const item = selectedItem();
  if (!ITEMS[item]?.food || health.dead || health.hp >= MAX_HP) return false;
  Object.assign(using, { eating: true, slot: selectedSlot(), item, t: 0, crunch: 0 });
  send({ type: "eatstart", slot: using.slot });
  return true;
}

function stopEating() {
  using.eating = false;
}

function eatTick(dt) {
  if (!using.eating) return;
  // Switching to something else stops it.
  if (selectedSlot() !== using.slot || selectedItem() !== using.item || health.dead) return stopEating();
  using.t += dt;
  using.crunch -= dt;
  const p = player.pos;
  if (using.crunch <= 0) {
    using.crunch = 0.22;
    playSound("crunch", p.x, p.y + 1.5, p.z, { volume: 0.45, rate: 0.9 + Math.random() * 0.3 });
  }
  if (using.t < EAT_TIME) return;
  send({ type: "eat", slot: using.slot });
  usedSelected();
  playSound("burp", p.x, p.y + 1.5, p.z, { volume: 0.4 });
  stopEating();
  // Still holding: have another once the server has healed you.
  if (using.held) setTimeout(() => using.held && !using.eating && startEating(), 400);
}

export function placeBlock() {
  const r = raycast();
  if (!r?.prev) return;
  const [x, y, z] = r.prev;
  const b = ITEMS[selectedItem()]?.block;
  if (b === undefined) return; // an empty hand, or something that isn't a block, places nothing
  const p = player.pos;
  const inPlayer =
    x < p.x + HALF_W && x + 1 > p.x - HALF_W && y < p.y + HEIGHT && y + 1 > p.y && z < p.z + HALF_W && z + 1 > p.z - HALF_W;
  if (DEF[b].solid && (inPlayer || mobInBox(x, y, z, x + 1, y + 1, z + 1))) return;
  edit(x, y, z, b, selectedSlot());
  usedSelected();
  playBlockSound(DEF[b], "place", x + 0.5, y + 0.5, z + 0.5);
  swingHand();
}

// The living player you're looking at within maxDist, as { player, t }.
function aimedPlayer(maxDist) {
  const d = lookDir();
  let best = null;
  for (const o of others.values()) {
    if (o.dead) continue;
    const q = o.model.root.position;
    const h = o.s & 1 ? 1.5 : 1.8;
    const t = rayBox(eyePos, d, q.x - 0.3, q.y, q.z - 0.3, q.x + 0.3, q.y + h, q.z + 0.3);
    if (t !== null && t < (best?.t ?? maxDist)) best = { player: o, t };
  }
  return best;
}

// A punch (msg: attack for a player, hitmob for a mob). Hitting while
// falling is a critical hit; a sprinting hit knocks further and ends the
// sprint. The server checks it and deals the damage.
function attack(msg) {
  const crit = !player.onGround && !player.flying && player.vel.y < 0;
  send({ ...msg, crit, sprint: player.sprinting });
  player.sprinting = false;
  swingHand();
}
