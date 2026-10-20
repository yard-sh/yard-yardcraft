// What the controls do, shared by the keyboard and mouse and the touch
// buttons (which press keys through pressKey too).
import { settings, setSetting } from "../core/settings.js";
import { player, controls, creative } from "../game/state.js";
import { useDown } from "../game/interact.js";
import { VIEW_NAMES } from "../game/camera.js";
import { selectSlot, dropSelected } from "../game/inventory.js";

const DOUBLE_TAP_MS = 300;
let lastJumpTap = 0, lastForwardTap = 0;

// Turns the view by dx, dy pixels of mouse or finger movement; k is radians
// per pixel at 100% sensitivity.
export function look(dx, dy, k) {
  k *= settings.sens / 100;
  player.yaw -= dx * k;
  player.pitch = Math.max(-1.55, Math.min(1.55, player.pitch - dy * k * (settings.invert ? -1 : 1)));
}

export const cycleView = () => setSetting("view", (settings.view + 1) % VIEW_NAMES.length);

// A key going down while playing. Held keys stay in controls.keys, where
// the movement reads them.
export function pressKey(code, repeat = false) {
  controls.keys.add(code);
  if (repeat) return;
  if (/^Digit[1-9]$/.test(code)) selectSlot(Number(code.slice(5)) - 1);
  if (code === "KeyF") useDown();
  // Q throws one of what you hold; Ctrl+Q the whole stack.
  if (code === "KeyQ") dropSelected(controls.keys.has("ControlLeft") || controls.keys.has("ControlRight"));
  if (code === "KeyG") setSetting("shadows", !settings.shadows);
  // F5 (or V, since F5 reloads the page in some browsers) cycles the view.
  if (code === "F5" || code === "KeyV") cycleView();
  const now = performance.now();
  // Double-tap forward sprints, as in Minecraft.
  if (code === "KeyW") {
    if (now - lastForwardTap < DOUBLE_TAP_MS) player.sprinting = true;
    lastForwardTap = now;
  }
  // Double-tap jump toggles flying, in creative.
  if (code === "Space" && creative()) {
    if (now - lastJumpTap < DOUBLE_TAP_MS) {
      player.flying = !player.flying;
      player.vel.y = 0;
      lastJumpTap = 0;
    } else {
      lastJumpTap = now;
    }
  }
}
