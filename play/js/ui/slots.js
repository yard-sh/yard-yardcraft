// Inventory slots as HTML: an item icon and a stack count, shared by the
// hotbar and the inventory screens.
import { ITEMS } from "../shared/items.js";
import { tileIcon } from "../render/textures.js";
import { atlasCanvas } from "../render/renderer.js";
import { el } from "../core/dom.js";

const icons = new Map(); // item -> image URL

export function iconURL(id) {
  if (!icons.has(id)) icons.set(id, `url(${tileIcon(atlasCanvas, ITEMS[id].tile).toDataURL()})`);
  return icons.get(id);
}

export const slotEl = (props = {}) => el("div", { className: "slot", ...props }, el("span", { className: "count" }));

// Shows a stack ([item, count] or null) in a slot element.
export function showStack(slot, stack) {
  slot.style.backgroundImage = stack ? iconURL(stack[0]) : "";
  slot.title = stack ? ITEMS[stack[0]].name : "";
  slot.firstChild.textContent = stack && stack[1] > 1 ? stack[1] : "";
}
