import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      "@args": resolve(__dirname, "packages/args"),
      "@fallback": resolve(__dirname, "packages/fallback"),
      "@handle": resolve(__dirname, "packages/handle"),
      "@listeners": resolve(__dirname, "packages/listeners"),
      "@matching": resolve(__dirname, "packages/matching"),
      "@params": resolve(__dirname, "packages/params"),
      "@popState": resolve(__dirname, "packages/popState"),
      "@pushState": resolve(__dirname, "packages/pushState"),
      "@router": resolve(__dirname, "packages/router"),
      "@urlFor": resolve(__dirname, "packages/urlFor"),
    },
  },
  test: {
    coverage: {
      include: ["packages/**/*.{js,ts}"],
      exclude: ["packages/**/index.{js,ts}"],
      reporter: ["text", "lcov", "html"],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
    environment: "happy-dom",
    setupFiles: resolve(__dirname, "happydom.js"),
    fakeTimers: {
      toFake: [],
    },
  },
});
