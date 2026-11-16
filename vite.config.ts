import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), basicSsl()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: false,
    // Trace HTML is generated during browser checks; it must not reload the app.
    watch: { ignored: ['**/.artifacts/**', '**/test-results/**', '**/playwright-report/**'] },
    proxy: {
      '^/api(?:/|$)': { target: 'http://localhost:8088', changeOrigin: true },
    },
  },
  optimizeDeps: {
    include: ['qrcode.react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalized = id.replace(/\\/g, '/')
          if (!normalized.includes('/node_modules/')) return
          if (/\/node_modules\/(react|react-dom|scheduler)\//.test(normalized))
            return 'react-vendor'
          // Let Rollup keep maps, forms and portal dependencies with their routes.
          // A catch-all vendor chunk pulls every lazy route's libraries into startup.
        },
      },
    },
  },
})
