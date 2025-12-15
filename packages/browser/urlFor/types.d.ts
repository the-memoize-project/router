/**
 * Browser UrlFor - Type Definitions
 */

/**
 * Generate a URL for a named route with parameters
 * @param name - Handler function name
 * @param params - Route parameters to interpolate
 * @returns Full URL string
 *
 * @example
 * function userProfile() {}
 * router("/users/:id/profile", userProfile);
 *
 * const url = urlFor("userProfile", { id: 123 });
 * console.log(url); // "https://example.com/users/123/profile"
 */
declare function urlFor(
  name: string,
  params?: Record<string, string | number>,
): string;

export default urlFor;
