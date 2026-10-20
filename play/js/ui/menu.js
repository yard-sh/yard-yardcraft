// The menu overlay and its screens (main, character, options, controls).
// It shows whenever you're not in the game: on load, after Esc, on pause.
import { $ } from "../core/dom.js";
import { openCharacter, closeCharacter } from "./character.js";
import { renderOptions } from "./options.js";

const overlay = $("overlay");
const screens = [...overlay.querySelectorAll(".screen")];
let screen = "main";

export const menuOpen = () => !overlay.classList.contains("hidden");
export const menuScreen = () => (menuOpen() ? screen : null);

export function openMenu(name) {
  if (screen === "character" && name !== "character") closeCharacter();
  screen = name;
  overlay.classList.remove("hidden");
  for (const s of screens) s.hidden = s.dataset.screen !== name;
  if (name === "character") openCharacter();
  if (name === "options") renderOptions();
}

export function closeMenu() {
  overlay.classList.add("hidden");
}

// Buttons with data-go="<screen>" switch screens.
overlay.addEventListener("click", (e) => {
  const go = e.target.closest("[data-go]");
  if (go) openMenu(go.dataset.go);
});

// Esc goes back to the main screen (unless you're typing a name).
document.addEventListener("keydown", (e) => {
  if (e.code === "Escape" && menuOpen() && screen !== "main" && document.activeElement?.id !== "char-name") openMenu("main");
});
