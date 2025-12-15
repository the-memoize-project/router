import { resolve } from "node:path";
import terser from "@rollup/plugin-terser";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: {
        browser: resolve(__dirname, "packages/browser/index.js"),
        worker: resolve(__dirname, "packages/worker/index.js"),
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
      "@browser": resolve(__dirname, "packages/browser"),
      "@worker": resolve(__dirname, "packages/worker"),
    },
  },
});
