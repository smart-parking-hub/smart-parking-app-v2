import { describe, it, expect } from 'vitest'
import { formatBytes, isSupportedImageFile } from '../imageCompressionUtil'

describe('imageCompressionUtil', () => {
  describe('formatBytes', () => {
    it('formats bytes correctly', () => {
      expect(formatBytes(0)).toBe('0 B')
      expect(formatBytes(1024)).toBe('1 KB')
      expect(formatBytes(1536)).toBe('1.5 KB')
      expect(formatBytes(1024 * 1024)).toBe('1 MB')
      expect(formatBytes(2.5 * 1024 * 1024)).toBe('2.5 MB')
    })
  })

  describe('isSupportedImageFile', () => {
    it('accepts valid mime types', () => {
      const jpg = new File(['dummy'], 'photo.jpg', { type: 'image/jpeg' })
      const png = new File(['dummy'], 'logo.png', { type: 'image/png' })
      const webp = new File(['dummy'], 'hero.webp', { type: 'image/webp' })
      const heic = new File(['dummy'], 'iphone.heic', { type: 'image/heic' })

      expect(isSupportedImageFile(jpg)).toBe(true)
      expect(isSupportedImageFile(png)).toBe(true)
      expect(isSupportedImageFile(webp)).toBe(true)
      expect(isSupportedImageFile(heic)).toBe(true)
    })

    it('accepts valid file extension if mime type is missing', () => {
      const file = new File(['dummy'], 'photo.HEIC', { type: '' })
      expect(isSupportedImageFile(file)).toBe(true)
    })

    it('rejects unsupported files like pdf or exe', () => {
      const pdf = new File(['dummy'], 'doc.pdf', { type: 'application/pdf' })
      const exe = new File(['dummy'], 'app.exe', { type: 'application/x-msdownload' })

      expect(isSupportedImageFile(pdf)).toBe(false)
      expect(isSupportedImageFile(exe)).toBe(false)
    })
  })
})
