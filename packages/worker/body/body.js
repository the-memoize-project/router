/**
 * Parses and stores the request body based on HTTP method and content type.
 *
 * @param {Request} request - The incoming HTTP request from Cloudflare Workers.
 * @returns {Promise<void>}
 *
 * @description
 * The `body` function automatically parses JSON request bodies for POST and PUT
 * requests with 'application/json' content-type. Parsed data is stored as properties
 * on the function itself, making it accessible throughout the request lifecycle.
 * For other HTTP methods or content types, an empty object is used.
 *
 * @example
 * import router, { body } from '@the-memoize-project/router/worker';
 *
 * router.post('/api/users', async function createUser(request, env, ctx) {
 *   // Request body: { "name": "John", "email": "john@example.com" }
 *   // body is automatically processed by handle()
 *   console.log(body.name);   // "John"
 *   console.log(body.email);  // "john@example.com"
 *
 *   return new Response(JSON.stringify({ created: body.name }));
 * });
 */
async function body(request) {
  const data = /POST|PUT/i.test(request.method) &&
    /application\/json/i.test(request.headers.get("Content-Type"))
    ? await request.json()
    : {};

  Object.keys(data).forEach(key => {
    Object.defineProperty(body, key, {
      value: data[key],
      writable: true,
      configurable: true,
      enumerable: true
    });
  });
}

export default body;
