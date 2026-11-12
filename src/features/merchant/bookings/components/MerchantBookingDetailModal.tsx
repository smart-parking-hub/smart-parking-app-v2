import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Clock,
  Copy,
  ExternalLink,
  MapPin,
  Receipt,
  RefreshCw,
  Truck,
} from 'lucide-react'
import type { Booking } from '@/entities/operations'
import { errorMessage } from '@/shared/api/resources'
import { Alert } from '@/shared/components/Alert'
import { Badge } from '@/shared/components/Badge'
import { Modal } from '@/shared/components/Modal'
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
import { useMerchantBookingDetailQuery } from '../hooks/useMerchantBookingsQuery'

interface MerchantBookingDetailModalProps {
  bookingSnapshot: Booking | null
  isOpen: boolean
  onClose: () => void
  onCopyBookingCode: (bookingCode: string) => void
}

function DetailItem({
  label,
  value,
  mono = false,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div>
      <dt className="text-xs font-medium text-slate-500">{label}</dt>
      <dd
        className={`mt-1 text-sm font-semibold text-slate-900 break-words ${
          mono ? 'font-mono tabular-nums' : ''
        }`}
      >
        {value}
      </dd>
    </div>
  )
}

export function MerchantBookingDetailModal({
  bookingSnapshot,
  isOpen,
  onClose,
  onCopyBookingCode,
}: MerchantBookingDetailModalProps) {
  const [copiedJustNow, setCopiedJustNow] = useState(false)

  const detailQuery = useMerchantBookingDetailQuery(
    isOpen ? bookingSnapshot?.id : null,
    bookingSnapshot,
  )

  const booking = detailQuery.data ?? bookingSnapshot

  const handleCopyCode = async (code: string) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code)
      }
    } catch {
      // Clipboard API may be unavailable in restricted contexts; still emit toast confirmation.
    }
    setCopiedJustNow(true)
    onCopyBookingCode(code)
    window.setTimeout(() => {
      setCopiedJustNow(false)
    }, 1800)
  }

  const surgeStart = booking ? formatBookingTimeOnly(booking.surgeStartTime) : null
  const surgeEnd = booking ? formatBookingTimeOnly(booking.surgeEndTime) : null

  const remainingAmount =
    booking &&
    typeof booking.totalAmount === 'number' &&
    Number.isFinite(booking.totalAmount) &&
    typeof booking.advanceDeposit === 'number' &&
    Number.isFinite(booking.advanceDeposit)
      ? Math.max(0, booking.totalAmount - booking.advanceDeposit)
      : null

  const driverName = booking ? resolveBookingDriverName(booking) : null
  const driverPhone = booking ? resolveBookingDriverPhone(booking) : null

  const hasCancellationOrRefund = Boolean(
    booking &&
      (booking.status === 'CANCELLED' ||
        booking.cancelledAt ||
        booking.cancellationReason ||
        typeof booking.refundAmount === 'number' ||
        typeof booking.refundPercentage === 'number' ||
        booking.refundPolicy ||
        booking.refundStatus ||
        booking.refundReference),
  )

  return (
    <Modal isOpen={isOpen && Boolean(booking)} onClose={onClose} maxWidth="full">
      {booking && (
        <div className="space-y-6">
          {/* Header Strip */}
          <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 pr-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-semibold tracking-wider text-slate-500 uppercase">
                Hồ sơ đơn đặt chỗ #{booking.id}
              </span>
              <Badge value={booking.status} dot size="md" />
              {detailQuery.isFetching && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                  <RefreshCw className="w-3 h-3 animate-spin" aria-hidden="true" />
                  <span>Đang đồng bộ hồ sơ...</span>
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-mono font-sora text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {booking.bookingCode}
              </h2>
              <button
                type="button"
                onClick={() => void handleCopyCode(booking.bookingCode)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] transition-colors cursor-pointer"
              >
                {copiedJustNow ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                    <span>Đã chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Sao chép mã</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-500">
              Khởi tạo lúc:{' '}
              <span className="font-medium text-slate-700 tabular-nums">
                {formatBookingDateTime(booking.createdAt)}
              </span>
            </p>
          </div>

          {/* Non-blocking sync warning if detail fetch failed while snapshot exists */}
          {detailQuery.isError && (
            <Alert
              variant="warning"
              title="Chưa đồng bộ được dữ liệu mới nhất từ máy chủ"
              action={
                <button
                  type="button"
                  onClick={() => void detailQuery.refetch()}
                  className="rounded-lg border border-amber-300 bg-white px-2.5 py-1 text-xs font-semibold text-amber-900 hover:bg-amber-50 cursor-pointer"
                >
                  Thử lại
                </button>
              }
            >
              {errorMessage(detailQuery.error)}. Đang hiển thị bản ghi từ danh sách hiện tại.
            </Alert>
          )}

          {/* Top Financial Highlight Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
              <p className="text-xs font-medium text-slate-500">Tiền đặt cọc</p>
              <p className="mt-1.5 font-mono font-sora text-base sm:text-lg font-bold tabular-nums text-slate-900">
                {formatBookingMoney(booking.advanceDeposit)}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
              <p className="text-xs font-medium text-slate-500">Tổng tiền đơn</p>
              <p className="mt-1.5 font-mono font-sora text-base sm:text-lg font-bold tabular-nums text-slate-900">
                {formatBookingMoney(booking.totalAmount)}
              </p>
            </div>

            <div className="rounded-xl border border-orange-200/80 bg-orange-50/60 p-3.5">
              <p className="text-xs font-medium text-[#9e4300]">Phần còn lại sau cọc</p>
              <p className="mt-1.5 font-mono font-sora text-base sm:text-lg font-bold tabular-nums text-[#9e4300]">
                {formatBookingMoney(remainingAmount)}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
              <p className="text-xs font-medium text-slate-500">Đơn giá cơ bản / giờ</p>
              <p className="mt-1.5 font-mono font-sora text-base sm:text-lg font-bold tabular-nums text-slate-900">
                {formatBookingMoney(booking.hourlyRate)}
              </p>
            </div>
          </div>

          {/* Structured Full-Detail Sections */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Section 1: Phương tiện & Tài xế */}
            <section
              aria-label="Thông tin phương tiện và tài xế"
              className="rounded-xl border border-slate-200 bg-white p-4 space-y-3"
            >
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <Truck className="w-4 h-4 text-[#d95f00]" aria-hidden="true" />
                <h3 className="font-sora text-sm font-bold text-slate-900">
                  Phương tiện & Tài xế
                </h3>
              </div>

              <dl className="grid grid-cols-2 gap-3.5">
                <DetailItem label="Biển kiểm soát" value={resolveBookingPlate(booking)} mono />
                <DetailItem
                  label="Phân loại xe"
                  value={resolveVehicleTypeLabel(booking.vehicleType)}
                />
                <DetailItem
                  label="Mã phương tiện"
                  value={
                    typeof booking.vehicleId === 'number' ? `#${booking.vehicleId}` : '—'
                  }
                  mono
                />
                <DetailItem
                  label="Mã tài xế"
                  value={
                    typeof booking.driverId === 'number' ? `#${booking.driverId}` : '—'
                  }
                  mono
                />
                {driverName && <DetailItem label="Tên tài xế / khách" value={driverName} />}
                {driverPhone && <DetailItem label="Số điện thoại" value={driverPhone} mono />}
              </dl>
            </section>

            {/* Section 2: Bãi đỗ tiếp nhận */}
            <section
              aria-label="Thông tin bãi đỗ tiếp nhận"
              className="rounded-xl border border-slate-200 bg-white p-4 space-y-3"
            >
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <MapPin className="w-4 h-4 text-[#d95f00]" aria-hidden="true" />
                <h3 className="font-sora text-sm font-bold text-slate-900">
                  Bãi đỗ tiếp nhận
                </h3>
              </div>

              <dl className="grid grid-cols-2 gap-3.5">
                <div className="col-span-2">
                  <DetailItem label="Tên bãi đỗ" value={booking.parkingLotName || '—'} />
                </div>
                <div className="col-span-2">
                  <DetailItem
                    label="Địa chỉ bãi đỗ"
                    value={booking.parkingLotAddress || 'Theo hồ sơ bãi đỗ'}
                  />
                </div>
                <DetailItem
                  label="Mã bãi đỗ"
                  value={
                    typeof booking.parkingLotId === 'number'
                      ? `#${booking.parkingLotId}`
                      : '—'
                  }
                  mono
                />
                <DetailItem
                  label="Mã chủ bãi"
                  value={
                    typeof booking.merchantId === 'number'
                      ? `#${booking.merchantId}`
                      : '—'
                  }
                  mono
                />
              </dl>
            </section>

            {/* Section 3: Mốc thời gian hành trình */}
            <section
              aria-label="Mốc thời gian hành trình"
              className="rounded-xl border border-slate-200 bg-white p-4 space-y-3"
            >
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <Clock className="w-4 h-4 text-[#d95f00]" aria-hidden="true" />
                <h3 className="font-sora text-sm font-bold text-slate-900">
                  Mốc thời gian hành trình
                </h3>
              </div>

              <dl className="grid grid-cols-2 gap-3.5">
                <DetailItem
                  label="Dự kiến vào bãi"
                  value={formatBookingDateTime(booking.expectedCheckInTime)}
                  mono
                />
                <DetailItem
                  label="Dự kiến rời bãi"
                  value={formatBookingDateTime(booking.expectedCheckOutTime)}
                  mono
                />
                <DetailItem
                  label="Thực tế vào bãi (Check-in)"
                  value={formatBookingDateTime(booking.checkInTime, 'Chưa check-in')}
                  mono
                />
                <DetailItem
                  label="Thực tế rời bãi (Check-out)"
                  value={formatBookingDateTime(booking.checkOutTime, 'Chưa check-out')}
                  mono
                />
                <DetailItem
                  label="Thời điểm tạo vé"
                  value={formatBookingDateTime(booking.createdAt)}
                  mono
                />
                <DetailItem
                  label="Hạn giữ chỗ / thanh toán"
                  value={formatBookingDateTime(booking.expiresAt)}
                  mono
                />
              </dl>
            </section>

            {/* Section 4: Biểu phí & Chính sách tính giờ */}
            <section
              aria-label="Biểu phí và chính sách tính giờ"
              className="rounded-xl border border-slate-200 bg-white p-4 space-y-3"
            >
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <Receipt className="w-4 h-4 text-[#d95f00]" aria-hidden="true" />
                <h3 className="font-sora text-sm font-bold text-slate-900">
                  Biểu phí áp dụng
                </h3>
              </div>

              <dl className="grid grid-cols-2 gap-3.5">
                <DetailItem
                  label="Giá theo giờ"
                  value={
                    typeof booking.hourlyRate === 'number'
                      ? `${formatBookingMoney(booking.hourlyRate)} / giờ`
                      : '—'
                  }
                  mono
                />
                <DetailItem
                  label="Hệ số giờ cao điểm"
                  value={
                    typeof booking.surgeMultiplier === 'number'
                      ? `x${booking.surgeMultiplier}`
                      : 'Không áp dụng'
                  }
                  mono
                />
                <DetailItem
                  label="Khung giờ cao điểm"
                  value={surgeStart && surgeEnd ? `${surgeStart} – ${surgeEnd}` : 'Không áp dụng'}
                  mono
                />
                <DetailItem
                  label="Hệ số phạt quá giờ"
                  value={
                    typeof booking.overtimePenaltyMultiplier === 'number'
                      ? `x${booking.overtimePenaltyMultiplier}`
                      : 'Không áp dụng'
                  }
                  mono
                />
              </dl>
            </section>
          </div>

          {/* Section 5: Hủy đơn & Hoàn tiền */}
          <section
            aria-label="Thông tin hủy đơn và hoàn tiền"
            className={`rounded-xl border p-4 space-y-3 ${
              hasCancellationOrRefund
                ? 'border-rose-200 bg-rose-50/40'
                : 'border-slate-200 bg-slate-50/60'
            }`}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle
                className={`w-4 h-4 ${
                  hasCancellationOrRefund ? 'text-rose-600' : 'text-slate-500'
                }`}
                aria-hidden="true"
              />
              <h3 className="font-sora text-sm font-bold text-slate-900">
                Thông tin Hủy đơn & Hoàn tiền
              </h3>
            </div>

            {hasCancellationOrRefund ? (
              <dl className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-1">
                <DetailItem
                  label="Thời điểm hủy"
                  value={formatBookingDateTime(booking.cancelledAt)}
                  mono
                />
                <DetailItem
                  label="Số tiền hoàn"
                  value={formatBookingMoney(booking.refundAmount)}
                  mono
                />
                <DetailItem
                  label="Tỷ lệ hoàn tiền"
                  value={
                    typeof booking.refundPercentage === 'number'
                      ? `${booking.refundPercentage}%`
                      : '—'
                  }
                  mono
                />
                <DetailItem
                  label="Trạng thái hoàn tiền"
                  value={booking.refundStatus || '—'}
                />
                <DetailItem
                  label="Chính sách hoàn tiền"
                  value={booking.refundPolicy || '—'}
                />
                <DetailItem
                  label="Mã tham chiếu giao dịch hoàn"
                  value={booking.refundReference || '—'}
                  mono
                />
                <div className="col-span-2 sm:col-span-3">
                  <DetailItem
                    label="Lý do hủy đơn"
                    value={booking.cancellationReason || 'Không ghi nhận lý do'}
                  />
                </div>
              </dl>
            ) : (
              <p className="text-xs sm:text-sm text-slate-600">
                Không phát sinh yêu cầu hủy đơn hoặc hoàn tiền trên đơn đặt chỗ này.
              </p>
            )}
          </section>

          {/* Modal Footer Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
            <Link
              to={`/merchant/bookings/${booking.id}`}
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#9e4300] transition-colors"
            >
              <span>Mở trang hồ sơ rời</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>

            <div className="flex flex-wrap items-center gap-2.5 ml-auto">
              <Link
                to={`/merchant/qr-scanner?code=${encodeURIComponent(booking.bookingCode)}&lot=${booking.parkingLotId ?? ''}`}
                onClick={onClose}
                className={`inline-flex min-h-[40px] items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-1 ${
                  isActionableGateStatus(booking.status)
                    ? 'bg-[#d95f00] text-white hover:bg-[#b84e00]'
                    : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>Xử lý tại trạm QR</span>
                <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
              </Link>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex min-h-[40px] items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}

