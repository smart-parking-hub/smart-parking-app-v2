// Official browser SDK: https://payos.vn/docs/sdks/front-end/script-js/
export const PAYOS_SCRIPT_URL = 'https://cdn.payos.vn/payos-checkout/v1/stable/payos-initialize.js'
const PAYOS_ORIGINS = new Set([
  'https://pay.payos.vn',
  'https://next.pay.payos.vn',
  'https://dev.pay.payos.vn',
  'https://next.dev.pay.payos.vn',
])

export function validatePaymentUrl(value: unknown): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error('Máy chủ chưa trả về đường dẫn thanh toán hợp lệ.')
  }
  const url = new URL(value, window.location.origin)
  const hostedCheckout = PAYOS_ORIGINS.has(url.origin) && /^\/web\/[^/]+\/?$/.test(url.pathname)
  const paymentReturn = url.origin === window.location.origin && url.pathname === '/payment/return'
  if (url.username || url.password || (!hostedCheckout && !paymentReturn)) {
    throw new Error('Đường dẫn thanh toán không hợp lệ.')
  }
  return url.href
}

export interface PayOSConfig {
  RETURN_URL: string
  ELEMENT_ID: string
  CHECKOUT_URL: string
  embedded: boolean
  onSuccess: (event: unknown) => void
  onCancel: (event: unknown) => void
  onExit: (event: unknown) => void
}

export interface PayOSCheckout {
  open: () => void
  exit: () => void
}

export interface PayOSSdk {
  usePayOS: (config: PayOSConfig) => PayOSCheckout
}

declare global {
  interface Window {
    PayOSCheckout?: PayOSSdk
  }
}

let pendingLoad: Promise<PayOSSdk> | undefined

export function loadPayOS(): Promise<PayOSSdk> {
  if (typeof window.PayOSCheckout?.usePayOS === 'function') {
    return Promise.resolve(window.PayOSCheckout)
  }
  if (pendingLoad) return pendingLoad

  pendingLoad = new Promise<PayOSSdk>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = PAYOS_SCRIPT_URL
    script.async = true
    const cleanup = () => {
      window.clearTimeout(timeout)
      script.onload = null
      script.onerror = null
    }
    const fail = () => {
      cleanup()
      script.remove()
      reject(new Error('Không tải được khung thanh toán PayOS. Vui lòng thử lại hoặc mở trang PayOS.'))
    }
    const timeout = window.setTimeout(fail, 15000)
    script.onerror = fail
    script.onload = () => {
      cleanup()
      if (typeof window.PayOSCheckout?.usePayOS !== 'function') {
        script.remove()
        reject(new Error('Khung thanh toán PayOS chưa sẵn sàng. Vui lòng thử lại.'))
        return
      }
      resolve(window.PayOSCheckout)
    }
    document.head.appendChild(script)
  }).catch((error: unknown) => {
    pendingLoad = undefined
    throw error
  })
  return pendingLoad
}
