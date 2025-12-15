import listeners from "../listeners/listeners.js";

function findMatchingRoute(request) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/:\w+/g, "([a-z0-9-_]+)");
  const pattern = new RegExp(`^${path}$`, "i");

  return listeners[request.method].find(({ path }) => pattern.test(path)) ?? {};
}

export default findMatchingRoute;
