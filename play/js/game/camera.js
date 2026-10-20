// Places the camera for the current view: at the eyes, behind the player or
// in front looking back, pulled in so it never ends up inside a block.
import * as THREE from "three";
import { DEF } from "../world/blocks.js";
import { settings } from "../core/settings.js";
import { camera } from "../render/renderer.js";
import { player, health, eyePos, blockAt } from "./state.js";
import { lookDir } from "./player.js";

export const VIEW_NAMES = ["First person", "Third person (back)", "Third person (front)"];
const SPRINT_FOV = 1.13; // the view widens by this much while sprinting

const away = new THREE.Vector3();

export function placeCamera(dt) {
  // Hurt, the view rolls a little; dead, it lies on its side.
  const roll = health.roll + (health.dead ? 0.5 : 0);
  health.roll *= Math.exp(-dt * 8);
  camera.rotation.set(player.pitch, player.yaw, roll);
  camera.position.copy(eyePos);

  const fov = settings.fov * (player.sprinting ? SPRINT_FOV : 1);
  if (Math.abs(camera.fov - fov) > 0.05) {
    camera.fov += (fov - camera.fov) * Math.min(1, dt * 8);
    camera.updateProjectionMatrix();
  }

  if (settings.view === 0) return;
  lookDir(away).multiplyScalar(settings.view === 1 ? -1 : 1);
  let dist = 4;
  for (let t = 0.1; t <= 4; t += 0.1) {
    const x = eyePos.x + away.x * t, y = eyePos.y + away.y * t, z = eyePos.z + away.z * t;
    const b = blockAt(Math.floor(x), Math.floor(y), Math.floor(z));
    if (b > 0 && DEF[b].opaque) {
      dist = Math.max(0.3, t - 0.25);
      break;
    }
  }
  camera.position.addScaledVector(away, dist);
  if (settings.view === 2) camera.rotation.set(-player.pitch, player.yaw + Math.PI, roll);
}
