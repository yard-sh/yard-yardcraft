// What mobs decide to do, as Minecraft's goals: each kind lists its goals
// in ../../play/js/shared/mobs.js (ai), most urgent first, and the first
// that has something to do wins. A goal gets the mob, a terrain reader, the
// cell the mob is in and the time, and returns { path, speed } to walk
// somewhere, { wait } (milliseconds) to stand still, or null to let the
// next goal decide. A goal may keep its own state on the mob.
//
// New behaviours go here: hostile mobs would add chase and attack, animals
// follow (someone holding their food) or breed.
import { MOBS } from "../../play/js/shared/mobs.js";
import { planWander, planFlee } from "./path.js";

export const PANIC_MS = 5000;

const GOALS = {
  // For a few seconds after being hit: run, away from whoever did it.
  panic(m, r, cell, now) {
    if (!(now < m.panicUntil)) return null;
    const path = planFlee(r, cell, m.panicFrom) ?? planWander(r, cell);
    return path ? { path, speed: MOBS[m.kind].panic } : { wait: 250 };
  },

  // Stand about for a few seconds, then stroll somewhere nearby.
  wander(m, r, cell) {
    m.rested = !m.rested;
    if (m.rested) return { wait: 2000 + Math.random() * 6000 };
    const path = planWander(r, cell);
    return path ? { path, speed: MOBS[m.kind].walk } : { wait: 1000 };
  },
};

// The mob's next move.
export function decide(m, r, cell, now) {
  for (const goal of MOBS[m.kind].ai) {
    const plan = GOALS[goal](m, r, cell, now);
    if (plan) return plan;
  }
  return { wait: 2000 };
}
