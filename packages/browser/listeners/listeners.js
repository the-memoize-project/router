/**
 * Registry array that stores all registered route handlers for browser-based routing.
 *
 * @type {Array<{path: string, page: Function}>}
 *
 * @description
 * The `listeners` array maintains all registered routes in the order they were added.
 * Each route entry contains the path pattern and the handler function (page).
 * This registry is used by the router to match the current browser location to handlers.
 * Unlike the worker package which organizes routes by HTTP method, browser routes
 * are all stored in a single array since browser routing doesn't differentiate by method.
 *
 * Structure:
 * - Array of route objects: { path, page }
 *   - path: The route pattern (e.g., "/users/:id")
 *   - page: The handler function
 *
 * @example
 * import listeners from '@the-memoize-project/router/browser/listeners';
 *
 * // Routes are automatically added when using router()
 * console.log(listeners);
 * // [
 * //   { path: '/users', page: [Function: listUsers] },
 * //   { path: '/users/:id', page: [Function: viewUser] },
 * //   { path: '/about', page: [Function: aboutPage] }
 * // ]
 */
const listeners = [];

export default listeners;
