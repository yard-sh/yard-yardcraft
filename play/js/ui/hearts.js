// The hearts above the hotbar: Minecraft's 9×8 heart icons, blinking after
// damage and shaking when you're low. Hidden in creative.
import { MAX_HP } from "../shared/rules.js";
import { $ } from "../core/dom.js";
import { game, health, creative } from "../game/state.js";

const heartsEl = $("hearts");

// Minecraft's heart, 9 × 8: the outline and a fill inside it.
const HEART = [".###.###.", "#########", "#########", "#########", ".#######.", "..#####..", "...###...", "....#...."];
function heartIcon(fill, outline) {
  const cv = document.createElement("canvas");
  cv.width = cv.height = 9;
  const g = cv.getContext("2d");
  const on = (x, y) => HEART[y]?.[x] === "#";
  for (let y = 0; y < 8; y++)
    for (let x = 0; x < 9; x++) {
      if (!on(x, y)) continue;
      const inner = on(x - 1, y) && on(x + 1, y) && on(x, y - 1) && on(x, y + 1);
      const filled = fill === "full" || (fill === "half" && x <= 4);
      g.fillStyle = !inner ? outline : !filled ? "#2b0d0d" : x === 2 && y === 1 ? "#ffb3b3" : y >= 4 ? "#b01010" : "#e02020";
      g.fillRect(x, y + 1, 1, 1);
    }
  return `url(${cv.toDataURL()})`;
}
const HEARTS = {};
for (const fill of ["full", "half", "empty"])
  for (const [k, outline] of [["dark", "#1a0505"], ["blink", "#f4f4f4"]]) HEARTS[`${fill}-${k}`] = heartIcon(fill, outline);
const heartEls = Array.from({ length: MAX_HP / 2 }, () => heartsEl.appendChild(document.createElement("i")));
let heartsKey = ""; // what's drawn, so unchanged frames cost nothing

export function renderHearts(now) {
  const blink = now - health.hurtAt < 600 && Math.floor((now - health.hurtAt) / 120) % 2 === 0;
  const shake = health.hp <= 4 && !health.dead ? Math.floor(now / 90) : -1;
  const shown = !!game.self && !creative();
  const key = `${health.hp}|${blink}|${shake}|${shown}`;
  if (key === heartsKey) return;
  heartsKey = key;
  heartsEl.hidden = !shown;
  heartEls.forEach((el, i) => {
    const fill = health.hp >= i * 2 + 2 ? "full" : health.hp === i * 2 + 1 ? "half" : "empty";
    el.style.backgroundImage = HEARTS[`${fill}-${blink ? "blink" : "dark"}`];
    el.style.transform = shake >= 0 ? `translateY(${((shake * 7 + i * 13) % 5) - 2}px)` : "";
  });
}
