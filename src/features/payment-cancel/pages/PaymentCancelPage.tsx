import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import type { PendingTicketDto } from '../types/paymentCancelTypes'
import {
  fallbackPendingTicket,
  fetchPendingTicketApi,
  repayDepositApi,
  confirmDemoDepositApi,
  releaseSlotApi,
} from '../api/paymentCancelApi'
import { CancelSessionHeaderTrack } from '../components/CancelSessionHeaderTrack'
import { CancelNoticeCard } from '../components/CancelNoticeCard'
import { CountdownHoldAlertBox } from '../components/CountdownHoldAlertBox'
import { PendingTicketSpecsCard } from '../components/PendingTicketSpecsCard'
import { TerminalBerthBlueprintCard } from '../components/TerminalBerthBlueprintCard'
import { CancelActionBar } from '../components/CancelActionBar'
import { CancelSupportGrid } from '../components/CancelSupportGrid'
import { PaymentCancelSkeleton } from '../components/PaymentCancelSkeleton'

const PENDING_BOOKING_KEY = 'payos.pendingBookingId'

export function PaymentCancelPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [ticket, setTicket] = useState<PendingTicketDto>(fallbackPendingTicket)
  const [remainingSeconds, setRemainingSeconds] = useState(fallbackPendingTicket.initialRemainingSeconds)
  const [isRepaying, setIsRepaying] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const isExpired = remainingSeconds <= 0
  const mountedRef = useRef(true)

  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  const formatTime = useCallback((sec: number) => {
    const safeSec = Math.max(0, sec)
    const m = Math.floor(safeSec / 60)
    const s = safeSec % 60
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`
  }, [])

  // Load ticket data
  useEffect(() => {
    let isMounted = true
    const bookingIdRaw = searchParams.get('bookingId') || sessionStorage.getItem(PENDING_BOOKING_KEY)
    const bookingId = bookingIdRaw ? Number(bookingIdRaw) : undefined

    if (!bookingId) {
      return
    }

    const loadData = async () => {
      try {
        setLoading(true)
        const data = await fetchPendingTicketApi(bookingId)
        if (isMounted) {
          setTicket(data)
          setRemainingSeconds(data.initialRemainingSeconds)
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    void loadData()
    return () => {
      isMounted = false
    }
  }, [searchParams])

  // Countdown timer interval
  useEffect(() => {
    if (remainingSeconds <= 0) return

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [remainingSeconds])

  // Repay via VietQR PayOS
  const handleRepay = async () => {
    setIsRepaying(true)
    try {
      const res = await repayDepositApi(ticket.bookingId)
      if (res.checkoutUrl) {
        setToastMessage(`Đang kết nối lại PayOS cho đơn ${ticket.bookingCode}...`)
        setTimeout(() => {
          if (typeof window !== 'undefined' && window.location) {
            window.location.href = res.checkoutUrl
          }
        }, 800)
      }
    } finally {
      setTimeout(() => { if (mountedRef.current) setIsRepaying(false) }, 1200)
    }
  }

  // Sandbox demo deposit bypass
  const handleSandboxConfirm = async () => {
    const res = await confirmDemoDepositApi(ticket.bookingId)
    sessionStorage.removeItem(PENDING_BOOKING_KEY)
    setToastMessage(res.message)
    setTimeout(() => {
      navigate('/bookings')
    }, 1000)
  }

  // Release slot early
  const handleReleaseSlot = async () => {
    const res = await releaseSlotApi(ticket.bookingId)
    sessionStorage.removeItem(PENDING_BOOKING_KEY)
    setToastMessage(res.message)
    setTimeout(() => {
      navigate('/bookings')
    }, 1000)
  }

  if (loading) {
    return (
      <div className="w-full bg-slate-50 min-h-[calc(100vh-140px)]">
        <PaymentCancelSkeleton />
      </div>
    )
  }

  return (
    <div className="w-full bg-slate-50 min-h-[calc(100vh-140px)] py-6 sm:py-8 lg:py-10">
      <main className="max-w-[860px] mx-auto px-4 sm:px-6 flex flex-col gap-6">
        {/* Toast Feedback */}
        {toastMessage && (
          <div
            role="alert"
            className="p-4 bg-slate-900 text-white rounded-xl border border-slate-700 shadow-lg text-xs sm:text-sm font-mono flex items-center justify-between"
          >
            <span>{toastMessage}</span>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white ml-2 text-xs uppercase"
            >
              Đóng
            </button>
          </div>
        )}

        {/* 1. Session Status Breadcrumb Track */}
        <CancelSessionHeaderTrack sessionCode={ticket.sessionCode} />

        {/* 2. Main Cancel Notice Card */}
        <CancelNoticeCard />

        {/* 3. Countdown Hold Alert Box */}
        <CountdownHoldAlertBox
          remainingSeconds={remainingSeconds}
          totalSeconds={ticket.totalHoldSeconds}
          berthCode={ticket.berthCode}
          parkingLotName={ticket.parkingLotName}
        />

        {/* 4. Reservation Manifest Split View (7 cols + 5 cols) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <PendingTicketSpecsCard ticket={ticket} />
          <TerminalBerthBlueprintCard
            spotsMatrix={ticket.spotsMatrix}
            entryGateLane={ticket.entryGateLane}
            shorePowerAvailable={ticket.shorePowerAvailable}
            waitingNextVehiclePlate={ticket.waitingNextVehiclePlate}
            heldSpotCode="C-114"
          />
        </div>

        {/* 5. Action Buttons Bar */}
        <CancelActionBar
          remainingTimeFormatted={formatTime(remainingSeconds)}
          isExpired={isExpired}
          isRepaying={isRepaying}
          onRepay={handleRepay}
          onSandboxConfirm={handleSandboxConfirm}
          onReleaseSlot={handleReleaseSlot}
        />

        {/* 6. Support & Help Grid */}
        <CancelSupportGrid />
      </main>
    </div>
  )
}
