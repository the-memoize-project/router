/**
 * Extracts and stores route parameters from the URL path pattern in the browser.
 *
 * @param {string} path - The route pattern with parameter placeholders (e.g., "/users/:id").
 * @returns {void}
 *
 * @description
 * The `params` function extracts dynamic route parameters from the current browser
 * location pathname by matching it against the route pattern. Parameters are identified
 * by the colon prefix (`:`) in the route pattern and stored as properties on the function
 * itself. Previous parameters are cleared before processing to ensure fresh data.
 * Uses named capture groups for efficient parameter extraction.
 *
 * @example
 * import router, { params } from '@the-memoize-project/router/browser';
 *
 * router.get('/users/:userId/posts/:postId', function viewPost() {
 *   // URL: /users/123/posts/456
 *   // params is automatically processed by handle()
 *   console.log(params.userId);  // "123"
 *   console.log(params.postId);  // "456"
 *
 *   document.body.innerHTML = `<h1>User ${params.userId}, Post ${params.postId}</h1>`;
 * });
 */
const params = (path) => {
  if (!path) return;

  const rule = path.replace(/:(\w+)/g, "(?<$1>[a-z0-9-_]+)");
  const pattern = new RegExp(`^${rule}$`, "i");
  const match = globalThis.location.pathname.match(pattern);

  Object.keys(params).forEach((key) => delete params[key]);

  if (match?.groups) {
    Object.entries(match.groups).forEach(([key, value]) => {
      Reflect.set(params, key, value);
    });
  }
};

export default params;
