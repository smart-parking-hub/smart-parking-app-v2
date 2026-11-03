import { FileText, Flame, X, Download, ShieldCheck } from 'lucide-react'
import type { StoredDocument } from '../types/merchantProfileTypes'

interface DocumentPreviewModalProps {
  document: StoredDocument | null
  onClose: () => void
}

export function DocumentPreviewModal({ document, onClose }: DocumentPreviewModalProps) {
  if (!document) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-[#131b2e]/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#341100] border border-[#d95f00]/30 flex items-center justify-center text-[#d95f00]">
              {document.type === 'pccc' ? (
                <Flame className="w-4 h-4 text-[#455f87]" />
              ) : (
                <FileText className="w-4 h-4 text-[#d95f00]" />
              )}
            </div>
            <div>
              <h3 className="font-sora text-sm lg:text-base font-bold text-[#0d1c2e]">
                Xem Trước Tài Liệu Pháp Lý
              </h3>
              <span className="font-mono text-[10px] text-slate-500">{document.name}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Đóng xem trước"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Document Metadata Card */}
        <div className="p-4 rounded-xl bg-[#eff4ff] border border-slate-200/60 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Cơ quan / Đơn vị cấp:</span>
            <span className="font-semibold text-[#0d1c2e] font-mono">{document.authority}</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Kích thước tệp:</span>
            <span className="font-semibold text-[#0d1c2e] font-mono">{document.size}</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Thời gian lưu kho:</span>
            <span className="font-semibold text-[#0d1c2e] font-mono">{document.uploadedAt}</span>
          </div>

          <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-200">
            <span className="text-slate-500">Trạng thái chữ ký số:</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1 font-mono text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              CHỨNG THỰC HỢP LỆ (CA VIETTEL)
            </span>
          </div>
        </div>

        {/* Mock Document Render Canvas */}
        <div className="h-44 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center p-4 text-center space-y-2">
          <FileText className="w-12 h-12 text-slate-400" />
          <span className="text-xs font-semibold text-slate-700">{document.name}</span>
          <span className="text-[11px] text-slate-500">
            Tài liệu bảo mật cao cấp được lưu trữ mã hóa trên hệ thống Cloud S3 SmartTruckHub
          </span>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-4 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Đóng
          </button>

          <button
            type="button"
            onClick={() => {
              alert(`Bắt đầu tải xuống tệp: ${document.name}`)
              onClose()
            }}
            className="h-10 px-4 rounded-xl bg-[#131b2e] hover:bg-black text-white font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Tải Xuống Bản PDF Gốc</span>
          </button>
        </div>
      </div>
    </div>
  )
}
