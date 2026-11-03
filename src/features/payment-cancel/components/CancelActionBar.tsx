import { Link } from 'react-router-dom'
import {
  QrCode,
  ArrowRight,
  Code2,
  XCircle,
  ArrowLeft,
  RotateCw,
} from 'lucide-react'

interface CancelActionBarProps {
  remainingTimeFormatted: string
  isExpired: boolean
  isRepaying: boolean
  onRepay: () => void
  onSandboxConfirm: () => void
  onReleaseSlot: () => void
}

export function CancelActionBar({
  remainingTimeFormatted,
  isExpired,
  isRepaying,
  onRepay,
  onSandboxConfirm,
  onReleaseSlot,
}: CancelActionBarProps) {
  return (
    <div className="flex flex-col gap-3 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs">
      {/* Primary Action Button (Big Orange) */}
      <button
        type="button"
        id="btn-repay"
        disabled={isExpired || isRepaying}
        onClick={onRepay}
        className="w-full h-[52px] bg-orange-600 hover:bg-orange-700 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-mono text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-xs cursor-pointer px-4"
      >
        {isRepaying ? (
          <>
            <RotateCw className="w-5 h-5 animate-spin" />
            <span>ĐANG KẾT NỐI LẠI PAYOS...</span>
          </>
        ) : (
          <>
            <QrCode className="w-5 h-5 text-white" />
            <span>
              THANH TOÁN LẠI NGAY QUA VIETQR PAYOS{' '}
              {isExpired ? '(ĐÃ HẾT HẠN)' : `(CÒN ${remainingTimeFormatted})`}
            </span>
            <ArrowRight className="w-4 h-4 text-white" />
          </>
        )}
      </button>

      {/* Secondary & Utility Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Sandbox Testing */}
        <button
          type="button"
          id="btn-sandbox"
          onClick={onSandboxConfirm}
          className="h-11 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-slate-200 cursor-pointer px-3"
        >
          <Code2 className="w-4 h-4 text-orange-600" />
          <span>XÁC NHẬN CỌC DEMO (SANDBOX)</span>
        </button>

        {/* Release Slot Early */}
        <button
          type="button"
          id="btn-release"
          onClick={onReleaseSlot}
          className="h-11 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-rose-200 cursor-pointer px-3"
        >
          <XCircle className="w-4 h-4 text-rose-600" />
          <span>HỦY ĐẶT &amp; TRẢ SLOT VỀ HÀNG ĐỢI</span>
        </button>

        {/* Return to Bookings */}
        <Link
          to="/bookings"
          className="h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs px-3"
        >
          <ArrowLeft className="w-4 h-4 text-slate-300" />
          <span>QUAY LẠI QUẢN LÝ ĐẶT CHỖ</span>
        </Link>
      </div>
    </div>
  )
}
