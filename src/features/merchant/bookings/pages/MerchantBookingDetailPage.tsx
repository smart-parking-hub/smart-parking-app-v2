import { Link, useParams } from 'react-router-dom'
import { errorMessage } from '@/shared/api/resources'
import { Badge } from '@/shared/components/Badge'
import { ErrorState } from '@/shared/components/ErrorState'
import { Skeleton } from '@/shared/components/Skeleton'
import {
  button,
  Metrics,
  Panel,
  secondary,
  Workspace,
} from '@/shared/components/Workspace'
import {
  formatBookingDateTime,
  formatBookingMoney,
  formatBookingTimeOnly,
  resolveBookingDriverName,
  resolveBookingDriverPhone,
  resolveBookingPlate,
  resolveVehicleTypeLabel,
} from '../api/merchantBookingsApi'
import { useMerchantBookingDetailQuery } from '../hooks/useMerchantBookingsQuery'

export function MerchantBookingDetailPage() {
  const { id } = useParams()
  const detailQuery = useMerchantBookingDetailQuery(id)
  const data = detailQuery.data

  const surgeStart = data ? formatBookingTimeOnly(data.surgeStartTime) : null
  const surgeEnd = data ? formatBookingTimeOnly(data.surgeEndTime) : null
  const driverName = data ? resolveBookingDriverName(data) : null
  const driverPhone = data ? resolveBookingDriverPhone(data) : null

  const hasPricingOrRefundDetails = Boolean(
    data &&
      (typeof data.hourlyRate === 'number' ||
        typeof data.surgeMultiplier === 'number' ||
        typeof data.overtimePenaltyMultiplier === 'number' ||
        data.cancelledAt ||
        data.cancellationReason ||
        typeof data.refundAmount === 'number' ||
        typeof data.refundPercentage === 'number' ||
        data.refundPolicy ||
        data.refundStatus ||
        data.refundReference),
  )

  return (
    <Workspace
      title={`Hồ sơ đặt chỗ #${id}`}
      eyebrow="CHI TIẾT VÉ / MERCHANT"
      description="Xem hành trình xe, thông tin biển số, thời gian ra vào và chi tiết thanh toán cọc."
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Link className={secondary} to="/merchant/bookings">
            ← Danh sách đặt chỗ
          </Link>
          <Link className={button} to="/merchant/qr-scanner">
            Mở trạm quét QR
          </Link>
        </div>
      }
    >
      {detailQuery.isPending && !data ? (
        <div role="status" className="space-y-6" aria-label="Đang tải hồ sơ đặt chỗ">
          <span className="sr-only">Đang tải hồ sơ đặt chỗ...</span>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((card) => (
              <Skeleton key={card} variant="card" className="h-32" />
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <Skeleton variant="card" className="h-72" />
            <Skeleton variant="card" className="h-48" />
          </div>
        </div>
      ) : detailQuery.isError && !data ? (
        <ErrorState
          variant="card"
          title="Không thể tải hồ sơ đặt chỗ"
          description={errorMessage(detailQuery.error)}
          onRetry={() => void detailQuery.refetch()}
          isRetrying={detailQuery.isFetching}
        />
      ) : data ? (
        <>
          <Metrics
            items={[
              { label: 'Mã vé', value: data.bookingCode },
              { label: 'Trạng thái', value: <Badge value={data.status} dot /> },
              { label: 'Đặt cọc', value: formatBookingMoney(data.advanceDeposit) },
              { label: 'Tổng phí', value: formatBookingMoney(data.totalAmount) },
            ]}
          />

          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-6">
              <Panel title="Hành trình phương tiện">
                <dl className="grid gap-5 sm:grid-cols-2">
                  {[
                    ['Biển kiểm soát', resolveBookingPlate(data)],
                    ['Phân loại xe', resolveVehicleTypeLabel(data.vehicleType)],
                    ['Bãi đỗ', data.parkingLotName || '—'],
                    ['Địa chỉ bãi đỗ', data.parkingLotAddress || 'Theo hồ sơ bãi đỗ'],
                    ['Dự kiến đến', formatBookingDateTime(data.expectedCheckInTime)],
                    ['Dự kiến rời', formatBookingDateTime(data.expectedCheckOutTime)],
                    ['Thời điểm tạo vé', formatBookingDateTime(data.createdAt)],
                    ['Hạn giữ chỗ / thanh toán', formatBookingDateTime(data.expiresAt)],
                    ['Thực tế vào bãi', formatBookingDateTime(data.checkInTime)],
                    ['Thực tế rời bãi', formatBookingDateTime(data.checkOutTime)],
                    ...(typeof data.vehicleId === 'number'
                      ? [['Mã phương tiện', `#${data.vehicleId}`]]
                      : []),
                    ...(typeof data.driverId === 'number'
                      ? [['Mã tài xế', `#${data.driverId}`]]
                      : []),
                    ...(driverName ? [['Tên tài xế / khách', driverName]] : []),
                    ...(driverPhone ? [['Số điện thoại', driverPhone]] : []),
                    ...(data.cancellationReason
                      ? [['Lý do hủy đơn', data.cancellationReason]]
                      : []),
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-xs text-brand-muted">{label}</dt>
                      <dd className="mt-1.5 font-medium text-slate-900">{value}</dd>
                    </div>
                  ))}
                </dl>
              </Panel>

              {hasPricingOrRefundDetails && (
                <Panel title="Biểu phí áp dụng & Hoàn tiền">
                  <dl className="grid gap-5 sm:grid-cols-2">
                    {[
                      [
                        'Đơn giá theo giờ',
                        typeof data.hourlyRate === 'number'
                          ? `${formatBookingMoney(data.hourlyRate)} / giờ`
                          : '—',
                      ],
                      [
                        'Hệ số giờ cao điểm',
                        typeof data.surgeMultiplier === 'number'
                          ? `x${data.surgeMultiplier}`
                          : 'Không áp dụng',
                      ],
                      [
                        'Khung giờ cao điểm',
                        surgeStart && surgeEnd ? `${surgeStart} – ${surgeEnd}` : 'Không áp dụng',
                      ],
                      [
                        'Hệ số phạt quá giờ',
                        typeof data.overtimePenaltyMultiplier === 'number'
                          ? `x${data.overtimePenaltyMultiplier}`
                          : 'Không áp dụng',
                      ],
                      ...(data.cancelledAt
                        ? [['Thời điểm hủy', formatBookingDateTime(data.cancelledAt)]]
                        : []),
                      ...(typeof data.refundAmount === 'number'
                        ? [['Số tiền hoàn', formatBookingMoney(data.refundAmount)]]
                        : []),
                      ...(typeof data.refundPercentage === 'number'
                        ? [['Tỷ lệ hoàn tiền', `${data.refundPercentage}%`]]
                        : []),
                      ...(data.refundPolicy ? [['Chính sách hoàn tiền', data.refundPolicy]] : []),
                      ...(data.refundStatus ? [['Trạng thái hoàn tiền', data.refundStatus]] : []),
                      ...(data.refundReference
                        ? [['Mã tham chiếu hoàn tiền', data.refundReference]]
                        : []),
                    ].map(([label, value]) => (
                      <div key={label}>
                        <dt className="text-xs text-brand-muted">{label}</dt>
                        <dd className="mt-1.5 font-medium text-slate-900">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </Panel>
              )}
            </div>

            <Panel title="Kiểm soát tại cổng">
              <p className="mb-5 text-sm leading-relaxed text-brand-muted">
                Quét vé hoặc nhập mã đặt chỗ tại trạm. Kiểm tra đúng bãi trước
                khi xác nhận xe vào, xe ra hoặc thu tiền mặt.
              </p>
              <Link
                className={`${button} w-full flex items-center justify-center gap-2`}
                to={`/merchant/qr-scanner?code=${encodeURIComponent(data.bookingCode)}&lot=${data.parkingLotId ?? ''}`}
              >
                Xử lý tại trạm QR →
              </Link>
            </Panel>
          </div>
        </>
      ) : null}
    </Workspace>
  )
}

