import { forwardRef } from 'react'
import { ShieldCheck } from 'lucide-react'
import type { BookingItemDto } from '../types/bookingTypes'
import { BookingDetailHeader } from './BookingDetailHeader'
import { BookingBentoStepper } from './BookingBentoStepper'
import { BookingQrTerminalPanel } from './BookingQrTerminalPanel'
import { TariffAuditTable } from './TariffAuditTable'
import { BookingActionCommands } from './BookingActionCommands'

interface BookingDetailViewProps {
  booking: BookingItemDto
  onDownloadQr: () => void
  isDownloadingQr?: boolean
  onExportInvoice?: () => void
  onPayFinal: () => void
  onPayDeposit: () => void
  onCancelBooking: () => void
  onOpenReview: () => void
  onPayCashAtGate?: () => void
  onOpenMapDirections?: () => void
}

export const BookingDetailView = forwardRef<SVGSVGElement, BookingDetailViewProps>(
  (
    {
      booking,
      onDownloadQr,
      isDownloadingQr,
      onExportInvoice,
      onPayFinal,
      onPayDeposit,
      onCancelBooking,
      onOpenReview,
      onPayCashAtGate,
      onOpenMapDirections,
    },
    ref
  ) => {
    return (
      <section aria-label="Chi tiết vé điện tử" className="lg:col-span-7 flex flex-col gap-4">
        {/* Detail Header & Stepper Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs flex flex-col gap-4">
          <BookingDetailHeader
            booking={booking}
            onDownloadQr={onDownloadQr}
            isDownloadingQr={isDownloadingQr}
            onExportInvoice={onExportInvoice}
          />
          <BookingBentoStepper
            status={booking.status}
            createdAtText={booking.createdAtText}
            depositPaid={booking.depositPaid}
            durationText={booking.actualDurationText}
          />
        </div>

        {/* Central QR Check-in Terminal Panel */}
        <BookingQrTerminalPanel ref={ref} booking={booking} />

        {/* Tariff Audit & Reconciliation Table */}
        <TariffAuditTable booking={booking} />

        {/* Terminal Action Commands */}
        <BookingActionCommands
          booking={booking}
          onPayFinal={onPayFinal}
          onPayDeposit={onPayDeposit}
          onCancelBooking={onCancelBooking}
          onOpenReview={onOpenReview}
          onPayCashAtGate={onPayCashAtGate}
          onOpenMapDirections={onOpenMapDirections}
        />

        {/* SmartTruck Guarantee & Refund Policy Box */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#d95f00] shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1 text-xs">
            <span className="font-bold text-slate-900 uppercase tracking-wide">
              Chính sách bảo chứng SmartTruck &amp; Quy định hoàn cọc
            </span>
            <p className="text-slate-600 leading-relaxed">
              Chính sách SmartTruck: Hoàn 100% tiền cọc tự động nếu hủy trước giờ check-in tối thiểu 60 phút. Sau thời gian này, cọc được bảo lưu hoặc đền bù thiệt hại cho chủ bãi theo quy chuẩn vận tải container công nghiệp.
            </p>
          </div>
        </div>
      </section>
    )
  }
)

BookingDetailView.displayName = 'BookingDetailView'
