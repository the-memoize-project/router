/**
 * Extracts and stores query string parameters from the request URL.
 *
 * @param {Request} request - The incoming HTTP request from Cloudflare Workers.
 * @returns {void}
 *
 * @description
 * The `args` function parses query string parameters from the request URL
 * and stores them as properties on the function itself, making them accessible
 * throughout the request lifecycle. This approach provides a convenient way to
 * access URL query parameters without manually parsing the URL each time.
 *
 * @example
 * import router, { args } from '@the-memoize-project/router/worker';
 *
 * router.get('/api/search', async function search(request, env, ctx) {
 *   // URL: /api/search?q=router&page=2
 *   // args is automatically processed by handle()
 *   console.log(args.q);     // "router"
 *   console.log(args.page);  // "2"
 *
 *   return new Response(JSON.stringify({ query: args.q, page: args.page }));
 * });
 */
const args = (request) => {
  const url = new URL(request.url);
  const search = new URLSearchParams(url.search);

  Array.from(search.entries()).forEach(([key, value]) => Reflect.set(args, key, value));
};

export default args;
