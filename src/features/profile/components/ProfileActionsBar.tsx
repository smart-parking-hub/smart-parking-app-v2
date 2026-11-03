import { Clock, RefreshCw, Save } from 'lucide-react'

interface ProfileActionsBarProps {
  lastUpdated: string
  onReset: () => void
  onSave: () => void
  isSaving: boolean
}

export function ProfileActionsBar({
  lastUpdated,
  onReset,
  onSave,
  isSaving,
}: ProfileActionsBarProps) {
  return (
    <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Last Updated Timestamp */}
      <div className="flex items-center gap-2 text-slate-500 text-xs md:text-sm">
        <Clock className="w-4 h-4 text-slate-400 shrink-0" />
        <span>
          Cập nhật gần nhất:{' '}
          <strong className="text-slate-800 font-mono">{lastUpdated}</strong>
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <button
          type="button"
          onClick={onReset}
          className="h-11 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs md:text-sm font-semibold transition-colors w-full sm:w-auto text-center cursor-pointer"
        >
          Khôi phục dữ liệu gốc
        </button>

        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="h-11 px-6 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs md:text-sm font-bold shadow-sm shadow-orange-600/20 transition-all flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-50 cursor-pointer"
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Đang lưu...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>LƯU THAY ĐỔI HỒ SƠ</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
