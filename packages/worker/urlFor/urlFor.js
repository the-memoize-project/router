import listeners from "../listeners/listeners.js";

/**
 * Generates a URL from a route handler function and parameters.
 *
 * @param {Function} page - The route handler function (must be a named function).
 * @param {Object} params - Object containing parameter values to replace in the route pattern.
 * @param {string} [host=""] - Optional host/domain to prepend to the URL.
 * @returns {string} The generated URL with parameters replaced, or "#" if the route is not found.
 *
 * @description
 * The `urlFor` function generates URLs by looking up a route handler by its function name
 * and replacing parameter placeholders (e.g., `:id`) with actual values. This provides
 * a type-safe way to generate URLs without hardcoding paths, making refactoring easier.
 * The function searches only GET routes by default.
 *
 * @example
 * import router, { urlFor } from '@the-memoize-project/router/worker';
 *
 * // Register a named route
 * router.get('/api/users/:userId/posts/:postId', async function getUserPost(request, env, ctx) {
 *   return new Response('Post content');
 * });
 *
 * // Generate URL for the route
 * const url = urlFor(getUserPost, { userId: '123', postId: '456' });
 * console.log(url);  // "/api/users/123/posts/456"
 *
 * // With host parameter
 * const fullUrl = urlFor(getUserPost, { userId: '123', postId: '456' }, 'https://api.example.com');
 * console.log(fullUrl);  // "https://api.example.com/api/users/123/posts/456"
 */
const urlFor = (page, params, host = "") => {
  const anchor = { path: "#" };
  const { path } =
    listeners.GET.find(({ name }) => name === page.name) ?? anchor;
  return `${host}${path.replace(/:(?<key>\w+)/g, (_, key) => params[key])}`;
};

export default urlFor;
