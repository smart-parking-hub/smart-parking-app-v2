import { Link } from 'react-router-dom'
import {
  RotateCw,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ArrowRight,
  RefreshCw,
  Sparkles,
} from 'lucide-react'
import type { PaymentSyncState } from '../types/paymentReturnTypes'

interface PaymentStatusResultStateProps {
  state: PaymentSyncState
  message: string
  bookingId?: number
  onConfirmDemo: () => void
  onRetrySync: () => void
}

export function PaymentStatusResultState({
  state,
  message,
  bookingId,
  onConfirmDemo,
  onRetrySync,
}: PaymentStatusResultStateProps) {
  if (state === 'syncing' || state === 'idle') {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-md w-full flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-orange-100/80 text-orange-600 flex items-center justify-center mb-4">
            <RotateCw className="w-8 h-8 animate-spin" />
          </div>
          <h2 className="font-sora text-lg font-bold text-slate-900 mb-2">
            Đang Đối Soát Dữ Liệu PayOS
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mb-4">
            Đang đồng bộ thanh toán PayOS với hệ thống điều vận…
          </p>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-orange-600 h-1.5 rounded-full animate-pulse w-3/4" />
          </div>
        </div>
      </main>
    )
  }

  if (state === 'cancelled') {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-lg w-full flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mb-4">
            <XCircle className="w-8 h-8 text-slate-600" />
          </div>
          <h2 className="font-sora text-xl font-bold text-slate-900 mb-2">
            Đã Hủy Giao Dịch Thanh Toán
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
            {message || 'Bạn đã hủy thanh toán trên cổng PayOS. Giữ chỗ chưa được kích hoạt.'}
          </p>

          <Link
            to="/bookings"
            className="h-11 px-6 bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 transition-all shadow-xs"
          >
            <span>VỀ ĐẶT CHỖ CỦA TÔI</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    )
  }

  // Pending / Error state
  const isPending = state === 'pending'

  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-xl w-full flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-100/80 text-amber-600 flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="font-sora text-xl font-bold text-slate-900 mb-2">
          {isPending ? 'Chưa Ghi Nhận Xong Giao Dịch' : 'Không Đồng Bộ Được Với PayOS'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
          {message || 'Hệ thống chưa nhận được phản hồi thanh toán thành công từ ngân hàng.'}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center mb-6">
          {bookingId ? (
            <button
              type="button"
              onClick={onConfirmDemo}
              className="w-full sm:w-auto h-11 px-5 bg-orange-600 hover:bg-orange-700 text-white font-mono text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Xác nhận thanh toán demo (Kích hoạt QR ngay)</span>
            </button>
          ) : null}

          <button
            type="button"
            onClick={onRetrySync}
            className="w-full sm:w-auto h-11 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer border border-slate-200"
          >
            <RefreshCw className="w-4 h-4 text-slate-600" />
            <span>Thử đồng bộ lại</span>
          </button>

          <Link
            to="/bookings"
            className="w-full sm:w-auto h-11 px-4 bg-white hover:bg-slate-50 text-slate-700 font-mono text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors border border-slate-200"
          >
            <span>Về đặt chỗ</span>
          </Link>
        </div>

        {/* Info box for dev / local fallback */}
        <div className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-left flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-900 block font-semibold mb-0.5">
              Mẹo môi trường thử nghiệm / Local dev:
            </strong>
            Nếu bạn đang chạy local hoặc cổng ngân hàng PayOS đang tạm hoãn, hãy bấm{' '}
            <strong className="text-orange-600">Xác nhận thanh toán demo</strong> để kích hoạt
            trạng thái cọc và mã Barie QR check-in ngay mà không cần qua cổng ngân hàng.
          </div>
        </div>
      </div>
    </main>
  )
}
