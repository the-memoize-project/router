import handle from "../handle/handle.js";
import listeners from "../listeners/listeners.js";

const router = new Proxy(
  {},
  {
    get(_, method) {
      if (/handle/.test(method)) return handle;
      return (path, page) =>
        listeners[method.toUpperCase()].push({ path, page, name: page.name });
    },
  },
);

export default router;
