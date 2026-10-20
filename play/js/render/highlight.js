// The outline around the block you're looking at, and the cracks on the
// block you're breaking.
import * as THREE from "three";
import { scene } from "./renderer.js";
import { paintCracks, pixelTexture, CRACK_STAGES } from "./textures.js";

const box = new THREE.BoxGeometry(1.004, 1.004, 1.004);

const outline = new THREE.LineSegments(
  new THREE.EdgesGeometry(box),
  new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.6 }),
);
outline.visible = false;
scene.add(outline);

// A box a hair larger than the block, showing one of ten crack stages.
const crackTextures = paintCracks().map(pixelTexture);
const crack = new THREE.Mesh(
  box,
  new THREE.MeshBasicMaterial({
    map: crackTextures[0],
    transparent: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -4,
  }),
);
crack.visible = false;
scene.add(crack);

// Outlines the block at [x, y, z], or nothing when null.
export function showOutline(block) {
  outline.visible = !!block;
  if (block) outline.position.set(block[0] + 0.5, block[1] + 0.5, block[2] + 0.5);
}

// Cracks the block at [x, y, z] by progress (0..1), or hides the cracks.
export function showCracks(block, progress = 0) {
  crack.visible = !!block;
  if (!block) return;
  crack.position.set(block[0] + 0.5, block[1] + 0.5, block[2] + 0.5);
  crack.material.map = crackTextures[Math.min(CRACK_STAGES - 1, Math.floor(progress * CRACK_STAGES))];
}
