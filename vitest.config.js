import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      "@browser": resolve(__dirname, "packages/browser"),
      "@worker": resolve(__dirname, "packages/worker"),
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
