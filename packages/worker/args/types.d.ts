/**
 * Worker Args - Type Definitions
 */

/**
 * Query string parameters extracted from the URL
 * @example
 * // URL: /api/search?q=router&page=2
 * // Returns: { q: "router", page: "2" }
 */
export type QueryParams = Record<string, string>;

/**
 * Extract query string parameters from the current request
 * @returns Object containing query parameters
 */
declare function args(): QueryParams;

export default args;
