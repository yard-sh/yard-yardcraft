// The connection to the world's room. Each message type has one handler,
// registered with on() by the module it concerns.

export const worldName = new URLSearchParams(location.search).get("world") || "main";
const url = new URL(`ws?world=${encodeURIComponent(worldName)}`, location.href);
url.protocol = url.protocol === "https:" ? "wss:" : "ws:";

let ws = null;
let retry = 0; // the reconnect waiting to run
const handlers = new Map(); // type -> fn(msg)

export function on(type, fn) {
  if (handlers.has(type)) throw new Error(`Two handlers for "${type}" messages`);
  handlers.set(type, fn);
}

export const connected = () => ws?.readyState === WebSocket.OPEN;

// Round-trip time to the room in milliseconds, measured every 2 seconds;
// null until the first answer.
export let latency = null;
setInterval(() => send({ type: "ping", t: performance.now() }), 2000);
on("pong", (msg) => (latency = Math.round(performance.now() - msg.t)));

export function send(msg) {
  if (connected()) ws.send(JSON.stringify(msg));
}

// Connects, and reconnects a second after every close: restarts, the 24-hour
// socket cap and network drops are all expected. onDrop runs on each close.
export function connect(onDrop) {
  ws = new WebSocket(url);
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    handlers.get(msg.type)?.(msg);
  };
  ws.onclose = () => {
    latency = null;
    onDrop();
    retry = setTimeout(() => connect(onDrop), 1000);
  };
}

// Leaves the world, with no reconnect until the next connect().
export function disconnect() {
  clearTimeout(retry);
  if (!ws) return;
  ws.onclose = null;
  ws.close();
  ws = null;
  latency = null;
}
