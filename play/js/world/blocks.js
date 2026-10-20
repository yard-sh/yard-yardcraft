// Block types: what each one is, how it behaves and which atlas tiles it
// shows. Plain data, shared with the server (which checks edits against it);
// the textures themselves are painted in render/textures.js.

export const AIR = 0, GRASS = 1, DIRT = 2, STONE = 3, SAND = 4, LOG = 5, LEAVES = 6;
export const PLANKS = 7, BRICK = 8, GLASS = 9, LAMP = 10, WATER = 11;

// Tiles in the 4×4 texture atlas.
export const ATLAS_TILES = 4;
export const T = {
  grassTop: 0, grassSide: 1, dirt: 2, stone: 3, sand: 4, logSide: 5, logTop: 6,
  leaves: 7, planks: 8, brick: 9, glass: 10, lamp: 11, water: 12,
  strawberry: 13, // items that aren't blocks have tiles here too (shared/items.js)
};

// tex is [top, side, bottom]. opaque blocks hide their neighbours' faces and
// stop light; filter is extra light lost passing through; emit is block light;
// hard is how many seconds the break key must be held to break it; sound is
// the material it sounds like (audio/synth.js).
export const DEF = [];
DEF[AIR] = { name: "Air", opaque: false, solid: false, filter: 0, emit: 0 };
function def(id, name, tex, opts = {}) {
  DEF[id] = { name, tex, opaque: true, solid: true, filter: 0, emit: 0, hard: 0.5, ...opts };
}
def(GRASS, "Grass", [T.grassTop, T.grassSide, T.dirt], { hard: 0.45, sound: "grass" });
def(DIRT, "Dirt", [T.dirt, T.dirt, T.dirt], { hard: 0.375, sound: "gravel" });
def(STONE, "Stone", [T.stone, T.stone, T.stone], { hard: 1.25, sound: "stone" });
def(SAND, "Sand", [T.sand, T.sand, T.sand], { hard: 0.375, sound: "sand" });
def(LOG, "Log", [T.logTop, T.logSide, T.logTop], { hard: 1, sound: "wood" });
def(LEAVES, "Leaves", [T.leaves, T.leaves, T.leaves], { opaque: false, filter: 1, hard: 0.15, sound: "leaves" });
def(PLANKS, "Planks", [T.planks, T.planks, T.planks], { hard: 0.8, sound: "wood" });
def(BRICK, "Brick", [T.brick, T.brick, T.brick], { hard: 1.75, sound: "stone" });
def(GLASS, "Glass", [T.glass, T.glass, T.glass], { opaque: false, hard: 0.225, sound: "glass" });
def(LAMP, "Lamp", [T.lamp, T.lamp, T.lamp], { emit: 15, hard: 0.225, sound: "glass" });
def(WATER, "Water", [T.water, T.water, T.water], { opaque: false, solid: false, filter: 2, water: true });

// The blocks players can hold and place, in the creative screen's order.
// Water only comes from the terrain.
export const PLACEABLE = [GRASS, DIRT, STONE, SAND, LOG, LEAVES, PLANKS, BRICK, GLASS, LAMP];

// Whether a player may set a block to b: break it (air) or place one.
export const canSet = (b) => b === AIR || PLACEABLE.includes(b);

// UV of a point (uu, vv in 0..1, vv = 1 at the top) inside a tile, inset a
// hair so neighbouring tiles never bleed in.
const UV_INSET = 0.01;
export function tileUV(tile, uu, vv) {
  const u = (tile % ATLAS_TILES) + UV_INSET + uu * (1 - 2 * UV_INSET);
  const v = Math.floor(tile / ATLAS_TILES) + 1 - (UV_INSET + vv * (1 - 2 * UV_INSET));
  return [u / ATLAS_TILES, 1 - v / ATLAS_TILES];
}
