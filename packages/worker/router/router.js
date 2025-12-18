import handle from "../handle/handle.js";
import listeners from "../listeners/listeners.js";

/**
 * Router object that provides HTTP method handlers and request processing for Cloudflare Workers.
 *
 * @description
 * The `router` is a Proxy-based object that dynamically provides methods for registering
 * routes for different HTTP methods (GET, POST, PUT, DELETE, etc.) and handles incoming
 * requests. When accessing a method name, the Proxy intercepts it and either returns the
 * main `handle` function or creates a route registration function.
 *
 * Available methods:
 * - `router.get(path, handler)` - Register a GET route
 * - `router.post(path, handler)` - Register a POST route
 * - `router.put(path, handler)` - Register a PUT route
 * - `router.delete(path, handler)` - Register a DELETE route
 * - `router.handle(request, env, ctx)` - Process incoming requests
 *
 * @example
 * import router from '@the-memoize-project/router/worker';
 *
 * // Register routes
 * router.get('/api/users', async function listUsers(request, env, ctx) {
 *   return new Response(JSON.stringify({ users: [] }));
 * });
 *
 * router.post('/api/users', async function createUser(request, env, ctx) {
 *   return new Response(JSON.stringify({ created: true }), { status: 201 });
 * });
 *
 * router.get('/api/users/:id', async function getUser(request, env, ctx) {
 *   return new Response(JSON.stringify({ id: params.id }));
 * });
 *
 * // Export as Cloudflare Workers fetch handler
 * export default {
 *   async fetch(request, env, ctx) {
 *     return await router.handle(request, env, ctx) || new Response('Not Found', { status: 404 });
 *   }
 * };
 */
const router = new Proxy(
  {},
  {
    get(_, method) {
      if (/handle/.test(method)) return handle;
      return (path, page) =>
        listeners[method.toUpperCase()].push({ path, page, name: page.name });
    },
  },
);

export default router;
