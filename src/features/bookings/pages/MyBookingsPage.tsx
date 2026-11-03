import { useState, useMemo, useRef } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  BookingItemDto,
  FilterStatusTab,
} from '../types/bookingTypes'
import {
  fetchMyBookings,
  fallbackBookingsList,
  cancelBookingApi,
  submitReviewApi,
} from '../api/bookingApi'
import { exportSvgToPng } from '../utils/qrExportUtil'
import { BookingsCommandToolbar } from '../components/BookingsCommandToolbar'
import { BookingMasterList } from '../components/BookingMasterList'
import { BookingDetailView } from '../components/BookingDetailView'
import { CancelBookingModal } from '../components/CancelBookingModal'
import { ReviewBookingModal } from '../components/ReviewBookingModal'
import { PayOsCheckoutModal } from '../components/PayOsCheckoutModal'
import { BookingsSkeleton } from '../components/BookingsSkeleton'

export function MyBookingsPage() {
  const queryClient = useQueryClient()
  const qrSvgRef = useRef<SVGSVGElement | null>(null)

  const [activeTab, setActiveTab] = useState<FilterStatusTab>('ALL')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedBookingId, setSelectedBookingId] = useState<number>(1)

  // Modals state
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [isPayOsModalOpen, setIsPayOsModalOpen] = useState(false)
  const [payOsType, setPayOsType] = useState<'DEPOSIT' | 'FINAL'>('FINAL')
  const [isDownloadingQr, setIsDownloadingQr] = useState(false)

  // Fetch bookings with rich fallback
  const {
    data: bookings = fallbackBookingsList,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['my-bookings-list'],
    queryFn: fetchMyBookings,
    initialData: fallbackBookingsList,
    staleTime: 30000,
  })

  // Calculate tab counts
  const counts = useMemo(() => {
    let all = 0
    let active = 0
    let pending = 0
    let completed = 0
    let cancelled = 0

    bookings.forEach((b) => {
      all++
      if (
        b.status === 'PARKING' ||
        b.status === 'PENDING_CHECKIN' ||
        b.status === 'OVERTIME' ||
        b.status === 'AWAITING_FINAL_PAYMENT'
      ) {
        active++
      } else if (b.status === 'PENDING_PAYMENT') {
        pending++
      } else if (b.status === 'COMPLETED' || b.status === 'REVIEWED') {
        completed++
      } else if (b.status === 'CANCELLED' || b.status === 'EXPIRED') {
        cancelled++
      }
    })

    return { all, active, pending, completed, cancelled }
  }, [bookings])

  // Filter list by tab & search query
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // Tab filter
      if (activeTab === 'ACTIVE') {
        const isActive =
          b.status === 'PARKING' ||
          b.status === 'PENDING_CHECKIN' ||
          b.status === 'OVERTIME' ||
          b.status === 'AWAITING_FINAL_PAYMENT'
        if (!isActive) return false
      } else if (activeTab === 'PENDING_PAYMENT') {
        if (b.status !== 'PENDING_PAYMENT') return false
      } else if (activeTab === 'COMPLETED') {
        if (b.status !== 'COMPLETED' && b.status !== 'REVIEWED') return false
      } else if (activeTab === 'CANCELLED') {
        if (b.status !== 'CANCELLED' && b.status !== 'EXPIRED') return false
      }

      // Search keyword filter
      if (searchKeyword.trim()) {
        const q = searchKeyword.toLowerCase().trim()
        const matchCode = b.bookingCode.toLowerCase().includes(q)
        const matchLot = b.parkingLotName.toLowerCase().includes(q)
        const matchPlate = b.vehiclePlate.toLowerCase().includes(q)
        if (!matchCode && !matchLot && !matchPlate) return false
      }

      return true
    })
  }, [bookings, activeTab, searchKeyword])

  // Current selected booking:
  // Prefer selectedBookingId if it's in filteredBookings, otherwise fall back to filteredBookings[0]
  const selectedBooking = useMemo(() => {
    const inFiltered = filteredBookings.find((b) => b.id === selectedBookingId)
    if (inFiltered) return inFiltered
    return filteredBookings[0] || bookings[0]
  }, [bookings, selectedBookingId, filteredBookings])

  // Handlers
  const handleDownloadQr = async () => {
    if (!qrSvgRef.current) return
    setIsDownloadingQr(true)
    await exportSvgToPng(qrSvgRef.current, `ve-xe-${selectedBooking.bookingCode}`)
    setIsDownloadingQr(false)
  }

  const handleExportInvoice = () => {
    alert(
      `ĐÃ GỬI HÓA ĐƠN ĐIỆN TỬ VAT CHO ĐƠN ${selectedBooking.bookingCode} VÀO EMAIL TÀI XẾ.`
    )
  }

  const handlePayCashAtGate = () => {
    alert(
      `Vui lòng xuất trình mã QR ${selectedBooking.gateToken} cho nhân viên soát vé tại làn xuất bãi.`
    )
  }

  const handleOpenMapDirections = () => {
    const query = encodeURIComponent(selectedBooking.parkingLotAddress)
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank')
  }

  const handleConfirmCancel = async (reason: string, bankAccount?: string) => {
    await cancelBookingApi({
      bookingId: selectedBooking.id,
      reason,
      bankAccount,
    })
    queryClient.setQueryData<BookingItemDto[]>(['my-bookings-list'], (prev) =>
      (prev || []).map((item) =>
        item.id === selectedBooking.id
          ? {
              ...item,
              status: 'CANCELLED',
              statusBadgeLabel: 'ĐÃ HỦY VÉ',
            }
          : item
      )
    )
    alert('HỦY ĐẶT CHỖ THÀNH CÔNG! Tiền cọc sẽ được xử lý hoàn tiền theo quy định.')
  }

  const handleSubmitReview = async (rating: number, comment: string) => {
    await submitReviewApi({
      bookingId: selectedBooking.id,
      rating,
      comment,
    })
    queryClient.setQueryData<BookingItemDto[]>(['my-bookings-list'], (prev) =>
      (prev || []).map((item) =>
        item.id === selectedBooking.id
          ? {
              ...item,
              status: 'REVIEWED',
              statusBadgeLabel: 'ĐÃ ĐÁNH GIÁ',
            }
          : item
      )
    )
    alert('CẢM ƠN BẠN ĐÃ ĐÁNH GIÁ CHẤT LƯỢNG BÃI XE!')
  }

  const handlePaymentCompleted = (bookingId: number, type: 'DEPOSIT' | 'FINAL') => {
    queryClient.setQueryData<BookingItemDto[]>(['my-bookings-list'], (prev) =>
      (prev || []).map((item) => {
        if (item.id !== bookingId) return item
        if (type === 'DEPOSIT') {
          return {
            ...item,
            status: 'PARKING',
            statusBadgeLabel: 'ĐANG ĐỖ TẠI BÃI',
            depositPaid: 100000,
          }
        }
        return {
          ...item,
          status: 'COMPLETED',
          statusBadgeLabel: 'HOÀN TẤT - ĐÃ XUẤT HÓA ĐƠN',
          remainingFinalPayment: 0,
        }
      })
    )
  }

  if (isLoading && !bookings) {
    return <BookingsSkeleton />
  }

  return (
    <div className="w-full bg-[#f8f9ff] min-h-[calc(100vh-140px)]">
      {/* Top Command Toolbar */}
      <BookingsCommandToolbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchKeyword={searchKeyword}
        onSearchChange={setSearchKeyword}
        counts={counts}
        activeVehiclePlate={selectedBooking?.vehiclePlate || '51D-894.12'}
      />

      {/* Master-Detail 2-Column Workspace */}
      <div className="max-w-[1280px] w-full mx-auto px-4 lg:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Master List */}
          <BookingMasterList
            bookings={filteredBookings}
            selectedBookingId={selectedBooking?.id || 1}
            onSelectBooking={(b) => setSelectedBookingId(b.id)}
            onRefresh={() => refetch()}
            isRefreshing={isRefetching}
            onPayDepositQuick={(b) => {
              setSelectedBookingId(b.id)
              setPayOsType('DEPOSIT')
              setIsPayOsModalOpen(true)
            }}
          />

          {/* Right Column: Detail View */}
          {selectedBooking && (
            <BookingDetailView
              ref={qrSvgRef}
              booking={selectedBooking}
              onDownloadQr={handleDownloadQr}
              isDownloadingQr={isDownloadingQr}
              onExportInvoice={handleExportInvoice}
              onPayFinal={() => {
                setPayOsType('FINAL')
                setIsPayOsModalOpen(true)
              }}
              onPayDeposit={() => {
                setPayOsType('DEPOSIT')
                setIsPayOsModalOpen(true)
              }}
              onCancelBooking={() => setIsCancelModalOpen(true)}
              onOpenReview={() => setIsReviewModalOpen(true)}
              onPayCashAtGate={handlePayCashAtGate}
              onOpenMapDirections={handleOpenMapDirections}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <CancelBookingModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        booking={selectedBooking}
        onConfirmCancel={handleConfirmCancel}
      />

      <ReviewBookingModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        booking={selectedBooking}
        onSubmitReview={handleSubmitReview}
      />

      <PayOsCheckoutModal
        isOpen={isPayOsModalOpen}
        onClose={() => setIsPayOsModalOpen(false)}
        booking={selectedBooking}
        paymentType={payOsType}
        onPaymentCompleted={handlePaymentCompleted}
      />
    </div>
  )
}
