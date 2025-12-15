import fallback from "@browser/fallback";
import handle from "@browser/handle";
import listeners from "@browser/listeners";

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
