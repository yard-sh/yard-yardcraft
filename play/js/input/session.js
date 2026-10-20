// Being in the game versus in a menu. On a desktop you're in the game while
// the mouse is captured (pointer lock); on a touch screen, once you've
// pressed Play. Touch mode follows whichever kind of pointer you last used
// outside the game, so touch-screen laptops work either way.
import { COARSE } from "../core/settings.js";
import { $ } from "../core/dom.js";
import { startSounds } from "../audio/sounds.js";
import { canvas } from "../render/renderer.js";
import { game, controls, health } from "../game/state.js";
import { stopMining } from "../game/interact.js";
import { respawn, deathShown } from "../game/health.js";
import { menuOpen, openMenu, closeMenu } from "../ui/menu.js";
import { chatOpen } from "../ui/chat.js";
import { inventoryOpen } from "../ui/inventory.js";
import { resetTouch } from "./touch.js";

const playBtn = $("play");
const touchEl = $("touch");
let touchModeOn = COARSE;
let touchPlaying = false;

export const locked = () => document.pointerLockElement === canvas;
export const touchMode = () => touchModeOn;
export const touchPlayingNow = () => touchPlaying;
export const playing = () => locked() || touchPlaying;

addEventListener(
  "pointerdown",
  (e) => {
    if (playing()) return;
    touchModeOn = e.pointerType === "touch" || e.pointerType === "pen";
    renderTouch();
  },
  true,
);

export function renderTouch() {
  document.body.classList.toggle("touch", touchModeOn);
  touchEl.hidden = !(touchModeOn && touchPlaying);
}

function inGame() {
  closeMenu();
  playBtn.textContent = "Back to game";
}

export function enterGame() {
  startSounds(); // a tap or click: browsers allow audio from here on
  if (!game.self) return;
  // Browsers can refuse the lock (an unfocused window, or right after Esc):
  // show the menu, whose Play button tries again.
  if (!touchModeOn) return canvas.requestPointerLock()?.catch?.(() => !locked() && openMenu("main"));
  touchPlaying = true;
  inGame();
  // Phones get the whole screen where the browser allows it.
  if (!document.fullscreenElement) document.documentElement.requestFullscreen?.({ navigationUI: "hide" })?.catch(() => {});
  renderTouch();
}

// Leaves the game without opening anything; the caller shows what's next.
export function leaveGame() {
  touchPlaying = false;
  controls.sprintArmed = false;
  resetTouch();
  controls.keys.clear();
  stopMining();
  renderTouch();
  if (locked()) document.exitPointerLock();
}

// The play button, and the connection's state on it.
playBtn.onclick = () => {
  if (health.dead) respawn();
  enterGame();
};

export function setPlayable(ready) {
  playBtn.disabled = !ready;
  if (ready && playBtn.textContent === "Connecting…") playBtn.textContent = "Play";
}

canvas.addEventListener("click", () => !touchModeOn && !locked() && !menuOpen() && enterGame());

document.addEventListener("pointerlockchange", () => {
  if (locked()) return inGame();
  if (touchPlaying) return;
  controls.keys.clear();
  stopMining();
  if (!chatOpen() && !deathShown() && !inventoryOpen()) openMenu("main");
});

// Ctrl is sprint, and Ctrl+W closes the tab on Windows and Linux; ask before
// leaving mid-game rather than lose the session to a slip.
addEventListener("beforeunload", (e) => {
  if (locked()) e.preventDefault();
});
