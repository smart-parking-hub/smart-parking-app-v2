import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'

const hasBrowserImageCompression = fs.existsSync(
  path.resolve(__dirname, 'node_modules/browser-image-compression')
)

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      ...(!hasBrowserImageCompression
        ? { 'browser-image-compression': path.resolve(__dirname, './src/shared/utils/browserImageCompressionFallback.ts') }
        : {}),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
})
