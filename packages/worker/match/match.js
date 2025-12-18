import listeners from "../listeners/listeners.js";

/**
 * Finds the matching route handler for the incoming request.
 *
 * @param {Request} request - The incoming HTTP request from Cloudflare Workers.
 * @returns {Object} An object containing the matched route's `page` handler and `path` pattern, or an empty object if no match is found.
 *
 * @description
 * The `findMatchingRoute` function searches through registered route listeners
 * for the current HTTP method and attempts to match the request pathname against
 * each route pattern. Route patterns support dynamic parameters (e.g., `:id`)
 * which are converted to regex patterns for matching. The search is case-insensitive
 * and returns the first matching route handler.
 *
 * @example
 * import findMatchingRoute from '@the-memoize-project/router/worker/match';
 *
 * const request = new Request('https://api.example.com/api/users/123');
 * const match = findMatchingRoute(request);
 *
 * if (match.page) {
 *   console.log('Route found:', match.path);  // "/api/users/:id"
 *   const response = await match.page(request, env, ctx);
 * } else {
 *   console.log('No matching route');
 * }
 */
function findMatchingRoute(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  return listeners[request.method].find(({ path }) => {
    const pattern = path.replace(/:\w+/g, "([a-z0-9-_]+)");
    const regex = new RegExp(`^${pattern}$`, "i");
    return regex.test(pathname);
  }) ?? {};
}

export default findMatchingRoute;
