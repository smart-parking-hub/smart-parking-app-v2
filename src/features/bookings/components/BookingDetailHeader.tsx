import { Download, FileText, Loader2 } from 'lucide-react'
import type { BookingItemDto } from '../types/bookingTypes'

interface BookingDetailHeaderProps {
  booking: BookingItemDto
  onDownloadQr: () => void
  isDownloadingQr?: boolean
  onExportInvoice?: () => void
}

export function BookingDetailHeader({
  booking,
  onDownloadQr,
  isDownloadingQr,
  onExportInvoice,
}: BookingDetailHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
      <div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="font-mono text-2xl font-bold text-slate-900">
            {booking.bookingCode}
          </span>
          <span
            className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase tracking-wide ${
              booking.status === 'PARKING'
                ? 'bg-[#d95f00] text-white'
                : booking.status === 'PENDING_PAYMENT'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-slate-100 text-slate-800'
            }`}
          >
            {booking.status === 'PARKING' ? 'VÉ ĐANG ĐỖ HỢP LỆ' : booking.statusBadgeLabel}
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Tạo lúc: {booking.createdAtText} • Barie IN: {booking.gateInName || 'Cổng chính'} • ALPR: {booking.alprMatchRate || 'Khớp 100%'}
        </p>
      </div>

      {/* Action Export Buttons */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onDownloadQr}
          disabled={isDownloadingQr}
          className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
        >
          {isDownloadingQr ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#d95f00]" />
          ) : (
            <Download className="w-4 h-4 text-slate-600" />
          )}
          <span>TẢI VÉ QR (PNG)</span>
        </button>

        <button
          type="button"
          onClick={onExportInvoice}
          className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
        >
          <FileText className="w-4 h-4 text-slate-600" />
          <span>XUẤT HÓA ĐƠN VAT</span>
        </button>
      </div>
    </div>
  )
}
