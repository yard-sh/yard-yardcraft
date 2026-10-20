// Your inventory and game mode. The server owns both: each change here is
// predicted with the same shared rules the server runs, sent, and then
// replaced by the inventory the server sends back.
import { SLOTS, HOTBAR_SLOTS, STACK, emptyInventory, addItem, removeFrom, clickSlot } from "../shared/inventory.js";
import { on, send } from "../net.js";
import { game, player, creative } from "./state.js";

export const inventory = emptyInventory();
let selected = 0; // the hotbar slot in your hand

const listeners = [];
// Calls fn whenever the inventory, the selected slot or the mode changes.
export function onInventoryChange(fn) {
  listeners.push(fn);
}
const changed = () => listeners.forEach((fn) => fn());

export function setInventory(slots, cursor) {
  for (let i = 0; i < SLOTS; i++) inventory.slots[i] = slots?.[i] ?? null;
  inventory.cursor = cursor ?? null;
  changed();
}
on("inventory", (msg) => setInventory(msg.inv, msg.cursor));

export function setMode(mode) {
  game.mode = mode;
  if (!creative()) player.flying = false; // only creative players fly
  changed();
}

// ---------------------------------------------------------------- hotbar

export const selectedSlot = () => selected;
// The item in your hand, or null.
export const selectedItem = () => inventory.slots[selected]?.[0] ?? null;

export function selectSlot(i) {
  selected = (i + HOTBAR_SLOTS) % HOTBAR_SLOTS;
  changed();
}

// One of the selected item was placed or eaten: survival uses it up.
export function usedSelected() {
  if (!creative() && removeFrom(inventory, selected, 1)) changed();
}

// Q: throws one of the selected item, or the whole stack.
export function dropSelected(all) {
  if (!removeFrom(inventory, selected, all ? STACK : 1)) return;
  changed();
  send({ type: "drop", slot: selected, all });
}

// ---------------------------------------------------------------- screen

// A click on a slot in the inventory screen.
export function clickInventory(slot, button, shift) {
  if (!clickSlot(inventory, slot, button, shift)) return;
  changed();
  send({ type: "invclick", slot, button, shift });
}

// Throws the stack held on the cursor.
export function dropCursor() {
  if (!inventory.cursor) return;
  inventory.cursor = null;
  changed();
  send({ type: "drop", cursor: true });
}

// The screen closed: the held stack goes back into the inventory.
export function returnCursor() {
  if (!inventory.cursor) return;
  const [b, n] = inventory.cursor;
  inventory.cursor = null;
  addItem(inventory, b, n); // what doesn't fit, the server throws
  changed();
  send({ type: "invclose" });
}

// Creative: set the cursor or a hotbar slot to any stack, or clear it.
export function creativeSet(target, item) {
  if (target === "cursor") inventory.cursor = item;
  else inventory.slots[target] = item;
  changed();
  send({ type: "creative", target, item });
}

// The first empty hotbar slot, else the selected one.
export const freeHotbarSlot = () => {
  const i = inventory.slots.slice(0, HOTBAR_SLOTS).indexOf(null);
  return i < 0 ? selected : i;
};
