// The options screen, built from one table: add an option by adding a row
// here and a default in core/settings.js.
import { settings, setSetting, watchSetting, SHADOW_SIZES } from "../core/settings.js";
import { shadowSizes } from "../render/sky.js";
import { MIN_LOAD_R, MAX_LOAD_R } from "../world/world.js";
import { $, el } from "../core/dom.js";
import { VIEW_NAMES } from "../game/camera.js";

const onOff = (v) => (v ? "On" : "Off");
const SHADOW_NAMES = ["Low", "Medium", "High", "Ultra"]; // by SHADOW_SIZES

// Sliders have a range; buttons step to next(value) when pressed.
const OPTIONS = [
  { key: "sens", label: "Look sensitivity", range: [10, 300, 5], show: (v) => `${v}%` },
  { key: "volume", label: "Sound", range: [0, 100, 5], show: (v) => (v ? `${v}%` : "Off") },
  { key: "fov", label: "Field of view", range: [50, 110, 1], show: (v) => v },
  { key: "distance", label: "Render distance", range: [MIN_LOAD_R, MAX_LOAD_R, 1], show: (v) => `${v} chunks` },
  { key: "view", label: "View", next: (v) => (v + 1) % VIEW_NAMES.length, show: (v) => VIEW_NAMES[v] },
  { key: "shadows", label: "Shadows", next: (v) => !v, show: onOff },
  {
    key: "shadowRes",
    label: "Shadow quality",
    next: (v) => shadowSizes[(shadowSizes.indexOf(v) + 1) % shadowSizes.length],
    show: (v) => `${SHADOW_NAMES[SHADOW_SIZES.indexOf(v)]} (${v}px)`,
  },
  { key: "invert", label: "Invert mouse", next: (v) => !v, show: onOff },
  { key: "hand", label: "Show hand", next: (v) => !v, show: onOff },
  { key: "autoJump", label: "Auto-jump", next: (v) => !v, show: onOff },
];

const controls = OPTIONS.map((o) => {
  if (o.range) {
    const [min, max, step] = o.range;
    const value = el("b");
    const input = el("input", { type: "range", min, max, step });
    input.oninput = () => setSetting(o.key, Number(input.value));
    return { o, node: el("label", { className: "slider" }, el("span", {}, `${o.label}: `, value), input), input, value };
  }
  const button = el("button", { className: "mc" });
  button.onclick = () => setSetting(o.key, o.next(settings[o.key]));
  return { o, node: button, button };
});
$("opts").replaceChildren(...controls.map((c) => c.node));

export function renderOptions() {
  for (const { o, input, value, button } of controls) {
    const v = settings[o.key];
    if (input) {
      input.value = v;
      value.textContent = o.show(v);
    } else {
      button.textContent = `${o.label}: ${o.show(v)}`;
    }
  }
}
watchSetting("*", renderOptions);
