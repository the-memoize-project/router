/**
 * Extracts and stores HTTP headers from the request with normalized keys.
 *
 * @param {Request} request - The incoming HTTP request from Cloudflare Workers.
 * @returns {void}
 *
 * @description
 * The `headers` function parses all HTTP headers from the request and stores them
 * as properties on the function itself. Header keys are normalized to lowercase
 * since HTTP headers are case-insensitive. This provides convenient access to
 * headers throughout the request lifecycle without manually parsing each time.
 *
 * @example
 * import router, { headers } from '@the-memoize-project/router/worker';
 *
 * router.post('/api/data', async function handleData(request, env, ctx) {
 *   // headers is automatically processed by handle()
 *   console.log(headers['content-type']);  // "application/json"
 *   console.log(headers.authorization);    // "Bearer token123"
 *   console.log(headers['user-agent']);    // "Mozilla/5.0..."
 *
 *   if (!headers.authorization) {
 *     return new Response('Unauthorized', { status: 401 });
 *   }
 *
 *   return new Response('OK');
 * });
 */
const headers = (request) => {
  Array.from(request.headers.entries()).forEach(([key, value]) =>
    Reflect.set(headers, key.toLowerCase(), value),
  );
};

export default headers;
