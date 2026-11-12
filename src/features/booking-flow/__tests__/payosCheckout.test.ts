import { afterEach, describe, expect, it, vi } from 'vitest'
import { validatePaymentUrl } from '../payosCheckout'

afterEach(() => {
  vi.useRealTimers()
  delete window.PayOSCheckout
  document.querySelectorAll('script[src*="cdn.payos.vn"]').forEach((script) => script.remove())
})

describe('PayOS checkout URL validation', () => {
  it('allows an official checkout or the same-origin server payment return', () => {
    expect(validatePaymentUrl('https://pay.payos.vn/web/link-123')).toBe('https://pay.payos.vn/web/link-123')
    expect(validatePaymentUrl('/payment/return?bookingId=51')).toBe(`${window.location.origin}/payment/return?bookingId=51`)
  })
  it.each([
    null, undefined, {}, '', 'javascript:alert(1)', 'http://pay.payos.vn/web/123',
    'https://pay.payos.vn.attacker.example/web/123', 'https://attacker.payos.vn/web/123',
    'https://user:password@pay.payos.vn/web/123', 'https://pay.payos.vn/other/path', '/unrelated',
  ])('rejects unsafe or malformed response %j', (value) => {
    expect(() => validatePaymentUrl(value)).toThrow()
  })
})

describe('PayOS official SDK loader', () => {
  it('shares a single script load, validates the SDK and can retry a failed load', async () => {
    vi.resetModules()
    const { loadPayOS } = await import('../payosCheckout')
    const first = loadPayOS()
    const rejected = expect(first).rejects.toThrow(/Không tải được/)
    expect(loadPayOS()).toBe(first)
    const script = document.querySelector<HTMLScriptElement>('script[src*="cdn.payos.vn"]')!
    script.dispatchEvent(new Event('error'))
    await rejected
    expect(script.isConnected).toBe(false)

    const retry = loadPayOS()
    const nextScript = document.querySelector<HTMLScriptElement>('script[src*="cdn.payos.vn"]')!
    const sdk = { usePayOS: vi.fn() }
    window.PayOSCheckout = sdk
    nextScript.dispatchEvent(new Event('load'))
    await expect(retry).resolves.toBe(sdk)
    await expect(loadPayOS()).resolves.toBe(sdk)
  })

  it('fails after 15 seconds instead of waiting forever for a blocked CDN', async () => {
    vi.resetModules()
    vi.useFakeTimers()
    const { loadPayOS } = await import('../payosCheckout')
    const promise = loadPayOS()
    const rejected = expect(promise).rejects.toThrow(/Không tải được/)
    await vi.advanceTimersByTimeAsync(15000)
    await rejected
    expect(document.querySelector('script[src*="cdn.payos.vn"]')).toBeNull()
  })
})
