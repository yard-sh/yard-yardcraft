// Where each face of a textured box is in its texture, laid out the way
// Minecraft lays out every model (players and mobs alike): the top and
// bottom side by side above the four sides.

// The six face rectangles [x, y, w, h] of a w × h × d box whose texture
// starts at (u, v). right/left are the model's own right and left.
export function boxFaces(u, v, w, h, d) {
  return {
    top: [u + d, v, w, d],
    bottom: [u + d + w, v, w, d],
    right: [u, v + d, d, h],
    front: [u + d, v + d, w, h],
    left: [u + d + w, v + d, d, h],
    back: [u + d + w + d, v + d, w, h],
  };
}
