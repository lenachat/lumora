import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  //proxy to avoid CORS issue with affimations API during development
  server: {
    proxy: {
      "/api": {
        target: "https://www.affirmations.dev",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
})
