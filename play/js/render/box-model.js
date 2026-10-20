// Models made of textured boxes, the way Minecraft builds players and mobs:
// each part is a box whose faces come from a texture laid out as boxFaces()
// says, hanging from a pivot it turns about. The player model
// (skins/model.js) and every mob (mobs/) are built from these.
import * as THREE from "three";
import { boxFaces } from "../core/box-uv.js";

// How long something flashes red after being hurt, in milliseconds.
export const HURT_FLASH_MS = 500;

// The corners (top-left, top-right, bottom-left, bottom-right as drawn in the
// texture) of each face of a box centred on the origin. Models face -z, and
// their right side is +x.
const CORNERS = {
  front: { n: [0, 0, -1], c: [[1, 1, -1], [-1, 1, -1], [1, -1, -1], [-1, -1, -1]] },
  back: { n: [0, 0, 1], c: [[-1, 1, 1], [1, 1, 1], [-1, -1, 1], [1, -1, 1]] },
  right: { n: [1, 0, 0], c: [[1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1]] },
  left: { n: [-1, 0, 0], c: [[-1, 1, -1], [-1, 1, 1], [-1, -1, -1], [-1, -1, 1]] },
  top: { n: [0, 1, 0], c: [[1, 1, 1], [-1, 1, 1], [1, 1, -1], [-1, 1, -1]] },
  bottom: { n: [0, -1, 0], c: [[1, -1, -1], [-1, -1, -1], [1, -1, 1], [-1, -1, 1]] },
};

// A box w × h × d texture pixels (grown by inflate on every side), px blocks
// to the pixel, whose texture (tw × th pixels) starts at (u, v).
export function boxGeometry([w, h, d], [u, v], inflate, px, [tw, th]) {
  const hx = (w / 2 + inflate) * px, hy = (h / 2 + inflate) * px, hz = (d / 2 + inflate) * px;
  const rects = boxFaces(u, v, w, h, d);
  const pos = [], nor = [], uv = [], ind = [];
  for (const [face, { n, c }] of Object.entries(CORNERS)) {
    const [x, y, fw, fh] = rects[face];
    const uvs = [[x, y], [x + fw, y], [x, y + fh], [x + fw, y + fh]];
    const base = pos.length / 3;
    c.forEach(([sx, sy, sz], i) => {
      pos.push(sx * hx, sy * hy, sz * hz);
      nor.push(...n);
      uv.push(uvs[i][0] / tw, 1 - uvs[i][1] / th);
    });
    ind.push(base, base + 2, base + 1, base + 1, base + 2, base + 3);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(ind);
  return geo;
}

// How hurt something looks, as in Minecraft: red for a moment after a hit
// and while dead (red), and tipped over on its side once dead (tip, radians).
export function healthLook(now, { hurtAt = -1e9, dead = false, deadAt = 0 } = {}) {
  return {
    red: dead || now - hurtAt < HURT_FLASH_MS,
    tip: dead ? Math.min(1, (now - deadAt) / 400) * (Math.PI / 2) : 0,
  };
}

const rad = (deg) => (deg * Math.PI) / 180;

// A model from data: def is { texture: [w, h], px (blocks per pixel, 1/16
// by default), parts }, each part { pivot: [x, y, z] (pixels from its
// parent's pivot; from the feet for top-level parts), size, uv (its box,
// if it has one), at (the box's centre from the pivot), rotate ([x, y, z]
// degrees), children }. Returns the root (feet at the origin), each part's
// pivot group by name, and the material.
export function buildBoxModel(def, texture) {
  const px = def.px ?? 1 / 16;
  const mat = new THREE.MeshLambertMaterial({ map: texture, alphaTest: 0.5 });
  const root = new THREE.Group();
  const parts = {};
  const add = (parent, name, part) => {
    const g = new THREE.Group();
    g.rotation.order = "YXZ";
    g.position.fromArray(part.pivot ?? [0, 0, 0]).multiplyScalar(px);
    if (part.rotate) g.rotation.set(...part.rotate.map(rad));
    if (part.size) {
      const mesh = new THREE.Mesh(boxGeometry(part.size, part.uv, part.inflate ?? 0, px, def.texture), mat);
      mesh.position.fromArray(part.at ?? [0, 0, 0]).multiplyScalar(px);
      mesh.castShadow = mesh.receiveShadow = true;
      g.add(mesh);
    }
    for (const [child, c] of Object.entries(part.children ?? {})) add(g, child, c);
    parent.add(g);
    parts[name] = g;
  };
  for (const [name, part] of Object.entries(def.parts)) add(root, name, part);
  return {
    root,
    parts,
    mat,
    dispose() {
      root.traverse((n) => n.geometry?.dispose());
      mat.dispose();
    },
  };
}
