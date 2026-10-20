// Touch gestures: a floating joystick on the left of the screen for moving,
// dragging anywhere else to look, and on-screen buttons for everything the
// keyboard and mouse do. Every touch is tracked by its own pointer id, so
// moving, looking and pressing buttons all work at once.
//
// actions.look(dx, dy) turns the view by screen pixels; actions.move(x, z)
// sets the walk direction (-1..1, z < 0 is forward); actions.down(name) and
// actions.up(name) press and release a button (its data-t name).

const STICK_R = 52; // pixels the knob travels from the centre

// Keeps a touch's events coming to el even when the finger slides off it.
// Capturing can throw (the pointer already ended); the control works anyway.
function capture(el, id) {
  try {
    el.setPointerCapture(id);
  } catch {}
}

export function setupTouch(root, canvas, actions) {
  const zone = root.querySelector("#stick-zone");
  const stick = root.querySelector("#stick");
  const knob = root.querySelector("#knob");
  let stickId = null, cx = 0, cy = 0;
  const lookIds = new Map(); // pointer id -> last [x, y]
  const held = new Map(); // pointer id -> button

  // The joystick appears where the thumb lands in the zone.
  zone.addEventListener("pointerdown", (e) => {
    if (stickId !== null) return;
    e.preventDefault();
    stickId = e.pointerId;
    capture(zone, e.pointerId);
    const r = zone.getBoundingClientRect();
    cx = e.clientX;
    cy = e.clientY;
    stick.style.left = `${cx - r.left}px`;
    stick.style.top = `${cy - r.top}px`;
    stick.classList.add("on");
    moveKnob(0, 0);
  });
  zone.addEventListener("pointermove", (e) => {
    if (e.pointerId !== stickId) return;
    let dx = e.clientX - cx, dy = e.clientY - cy;
    const len = Math.hypot(dx, dy);
    if (len > STICK_R) (dx *= STICK_R / len), (dy *= STICK_R / len);
    moveKnob(dx, dy);
    actions.move(dx / STICK_R, dy / STICK_R);
  });
  const endStick = (e) => {
    if (e.pointerId !== stickId) return;
    stickId = null;
    stick.classList.remove("on");
    actions.move(0, 0);
  };
  zone.addEventListener("pointerup", endStick);
  zone.addEventListener("pointercancel", endStick);
  function moveKnob(dx, dy) {
    knob.style.transform = `translate(${dx}px, ${dy}px)`;
  }

  // Dragging on the game view looks around.
  canvas.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse" || root.hidden) return;
    capture(canvas, e.pointerId);
    lookIds.set(e.pointerId, [e.clientX, e.clientY]);
  });
  canvas.addEventListener("pointermove", (e) => {
    const last = lookIds.get(e.pointerId);
    if (!last) return;
    actions.look(e.clientX - last[0], e.clientY - last[1]);
    lookIds.set(e.pointerId, [e.clientX, e.clientY]);
  });
  const endLook = (e) => lookIds.delete(e.pointerId);
  canvas.addEventListener("pointerup", endLook);
  canvas.addEventListener("pointercancel", endLook);

  // Buttons press on touch down and release on lift, wherever the finger
  // wanders meanwhile.
  for (const b of root.querySelectorAll("[data-t]")) {
    b.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      capture(b, e.pointerId);
      held.set(e.pointerId, b);
      b.classList.add("down");
      actions.down(b.dataset.t);
    });
    const release = (e) => {
      if (held.get(e.pointerId) !== b) return;
      held.delete(e.pointerId);
      b.classList.remove("down");
      actions.up(b.dataset.t);
    };
    b.addEventListener("pointerup", release);
    b.addEventListener("pointercancel", release);
    b.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  return {
    // Lets go of everything, e.g. when the game pauses.
    reset() {
      for (const b of held.values()) {
        b.classList.remove("down");
        actions.up(b.dataset.t);
      }
      held.clear();
      lookIds.clear();
      if (stickId !== null) {
        stickId = null;
        stick.classList.remove("on");
      }
      actions.move(0, 0);
    },
  };
}
