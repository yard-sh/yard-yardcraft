// Every mob's look, by kind (the kinds themselves are in shared/mobs.js).
// Each module gives its model (boxes, render/box-model.js), how it moves
// and sounds (motion), and paints its texture (paint).
import { pixelTexture } from "../render/textures.js";
import * as gnome from "./gnome.js";

export const MOB_LOOKS = { gnome };

const textures = new Map(); // kind -> texture, painted on first use

export function mobTexture(kind) {
  if (!textures.has(kind)) textures.set(kind, pixelTexture(MOB_LOOKS[kind].paint()));
  return textures.get(kind);
}
