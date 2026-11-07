import { useEffect } from 'react'
import { Ticket, ArrowRight, ShieldCheck, Clock, X } from 'lucide-react'
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
        className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 text-center relative max-h-[90vh] overflow-y-auto"
      >
        {/* Nút đóng [X] với hover mượt mà */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-all cursor-pointer active:scale-95"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tiêu đề: Đã bỏ logo và đổi tên theo yêu cầu */}
        <h3 id="accept-queue-modal-title" className="text-xl md:text-2xl font-bold font-sora text-slate-900 mb-5 pt-1">
          Đã Có Chỗ Đỗ Xe!
        </h3>

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
              <span className="text-sm font-mono font-bold text-brand-primary">
                {berthCode}
              </span>
            </div>
          )}

          {/* Cảnh báo màu cam: Chữ to lên và không được xuống dòng theo yêu cầu */}
          <div className="pt-2 border-t border-slate-200">
            <div className="flex items-center gap-2.5 text-sm md:text-base text-amber-900 bg-amber-50/90 p-3 rounded-xl border border-amber-200/80 whitespace-nowrap overflow-x-auto">
              <Clock className="w-5 h-5 shrink-0 text-amber-600" />
              <span>
                Bạn có <strong>10 phút</strong> để hoàn tất cọc qua PayOS hoặc quét QR tại cổng kiểm soát.
              </span>
            </div>
          </div>
        </div>

        {/* Modal CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm md:text-base font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/80 shadow-2xs transition-all duration-150 cursor-pointer active:scale-95"
          >
            Đóng
          </button>
          <Link
            to="/bookings"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm md:text-base font-semibold text-white bg-brand-primary hover:bg-brand-primary-hover transition-colors shadow-sm cursor-pointer active:scale-95"
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
