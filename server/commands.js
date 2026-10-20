// Chat commands, typed as /name args. Add one by adding an entry here.
// admin commands run only for members of the team that owns the project
// (player.admin, set from Yard's entitlement header when they connect).
import { MAX_HP, CYCLE_MS } from "../play/js/shared/rules.js";
import { worldRecord, saveWorldRecord, restartWorld } from "./edits.js";
import { damage } from "./combat.js";
import { stateOf, setMode } from "./inventory.js";
import { MOBS, isMobKind } from "../play/js/shared/mobs.js";
import { summonMobs } from "./mobs/index.js";

// Each: run(room, ws, player, args) with args lower-cased.
const COMMANDS = {
  help: {
    usage: "/help",
    about: "list the commands you can use",
    run(room, ws, player) {
      const lines = Object.values(COMMANDS)
        .filter((c) => !c.admin || player.admin)
        .map((c) => `${c.usage} — ${c.about}${c.admin ? " (team)" : ""}`);
      room.reply(ws, ["Commands:", ...lines].join("\n"));
    },
  },
  who: {
    usage: "/who",
    about: "list who's online",
    run(room, ws) {
      const names = room.players().map((p) => (p.admin ? `★${p.name}` : p.name));
      room.reply(ws, `Online (${names.length}): ${names.join(", ")}`);
    },
  },
  kill: {
    usage: "/kill",
    about: "die and respawn",
    run(room, ws, player) {
      if (player.mode === "creative") return room.reply(ws, "You can't be hurt in creative mode.", true);
      damage(room, ws, player, MAX_HP * 10, { cause: "void", force: true });
    },
  },
  gamemode: {
    usage: "/gamemode [survival|creative]",
    about: "switch between survival and creative",
    run(room, ws, player, args) {
      const names = { survival: "survival", s: "survival", 0: "survival", creative: "creative", c: "creative", 1: "creative" };
      const current = stateOf(room, player).mode;
      const mode = args[0] === undefined ? (current === "creative" ? "survival" : "creative") : names[args[0]];
      if (!mode) return room.reply(ws, "Usage: /gamemode [survival|creative]", true);
      setMode(room, player, mode);
      room.reply(ws, `Your game mode is now ${mode[0].toUpperCase()}${mode.slice(1)}.`);
    },
  },
  summon: {
    usage: "/summon <mob> [count]",
    about: "creative: bring mobs to where you stand",
    async run(room, ws, player, args) {
      const usage = `Usage: /summon <mob> [count], with mob one of: ${Object.keys(MOBS).join(", ")}`;
      if (player.mode !== "creative") return room.reply(ws, "/summon only works in creative mode.", true);
      const n = args[1] === undefined ? 1 : Number(args[1]);
      if (!isMobKind(args[0]) || !Number.isInteger(n) || n < 1 || n > 10) return room.reply(ws, usage, true);
      const made = await summonMobs(room, args[0], n, player.p);
      if (!made) return room.reply(ws, "There are too many mobs in this world.", true);
      room.reply(ws, `Summoned ${made} ${MOBS[args[0]].name.toLowerCase()}${made > 1 ? "s" : ""}.`);
    },
  },
  spawn: {
    usage: "/spawn",
    about: "go back to spawn",
    run(room, ws) {
      room.send(ws, { type: "teleport", spawn: true });
    },
  },
  time: {
    admin: true,
    usage: "/time day|noon|night|midnight",
    about: "set the time of day for everyone",
    async run(room, ws, player, args) {
      const phases = { day: 0.04, noon: 0.25, night: 0.54, midnight: 0.75 };
      const target = phases[args[0]];
      if (target === undefined) return room.reply(ws, "Usage: /time day|noon|night|midnight", true);
      const world = await worldRecord(room);
      const now = Date.now();
      world.timeOffset = (((target * CYCLE_MS - (now % CYCLE_MS)) % CYCLE_MS) + CYCLE_MS) % CYCLE_MS;
      await saveWorldRecord(room, world);
      room.broadcast(null, { type: "time", now, timeOffset: world.timeOffset });
      room.broadcast(null, { type: "system", text: `${player.name} set the time to ${args[0]}` });
    },
  },
  restart: {
    admin: true,
    usage: "/restart [seed]",
    about: "wipe every build and generate a new world",
    async run(room, ws, player, args) {
      let seed = Math.floor(Math.random() * 2 ** 31);
      if (args[0] !== undefined) {
        seed = Number(args[0]);
        if (!Number.isInteger(seed) || seed < 0 || seed >= 2 ** 31) {
          return room.reply(ws, "Usage: /restart [seed], with a whole number below 2147483648", true);
        }
      }
      const world = await restartWorld(room, seed);
      room.broadcast(null, { type: "reset", seed, gen: world.gen });
      room.broadcast(null, { type: "system", text: `${player.name} restarted the world (seed ${seed})` });
    },
  },
};

export const commandMessages = {
  async command(room, ws, player, msg) {
    if (typeof msg.text !== "string") return;
    const [name, ...args] = msg.text.trim().replace(/^\//, "").split(/\s+/);
    const key = name?.toLowerCase();
    const command = Object.hasOwn(COMMANDS, key) ? COMMANDS[key] : null;
    if (!command) return room.reply(ws, `Unknown command /${name}. Try /help`, true);
    if (command.admin && !player.admin) return room.reply(ws, `/${name} is only for the project's team.`, true);
    await command.run(room, ws, player, args.map((a) => a.toLowerCase()));
  },
};
