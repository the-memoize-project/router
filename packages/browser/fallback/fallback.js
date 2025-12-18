/**
 * Configures a fallback handler for unmatched routes (404 pages).
 *
 * @param {Function} page - The handler function to execute when no route matches.
 * @returns {void}
 *
 * @description
 * The `fallback` function sets up a default handler that will be executed when
 * the router cannot find a matching route for the current pathname. This is typically
 * used to display a "404 Not Found" page or redirect users to a safe default page.
 * The fallback handler is stored with the current pathname when no matches are found.
 *
 * @example
 * import router from '@the-memoize-project/router/browser';
 *
 * // Register regular routes
 * router('/users', function listUsers() {
 *   document.body.innerHTML = '<h1>Users</h1>';
 * })('/about', function about() {
 *   document.body.innerHTML = '<h1>About</h1>';
 * });
 *
 * // Configure fallback for unmatched routes
 * router.fallback(function notFound() {
 *   document.body.innerHTML = `
 *     <h1>404 - Page Not Found</h1>
 *     <p>The page you're looking for doesn't exist.</p>
 *   `;
 * });
 *
 * // When navigating to an unregistered route like '/unknown',
 * // the notFound handler will be executed
 */
const fallback = (page) => {
  fallback.page = page;
  fallback.path = globalThis.location.pathname;
};

export default fallback;
