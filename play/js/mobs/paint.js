// A small pixel painter for mob textures: the canvas is laid out by the
// mob's own model (each part's box at its uv), so painting a part's face is
// painting the right pixels whatever the layout.
import { mulberry32 } from "../core/noise.js";
import { boxFaces } from "../core/box-uv.js";

// model: the mob's model data (texture size and parts). Colours are
// [r, g, b]; n is how much noise each pixel gets.
export function mobPainter(model, seed) {
  const [w, h] = model.texture;
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  const g = cv.getContext("2d");
  const img = g.createImageData(w, h);
  const rnd = mulberry32(seed);
  const parts = {};
  const collect = (all) => {
    for (const [name, part] of Object.entries(all)) {
      parts[name] = part;
      collect(part.children ?? {});
    }
  };
  collect(model.parts);
  const faces = (name) => {
    const part = parts[name];
    return boxFaces(...part.uv, ...part.size);
  };

  const p = {
    rnd,
    set(x, y, c, n = 0.05) {
      const i = (y * w + x) * 4;
      const k = 1 + (rnd() * 2 - 1) * n;
      img.data[i] = c[0] * k;
      img.data[i + 1] = c[1] * k;
      img.data[i + 2] = c[2] * k;
      img.data[i + 3] = 255;
    },
    // Every pixel of a part, coloured by fn(face, x, y, faceW, faceH) in
    // the face's own coordinates (0, 0 at its top left as drawn).
    part(name, fn, n) {
      for (const [face, [fx, fy, fw, fh]] of Object.entries(faces(name)))
        for (let y = 0; y < fh; y++) for (let x = 0; x < fw; x++) p.set(fx + x, fy + y, fn(face, x, y, fw, fh), n);
    },
    // One pixel of one face.
    at(name, face, x, y, c, n = 0.02) {
      const [fx, fy] = faces(name)[face];
      p.set(fx + x, fy + y, c, n);
    },
    done() {
      g.putImageData(img, 0, 0);
      return cv;
    },
  };
  return p;
}
