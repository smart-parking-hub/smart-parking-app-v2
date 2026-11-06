import { useEffect } from 'react'
import { CheckCircle2, Ticket, ArrowRight, ShieldCheck, Clock, X } from 'lucide-react'
import { Link } from 'react-router-dom'

interface AcceptQueueSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  bookingCode: string
  berthCode?: string
  parkingLotName: string
}

export function AcceptQueueSuccessModal({
  isOpen,
  onClose,
  bookingCode,
  berthCode,
  parkingLotName,
}: AcceptQueueSuccessModalProps) {
  // Escape key handler & body scroll lock
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="accept-queue-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-200 text-center relative"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200 ring-8 ring-emerald-50">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h3 id="accept-queue-modal-title" className="text-xl md:text-2xl font-bold font-sora text-slate-900 mb-1">
          Nhận Slot Đỗ Xe Thành Công!
        </h3>
        <p className="text-sm text-slate-600 mb-6">
          Hệ thống đã tự động chuyển đổi lượt xếp hàng thành đơn đặt chỗ hợp lệ.
        </p>

        {/* Booking Dossier Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left mb-6 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider block font-semibold">
                Mã đơn đặt chỗ
              </span>
              <span className="text-lg font-mono font-bold text-slate-900">
                {bookingCode}
              </span>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              ĐÃ KHÓA SLOT
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider block font-medium">
              Bãi đỗ xe tiếp nhận
            </span>
            <span className="text-sm font-semibold text-slate-900">
              {parkingLotName}
            </span>
          </div>

          {berthCode && (
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider block font-medium">
                Vị trí ô đỗ chỉ định (Berth)
              </span>
              <span className="text-sm font-mono font-bold text-orange-600">
                {berthCode}
              </span>
            </div>
          )}

          <div className="pt-2 border-t border-slate-200 flex items-center gap-2 text-xs text-amber-700 bg-amber-50/70 p-2.5 rounded-xl border-amber-200">
            <Clock className="w-4 h-4 shrink-0 text-amber-600" />
            <span>
              Bạn có <strong>10 phút</strong> để hoàn tất cọc qua PayOS hoặc quét QR tại cổng kiểm soát.
            </span>
          </div>
        </div>

        {/* Modal CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Đóng
          </button>
          <Link
            to="/bookings"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 transition-colors shadow-sm shadow-orange-600/20"
          >
            <Ticket className="w-4 h-4" />
            <span>Xem vé QR & Thanh toán cọc</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Biển số ALPR đã được đồng bộ với trạm barie tự động</span>
        </div>
      </div>
    </div>
  )
}
