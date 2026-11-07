import { Link } from 'react-router-dom'
import {
  QrCode,
  ArrowRight,
  Code2,
  XCircle,
  ArrowLeft,
  RotateCw,
  Compass,
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
      {/* Expired Notification Banner */}
      {isExpired && (
        <div
          role="status"
          className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs sm:text-sm font-sans flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
            <span>Thời gian giữ chỗ tạm thời đã hết hạn. Vui lòng quay lại danh sách bãi xe để chọn vị trí mới.</span>
          </div>
          <Link
            to="/parking"
            className="shrink-0 font-bold text-amber-900 underline hover:text-brand-orange transition-colors"
          >
            Tìm bãi khác →
          </Link>
        </div>
      )}

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

      {/* Secondary & Safe Exit Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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

        {/* Safe Exit: Return to Parking Search */}
        <Link
          to="/parking"
          id="btn-back-parking"
          className="h-11 bg-brand-orange hover:bg-brand-orange-hover text-[#060D1A] rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs px-3"
        >
          <Compass className="w-4 h-4 text-[#060D1A]" />
          <span>QUAY LẠI DANH SÁCH BÃI XE</span>
        </Link>

        {/* Return to Bookings */}
        <Link
          to="/bookings"
          id="btn-back-bookings"
          className="h-11 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs px-3"
        >
          <ArrowLeft className="w-4 h-4 text-slate-300" />
          <span>QUAY LẠI QUẢN LÝ ĐẶT CHỖ</span>
        </Link>
      </div>
    </div>
  )
}
