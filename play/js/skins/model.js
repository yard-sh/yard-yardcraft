// The player model: Minecraft's boxes, proportions and texture mapping, so a
// skin made for Minecraft looks the same here. Each body part is a base box
// plus an overlay box a little larger (hat, jacket, sleeves, trousers).
import * as THREE from "three";
import { PARTS, partSize, SKIN_SIZE } from "./format.js";
import { boxGeometry, healthLook } from "../render/box-model.js";

// One skin pixel in blocks; Minecraft draws the player at 15/16 scale, so the
// model stands 1.875 blocks tall.
export const PX = 0.9375 / 16;

// Base and overlay meshes of one part, offset from its pivot by (x, y, z)
// skin pixels.
function partMeshes(part, slim, mats, [x, y, z]) {
  const size = partSize(part, slim);
  const def = PARTS[part];
  const tex = [SKIN_SIZE, SKIN_SIZE];
  const base = new THREE.Mesh(boxGeometry(size, def.base, 0, PX, tex), mats.base);
  const over = new THREE.Mesh(boxGeometry(size, def.over, def.inflate, PX, tex), mats.over);
  for (const m of [base, over]) {
    m.position.set(x * PX, y * PX, z * PX);
    m.castShadow = true;
  }
  base.receiveShadow = true;
  return [base, over];
}

function materials(texture) {
  return {
    base: new THREE.MeshLambertMaterial({ map: texture }),
    // The overlay is see-through wherever the skin leaves it empty.
    over: new THREE.MeshLambertMaterial({ map: texture, alphaTest: 0.5, side: THREE.DoubleSide }),
  };
}

const pivot = (x, y, z) => {
  const g = new THREE.Group();
  g.position.set(x * PX, y * PX, z * PX);
  return g;
};

// The whole player, feet at the origin. Returns the parts and an animate()
// that poses them each frame.
export function createPlayerModel(texture, slim) {
  const mats = materials(texture);
  const root = new THREE.Group();
  // The torso pivots at the hips so sneaking can lean it forward.
  const torso = pivot(0, 12, 0);
  const head = pivot(0, 12, 0);
  head.rotation.order = "YXZ";
  head.add(...partMeshes("head", slim, mats, [0, 4, 0]));
  torso.add(...partMeshes("body", slim, mats, [0, 6, 0]));
  // Arms hang from the shoulders, two pixels below their tops.
  const armOff = slim ? 0.5 : 1;
  const armR = pivot(5, 10, 0), armL = pivot(-5, 10, 0);
  armR.add(...partMeshes("armR", slim, mats, [armOff, -4, 0]));
  armL.add(...partMeshes("armL", slim, mats, [-armOff, -4, 0]));
  torso.add(head, armR, armL);
  // Legs hang from the hips.
  const legR = pivot(1.9, 12, 0), legL = pivot(-1.9, 12, 0);
  legR.add(...partMeshes("legR", slim, mats, [0, -6, 0]));
  legL.add(...partMeshes("legL", slim, mats, [0, -6, 0]));
  const body = new THREE.Group(); // turns with the body; the root carries position
  body.add(torso, legR, legL);
  root.add(body);

  const state = { walk: 0, swing: 1, bodyYaw: 0, time: Math.random() * 100, lean: 0, drop: 0 };

  return {
    root,
    head,
    mats,
    // yaw/pitch: where the head looks; speed: blocks per second over the
    // ground; swinging: whether the arm is swinging (breaking blocks).
    animate(dt, { yaw, pitch, speed, sneaking, swinging }) {
      state.time += dt;
      // The body follows the head when moving, and lags up to 50° otherwise.
      let diff = Math.atan2(Math.sin(yaw - state.bodyYaw), Math.cos(yaw - state.bodyYaw));
      if (speed > 0.3) state.bodyYaw += diff * Math.min(1, dt * 10);
      else if (Math.abs(diff) > 0.87) state.bodyYaw += diff - Math.sign(diff) * 0.87;
      diff = Math.atan2(Math.sin(yaw - state.bodyYaw), Math.cos(yaw - state.bodyYaw));
      body.rotation.y = state.bodyYaw;

      // Limbs swing with distance travelled, harder the faster you go.
      const amount = Math.min(1, speed / 4.3);
      state.walk += speed * dt * 2.1;
      const swingL = Math.sin(state.walk) * 0.95 * amount;
      legR.rotation.x = swingL;
      legL.rotation.x = -swingL;
      // Sneaking leans the torso forward and lowers the model a little.
      state.lean += ((sneaking ? -0.45 : 0) - state.lean) * Math.min(1, dt * 15);
      state.drop += ((sneaking ? 0.18 : 0) - state.drop) * Math.min(1, dt * 15);
      torso.rotation.x = state.lean;
      body.position.y = -state.drop;
      legR.position.z = legL.position.z = -state.lean * 0.3;

      const idle = Math.sin(state.time * 1.1) * 0.05;
      armR.rotation.set(-swingL * 0.85 - state.lean * 0.9, 0, 0.05 + idle);
      armL.rotation.set(swingL * 0.85 - state.lean * 0.9, 0, -0.05 - idle);
      // Breaking: the right arm chops forward again and again.
      if (swinging && state.swing >= 1) state.swing = 0;
      if (state.swing < 1) {
        state.swing = Math.min(1, state.swing + dt / 0.3);
        const s = Math.sin(state.swing * Math.PI);
        armR.rotation.x += s * 1.3 + 0.2 * Math.sin(state.swing * Math.PI * 2);
        armR.rotation.z -= s * 0.35;
        body.rotation.y += Math.sin(Math.sqrt(state.swing) * Math.PI * 2) * 0.12;
      }

      head.rotation.y = diff;
      head.rotation.x = pitch - state.lean;
    },
    // Starts one swing of the arm (placing a block).
    swing() {
      state.swing = 0;
    },
    // Lights the model (k is how bright it is where it stands, for caves and
    // night) and shows its health as Minecraft does: red for a moment after
    // a hit and while dead, and tipped over once dead.
    shade(k, now, health) {
      const { red, tip } = healthLook(now, health);
      const gb = red ? k * 0.4 : k;
      mats.base.color.setRGB(k, gb, gb);
      mats.over.color.setRGB(k, gb, gb);
      root.rotation.z = -tip;
    },
    dispose() {
      root.traverse((n) => n.geometry?.dispose());
      mats.base.dispose();
      mats.over.dispose();
    },
  };
}

// Just the right arm, for the first-person view; the pivot is the shoulder.
export function createArm(texture, slim) {
  const mats = materials(texture);
  const arm = new THREE.Group();
  arm.add(...partMeshes("armR", slim, mats, [slim ? 0.5 : 1, -4, 0]));
  arm.traverse((n) => (n.castShadow = false));
  return { arm, mats };
}
