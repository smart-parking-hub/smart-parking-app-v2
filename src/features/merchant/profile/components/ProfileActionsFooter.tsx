import { History, Save, RotateCcw } from 'lucide-react'

interface ProfileActionsFooterProps {
  lastUpdated: string
  isSaving: boolean
  onReset: () => void
  onSave: () => void
}

export function ProfileActionsFooter({
  lastUpdated,
  isSaving,
  onReset,
  onSave,
}: ProfileActionsFooterProps) {
  return (
    <footer className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-slate-500 font-mono text-xs">
        <History className="w-4 h-4 text-[#455f87] shrink-0" />
        <span>Cập nhật gần nhất: {lastUpdated}</span>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <button
          type="button"
          id="btn-reset-form"
          onClick={onReset}
          className="h-11 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0d1c2e] font-semibold text-xs lg:text-sm transition-colors flex items-center justify-center gap-2 w-1/2 sm:w-auto cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-slate-500" />
          <span>Khôi phục dữ liệu gốc</span>
        </button>

        <button
          type="button"
          id="btn-save-profile"
          onClick={onSave}
          disabled={isSaving}
          className="h-11 px-6 rounded-xl bg-[#d95f00] hover:bg-[#b85000] text-white font-sora font-bold text-xs lg:text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer w-1/2 sm:w-auto"
        >
          <Save className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
          <span>{isSaving ? 'ĐANG LƯU HỒ SƠ...' : 'LƯU THAY ĐỔI HỒ SƠ ➔'}</span>
        </button>
      </div>
    </footer>
  )
}
