// The touch controls: what each on-screen button does (see gestures.js for
// the joystick, look-drags and buttons themselves).
import { $ } from "../core/dom.js";
import { player, controls } from "../game/state.js";
import { primaryDown, useDown, useUp, stopMining } from "../game/interact.js";
import { canvas } from "../render/renderer.js";
import { openChat } from "../ui/chat.js";
import { openMenu } from "../ui/menu.js";
import { toggleInventory } from "../ui/inventory.js";
import { dropSelected } from "../game/inventory.js";
import { leaveGame } from "./session.js";
import { look, pressKey, cycleView } from "./actions.js";
import { setupTouch } from "./gestures.js";

const touchEl = $("touch");
const { keys } = controls;

const touch = setupTouch(touchEl, canvas, {
  look: (dx, dy) => look(dx, dy, 0.006),
  move(x, z) {
    controls.move.x = x;
    controls.move.z = z;
  },
  down(name) {
    if (name === "jump") pressKey("Space");
    else if (name === "sneak") {
      // Hold to sink while flying; on the ground it toggles, like Minecraft's
      // touch sneak button.
      if (player.flying || !keys.has("ShiftLeft")) keys.add("ShiftLeft");
      else keys.delete("ShiftLeft");
    } else if (name === "sprint") controls.sprintArmed = !player.sprinting;
    else if (name === "break") primaryDown();
    else if (name === "place") useDown();
    else if (name === "view") cycleView();
    else if (name === "chat") openChat();
    else if (name === "inv") toggleInventory();
    else if (name === "drop") dropSelected(false);
    else if (name === "pause") {
      leaveGame();
      openMenu("main");
    }
    renderTouchButtons();
  },
  up(name) {
    if (name === "jump") keys.delete("Space");
    else if (name === "sneak" && player.flying) keys.delete("ShiftLeft");
    else if (name === "break") stopMining();
    else if (name === "place") useUp();
    renderTouchButtons();
  },
});

// Lets go of every touch, e.g. when the game pauses.
export const resetTouch = () => touch.reset();

// Sneak and Sprint light up while they're on.
const sneakBtn = touchEl.querySelector('[data-t="sneak"]');
const sprintBtn = touchEl.querySelector('[data-t="sprint"]');
export function renderTouchButtons() {
  sneakBtn.classList.toggle("on", keys.has("ShiftLeft") && !player.flying);
  sprintBtn.classList.toggle("on", controls.sprintArmed || player.sprinting);
}
