import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    host: 'localhost',
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})
