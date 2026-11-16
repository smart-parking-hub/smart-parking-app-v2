import { CameraOff, RotateCw, X } from 'lucide-react'

export interface CameraPermissionModalProps {
  isOpen: boolean
  onClose: () => void
  onRetry: () => void
}

export function CameraPermissionModal({
  isOpen,
  onClose,
  onRetry,
}: CameraPermissionModalProps) {
  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="perm-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-rose-100 p-2 text-rose-700 shrink-0">
              <CameraOff className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h3
                id="perm-modal-title"
                className="text-base font-bold text-slate-900 tracking-tight"
              >
                Cần Cấp Quyền Truy Cập Camera
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Hướng dẫn mở lại quyền Camera cho Trạm Barie
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng cửa sổ hướng dẫn"
            className="rounded-lg p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Steps */}
        <div className="space-y-3 rounded-xl bg-slate-50 p-4 border border-slate-200/70 text-xs text-slate-700">
          <div className="flex items-start gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-orange text-white text-[11px] font-bold">
              1
            </span>
            <span>
              Nhấn vào <strong>biểu tượng Ổ khóa</strong> hoặc <strong>Cài đặt trang web</strong> trên thanh địa chỉ trình duyệt.
            </span>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-orange text-white text-[11px] font-bold">
              2
            </span>
            <span>
              Tìm mục <strong>Máy ảnh / Camera</strong> và chuyển từ <em>"Chặn"</em> sang <strong>"Cho phép (Allow)"</strong>.
            </span>
          </div>

          <div className="flex items-start gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-orange text-white text-[11px] font-bold">
              3
            </span>
            <span>
              Nhấn nút <strong>"Thử kết nối lại"</strong> bên dưới để kích hoạt kính ngắm.
            </span>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Đã hiểu
          </button>
          <button
            type="button"
            onClick={() => {
              onClose()
              onRetry()
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-brand-navy hover:bg-slate-900 active:bg-black px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
          >
            <RotateCw className="h-3.5 w-3.5" />
            <span>Thử kết nối lại</span>
          </button>
        </div>
      </div>
    </div>
  )
}
