import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { X, MapPin, Truck, Calendar, Clock, CheckCircle2, XCircle, AlertTriangle, ExternalLink } from 'lucide-react'
import type { QueueHistoryItem } from '../types/queueTypes'

interface QueueHistoryDetailModalProps {
  item: QueueHistoryItem | null
  isOpen: boolean
  onClose: () => void
}

export function QueueHistoryDetailModal({
  item,
  isOpen,
  onClose,
}: QueueHistoryDetailModalProps) {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !item) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-detail-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-100 space-y-6 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                {item.queueCode}
              </span>
              {item.status === 'CONVERTED' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Đã nhận slot
                </span>
              )}
              {item.status === 'CANCELLED' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  <XCircle className="w-3.5 h-3.5" />
                  Đã hủy
                </span>
              )}
              {item.status === 'EXPIRED' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Hết hạn
                </span>
              )}
            </div>
            <h2
              id="history-detail-modal-title"
              className="text-xl md:text-2xl font-bold font-sora text-slate-900 tracking-tight"
            >
              Chi Tiết Lượt Giữ Chỗ
            </h2>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Thời gian đăng ký: {item.registeredAtText}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-4 text-sm">
          {/* Parking Yard Info */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Bãi Đỗ Xe Điều Phối
            </div>
            <div className="font-bold text-slate-900 text-base">
              {item.parkingLotName}
            </div>
            <div className="flex items-start gap-1.5 text-xs text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>{item.parkingLotAddress}</span>
            </div>
          </div>

          {/* Vehicle & Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="text-xs font-medium text-slate-500">Biển số phương tiện</div>
              <div className="font-mono font-bold text-base text-slate-900 mt-1 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-slate-400" />
                {item.vehiclePlate}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="text-xs font-medium text-slate-500">Quy cách xe</div>
              <div className="font-semibold text-sm text-slate-800 mt-1">
                {item.vehicleSpec}
              </div>
            </div>
          </div>

          {/* Wait Time & Initial Position */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="text-xs font-medium text-slate-500">Vị trí khi xếp hàng</div>
              <div className="font-bold text-base text-slate-900 mt-1">
                #{item.initialPosition}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="text-xs font-medium text-slate-500">Tổng thời gian chờ</div>
              <div className="font-semibold text-sm text-slate-800 mt-1 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                {item.waitTimeText}
              </div>
            </div>
          </div>

          {/* Result Status Details */}
          {item.status === 'CONVERTED' && (
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Nhận slot thành công</span>
              </div>
              <p className="text-xs text-emerald-700 leading-relaxed">
                Lượt chờ này đã được chuyển đổi thành công sang vé đặt chỗ chính thức. Bạn có thể mở vé điện tử để quét mã QR tại cổng vào bãi.
              </p>
              <div className="pt-2">
                <Link
                  to="/bookings"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-3.5 py-2 rounded-xl transition-colors shadow-sm"
                >
                  <span>Xem vé QR Code & Đặt chỗ</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {item.status === 'CANCELLED' && (
            <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 space-y-1">
              <div className="font-semibold text-xs text-slate-800 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-slate-500" />
                <span>Lượt chờ đã bị hủy</span>
              </div>
              <p className="text-xs text-slate-600">
                Lượt giữ chỗ đã được tài xế chủ động hủy hoặc kết thúc trước khi bãi đỗ có slot trống.
              </p>
            </div>
          )}

          {item.status === 'EXPIRED' && (
            <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 text-rose-800 space-y-1">
              <div className="font-semibold text-xs text-rose-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Hết thời gian giữ slot</span>
              </div>
              <p className="text-xs text-rose-700">
                Hệ thống đã thông báo có slot trống nhưng tài xế không xác nhận nhận chỗ trong thời hạn 15 phút.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-100 pt-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-sm transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}
