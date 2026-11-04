import { useNavigate } from 'react-router-dom'
import { ArrowLeft, History, AlertTriangle, XCircle, CheckCircle2, Clock } from 'lucide-react'
import type { MerchantParkingLotDetailData } from '../../types/merchantParkingLotTypes'

interface EditMerchantParkingLotHeaderProps {
  lot: MerchantParkingLotDetailData
  onShowHistory?: () => void
}

export function EditMerchantParkingLotHeader({
  lot,
  onShowHistory,
}: EditMerchantParkingLotHeaderProps) {
  const navigate = useNavigate()

  const renderStatusBadge = () => {
    switch (lot.status) {
      case 'CHANGES_REQUESTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#ffdbca] text-[#783200] font-mono text-xs font-bold uppercase tracking-wide border border-[#ffdbca]">
            <span className="w-2 h-2 rounded-full bg-[#d95f00]" />
            YÊU CẦU BỔ SUNG (CHANGES REQUESTED)
          </span>
        )
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-red-100 text-red-800 font-mono text-xs font-bold uppercase tracking-wide border border-red-200">
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            TỪ CHỐI (REJECTED)
          </span>
        )
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-100 text-emerald-800 font-mono text-xs font-bold uppercase tracking-wide border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ĐÃ PHÊ DUYỆT (LOCKED)
          </span>
        )
      case 'PENDING_APPROVAL':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-100 text-amber-800 font-mono text-xs font-bold uppercase tracking-wide border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            ĐANG CHỜ DUYỆT (PENDING)
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-100 text-slate-700 font-mono text-xs font-bold uppercase tracking-wide">
            <AlertTriangle className="w-3.5 h-3.5" />
            {lot.status}
          </span>
        )
    }
  }

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs uppercase tracking-wider text-[#455f87] font-semibold">
            HỒ SƠ BẾN BÃI &amp; THẨM ĐỊNH KỸ THUẬT · BIÊN BẢN MOD-04
          </span>
          <span className="text-slate-300 font-mono text-xs">/</span>
          <span className="font-mono text-xs text-slate-500 font-medium">
            {lot.code || `LOC-${lot.id}`}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-sora text-xl sm:text-2xl lg:text-3xl text-[#131b2e] font-bold tracking-tight">
            Chỉnh Sửa &amp; Cập Nhật Hồ Sơ Bãi Đỗ
          </h1>
          {renderStatusBadge()}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={() => navigate(`/merchant/parking-lots/${lot.id}`)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-[#131b2e] hover:bg-slate-100 border border-slate-200 text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4 text-slate-600" />
          <span>Quay lại Chi Tiết Bãi (SCR-030)</span>
        </button>
        <button
          type="button"
          onClick={onShowHistory}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#dce9ff] text-[#131b2e] hover:bg-[#d5e3fc] text-xs sm:text-sm font-semibold transition-colors cursor-pointer shadow-2xs"
        >
          <History className="w-4 h-4 text-slate-700" />
          <span>Xem Lịch Sử Thẩm Định</span>
        </button>
      </div>
    </div>
  )
}
