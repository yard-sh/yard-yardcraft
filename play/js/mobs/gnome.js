// The garden gnome: a little figure in a tall red hat, white beard and blue
// coat, who stands about the yard like an ornament and shuffles off when
// you're not looking (or runs, when hit). Its stats and behaviour are in
// shared/mobs.js.
import { mobPainter } from "./paint.js";

// In texture pixels, feet at y = 0, drawn 28 to the block (it stands just
// under a block tall); it faces -z.
export const model = {
  texture: [64, 64],
  px: 1 / 28,
  parts: {
    body: { pivot: [0, 7, 0], size: [8, 6, 5], uv: [0, 22] },
    head: {
      pivot: [0, 10, 0],
      size: [6, 6, 6],
      uv: [0, 0],
      at: [0, 3, 0],
      children: {
        beard: { size: [6, 4, 1], uv: [24, 0], at: [0, 1, -3.5] },
        nose: { size: [2, 2, 2], uv: [40, 0], at: [0, 4, -4] },
        // The hat narrows in steps and leans back a little.
        hat: {
          pivot: [0, 6, 0],
          rotate: [12, 0, 0],
          size: [7, 3, 7],
          uv: [0, 12],
          at: [0, 1.5, 0],
          children: {
            hat2: { size: [5, 3, 5], uv: [28, 12], at: [0, 4.5, 0.3] },
            hat3: { size: [3, 3, 3], uv: [48, 12], at: [0, 7.5, 0.6] },
            hat4: { size: [1, 2, 1], uv: [60, 12], at: [0, 10, 0.9] },
          },
        },
      },
    },
    armR: { pivot: [5, 10, 0], size: [2, 5, 2], uv: [26, 22], at: [0, -2.5, 0] },
    armL: { pivot: [-5, 10, 0], size: [2, 5, 2], uv: [26, 22], at: [0, -2.5, 0] },
    legR: { pivot: [1.6, 4, 0], size: [3, 4, 3], uv: [34, 22], at: [0, -2, 0] },
    legL: { pivot: [-1.6, 4, 0], size: [3, 4, 3], uv: [34, 22], at: [0, -2, 0] },
  },
};

// How it moves: legs and arms swing as it walks (by sign, opposite arm with
// each leg), how far and how fast (short legs, quick steps); the part that
// turns to look at things; its sounds (audio/synth.js).
export const motion = {
  legs: { legR: 1, legL: -1, armR: -0.8, armL: 0.8 },
  swing: 1,
  stride: 5,
  head: "head",
  sounds: { ambient: "hum", hurt: "hup", death: "hup" },
};

const SKIN = [238, 194, 160], NOSE = [228, 146, 128], BEARD = [236, 236, 230];
const HAT = [204, 38, 42], COAT = [52, 92, 176], BELT = [72, 46, 26], BUCKLE = [242, 202, 74];
const TROUSERS = [46, 56, 96], BOOTS = [74, 48, 28], EYE = [36, 28, 30];

export function paint() {
  const p = mobPainter(model, 0x6e0e);
  const shade = (c, k) => c.map((v) => v * k);
  p.part("head", () => SKIN, 0.03);
  p.part("nose", () => NOSE, 0.03);
  p.part("beard", (face, x, y) => (y > 0 && p.rnd() < 0.15 ? shade(BEARD, 0.9) : BEARD), 0.02);
  for (const hat of ["hat", "hat2", "hat3", "hat4"]) p.part(hat, () => (p.rnd() < 0.12 ? shade(HAT, 0.85) : HAT), 0.04);
  // The coat with a belt round it and a buckle at the front.
  p.part("body", (face, x, y, w, h) => {
    if (face !== "top" && face !== "bottom" && y === h - 2) return face === "front" && (x === 3 || x === 4) ? BUCKLE : BELT;
    return COAT;
  }, 0.05);
  p.part("armR", (face, x, y, w, h) => (face !== "top" && y === h - 1) || face === "bottom" ? SKIN : COAT, 0.04);
  p.part("legR", (face, x, y, w, h) => (face === "bottom" || (face !== "top" && y >= h - 2) ? BOOTS : TROUSERS), 0.04);
  // Two dark eyes above the nose.
  p.at("head", "front", 1, 2, EYE);
  p.at("head", "front", 4, 2, EYE);
  return p.done();
}
