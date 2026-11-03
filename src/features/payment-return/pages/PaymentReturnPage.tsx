import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { PaymentSyncState, PaymentReturnManifestDto } from '../types/paymentReturnTypes'
import {
  fallbackReturnManifest,
  syncPayOSPaymentApi,
  confirmDemoDepositApi,
} from '../api/paymentReturnApi'
import { PayOsTelemetryStrip } from '../components/PayOsTelemetryStrip'
import { PaymentSuccessHero } from '../components/PaymentSuccessHero'
import { SpotLogisticsManifestCard } from '../components/SpotLogisticsManifestCard'
import { BarieQrPassCard } from '../components/BarieQrPassCard'
import { GateArrivalProtocolSection } from '../components/GateArrivalProtocolSection'
import { TerminalActionBar } from '../components/TerminalActionBar'
import { GateSupportHelpStrip } from '../components/GateSupportHelpStrip'
import { PaymentStatusResultState } from '../components/PaymentStatusResultState'
import { PaymentReturnSkeleton } from '../components/PaymentReturnSkeleton'

const PENDING_BOOKING_KEY = 'payos.pendingBookingId'

interface PaymentReturnPageProps {
  mode?: 'success' | 'cancel'
}

export function PaymentReturnPage({ mode = 'success' }: PaymentReturnPageProps) {
  const [searchParams] = useSearchParams()

  const [state, setState] = useState<PaymentSyncState>(mode === 'cancel' ? 'cancelled' : 'idle')
  const [manifest, setManifest] = useState<PaymentReturnManifestDto>(fallbackReturnManifest)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  const getBookingIdValue = useCallback((): number | undefined => {
    const raw = searchParams.get('bookingId') || sessionStorage.getItem(PENDING_BOOKING_KEY)
    const val = raw ? Number(raw) : undefined
    return Number.isFinite(val) ? val : undefined
  }, [searchParams])

  const handleConfirmDemo = useCallback(async (customBookingId?: number) => {
    const bId = customBookingId ?? getBookingIdValue()
    if (!bId) {
      setMessage('Không tìm thấy mã đặt chỗ (Booking ID) để xác nhận thanh toán demo.')
      return
    }
    setState('syncing')
    try {
      const result = await confirmDemoDepositApi({ bookingId: bId })
      setManifest(result)
      setState('success')
      setMessage('Thanh toán demo thành công. Booking đã chuyển sang PENDING_CHECKIN.')
      sessionStorage.removeItem(PENDING_BOOKING_KEY)
    } catch {
      setState('error')
      setMessage('Lỗi khi kích hoạt cọc demo.')
    } finally {
      setLoading(false)
    }
  }, [getBookingIdValue])

  const runSync = useCallback(async () => {
    const orderCodeRaw = searchParams.get('orderCode')
    const paymentLinkId = searchParams.get('id') || undefined
    const bookingIdValue = getBookingIdValue()
    const orderCode = orderCodeRaw ? Number(orderCodeRaw) : undefined
    const isSimulated = searchParams.get('simulated') === 'true'

    if (isSimulated && bookingIdValue) {
      await handleConfirmDemo(bookingIdValue)
      return
    }

    const payload = {
      orderCode: Number.isFinite(orderCode) ? orderCode : undefined,
      paymentLinkId,
      bookingId: bookingIdValue,
    }

    setState('syncing')
    try {
      const result = await syncPayOSPaymentApi(payload)
      if (result.status === 'PAID_VERIFIED' || result.status === 'SUCCESS') {
        setManifest(result)
        setState('success')
        setMessage('Đã ghi nhận thanh toán thành công. Booking đã sẵn sàng check-in.')
        sessionStorage.removeItem(PENDING_BOOKING_KEY)
      } else {
        setState('pending')
        setMessage(
          `Cổng PayOS chưa hoàn tất thanh toán (trạng thái: ${result.status}). Hãy bấm "Xác nhận thanh toán demo" để kích hoạt ngay.`
        )
      }
    } catch {
      setState('error')
      setMessage('Không thể đồng bộ với PayOS. Vui lòng thử lại hoặc bấm Xác nhận thanh toán demo.')
    } finally {
      setLoading(false)
    }
  }, [searchParams, getBookingIdValue, handleConfirmDemo])

  useEffect(() => {
    if (mode === 'cancel') {
      setState('cancelled')
      setMessage('Bạn đã hủy thanh toán trên cổng PayOS.')
      setLoading(false)
      return
    }

    const status = (searchParams.get('status') || searchParams.get('code') || '').toUpperCase()
    const cancelled = searchParams.get('cancel') === 'true'
    if (cancelled || status === 'CANCELLED') {
      setState('cancelled')
      setMessage('Thanh toán đã bị hủy trên cổng PayOS.')
      setLoading(false)
      return
    }

    void runSync()
  }, [mode, searchParams, runSync])

  const bookingIdValue = getBookingIdValue()

  if (loading && (state === 'idle' || state === 'syncing')) {
    return (
      <div className="w-full min-h-[calc(100vh-140px)] bg-slate-50">
        <PayOsTelemetryStrip latency="--.--s" status="SYNCING" />
        <PaymentReturnSkeleton />
      </div>
    )
  }

  if (state !== 'success') {
    const latencyMap: Record<string, string> = {
      cancelled: '0.10s',
      pending: '0.24s',
      error: '0.45s',
    }
    const statusMap: Record<string, string> = {
      cancelled: 'CANCELLED',
      pending: 'PENDING_RETRY',
      error: 'SYNC_FAILED',
    }

    return (
      <div className="w-full min-h-[calc(100vh-140px)] bg-slate-50">
        <PayOsTelemetryStrip
          latency={latencyMap[state] || '0.18s'}
          status={statusMap[state] || state.toUpperCase()}
        />
        <PaymentStatusResultState
          state={state}
          message={message}
          bookingId={bookingIdValue}
          onConfirmDemo={() => void handleConfirmDemo(bookingIdValue)}
          onRetrySync={() => void runSync()}
        />
      </div>
    )
  }

  return (
    <div className="w-full min-h-[calc(100vh-140px)] bg-slate-50">
      {/* PayOS Telemetry Strip */}
      <PayOsTelemetryStrip
        latency={manifest.syncLatencyText}
        status={manifest.status}
      />

      {/* Main Verification Hub Body */}
      <main className="max-w-[860px] mx-auto py-6 sm:py-8 lg:py-10 px-4 sm:px-6 flex flex-col gap-6">
        {/* Success Hero Banner */}
        <PaymentSuccessHero manifest={manifest} />

        {/* Spot Logistics Manifest (7 cols) + Barie QR Pass (5 cols) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <SpotLogisticsManifestCard manifest={manifest} />
          <BarieQrPassCard manifest={manifest} />
        </section>

        {/* 3-Step Gate Arrival SOP Protocol */}
        <GateArrivalProtocolSection
          vehiclePlate={manifest.vehiclePlate}
          berthCode={manifest.berthCode}
        />

        {/* Action Dispatch Bar */}
        <TerminalActionBar />

        {/* Instant Dispatcher Support Strip */}
        <GateSupportHelpStrip />
      </main>
    </div>
  )
}
