import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import type { Booking } from '@/entities/operations'
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
} from '@/shared/components/Workspace'
export function MerchantBookingsPage() {
  const [page, setPage] = useState(0)
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
            <DataTable
              rows={data.content}
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
                { label: 'Tiền cọc', render: (r) => money(r.advanceDeposit) },
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
    queryFn: () => getData<Booking>(`/api/v1/bookings/${id}`),
    retry: false,
  })
  return (
    <Workspace
      title={`Hồ sơ đặt chỗ #${id}`}
      actions={
        <Link className={button} to="/merchant/bookings">
          Danh sách đặt chỗ
        </Link>
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
                    'Bãi đỗ': data.parkingLotName,
                    'Dự kiến đến': date(data.expectedCheckInTime),
                    'Dự kiến rời': date(data.expectedCheckOutTime),
                    'Đã vào bãi': date(data.checkInTime),
                    'Đã rời bãi': date(data.checkOutTime),
                  }).map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-xs text-brand-muted">{label}</dt>
                      <dd className="mt-2 font-medium">{value}</dd>
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
                  className={button}
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
