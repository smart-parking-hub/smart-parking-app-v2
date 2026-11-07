import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { fetchMerchantDashboardData } from '../api/merchantDashboardApi'
import { MerchantCommandSurface } from '../components/MerchantCommandSurface'
import { MerchantDashboardSkeleton } from '../components/MerchantDashboardSkeleton'
import { Notice, Panel, Badge, money, secondary } from '@/shared/components/Workspace'

export function MerchantDashboardPage() {
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['merchant-dashboard-summary'],
    queryFn: fetchMerchantDashboardData,
    staleTime: 20000,
  })

  if (isLoading) return <MerchantDashboardSkeleton />
  if (error || !data) return (
    <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-10 space-y-4">
      <Notice error>Không thể tải dữ liệu bảng điều khiển chủ bãi. Vui lòng kiểm tra kết nối và thử lại.</Notice>
      <button type="button" className={secondary} disabled={isRefetching} onClick={() => void refetch()}>
        {isRefetching ? 'Đang thử lại...' : 'Tải lại dữ liệu'}
      </button>
    </div>
  )

  const metrics = [
    ['TỔNG DOANH THU THỰC NHẬN', money(data.revenue.totalNetRevenue)],
    ['SỐ DƯ VÍ', money(data.revenue.currentWalletBalance)],
    ['BÃI ĐỖ CỦA TÔI', data.lots.totalElements],
    ['TỔNG LƯỢT ĐẶT CHỖ', data.bookings.totalElements],
  ] as const
  return (
    <div className="w-full flex flex-col pb-12">
      <MerchantCommandSurface />
      <div className="max-w-[1280px] w-full mx-auto px-4 lg:px-8 py-6 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {metrics.map(([label, value]) => <Panel key={label}>
            <p className="font-mono text-xs text-brand-muted">{label}</p>
            <p className="font-sora text-2xl font-bold mt-3">{value}</p>
          </Panel>)}
        </div>
        {data.lots.totalElements === 0 && <Notice>Bạn chưa có bãi đỗ nào. Đăng ký bãi mới để bắt đầu quản lý.</Notice>}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-6">
            <Panel title="Doanh thu theo kỳ">
              {data.revenue.series.length === 0 ? <Notice>Chưa có dữ liệu biểu đồ doanh thu.</Notice> : <ul className="space-y-3">
                {data.revenue.series.map(point => <li key={point.period} className="flex justify-between gap-3">
                  <span>{point.period}</span><span>{money(point.revenue)} · {point.bookingCount} lượt</span>
                </li>)}
              </ul>}
              <Link to="/merchant/revenue" className="mt-4 inline-block underline">Xem báo cáo doanh thu</Link>
            </Panel>
            <Panel title="Đặt chỗ gần nhất">
              {data.bookings.content.length === 0 ? <Notice>Chưa có lượt đặt chỗ.</Notice> : <ul className="space-y-4">
                {data.bookings.content.map(booking => <li key={booking.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-border pb-3">
                  <Link to={`/merchant/bookings/${booking.id}`} className="underline">{booking.bookingCode}</Link>
                  <span>{booking.vehicleLicensePlate || '—'}</span><span>{booking.parkingLotName || '—'}</span><Badge value={booking.status} />
                </li>)}
              </ul>}
              <Link to="/merchant/bookings" className="mt-4 inline-block underline">Xem tất cả đặt chỗ</Link>
            </Panel>
          </div>
          <div className="lg:col-span-4 space-y-6">
            <Panel title={`Bãi đỗ của tôi (${data.lots.totalElements})`}>
              {data.lots.content.length === 0 ? <p>Chưa có bãi đỗ.</p> : <ul className="space-y-4">
                {data.lots.content.map(lot => <li key={lot.id} className="space-y-2 border-b border-brand-border pb-3">
                  <Link to={`/merchant/parking-lots/${lot.id}`} className="font-semibold underline">{lot.name}</Link>
                  <p className="text-sm text-brand-muted">{lot.address || '—'}</p><Badge value={lot.status} />
                </li>)}
              </ul>}
              <Link to="/merchant/parking-lots" className="mt-4 inline-block underline">Quản lý bãi đỗ, slot &amp; giá</Link>
            </Panel>
            <Panel title="Trạm Barie & Camera ALPR">
              <p className="mb-4 text-sm text-brand-muted">Chưa có dữ liệu kết nối camera ALPR.</p>
              <Link to="/merchant/qr-scanner" className={secondary}>Mở trạm quét QR</Link>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  )
}
