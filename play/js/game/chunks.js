// Connects the world's data to the screen and the server: shows each
// chunk's mesh, asks the room for the edits made on top of the terrain, and
// applies block changes, yours and everyone else's.
import * as THREE from "three";
import { CHUNK, CHUNKS_PER_REQUEST } from "../shared/rules.js";
import { AIR, DEF } from "../world/blocks.js";
import { World } from "../world/world.js";
import { settings, watchSetting } from "../core/settings.js";
import { playBlockSound } from "../audio/sounds.js";
import { scene, solidMat, waterMat } from "../render/renderer.js";
import { on, send, connected } from "../net.js";
import { game, player, blockAt } from "./state.js";
import { showItem, clearItems } from "../entities/items.js";

const meshes = new Map(); // Chunk -> [three.js meshes]

function makeMesh(data, material, casts, c) {
  if (!data.ind.length) return null;
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(data.pos, 3));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(data.nor, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(data.uv, 2));
  geo.setAttribute("aLight", new THREE.Float32BufferAttribute(data.light, 3));
  geo.setIndex(data.ind);
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.set(c.cx * CHUNK, 0, c.cz * CHUNK);
  mesh.castShadow = casts;
  mesh.receiveShadow = true;
  scene.add(mesh);
  return mesh;
}

function dropMeshes(c) {
  for (const m of meshes.get(c) ?? []) {
    scene.remove(m);
    m.geometry.dispose();
  }
  meshes.delete(c);
}

// What the world asks of us as it streams (world/world.js, update()).
const hooks = {
  mesh(c, data) {
    dropMeshes(c);
    meshes.set(c, [makeMesh(data.solid, solidMat, true, c), makeMesh(data.water, waterMat, false, c)].filter(Boolean));
  },
  unload: dropMeshes,
  request(list) {
    if (!connected()) return;
    for (let i = 0; i < list.length; i += CHUNKS_PER_REQUEST) {
      const batch = list.slice(i, i + CHUNKS_PER_REQUEST);
      send({ type: "chunks", list: batch.map((c) => [c.cx, c.cz]) });
      for (const c of batch) c.requested = true;
    }
  },
};

// Starts over with a fresh world: on every (re)connect and /restart.
export function newWorld(seed, gen) {
  for (const c of [...meshes.keys()]) dropMeshes(c);
  clearItems();
  game.world = new World(seed, gen, settings.distance);
}

watchSetting("distance", (r) => {
  if (game.world) game.world.loadR = r;
});

// Loads, lights and meshes chunks around the player for up to budgetMs.
export function streamChunks(budgetMs) {
  game.world.update(Math.floor(player.pos.x) >> 4, Math.floor(player.pos.z) >> 4, budgetMs, hooks);
}

// Changes a block: right away here, then the server tells everyone. slot
// is the hotbar slot a placed block came from.
export function edit(x, y, z, b, slot) {
  if (game.world?.setBlock(x, y, z, b)) send({ type: "set", x, y, z, b, slot });
}

on("chunkdata", (msg) => {
  if (!game.world || msg.gen !== game.world.gen) return;
  game.world.applyEdits(msg.cx, msg.cz, msg.edits);
  for (const item of msg.items ?? []) showItem(item);
});

on("set", (msg) => {
  if (!DEF[msg.b]) return;
  // Someone else's change (yours were applied already): play it. An undo
  // (the server refused your change) puts the block back quietly.
  const old = blockAt(msg.x, msg.y, msg.z);
  if (old >= 0 && old !== msg.b && !msg.undo) {
    const [use, b] = msg.b === AIR ? ["break", old] : ["place", msg.b];
    playBlockSound(DEF[b], use, msg.x + 0.5, msg.y + 0.5, msg.z + 0.5);
  }
  game.world?.setBlock(msg.x, msg.y, msg.z, msg.b);
});
