/**
 * =================================================================
 * Type Declarations Entry Point - @the-memoize-project/router
 * =================================================================
 *
 * This file is the main entry point for the TypeScript compiler.
 * It uses references to load type declarations for each platform
 * implementation of the library.
 *
 * The router supports two distinct runtime environments:
 * - Browser: Client-side routing for Single Page Applications
 * - Worker: HTTP routing for Cloudflare Workers at the edge
 *
 * Import the appropriate module for your use case:
 * - import router from "@the-memoize-project/router/browser"
 * - import router from "@the-memoize-project/router/worker"
 */

/// <reference path="./packages/browser/types.d.ts" />
/// <reference path="./packages/worker/types.d.ts" />
