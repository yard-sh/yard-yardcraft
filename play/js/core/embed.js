// With ?embed the game sits in another page (Yard's landing page): it joins
// the world only while the frame is in sight, lets the page around it keep
// its scroll, and opens sign-in and the full game in a new tab.
import { $ } from "./dom.js";

export const EMBED = new URLSearchParams(location.search).has("embed");

const AWAY_MS = 20000; // out of sight this long, the game leaves the world

document.documentElement.classList.toggle("embed", EMBED);

if (EMBED) {
  const full = new URL(location.href);
  full.searchParams.delete("embed");
  const openTab = $("open-tab");
  openTab.hidden = false;
  openTab.onclick = () => open(full, "_blank", "noopener");
}

// Calls show() when the frame first comes into sight, then hide() once it
// has been out of sight (scrolled past, or in a hidden tab) for AWAY_MS, and
// show() again when it's back: the two always alternate.
export function whileSeen(show, hide) {
  let onScreen = false;
  let shown = false;
  let away = 0;
  const update = () => {
    clearTimeout(away);
    if (onScreen && document.visibilityState === "visible") {
      if (!shown) {
        shown = true;
        show();
      }
    } else if (shown) {
      away = setTimeout(() => {
        shown = false;
        hide();
      }, AWAY_MS);
    }
  };
  new IntersectionObserver((entries) => {
    onScreen = entries.some((entry) => entry.isIntersecting);
    update();
  }).observe(document.documentElement);
  document.addEventListener("visibilitychange", update);
}
