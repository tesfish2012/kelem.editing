import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  // Base URL for deployment (important for Render)
  base: '/',

  server: {
    host: '0.0.0.0',
    port: 5173, // optional, default is 5173
  },

  build: {
    outDir: 'dist', // output folder
    emptyOutDir: true,
  }
})
