import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import type { Booking } from '@/entities/operations'
import { vehicleLabels } from '@/entities/operations'
import { getData, type Page } from '@/shared/api/resources'
import { QueryState } from '@/shared/components/QueryState'
import {
  Badge,
  DataTable,
  Metrics,
  Panel,
  Workspace,
  date,
  money,
  button,
  secondary,
} from '@/shared/components/Workspace'
export function MerchantBookingsPage() {
  const [page, setPage] = useState(0)
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING_CHECKIN' | 'PARKING' | 'COMPLETED'>('ALL')
  const query = useQuery({
    queryKey: ['merchant-bookings', page],
    queryFn: () =>
      getData<Page<Booking>>('/api/v1/merchant/bookings', { page, size: 20 }),
    retry: false,
  })
  return (
    <Workspace
      title="Điều phối đặt chỗ"
      description="Theo dõi lịch đến, xe đang đỗ và các lượt đã quyết toán."
      actions={
        <Link className={button} to="/merchant/qr-scanner">
          Mở trạm quét QR →
        </Link>
      }
    >
      <QueryState query={query}>
        {(data) => (
          <>
            <Metrics
              items={[
                { label: 'Tổng lượt đặt chỗ', value: data.totalElements },
                {
                  label: 'Chờ vào · trang này',
                  value: data.content.filter(
                    (r) => r.status === 'PENDING_CHECKIN',
                  ).length,
                },
                {
                  label: 'Đang đỗ · trang này',
                  value: data.content.filter((r) => r.status === 'PARKING')
                    .length,
                },
                {
                  label: 'Hoàn tất · trang này',
                  value: data.content.filter((r) => r.status === 'COMPLETED')
                    .length,
                },
              ]}
            />
            <div className="flex flex-wrap items-center gap-2 mb-4" role="tablist" aria-label="Bộ lọc trạng thái">
              {[
                { id: 'ALL', label: 'Tất cả trạng thái', count: data.content.length },
                { id: 'PENDING_CHECKIN', label: 'Chờ vào bãi', count: data.content.filter((r) => r.status === 'PENDING_CHECKIN').length },
                { id: 'PARKING', label: 'Đang đỗ xe', count: data.content.filter((r) => r.status === 'PARKING').length },
                { id: 'COMPLETED', label: 'Đã hoàn tất', count: data.content.filter((r) => r.status === 'COMPLETED').length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={statusFilter === tab.id}
                  onClick={() => setStatusFilter(tab.id as typeof statusFilter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1.5 ${
                    statusFilter === tab.id
                      ? 'bg-brand-navy text-white shadow-sm ring-1 ring-brand-navy'
                      : 'bg-white text-brand-muted hover:bg-slate-100 hover:text-brand-navy border border-brand-border'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    statusFilter === tab.id ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
            <DataTable
              rows={
                statusFilter === 'ALL'
                  ? data.content
                  : data.content.filter((r) => r.status === statusFilter)
              }
              searchText={(r) =>
                `${r.bookingCode} ${r.vehicleLicensePlate} ${r.parkingLotName}`
              }
              page={page}
              totalPages={data.totalPages}
              onPage={setPage}
              detailLink={(r) => `/merchant/bookings/${r.id}`}
              columns={[
                {
                  label: 'Mã đặt chỗ',
                  render: (r) => (
                    <span className="font-mono font-semibold">
                      {r.bookingCode}
                    </span>
                  ),
                },
                {
                  label: 'Biển số',
                  render: (r) => r.vehicleLicensePlate || r.vehiclePlate,
                },
                { label: 'Bãi đỗ', render: (r) => r.parkingLotName },
                {
                  label: 'Giờ đến dự kiến',
                  render: (r) => date(r.expectedCheckInTime),
                },
                {
                  label: 'Tiền cọc',
                  align: 'right',
                  render: (r) => (
                    <span className="font-mono tabular-nums font-semibold text-slate-800">
                      {money(r.advanceDeposit)}
                    </span>
                  ),
                },
                {
                  label: 'Trạng thái',
                  render: (r) => <Badge value={r.status} />,
                },
              ]}
            />
          </>
        )}
      </QueryState>
    </Workspace>
  )
}
export function MerchantBookingDetailPage() {
  const { id } = useParams()
  const query = useQuery({
    queryKey: ['merchant-booking', id],
    queryFn: () => getData<Booking>(`/api/v1/merchant/bookings/${id}`),
    retry: false,
  })
  return (
    <Workspace
      title={`Hồ sơ đặt chỗ #${id}`}
      eyebrow="CHI TIẾT VÉ / MERCHANT"
      description="Xem hành trình xe, thông tin biển số, thời gian ra vào và chi tiết thanh toán cọc."
      actions={
        <div className="flex items-center gap-2">
          <Link className={secondary} to="/merchant/bookings">
            ← Danh sách đặt chỗ
          </Link>
          <Link className={button} to="/merchant/qr-scanner">
            Mở trạm quét QR
          </Link>
        </div>
      }
    >
      <QueryState query={query}>
        {(data) => (
          <>
            <Metrics
              items={[
                { label: 'Mã vé', value: data.bookingCode },
                { label: 'Trạng thái', value: <Badge value={data.status} /> },
                { label: 'Đặt cọc', value: money(data.advanceDeposit) },
                { label: 'Tổng phí', value: money(data.totalAmount) },
              ]}
            />
            <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
              <Panel title="Hành trình phương tiện">
                <dl className="grid gap-5 sm:grid-cols-2">
                  {Object.entries({
                    'Biển kiểm soát':
                      data.vehicleLicensePlate || data.vehiclePlate,
                    'Phân loại xe':
                      (data.vehicleType && vehicleLabels[data.vehicleType]) || data.vehicleType || 'Không xác định',
                    'Bãi đỗ': data.parkingLotName,
                    'Địa chỉ bãi đỗ': data.parkingLotAddress || 'Theo hồ sơ bãi đỗ',
                    'Dự kiến đến': date(data.expectedCheckInTime),
                    'Dự kiến rời': date(data.expectedCheckOutTime),
                    'Thời điểm tạo vé': date(data.createdAt),
                    'Thực tế vào bãi': date(data.checkInTime),
                    'Thực tế rời bãi': date(data.checkOutTime),
                    ...(data.cancellationReason ? { 'Lý do hủy đơn': data.cancellationReason } : {}),
                  }).map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-xs text-brand-muted">{label}</dt>
                      <dd className="mt-1.5 font-medium text-slate-900">{value}</dd>
                    </div>
                  ))}
                </dl>
              </Panel>
              <Panel title="Kiểm soát tại cổng">
                <p className="mb-5 text-sm leading-relaxed text-brand-muted">
                  Quét vé hoặc nhập mã đặt chỗ tại trạm. Kiểm tra đúng bãi trước
                  khi xác nhận xe vào, xe ra hoặc thu tiền mặt.
                </p>
                <Link
                  className={`${button} w-full flex items-center justify-center gap-2`}
                  to={`/merchant/qr-scanner?code=${encodeURIComponent(data.bookingCode)}&lot=${data.parkingLotId}`}
                >
                  Xử lý tại trạm QR →
                </Link>
              </Panel>
            </div>
          </>
        )}
      </QueryState>
    </Workspace>
  )
}
