import { Receipt, Truck } from 'lucide-react'
import type { PendingTicketDto } from '../types/paymentCancelTypes'

interface PendingTicketSpecsCardProps {
  ticket: PendingTicketDto
}

export function PendingTicketSpecsCard({ ticket }: PendingTicketSpecsCardProps) {
  return (
    <div className="md:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between">
      <div>
        {/* Title & Status Badge */}
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-orange-600" />
            <h2 className="font-sora text-base sm:text-lg font-bold text-slate-900">
              CHI TIẾT VÉ CHỜ THANH TOÁN
            </h2>
          </div>
          <span className="px-2.5 py-0.5 bg-slate-100 text-slate-800 text-xs font-mono font-bold rounded-lg border border-slate-200">
            CHỜ CỌC
          </span>
        </div>

        {/* Tabular details */}
        <div className="space-y-2.5">
          {/* Row 1: Mã phiếu đặt */}
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-200/60">
            <span className="text-xs font-mono uppercase text-slate-500 font-semibold">
              Mã phiếu đặt
            </span>
            <span className="font-mono text-xs sm:text-sm text-slate-900 font-bold">
              {ticket.bookingCode}
            </span>
          </div>

          {/* Row 2: Địa điểm bãi */}
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-200/60">
            <span className="text-xs font-mono uppercase text-slate-500 font-semibold">
              Địa điểm bãi
            </span>
            <span className="text-xs sm:text-sm text-slate-900 text-right font-medium">
              {ticket.parkingLotName}
            </span>
          </div>

          {/* Row 3: Vị trí Berthing */}
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-200/60">
            <span className="text-xs font-mono uppercase text-slate-500 font-semibold">
              Vị trí Berthing
            </span>
            <span className="font-mono text-xs sm:text-sm text-orange-800 font-bold px-2.5 py-0.5 bg-orange-100 border border-orange-200 rounded-lg">
              {ticket.berthCode}
            </span>
          </div>

          {/* Row 4: Phương tiện đăng ký */}
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-200/60">
            <span className="text-xs font-mono uppercase text-slate-500 font-semibold">
              Phương tiện đăng ký
            </span>
            <div className="flex items-center gap-1.5 font-mono text-xs sm:text-sm text-slate-900 font-bold">
              <Truck className="w-4 h-4 text-slate-500" />
              <span>{ticket.vehiclePlate}</span>
            </div>
          </div>

          {/* Row 5: Loại rơ-moóc / Tải trọng */}
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-200/60">
            <span className="text-xs font-mono uppercase text-slate-500 font-semibold">
              Loại rơ-moóc / Tải trọng
            </span>
            <span className="font-mono text-xs sm:text-sm text-slate-800 font-medium">
              {ticket.trailerSpecs}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Deposit Summary */}
      <div className="mt-5 p-4 flex justify-between items-end bg-slate-100 rounded-xl border border-slate-200/80">
        <div className="flex flex-col">
          <span className="text-xs font-mono uppercase text-slate-600 font-semibold">
            Số tiền giữ chỗ bảo đảm
          </span>
          <span className="font-mono text-[11px] text-slate-500">
            Quy chuẩn bến bãi VIMC
          </span>
        </div>
        <div className="text-right">
          <span className="font-sora text-2xl font-bold text-slate-900">
            {ticket.depositAmount.toLocaleString('vi-VN')}{' '}
            <span className="text-sm font-normal text-slate-500">₫</span>
          </span>
        </div>
      </div>
    </div>
  )
}
