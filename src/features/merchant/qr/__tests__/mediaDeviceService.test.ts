import { describe, it, expect, vi, afterEach } from 'vitest'
import {
  checkCameraSecurityStatus,
  parseCameraError,
  isTorchSupported,
} from '../services/mediaDeviceService'

describe('mediaDeviceService (SP-S3-INT-04)', () => {
  const originalIsSecureContext = window.isSecureContext
  const originalMediaDevices = navigator.mediaDevices

  afterEach(() => {
    Object.defineProperty(window, 'isSecureContext', {
      value: originalIsSecureContext,
      configurable: true,
      writable: true,
    })
    Object.defineProperty(navigator, 'mediaDevices', {
      value: originalMediaDevices,
      configurable: true,
      writable: true,
    })
  })

  it('detects insecure context on mobile LAN HTTP and returns reason INSECURE_CONTEXT', () => {
    Object.defineProperty(window, 'isSecureContext', {
      value: false,
      configurable: true,
    })

    const status = checkCameraSecurityStatus()
    expect(status.isSecureContext).toBe(false)
    expect(status.isSupported).toBe(false)
    expect(status.reason).toBe('INSECURE_CONTEXT')
  })

  it('detects secure context with mediaDevices and returns reason OK', () => {
    Object.defineProperty(window, 'isSecureContext', {
      value: true,
      configurable: true,
    })
    Object.defineProperty(navigator, 'mediaDevices', {
      value: { getUserMedia: vi.fn() },
      configurable: true,
    })

    const status = checkCameraSecurityStatus()
    expect(status.isSecureContext).toBe(true)
    expect(status.hasMediaDevices).toBe(true)
    expect(status.isSupported).toBe(true)
    expect(status.reason).toBe('OK')
  })

  it('detects missing mediaDevices and returns NO_MEDIA_DEVICES', () => {
    Object.defineProperty(window, 'isSecureContext', {
      value: true,
      configurable: true,
    })
    Object.defineProperty(navigator, 'mediaDevices', {
      value: undefined,
      configurable: true,
    })

    const status = checkCameraSecurityStatus()
    expect(status.isSecureContext).toBe(true)
    expect(status.hasMediaDevices).toBe(false)
    expect(status.isSupported).toBe(false)
    expect(status.reason).toBe('NO_MEDIA_DEVICES')
  })

  it('correctly maps NotAllowedError to PERMISSION_DENIED with actionable advice', () => {
    const error = new Error('Permission denied by user')
    error.name = 'NotAllowedError'

    const parsed = parseCameraError(error)
    expect(parsed.type).toBe('PERMISSION_DENIED')
    expect(parsed.title).toContain('từ chối')
    expect(parsed.canRetry).toBe(true)
  })

  it('correctly maps NotFoundError to NOT_FOUND with manual code fallback hint', () => {
    const error = new Error('Requested device not found')
    error.name = 'NotFoundError'

    const parsed = parseCameraError(error)
    expect(parsed.type).toBe('NOT_FOUND')
    expect(parsed.canRetry).toBe(false)
  })

  it('correctly maps SecurityError to INSECURE_CONTEXT mentioning HTTPS', () => {
    const error = new Error('Only secure origins are allowed')
    error.name = 'SecurityError'

    const parsed = parseCameraError(error)
    expect(parsed.type).toBe('INSECURE_CONTEXT')
    expect(parsed.message).toContain('HTTPS')
    expect(parsed.canRetry).toBe(false)
  })

  it('correctly maps insecure context error messages to INSECURE_CONTEXT', () => {
    const error = new Error('Insecure context on mobile')

    const parsed = parseCameraError(error)
    expect(parsed.type).toBe('INSECURE_CONTEXT')
    expect(parsed.title).toContain('HTTPS')
    expect(parsed.canRetry).toBe(false)
  })

  it('correctly detects torch capabilities', () => {
    expect(isTorchSupported({ torch: true } as unknown as MediaTrackCapabilities)).toBe(true)
    expect(isTorchSupported({ torch: false } as unknown as MediaTrackCapabilities)).toBe(false)
    expect(isTorchSupported(undefined)).toBe(false)
  })
})
