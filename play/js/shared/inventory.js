// Inventory rules the client and the server both run, so a click shows at
// once and the server (which has the final say) gets the same answer.
//
// An inventory is { slots, cursor }: slots is 36 stacks (0–8 the hotbar,
// 9–35 the main inventory), cursor the stack held by the mouse while the
// inventory screen is open. A stack is [item, count] or null (item types are
// in shared/items.js; a block's item id is its block id).
import { AIR, GRASS, DIRT, GLASS, LEAVES, WATER } from "../world/blocks.js";
import { isItem } from "./items.js";

export const SLOTS = 36;
export const HOTBAR_SLOTS = 9;
export const STACK = 64;
export const MODES = ["survival", "creative"];

export const emptyInventory = () => ({ slots: Array(SLOTS).fill(null), cursor: null });

// What breaking a block gives you in survival, as in Minecraft: grass gives
// dirt, glass and leaves break into nothing.
const DROPS = { [GRASS]: DIRT, [GLASS]: AIR, [LEAVES]: AIR, [WATER]: AIR };
export const dropOf = (b) => DROPS[b] ?? b;

// Whether something is a valid stack.
export const isStack = (s) =>
  Array.isArray(s) && s.length === 2 && isItem(s[0]) && Number.isInteger(s[1]) && s[1] >= 1 && s[1] <= STACK;

// Puts n of block b into slots lo..hi-1, topping up stacks of it first,
// then filling empty slots. Returns how many didn't fit.
function fill(inv, b, n, lo, hi) {
  for (const pass of ["merge", "empty"])
    for (let i = lo; i < hi && n > 0; i++) {
      const s = inv.slots[i];
      if (pass === "merge" ? s?.[0] === b && s[1] < STACK : !s) {
        const put = Math.min(n, STACK - (s?.[1] ?? 0));
        inv.slots[i] = [b, (s?.[1] ?? 0) + put];
        n -= put;
      }
    }
  return n;
}

// Adds n of block b anywhere (the hotbar fills first). Returns how many
// didn't fit.
export const addItem = (inv, b, n) => fill(inv, b, n, 0, SLOTS);

// Takes up to n from a slot; returns the stack taken, or null.
export function removeFrom(inv, slot, n) {
  const s = inv.slots[slot];
  if (!s || n < 1) return null;
  const take = Math.min(n, s[1]);
  inv.slots[slot] = s[1] > take ? [s[0], s[1] - take] : null;
  return [s[0], take];
}

// Moves a slot's stack into the other section (hotbar ↔ main inventory),
// onto matching stacks first. Returns whether anything moved.
function quickMove(inv, slot) {
  const s = inv.slots[slot];
  if (!s) return false;
  const [lo, hi] = slot < HOTBAR_SLOTS ? [HOTBAR_SLOTS, SLOTS] : [0, HOTBAR_SLOTS];
  inv.slots[slot] = null;
  const n = fill(inv, s[0], s[1], lo, hi);
  inv.slots[slot] = n ? [s[0], n] : null;
  return n < s[1];
}

// A click on a slot with the inventory open, by Minecraft's rules. button 0
// (left): pick up the stack, put the held one down, merge, or swap. button 2
// (right): pick up half, or put down one. shift: move the stack to the
// other section. Returns whether anything changed.
export function clickSlot(inv, slot, button, shift) {
  if (!Number.isInteger(slot) || slot < 0 || slot >= SLOTS) return false;
  if (shift) return quickMove(inv, slot);
  const s = inv.slots[slot], c = inv.cursor;
  if (!c) {
    if (!s) return false;
    const take = button === 2 ? Math.ceil(s[1] / 2) : s[1];
    inv.cursor = [s[0], take];
    inv.slots[slot] = s[1] > take ? [s[0], s[1] - take] : null;
    return true;
  }
  if (!s || s[0] === c[0]) {
    const room = STACK - (s?.[1] ?? 0);
    const put = Math.min(button === 2 ? 1 : c[1], room);
    if (put <= 0) return false;
    inv.slots[slot] = [c[0], (s?.[1] ?? 0) + put];
    inv.cursor = c[1] > put ? [c[0], c[1] - put] : null;
    return true;
  }
  inv.slots[slot] = c;
  inv.cursor = s;
  return true;
}
