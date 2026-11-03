import type { BookingItemDto } from '../types/bookingTypes'

interface TariffAuditTableProps {
  booking: BookingItemDto
}

export function TariffAuditTable({ booking }: TariffAuditTableProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' đ'
  }

  const baseRate = booking.baseRatePerHour || 40000
  const durationText = booking.actualDurationText || 'Dự kiến đỗ'
  const subtotal = booking.parkingSubtotal || baseRate * (booking.actualDurationHours || 4)
  const reeferTotal = booking.reeferSubtotal || 0
  const deposit = booking.depositPaid || 0
  const remaining = booking.remainingFinalPayment

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden">
      {/* Header of Audit Table */}
      <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-800">
          BẢNG ĐỐI SOÁT CƯỚC PHÍ CHI TIẾT
        </span>
        <span className="font-mono text-[11px] text-slate-500">
          TÍNH THEO THỰC TẾ LƯU BÃI
        </span>
      </div>

      <div className="p-4 flex flex-col gap-2">
        {/* Row 1: Base Rate */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100 text-xs">
          <div className="flex flex-col">
            <span className="font-semibold text-slate-800">Giá cơ bản niêm yết</span>
            <span className="text-[11px] text-slate-400">
              Áp dụng cho {booking.vehicleType} tại {booking.parkingLotName}
            </span>
          </div>
          <span className="font-mono font-semibold text-slate-900">
            {formatCurrency(baseRate)}/giờ
          </span>
        </div>

        {/* Row 2: Duration */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100 text-xs">
          <div className="flex flex-col">
            <span className="font-semibold text-slate-800">Thời gian đỗ thực tế</span>
            <span className="text-[11px] text-slate-400">{durationText}</span>
          </div>
          <span className="font-mono font-semibold text-slate-900">
            {formatCurrency(subtotal)}
          </span>
        </div>

        {/* Row 3: Reefer power surcharge if applicable */}
        {booking.hasReefer && reeferTotal > 0 && (
          <div className="flex items-center justify-between py-2 border-b border-slate-100 text-xs">
            <div className="flex flex-col">
              <span className="font-semibold text-slate-800">
                Phụ phí cắm điện lạnh 380V Reefer
              </span>
              <span className="text-[11px] text-slate-400">
                Ổ cắm {booking.berthCode} ({booking.reeferHours} giờ liên tục × {formatCurrency(booking.reeferHourlyRate || 20000)}/h)
              </span>
            </div>
            <span className="font-mono font-semibold text-slate-900">
              +{formatCurrency(reeferTotal)}
            </span>
          </div>
        )}

        {/* Row 4: Deposit Deduction */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100 text-xs">
          <div className="flex flex-col">
            <span className="font-semibold text-slate-800">
              Tiền cọc giữ slot đã thanh toán
            </span>
            <span className="text-[11px] text-slate-400">
              Giao dịch PayOS VietQR • Ref: PO-89012
            </span>
          </div>
          <span className="font-mono font-semibold text-emerald-700">
            -{formatCurrency(deposit)}
          </span>
        </div>

        {/* Total Highlight Row */}
        <div className="bg-slate-50 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-1 border border-slate-200/80">
          <div>
            <span className="font-mono text-xs font-bold uppercase text-slate-900 block">
              TỔNG TIỀN CẦN THANH TOÁN XUẤT CỔNG:
            </span>
            <span className="text-[11px] text-slate-500">
              Đã khấu trừ toàn bộ tiền cọc {formatCurrency(deposit)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-[#d95f00] font-mono tracking-tight">
              {formatCurrency(remaining)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
