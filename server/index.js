// Yardcraft's service: serves the static client in play/, the profile API
// and uploaded skins, and hands each player's socket to the room of their
// world. npm run build bundles this folder into play/_service.js.
import { profileApi, serveSkin } from "./profiles.js";

export { World } from "./room.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Never serve deploy inputs.
    if (url.pathname === "/_service.js") return new Response("Not found", { status: 404 });

    if (url.pathname === "/api/profile") return profileApi(request, env);

    // GET /skins/<id>.png serves an uploaded skin.
    const skin = url.pathname.match(/^\/skins\/([0-9a-f]{32})\.png$/);
    if (skin && request.method === "GET") return serveSkin(env, skin[1]);

    // GET /ws?world=<name> hands the socket to the room of that world.
    if (url.pathname === "/ws" && request.method === "GET") {
      const raw = (url.searchParams.get("world") ?? "main").toLowerCase();
      const name = /^[a-z0-9-]{1,32}$/.test(raw) ? raw : "main";
      return env.WORLDS.get(env.WORLDS.idFromName(name)).fetch(request);
    }

    return env.ASSETS.fetch(request);
  },
};
