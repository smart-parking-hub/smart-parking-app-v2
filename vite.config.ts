import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: false,
    proxy: {
      '/api': { target: 'http://localhost:8088', changeOrigin: true },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalized = id.replace(/\\/g, '/')
          if (!normalized.includes('/node_modules/')) return
          if (/\/node_modules\/(react|react-dom|scheduler)\//.test(normalized))
            return 'react-vendor'
          if (
            /\/node_modules\/(react-hook-form|zod|@hookform)\//.test(normalized)
          )
            return 'forms-vendor'
          return 'vendor'
        },
      },
    },
  },
})
