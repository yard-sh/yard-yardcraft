// The inventory screen (E). Survival: your 27 inventory slots above the
// hotbar, with Minecraft's clicks (left, right, shift). Creative: every
// item to take from, above the hotbar. A stack picked up follows the
// pointer; letting go of it outside the panel throws it.
import { CREATIVE_ITEMS } from "../shared/items.js";
import { SLOTS, HOTBAR_SLOTS, STACK } from "../shared/inventory.js";
import { $ } from "../core/dom.js";
import { game, health, creative } from "../game/state.js";
import {
  inventory, onInventoryChange, clickInventory, dropCursor, returnCursor, creativeSet, freeHotbarSlot,
} from "../game/inventory.js";
import { enterGame, leaveGame, playing } from "../input/session.js";
import { slotEl, showStack } from "./slots.js";

const screenEl = $("inventory");
const cursorEl = $("inv-cursor");
let open = false;
let resume = false; // go back into the game on closing

// Slot elements: 0–8 the hotbar row, 9–35 the inventory above it.
const slots = Array.from({ length: SLOTS }, (_, i) => slotEl({ onpointerdown: (e) => onSlot(e, i) }));
$("inv-main").replaceChildren(...slots.slice(HOTBAR_SLOTS));
$("inv-hotbar").replaceChildren(...slots.slice(0, HOTBAR_SLOTS));

// The creative palette: every item.
const palette = CREATIVE_ITEMS.map((b) => {
  const s = slotEl({ onpointerdown: (e) => onPalette(e, b) });
  showStack(s, [b, 1]);
  return s;
});
$("inv-palette").replaceChildren(...palette);

export const inventoryOpen = () => open;

export function toggleInventory() {
  if (open) closeInventory();
  else openInventory();
}

function openInventory() {
  if (!game.self || health.dead) return;
  resume = playing();
  leaveGame();
  open = true;
  screenEl.hidden = false;
  render();
}

// Closes the screen; the held stack goes back into the inventory. back:
// whether to return to the game (not when dying).
export function closeInventory(back = true) {
  if (!open) return;
  open = false;
  screenEl.hidden = true;
  returnCursor();
  if (back && resume) enterGame();
}

function render() {
  if (!open) return;
  const c = creative();
  $("inv-title").textContent = c ? "Creative" : "Inventory";
  $("inv-palette").hidden = !c;
  $("inv-main").hidden = c;
  $("inv-hint").textContent = c
    ? "Click an item to take a stack · Shift-click to put it in the hotbar · Drop a stack here to delete it"
    : "Click to pick up · Right-click for half · Shift-click to move · Click outside to throw";
  slots.forEach((s, i) => showStack(s, inventory.slots[i]));
  showStack(cursorEl, inventory.cursor);
  cursorEl.hidden = !inventory.cursor;
}
onInventoryChange(render);

const button = (e) => (e.button === 2 ? 2 : 0);

function onSlot(e, i) {
  e.stopPropagation();
  clickInventory(i, button(e), e.shiftKey);
  moveCursor(e);
}

function onPalette(e, b) {
  e.stopPropagation();
  if (inventory.cursor) creativeSet("cursor", null); // dropped back onto the palette: gone
  else if (e.shiftKey) creativeSet(freeHotbarSlot(), [b, STACK]);
  else creativeSet("cursor", [b, button(e) === 2 ? 1 : STACK]);
  moveCursor(e);
}

function moveCursor(e) {
  cursorEl.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
}
screenEl.addEventListener("pointermove", moveCursor);

// Outside the panel: throw what you hold.
screenEl.addEventListener("pointerdown", (e) => {
  if (!e.target.closest(".inv-panel")) dropCursor();
});
$("inv-done").onclick = () => closeInventory();

// E opens and closes it; Esc closes it too.
document.addEventListener("keydown", (e) => {
  if (e.repeat || !(e.code === "KeyE" || (open && e.code === "Escape"))) return;
  if (!open && !playing()) return;
  e.preventDefault();
  toggleInventory();
});
