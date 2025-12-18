import listeners from "@browser/listeners";

/**
 * Generates a complete URL from a route handler function name and parameters.
 *
 * @param {string} name - The name of the route handler function.
 * @param {Object} [params={}] - Object containing parameter values to replace in the route pattern.
 * @returns {string} The generated full URL with origin and parameters replaced, or "#" if the route is not found.
 *
 * @description
 * The `urlFor` function generates complete URLs (including origin) by looking up a route
 * handler by its function name and replacing parameter placeholders (e.g., `:id`) with
 * actual values. This provides a type-safe way to generate URLs without hardcoding paths.
 * If a parameter is not provided, it remains as a placeholder in the URL.
 *
 * @example
 * import router, { urlFor } from '@the-memoize-project/router/browser';
 *
 * // Register a named route
 * router('/users/:userId/posts/:postId', function viewUserPost() {
 *   document.body.innerHTML = `<h1>Post ${params.postId}</h1>`;
 * });
 *
 * // Generate URL for the route
 * const url = urlFor('viewUserPost', { userId: '123', postId: '456' });
 * console.log(url);  // "http://localhost:3000/users/123/posts/456"
 *
 * // Missing parameters remain as placeholders
 * const partial = urlFor('viewUserPost', { userId: '123' });
 * console.log(partial);  // "http://localhost:3000/users/123/posts/:postId"
 *
 * // Route not found returns "#"
 * const notFound = urlFor('unknownRoute', {});
 * console.log(notFound);  // "#"
 */
const urlFor = (name, params = {}) => {
  const path = listeners.find(({ page }) => page?.name === name)?.path;
  if (!path) return "#";

  const pathname = path.replace(
    /:(\w+)/g,
    (_, key) => params[key] ?? `:${key}`,
  );
  return `${globalThis.location.origin}${pathname}`;
};

export default urlFor;
