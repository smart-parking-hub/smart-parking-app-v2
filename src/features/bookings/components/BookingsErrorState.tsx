import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

interface BookingsErrorStateProps {
  errorCode?: string
  errorMessage?: string
  onRetry: () => void
}

export function BookingsErrorState({
  errorCode = 'ERR_BOOKINGS_FETCH_FAILED',
  errorMessage = 'Đã có lỗi xảy ra khi nạp danh sách đơn đặt chỗ từ máy chủ.',
  onRetry,
}: BookingsErrorStateProps) {
  return (
    <div
      role="alert"
      aria-label="Lỗi tải danh sách đặt chỗ"
      className="w-full py-16 px-6 flex items-center justify-center bg-white rounded-2xl border border-red-200/90 shadow-xs"
    >
      <div className="max-w-md w-full text-center flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-500 shadow-xs">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <span className="text-[11px] font-mono font-bold text-red-600 uppercase tracking-wider">
            {errorCode}
          </span>
          <h3 className="text-lg font-bold text-slate-900">
            Không Thể Tải Danh Sách Đặt Chỗ
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">{errorMessage}</p>
        </div>

        <div className="w-full pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#d95f00] hover:bg-[#b84e00] text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>THỬ LẠI NGAY</span>
          </button>

          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
            <span>Về Trang Tổng Quan (SCR-014)</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

