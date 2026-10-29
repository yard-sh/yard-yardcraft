// The countdown at the top of the screen to the world's next reset. The
// room says when that is, on its clock.
import { $ } from "../core/dom.js";
import { serverNow } from "../render/sky.js";

const timerEl = $("reset-timer");
let resetAt = null;
let drawn = ""; // what's drawn, so unchanged frames cost nothing

export function setResetAt(at) {
  resetAt = at;
}

export function renderCountdown() {
  const left = resetAt === null ? null : Math.max(0, Math.ceil((resetAt - serverNow()) / 1000));
  const text =
    left === null ? "" : left > 0 ? `World resets in ${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}` : "Resetting…";
  if (text === drawn) return;
  drawn = text;
  timerEl.hidden = !text;
  timerEl.textContent = text;
  timerEl.classList.toggle("soon", left !== null && left <= 60);
  timerEl.classList.toggle("now", left !== null && left <= 15);
}
