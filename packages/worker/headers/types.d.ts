/**
 * Worker Headers - Type Definitions
 */

/**
 * HTTP request headers as key-value pairs
 * Header keys are normalized to lowercase (HTTP headers are case-insensitive)
 * @example
 * // Headers: Content-Type: application/json, Authorization: Bearer token123
 * // Returns: { "content-type": "application/json", "authorization": "Bearer token123" }
 */
export type RequestHeaders = Record<string, string>;

/**
 * Extract HTTP headers from the current request
 * @param request - Incoming HTTP request
 * @returns Object containing request headers with lowercase keys
 *
 * @example
 * import router, { headers } from "@the-memoize-project/router/worker";
 *
 * router.get("/api/example", async function handler(request, env, ctx) {
 *   // Access headers
 *   const contentType = headers["content-type"];
 *   const authorization = headers.authorization;
 *   const userAgent = headers["user-agent"];
 *
 *   return new Response("OK");
 * });
 */
declare function headers(request: Request): void;

export default headers;
