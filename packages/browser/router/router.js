import fallback from "@browser/fallback";
import handle from "@browser/handle";
import listeners from "@browser/listeners";

/**
 * Router function that registers routes and provides navigation handling for browser-based applications.
 *
 * @param {string} path - The route pattern with optional parameter placeholders (e.g., "/users/:id").
 * @param {Function} page - The handler function to execute when the route matches.
 * @returns {Function} The router function itself, allowing for method chaining.
 *
 * @description
 * The `router` function is the main entry point for registering routes in browser-based
 * applications. It follows a functional programming pattern where the function itself
 * is used to register routes, and additional methods are available as properties.
 * Routes are stored in the listeners array and matched against the current location
 * during navigation.
 *
 * Available properties:
 * - `router.router` - The router function itself (for compatibility)
 * - `router.fallback` - The fallback handler configuration
 * - `router.handle` - Function to manually process the current location
 *
 * @example
 * import router from '@the-memoize-project/router/browser';
 *
 * // Register routes with method chaining
 * router('/users', function listUsers() {
 *   document.body.innerHTML = '<h1>Users List</h1>';
 * })
 * ('/users/:id', function viewUser() {
 *   document.body.innerHTML = `<h1>User ${params.id}</h1>`;
 * })
 * ('/about', function aboutPage() {
 *   document.body.innerHTML = '<h1>About</h1>';
 * });
 *
 * // Manually trigger route handling
 * router.handle();
 */
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
