/* eslint-disable no-undef */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  
  assetsInclude: ['**/*.woff2', '**/*.woff', '**/*.ttf', '**/*.otf'],

  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@styles': path.resolve(__dirname, 'src/styles')
    }
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/assets/scss/variables.scss";
          @import "@/assets/scss/mixins.scss";
        `
      }
    }
  },

  build: {
    assetsDir: 'assets', 
    rollupOptions: {
      external: ['**/*.woff2', '**/*.woff', '**/*.ttf', '**/*.otf']
    }
  }
})
