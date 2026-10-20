// The character screen: your name, skin and arm model, with a turning
// preview. Your profile lives in the project's database, read and saved
// through the service's api/profile. Signed out, you play as a guest: Yard
// gives this browser a guest id (__yard/auth/guest) that the service and the
// room know you by; guests start as GuestNNN and can't upload skins.
import * as THREE from "three";
import { NAME_RE } from "../shared/rules.js";
import { PRESETS, presetSkin } from "../skins/presets.js";
import { normalizeSkin, loadImage, faceIcon } from "../skins/format.js";
import { createPlayerModel } from "../skins/model.js";
import { skinEntry, hasSkin, setSkin } from "../skins/cache.js";
import { pixelTexture } from "../render/textures.js";
import { $ } from "../core/dom.js";
import { send } from "../net.js";
import { openMenu, menuScreen } from "./menu.js";

const charName = $("char-name");
const charMsg = $("char-msg");
const skinGrid = $("skin-grid");
const skinFile = $("skin-file");
const charSave = $("char-save");
const charView = $("char-view");
let profile = null; // as saved
let draft = null; // { name, model, skin, upload? } being edited
let preview = null; // the preview's renderer, scene and model
let guest = false; // playing signed out

// Reads your profile. Signed out with no guest id yet, it asks Yard for one
// first (the room, joined after this, then knows you by it too).
export async function loadProfile() {
  try {
    localStorage.removeItem("yardcraft.guest"); // where guests used to keep a token of their own
  } catch {}
  try {
    let res = await fetch("api/profile");
    if (res.status === 401) {
      await fetch("__yard/auth/guest", { method: "POST" });
      res = await fetch("api/profile");
    }
    if (res.ok) ({ profile, guest } = await res.json());
  } catch {}
  $("menu-guest").hidden = !guest;
}

// Signed in after playing as a guest: the room has moved the guest's things
// over, so the guest id can go.
export function forgetGuest() {
  fetch("__yard/auth/guest", { method: "DELETE" }).catch(() => {});
}

// Yard's sign-in, coming back to the game.
function signInLink() {
  const a = document.createElement("a");
  a.href = "__yard/auth/login?return=/";
  a.textContent = "Sign in";
  return a;
}

function note(text, cls = "") {
  charMsg.textContent = text;
  charMsg.className = `note ${cls}`;
}

export async function openCharacter() {
  if (!profile) await loadProfile();
  if (!profile) return note("Couldn't load your character. Try again in a moment.", "err");
  draft = { ...profile, upload: null };
  charName.value = draft.name;
  charName.classList.remove("bad");
  $("skin-upload").hidden = !!guest;
  if (guest) {
    note("");
    charMsg.append("You're playing as a guest. ", signInLink(), " to upload your own skin and keep your character on any device.");
  } else {
    note("Upload any Minecraft skin (64×64 or 64×32 PNG).");
  }
  renderSkinGrid();
  renderModelButtons();
  setupPreview();
  rebuildPreview();
}

export function closeCharacter() {
  draft = null;
}

// The skin tiles: every preset, your saved upload, and a new upload.
function renderSkinGrid() {
  const tiles = PRESETS.map((s) => ({ key: `preset:${s.id}`, name: s.name, canvas: presetSkin(s.id) }));
  if (profile.skin.startsWith("custom:")) tiles.unshift({ key: profile.skin, name: "Yours", canvas: skinEntry(profile.skin).canvas });
  if (draft.upload) tiles.unshift({ key: "upload", name: "Upload", canvas: draft.upload });
  skinGrid.replaceChildren(
    ...tiles.map((t) => {
      const b = document.createElement("button");
      b.className = t.key === draft.skin ? "on" : "";
      b.append(faceIcon(t.canvas, 32), t.name);
      b.onclick = () => {
        draft.skin = t.key;
        const preset = PRESETS.find((s) => `preset:${s.id}` === t.key);
        if (preset) draft.model = preset.slim ? "slim" : "classic";
        renderSkinGrid();
        renderModelButtons();
        rebuildPreview();
      };
      return b;
    }),
  );
}

function renderModelButtons() {
  for (const b of document.querySelectorAll("#char-model button")) b.classList.toggle("on", b.dataset.model === draft.model);
}
$("char-model").onclick = (e) => {
  const b = e.target.closest("[data-model]");
  if (!b || !draft) return;
  draft.model = b.dataset.model;
  renderModelButtons();
  rebuildPreview();
};

const draftCanvas = () => (draft.skin === "upload" ? draft.upload : skinEntry(draft.skin).canvas);

$("skin-upload").onclick = () => skinFile.click();
skinFile.onchange = async () => {
  const file = skinFile.files[0];
  skinFile.value = "";
  if (!file) return;
  try {
    const url = URL.createObjectURL(file);
    const img = await loadImage(url).finally(() => URL.revokeObjectURL(url));
    const { canvas: c, slim } = normalizeSkin(img);
    draft.upload = c;
    draft.skin = "upload";
    draft.model = slim ? "slim" : "classic";
    note(`Loaded ${file.name}${img.height === 32 ? " (an older 64×32 skin, converted)" : ""}. ${slim ? "Slim" : "Classic"} arms detected.`, "ok");
    renderSkinGrid();
    renderModelButtons();
    rebuildPreview();
  } catch (err) {
    note(err.message, "err");
  }
};

$("skin-download").onclick = () => {
  if (!draft) return;
  const a = document.createElement("a");
  a.href = draftCanvas().toDataURL("image/png");
  a.download = `${charName.value || "skin"}.png`;
  a.click();
};

charName.oninput = () => charName.classList.toggle("bad", !NAME_RE.test(charName.value));

charSave.onclick = async () => {
  const name = charName.value.trim();
  if (!NAME_RE.test(name)) {
    charName.classList.add("bad");
    return note("Names are 3–16 letters, digits or underscores.", "err");
  }
  const body = { name, model: draft.model, skin: draft.skin };
  if (draft.skin === "upload") body.png = draft.upload.toDataURL("image/png").split(",")[1];
  charSave.disabled = true;
  note("Saving…");
  try {
    const res = await fetch("api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Saving failed (${res.status}).`);
    profile = data.profile;
    // The upload is already here; don't fetch it back.
    if (draft.skin === "upload" && !hasSkin(profile.skin)) setSkin(profile.skin, draft.upload);
    send({ type: "profile" }); // the room reads it from the database and tells everyone
    openMenu("main");
  } catch (err) {
    note(err.message, "err");
  } finally {
    charSave.disabled = false;
  }
};

// A small second renderer for the turning preview.
function setupPreview() {
  if (preview) return;
  const r = new THREE.WebGLRenderer({ canvas: charView, antialias: true, alpha: true });
  r.setPixelRatio(Math.min(devicePixelRatio, 2));
  const sc = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(30, 1, 0.1, 20);
  cam.position.set(0, 1.05, 4.6);
  cam.lookAt(0, 0.95, 0);
  const key = new THREE.DirectionalLight(0xffffff, Math.PI * 0.6);
  key.position.set(1.5, 2.5, 3);
  sc.add(key, new THREE.AmbientLight(0xffffff, Math.PI * 0.55));
  preview = { r, sc, cam, model: null, turn: Math.PI - 0.5, texture: null, drag: null, t: 0 };
  charView.addEventListener("pointerdown", (e) => {
    preview.drag = e.clientX;
    charView.setPointerCapture(e.pointerId);
  });
  charView.addEventListener("pointermove", (e) => {
    if (preview.drag === null) return;
    preview.turn += (e.clientX - preview.drag) * 0.012;
    preview.drag = e.clientX;
  });
  charView.addEventListener("pointerup", () => (preview.drag = null));
}

function rebuildPreview() {
  if (!preview || !draft) return;
  if (preview.model) {
    preview.sc.remove(preview.model.root);
    preview.model.dispose();
  }
  preview.texture?.dispose();
  // Its own texture, so editing doesn't touch anyone's in-game skin.
  preview.texture = pixelTexture(draftCanvas());
  preview.model = createPlayerModel(preview.texture, draft.model === "slim");
  preview.model.root.traverse((n) => (n.castShadow = false));
  preview.sc.add(preview.model.root);
}

// Draws the preview while the character screen is open.
export function renderPreview(dt) {
  if (!preview?.model || menuScreen() !== "character") return;
  const w = charView.clientWidth, h = charView.clientHeight;
  if (charView.width !== Math.floor(w * preview.r.getPixelRatio())) {
    preview.r.setSize(w, h, false);
    preview.cam.aspect = w / h;
    preview.cam.updateProjectionMatrix();
  }
  preview.t += dt;
  if (preview.drag === null) preview.turn += dt * 0.25;
  // Looks around a little while it stands there.
  preview.model.animate(dt, {
    yaw: preview.turn + Math.sin(preview.t * 0.7) * 0.4,
    pitch: Math.sin(preview.t * 0.9) * 0.15,
    speed: 0,
    sneaking: false,
    swinging: false,
  });
  preview.model.root.rotation.y = 0;
  preview.r.render(preview.sc, preview.cam);
}
