/**
 * Registry object that stores all registered route handlers organized by HTTP method.
 *
 * @type {Object.<string, Array<{path: string, page: Function, name: string}>>}
 *
 * @description
 * The `listeners` object maintains arrays of registered routes for each supported
 * HTTP method (GET, POST, PUT, DELETE). Each route entry contains the path pattern,
 * the handler function (page), and the function name for URL generation.
 * This registry is used by the router to match incoming requests to their handlers.
 *
 * Structure:
 * - Each HTTP method key contains an array of route objects
 * - Route objects have: { path, page, name }
 *   - path: The route pattern (e.g., "/api/users/:id")
 *   - page: The handler function
 *   - name: The handler function's name
 *
 * @example
 * import listeners from '@the-memoize-project/router/worker/listeners';
 *
 * // Routes are automatically added when using router.get/post/put/delete
 * console.log(listeners.GET);    // [{ path: '/users', page: [Function], name: 'listUsers' }]
 * console.log(listeners.POST);   // [{ path: '/users', page: [Function], name: 'createUser' }]
 * console.log(listeners.PUT);    // [{ path: '/users/:id', page: [Function], name: 'updateUser' }]
 * console.log(listeners.DELETE); // [{ path: '/users/:id', page: [Function], name: 'deleteUser' }]
 */
const listeners = {
  DELETE: [],
  GET: [],
  POST: [],
  PUT: [],
};

export default listeners;
