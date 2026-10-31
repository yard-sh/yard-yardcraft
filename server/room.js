// The World room: one per world name, reached through env.WORLDS (declared
// under "rooms" in .yard/settings.json; keep the class name, or the room's
// data is deleted). It holds every player's socket and passes each message
// to the handler for its type; the handlers live in the feature modules.
//
// Instance fields don't survive the room idling: edits live in SQL storage,
// the world record in key-value storage, and each player in their socket's
// attachment (at most about 2 KB). Mobs live in SQL storage too, and think
// on the room's alarm.
import { SX, SY, SZ, MAX_HP } from "../play/js/shared/rules.js";
import { loadProfile, forgetGuestProfile } from "./profiles.js";
import { colorFor } from "./util.js";
import { setupStorage, worldRecord, renewIfDue, worldMessages } from "./edits.js";
import { setupInventories, stateOf, adoptGuest, inventoryMessages } from "./inventory.js";
import { setupItems, itemMessages } from "./items.js";
import { playerMessages, publicPlayer } from "./players.js";
import { combatMessages } from "./combat.js";
import { commandMessages } from "./commands.js";
import { setupMobs, allMobs, mobTick, tickIfLate, wakeMobs, mobMessages } from "./mobs/index.js";

// type -> async (room, ws, player, msg); player is the sender's attachment.
const HANDLERS = {
  ...worldMessages, ...playerMessages, ...combatMessages, ...commandMessages, ...inventoryMessages, ...itemMessages,
  ...mobMessages,
};

export class World {
  constructor(ctx, env) {
    this.ctx = ctx;
    this.env = env;
    setupStorage(this);
    setupInventories(this);
    setupItems(this);
    setupMobs(this);
  }

  async fetch(request) {
    if (request.headers.get("Upgrade") !== "websocket") {
      return new Response("Expected a WebSocket", { status: 426 });
    }

    await renewIfDue(this);
    const world = await worldRecord(this);
    const userId = request.headers.get("X-Yard-User-Id") ?? "";
    const email = request.headers.get("X-Yard-Email") ?? "";
    const id = crypto.randomUUID().slice(0, 8);
    // Signed out: a guest, known by Yard's guest id for their browser (or,
    // without one, just this connection).
    const guestId = request.headers.get("X-Yard-Guest-Id") ?? "";
    const guest = userId ? "" : guestId || id;
    // A guest who has signed in: their inventory here becomes the user's,
    // and the page is told to forget the guest id.
    const signedInGuest = !!(userId && guestId);
    if (signedInGuest) {
      adoptGuest(this, userId, guestId);
      await forgetGuestProfile(this.env, guestId);
    }
    const profile = await loadProfile(this.env, { userId, email, guestId: userId ? "" : guestId, fallback: id });
    // uid, email and the guest id stay on the server; publicPlayer() leaves
    // them out.
    const player = {
      id,
      uid: userId,
      guest,
      email,
      ...profile,
      color: colorFor(userId || guest),
      // Members of the team that owns the project: Yard's edge sends
      // X-Yard-Entitlement: team for them, and clients can't forge it.
      admin: request.headers.get("X-Yard-Entitlement") === "team",
      p: [SX / 2, SY, SZ / 2],
      ry: 0,
      rx: 0,
      s: 0,
      hp: MAX_HP,
      dead: false,
      hurtAt: 0,
      attackAt: 0,
      regenAt: 0,
    };
    // Inventory and game mode belong to the player in this world.
    const state = stateOf(this, player);
    player.mode = state.mode;

    const pair = new WebSocketPair();
    const server = pair[1];
    const others = this.players();
    this.ctx.acceptWebSocket(server, [id]);
    server.serializeAttachment(player);

    this.send(server, {
      type: "welcome",
      self: publicPlayer(player),
      inv: state.slots,
      cursor: state.cursor,
      seed: world.seed,
      gen: world.gen,
      size: [SX, SY, SZ],
      now: Date.now(),
      timeOffset: world.timeOffset,
      resetAt: world.resetAt,
      players: others,
      mobs: allMobs(this),
      forgetGuest: signedInGuest,
    });
    this.broadcast(server, { type: "join", player: publicPlayer(player) });
    await wakeMobs(this);

    return new Response(null, { status: 101, webSocket: pair[0] });
  }

  async webSocketMessage(ws, message) {
    if (typeof message !== "string") return;
    let msg;
    try {
      msg = JSON.parse(message);
    } catch {
      return;
    }
    const player = ws.deserializeAttachment();
    const handler = Object.hasOwn(HANDLERS, msg?.type) ? HANDLERS[msg.type] : null;
    if (player && handler) await handler(this, ws, player, msg);
    await tickIfLate(this);
  }

  // Mobs think on the room's alarm while anyone is here (mobs/index.js), and
  // it wakes the room when the world is due to reset (edits.js).
  async alarm() {
    await renewIfDue(this);
    await mobTick(this);
  }

  webSocketClose(ws) {
    this.leave(ws);
  }

  webSocketError(ws) {
    this.leave(ws);
  }

  leave(ws) {
    const player = ws.deserializeAttachment();
    if (player) this.broadcast(ws, { type: "leave", id: player.id });
  }

  // ---------------------------------------------------------------- helpers

  // Everyone online, as others may see them.
  players() {
    return this.ctx
      .getWebSockets()
      .map((s) => s.deserializeAttachment())
      .filter(Boolean)
      .map(publicPlayer);
  }

  // The socket of the player with this id.
  socketOf(id) {
    return this.ctx.getWebSockets().find((s) => s.deserializeAttachment()?.id === id);
  }

  send(ws, event) {
    ws.send(JSON.stringify(event));
  }

  // A private line in one player's chat.
  reply(ws, text, error = false) {
    this.send(ws, { type: "system", text, error });
  }

  // Sends to everyone but sender (null for everyone).
  broadcast(sender, event) {
    const data = JSON.stringify(event);
    for (const socket of this.ctx.getWebSockets()) {
      if (socket === sender) continue;
      try {
        socket.send(data);
      } catch {
        // A socket mid-close is dropped by the runtime.
      }
    }
  }
}
