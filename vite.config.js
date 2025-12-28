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
  
  // optional: dev server fallback
  server: {
    host: '0.0.0.0',
    historyApiFallback: true // ensures /login etc work locally
  },

  // optional: set base if deploying to a subfolder
  base: '/'
})
