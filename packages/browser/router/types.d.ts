/**
 * Browser Router - Type Definitions
 */

/**
 * Route handler function for browser routes
 */
export type RouteHandler = () => void;

/**
 * Router interface with chainable methods
 */
export interface Router {
  /**
   * Register a route with a path pattern and handler
   * @param path - Route pattern (supports :param syntax)
   * @param handler - Function to call when route matches
   * @returns Router instance for chaining
   */
  (path: string, handler: RouteHandler): Router;

  /**
   * Self-reference for chaining
   */
  router: Router;

  /**
   * Set a fallback handler for unmatched routes (404)
   * @param handler - Function to call when no route matches
   * @returns Router instance for chaining
   */
  fallback(handler: RouteHandler): Router;

  /**
   * Match the current URL and execute the matching handler
   */
  handle(): void;
}

declare const router: Router;

export default router;
