/**
 * Worker Router - Type Definitions
 */

/**
 * Cloudflare Worker execution context
 */
export interface ExecutionContext {
  waitUntil(promise: Promise<any>): void;
  passThroughOnException(): void;
}

/**
 * Route handler function for Cloudflare Workers
 * @param request - Incoming HTTP request
 * @param env - Environment bindings (KV, D1, secrets, etc.)
 * @param ctx - Execution context
 * @returns Response or Promise<Response>
 */
export type RouteHandler<Env = unknown> = (
  request: Request,
  env: Env,
  ctx: ExecutionContext,
) => Response | Promise<Response>;

/**
 * Router interface with HTTP method routing
 */
export interface Router<Env = unknown> {
  /**
   * Register a GET route
   */
  get(path: string, handler: RouteHandler<Env>): Router<Env>;

  /**
   * Register a POST route
   */
  post(path: string, handler: RouteHandler<Env>): Router<Env>;

  /**
   * Register a PUT route
   */
  put(path: string, handler: RouteHandler<Env>): Router<Env>;

  /**
   * Register a DELETE route
   */
  delete(path: string, handler: RouteHandler<Env>): Router<Env>;

  /**
   * Register a PATCH route
   */
  patch(path: string, handler: RouteHandler<Env>): Router<Env>;

  /**
   * Register a HEAD route
   */
  head(path: string, handler: RouteHandler<Env>): Router<Env>;

  /**
   * Register an OPTIONS route
   */
  options(path: string, handler: RouteHandler<Env>): Router<Env>;

  /**
   * Handle an incoming request and execute the matching handler
   * @returns Response or null if no route matched
   */
  handle(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response | null>;
}

declare const router: Router;

export default router;
