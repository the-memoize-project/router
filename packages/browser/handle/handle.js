import args from "@browser/args";
import matching from "@browser/matching";
import params from "@browser/params";

/**
 * Main navigation handler that processes browser location changes and executes matching route handlers.
 *
 * @returns {void}
 *
 * @description
 * The `handle` function is the core navigation processor for browser-based routing.
 * It orchestrates the entire routing flow by finding the matching route for the current
 * browser location, extracting query parameters and route parameters, then executing
 * the corresponding route handler.
 *
 * Processing order:
 * 1. Matches the current pathname to a registered route
 * 2. Extracts query string parameters from location.search
 * 3. Extracts route parameters from the URL path
 * 4. Executes the matched route handler
 *
 * This function is automatically called on navigation events (popstate, pushState).
 *
 * @example
 * import router from '@the-memoize-project/router/browser';
 *
 * // Register routes
 * router.get('/users/:id', function viewUser() {
 *   console.log('Viewing user:', params.id);
 * });
 *
 * // Handle is called automatically on navigation
 * // You can also call it manually to process the current location
 * router.handle();
 */
function handle() {
  const { page, path } = matching();
  args();
  params(path);
  if (page) page();
}

export default handle;
