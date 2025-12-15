/**
 * =================================================================
 * Browser Router - Type Declarations Module Composition
 * =================================================================
 *
 * This file composes all individual type declarations for the
 * browser platform into a single module declaration.
 *
 * Each component has its own types.d.ts file that defines its
 * specific types. This file references all of them to create
 * the complete module type definition.
 */

/// <reference path="./router/types.d.ts" />
/// <reference path="./params/types.d.ts" />
/// <reference path="./args/types.d.ts" />
/// <reference path="./urlFor/types.d.ts" />

declare module "@the-memoize-project/router/browser" {
  export { default, Router, RouteHandler } from "./router/types";
  export { default as params, RouteParams } from "./params/types";
  export { default as args, QueryParams } from "./args/types";
  export { default as urlFor } from "./urlFor/types";
}
