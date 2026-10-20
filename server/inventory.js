// Each player's inventory and game mode in this world, stored in the room's
// SQL by Yard user (two tabs of one account share them). The room is the
// authority: clients predict clicks with the same shared rules and then take
// whatever inventory the server sends back.
import {
  SLOTS, HOTBAR_SLOTS, STACK, MODES, emptyInventory, isStack, addItem, removeFrom, clickSlot,
} from "../play/js/shared/inventory.js";
import { ITEMS } from "../play/js/shared/items.js";
import { MAX_HP } from "../play/js/shared/rules.js";
import { spawnItem, THROW_DELAY_MS } from "./items.js";

const EAT_MS = 1500; // the client takes 1.6 s; a little slack for lag

export function setupInventories(room) {
  room.ctx.storage.sql.exec("CREATE TABLE IF NOT EXISTS players (uid TEXT PRIMARY KEY, mode TEXT, inv TEXT, cursor TEXT)");
}

// Signed-in players by Yard user; guests by their browser's token.
const keyOf = (player) => player.uid || `guest:${player.guest || player.id}`;

// { mode, slots, cursor } for a player, loaded once per room wake-up.
export function stateOf(room, player) {
  room.states ??= new Map();
  const key = keyOf(player);
  let state = room.states.get(key);
  if (state) return state;
  const row = room.ctx.storage.sql.exec("SELECT mode, inv, cursor FROM players WHERE uid = ?", key).toArray()[0];
  state = { mode: "survival", ...emptyInventory() };
  if (row) {
    state.mode = MODES.includes(row.mode) ? row.mode : "survival";
    const slots = JSON.parse(row.inv ?? "[]");
    for (let i = 0; i < SLOTS; i++) state.slots[i] = isStack(slots[i]) ? slots[i] : null;
    const cursor = JSON.parse(row.cursor ?? "null");
    state.cursor = isStack(cursor) ? cursor : null;
  }
  room.states.set(key, state);
  return state;
}

// Saves a player's state and sends their inventory to each of their sockets.
export function saveState(room, player) {
  const state = stateOf(room, player);
  room.ctx.storage.sql.exec(
    "INSERT INTO players (uid, mode, inv, cursor) VALUES (?, ?, ?, ?) ON CONFLICT (uid) DO UPDATE SET mode = excluded.mode, inv = excluded.inv, cursor = excluded.cursor",
    keyOf(player), state.mode, JSON.stringify(state.slots), JSON.stringify(state.cursor),
  );
  const msg = { type: "inventory", inv: state.slots, cursor: state.cursor };
  for (const ws of socketsOf(room, player)) room.send(ws, msg);
}

function socketsOf(room, player) {
  const key = keyOf(player);
  return room.ctx.getWebSockets().filter((s) => {
    const p = s.deserializeAttachment();
    return p && keyOf(p) === key;
  });
}

// A guest signed in (uid is now theirs): their inventory and mode in this
// world become the user's, unless the user already has their own here.
export function adoptGuest(room, uid, guestId) {
  const sql = room.ctx.storage.sql;
  const from = `guest:${guestId}`;
  if (!sql.exec("SELECT 1 FROM players WHERE uid = ?", uid).toArray().length) {
    sql.exec("UPDATE players SET uid = ? WHERE uid = ?", uid, from);
  }
  sql.exec("DELETE FROM players WHERE uid = ?", from);
  room.states?.delete(from);
  room.states?.delete(uid);
}

// Gives a player n of block b; returns how many didn't fit.
export function giveItem(room, player, b, n) {
  const left = addItem(stateOf(room, player), b, n);
  if (left < n) saveState(room, player);
  return left;
}

// Sets a player's game mode, on every socket of theirs, and tells everyone.
export function setMode(room, player, mode) {
  stateOf(room, player).mode = mode;
  saveState(room, player);
  for (const ws of socketsOf(room, player)) {
    const p = ws.deserializeAttachment();
    p.mode = mode;
    ws.serializeAttachment(p);
    room.broadcast(null, { type: "mode", id: p.id, mode });
  }
}

// Death: everything in the inventory falls around where the player died.
export function dropAll(room, player) {
  const state = stateOf(room, player);
  const stacks = [...state.slots, state.cursor].filter(Boolean);
  if (!stacks.length) return;
  Object.assign(state, emptyInventory());
  saveState(room, player);
  const [x, y, z] = player.p;
  for (const [b, n] of stacks) {
    const a = Math.random() * Math.PI * 2, speed = 1 + Math.random() * 2.5;
    spawnItem(room, b, n, [x, y + 1, z], [Math.cos(a) * speed, 4 + Math.random() * 2, Math.sin(a) * speed], THROW_DELAY_MS);
  }
}

// Throws a stack from the player's eyes the way they're looking.
function throwStack(room, player, [b, n]) {
  const [x, y, z] = player.p;
  const c = Math.cos(player.rx);
  const dir = [-Math.sin(player.ry) * c, Math.sin(player.rx), -Math.cos(player.ry) * c];
  const eye = [x + dir[0] * 0.3, y + 1.3, z + dir[2] * 0.3];
  spawnItem(room, b, n, eye, [dir[0] * 6, dir[1] * 6 + 2, dir[2] * 6], THROW_DELAY_MS);
}

export const inventoryMessages = {
  // A click on a slot in the inventory screen.
  invclick(room, ws, player, msg) {
    if (player.dead) return;
    if (clickSlot(stateOf(room, player), msg.slot, msg.button === 2 ? 2 : 0, !!msg.shift)) saveState(room, player);
  },

  // The inventory screen closed: the held stack goes back, or falls if
  // there's no room.
  invclose(room, ws, player) {
    const state = stateOf(room, player);
    if (!state.cursor) return;
    const [b, n] = state.cursor;
    state.cursor = null;
    const left = addItem(state, b, n);
    saveState(room, player);
    if (left) throwStack(room, player, [b, left]);
  },

  // Q drops one item of a slot (all: the whole stack); with cursor, the
  // stack held in the inventory screen.
  drop(room, ws, player, msg) {
    if (player.dead) return;
    const state = stateOf(room, player);
    let stack;
    if (msg.cursor) {
      stack = state.cursor;
      state.cursor = null;
    } else if (Number.isInteger(msg.slot) && msg.slot >= 0 && msg.slot < SLOTS) {
      stack = removeFrom(state, msg.slot, msg.all ? STACK : 1);
    }
    if (!stack) return;
    saveState(room, player);
    throwStack(room, player, stack);
  },

  // Eating: the player started holding Place with food in a hotbar slot...
  eatstart(room, ws, player, msg) {
    if (!Number.isInteger(msg.slot) || msg.slot < 0 || msg.slot >= HOTBAR_SLOTS) return;
    Object.assign(player, { eatAt: Date.now(), eatSlot: msg.slot });
    ws.serializeAttachment(player);
  },

  // ...and held it long enough: one is eaten (except in creative) and heals.
  eat(room, ws, player, msg) {
    const state = stateOf(room, player);
    const food = ITEMS[state.slots[player.eatSlot]?.[0]]?.food;
    const ready = player.eatAt && msg.slot === player.eatSlot && Date.now() - player.eatAt >= EAT_MS;
    player.eatAt = 0;
    ws.serializeAttachment(player);
    if (!ready || !food || player.dead || player.hp >= MAX_HP) return;
    if (state.mode !== "creative") {
      removeFrom(state, msg.slot, 1);
      saveState(room, player);
    }
    player.hp = Math.min(MAX_HP, player.hp + food);
    ws.serializeAttachment(player);
    room.send(ws, { type: "health", hp: player.hp });
    room.broadcast(ws, { type: "eat", id: player.id });
  },

  // The creative screen: take any item, or delete what you hold. target
  // is "cursor" or a hotbar slot; item a stack, or null to clear it.
  creative(room, ws, player, msg) {
    const state = stateOf(room, player);
    if (state.mode !== "creative") return;
    if (msg.item !== null && !isStack(msg.item)) return;
    const item = msg.item;
    if (msg.target === "cursor") state.cursor = item;
    else if (Number.isInteger(msg.target) && msg.target >= 0 && msg.target < HOTBAR_SLOTS) state.slots[msg.target] = item;
    else return;
    saveState(room, player);
  },
};
