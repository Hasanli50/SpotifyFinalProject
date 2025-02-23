/* eslint-disable no-undef */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  assetsInclude: ["**/*.woff2", "**/*.woff", "**/*.ttf", "**/*.otf"],

  resolve: {
    alias: {
      "@assets": path.resolve(__dirname, "src/assets"),
      "@components": path.resolve(__dirname, "src/components"),
    },
  },

  build: {
    assetsDir: "assets",
    rollupOptions: {
      external: ["**/*.woff2", "**/*.woff", "**/*.ttf", "**/*.otf"],
    },
  },

  // Add this block to exclude dependencies
  optimizeDeps: {
    exclude: ['some-package-name']  // Replace 'some-package-name' with the name of the package you're having trouble with
  },
});
