import { useState, useEffect } from 'react'
import { X, Download, FileSpreadsheet, FileText, CheckCircle2 } from 'lucide-react'

interface ExportReportModalProps {
  isOpen: boolean
  onClose: () => void
  totalRecords: number
  totalAmountText: string
}

export function ExportReportModal({
  isOpen,
  onClose,
  totalRecords,
  totalAmountText,
}: ExportReportModalProps) {
  const [format, setFormat] = useState<'EXCEL' | 'PDF'>('EXCEL')
  const [isExporting, setIsExporting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    let t1: NodeJS.Timeout | undefined
    let t2: NodeJS.Timeout | undefined
    if (isExporting) {
      t1 = setTimeout(() => {
        setIsExporting(false)
        setIsSuccess(true)
        t2 = setTimeout(() => {
          setIsSuccess(false)
          onClose()
        }, 1000)
      }, 800)
    }
    return () => {
      if (t1) clearTimeout(t1)
      if (t2) clearTimeout(t2)
    }
  }, [isExporting, onClose])

  if (!isOpen) return null

  const handleExport = () => {
    setIsExporting(true)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-report-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-slate-200 relative">
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-200 shrink-0">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <h3 id="export-report-modal-title" className="text-lg font-bold font-sora text-slate-900">
              Xuất Báo Cáo Sổ Cái Chi Phí
            </h3>
            <p className="text-xs text-slate-500">
              Dành cho đối soát công tác phí & kế toán đội xe
            </p>
          </div>
        </div>

        {/* Dossier details */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-4 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Kỳ đối soát:</span>
            <span className="font-bold text-slate-900">Tháng 02/2026 (01/02 - 28/02)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Số lượng bản ghi:</span>
            <span className="font-bold text-slate-900">{totalRecords} giao dịch</span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-200">
            <span className="text-slate-500">Tổng giá trị đối soát:</span>
            <span className="font-bold text-orange-600 font-mono text-sm">{totalAmountText}</span>
          </div>
        </div>

        {/* Format selector */}
        <div className="space-y-2 mb-6">
          <label className="block text-xs font-semibold text-slate-700">
            Chọn Định Dạng Tệp
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormat('EXCEL')}
              className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                format === 'EXCEL'
                  ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              <span className="text-xs font-bold text-slate-900">Excel (.XLSX)</span>
              <span className="text-[10px] text-slate-500">Bảng tính kế toán chi tiết</span>
            </button>

            <button
              type="button"
              onClick={() => setFormat('PDF')}
              className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                format === 'PDF'
                  ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <FileText className="w-5 h-5 text-rose-600" />
              <span className="text-xs font-bold text-slate-900">Văn bản PDF</span>
              <span className="text-[10px] text-slate-500">Hồ sơ có chữ ký điện tử</span>
            </button>
          </div>
        </div>

        {isSuccess && (
          <div className="mb-4 p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold text-center border border-emerald-200 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Tệp báo cáo đã được tải xuống máy!</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isExporting}
            className="px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs md:text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Đang tạo tệp...' : `Tải tệp ${format}`}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
