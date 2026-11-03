import { useState } from 'react'
import { X, FileSpreadsheet, FileText, Download, CheckCircle2 } from 'lucide-react'
import type { VehicleItem } from '../types/vehicleTypes'

interface ExportFleetModalProps {
  vehicles: VehicleItem[]
  isOpen: boolean
  onClose: () => void
}

export function ExportFleetModal({ vehicles, isOpen, onClose }: ExportFleetModalProps) {
  const [format, setFormat] = useState<'excel' | 'pdf' | 'csv'>('excel')
  const [includeRegistryDossier, setIncludeRegistryDossier] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [exportDone, setExportDone] = useState(false)

  if (!isOpen) return null

  const handleExport = () => {
    setIsExporting(true)
    setTimeout(() => {
      setIsExporting(false)
      setExportDone(true)

      // Simulate download safely across browser & test environments
      if (typeof window !== 'undefined' && typeof window.URL?.createObjectURL === 'function') {
        const filename = `Danh_Sach_Doi_Xe_SmartTruckHub_${new Date().toISOString().slice(0, 10)}.${
          format === 'excel' ? 'xlsx' : format === 'pdf' ? 'pdf' : 'csv'
        }`
        const blob = new Blob([JSON.stringify(vehicles, null, 2)], { type: 'text/plain' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        link.click()
        window.URL.revokeObjectURL(url)
      }

      setTimeout(() => {
        setExportDone(false)
        onClose()
      }, 1500)
    }, 400)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-sora font-bold text-slate-900 text-base sm:text-lg">
                Xuất Báo Cáo Đội Xe
              </h3>
              <p className="text-xs font-mono text-slate-500">{vehicles.length} PHƯƠNG TIỆN ĐÃ CHỌN</p>
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

        {/* Body */}
        <div className="p-5 flex flex-col gap-4 text-xs">
          {exportDone && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Tệp danh sách phương tiện đã tải xuống thành công!</span>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold font-mono text-slate-700">Định Dạng Tệp Xuất</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormat('excel')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  format === 'excel'
                    ? 'border-orange-500 bg-orange-50/50 text-orange-700'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <FileSpreadsheet className="w-5 h-5" />
                <span className="font-bold">Excel (.xlsx)</span>
              </button>
              <button
                type="button"
                onClick={() => setFormat('pdf')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  format === 'pdf'
                    ? 'border-orange-500 bg-orange-50/50 text-orange-700'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span className="font-bold">Bản PDF</span>
              </button>
              <button
                type="button"
                onClick={() => setFormat('csv')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  format === 'csv'
                    ? 'border-orange-500 bg-orange-50/50 text-orange-700'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <FileSpreadsheet className="w-5 h-5" />
                <span className="font-bold">CSV Data</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeRegistryDossier}
                onChange={(e) => setIncludeRegistryDossier(e.target.checked)}
                className="w-4 h-4 text-orange-600 rounded border-slate-300"
              />
              <span className="text-slate-700 font-medium">
                Bao gồm mã chứng nhận kiểm định &amp; số tem lưu hành
              </span>
            </label>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-slate-500 text-[11px] font-mono">
            Mục đích sử dụng: Báo cáo đối soát kiểm định trạm cân, bàn giao ca đội xe, trình báo trạm kiểm soát bến cảng.
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
            disabled={isExporting}
            onClick={handleExport}
            className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Đang xuất...' : 'Tải Về Ngay'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
