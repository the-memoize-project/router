import fallback from "@browser/fallback";
import listeners from "@browser/listeners";

/**
 * Finds the matching route handler for the current browser location.
 *
 * @returns {Object} An object containing the matched route's `page` handler and `path` pattern, or the fallback handler if no match is found.
 *
 * @description
 * The `matching` function searches through registered route listeners and attempts
 * to match the current browser pathname against each route pattern. Route patterns
 * support dynamic parameters (e.g., `:id`) which are converted to regex patterns
 * for matching. The search is case-insensitive and returns the first matching route
 * handler, or a fallback handler if no routes match.
 *
 * @example
 * import matching from '@the-memoize-project/router/browser/matching';
 *
 * // Current URL: /users/123
 * const match = matching();
 *
 * if (match.page) {
 *   console.log('Route found:', match.path);  // "/users/:id"
 *   match.page();
 * }
 */
const matching = () => {
  return (
    listeners.find(({ path }) => {
      if (!path) return false;
      const rule = path.replace(/:\w+/g, "([a-z0-9-_]+)");
      const pattern = new RegExp(`^${rule}$`, "i");
      return pattern.test(globalThis.location.pathname);
    }) ?? fallback
  );
};

export default matching;
