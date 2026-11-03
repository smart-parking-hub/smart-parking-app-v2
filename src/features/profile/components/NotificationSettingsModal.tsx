import { useState } from 'react'
import { BellRing, X, CheckCircle2 } from 'lucide-react'

interface NotificationSettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationSettingsModal({
  isOpen,
  onClose,
}: NotificationSettingsModalProps) {
  const [smsAlerts, setSmsAlerts] = useState(true)
  const [pushAlerts, setPushAlerts] = useState(true)
  const [emailReceipts, setEmailReceipts] = useState(true)
  const [saved, setSaved] = useState(false)

  if (!isOpen) return null

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      onClose()
    }, 1000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-sora font-bold text-slate-900 text-base">
                Thiết Lập Thông Báo Hệ Thống
              </h3>
              <p className="text-xs text-slate-500 font-mono">KÊNH TRỰC BAN &amp; ĐIỀU PHỐI BÃI</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-4 text-xs">
          {saved && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Đã lưu cài đặt thông báo!</span>
            </div>
          )}

          <div className="flex items-start justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex flex-col gap-0.5 max-w-[260px]">
              <span className="font-bold text-slate-900">Tin nhắn SMS thông báo slot bãi</span>
              <span className="text-slate-500 text-[11px]">
                Gửi mã OTP và thông báo phân bổ slot bãi đỗ tức thời qua số điện thoại đăng nhập.
              </span>
            </div>
            <input
              type="checkbox"
              checked={smsAlerts}
              onChange={(e) => setSmsAlerts(e.target.checked)}
              className="w-4 h-4 text-orange-600 rounded border-slate-300 mt-1"
            />
          </div>

          <div className="flex items-start justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex flex-col gap-0.5 max-w-[260px]">
              <span className="font-bold text-slate-900">Thông báo đẩy ứng dụng di động</span>
              <span className="text-slate-500 text-[11px]">
                Nhắc nhở giờ rời bãi sắp hết hạn, mở barie ALPR tự động và hàng đợi ảo.
              </span>
            </div>
            <input
              type="checkbox"
              checked={pushAlerts}
              onChange={(e) => setPushAlerts(e.target.checked)}
              className="w-4 h-4 text-orange-600 rounded border-slate-300 mt-1"
            />
          </div>

          <div className="flex items-start justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex flex-col gap-0.5 max-w-[260px]">
              <span className="font-bold text-slate-900">Email biên lai &amp; hóa đơn VAT</span>
              <span className="text-slate-500 text-[11px]">
                Tự động gửi tệp hóa đơn XML + PDF ký số ngay sau mỗi lượt xe rời bãi đỗ.
              </span>
            </div>
            <input
              type="checkbox"
              checked={emailReceipts}
              onChange={(e) => setEmailReceipts(e.target.checked)}
              className="w-4 h-4 text-orange-600 rounded border-slate-300 mt-1"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200/70 transition-colors"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            Lưu Thiết Lập
          </button>
        </div>
      </div>
    </div>
  )
}
