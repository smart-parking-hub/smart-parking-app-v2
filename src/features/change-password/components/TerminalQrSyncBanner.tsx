import { QrCode } from 'lucide-react'

export function TerminalQrSyncBanner() {
  return (
    <div className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5">
          <QrCode className="w-5 h-5 text-orange-500" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900 font-sora">
            Đồng bộ mã QR Cổng Barie Tự Động
          </p>
          <p className="text-xs md:text-sm text-slate-600 mt-0.5 leading-relaxed">
            Sau khi đổi mật khẩu, mã Barie QR Pass lưu trữ ngoại tuyến trên thiết bị sẽ được ký số mã hóa lại trong vòng 60 giây.
          </p>
        </div>
      </div>

      <span className="px-3 py-1.5 bg-white text-slate-900 font-mono text-xs font-bold rounded-lg border border-slate-200 shadow-2xs shrink-0 uppercase tracking-wider">
        AUTO-SYNC ON
      </span>
    </div>
  )
}
