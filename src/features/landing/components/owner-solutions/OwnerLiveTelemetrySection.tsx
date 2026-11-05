import { Building2, RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useOwnerLotsTelemetryQuery } from '../../hooks/useOwnerLotsTelemetryQuery'
import { OwnerLotLiveCard } from '@/entities/owner/components/OwnerLotLiveCard'
import { Skeleton } from '@/shared/components/Skeleton'
import { Alert } from '@/shared/components/Alert'
import { EmptyState } from '@/shared/components/EmptyState'
import { Button } from '@/shared/components/Button'

export interface OwnerLiveTelemetrySectionProps {
  onRegisterClick?: () => void
  simulateLoading?: boolean
  simulateEmpty?: boolean
  simulateError?: boolean
}

export function OwnerLiveTelemetrySection({
  onRegisterClick,
  simulateLoading,
  simulateEmpty,
  simulateError,
}: OwnerLiveTelemetrySectionProps = {}) {
  const navigate = useNavigate()

  const {
    data: lots,
    isLoading,
    isError,
    error,
    refetch,
  } = useOwnerLotsTelemetryQuery({
    simulateLoading,
    simulateEmpty,
    simulateError,
  })

  const handleCardAction = () => {
    if (onRegisterClick) {
      onRegisterClick()
    } else {
      navigate('/merchant/parking-lots')
    }
  }

  return (
    <section className="w-full bg-[#060D1A] py-24 px-6 text-white border-t border-slate-800" id="giam-sat-bai-mau">
      <div className="max-w-[1240px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <span className="font-inter text-xs font-bold tracking-widest text-brand-orange uppercase bg-brand-navy-light border border-[#1E3A5F] px-3 py-1 rounded inline-block mb-3">
              GIÁM SÁT MẶT BẰNG THỰC ĐỊA REAL-TIME
            </span>
            <h2 className="font-sora text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
              Hệ Thống Trạm Dừng Đối Tác Đang Vận Hành.
            </h2>
          </div>
          <p className="font-inter text-sm text-slate-300 max-w-md">
            Dữ liệu truyền hình ảnh và camera ALPR thời gian thực từ các bãi container liên kết cùng SmartTruckHub.
          </p>
        </div>

        {/* State 1: Loading Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="owner-lots-loading">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="bg-brand-navy-light border border-[#1E3A5F] rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-24 bg-slate-700" />
                  <Skeleton className="h-4 w-16 bg-slate-700" />
                </div>
                <Skeleton className="h-6 w-3/4 bg-slate-700" />
                <Skeleton className="h-4 w-1/2 bg-slate-700" />
                <Skeleton className="h-16 w-full bg-slate-800 rounded-xl" />
                <Skeleton className="h-4 w-full bg-slate-700" />
              </div>
            ))}
          </div>
        )}

        {/* State 2: Error State */}
        {isError && (
          <div className="py-8" data-testid="owner-lots-error">
            <Alert
              variant="error"
              title="Không Thể Nạp Dữ Liệu Bãi Đỗ Thực Địa"
              action={
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => refetch()}
                  className="bg-transparent text-white border-white/20 hover:bg-white/10"
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                  Thử lại
                </Button>
              }
            >
              {error instanceof Error ? error.message : 'Có lỗi bất ngờ khi truy vấn dữ liệu bãi thực địa.'}
            </Alert>
          </div>
        )}

        {/* State 3: Empty State */}
        {!isLoading && !isError && (!lots || lots.length === 0) && (
          <div className="py-12 bg-brand-navy-light border border-[#1E3A5F] rounded-2xl" data-testid="owner-lots-empty">
            <EmptyState
              icon={Building2}
              title="Chưa Có Bãi Đỗ Mẫu Nào Trong Khu Vực"
              description="Hiện tại hệ thống đang cập nhật telemetry các bãi đối tác mới. Vui lòng quay lại sau hoặc đăng ký mặt bằng của bạn."
              action={
                <Button variant="primary" onClick={onRegisterClick}>
                  Đăng Ký Mặt Bằng Ngay
                </Button>
              }
            />
          </div>
        )}

        {/* State 4: Success Telemetry Grid */}
        {!isLoading && !isError && lots && lots.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="owner-lots-success">
            {lots.map((lot) => (
              <OwnerLotLiveCard
                key={lot.id}
                telemetry={lot}
                onActionClick={handleCardAction}
                actionLabel="Xem Trạm Cổng"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

