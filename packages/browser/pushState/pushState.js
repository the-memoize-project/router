import router from "@browser/router";

/**
 * Intercepts and enhances the browser's pushState method for programmatic navigation handling.
 *
 * @returns {void}
 *
 * @description
 * The `pushState` function wraps the native `history.pushState` method using a Proxy
 * to intercept programmatic navigation calls. When `history.pushState` is called,
 * it executes the original method and then dispatches a custom "pushstate" event.
 * This allows the router to detect and respond to programmatic navigation (not just
 * browser back/forward buttons), ensuring route handlers are executed for all navigation types.
 *
 * This enables full single-page application routing by handling both user-initiated
 * and programmatic navigation.
 *
 * @example
 * import router, { pushState } from '@the-memoize-project/router/browser';
 *
 * // Register routes
 * router('/users', function listUsers() {
 *   document.body.innerHTML = '<h1>Users</h1>';
 * })('/about', function about() {
 *   document.body.innerHTML = '<h1>About</h1>';
 * });
 *
 * // Enable pushState handling (usually called once during app initialization)
 * pushState();
 *
 * // Now programmatic navigation will trigger route handlers
 * history.pushState({}, '', '/about');  // Triggers the about route handler
 * history.pushState({}, '', '/users');  // Triggers the listUsers route handler
 */
const pushState = () => {
  history.pushState = new Proxy(history.pushState, {
    apply(original, context, args) {
      original.apply(context, args);
      window.dispatchEvent(new CustomEvent("pushstate"));
    },
  });

  window.addEventListener("pushstate", router.handle);
};

export default pushState;
