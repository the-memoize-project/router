/**
 * Browser Args - Type Definitions
 */

/**
 * Query string parameters extracted from the URL
 * @example
 * // URL: /search?q=router&page=2
 * // Returns: { q: "router", page: "2" }
 */
export type QueryParams = Record<string, string>;

/**
 * Extract query string parameters from the current URL
 * @returns Object containing query parameters
 */
declare function args(): QueryParams;

export default args;
