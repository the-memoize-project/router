import router from "@browser/router";

/**
 * Initializes the popstate event listener for browser navigation handling.
 *
 * @returns {void}
 *
 * @description
 * The `popState` function sets up an event listener for the browser's `popstate` event,
 * which fires when the user navigates through their browser history using the back or
 * forward buttons. When this event occurs, the router's handle function is called to
 * process the new location and execute the matching route handler.
 *
 * This is a core part of enabling browser history navigation in single-page applications.
 *
 * @example
 * import router, { popState } from '@the-memoize-project/router/browser';
 *
 * // Register routes
 * router('/users', function listUsers() {
 *   document.body.innerHTML = '<h1>Users</h1>';
 * })('/about', function about() {
 *   document.body.innerHTML = '<h1>About</h1>';
 * });
 *
 * // Enable popstate handling (usually called once during app initialization)
 * popState();
 *
 * // Now when users click browser back/forward buttons,
 * // the appropriate route handler will be executed
 */
const popState = () => window.addEventListener("popstate", router.handle);

export default popState;
