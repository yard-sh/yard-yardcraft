// Items in 3D, for the hand and the ground: blocks are little cubes, other
// items their 16×16 sprite pressed out one pixel thick, with an edge
// wherever the sprite does, as Minecraft draws them. One geometry per item,
// shared; never dispose them. Both use the atlas (with alphaTest).
import * as THREE from "three";
import { tileUV, ATLAS_TILES } from "../world/blocks.js";
import { ITEMS } from "../shared/items.js";
import { atlasCanvas } from "./renderer.js";
import { blockGeometry } from "./block-mesh.js";

const S = 16;
const geometries = new Map();

export const isFlatItem = (id) => ITEMS[id]?.block === undefined;

export function itemGeometry(id) {
  if (!isFlatItem(id)) return blockGeometry(ITEMS[id].block);
  if (!geometries.has(id)) geometries.set(id, spriteGeometry(ITEMS[id].tile));
  return geometries.get(id);
}

// A sprite one unit square (centred on the origin, facing +z), 1/16 thick.
function spriteGeometry(tile) {
  const ox = (tile % ATLAS_TILES) * S, oy = Math.floor(tile / ATLAS_TILES) * S;
  const alpha = atlasCanvas.getContext("2d").getImageData(ox, oy, S, S).data;
  const solid = (x, y) => x >= 0 && y >= 0 && x < S && y < S && alpha[(y * S + x) * 4 + 3] > 127;
  const pos = [], nor = [], uv = [], ind = [];
  const T = 0.5 / S; // half the thickness

  // A quad from four corners (counter-clockwise seen from the front) with
  // their UVs.
  const quad = (corners, n, uvs) => {
    const base = pos.length / 3;
    corners.forEach((c, i) => {
      pos.push(...c);
      nor.push(...n);
      uv.push(...uvs[i]);
    });
    ind.push(base, base + 1, base + 2, base, base + 2, base + 3);
  };
  const X = (px) => px / S - 0.5, Y = (py) => 0.5 - py / S;

  // The two faces show the whole tile; alphaTest cuts the shape out.
  const tl = tileUV(tile, 0, 1), tr = tileUV(tile, 1, 1), bl = tileUV(tile, 0, 0), br = tileUV(tile, 1, 0);
  quad([[-0.5, -0.5, T], [0.5, -0.5, T], [0.5, 0.5, T], [-0.5, 0.5, T]], [0, 0, 1], [bl, br, tr, tl]);
  quad([[0.5, -0.5, -T], [-0.5, -0.5, -T], [-0.5, 0.5, -T], [0.5, 0.5, -T]], [0, 0, -1], [br, bl, tl, tr]);

  // Edges: each solid pixel next to a clear one (or the tile's edge) gets a
  // thin side, coloured by that pixel.
  for (let y = 0; y < S; y++)
    for (let x = 0; x < S; x++) {
      if (!solid(x, y)) continue;
      const c = tileUV(tile, (x + 0.5) / S, 1 - (y + 0.5) / S);
      const uvs = [c, c, c, c];
      const x0 = X(x), x1 = X(x + 1), y0 = Y(y + 1), y1 = Y(y);
      if (!solid(x - 1, y)) quad([[x0, y0, -T], [x0, y0, T], [x0, y1, T], [x0, y1, -T]], [-1, 0, 0], uvs);
      if (!solid(x + 1, y)) quad([[x1, y0, T], [x1, y0, -T], [x1, y1, -T], [x1, y1, T]], [1, 0, 0], uvs);
      if (!solid(x, y - 1)) quad([[x0, y1, T], [x1, y1, T], [x1, y1, -T], [x0, y1, -T]], [0, 1, 0], uvs);
      if (!solid(x, y + 1)) quad([[x0, y0, -T], [x1, y0, -T], [x1, y0, T], [x0, y0, T]], [0, -1, 0], uvs);
    }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(ind);
  return geo;
}
