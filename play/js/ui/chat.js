// Chat: the message log, the input line, and /commands (the server runs
// them and answers with private "system" lines).
import { $, esc } from "../core/dom.js";
import { on, send } from "../net.js";
import { displayName } from "../game/state.js";
import { enterGame, leaveGame, playing, locked, touchMode } from "../input/session.js";
import { openMenu } from "./menu.js";

const chatEl = $("chat");
const logEl = $("log");
const sayEl = $("say");
const MAX_LINES = 12;

export const chatOpen = () => chatEl.classList.contains("open");

// Adds a line to the log; html must already be escaped. cls marks system lines.
export function logLine(html, cls) {
  const line = document.createElement("div");
  line.innerHTML = html;
  if (cls) line.className = cls;
  logEl.append(line);
  while (logEl.children.length > MAX_LINES) logEl.firstChild.remove();
  setTimeout(() => line.classList.add("old"), 10000);
}

// Opens the input, starting it with prefix ("/" for a command).
export function openChat(prefix = "") {
  const resume = playing();
  leaveGame();
  chatEl.classList.add("open");
  chatEl.dataset.resume = resume ? "1" : "";
  $("overlay").classList.add("hidden");
  sayEl.value = prefix;
  sayEl.focus();
}

export function closeChat() {
  chatEl.classList.remove("open");
  sayEl.blur();
  // Touch players go straight back to the game; on desktop Esc shows the
  // menu (and Enter re-captures the mouse right after).
  if (touchMode() && chatEl.dataset.resume) enterGame();
  else if (!locked()) openMenu("main");
}

// Hides the chat without going anywhere (you died).
export function hideChat() {
  chatEl.classList.remove("open");
}

// Enter, or a phone keyboard's Send key, submits the form.
$("say-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const text = sayEl.value.trim();
  if (text.startsWith("/")) send({ type: "command", text });
  else if (text) send({ type: "chat", text });
  sayEl.value = "";
  closeChat();
  enterGame();
});

// Tapping away from the keyboard on a phone closes chat.
sayEl.addEventListener("blur", () => {
  if (touchMode() && chatOpen()) setTimeout(() => chatOpen() && closeChat(), 150);
});

on("chat", (msg) => logLine(`<b style="color:${esc(msg.color)}">${esc(displayName(msg))}</b> ${esc(msg.text)}`));

on("system", (msg) => {
  for (const line of String(msg.text).split("\n")) logLine(esc(line), msg.error ? "sys err" : "sys");
});
