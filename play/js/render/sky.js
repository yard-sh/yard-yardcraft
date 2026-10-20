// The day: the shared clock, the sun (with shadows) and moon, stars, clouds,
// sky and fog colours, and how bright things are where they stand.
import * as THREE from "three";
import { SY, dayPhaseAt } from "../shared/rules.js";
import { WATER } from "../world/blocks.js";
import { viewBlocks } from "../world/world.js";
import { mulberry32 } from "../core/noise.js";
import { settings, watchSetting, SHADOW_SIZES } from "../core/settings.js";
import { on } from "../net.js";
import { game, player, blockAt } from "../game/state.js";
import { renderer, scene, camera, lightUniforms } from "./renderer.js";
import { paintClouds, pixelTexture, discTexture } from "./textures.js";

// ---------------------------------------------------------------- clock

// The server keeps the clock (and /time moves it), so every player sees the
// same sky.
let clockSkew = 0, timeOffset = 0;
const worldNow = () => Date.now() + clockSkew + timeOffset;

export function syncClock(msg) {
  clockSkew = msg.now - Date.now();
  timeOffset = msg.timeOffset;
}
on("time", syncClock);

export let isDay = true;
export let daylight = 1; // 0 at night, 1 by day
export let dayPhase = 0; // 0..1 through the day; 0 is sunrise

// ---------------------------------------------------------------- lights

// The sun: real-time direct light with shadow maps, moved by the day cycle
// and kept centred on the player.
const SHADOW_R = 80;
const sun = new THREE.DirectionalLight(0xffffff, Math.PI * 0.5);
sun.castShadow = settings.shadows;
// The shadow map size is an option; the largest sizes only where the GPU
// can make textures that big.
export const shadowSizes = SHADOW_SIZES.filter((n) => n <= renderer.capabilities.maxTextureSize);
function setShadowRes(n) {
  n = shadowSizes.includes(n) ? n : shadowSizes[shadowSizes.length - 1];
  sun.shadow.mapSize.set(n, n);
  sun.shadow.map?.dispose(); // made again at the new size on the next frame
  sun.shadow.map = null;
}
setShadowRes(settings.shadowRes);
watchSetting("shadowRes", setShadowRes);
Object.assign(sun.shadow.camera, { left: -SHADOW_R, right: SHADOW_R, top: SHADOW_R, bottom: -SHADOW_R, near: 1, far: 450 });
sun.shadow.camera.updateProjectionMatrix();
sun.shadow.bias = -0.0006;
sun.shadow.normalBias = 0.03;
scene.add(sun, sun.target);
watchSetting("shadows", (on) => (sun.castShadow = on));

// Ambient light only reaches the avatars; terrain uses its own voxel light.
const ambient = new THREE.AmbientLight(0xffffff, Math.PI * 0.5);
scene.add(ambient);

// ---------------------------------------------------------------- sky

const DAY_SKY = new THREE.Color(0x8ec9ff), NIGHT_SKY = new THREE.Color(0x070b1c), DUSK_SKY = new THREE.Color(0xf29a62);
const DAY_AMB = new THREE.Color(0.5, 0.54, 0.62), NIGHT_AMB = new THREE.Color(0.35, 0.42, 0.7), DUSK_AMB = new THREE.Color(0.9, 0.62, 0.45);
const WATER_FOG = new THREE.Color(0x1d4f8f);
const skyColor = new THREE.Color();

// The sun, moon and stars sit just inside the camera's far plane, beyond the
// farthest terrain at the longest render distance.
const SKY_DIST = 400;
const sunSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: discTexture("#fffbe0", "#ffe27a"), fog: false, depthWrite: false }));
sunSprite.scale.setScalar(58);
const moonSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: discTexture("#f4f6ff", "#c9cfe0"), fog: false, depthWrite: false }));
moonSprite.scale.setScalar(42);
scene.add(sunSprite, moonSprite);

const starPos = [];
const starRnd = mulberry32(7);
for (let i = 0; i < 700; i++) {
  const v = new THREE.Vector3(starRnd() * 2 - 1, starRnd() * 2 - 1, starRnd() * 2 - 1).normalize().multiplyScalar(SKY_DIST);
  starPos.push(v.x, v.y, v.z);
}
const starGeo = new THREE.BufferGeometry();
starGeo.setAttribute("position", new THREE.Float32BufferAttribute(starPos, 3));
const stars = new THREE.Points(
  starGeo,
  new THREE.PointsMaterial({ color: 0xffffff, size: 2, sizeAttenuation: false, transparent: true, fog: false, depthWrite: false }),
);
scene.add(stars);

// The cloud texture repeats every 256 blocks, so the plane follows the
// player in 256-block steps without the pattern jumping.
const CLOUD_PERIOD = 256;
const cloudTex = pixelTexture(paintClouds());
cloudTex.wrapS = cloudTex.wrapT = THREE.RepeatWrapping;
cloudTex.repeat.set(2, 2);
const clouds = new THREE.Mesh(
  new THREE.PlaneGeometry(CLOUD_PERIOD * 2, CLOUD_PERIOD * 2),
  new THREE.MeshBasicMaterial({ map: cloudTex, transparent: true, opacity: 0.85, depthWrite: false, side: THREE.DoubleSide }),
);
clouds.rotation.x = -Math.PI / 2;
scene.add(clouds);

const sunDir = new THREE.Vector3();
const shadowCenter = new THREE.Vector3();

// Moves everything in the sky to the current time; call after placing the
// camera.
export function updateSky(dt) {
  const t = dayPhaseAt(worldNow()); // 0 is sunrise
  const a = t * Math.PI * 2;
  const h = Math.sin(a);
  const day = THREE.MathUtils.smoothstep(h, -0.15, 0.2);
  const dusk = Math.max(0, 1 - Math.abs(h) / 0.35);
  isDay = day > 0.5;
  daylight = day;
  dayPhase = t;

  // Snapped so the shadow map doesn't shimmer as the player moves.
  const p = player.pos;
  shadowCenter.set(Math.round(p.x / 4) * 4, Math.round(p.y / 4) * 4, Math.round(p.z / 4) * 4);
  sunDir.set(Math.cos(a), h, 0.35).normalize();
  sun.position.copy(shadowCenter).addScaledVector(sunDir, 200);
  sun.target.position.copy(shadowCenter);
  sun.intensity = Math.PI * 0.8 * THREE.MathUtils.smoothstep(h, -0.02, 0.25);
  sun.color.setRGB(1, 0.8 + 0.2 * day, 0.62 + 0.38 * day);
  ambient.intensity = Math.PI * (0.18 + 0.5 * day);

  skyColor.copy(NIGHT_SKY).lerp(DAY_SKY, day).lerp(DUSK_SKY, dusk * 0.7);
  lightUniforms.uDaylight.value = 0.16 + 0.84 * day;
  lightUniforms.uSkyTint.value.copy(NIGHT_AMB).lerp(DAY_AMB, day).lerp(DUSK_AMB, dusk * 0.45);

  // Under water, a short blue fog; otherwise fog hides the edge of the
  // loaded world.
  const eye = camera.position;
  const underwater = blockAt(Math.floor(eye.x), Math.floor(eye.y), Math.floor(eye.z)) === WATER;
  scene.background.copy(underwater ? WATER_FOG : skyColor);
  scene.fog.color.copy(underwater ? WATER_FOG : skyColor);
  const view = viewBlocks(settings.distance);
  scene.fog.near = underwater ? 0 : view * 0.5;
  scene.fog.far = underwater ? 16 : view - 4;

  sunSprite.position.copy(eye).addScaledVector(sunDir, SKY_DIST);
  moonSprite.position.copy(eye).addScaledVector(sunDir, -SKY_DIST);
  sunSprite.visible = h > -0.12;
  moonSprite.visible = h < 0.12;
  stars.position.copy(eye);
  stars.rotation.z = a;
  stars.material.opacity = 1 - day;
  clouds.position.set(Math.round(p.x / CLOUD_PERIOD) * CLOUD_PERIOD, SY + 14, Math.round(p.z / CLOUD_PERIOD) * CLOUD_PERIOD);
  clouds.material.color.setScalar(0.25 + 0.75 * day);
  cloudTex.offset.x = (cloudTex.offset.x + dt * 0.004) % 1;
}

// ---------------------------------------------------------------- brightness

// Sky and block light where a point is; full daylight until it's known.
const lightAt = (x, y, z) => (game.world ? game.world.getLight(Math.floor(x), Math.floor(y), Math.floor(z)) : [15, 0]);

// How bright a player model should be where it stands: Minecraft's light
// curve over the light there, so players darken in caves and glow by lamps.
export function modelLight(x, y, z) {
  const [sky, blk] = lightAt(x, y, z);
  return Math.max(Math.pow(0.8, 15 - sky), (Math.pow(0.8, 15 - blk) * 0.68) / (0.18 + 0.5 * daylight), 0.1);
}

// The same for the first-person hand, which is lit in its own scene.
export function handLight(x, y, z) {
  const [sky, blk] = lightAt(x, y, z);
  return Math.max(Math.pow(0.8, 15 - sky) * (0.25 + 0.75 * daylight), Math.pow(0.8, 15 - blk), 0.08);
}
