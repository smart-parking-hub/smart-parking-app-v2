import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Copy,
  QrCode,
  Receipt,
  ShieldCheck,
  Truck,
} from 'lucide-react'
import type { Booking } from '@/entities/operations'
import { button, Panel, secondary } from '@/shared/components/Workspace'
import {
  formatBookingDateTime,
  formatBookingMoney,
  formatBookingTimeOnly,
  isActionableGateStatus,
  resolveBookingDriverName,
  resolveBookingDriverPhone,
  resolveBookingPlate,
  resolveVehicleTypeLabel,
} from '../api/merchantBookingsApi'
import type { BookingBarrierSummary } from '../types/merchantBookingsTypes'

interface MerchantBookingDetailSidebarProps {
  booking: Booking
  barrierSummary: BookingBarrierSummary
  copiedCode: boolean
  isFetching: boolean
  onCopyBookingCode: (bookingCode: string) => void
}

function getGateControlGuidance(status?: string | null): string {
  switch (status) {
    case 'PENDING_CHECKIN':
      return 'Vé đã sẵn sàng. Quét QR hoặc nhập mã đặt chỗ tại trạm cổng để xác nhận phương tiện vào bãi.'
    case 'PARKING':
      return 'Xe đang đỗ trong bãi. Khi phương tiện ra cổng, mở trạm QR và chọn XE RA để đối soát thời gian và cước phí.'
    case 'OVERTIME':
      return 'Đơn đã quá giờ dự kiến rời bãi. Vào trạm QR để tính phụ phí quá giờ thực tế và tất toán trước khi mở barie.'
    case 'AWAITING_FINAL_PAYMENT':
      return 'Đã ghi nhận xe ra bãi. Mở trạm QR để xác nhận thu đủ tiền mặt còn lại và giải phóng vị trí đỗ.'
    case 'PENDING_PAYMENT':
      return 'Đơn đang chờ tài xế hoàn tất thanh toán cọc; chưa thể thao tác mở barie vào bãi.'
    default:
      return 'Lượt đặt chỗ đã đóng. Có thể chuyển sang trạm kiểm soát QR để tra cứu hoặc phục vụ đối soát khi cần.'
  }
}

export function MerchantBookingJourneyPanel({
  booking,
}: {
  booking: Booking
}) {
  const driverName = resolveBookingDriverName(booking)
  const driverPhone = resolveBookingDriverPhone(booking)

  const vehicleAndLotItems: Array<{ label: string; value: string; mono?: boolean; span2?: boolean }> = [
    { label: 'Biển kiểm soát', value: resolveBookingPlate(booking), mono: true },
    { label: 'Phân loại xe', value: resolveVehicleTypeLabel(booking.vehicleType) },
    { label: 'Bãi đỗ', value: booking.parkingLotName || '—', span2: true },
    { label: 'Địa chỉ bãi đỗ', value: booking.parkingLotAddress || 'Theo hồ sơ bãi đỗ', span2: true },
  ]

  if (typeof booking.vehicleId === 'number') {
    vehicleAndLotItems.push({ label: 'Mã phương tiện', value: `#${booking.vehicleId}`, mono: true })
  }
  if (typeof booking.driverId === 'number') {
    vehicleAndLotItems.push({ label: 'Mã tài xế', value: `#${booking.driverId}`, mono: true })
  }
  if (driverName) {
    vehicleAndLotItems.push({ label: 'Tên tài xế / khách', value: driverName })
  }
  if (driverPhone) {
    vehicleAndLotItems.push({ label: 'Số điện thoại', value: driverPhone, mono: true })
  }

  const scheduleItems: Array<{
    label: string
    value: string
    highlightTone?: 'emerald' | 'neutral'
  }> = [
    { label: 'Dự kiến đến', value: formatBookingDateTime(booking.expectedCheckInTime) },
    { label: 'Dự kiến rời', value: formatBookingDateTime(booking.expectedCheckOutTime) },
    { label: 'Thời điểm tạo vé', value: formatBookingDateTime(booking.createdAt) },
    { label: 'Hạn giữ chỗ / thanh toán', value: formatBookingDateTime(booking.expiresAt) },
    {
      label: 'Thực tế vào bãi',
      value: formatBookingDateTime(booking.checkInTime, 'Chưa check-in'),
      highlightTone: booking.checkInTime ? 'emerald' : 'neutral',
    },
    {
      label: 'Thực tế rời bãi',
      value: formatBookingDateTime(booking.checkOutTime, 'Chưa check-out'),
      highlightTone: booking.checkOutTime ? 'emerald' : 'neutral',
    },
  ]

  return (
    <Panel className="shadow-2xs">
      <div className="mb-5 flex items-start gap-2.5 border-b border-slate-100 pb-4">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-orange-200/80 bg-orange-50 text-[#d95f00]">
          <Truck className="h-4 w-4" aria-hidden="true" />
        </div>
        <div>
          <h2 className="font-sora text-lg font-semibold text-brand-navy">
            Hành trình phương tiện
          </h2>
          <p className="mt-0.5 text-xs text-brand-muted">
            Thông tin xe, bãi đỗ tiếp nhận và các mốc giờ dự kiến so với thực tế tại cổng.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <p className="mb-2.5 font-mono text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Phương tiện &amp; Bãi tiếp nhận
          </p>
          <dl className="grid gap-3 sm:grid-cols-2">
            {vehicleAndLotItems.map((item) => (
              <div
                key={item.label}
                className={`rounded-xl border border-slate-200/80 bg-slate-50/70 px-3.5 py-2.5 ${
                  item.span2 ? 'sm:col-span-2' : ''
                }`}
              >
                <dt className="text-xs font-medium text-brand-muted">{item.label}</dt>
                <dd
                  className={`mt-1 text-sm font-semibold break-words text-slate-900 ${
                    item.mono ? 'font-mono tabular-nums' : ''
                  }`}
                >
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <p className="mb-2.5 font-mono text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Lịch hẹn &amp; Thời gian thực tế
          </p>
          <dl className="grid gap-3 sm:grid-cols-2">
            {scheduleItems.map((item) => (
              <div
                key={item.label}
                className={`rounded-xl border px-3.5 py-2.5 ${
                  item.highlightTone === 'emerald'
                    ? 'border-emerald-200/80 bg-emerald-50/50'
                    : 'border-slate-200/80 bg-slate-50/70'
                }`}
              >
                <dt
                  className={`text-xs font-medium ${
                    item.highlightTone === 'emerald' ? 'text-emerald-800' : 'text-brand-muted'
                  }`}
                >
                  {item.label}
                </dt>
                <dd
                  className={`mt-1 font-mono text-sm font-semibold tabular-nums ${
                    item.highlightTone === 'emerald' ? 'text-emerald-950' : 'text-slate-900'
                  }`}
                >
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Panel>
  )
}

export function MerchantBookingTariffAndRefundPanel({
  booking,
  remainingAmount,
}: {
  booking: Booking
  remainingAmount: number | null
}) {
  const surgeStart = formatBookingTimeOnly(booking.surgeStartTime)
  const surgeEnd = formatBookingTimeOnly(booking.surgeEndTime)

  const hasCancellationOrRefund = Boolean(
    booking.status === 'CANCELLED' ||
      booking.cancelledAt ||
      booking.cancellationReason ||
      typeof booking.refundAmount === 'number' ||
      typeof booking.refundPercentage === 'number' ||
      booking.refundPolicy ||
      booking.refundStatus ||
      booking.refundReference,
  )

  return (
    <Panel className="shadow-2xs">
      <div className="mb-5 flex items-start gap-2.5 border-b border-slate-100 pb-4">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-orange-200/80 bg-orange-50 text-[#d95f00]">
          <Receipt className="h-4 w-4" aria-hidden="true" />
        </div>
        <div>
          <h2 className="font-sora text-lg font-semibold text-brand-navy">
            Biểu phí áp dụng &amp; Hoàn tiền
          </h2>
          <p className="mt-0.5 text-xs text-brand-muted">
            Cấu trúc đơn giá áp dụng tại thời điểm đặt chỗ và chính sách hoàn hủy (nếu có).
          </p>
        </div>
      </div>

      {remainingAmount !== null && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-orange-200/80 bg-orange-50/70 px-4 py-3">
          <div>
            <p className="text-xs font-semibold text-[#9e4300]">Phần còn lại sau cọc</p>
            <p className="mt-0.5 text-xs text-[#9e4300]/80">
              Tính theo tổng phí đơn trừ đi khoản tiền cọc giữ chỗ đã ghi nhận.
            </p>
          </div>
          <p className="font-mono font-sora text-lg font-bold tabular-nums text-[#9e4300]">
            {formatBookingMoney(remainingAmount)}
          </p>
        </div>
      )}

      <dl className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 px-3.5 py-2.5">
          <dt className="text-xs font-medium text-brand-muted">Đơn giá theo giờ</dt>
          <dd className="mt-1 font-mono text-sm font-semibold tabular-nums text-slate-900">
            {typeof booking.hourlyRate === 'number'
              ? `${formatBookingMoney(booking.hourlyRate)} / giờ`
              : '—'}
          </dd>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 px-3.5 py-2.5">
          <dt className="text-xs font-medium text-brand-muted">Hệ số giờ cao điểm</dt>
          <dd className="mt-1 font-mono text-sm font-semibold tabular-nums text-slate-900">
            {typeof booking.surgeMultiplier === 'number'
              ? `x${booking.surgeMultiplier}`
              : 'Không áp dụng'}
          </dd>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 px-3.5 py-2.5">
          <dt className="text-xs font-medium text-brand-muted">Khung giờ cao điểm</dt>
          <dd className="mt-1 font-mono text-sm font-semibold tabular-nums text-slate-900">
            {surgeStart && surgeEnd ? `${surgeStart} – ${surgeEnd}` : 'Không áp dụng'}
          </dd>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 px-3.5 py-2.5">
          <dt className="text-xs font-medium text-brand-muted">Hệ số phạt quá giờ</dt>
          <dd className="mt-1 font-mono text-sm font-semibold tabular-nums text-slate-900">
            {typeof booking.overtimePenaltyMultiplier === 'number'
              ? `x${booking.overtimePenaltyMultiplier}`
              : 'Không áp dụng'}
          </dd>
        </div>
      </dl>

      <div
        className={`mt-6 rounded-xl border p-4 ${
          hasCancellationOrRefund
            ? 'border-rose-200 bg-rose-50/40'
            : 'border-slate-200 bg-slate-50/60'
        }`}
      >
        <div className="flex items-center gap-2">
          <AlertTriangle
            className={`h-4 w-4 ${
              hasCancellationOrRefund ? 'text-rose-600' : 'text-slate-500'
            }`}
            aria-hidden="true"
          />
          <h3 className="font-sora text-sm font-bold text-slate-900">
            Thông tin Hủy đơn &amp; Hoàn tiền
          </h3>
        </div>

        {hasCancellationOrRefund ? (
          <dl className="mt-3 grid gap-4 sm:grid-cols-2">
            {booking.cancelledAt && (
              <div>
                <dt className="text-xs font-medium text-brand-muted">Thời điểm hủy</dt>
                <dd className="mt-1 font-mono text-sm font-medium tabular-nums text-slate-900">
                  {formatBookingDateTime(booking.cancelledAt)}
                </dd>
              </div>
            )}
            {typeof booking.refundAmount === 'number' && (
              <div>
                <dt className="text-xs font-medium text-brand-muted">Số tiền hoàn</dt>
                <dd className="mt-1 font-mono text-sm font-medium tabular-nums text-slate-900">
                  {formatBookingMoney(booking.refundAmount)}
                </dd>
              </div>
            )}
            {typeof booking.refundPercentage === 'number' && (
              <div>
                <dt className="text-xs font-medium text-brand-muted">Tỷ lệ hoàn tiền</dt>
                <dd className="mt-1 font-mono text-sm font-medium tabular-nums text-slate-900">
                  {booking.refundPercentage}%
                </dd>
              </div>
            )}
            {booking.refundPolicy && (
              <div>
                <dt className="text-xs font-medium text-brand-muted">Chính sách hoàn tiền</dt>
                <dd className="mt-1 text-sm font-medium text-slate-900">
                  {booking.refundPolicy}
                </dd>
              </div>
            )}
            {booking.refundStatus && (
              <div>
                <dt className="text-xs font-medium text-brand-muted">Trạng thái hoàn tiền</dt>
                <dd className="mt-1 font-mono text-sm font-medium text-slate-900">
                  {booking.refundStatus}
                </dd>
              </div>
            )}
            {booking.refundReference && (
              <div>
                <dt className="text-xs font-medium text-brand-muted">Mã tham chiếu hoàn tiền</dt>
                <dd className="mt-1 font-mono text-sm font-medium text-slate-900">
                  {booking.refundReference}
                </dd>
              </div>
            )}
            {booking.cancellationReason && (
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium text-brand-muted">Lý do hủy đơn</dt>
                <dd className="mt-1 text-sm font-medium text-slate-900">
                  {booking.cancellationReason}
                </dd>
              </div>
            )}
          </dl>
        ) : (
          <p className="mt-2 text-xs leading-relaxed text-slate-600">
            Không phát sinh yêu cầu hủy đơn hoặc hoàn tiền trên đơn đặt chỗ này.
          </p>
        )}
      </div>
    </Panel>
  )
}

export function MerchantBookingDetailSidebar({
  booking,
  barrierSummary,
  copiedCode,
  isFetching,
  onCopyBookingCode,
}: MerchantBookingDetailSidebarProps) {
  const actionable = isActionableGateStatus(booking.status)

  return (
    <div className="space-y-6">
      <Panel className="shadow-2xs">
        <div className="mb-4 flex items-center gap-2.5 border-b border-slate-100 pb-3.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-orange-200/80 bg-orange-50 text-[#d95f00]">
            <QrCode className="h-4 w-4" aria-hidden="true" />
          </div>
          <h2 className="font-sora text-base font-semibold text-brand-navy">
            Kiểm soát tại cổng
          </h2>
        </div>

        <p className="mb-4 text-sm leading-relaxed text-brand-muted">
          {getGateControlGuidance(booking.status)}
        </p>

        <div className="mb-5 rounded-xl border border-slate-200/80 bg-slate-50/70 px-3.5 py-2.5 text-xs text-slate-700">
          <span className="font-semibold text-slate-900">Trạng thái cổng: </span>
          <span>{barrierSummary.gateModeSummary}</span>
        </div>

        <Link
          className={`${actionable ? button : secondary} w-full`}
          to={`/merchant/qr-scanner?code=${encodeURIComponent(booking.bookingCode)}&lot=${booking.parkingLotId ?? ''}`}
        >
          <span>Xử lý tại trạm QR →</span>
          <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
        </Link>
      </Panel>

      <Panel className="shadow-2xs">
        <div className="mb-4 flex items-center gap-2.5 border-b border-slate-100 pb-3.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-orange-200/80 bg-orange-50 text-[#d95f00]">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          </div>
          <h2 className="font-sora text-base font-semibold text-brand-navy">
            Đối soát &amp; Thao tác nhanh
          </h2>
        </div>

        <dl className="divide-y divide-slate-100 text-xs">
          <div className="flex items-center justify-between gap-2 py-2.5 first:pt-0">
            <dt className="text-brand-muted">Mã hồ sơ</dt>
            <dd className="font-mono font-semibold text-slate-900">#{booking.id}</dd>
          </div>
          <div className="flex items-center justify-between gap-2 py-2.5">
            <dt className="text-brand-muted">Mã bãi đỗ</dt>
            <dd className="font-mono font-semibold text-slate-900">
              {typeof booking.parkingLotId === 'number' ? `#${booking.parkingLotId}` : '—'}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-2 py-2.5">
            <dt className="text-brand-muted">Mã chủ bãi</dt>
            <dd className="font-mono font-semibold text-slate-900">
              {typeof booking.merchantId === 'number' ? `#${booking.merchantId}` : '—'}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-2 py-2.5 last:pb-0">
            <dt className="text-brand-muted">Đồng bộ dữ liệu</dt>
            <dd className="inline-flex items-center gap-1.5 font-medium text-slate-700">
              <span
                className={`h-2 w-2 rounded-full ${
                  isFetching ? 'animate-pulse bg-amber-500' : 'bg-emerald-500'
                }`}
                aria-hidden="true"
              />
              <span>{isFetching ? 'Đang làm mới...' : 'Đã đồng bộ máy chủ'}</span>
            </dd>
          </div>
        </dl>

        <div className="mt-5 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={() => onCopyBookingCode(booking.bookingCode)}
            className="inline-flex min-h-[40px] w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] cursor-pointer"
          >
            {copiedCode ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                <span>Đã sao chép mã vé</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Sao chép mã vé để tra cứu</span>
              </>
            )}
          </button>
        </div>
      </Panel>
    </div>
  )
}
