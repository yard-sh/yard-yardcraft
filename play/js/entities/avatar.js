// You, as seen: your model in the third-person views, and in first person
// your arm and what you hold, drawn in their own scene.
import * as THREE from "three";
import { createPlayerModel, createArm } from "../skins/model.js";
import { skinEntry } from "../skins/cache.js";
import { settings } from "../core/settings.js";
import { scene, handScene, atlas } from "../render/renderer.js";
import { itemGeometry, isFlatItem } from "../render/item-mesh.js";
import { modelLight, handLight } from "../render/sky.js";
import { send } from "../net.js";
import { game, player, health } from "../game/state.js";

let model = null; // the whole player, for third person
let arm = null; // { arm, mats }, for first person
let speed = 0; // smoothed, for the walk animation

// The arm and held item swing as one.
const hold = new THREE.Group();
handScene.add(hold);
const heldItem = new THREE.Mesh(undefined, new THREE.MeshLambertMaterial({ map: atlas, alphaTest: 0.5 }));
heldItem.visible = false;
hold.add(heldItem);
const hand = { swing: 1, bob: 0, eat: 0 };

// Whether the first-person hand is showing (it's drawn in a second pass).
export const handVisible = () => hold.visible && !!game.self;

// (Re)builds your model and arm from your skin.
export function buildSelf() {
  if (model) {
    scene.remove(model.root);
    model.dispose();
  }
  if (arm) {
    hold.remove(arm.arm);
    arm.arm.traverse((n) => n.geometry?.dispose());
    arm.mats.base.dispose();
    arm.mats.over.dispose();
  }
  const skin = skinEntry(game.self.skin);
  const slim = game.self.model === "slim";
  model = createPlayerModel(skin.texture, slim);
  scene.add(model.root);
  arm = createArm(skin.texture, slim);
  // The shoulder is off-screen to the bottom right; the arm reaches forward
  // and up, the held block resting on the hand.
  arm.arm.position.set(0.62, -0.68, -0.42);
  arm.arm.rotation.order = "YXZ";
  arm.arm.rotation.set(1.75, 0.35, 0);
  hold.add(arm.arm);
}

// Shows item id in your hand, or an empty hand (null). A block rests on
// the hand; a flat item is held up, tilted, as in Minecraft.
export function setHeldItem(id) {
  heldItem.visible = id !== null;
  if (id === null) return;
  heldItem.geometry = itemGeometry(id);
  if (isFlatItem(id)) {
    heldItem.scale.setScalar(0.42);
    heldItem.position.set(0.44, -0.36, -0.95);
    heldItem.rotation.set(0, -1.2, 0.35);
  } else {
    heldItem.scale.setScalar(0.24);
    heldItem.position.set(0.4, -0.43, -1.08);
    heldItem.rotation.set(0.1, Math.PI / 4 + 0.3, 0);
  }
}

// One swing of the arm (placing, punching); others see it too.
export function swingHand() {
  hand.swing = 0;
  model?.swing();
  send({ type: "swing" });
}

// breaking: whether you're breaking a block (the arm keeps chopping);
// eating: whether you're eating (the hand comes up to your mouth and bobs).
export function animateSelf(dt, now, breaking, eating) {
  if (!model) return;
  const p = player.pos;
  const target = Math.hypot(player.vel.x, player.vel.z) * (player.onGround || player.flying ? 1 : 0.4);
  speed += (target - speed) * Math.min(1, dt * 10);
  model.root.position.copy(p);
  model.root.visible = settings.view !== 0;
  model.animate(dt, { yaw: player.yaw, pitch: player.pitch, speed, sneaking: player.sneaking, swinging: breaking });
  model.shade(modelLight(p.x, p.y + 1, p.z), now, health);

  // First person: the arm bobs as you walk and chops while breaking.
  hold.visible = settings.view === 0 && settings.hand && !health.dead;
  if (!hold.visible) return;
  if (breaking && hand.swing >= 1) hand.swing = 0;
  hand.swing = Math.min(1, hand.swing + dt / 0.3);
  hand.bob += speed * dt * 2.1;
  const s = hand.swing < 1 ? Math.sin(hand.swing * Math.PI) : 0;
  const s2 = hand.swing < 1 ? Math.sin(Math.sqrt(hand.swing) * Math.PI) : 0;
  const amt = Math.min(1, speed / 4.3);
  hold.position.set(
    Math.sin(hand.bob) * 0.025 * amt - s2 * 0.12,
    -Math.abs(Math.cos(hand.bob)) * 0.03 * amt + s2 * 0.08 - s * 0.12,
    -s * 0.12,
  );
  hold.rotation.set(-s * 0.5, s2 * 0.35, s * 0.15);
  hand.eat += ((eating ? 1 : 0) - hand.eat) * Math.min(1, dt * 12);
  if (hand.eat > 0.01) {
    const chew = eating ? Math.abs(Math.sin(now / 70)) * 0.04 : 0;
    hold.position.x -= hand.eat * 0.38;
    hold.position.y += hand.eat * 0.12 - chew;
    hold.rotation.y += hand.eat * 0.5;
  }
  const k = handLight(p.x, p.y + 1, p.z);
  arm.mats.base.color.setScalar(k);
  arm.mats.over.color.setScalar(k);
  heldItem.material.color.setScalar(k);
}
