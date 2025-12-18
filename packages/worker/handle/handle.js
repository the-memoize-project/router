import args from "../args/args.js";
import body from "../body/body.js";
import headers from "../headers/headers.js";
import match from "../match/match.js";
import params from "../params/params.js";

/**
 * Main request handler that processes incoming requests and executes matching route handlers.
 *
 * @param {Request} request - The incoming HTTP request from Cloudflare Workers.
 * @param {Object} env - The environment bindings (KV namespaces, Durable Objects, secrets, etc.).
 * @param {ExecutionContext} ctx - The execution context for background tasks and waitUntil.
 * @returns {Promise<Response|undefined>} The response from the matched route handler, or undefined if no route matches.
 *
 * @description
 * The `handle` function is the core request processor that orchestrates the entire
 * routing flow. It finds the matching route, processes the request by extracting
 * body data, query parameters, headers, and route parameters, then executes the
 * corresponding route handler with all processed data available.
 *
 * Processing order:
 * 1. Matches the request to a registered route
 * 2. Parses request body (for POST/PUT with JSON)
 * 3. Extracts query string parameters
 * 4. Extracts HTTP headers
 * 5. Extracts route parameters from URL path
 * 6. Executes the matched route handler
 *
 * @example
 * import router from '@the-memoize-project/router/worker';
 *
 * // Register routes
 * router.get('/api/users/:id', getUser);
 * router.post('/api/users', createUser);
 *
 * // Export as fetch handler
 * export default {
 *   async fetch(request, env, ctx) {
 *     return await router.handle(request, env, ctx) || new Response('Not Found', { status: 404 });
 *   }
 * };
 */
async function handle(request, env, ctx) {
  const { page, path } = match(request);

  await body(request);
  args(request);
  headers(request);
  params(request, path);

  return page?.(request, env, ctx);
}

export default handle;
