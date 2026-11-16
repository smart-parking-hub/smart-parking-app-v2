import { ShieldAlert, Lock, ArrowDownCircle, Info } from 'lucide-react'

export interface CameraSecurityNoticeProps {
  onFocusManualInput?: () => void
  currentOrigin?: string
}

export function CameraSecurityNotice({
  onFocusManualInput,
  currentOrigin = typeof window !== 'undefined' ? window.location.origin : '',
}: CameraSecurityNoticeProps) {
  const isHttp = currentOrigin.startsWith('http://') && !currentOrigin.includes('localhost') && !currentOrigin.includes('127.0.0.1')

  return (
    <div
      role="alert"
      data-testid="camera-security-notice"
      className="rounded-2xl border border-amber-300 bg-amber-50/95 p-4 sm:p-5 text-amber-950 shadow-sm"
    >
      <div className="flex items-start gap-3.5">
        <div className="rounded-xl bg-amber-200/80 p-2 text-amber-800 shrink-0 mt-0.5">
          <ShieldAlert className="h-5 w-5" aria-hidden="true" />
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-bold tracking-tight text-amber-900">
              Yêu cầu kết nối bảo mật HTTPS để mở Camera trên Di động
            </h4>
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800 font-mono">
              <Lock className="h-3 w-3" /> W3C Secure Context
            </span>
          </div>

          <p className="text-xs text-amber-900/90 leading-relaxed">
            Theo tiêu chuẩn bảo mật của các trình duyệt di động (Android Chrome, iOS Safari), quyền truy cập Camera chỉ được cấp khi trang web chạy qua giao thức <strong className="font-semibold">HTTPS</strong> hoặc <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">localhost</code>.
          </p>

          {isHttp && (
            <div className="flex items-center gap-1.5 text-xs text-amber-800/90 font-medium bg-amber-100/70 rounded-lg px-3 py-2">
              <Info className="h-4 w-4 shrink-0 text-amber-700" />
              <span>
                Bạn đang truy cập qua IP nội bộ: <code className="font-mono font-bold">{currentOrigin}</code>. Vui lòng chạy lệnh <code className="font-mono bg-white/80 px-1 rounded">npm run dev:https</code> để tạo địa chỉ HTTPS cho điện thoại.
              </span>
            </div>
          )}

          <div className="pt-1 flex flex-wrap items-center gap-2.5">
            {onFocusManualInput && (
              <button
                type="button"
                onClick={onFocusManualInput}
                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-800 hover:bg-amber-900 active:bg-amber-950 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-all cursor-pointer"
              >
                <ArrowDownCircle className="h-3.5 w-3.5" />
                <span>Nhập mã đặt chỗ thủ công bên dưới</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
