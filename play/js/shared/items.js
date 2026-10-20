// Item types: everything that can sit in an inventory slot. Blocks are items
// under their own block id; items that aren't blocks (food, and later tools)
// have ids from 256 up. Shared with the server, which checks stacks against
// it.
//
// Each: name, tile (its atlas tile, for icons and the flat 3D sprite),
// block (the block it places, if any), food (health eating one gives back).
import { DEF, T, PLACEABLE } from "../world/blocks.js";

export const STRAWBERRY = 256;

export const ITEMS = {};
for (const b of PLACEABLE) ITEMS[b] = { name: DEF[b].name, tile: DEF[b].tex[1], block: b };
ITEMS[STRAWBERRY] = { name: "Strawberry", tile: T.strawberry, food: 2 };

export const isItem = (id) => Number.isInteger(id) && Object.hasOwn(ITEMS, id);

// What the creative screen offers, in order.
export const CREATIVE_ITEMS = [...PLACEABLE, STRAWBERRY];
