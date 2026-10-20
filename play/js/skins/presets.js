// The preset skins, painted pixel by pixel into Minecraft's skin layout.
import { SKIN_PRESETS } from "../shared/rules.js";
import { mulberry32 } from "../core/noise.js";
import { PARTS, boxFaces, partSize, blankCanvas } from "./format.js";

// Each preset's id, name and whether its arms are slim.
export const PRESETS = SKIN_PRESETS;

// A tiny pixel painter over one skin canvas. Colours are [r, g, b] and get a
// little noise so flat areas read as cloth, skin or metal.
function painter(seed) {
  const cv = blankCanvas();
  const g = cv.getContext("2d");
  const img = g.createImageData(64, 64);
  const rnd = mulberry32(seed);
  const p = {
    slim: false,
    set(x, y, c, a = 255, n = 0.05) {
      const i = (y * 64 + x) * 4;
      const k = 1 + (rnd() * 2 - 1) * n;
      img.data[i] = c[0] * k;
      img.data[i + 1] = c[1] * k;
      img.data[i + 2] = c[2] * k;
      img.data[i + 3] = a;
    },
    clear(x, y) {
      img.data[(y * 64 + x) * 4 + 3] = 0;
    },
    rect([x, y, w, h], c, n) {
      for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) p.set(x + i, y + j, c, 255, n);
    },
    faces(part, layer = "base") {
      const [u, v] = PARTS[part][layer];
      return boxFaces(u, v, ...partSize(part, p.slim));
    },
    // Fills a whole box, every face.
    fill(part, c, layer = "base", n) {
      for (const f of Object.values(p.faces(part, layer))) p.rect(f, c, n);
    },
    // Rows y0..y1-1 of the four side faces (0 is the top of the box), plus
    // the top or bottom face when the band reaches it.
    band(part, y0, y1, c, layer = "base", n) {
      const f = p.faces(part, layer);
      for (const s of ["front", "back", "left", "right"]) p.rect([f[s][0], f[s][1] + y0, f[s][2], y1 - y0], c, n);
      const h = f.front[3];
      if (y0 === 0) p.rect(f.top, c, n);
      if (y1 === h) p.rect(f.bottom, c, n);
    },
    // Pixel (x, y) of one face, in that face's own coordinates.
    at(part, face, x, y, c, layer = "base", n) {
      const f = p.faces(part, layer)[face];
      p.set(f[0] + x, f[1] + y, c, 255, n);
    },
    done() {
      g.putImageData(img, 0, 0);
      return cv;
    },
  };
  return p;
}

const shade = (c, k) => c.map((v) => Math.min(255, v * k));

// A person: skin, hair, a face, shirt, sleeves, trousers and shoes.
function person(p, o) {
  const skin = o.skin, hair = o.hair;
  p.fill("head", skin);
  // Hair: the crown, a fringe, longer at the sides and back.
  const f = p.faces("head");
  p.rect(f.top, hair);
  p.rect([f.front[0], f.front[1], 8, o.fringe ?? 2], hair);
  for (const s of ["left", "right"]) p.rect([f[s][0], f[s][1], 8, o.long ? 7 : 3], hair);
  p.rect([f.back[0], f.back[1], 8, o.long ? 8 : 6], hair);
  if (o.long) {
    p.at("head", "front", 0, 2, hair), p.at("head", "front", 7, 2, hair);
    for (let y = 2; y < 6; y++) p.at("head", "front", 0, y, hair), p.at("head", "front", 7, y, hair);
  }
  // Eyes, brows, nose and mouth.
  const eye = o.eyes ?? [70, 110, 190];
  p.at("head", "front", 1, 4, [245, 245, 245], "base", 0), p.at("head", "front", 2, 4, eye, "base", 0);
  p.at("head", "front", 5, 4, eye, "base", 0), p.at("head", "front", 6, 4, [245, 245, 245], "base", 0);
  const brow = shade(hair, 0.8);
  if (!o.noBrows) for (const x of [1, 2, 5, 6]) p.at("head", "front", x, 3, brow);
  p.at("head", "front", 3, 5, shade(skin, 0.85)), p.at("head", "front", 4, 5, shade(skin, 0.85));
  for (const x of [3, 4]) p.at("head", "front", x, 6, o.mouth ?? shade(skin, 0.62));
  if (o.mouthWide) p.at("head", "front", 2, 6, shade(skin, 0.75)), p.at("head", "front", 5, 6, shade(skin, 0.75));

  // Shirt, sleeves, hands.
  p.fill("body", o.shirt);
  for (const arm of ["armR", "armL"]) {
    p.fill(arm, skin);
    p.band(arm, 0, o.sleeves ?? 4, o.shirt);
    if (o.cuff) p.band(arm, (o.sleeves ?? 4) - 1, o.sleeves ?? 4, o.cuff);
  }
  // Trousers and shoes.
  for (const leg of ["legR", "legL"]) {
    p.fill(leg, o.pants);
    p.band(leg, 12 - (o.shoeRows ?? 2), 12, o.shoes);
  }
  if (o.belt) p.band("body", 10, 11, o.belt);
  if (o.collar) for (let x = 2; x < 6; x++) p.at("body", "front", x, 0, o.collar);
}

// Bib overalls over a shirt: a bib and straps on the body, denim legs.
function overalls(p, c) {
  const f = p.faces("body");
  for (let y = 4; y < 12; y++) for (let x = 1; x < 7; x++) p.at("body", "front", x, y, c);
  for (let y = 0; y < 4; y++) p.at("body", "front", 1, y, c), p.at("body", "front", 6, y, c);
  for (let y = 0; y < 12; y++) p.at("body", "back", 1, y, c), p.at("body", "back", 6, y, c);
  p.rect([f.back[0] + 1, f.back[1] + 7, 6, 5], c);
  p.band("body", 9, 12, c);
  p.at("body", "front", 2, 5, [220, 200, 120], "base", 0), p.at("body", "front", 5, 5, [220, 200, 120], "base", 0);
  for (const leg of ["legR", "legL"]) p.band(leg, 0, 10, c);
}

const SKIN = {
  light: [236, 196, 164],
  tan: [204, 152, 112],
  brown: [150, 98, 66],
  dark: [104, 66, 44],
};

// How each preset is painted, by id; their names live in shared/rules.js.
const PAINTERS = {
  wanderer(p) {
    person(p, {
      skin: SKIN.tan, hair: [74, 50, 32], shirt: [62, 128, 74], sleeves: 5, pants: [72, 64, 118], shoes: [58, 50, 46],
      belt: [96, 66, 40], collar: shade(SKIN.tan, 0.9),
    });
  },
  ranger(p) {
    person(p, {
      skin: SKIN.light, hair: [196, 92, 40], long: true, eyes: [60, 140, 90], shirt: [46, 120, 120], sleeves: 12,
      cuff: [30, 84, 84], pants: [58, 52, 60], shoes: [110, 72, 42], shoeRows: 4, belt: [110, 72, 42],
    });
    // A dark green cloak over the back, its hood down.
    p.band("body", 0, 12, [44, 82, 46], "over");
    const f = p.faces("body", "over");
    for (let y = 0; y < 12; y++) for (let x = 0; x < 8; x++) p.clear(f.front[0] + x, f.front[1] + y);
    p.rect([f.front[0], f.front[1], 2, 12], [44, 82, 46]);
    p.rect([f.front[0] + 6, f.front[1], 2, 12], [44, 82, 46]);
    p.at("body", "front", 2, 0, [214, 180, 70], "over", 0);
  },
  miner(p) {
    person(p, {
      skin: SKIN.brown, hair: [36, 28, 24], shirt: [150, 150, 146], sleeves: 6, pants: [60, 80, 140], shoes: [54, 40, 30],
      shoeRows: 3, eyes: [70, 50, 34],
    });
    overalls(p, [60, 80, 140]);
    // A yellow hard hat with a lamp.
    const hat = [232, 190, 44];
    p.band("head", 0, 3, hat, "over");
    const f = p.faces("head", "over");
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) if (y > 2) for (const s of ["front", "back", "left", "right"]) p.clear(f[s][0] + x, f[s][1] + y);
    p.rect(f.bottom, hat);
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) p.clear(f.bottom[0] + x, f.bottom[1] + y);
    p.at("head", "front", 3, 1, [255, 250, 200], "over", 0), p.at("head", "front", 4, 1, [255, 250, 200], "over", 0);
    p.at("head", "front", 3, 2, [140, 140, 140], "over", 0), p.at("head", "front", 4, 2, [140, 140, 140], "over", 0);
    // Soot on the face.
    p.at("head", "front", 6, 5, shade(SKIN.brown, 0.7)), p.at("head", "front", 1, 6, shade(SKIN.brown, 0.75));
  },
  knight(p) {
    const steel = [176, 180, 188], dark = [104, 108, 118], red = [164, 40, 44];
    person(p, { skin: SKIN.light, hair: [120, 80, 40], shirt: dark, sleeves: 12, pants: dark, shoes: [70, 72, 80] });
    // Helmet with an eye slit and a red plume stripe.
    p.fill("head", steel, "over", 0.08);
    for (let x = 1; x < 7; x++) p.at("head", "front", x, 4, [26, 26, 30], "over", 0);
    for (let y = 5; y < 8; y += 2) for (let x = 2; x < 6; x += 1) p.at("head", "front", x, y, shade(steel, 0.75), "over");
    const ft = p.faces("head", "over").top;
    p.rect([ft[0] + 3, ft[1], 2, 8], red);
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) p.clear(p.faces("head", "over").bottom[0] + x, p.faces("head", "over").bottom[1] + y);
    // Breastplate with a red tabard down the front.
    p.fill("body", steel, "over", 0.08);
    for (let y = 0; y < 12; y++) for (let x = 2; x < 6; x++) p.at("body", "front", x, y, red, "over");
    for (let x = 2; x < 6; x++) p.at("body", "front", x, 10, [214, 178, 64], "over", 0);
    // Pauldrons, gauntlets and greaves.
    for (const arm of ["armR", "armL"]) p.band(arm, 0, 4, steel, "over"), p.band(arm, 9, 12, steel, "over");
    for (const leg of ["legR", "legL"]) p.band(leg, 0, 12, steel, "over"), p.band(leg, 10, 12, [80, 82, 90], "over");
  },
  astronaut(p) {
    const suit = [232, 234, 238], trim = [214, 92, 40], glass = [24, 36, 72];
    person(p, { skin: SKIN.tan, hair: [40, 30, 26], shirt: suit, sleeves: 12, pants: suit, shoes: [120, 124, 132], shoeRows: 3 });
    for (const arm of ["armR", "armL"]) p.band(arm, 10, 12, [160, 164, 172]), p.band(arm, 3, 4, trim);
    for (const leg of ["legR", "legL"]) p.band(leg, 5, 6, trim);
    // Chest panel.
    for (let y = 3; y < 7; y++) for (let x = 2; x < 6; x++) p.at("body", "front", x, y, [90, 96, 110]);
    p.at("body", "front", 2, 4, [80, 220, 120], "base", 0), p.at("body", "front", 4, 4, [230, 70, 60], "base", 0);
    p.at("body", "front", 3, 5, [70, 160, 240], "base", 0), p.at("body", "front", 5, 5, [240, 200, 60], "base", 0);
    p.band("body", 9, 10, trim);
    // Helmet with a dark visor and a glint.
    p.fill("head", suit, "over", 0.03);
    for (let y = 2; y < 7; y++) for (let x = 1; x < 7; x++) p.at("head", "front", x, y, glass, "over", 0.1);
    p.at("head", "front", 2, 3, [170, 200, 240], "over", 0), p.at("head", "front", 3, 2, [120, 150, 210], "over", 0);
    for (const s of ["left", "right"]) for (let y = 3; y < 6; y++) p.at("head", s, 1, y, trim, "over");
  },
  wizard(p) {
    const robe = [86, 52, 140], deep = [58, 34, 98], beard = [228, 228, 232], gold = [226, 186, 70];
    person(p, {
      skin: SKIN.light, hair: beard, eyes: [60, 70, 150], shirt: robe, sleeves: 10, cuff: gold, pants: robe,
      shoes: deep, shoeRows: 1, mouth: beard,
    });
    // A long white beard over the chin and chest.
    for (let y = 5; y < 8; y++) for (let x = 1; x < 7; x++) if (!(y === 5 && x > 2 && x < 5)) p.at("head", "front", x, y, beard);
    for (let y = 0; y < 5; y++) for (let x = 2 + (y >> 1); x < 6 - (y >> 1); x++) p.at("body", "front", x, y, beard, "over");
    p.band("body", 10, 11, gold);
    // A pointed hat (as pointed as a cube allows) with a gold band and star.
    p.band("head", 0, 3, robe, "over");
    const f = p.faces("head", "over");
    for (let y = 3; y < 8; y++) for (const s of ["front", "back", "left", "right"]) for (let x = 0; x < 8; x++) p.clear(f[s][0] + x, f[s][1] + y);
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) p.clear(f.bottom[0] + x, f.bottom[1] + y);
    for (const s of ["front", "back", "left", "right"]) for (let x = 0; x < 8; x++) p.set(f[s][0] + x, f[s][1] + 2, gold, 255, 0.03);
    p.at("head", "front", 4, 0, gold, "over", 0), p.at("head", "front", 3, 1, [255, 230, 120], "over", 0);
    p.rect(f.top, deep);
  },
  farmer(p) {
    person(p, {
      skin: SKIN.tan, hair: [150, 100, 52], shirt: [178, 52, 48], sleeves: 8, pants: [70, 100, 156], shoes: [92, 62, 36],
      shoeRows: 3, eyes: [90, 130, 70],
    });
    // Plaid shirt.
    for (const part of ["body", "armR", "armL"]) {
      const f = p.faces(part);
      for (const r of Object.values(f))
        for (let y = 0; y < r[3]; y++) for (let x = 0; x < r[2]; x++) if ((x + r[0]) % 4 === 0 || (y + r[1]) % 4 === 0) p.set(r[0] + x, r[1] + y, [120, 30, 30]);
      if (part !== "body") for (let y = 8; y < 12; y++) for (const s of ["front", "back", "left", "right"]) for (let x = 0; x < f[s][2]; x++) p.set(f[s][0] + x, f[s][1] + y, SKIN.tan);
    }
    overalls(p, [70, 100, 156]);
    // A straw hat.
    const straw = [222, 192, 110];
    p.band("head", 0, 2, straw, "over");
    const f = p.faces("head", "over");
    for (let y = 2; y < 8; y++) for (const s of ["front", "back", "left", "right"]) for (let x = 0; x < 8; x++) p.clear(f[s][0] + x, f[s][1] + y);
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) p.clear(f.bottom[0] + x, f.bottom[1] + y);
    for (const s of ["front", "back", "left", "right"]) for (let x = 0; x < 8; x++) p.set(f[s][0] + x, f[s][1] + 1, [170, 60, 50], 255, 0.03);
  },
  robot(p) {
    const metal = [150, 158, 166], dark = [84, 90, 98], glow = [80, 230, 240];
    for (const part of Object.keys(PARTS)) p.fill(part, metal, "base", 0.1);
    // Eyes, a speaker grille and rivets.
    for (const x of [1, 2, 5, 6]) p.at("head", "front", x, 3, glow, "base", 0);
    for (let x = 2; x < 6; x++) p.at("head", "front", x, 5, dark), p.at("head", "front", x, 6, x % 2 ? dark : [60, 64, 70]);
    for (const [x, y] of [[0, 0], [7, 0], [0, 7], [7, 7]]) p.at("head", "front", x, y, [196, 200, 206], "base", 0);
    for (const s of ["left", "right"]) for (let y = 2; y < 6; y++) for (let x = 3; x < 5; x++) p.at("head", s, x, y, dark);
    // Chest panel with lights.
    for (let y = 2; y < 8; y++) for (let x = 1; x < 7; x++) p.at("body", "front", x, y, dark);
    const lights = [[255, 90, 80], [250, 210, 70], [90, 230, 120], glow];
    lights.forEach((c, i) => p.at("body", "front", 2 + i, 3, c, "base", 0));
    for (let x = 2; x < 6; x++) p.at("body", "front", x, 5, x % 2 ? glow : dark, "base", 0.1);
    // Joints.
    for (const arm of ["armR", "armL"]) p.band(arm, 4, 5, dark), p.band(arm, 10, 12, dark);
    for (const leg of ["legR", "legL"]) p.band(leg, 5, 6, dark), p.band(leg, 10, 12, [60, 64, 70]);
    p.band("body", 11, 12, dark);
    // An antenna light on the hat layer.
    const f = p.faces("head", "over");
    p.set(f.top[0] + 3, f.top[1] + 3, [255, 80, 70], 255, 0);
    p.set(f.top[0] + 4, f.top[1] + 3, [255, 80, 70], 255, 0);
  },
  ninja(p) {
    const cloth = [36, 36, 44], red = [190, 40, 46];
    person(p, { skin: SKIN.tan, hair: cloth, shirt: cloth, sleeves: 12, pants: cloth, shoes: [24, 24, 28], eyes: [40, 30, 26], noBrows: true });
    // A hood that shows only the eyes.
    p.fill("head", cloth);
    for (let x = 1; x < 7; x++) p.at("head", "front", x, 4, SKIN.tan);
    p.at("head", "front", 2, 4, [30, 24, 20], "base", 0), p.at("head", "front", 5, 4, [30, 24, 20], "base", 0);
    for (let x = 1; x < 7; x++) p.at("head", "front", x, 3, SKIN.tan);
    p.at("head", "front", 1, 3, cloth), p.at("head", "front", 6, 3, cloth);
    // A red headband tied at the back, and a sash.
    p.band("head", 2, 3, red, "over");
    const f = p.faces("head", "over");
    for (let y = 3; y < 7; y++) p.set(f.back[0] + 3 + (y & 1), f.back[1] + y, red);
    p.band("body", 8, 10, red);
    p.at("body", "front", 5, 10, red), p.at("body", "front", 5, 11, red);
    for (const arm of ["armR", "armL"]) p.band(arm, 9, 12, [24, 24, 28]);
  },
  scout(p) {
    person(p, {
      skin: SKIN.dark, hair: [30, 22, 20], fringe: 1, eyes: [60, 40, 30], shirt: [240, 236, 226], sleeves: 4,
      pants: [60, 84, 130], shoes: [236, 236, 236], mouth: [150, 70, 70],
    });
    // A bun on top, and an orange jacket worn open.
    const jacket = [226, 120, 40];
    p.fill("body", jacket, "over");
    const f = p.faces("body", "over");
    for (let y = 0; y < 12; y++) for (let x = 2; x < 6; x++) p.clear(f.front[0] + x, f.front[1] + y);
    for (let y = 0; y < 4; y++) for (let x = 0; x < 8; x++) p.clear(f.bottom[0] + x, f.bottom[1] + y);
    for (const arm of ["armR", "armL"]) p.band(arm, 0, 10, jacket, "over"), p.band(arm, 9, 10, [180, 90, 30], "over");
    for (const arm of ["armR", "armL"]) {
      const a = p.faces(arm, "over");
      for (let y = 0; y < a.bottom[3]; y++) for (let x = 0; x < a.bottom[2]; x++) p.clear(a.bottom[0] + x, a.bottom[1] + y);
    }
    const t = p.faces("head", "over").top;
    for (let y = 2; y < 6; y++) for (let x = 2; x < 6; x++) p.set(t[0] + x, t[1] + y, [40, 30, 26]);
  },
};

const presetCache = new Map();

// The painted canvas of a preset skin.
export function presetSkin(id) {
  if (!presetCache.has(id)) {
    const preset = PRESETS.find((s) => s.id === id) ?? PRESETS[0];
    const p = painter(id.length * 7919 + id.charCodeAt(0));
    p.slim = !!preset.slim;
    PAINTERS[preset.id](p);
    presetCache.set(id, p.done());
  }
  return presetCache.get(id);
}
