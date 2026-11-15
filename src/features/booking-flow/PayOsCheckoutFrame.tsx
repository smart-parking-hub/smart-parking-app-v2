import { useEffect, useId, useRef, useState } from 'react'
import { Notice } from '@/shared/components/Workspace'
import { errorMessage } from '@/shared/api/resources'
import { loadPayOS, type PayOSCheckout } from './payosCheckout'

interface Props {
  bookingId: number
  checkoutUrl: string
  onVerify: () => void
  onCancel: () => void
  onExit: () => void
}

/** Owns the SDK and frame only while a checkout is visible. */
export function PayOsCheckoutFrame(props: Props) {
  const { bookingId, checkoutUrl } = props
  const elementId = `payos-checkout-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const callbacks = useRef(props)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  useEffect(() => { callbacks.current = props })

  useEffect(() => {
    let active = true
    let finished = false
    let loadedOnce = false
    let checkout: PayOSCheckout | undefined
    let timeout: number | undefined
    let detach = () => {}
    const container = document.getElementById(elementId)
    const finish = (cancelled: boolean) => {
      if (!active || finished) return
      finished = true
      window.clearTimeout(timeout)
      if (cancelled) callbacks.current.onCancel()
      else callbacks.current.onExit()
    }
    const verify = () => {
      if (!active || finished) return
      window.clearTimeout(timeout)
      setLoading(false)
      callbacks.current.onVerify()
    }

    void loadPayOS().then(sdk => {
      if (!active) return
      checkout = sdk.usePayOS({
        RETURN_URL: window.location.href, ELEMENT_ID: elementId,
        CHECKOUT_URL: checkoutUrl, embedded: true,
        onSuccess: verify, onCancel: () => finish(true), onExit: () => finish(false),
      })
      checkout.open()
      const frame = container?.querySelector('iframe')
      if (!frame) throw new Error('PayOS chưa mở được khung thanh toán. Vui lòng thử lại.')
      // Retain the verified hosted fallback; /embedded/ rejects existing local links.
      frame.src = checkoutUrl
      frame.title = 'Mã QR thanh toán PayOS'
      frame.style.width = '100%'
      frame.style.height = '100%'
      frame.style.border = '0'
      const loaded = () => {
        if (!active || finished) return
        const navigated = loadedOnce
        loadedOnce = true
        window.clearTimeout(timeout)
        setLoading(false)
        try {
          const url = new URL(frame.contentWindow!.location.href)
          if (url.origin === window.location.origin && Number(url.searchParams.get('bookingId')) === bookingId) {
            if (url.pathname === '/payment/cancel') { finish(true); return }
            if (url.pathname === '/payment/return') { verify(); return }
          }
        } catch {
          // A hosted PayOS page is cross-origin; only our return pages are readable.
        }
        // A blocked local redirect can load Chrome's error document instead of
        // our return page. Stop showing the navigated frame even if server sync
        // is still pending; closing a frame never declares a payment successful.
        if (navigated) finish(false)
      }
      const receive = (event: MessageEvent<unknown>) => {
        if (!active || finished || event.origin !== window.location.origin || event.source !== frame.contentWindow) return
        const data = event.data
        if (!data || typeof data !== 'object' || !('type' in data) || data.type !== 'smartparking:payos-return'
          || !('bookingId' in data) || data.bookingId !== bookingId || !('cancelled' in data)
          || typeof data.cancelled !== 'boolean') return
        if (data.cancelled) finish(true)
        else verify()
      }
      const failed = () => {
        if (!active || finished) return
        window.clearTimeout(timeout)
        setLoading(false)
        setLoadError('Khung PayOS chưa tải được. Vui lòng thử lại hoặc mở trang PayOS.')
      }
      frame.addEventListener('load', loaded)
      frame.addEventListener('error', failed)
      window.addEventListener('message', receive)
      timeout = window.setTimeout(failed, 15000)
      detach = () => {
        frame.removeEventListener('load', loaded)
        frame.removeEventListener('error', failed)
        window.removeEventListener('message', receive)
      }
    }).catch((error: unknown) => {
      if (!active || finished) return
      setLoading(false)
      setLoadError(errorMessage(error))
    })
    return () => {
      active = false
      window.clearTimeout(timeout)
      detach()
      if (container?.querySelector('iframe')) checkout?.exit()
      container?.replaceChildren()
    }
  }, [bookingId, checkoutUrl, elementId])

  return <>
    {loading && <p role="status">Đang tải khung QR PayOS…</p>}
    {loadError && <Notice error>{loadError}</Notice>}
    <div id={elementId} className={loadError ? 'hidden' : 'h-[min(560px,65dvh)] min-h-[320px] w-full min-w-0 overflow-hidden rounded-xl'} />
  </>
}
