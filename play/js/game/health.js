// Getting hurt, dying and respawning. The server owns everyone's health and
// tells us what happened; this shows it: the red flash, knockback, sounds,
// the death screen.
import { MAX_HP } from "../shared/rules.js";
import { $, esc } from "../core/dom.js";
import { playSound } from "../audio/sounds.js";
import { on, send } from "../net.js";
import { game, player, health } from "./state.js";
import { spawn } from "./player.js";
import { stopMining } from "./interact.js";
import { others } from "../entities/players.js";
import { logLine, hideChat } from "../ui/chat.js";
import { openMenu, closeMenu } from "../ui/menu.js";
import { enterGame, leaveGame } from "../input/session.js";
import { closeInventory } from "../ui/inventory.js";

const deathEl = $("death");
const hurtEl = $("hurt");

export const deathShown = () => !deathEl.hidden;

// Back to full health and alive, on (re)connecting.
export function resetHealth(hp = MAX_HP) {
  Object.assign(health, { hp, dead: false, voidSent: false });
  deathEl.hidden = true;
}

export function respawn() {
  send({ type: "respawn" });
  deathEl.hidden = true;
}

// A point of health back every 4 seconds; the server keeps the pace.
export function regenTick(now) {
  if (!game.self || health.dead || health.hp >= MAX_HP || now - health.regenAt < 4000) return;
  health.regenAt = now;
  send({ type: "regen" });
}

$("respawn").onclick = () => {
  respawn();
  enterGame();
};
$("death-title").onclick = () => {
  deathEl.hidden = true;
  openMenu("main");
};

on("hurt", (msg) => {
  const now = performance.now();
  if (msg.id !== game.self?.id) {
    const o = others.get(msg.id);
    if (!o) return;
    o.hurtAt = now;
    const q = o.model.root.position;
    playSound("hurt", q.x, q.y + 1.5, q.z, { volume: 0.8 });
    return;
  }
  health.hp = msg.hp;
  health.hurtAt = now;
  health.roll = (Math.random() < 0.5 ? -1 : 1) * 0.25;
  hurtEl.classList.add("on");
  setTimeout(() => hurtEl.classList.remove("on"), 80);
  playSound("hurt", player.pos.x, player.pos.y + 1.5, player.pos.z, { volume: 0.8 });
  if (msg.knock) {
    const [x, z, k] = msg.knock;
    player.knock.x = x * 7 * k;
    player.knock.z = z * 7 * k;
    if (!player.flying) player.vel.y = Math.max(player.vel.y, 6.5);
  }
});

on("death", (msg) => {
  logLine(esc(msg.text));
  const now = performance.now();
  if (msg.id !== game.self?.id) {
    const o = others.get(msg.id);
    if (o) Object.assign(o, { dead: true, deadAt: now });
    return;
  }
  Object.assign(health, { hp: 0, dead: true, deadAt: now });
  player.flying = false;
  stopMining();
  $("death-msg").textContent = msg.text;
  hideChat();
  closeInventory(false);
  closeMenu();
  deathEl.hidden = false;
  leaveGame();
});

on("respawn", (msg) => {
  if (msg.id !== game.self?.id) {
    const o = others.get(msg.id);
    if (o) Object.assign(o, { dead: false, snap: true });
    return;
  }
  resetHealth(msg.hp);
  spawn();
});

on("health", (msg) => {
  health.hp = msg.hp;
});
