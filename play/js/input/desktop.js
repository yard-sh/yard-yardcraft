// Keyboard and mouse.
import { game, controls } from "../game/state.js";
import { primaryDown, useDown, useUp, stopMining } from "../game/interact.js";
import { selectSlot, selectedSlot } from "../game/inventory.js";
import { chatOpen, openChat, closeChat } from "../ui/chat.js";
import { menuOpen } from "../ui/menu.js";
import { toggleDebug } from "../ui/debug.js";
import { inventoryOpen } from "../ui/inventory.js";
import { locked, playing } from "./session.js";
import { look, pressKey } from "./actions.js";

document.addEventListener("mousemove", (e) => {
  if (locked()) look(e.movementX, e.movementY, 0.0025);
});

// Right-click places or eats (hold). Trackpads often can't right-click under
// pointer lock, so ⌘/Alt + click or F does too. (Ctrl is sprint, so
// Ctrl-click still breaks.)
let using = false;
document.addEventListener("mousedown", (e) => {
  if (!locked()) return;
  const modified = e.metaKey || e.altKey;
  if (e.button === 2 || (e.button === 0 && modified)) {
    using = true;
    useDown();
  } else if (e.button === 0) primaryDown();
});
document.addEventListener("mouseup", (e) => {
  if (using && (e.button === 2 || e.button === 0)) {
    using = false;
    useUp();
  } else if (e.button === 0) stopMining();
});
document.addEventListener("contextmenu", (e) => e.preventDefault());

document.addEventListener("wheel", (e) => {
  if (locked()) selectSlot(selectedSlot() + Math.sign(e.deltaY));
});

document.addEventListener("keydown", (e) => {
  if (inventoryOpen()) return; // it handles its own keys
  if (chatOpen()) {
    if (e.code === "Escape") closeChat();
    return;
  }
  // F3 shows the debug screen, in the game or not, as in Minecraft.
  if (e.code === "F3") {
    e.preventDefault();
    if (!e.repeat) toggleDebug();
    return;
  }
  // Enter opens chat; / opens it with a command started.
  if ((e.code === "Enter" || e.code === "Slash") && game.self && (playing() || !menuOpen())) {
    e.preventDefault();
    openChat(e.code === "Slash" ? "/" : "");
    return;
  }
  if (!playing()) return;
  if (e.code === "Space") e.preventDefault();
  pressKey(e.code, e.repeat);
});
document.addEventListener("keyup", (e) => {
  controls.keys.delete(e.code);
  if (e.code === "KeyF") useUp();
});

// F5 changes the view rather than reloading the page while playing.
addEventListener("keydown", (e) => e.code === "F5" && playing() && e.preventDefault(), true);
