/**
 * Browser Params - Type Definitions
 */

/**
 * Route parameters extracted from the URL path
 * @example
 * // Route: /users/:id/posts/:postId
 * // URL: /users/123/posts/456
 * // Returns: { id: "123", postId: "456" }
 */
export type RouteParams = Record<string, string>;

/**
 * Extract route parameters from the current URL
 * @returns Object containing route parameters
 */
declare function params(): RouteParams;

export default params;
