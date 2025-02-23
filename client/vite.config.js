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
    build: {
      outDir: 'dist' 
    }
  },

  // Add this block to exclude dependencies from optimization
  optimizeDeps: {
    exclude: ['some-package-name']  // Replace 'some-package-name' with the actual package name causing issues
  },
});
