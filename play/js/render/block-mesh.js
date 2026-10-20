// A unit cube textured as a block, for blocks held in the hand and lying on
// the ground. One geometry per block type, shared; never dispose them.
import * as THREE from "three";
import { DEF, tileUV } from "../world/blocks.js";

const geometries = new Map();
const boxUV = new THREE.BoxGeometry(1, 1, 1).attributes.uv;

export function blockGeometry(b) {
  let geo = geometries.get(b);
  if (geo) return geo;
  geo = new THREE.BoxGeometry(1, 1, 1);
  const [top, side, bottom] = DEF[b].tex;
  const tiles = [side, side, top, bottom, side, side]; // three.js face order: +x -x +y -y +z -z
  const uv = geo.attributes.uv;
  for (let i = 0; i < 24; i++) uv.setXY(i, ...tileUV(tiles[i >> 2], boxUV.getX(i), boxUV.getY(i)));
  geometries.set(b, geo);
  return geo;
}
