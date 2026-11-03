import { CheckCircle2, Circle } from 'lucide-react'
import type { BookingStatus } from '../types/bookingTypes'

interface BookingBentoStepperProps {
  status: BookingStatus
  createdAtText?: string
  depositPaid?: number
  durationText?: string
}

export function BookingBentoStepper({
  status,
  createdAtText = '13:50',
  depositPaid = 100000,
}: BookingBentoStepperProps) {
  // Determine active/completed states
  const isStep1Done = status !== 'EXPIRED' && status !== 'CANCELLED'
  const isStep2Done = status !== 'PENDING_PAYMENT' && isStep1Done
  const isStep3Active = status === 'PARKING' || status === 'OVERTIME' || status === 'AWAITING_FINAL_PAYMENT'
  const isStep3Done = status === 'COMPLETED' || status === 'REVIEWED'
  const isStep4Active = status === 'AWAITING_FINAL_PAYMENT'
  const isStep4Done = status === 'COMPLETED' || status === 'REVIEWED'

  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
        TIẾN TRÌNH VẬN HÀNH BẾN BÃI
      </span>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
        {/* Step 1 */}
        <div
          className={`p-2.5 rounded-lg border flex flex-col gap-1 ${
            isStep1Done ? 'bg-slate-50 border-slate-200' : 'bg-slate-50/50 border-slate-200/50 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-bold text-slate-800">BƯỚC 01</span>
            {isStep1Done ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <Circle className="w-4 h-4 text-slate-300" />
            )}
          </div>
          <span className="text-xs font-bold text-slate-900 leading-tight">Khóa slot 10p</span>
          <span className="text-[11px] font-mono text-slate-500">Hoàn tất {createdAtText}</span>
        </div>

        {/* Step 2 */}
        <div
          className={`p-2.5 rounded-lg border flex flex-col gap-1 ${
            isStep2Done
              ? 'bg-slate-50 border-slate-200'
              : status === 'PENDING_PAYMENT'
                ? 'bg-amber-50 border-amber-300 ring-1 ring-amber-300'
                : 'bg-slate-50/50 border-slate-200/50 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-bold text-slate-800">BƯỚC 02</span>
            {isStep2Done ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <Circle className="w-4 h-4 text-slate-300" />
            )}
          </div>
          <span className="text-xs font-bold text-slate-900 leading-tight">Cọc PayOS &amp; QR</span>
          <span className="text-[11px] font-mono text-slate-500">
            {isStep2Done ? `Đã cọc ${(depositPaid / 1000).toFixed(0)}K` : 'Chờ cọc'}
          </span>
        </div>

        {/* Step 3 */}
        <div
          className={`p-2.5 rounded-lg border flex flex-col gap-1 shadow-2xs ${
            isStep3Active
              ? 'bg-[#fff7ed] border-[#d95f00] ring-1 ring-[#d95f00]'
              : isStep3Done
                ? 'bg-slate-50 border-slate-200'
                : 'bg-slate-50/50 border-slate-200/50 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`font-mono text-[11px] font-bold ${
                isStep3Active ? 'text-[#d95f00]' : 'text-slate-800'
              }`}
            >
              BƯỚC 03
            </span>
            {isStep3Active ? (
              <span className="w-2 h-2 rounded-full bg-[#d95f00] animate-pulse" />
            ) : isStep3Done ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <Circle className="w-4 h-4 text-slate-300" />
            )}
          </div>
          <span
            className={`text-xs font-bold leading-tight ${
              isStep3Active ? 'text-[#d95f00]' : 'text-slate-900'
            }`}
          >
            Đang đỗ thực tế
          </span>
          <span
            className={`text-[11px] font-mono font-semibold ${
              isStep3Active ? 'text-[#d95f00]' : 'text-slate-500'
            }`}
          >
            {isStep3Active ? 'ĐANG DIỄN RA (3h45)' : isStep3Done ? 'Đã hoàn tất' : 'Chờ check-in'}
          </span>
        </div>

        {/* Step 4 */}
        <div
          className={`p-2.5 rounded-lg border flex flex-col gap-1 ${
            isStep4Done
              ? 'bg-slate-50 border-slate-200'
              : isStep4Active
                ? 'bg-amber-50 border-amber-400'
                : 'bg-slate-50/50 border-slate-200/30 opacity-70'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-bold text-slate-500">BƯỚC 04</span>
            {isStep4Done ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <Circle className="w-4 h-4 text-slate-300" />
            )}
          </div>
          <span className="text-xs font-bold text-slate-700 leading-tight">Tất toán xuất bãi</span>
          <span className="text-[11px] font-mono text-slate-400">
            {isStep4Done ? 'Đã xuất bãi' : 'Cổng Out Barie'}
          </span>
        </div>
      </div>
    </div>
  )
}
