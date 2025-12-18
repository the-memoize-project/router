/**
 * Extracts and stores query string parameters from the current browser location.
 *
 * @returns {void}
 *
 * @description
 * The `args` function parses query string parameters from `window.location.search`
 * and stores them as properties on the function itself. It first clears any existing
 * properties to ensure fresh data on each call, making the parameters accessible
 * throughout the navigation lifecycle. This provides a convenient way to access
 * URL query parameters in browser-based routing.
 *
 * @example
 * import router, { args } from '@the-memoize-project/router/browser';
 *
 * router.get('/search', function searchPage() {
 *   // URL: /search?q=router&page=2
 *   // args is automatically processed by handle()
 *   console.log(args.q);     // "router"
 *   console.log(args.page);  // "2"
 *
 *   document.body.innerHTML = `<h1>Search: ${args.q}</h1>`;
 * });
 */
const args = () => {
  const search = new URLSearchParams(globalThis.location.search).entries();
  Object.keys(args).forEach((key) => delete args[key]);
  Array.from(search).forEach(([key, value]) => Reflect.set(args, key, value));
};

export default args;
