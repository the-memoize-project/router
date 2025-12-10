import handle from "@handle";
import listeners from "@listeners";
import fallback from "@fallback";

function router(path, page) {
  listeners.push({ path, page });
  return router;
}

Object.assign(router, {
  router,
  fallback,
  handle,
});

export default router;
