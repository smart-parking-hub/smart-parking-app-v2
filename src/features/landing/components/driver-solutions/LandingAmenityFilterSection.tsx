import { useState } from 'react'
import { Scale, Shield, ShowerHead, Wrench, Zap, RefreshCw, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ParkingLotLivePreviewCard } from '@/entities/parking-lot/components/ParkingLotLivePreviewCard'
import { useDriverDepotsQuery, DEFAULT_DEPOT_TELEMETRY } from '../../hooks/useDriverDepotsQuery'
import { Skeleton } from '@/shared/components/Skeleton'
import { Alert } from '@/shared/components/Alert'
import { EmptyState } from '@/shared/components/EmptyState'
import { Button } from '@/shared/components/Button'

export interface LandingAmenityFilterSectionProps {
  onReserveClick?: () => void
  simulateLoading?: boolean
  simulateEmpty?: boolean
  simulateError?: boolean
}

export function LandingAmenityFilterSection({
  onReserveClick,
  simulateLoading,
  simulateEmpty,
  simulateError,
}: LandingAmenityFilterSectionProps = {}) {
  const [activeAmenityId, setActiveAmenityId] = useState('scale')
  const navigate = useNavigate()

  const {
    data: depots,
    isLoading,
    isError,
    error,
    refetch,
  } = useDriverDepotsQuery({
    simulateLoading,
    simulateEmpty,
    simulateError,
  })

  const amenities = [
    {
      id: 'scale',
      label: 'Trạm Cân Điện Tử 80T - 120T',
      Icon: Scale,
    },
    {
      id: 'reefer',
      label: 'Cắm Sạc Điện Reefer 380V',
      Icon: Zap,
    },
    {
      id: 'shower',
      label: 'Phòng Tắm Nóng Lạnh & Giặt Là',
      Icon: ShowerHead,
    },
    {
      id: 'security',
      label: 'Bảo Vệ Có Thẻ Vũ Trang 24/7',
      Icon: Shield,
    },
    {
      id: 'rescue',
      label: 'Cứu Hộ Lốp & Bình Ắc Quy',
      Icon: Wrench,
    },
  ]

  const depot = depots?.[0] || DEFAULT_DEPOT_TELEMETRY

  const handleReserve = () => {
    if (onReserveClick) {
      onReserveClick()
    } else {
      navigate('/search')
    }
  }

  return (
    <section className="w-full bg-[#060D1A] py-24 px-6 text-white" id="bo-loc-tien-ich">
      <div className="max-w-[1240px] mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="font-sora text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Tìm Bãi Có Đúng Tiện Ích Xe Bạn Cần
          </h2>
          <p className="font-inter text-base sm:text-lg text-slate-300 mt-4 leading-relaxed">
            Không phải bãi xe nào cũng có điện lạnh 380V hay trạm cân đạt chuẩn. Chọn đúng tiện ích trên màn hình để tiết kiệm hàng giờ di chuyển vô ích.
          </p>
        </div>

        {/* Amenity Toggle Pills */}
        <div className="flex overflow-x-auto pb-2 scrollbar-none sm:flex-wrap sm:justify-center gap-3 mb-10" id="amenitySelectors">
          {amenities.map((item) => {
            const Icon = item.Icon
            const isActive = activeAmenityId === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveAmenityId(item.id)}
                className={`amenity-btn px-5 py-3 rounded-xl text-sm font-inter font-semibold flex items-center gap-2.5 transition-all cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange ${
                  isActive
                    ? 'bg-brand-orange text-[#060D1A] font-bold border-2 border-brand-orange'
                    : 'bg-[#0B1528] text-slate-300 hover:text-white border border-slate-700/80'
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>

        {/* Dynamic UI States: Loading / Error / Empty / Normal */}
        {isLoading ? (
          <div className="bg-[#0B1528] border border-slate-800 rounded-2xl p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center pb-6 border-b border-slate-800">
              <div className="space-y-3">
                <Skeleton className="h-5 w-44 bg-slate-800" />
                <Skeleton className="h-8 w-72 bg-slate-800" />
                <Skeleton className="h-4 w-96 bg-slate-800" />
              </div>
              <Skeleton className="h-14 w-32 bg-slate-800" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 py-6 border-b border-slate-800">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-12 w-full bg-slate-800" />
              ))}
            </div>
            <div className="flex justify-between items-center pt-4">
              <Skeleton className="h-6 w-56 bg-slate-800" />
              <Skeleton className="h-10 w-48 bg-slate-800" />
            </div>
          </div>
        ) : isError ? (
          <div className="max-w-4xl mx-auto">
            <Alert
              variant="error"
              title="Không thể tải dữ liệu bãi đỗ thực địa"
              className="bg-[#1E1B2E] border-rose-900 text-rose-200"
              action={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  className="text-rose-200 border-rose-700 hover:bg-rose-900/40"
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                  Thử lại
                </Button>
              }
            >
              {error instanceof Error ? error.message : 'Lỗi kết nối telemetry trạm đỗ container.'}
            </Alert>
          </div>
        ) : depots && depots.length === 0 ? (
          <div className="max-w-4xl mx-auto bg-[#0B1528] border border-slate-800 rounded-2xl p-8">
            <EmptyState
              icon={AlertCircle}
              title="Chưa có bãi đỗ nào khớp với tiện ích đã chọn"
              description="Hiện tại các bãi đỗ có tiện ích này đang kín chỗ. Bác tài vui lòng chọn tiện ích khác hoặc chuyển sang chế độ bản đồ tìm kiếm."
              className="bg-transparent border-0 text-white"
              action={
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setActiveAmenityId('scale')}
                >
                  Đặt Lại Bộ Lọc Mặc Định
                </Button>
              }
            />
          </div>
        ) : (
          <ParkingLotLivePreviewCard
            telemetry={depot}
            activeAmenityId={activeAmenityId}
            onReserveClick={handleReserve}
          />
        )}
      </div>
    </section>
  )
}
