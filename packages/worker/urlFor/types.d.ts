/**
 * Worker UrlFor - Type Definitions
 */

/**
 * Generate a URL for a named route with parameters
 * @param name - Handler function name
 * @param params - Route parameters to interpolate
 * @returns Full URL string
 *
 * @example
 * function getUser() {}
 * router.get("/api/users/:id", getUser);
 *
 * const url = urlFor("getUser", { id: 123 });
 * console.log(url); // "https://example.com/api/users/123"
 */
declare function urlFor(
  name: string,
  params?: Record<string, string | number>,
): string;

export default urlFor;
