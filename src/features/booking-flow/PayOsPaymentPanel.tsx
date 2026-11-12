import { useEffect, useId, useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Notice, secondary } from '@/shared/components/Workspace'
import { errorMessage } from '@/shared/api/resources'
import { syncPayment } from './api'
import { loadPayOS, type PayOSCheckout } from './payosCheckout'

interface Props {
  bookingId: number
  checkoutUrl: string
  onClose: () => void
}

const paymentNotices: Record<string, string> = {
  PENDING: 'Chưa ghi nhận thanh toán. Nếu bạn vừa chuyển khoản, vui lòng đợi một lúc rồi kiểm tra lại.',
  SUCCESS: 'Máy chủ đã ghi nhận thanh toán. Đang cập nhật trạng thái đặt chỗ.',
  REQUIRES_REVIEW: 'Giao dịch cần đối soát. Chưa xác nhận check-in; vui lòng liên hệ hỗ trợ.',
  FAILED: 'Giao dịch thanh toán thất bại. Vui lòng kiểm tra trước khi thử lại.',
  REFUNDED: 'Giao dịch đã được hoàn tiền. Vui lòng kiểm tra trạng thái đặt chỗ.',
}

export function PayOsPaymentPanel({ bookingId, checkoutUrl, onClose }: Props) {
  const elementId = `payos-checkout-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const cache = useQueryClient()
  const [attempt, setAttempt] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const callbackRef = useRef<() => void>(() => {})
  const syncLock = useRef(false)
  const sync = useMutation({
    mutationFn: () => syncPayment({ bookingId }),
    retry: false,
    onSuccess: async (result) => {
      setNotice(paymentNotices[result.status] ?? 'Chưa xác định được trạng thái thanh toán. Vui lòng kiểm tra lại sau.')
      await Promise.all([
        cache.invalidateQueries({ queryKey: ['booking', bookingId] }),
        cache.invalidateQueries({ queryKey: ['real-bookings'] }),
        cache.invalidateQueries({ queryKey: ['parking-lots-search'] }),
      ])
    },
    onSettled: () => { syncLock.current = false },
  })
  const checkPayment = () => {
    if (syncLock.current) return
    syncLock.current = true
    setNotice(null)
    sync.mutate()
  }
  useEffect(() => {
    callbackRef.current = checkPayment
  })

  useEffect(() => {
    const checkWhenVisible = () => {
      if (document.visibilityState === 'visible') callbackRef.current()
    }
    const timer = window.setInterval(checkWhenVisible, 10000)
    window.addEventListener('focus', checkWhenVisible)
    document.addEventListener('visibilitychange', checkWhenVisible)
    return () => {
      window.clearInterval(timer)
      window.removeEventListener('focus', checkWhenVisible)
      document.removeEventListener('visibilitychange', checkWhenVisible)
    }
  }, [bookingId])

  useEffect(() => {
    let active = true
    let checkout: PayOSCheckout | undefined
    let frameTimeout: number | undefined
    let detachFrameEvents = () => {}
    const container = document.getElementById(elementId)
    setLoading(true)
    setLoadError(null)

    void loadPayOS().then((sdk) => {
      if (!active) return
      checkout = sdk.usePayOS({
        RETURN_URL: window.location.href,
        ELEMENT_ID: elementId,
        CHECKOUT_URL: checkoutUrl,
        embedded: true,
        onSuccess: () => {
          if (!active) return
          window.clearTimeout(frameTimeout)
          setLoading(false)
          callbackRef.current()
        },
        onCancel: () => {
          if (!active) return
          window.clearTimeout(frameTimeout)
          setLoading(false)
          setNotice('Bạn đã hủy bước thanh toán trên PayOS. Booking chưa được xác nhận thanh toán.')
        },
        onExit: () => {
          if (!active) return
          window.clearTimeout(frameTimeout)
          setNotice('Khung PayOS đã đóng. Bạn có thể mở lại hoặc kiểm tra giao dịch bên dưới.')
          setLoading(false)
        },
      })
      checkout.open()
      // The SDK creates the iframe synchronously; its contents remain owned by PayOS.
      const frame = container?.querySelector('iframe')
      if (!frame) throw new Error('PayOS chưa mở được khung thanh toán. Vui lòng thử lại.')
      // The SDK's /embedded/ + redirect_uri route rejects the local checkout.
      // The original server-issued hosted link also renders inside this frame.
      // Booking confirmation still comes from server sync/webhook, including
      // when the hosted page does not emit an SDK callback.
      frame.src = checkoutUrl
      frame.title = 'Mã QR thanh toán PayOS'
      frame.style.width = '100%'
      frame.style.height = '100%'
      frame.style.border = '0'
      const loaded = () => {
        if (!active) return
        window.clearTimeout(frameTimeout)
        setLoading(false)
      }
      const failed = () => {
        if (!active) return
        window.clearTimeout(frameTimeout)
        setLoading(false)
        setLoadError('Khung PayOS chưa tải được. Vui lòng thử lại hoặc mở trang PayOS.')
      }
      frame.addEventListener('load', loaded)
      frame.addEventListener('error', failed)
      frameTimeout = window.setTimeout(failed, 15000)
      detachFrameEvents = () => {
        frame.removeEventListener('load', loaded)
        frame.removeEventListener('error', failed)
      }
    }).catch((error: unknown) => {
      if (!active) return
      setLoading(false)
      setLoadError(errorMessage(error))
    })

    return () => {
      active = false
      window.clearTimeout(frameTimeout)
      detachFrameEvents()
      const currentContainer = document.getElementById(elementId) ?? container
      if (currentContainer?.querySelector('iframe')) checkout?.exit()
      currentContainer?.replaceChildren()
    }
  }, [attempt, bookingId, checkoutUrl, elementId])

  return (
    <section aria-label="Thanh toán PayOS" className="min-w-0 space-y-4 rounded-2xl border border-brand-border bg-white p-3 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-sora text-lg font-semibold">Quét mã QR để thanh toán</h3>
          <p className="mt-1 text-sm text-brand-muted">Dùng ứng dụng ngân hàng quét mã trong khung PayOS. Trạng thái thanh toán được xác nhận từ máy chủ.</p>
        </div>
        <button type="button" className={secondary} onClick={onClose}>Đóng QR</button>
      </div>
      {loading && <p role="status">Đang tải khung QR PayOS…</p>}
      {loadError && <Notice error>{loadError}</Notice>}
      <div id={elementId} className={loadError ? 'hidden' : 'h-[650px] w-full min-w-0 overflow-hidden rounded-xl'} />
      {notice && <p role="status" className="text-sm text-brand-muted">{notice}</p>}
      {sync.isError && <Notice error>{errorMessage(sync.error)}</Notice>}
      <div className="flex flex-wrap gap-3">
        <button type="button" className={secondary} disabled={sync.isPending} onClick={checkPayment}>
          {sync.isPending ? 'Đang kiểm tra giao dịch…' : 'Kiểm tra trạng thái thanh toán'}
        </button>
        <button type="button" className={secondary} disabled={loading} onClick={() => setAttempt((value) => value + 1)}>
          {loadError ? 'Thử tải lại QR' : 'Mở lại khung QR'}
        </button>
        <a className={secondary} href={checkoutUrl} target="_blank" rel="noopener noreferrer">Mở trang PayOS</a>
      </div>
      <p className="text-sm text-brand-muted">Đóng QR không hủy booking. Nếu đã chuyển khoản nhưng chưa thấy xác nhận, hãy kiểm tra lại giao dịch trước khi thanh toán tiếp.</p>
    </section>
  )
}
