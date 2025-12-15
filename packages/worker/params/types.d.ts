/**
 * Worker Params - Type Definitions
 */

/**
 * Route parameters extracted from the URL path
 * @example
 * // Route: /api/users/:id
 * // URL: /api/users/123
 * // Returns: { id: "123" }
 */
export type RouteParams = Record<string, string>;

/**
 * Extract route parameters from the current request
 * @returns Object containing route parameters
 */
declare function params(): RouteParams;

export default params;
