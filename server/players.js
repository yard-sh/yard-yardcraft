// Players moving, swinging, changing their look and chatting.
import { SX, SY, SZ } from "../play/js/shared/rules.js";
import { loadProfile } from "./profiles.js";
import { clamp } from "./util.js";

// What other players may see of a player.
export function publicPlayer({ uid, guest, email, hurtAt, attackAt, regenAt, eatAt, eatSlot, ...p }) {
  return { ...p, guest: !!guest };
}

export const playerMessages = {
  move(room, ws, player, msg) {
    if (!Array.isArray(msg.p)) return;
    player.p = [clamp(msg.p[0], -8, SX + 8), clamp(msg.p[1], -64, SY + 64), clamp(msg.p[2], -8, SZ + 8)];
    player.ry = clamp(msg.ry, -1e3, 1e3);
    player.rx = clamp(msg.rx, -1.6, 1.6);
    player.s = Number.isInteger(msg.s) ? msg.s & 3 : 0; // 1 sneaking, 2 breaking
    ws.serializeAttachment(player);
    room.broadcast(ws, { type: "move", id: player.id, p: player.p, ry: player.ry, rx: player.rx, s: player.s });
  },

  // Latency checks: the time comes straight back.
  ping(room, ws, player, msg) {
    if (Number.isFinite(msg.t)) room.send(ws, { type: "pong", t: msg.t });
  },

  swing(room, ws, player) {
    room.broadcast(ws, { type: "swing", id: player.id });
  },

  // The player saved a new look; read it back from the database rather than
  // trusting the message.
  async profile(room, ws, player) {
    const guestId = player.uid || player.guest === player.id ? "" : player.guest;
    Object.assign(player, await loadProfile(room.env, { userId: player.uid, email: player.email, guestId, fallback: player.id }));
    ws.serializeAttachment(player);
    room.broadcast(null, { type: "profile", player: publicPlayer(player) });
  },

  chat(room, ws, player, msg) {
    if (typeof msg.text !== "string") return;
    const text = msg.text.trim().slice(0, 200);
    if (text) room.broadcast(null, { type: "chat", name: player.name, color: player.color, admin: player.admin, text });
  },
};
