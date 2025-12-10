import { resolve } from "node:path";
import terser from "@rollup/plugin-terser";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: {
        router: resolve(__dirname, "packages/router/index.js"),
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
});
