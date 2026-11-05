import { useQuery } from '@tanstack/react-query'
import { AlertCircle, RefreshCw, Search, CheckCircle, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { fetchDriverDashboardData } from '../api/driverApi'
import { DriverWelcomeBanner } from '../components/DriverWelcomeBanner'
import { DriverStatGrid } from '../components/DriverStatGrid'
import { ActiveTripCard } from '../components/ActiveTripCard'
import { DriverShortcuts } from '../components/DriverShortcuts'
import { RecentBookingsTable } from '../components/RecentBookingsTable'
import { QrCheckoutModal } from '../components/QrCheckoutModal'
import { DashboardSkeleton } from '../components/DashboardSkeleton'
import { DashboardEmptyState } from '../components/DashboardEmptyState'
import { useDriverDashboardStore } from '../store/driverDashboardStore'
import type { QuickSearchFormData } from '../types/driverTypes'

// Zod schema for quick dashboard manifest search
const quickSearchSchema = z.object({
  query: z
    .string()
    .trim()
    .min(2, 'Vui lòng nhập tối thiểu 2 ký tự để tra cứu')
    .max(50, 'Mã tra cứu không được vượt quá 50 ký tự'),
})

export function DriverDashboardPage() {
  const { qrModalOpen, setQrModalOpen, successToast, setSuccessToast, clearToast } =
    useDriverDashboardStore()

  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['driver-dashboard'],
    queryFn: fetchDriverDashboardData,
    staleTime: 60000,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<QuickSearchFormData>({
    resolver: zodResolver(quickSearchSchema),
    defaultValues: { query: '' },
  })

  const onQuickSearch = (formData: QuickSearchFormData) => {
    setSuccessToast(`Đang lọc mã: "${formData.query}". Hệ thống đã đối chiếu dữ liệu.`)
    reset()
  }

  return (
    <div className="w-full min-h-[calc(100vh-140px)] bg-[#f8f9ff]">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-6 pb-20 lg:pb-24">
        {/* Floating Success Toast */}
        {successToast && (
          <div
            role="status"
            className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successToast}</span>
            </div>
            <button
              type="button"
              onClick={clearToast}
              className="text-emerald-700 hover:text-emerald-900 p-1"
              aria-label="Đóng thông báo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 1. Loading State */}
        {isLoading ? (
          <DashboardSkeleton />
        ) : error ? (
          /* 2. Error State */
          <div
            role="alert"
            className="w-full bg-rose-50 border border-rose-200 rounded-xl p-6 lg:p-8 text-center my-6"
          >
            <AlertCircle className="w-10 h-10 text-rose-600 mx-auto mb-2" />
            <h3 className="font-sora text-base sm:text-lg font-bold text-rose-900">
              Không thể tải dữ liệu điều phối bến bãi
            </h3>
            <p className="text-xs text-rose-700 mt-1 mb-4 max-w-md mx-auto">
              Hệ thống tạm thời không phản hồi (Mã lỗi: ERR_DISPATCH_TIMEOUT). Vui lòng kiểm tra lại
              kết nối mạng hoặc bấm nút thử lại.
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              disabled={isRefetching}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#d95f00] hover:bg-[#b85000] text-white font-medium text-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
              <span>{isRefetching ? 'Đang thử lại...' : 'Thử lại (Tải lại dữ liệu)'}</span>
            </button>
          </div>
        ) : data?.isEmptyState ? (
          /* 3. Empty State */
          <DashboardEmptyState driverName={data.driverName} />
        ) : data ? (
          /* 4. Success / Operational Dashboard */
          <>
            {/* Top Operational Command Deck */}
            <DriverWelcomeBanner
              driverName={data.driverName}
              driverPhone={data.driverPhone}
            />

            {/* Quick Filter & Validation Strip */}
            <form
              onSubmit={handleSubmit(onQuickSearch)}
              className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tra cứu nhanh biển số, mã đặt chỗ BK-... hoặc số slot..."
                  {...register('query')}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#d95f00] focus:border-[#d95f00]"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors cursor-pointer whitespace-nowrap"
              >
                Tra Cứu Nhanh
              </button>
            </form>
            {errors.query && (
              <p className="text-xs text-rose-600 -mt-4 mb-4 font-medium">
                {errors.query.message}
              </p>
            )}

            {/* Key Performance Indicators (Bento Grid) */}
            <DriverStatGrid
              vehicleTotal={data.vehicleTotal}
              bookingTotal={data.bookingTotal}
              activeCount={data.activeCount}
              queueCount={data.queueCount}
              activeBooking={data.activeBooking}
              onOpenQr={() => setQrModalOpen(true)}
            />

            {/* Detailed Active Trip Card (Split Pane) */}
            <ActiveTripCard
              booking={data.activeBooking}
              onOpenQr={() => setQrModalOpen(true)}
            />

            {/* Quick Shortcuts Matrix */}
            <DriverShortcuts />

            {/* Recent Completed Bookings Table */}
            <RecentBookingsTable
              bookings={data.recentBookings}
              totalCount={data.bookingTotal}
            />

            {/* ALPR Fast-Checkout QR Modal */}
            <QrCheckoutModal
              open={qrModalOpen}
              onClose={() => setQrModalOpen(false)}
              booking={data.activeBooking}
              onSuccessNotice={(msg) => setSuccessToast(msg)}
            />
          </>
        ) : null}
      </div>
    </div>
  )
}
