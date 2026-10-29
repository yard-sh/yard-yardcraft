// Yardcraft's entry point: connects to the world's room, handles joining it,
// and runs the frame loop. Every other module only sets itself up when
// loaded (listeners, scene objects, message handlers); this file starts
// things and calls into them each frame.
import { MAX_HP } from "./shared/rules.js";
import { settings, watchSetting } from "./core/settings.js";
import { setVolume, setListener } from "./audio/sounds.js";
import { camera, render } from "./render/renderer.js";
import { updateSky, syncClock } from "./render/sky.js";
import { on, connect, disconnect } from "./net.js";
import { game } from "./game/state.js";
import { step, spawn, sendPose } from "./game/player.js";
import { placeCamera } from "./game/camera.js";
import { newWorld, streamChunks } from "./game/chunks.js";
import { updateInteraction, isBreaking, isEating } from "./game/interact.js";
import { resetHealth, regenTick } from "./game/health.js";
import { setOthers, moveOthersTo, animateOthers } from "./entities/players.js";
import { buildSelf, animateSelf, handVisible } from "./entities/avatar.js";
import { renderPlayers, renderHotbar } from "./ui/hud.js";
import { setInventory, setMode } from "./game/inventory.js";
import { updateItems } from "./entities/items.js";
import { setMobs, updateMobs } from "./entities/mobs.js";
import { setConnection, updateDebug } from "./ui/debug.js";
import { renderHearts } from "./ui/hearts.js";
import { setResetAt, renderCountdown } from "./ui/countdown.js";
import { logLine } from "./ui/chat.js";
import { loadProfile, forgetGuest, renderPreview } from "./ui/character.js";
import { playing, renderTouch, setPlayable, touchPlayingNow, leaveGame } from "./input/session.js";
import { renderTouchButtons } from "./input/touch.js";
import { openMenu } from "./ui/menu.js";
import { EMBED, whileSeen } from "./core/embed.js";
import "./input/desktop.js";

// ---------------------------------------------------------------- joining

// Every (re)connect starts from fresh chunks; the player stays put except
// on first join, or when the world was reset while they were away.
on("welcome", (msg) => {
  const reset = game.world && game.world.gen !== msg.gen;
  game.self = msg.self;
  if (msg.forgetGuest) forgetGuest();
  setMode(msg.self.mode ?? "survival");
  setInventory(msg.inv, msg.cursor);
  buildSelf();
  resetHealth(game.self.hp ?? MAX_HP);
  syncClock(msg);
  setResetAt(msg.resetAt);
  newWorld(msg.seed, msg.gen);
  setOthers(msg.players);
  setMobs(msg.mobs);
  if (!game.spawned) {
    spawn();
    game.spawned = true;
    logLine("Type <b>/help</b> to see the commands you can use.", "sys");
  } else if (reset) spawn();
  setPlayable(true);
  setConnection(null);
  renderPlayers();
});

// A new world for everyone: every 10 minutes, or /restart.
on("reset", (msg) => {
  setResetAt(msg.resetAt);
  newWorld(msg.seed, msg.gen);
  setMobs([]);
  if (msg.spawn) moveOthersTo(msg.spawn);
  spawn();
});

on("teleport", (msg) => {
  if (msg.spawn) spawn();
});

// ---------------------------------------------------------------- start

setVolume(settings.volume / 100);
watchSetting("volume", (v) => setVolume(v / 100));
renderHotbar();
renderTouch();
setConnection("Connecting…");

function dropped() {
  setConnection("Reconnecting…");
  setPlayable(false);
}

// Who you are first: signed in, or a guest (which gets you a guest id). An
// embed joins only once it's in sight, and leaves while it's out of sight.
let profileLoaded = null;
let joins = 0; // a join or leave since this join started makes it stale
function join() {
  const n = ++joins;
  (profileLoaded ??= loadProfile()).then(() => n === joins && connect(dropped));
}
function leave() {
  joins++;
  if (playing()) {
    leaveGame();
    openMenu("main");
  }
  disconnect();
  dropped();
}
if (EMBED) whileSeen(join, leave);
else join();

// ---------------------------------------------------------------- loop

let last = performance.now();

function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;

  if (game.self && game.world) {
    step(dt);
    sendPose(now, isBreaking());
    updateInteraction(dt, playing());
    // Load more per frame while nobody's playing yet.
    streamChunks(playing() ? 6 : 16);
    regenTick(now);
  }

  placeCamera(dt);
  setListener(camera.position.x, camera.position.y, camera.position.z, camera.rotation.y);
  updateSky(dt);
  updateDebug(now);
  if (touchPlayingNow()) renderTouchButtons();
  renderHearts(now);
  renderCountdown();

  animateOthers(dt, now);
  animateSelf(dt, now, isBreaking(), isEating());
  updateItems(dt, now);
  updateMobs(dt, now);
  render(handVisible());
  renderPreview(dt);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
