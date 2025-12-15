/**
 * Worker Body - Type Definitions
 */

/**
 * Parsed request body (JSON, form data, or text)
 */
export type RequestBody = any;

/**
 * Parse the request body based on content-type
 * @param request - Incoming HTTP request
 * @returns Parsed request body
 *
 * @example
 * // JSON request
 * const data = await body(request);
 * console.log(data); // { name: "John", email: "john@example.com" }
 */
declare function body(request: Request): Promise<RequestBody>;

export default body;
