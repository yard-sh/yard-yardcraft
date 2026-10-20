// Health, by Minecraft's rules: a fist does 1 and a falling (critical) hit 2,
// half a second of immunity after any damage, a point back every 4 seconds.
// The room owns everyone's health; clients only ask.
import { MAX_HP, REACH } from "../play/js/shared/rules.js";
import { dropAll } from "./inventory.js";

export const REACH_SLACK = 3; // blocks of lag allowed on top of the client's reach
export const IMMUNE_MS = 500;
export const ATTACK_MS = 200; // fastest a player can land hits
const REGEN_MS = 3800;

// Hurts a player (unless still immune, or dead); kills them at zero.
// opts: by (the attacker), knock ([x, z, strength]), cause ("fall" or
// "void"), force (ignores immunity, as the void does).
export function damage(room, ws, victim, amount, { by, knock, cause, force } = {}) {
  // Creative players can't be hurt; the void sends them back to spawn.
  if (victim.mode === "creative") {
    if (cause === "void") room.send(ws, { type: "teleport", spawn: true });
    return;
  }
  const now = Date.now();
  if (victim.dead || (!force && now - victim.hurtAt < IMMUNE_MS)) return;
  victim.hp = Math.max(0, victim.hp - amount);
  victim.hurtAt = now;
  victim.regenAt = now; // healing waits a moment after each hit
  victim.dead = victim.hp === 0;
  ws.serializeAttachment(victim);
  room.broadcast(null, { type: "hurt", id: victim.id, hp: victim.hp, by: by?.id, knock });
  if (!victim.dead) return;
  const text = by
    ? `${victim.name} was slain by ${by.name}`
    : cause === "void"
      ? `${victim.name} fell out of the world`
      : `${victim.name} fell from a high place`;
  room.broadcast(null, { type: "death", id: victim.id, text });
  dropAll(room, victim);
}

export const combatMessages = {
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
  },
};
