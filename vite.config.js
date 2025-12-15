import { resolve } from "node:path";
import terser from "@rollup/plugin-terser";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: {
        router: resolve(__dirname, "packages/browser/router/index.js"),
        browser: resolve(__dirname, "packages/browser.js"),
        worker: resolve(__dirname, "packages/worker.js"),
      },
      formats: ["cjs", "es"],
    },
    minify: false,
    outDir: "dist",
    rollupOptions: {
      plugins: [
        terser({
          format: {
            comments: false,
          },
        }),
      ],
      output: {
        exports: "named",
      },
    },
    sourcemap: true,
  },
  resolve: {
    alias: {
      "@args": resolve(__dirname, "packages/browser/args"),
      "@fallback": resolve(__dirname, "packages/browser/fallback"),
      "@handle": resolve(__dirname, "packages/browser/handle"),
      "@listeners": resolve(__dirname, "packages/browser/listeners"),
      "@matching": resolve(__dirname, "packages/browser/matching"),
      "@params": resolve(__dirname, "packages/browser/params"),
      "@popState": resolve(__dirname, "packages/browser/popState"),
      "@pushState": resolve(__dirname, "packages/browser/pushState"),
      "@router": resolve(__dirname, "packages/browser/router"),
      "@urlFor": resolve(__dirname, "packages/browser/urlFor"),
    },
  },
});
