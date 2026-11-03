import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { AlertCircle, RefreshCw } from 'lucide-react'

import { fetchDriverDashboardData } from '../api/dashboardApi'
import { DriverWelcomeBanner } from '../components/DriverWelcomeBanner'
import { DriverStatGrid } from '../components/DriverStatGrid'
import { ActiveTripCard } from '../components/ActiveTripCard'
import { DriverShortcuts } from '../components/DriverShortcuts'
import { RecentBookingsTable } from '../components/RecentBookingsTable'
import { QrCheckoutModal } from '../components/QrCheckoutModal'
import { DashboardSkeleton } from '../components/DashboardSkeleton'

export function DashboardHomePage() {
  const [qrModalOpen, setQrModalOpen] = useState(false)

  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['driver-dashboard'],
    queryFn: fetchDriverDashboardData,
    staleTime: 60000,
  })

  return (
    <div className="w-full min-h-[calc(100vh-140px)] bg-[#f8f9ff]">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-6">
        {/* Loading State */}
        {isLoading ? (
          <DashboardSkeleton />
        ) : error ? (
          /* Error State */
          <div className="w-full bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center my-8">
            <AlertCircle className="w-10 h-10 text-rose-600 mx-auto mb-2" />
            <h3 className="font-sora text-lg font-bold text-rose-900">
              Không thể tải dữ liệu điều phối bến bãi
            </h3>
            <p className="text-xs text-rose-700 mt-1 mb-4">
              Hệ thống tạm thời không phản hồi. Vui lòng kiểm tra lại kết nối mạng hoặc thử lại sau.
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              disabled={isRefetching}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#d95f00] hover:bg-[#b85000] text-white font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
              <span>{isRefetching ? 'Đang thử lại...' : 'Tải lại dữ liệu'}</span>
            </button>
          </div>
        ) : data ? (
          /* Main Dashboard Content */
          <>
            {/* 1. Top Operational Banner (Industrial Command Deck) */}
            <DriverWelcomeBanner
              driverName={data.driverName}
              driverPhone={data.driverPhone}
            />

            {/* 2. Key Performance Indicators (Bento Grid) */}
            <DriverStatGrid
              vehicleTotal={data.vehicleTotal}
              bookingTotal={data.bookingTotal}
              activeCount={data.activeCount}
              queueCount={data.queueCount}
              activeBooking={data.activeBooking}
              onOpenQr={() => setQrModalOpen(true)}
            />

            {/* 3. Detailed Active Trip Card (Split Pane) */}
            <ActiveTripCard
              booking={data.activeBooking}
              onOpenQr={() => setQrModalOpen(true)}
            />

            {/* 4. Quick Shortcuts Matrix */}
            <DriverShortcuts />

            {/* 5. Recent Completed Bookings Table */}
            <RecentBookingsTable
              bookings={data.recentBookings}
              totalCount={data.bookingTotal}
            />

            {/* 6. ALPR Fast-Checkout QR Modal */}
            <QrCheckoutModal
              open={qrModalOpen}
              onClose={() => setQrModalOpen(false)}
              booking={data.activeBooking}
            />
          </>
        ) : null}
      </div>
    </div>
  )
}
