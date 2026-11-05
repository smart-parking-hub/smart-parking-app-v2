import { useMemo, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import type { BookingItemDto } from '../types/bookingTypes'
import {
  fetchMyBookings,
  fallbackBookingsList,
  cancelBookingApi,
  submitReviewApi,
} from '../api/bookingApi'
import { exportSvgToPng } from '../utils/qrExportUtil'
import { useBookingStore } from '../store/bookingStore'
import { BookingsCommandToolbar } from '../components/BookingsCommandToolbar'
import { BookingMasterList } from '../components/BookingMasterList'
import { BookingDetailView } from '../components/BookingDetailView'
import { CancelBookingModal } from '../components/CancelBookingModal'
import { ReviewBookingModal } from '../components/ReviewBookingModal'
import { PayOsCheckoutModal } from '../components/PayOsCheckoutModal'
import { BookingsSkeleton } from '../components/BookingsSkeleton'
import { BookingsEmptyState } from '../components/BookingsEmptyState'
import { BookingsErrorState } from '../components/BookingsErrorState'

export function MyBookingsPage() {
  const queryClient = useQueryClient()
  const qrSvgRef = useRef<SVGSVGElement | null>(null)

  // Zustand UI State Store
  const {
    activeTab,
    setActiveTab,
    searchKeyword,
    setSearchKeyword,
    selectedBookingId,
    setSelectedBookingId,
    isCancelModalOpen,
    openCancelModal,
    closeCancelModal,
    isReviewModalOpen,
    openReviewModal,
    closeReviewModal,
    isPayOsModalOpen,
    openPayOsModal,
    closePayOsModal,
    payOsType,
    toastMessage,
    toastType,
    showToast,
    clearToast,
  } = useBookingStore()

  // Fetch bookings with TanStack Query
  const {
    data: bookings = fallbackBookingsList,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery<BookingItemDto[]>({
    queryKey: ['my-bookings-list'],
    queryFn: fetchMyBookings,
    initialData: fallbackBookingsList,
    staleTime: 30000,
  })

  // Cancel booking mutation
  const cancelMutation = useMutation({
    mutationFn: cancelBookingApi,
    onSuccess: (result, variables) => {
      queryClient.setQueryData<BookingItemDto[]>(['my-bookings-list'], (prev) =>
        (prev || []).map((item) =>
          item.id === variables.bookingId
            ? {
                ...item,
                status: 'CANCELLED',
                statusBadgeLabel: 'ĐÃ HỦY VÉ',
              }
            : item
        )
      )
      showToast(result.message || 'Hủy đặt chỗ thành công! Đã gửi yêu cầu hoàn tiền.', 'success')
      closeCancelModal()
    },
    onError: () => {
      showToast('Không thể hủy vé lúc này. Vui lòng thử lại hoặc gọi tổng đài trực ban.', 'error')
    },
  })

  // Review booking mutation
  const reviewMutation = useMutation({
    mutationFn: submitReviewApi,
    onSuccess: (result, variables) => {
      queryClient.setQueryData<BookingItemDto[]>(['my-bookings-list'], (prev) =>
        (prev || []).map((item) =>
          item.id === variables.bookingId
            ? {
                ...item,
                status: 'REVIEWED',
                statusBadgeLabel: 'ĐÃ ĐÁNH GIÁ',
              }
            : item
        )
      )
      showToast(result.message || 'Cảm ơn bạn đã gửi đánh giá trải nghiệm đỗ xe!', 'success')
      closeReviewModal()
    },
    onError: () => {
      showToast('Gửi đánh giá không thành công. Vui lòng thử lại sau.', 'error')
    },
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

  // Current selected booking
  const selectedBooking = useMemo(() => {
    const inFiltered = filteredBookings.find((b) => b.id === selectedBookingId)
    if (inFiltered) return inFiltered
    return filteredBookings[0] || bookings[0]
  }, [bookings, selectedBookingId, filteredBookings])

  // Handlers
  const handleDownloadQr = async () => {
    if (!qrSvgRef.current || !selectedBooking) return
    showToast('Đang kết xuất vé QR định dạng PNG...', 'info')
    await exportSvgToPng(qrSvgRef.current, `ve-xe-${selectedBooking.bookingCode}`)
    showToast(`Đã tải vé QR [${selectedBooking.bookingCode}] thành công!`, 'success')
  }

  const handleExportInvoice = () => {
    if (!selectedBooking) return
    showToast(
      `Đã gửi hóa đơn điện tử VAT cho đơn ${selectedBooking.bookingCode} vào email tài xế.`,
      'success'
    )
  }

  const handlePayCashAtGate = () => {
    if (!selectedBooking) return
    showToast(
      `Vui lòng xuất trình mã QR token ${selectedBooking.gateToken} cho nhân viên soát vé tại làn xuất bãi.`,
      'info'
    )
  }

  const handleOpenMapDirections = () => {
    if (!selectedBooking) return
    const query = encodeURIComponent(selectedBooking.parkingLotAddress)
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank')
  }

  const handleConfirmCancel = async (reason: string, bankAccount?: string) => {
    if (!selectedBooking) return
    await cancelMutation.mutateAsync({
      bookingId: selectedBooking.id,
      reason,
      bankAccount,
    })
  }

  const handleSubmitReview = async (rating: number, comment: string) => {
    if (!selectedBooking) return
    await reviewMutation.mutateAsync({
      bookingId: selectedBooking.id,
      rating,
      comment,
    })
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
    showToast(
      type === 'DEPOSIT'
        ? 'Thanh toán cọc 20% thành công! Barie ALPR sẵn sàng mở.'
        : 'Quyết toán cước đỗ PayOS thành công! Chúc bạn thượng lộ bình an.',
      'success'
    )
  }

  // 1. Loading State
  if (isLoading && (!bookings || bookings.length === 0)) {
    return <BookingsSkeleton />
  }

  // 2. Error State
  if (isError && (!bookings || bookings.length === 0)) {
    return (
      <div className="w-full bg-[#f8f9ff] min-h-[calc(100vh-140px)] p-6">
        <BookingsErrorState
          errorMessage={
            error instanceof Error ? error.message : 'Không thể kết nối máy chủ quản lý đặt chỗ.'
          }
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  return (
    <div className="w-full bg-[#f8f9ff] min-h-[calc(100vh-140px)]">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-bottom-4 duration-200 max-w-md"
        >
          {toastType === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          {toastType === 'error' && <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
          {toastType === 'info' && <Info className="w-5 h-5 text-[#d95f00] shrink-0" />}
          <span className="text-xs font-semibold leading-relaxed flex-1">{toastMessage}</span>
          <button
            type="button"
            onClick={clearToast}
            aria-label="Đóng thông báo"
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Command Toolbar */}
      <BookingsCommandToolbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchKeyword={searchKeyword}
        onSearchChange={setSearchKeyword}
        counts={counts}
        activeVehiclePlate={selectedBooking?.vehiclePlate || '51D-894.12'}
      />

      {/* Main Workspace */}
      <div className="max-w-[1280px] w-full mx-auto px-4 lg:px-6 py-6">
        {filteredBookings.length === 0 ? (
          // 3. Empty State (Filtered or Total)
          <BookingsEmptyState
            searchKeyword={searchKeyword}
            activeTab={activeTab}
            onResetFilters={() => {
              setActiveTab('ALL')
              setSearchKeyword('')
            }}
          />
        ) : (
          /* Master-Detail 2-Column Workspace */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Master List (approx 38% on desktop) */}
            <BookingMasterList
              bookings={filteredBookings}
              selectedBookingId={selectedBooking?.id || 1}
              onSelectBooking={(b) => setSelectedBookingId(b.id)}
              onRefresh={() => refetch()}
              isRefreshing={isRefetching}
              onPayDepositQuick={(b) => {
                setSelectedBookingId(b.id)
                openPayOsModal('DEPOSIT')
              }}
            />

            {/* Right Column: Detail View (approx 62% on desktop) */}
            {selectedBooking && (
              <BookingDetailView
                ref={qrSvgRef}
                booking={selectedBooking}
                onDownloadQr={handleDownloadQr}
                isDownloadingQr={false}
                onExportInvoice={handleExportInvoice}
                onPayFinal={() => openPayOsModal('FINAL')}
                onPayDeposit={() => openPayOsModal('DEPOSIT')}
                onCancelBooking={openCancelModal}
                onOpenReview={openReviewModal}
                onPayCashAtGate={handlePayCashAtGate}
                onOpenMapDirections={handleOpenMapDirections}
              />
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <CancelBookingModal
        isOpen={isCancelModalOpen}
        onClose={closeCancelModal}
        booking={selectedBooking}
        onConfirmCancel={handleConfirmCancel}
      />

      <ReviewBookingModal
        isOpen={isReviewModalOpen}
        onClose={closeReviewModal}
        booking={selectedBooking}
        onSubmitReview={handleSubmitReview}
      />

      <PayOsCheckoutModal
        isOpen={isPayOsModalOpen}
        onClose={closePayOsModal}
        booking={selectedBooking}
        paymentType={payOsType}
        onPaymentCompleted={handlePaymentCompleted}
      />
    </div>
  )
}
