/**
 * Extracts and stores route parameters from the URL path pattern.
 *
 * @param {Request} request - The incoming HTTP request from Cloudflare Workers.
 * @param {string} path - The route pattern with parameter placeholders (e.g., "/users/:id").
 * @returns {void}
 *
 * @description
 * The `params` function extracts dynamic route parameters from the URL by matching
 * the actual pathname against the route pattern. Parameters are identified by the
 * colon prefix (`:`) in the route pattern and stored as properties on the function
 * itself, making them accessible throughout the request lifecycle.
 *
 * @example
 * import router, { params } from '@the-memoize-project/router/worker';
 *
 * router.get('/api/users/:userId/posts/:postId', async function getPost(request, env, ctx) {
 *   // URL: /api/users/123/posts/456
 *   // params is automatically processed by handle()
 *   console.log(params.userId);  // "123"
 *   console.log(params.postId);  // "456"
 *
 *   return new Response(JSON.stringify({
 *     userId: params.userId,
 *     postId: params.postId
 *   }));
 * });
 */
const params = (request, path) => {
  const url = new URL(request.url);
  const keys = path?.split("/");
  const values = url.pathname.split("/");

  keys?.forEach((key, i) => /^:/.test(key) && Reflect.set(params, key.slice(1), values[i]));
};

export default params;
