# Yardcraft

<p align="center">
<a href="https://dash.yard.sh/projects?action=create&repo=https%3A%2F%2Fgithub.com%2Fyard-sh%2Fyard-yardcraft"><img src="https://yard.sh/create-in-yard.png" width="200" alt="Create in Yard" /></a>
</p>

A multiplayer voxel game on Yard: a static three.js client plus a Yard
service whose `World` room holds each world's players and block edits.

The project serves the game at `/<project-slug>/play/` (anyone can join, no
sign-in needed) and has a single free tier. A project created from this
template gets its own worlds, players and skins; nothing is shared with
this one.

## Working on it

```sh
npm install          # once: esbuild and three, to build client and server
npm run dev          # build, rebuild on change, and run yard dev
npm run check        # build, then yard service check
npm run push         # check, then yard push
yard releases publish vX.Y.Z --channel Production   # go live
```

Both halves are bundled by esbuild. The client in `play/js/` and
`play/css/` (three.js included, from npm) is minified into
`play/dist/main.js` and `play/dist/index.css`, so the game loads in two
requests instead of sixty-odd modules plus a CDN round trip; `index.html`
loads only those. The server, `server/`, is bundled into `play/_service.js`.
**Never edit `play/dist/` or `play/_service.js`**; every build regenerates
them. They are committed anyway: a project created from this template
deploys the repository as it is, with no build step, so rebuild before
every commit.

## Layout

```
server/                 the service (bundled into play/_service.js)
  index.js              HTTP routing: profile API, skins, /ws → room
  room.js               the World room: sockets, broadcast, message dispatch
  players.js            move, swing, profile, chat messages
  combat.js             health: damage, attack, fall, regen, respawn
  edits.js              world record (seed, gen, clock), block edits,
                        survival drops and costs
  inventory.js          inventories and game modes, per player per world
  items.js              items on the ground: spawn, pickup, despawn
  mobs/                 mobs: state, health and the alarm tick (index.js),
                        goals (brain.js), finding a way (path.js), spawning
  terrain.js            the real block anywhere (edit, else generated)
  commands.js           /commands, one table entry each
  profiles.js           character profiles and uploaded skins (env.DB)
.yard/migrations/       database tables (profiles, skins)

play/                   the bundle Yard deploys
  index.html, css/      page and styles (base, hud, menu, touch; index.css
                        imports them all)
  dist/                 the built client: main.js and index.css
  js/main.js            entry: joining a world, the frame loop
  js/net.js             the socket: send(), on(type, handler)
  js/shared/rules.js    numbers the server uses too (world size, health…)
  js/shared/inventory.js  inventory rules both sides run (clicks, stacks, drops)
  js/shared/items.js    item types: blocks, plus items that aren't (food…)
  js/shared/mobs.js     mob kinds (stats, drops, spawning, goals) and the
                        path maths both sides use to place a walking mob
  js/core/              settings, noise, DOM helpers
  js/world/             pure data: blocks, chunks, terrain, light, meshing
  js/render/            three.js renderer, sky, textures, block highlight,
                        box models (players and mobs), item meshes
  js/game/              shared state, player physics, camera, chunk
                        streaming, breaking/placing/punching, health
  js/entities/          other players, your own model and hand, items, mobs
  js/mobs/              each mob's look: model, texture painter, motion
  js/skins/             Minecraft skin format, presets, player model
  js/audio/             synthesized sounds and positional playback
  js/ui/                HUD, hearts, chat, menus, options, character,
                        inventory screen, debug screen
  js/input/             in-game vs menu, keyboard/mouse, touch
```

Dependencies point downward: `shared`, `core` and `world` know nothing of
the browser game; `render` draws; `game` and `entities` play; `ui` and
`input` sit on top; `main.js` wires them up. `server/` imports
`play/js/shared/` and `play/js/world/` (it generates terrain itself to know
what a broken block was), so keep those free of browser APIs.

## Conventions

- Modules only *set themselves up* when loaded: create scene objects, add
  event listeners, register message handlers with `on()`. Anything that
  calls into another game module at startup goes in `main.js`, so the
  order modules load in never matters.
- Shared mutable state is in `js/game/state.js` (`game`, `player`,
  `health`, `controls`). Change it in place.
- Options: change with `setSetting()`, react with `watchSetting()`
  (`js/core/settings.js`).

## Adding things

- **A message from the server:** add a handler to one of the `…Messages`
  tables in `server/`, and `on("type", …)` in the client module it concerns.
- **A command:** add an entry to `COMMANDS` in `server/commands.js`
  (`admin: true` limits it to the project's team).
- **A block:** an id and `def(...)` in `js/world/blocks.js`, a tile painted
  in `paintAtlas()` (`js/render/textures.js`), and add it to `PLACEABLE` to
  make it placeable and show in the creative screen (the server allows
  exactly those). What it drops in survival is `dropOf()` in
  `js/shared/inventory.js` (by default, itself).
- **An option:** a default in `js/core/settings.js` and a row in `OPTIONS`
  (`js/ui/options.js`); the screen builds itself.
- **An item that isn't a block:** an id (256 up) in `js/shared/items.js`, a
  tile in `T` (`js/world/blocks.js`) painted in `paintAtlas()` on a clear
  background; it's drawn as a pressed-out sprite. `food` makes it edible.
- **A mob:**
  1. Its kind in `js/shared/mobs.js`: health, size, speeds, drops,
     spawning, and its goals (`ai`).
  2. Its look in `js/mobs/<kind>.js`: `model` (boxes, as
     `render/box-model.js` describes), `motion` (legs, head, sounds) and
     `paint()` for its texture; add it to `MOB_LOOKS` in `js/mobs/index.js`.
  3. Any new behaviour as a goal in `server/mobs/brain.js`, and new sounds.
- **A sound:** a recipe in `js/audio/synth.js` and its name in `MATERIALS`.

## Yard notes

The play service is `public`: anyone can join. A signed-out player is a
guest: the page asks Yard for a guest id (`POST __yard/auth/guest`) and every
request, the room's WebSocket included, then carries `X-Yard-Guest-Id`.
Profiles (`env.DB`, `server/profiles.js`) and inventories are keyed by the
user id, or `guest:<id>`; guests start as GuestNNN and use preset skins only.
When a guest signs in, the room moves their inventory to the user and tells
the page to forget the guest id (`DELETE __yard/auth/guest`).

The `World` room class is declared under `rooms` in `.yard/settings.json`.
Removing or renaming a room class deletes its data at the next deploy, so
keep the name. Instance fields don't survive the room idling: edits live in
SQL storage, the world record in key-value storage, each player in their
socket's attachment (about 2 KB at most; skins are served over HTTP).
Mobs think on the room's alarm while anyone is connected, and on any
message that arrives when the alarm is late (yard dev doesn't always fire
an alarm set from inside `alarm()`).
Full contract: /docs/v1/platform/services/rooms
