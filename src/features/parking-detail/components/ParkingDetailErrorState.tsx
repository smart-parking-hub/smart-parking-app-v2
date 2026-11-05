import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

interface ParkingDetailErrorStateProps {
  errorMessage?: string
  onRetry: () => void
}

export function ParkingDetailErrorState({
  errorMessage = 'Đã có lỗi xảy ra khi tải dữ liệu bãi đỗ xe.',
  onRetry,
}: ParkingDetailErrorStateProps) {
  return (
    <div
      role="alert"
      aria-label="Lỗi tải dữ liệu bãi đỗ xe"
      className="w-full min-h-[60vh] flex items-center justify-center p-6 bg-[#f8f9ff]"
    >
      <div className="max-w-md w-full bg-white rounded-2xl border border-red-200 shadow-sm p-8 text-center flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-red-600">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-mono font-bold text-red-600 uppercase tracking-wider">
            LỖI KẾT NỐI HỆ THỐNG
          </span>
          <h2 className="text-xl font-bold text-slate-900">
            Không Thể Tải Chi Tiết Bãi Xe
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">{errorMessage}</p>
        </div>

        <div className="w-full pt-2 flex flex-col gap-2">
          <button
            type="button"
            onClick={onRetry}
            className="w-full bg-[#d95f00] hover:bg-[#b84e00] text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>THỬ LẠI NGAY</span>
          </button>

          <Link
            to="/dashboard/search"
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>QUAY LẠI TÌM KIẾM BÃI ĐỖ (SCR-015)</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
