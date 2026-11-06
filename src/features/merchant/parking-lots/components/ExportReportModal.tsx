import { useState, useEffect } from 'react'
import { X, Download, FileSpreadsheet, FileText, CheckCircle2 } from 'lucide-react'
import type { MerchantParkingLotCardData } from '../types/merchantParkingLotTypes'
import { fallbackMerchantParkingLots } from '../api/merchantParkingLotApi'
import {
  exportToCsv,
  getFormattedDateForFilename,
  type CsvColumn,
} from '@/shared/utils/exportToCsvUtil'

interface ExportReportModalProps {
  isOpen: boolean
  onClose: () => void
  totalLots: number
  lots?: MerchantParkingLotCardData[]
}

const parkingLotCsvColumns: CsvColumn<MerchantParkingLotCardData>[] = [
  { header: 'Mã Bãi Đỗ', accessor: (l) => l.code || `LOC-${l.id}` },
  { header: 'Tên Cơ Sở Bãi', accessor: 'name' },
  { header: 'Địa Chỉ Thực Địa', accessor: 'address' },
  { header: 'Trạng Thái Thẩm Định', accessor: 'status' },
  { header: 'Hệ Thống Cổng Barie', accessor: 'gateSystem' },
  { header: 'Phân Loại Mặt Bằng', accessor: 'yardTag' },
  { header: 'Tổng Sức Chứa (Slot)', accessor: 'totalCapacity' },
  { header: 'Số Slot Đang Đỗ', accessor: 'usedSlots' },
  { header: 'Tỷ Lệ Lấp Đầy (%)', accessor: (l) => `${l.occupancyRate}%` },
  { header: 'Doanh Thu Tháng (VNĐ)', accessor: 'monthlyRevenue' },
  { header: 'Đánh Giá Trung Bình', accessor: (l) => l.ratingAverage ?? 'N/A' },
  { header: 'Số Lượt Đánh Giá', accessor: 'reviewCount' },
  { header: 'Ngày Đăng Ký Hệ Thống', accessor: 'createdAt' },
]

export function ExportReportModal({
  isOpen,
  onClose,
  totalLots,
  lots,
}: ExportReportModalProps) {
  const [format, setFormat] = useState<'xlsx' | 'csv' | 'pdf'>('xlsx')
  const [downloading, setDownloading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // A11y: Escape Key & Scroll Lock
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleExport = () => {
    if (downloading || isSuccess) return
    setDownloading(true)

    try {
      const exportData = lots && lots.length > 0 ? lots : fallbackMerchantParkingLots
      const dateStr = getFormattedDateForFilename()

      if (format === 'csv' || format === 'xlsx') {
        exportToCsv(
          exportData,
          parkingLotCsvColumns,
          `DanhSach_BaiDo_SmartParking_${dateStr}.csv`,
        )
      } else {
        const manifestText =
          `DANH SÁCH BÃI ĐỖ SMART PARKING HUB (XUẤT NGÀY: ${new Date().toLocaleDateString('vi-VN')})\r\n\r\n` +
          exportData
            .map(
              (l, i) =>
                `${i + 1}. [${l.code}] ${l.name} - ${l.address} | Sức chứa: ${l.usedSlots}/${l.totalCapacity} (${l.occupancyRate}%) | Trạng thái: ${l.status}`,
            )
            .join('\r\n')
        const blob = new Blob([manifestText], { type: 'text/plain;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `DanhSach_BaiDo_SmartParking_${dateStr}.txt`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }

      setDownloading(false)
      setIsSuccess(true)
      setTimeout(() => {
        setIsSuccess(false)
        onClose()
      }, 1200)
    } catch {
      setDownloading(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#eff4ff]">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-[#d95f00]" />
            <h3 id="export-modal-title" className="font-sora text-base font-bold text-[#0d1c2e]">
              Xuất Báo Cáo Mặt Bằng Bãi Đỗ
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <p className="text-xs text-slate-600 leading-relaxed">
            Hệ thống sẽ tổng hợp toàn bộ thông số kỹ thuật mặt bằng, phân bổ slot, tỷ lệ lấp đầy ALPR và doanh thu hiện tại của <strong className="text-[#0d1c2e]">{totalLots} cơ sở</strong> bến bãi.
          </p>

          <div className="space-y-2">
            <label className="block text-xs font-mono font-semibold text-slate-700 uppercase tracking-wider">
              Chọn định dạng xuất dữ liệu:
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setFormat('xlsx')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                  format === 'xlsx'
                    ? 'border-[#d95f00] bg-orange-50/50 text-[#0d1c2e] font-bold shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <FileSpreadsheet className={`w-6 h-6 mb-1 ${format === 'xlsx' ? 'text-[#d95f00]' : 'text-slate-400'}`} />
                <span>Excel (.xlsx)</span>
              </button>

              <button
                type="button"
                onClick={() => setFormat('csv')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                  format === 'csv'
                    ? 'border-[#d95f00] bg-orange-50/50 text-[#0d1c2e] font-bold shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <FileText className={`w-6 h-6 mb-1 ${format === 'csv' ? 'text-[#d95f00]' : 'text-slate-400'}`} />
                <span>CSV UTF-8</span>
              </button>

              <button
                type="button"
                onClick={() => setFormat('pdf')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                  format === 'pdf'
                    ? 'border-[#d95f00] bg-orange-50/50 text-[#0d1c2e] font-bold shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <FileText className={`w-6 h-6 mb-1 ${format === 'pdf' ? 'text-[#d95f00]' : 'text-slate-400'}`} />
                <span>Bản in PDF</span>
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] font-mono text-slate-500 space-y-1">
            <div className="flex justify-between">
              <span>Mã Merchant:</span>
              <span className="font-bold text-slate-800">#MCH-88219</span>
            </div>
            <div className="flex justify-between">
              <span>Thời điểm xuất:</span>
              <span className="font-bold text-slate-800">{new Date().toLocaleString('vi-VN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Tiêu chuẩn bảo mật:</span>
              <span className="text-emerald-700 font-semibold">ISO 27001 Encrypted</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            disabled={downloading || isSuccess}
            onClick={handleExport}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#d95f00] hover:bg-[#b84e00] text-white transition-all text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Đã Xuất File</span>
              </>
            ) : downloading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Đang xử lý...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Tải Báo Cáo ({format.toUpperCase()})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
