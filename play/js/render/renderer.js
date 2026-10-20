// The three.js renderer, the world scene and camera, the first-person hand's
// own scene, and the terrain materials.
import * as THREE from "three";
import { COARSE, settings, watchSetting } from "../core/settings.js";
import { viewBlocks } from "../world/world.js";
import { $ } from "../core/dom.js";
import { paintAtlas, pixelTexture } from "./textures.js";

export const canvas = $("view");
export const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, COARSE ? 1.5 : 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.info.autoReset = false; // counted over both passes, for the debug screen

export const scene = new THREE.Scene();
scene.background = new THREE.Color(0x8ec9ff);
scene.fog = new THREE.Fog(0x8ec9ff, viewBlocks(settings.distance) * 0.5, viewBlocks(settings.distance) - 4);
export const camera = new THREE.PerspectiveCamera(settings.fov, 1, 0.05, 450);
camera.rotation.order = "YXZ";
watchSetting("fov", (fov) => {
  camera.fov = fov;
  camera.updateProjectionMatrix();
});

// The first-person hand is drawn last, in its own scene, so it never sinks
// into walls.
export const handScene = new THREE.Scene();
const handCamera = new THREE.PerspectiveCamera(70, 1, 0.01, 10);
const handSun = new THREE.DirectionalLight(0xffffff, Math.PI * 0.55);
handSun.position.set(-0.4, 1, 0.6);
handScene.add(handSun, new THREE.AmbientLight(0xffffff, Math.PI * 0.55));

function resize() {
  renderer.setSize(innerWidth, innerHeight, false);
  camera.aspect = handCamera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  handCamera.updateProjectionMatrix();
}
addEventListener("resize", resize);
resize();

export function render(withHand) {
  renderer.info.reset();
  renderer.render(scene, camera);
  if (!withHand) return;
  renderer.autoClear = false;
  renderer.clearDepth();
  renderer.render(handScene, handCamera);
  renderer.autoClear = true;
}

// ---------------------------------------------------------------- terrain

export const atlasCanvas = paintAtlas();
export const atlas = pixelTexture(atlasCanvas);

// Shared by the terrain materials: day/night strength and colours, set by
// the sky every frame.
export const lightUniforms = {
  uDaylight: { value: 1 },
  uSkyTint: { value: new THREE.Color(0.5, 0.54, 0.62) },
  uTorch: { value: new THREE.Color(1.0, 0.82, 0.58) },
};

// Lambert gives the sun and its shadows; the patch swaps its ambient term for
// the voxel light (sky and block light, corner shading) carried per vertex.
function voxelLit(material) {
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, lightUniforms);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nattribute vec3 aLight;\nvarying vec3 vLight;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvLight = aLight;");
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        "#include <common>\nvarying vec3 vLight;\nuniform float uDaylight;\nuniform vec3 uSkyTint;\nuniform vec3 uTorch;",
      )
      .replace(
        "#include <lights_fragment_end>",
        `#include <lights_fragment_end>
        float skyB = pow(0.8, (1.0 - vLight.x) * 15.0);
        float blkB = pow(0.8, (1.0 - vLight.y) * 15.0);
        vec3 amb = max(uSkyTint * skyB * uDaylight, uTorch * blkB);
        amb = max(amb, vec3(0.035));
        reflectedLight.indirectDiffuse = diffuseColor.rgb * amb * vLight.z;
        reflectedLight.directDiffuse *= smoothstep(0.7, 1.0, vLight.x) * mix(1.0, vLight.z, 0.5);`,
      );
  };
  return material;
}

export const solidMat = voxelLit(new THREE.MeshLambertMaterial({ map: atlas, alphaTest: 0.5 }));
// Blocks cast shadows from their sun-facing faces. three.js uses back faces
// by default, which leaves a lit strip along the bottom edge of a block's
// shadow side (the back face meets the ground right there, at the same depth).
solidMat.shadowSide = THREE.FrontSide;
export const waterMat = voxelLit(
  new THREE.MeshLambertMaterial({ map: atlas, transparent: true, depthWrite: false, side: THREE.DoubleSide }),
);
