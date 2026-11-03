import { Info } from 'lucide-react'

export function DispatchHelpNote() {
  return (
    <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-xs flex items-start gap-3.5 border border-slate-800">
      <Info className="w-6 h-6 text-orange-400 shrink-0 mt-0.5" />
      <div className="flex flex-col gap-1">
        <span className="font-sora font-bold text-sm text-white">
          Xác minh định danh số eKYC
        </span>
        <p className="text-xs text-slate-300 leading-relaxed">
          Mọi thay đổi liên quan đến Số CCCD hoặc Bằng lái xe FC đều yêu cầu kiểm duyệt lại bởi Ban điều hành trung tâm trong vòng 20 phút trước khi cấp phép vào bãi cont mới.
        </p>
      </div>
    </div>
  )
}
