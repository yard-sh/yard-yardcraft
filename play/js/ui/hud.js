// The heads-up display: who's online, and the hotbar. (The top-left corner
// is ui/debug.js.)
import { HOTBAR_SLOTS } from "../shared/inventory.js";
import { faceIcon } from "../skins/format.js";
import { skinEntry, onSkinChange } from "../skins/cache.js";
import { $, el } from "../core/dom.js";
import { worldName } from "../net.js";
import { game, displayName } from "../game/state.js";
import { others } from "../entities/players.js";
import { setHeldItem } from "../entities/avatar.js";
import { inventory, onInventoryChange, selectSlot, selectedSlot, selectedItem } from "../game/inventory.js";
import { slotEl, showStack } from "./slots.js";

// ---------------------------------------------------------------- players

// The list in the corner, and the line under the title menu.
export function renderPlayers() {
  const list = game.self ? [{ ...game.self, name: `${game.self.name} (you)` }, ...others.values()] : [...others.values()];
  $("players").replaceChildren(...list.map((p) => el("li", {}, faceIcon(skinEntry(p.skin).canvas, 16), displayName(p))));
  $("menu-foot").textContent = game.self
    ? `World “${worldName}” · ${others.size + 1} online · you are ${displayName(game.self)}`
    : "";
}
// An uploaded skin finished loading: show the new face.
onSkinChange(() => renderPlayers());

// ---------------------------------------------------------------- hotbar

// The nine hotbar slots: your inventory's first row, as in Minecraft.
const hotbarEl = $("hotbar");
const hotbarSlots = Array.from({ length: HOTBAR_SLOTS }, (_, i) => {
  const s = slotEl();
  s.onclick = () => selectSlot(i);
  return s;
});
hotbarEl.replaceChildren(...hotbarSlots);

export function renderHotbar() {
  hotbarSlots.forEach((s, i) => {
    showStack(s, inventory.slots[i]);
    s.classList.toggle("on", i === selectedSlot());
  });
  setHeldItem(selectedItem());
}
onInventoryChange(renderHotbar);
