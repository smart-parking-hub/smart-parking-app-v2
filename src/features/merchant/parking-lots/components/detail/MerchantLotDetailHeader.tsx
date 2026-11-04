import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  MapPin,
  Edit3,
  Sliders,
  DollarSign,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Clock,
  XCircle,
  PauseCircle,
} from 'lucide-react'
import type { MerchantParkingLotDetailData } from '../../types/merchantParkingLotTypes'

interface MerchantLotDetailHeaderProps {
  lot: MerchantParkingLotDetailData
  canConfigure: boolean
  ownershipVerified: boolean
}

export function MerchantLotDetailHeader({
  lot,
  canConfigure,
  ownershipVerified,
}: MerchantLotDetailHeaderProps) {
  const navigate = useNavigate()

  const renderStatusBadge = () => {
    switch (lot.status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#131b2e] text-[#ffdbca] font-mono text-[11px] font-bold tracking-wider uppercase border border-slate-700/50">
            <span className="w-2 h-2 rounded-full bg-[#d95f00] animate-pulse" />
            ĐÃ PHÊ DUYỆT (APPROVED)
          </span>
        )
      case 'PENDING_APPROVAL':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-amber-50 text-amber-700 font-mono text-[11px] font-bold tracking-wider uppercase border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600 animate-spin" />
            ĐANG CHỜ DUYỆT (PENDING)
          </span>
        )
      case 'CHANGES_REQUESTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-purple-50 text-purple-700 font-mono text-[11px] font-bold tracking-wider uppercase border border-purple-200">
            <AlertTriangle className="w-3 h-3 text-purple-600" />
            CẦN BỔ SUNG (CHANGES REQUESTED)
          </span>
        )
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-red-50 text-red-700 font-mono text-[11px] font-bold tracking-wider uppercase border border-red-200">
            <XCircle className="w-3 h-3 text-red-600" />
            TỪ CHỐI (REJECTED)
          </span>
        )
      case 'SUSPENDED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-100 text-slate-700 font-mono text-[11px] font-bold tracking-wider uppercase border border-slate-300">
            <PauseCircle className="w-3 h-3 text-slate-600" />
            TẠM NGƯNG (SUSPENDED)
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-100 text-slate-700 font-mono text-[11px] font-bold tracking-wider uppercase">
            <CheckCircle2 className="w-3 h-3" />
            {lot.status}
          </span>
        )
    }
  }

  return (
    <div className="bg-white p-5 lg:p-6 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col gap-5">
      {/* Top Breadcrumb & Status Tag */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => navigate('/merchant/parking-lots')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#eff4ff] text-[#0d1c2e] hover:bg-[#d5e3fc] transition-colors font-medium text-xs lg:text-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
            <span>Quay lại danh sách bãi</span>
          </button>
          <span className="hidden sm:inline-block text-slate-300">/</span>
          <span className="font-mono text-xs uppercase tracking-wider text-slate-500 font-semibold">
            HỒ SƠ KỸ THUẬT &amp; TRUNG TÂM ĐIỀU HÀNH BÃI ĐỖ · MÃ:{' '}
            <strong className="text-[#0d1c2e]">{lot.code || `LOT-${lot.id}`}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">{renderStatusBadge()}</div>
      </div>

      {/* Main Title & Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="flex flex-col gap-1.5 max-w-3xl">
          <h1 className="font-sora text-xl sm:text-2xl lg:text-3xl text-[#0d1c2e] font-bold tracking-tight">
            {lot.name}
          </h1>
          <div className="flex items-start sm:items-center gap-1.5 text-slate-600 text-xs sm:text-sm">
            <MapPin className="w-4 h-4 text-[#d95f00] shrink-0 mt-0.5 sm:mt-0" />
            <span className="leading-relaxed">{lot.address}</span>
          </div>
        </div>

        {/* Management Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            disabled={!ownershipVerified}
            onClick={() => navigate(`/merchant/parking-lots/${lot.id}/edit`)}
            title={!ownershipVerified ? 'Chưa xác minh quyền sở hữu' : 'Chỉnh sửa thông tin bãi'}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#e6eeff] text-[#0d1c2e] hover:bg-[#d5e3fc] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold text-xs lg:text-sm cursor-pointer shadow-2xs"
          >
            <Edit3 className="w-4 h-4 text-slate-700" />
            <span>Chỉnh Sửa Hồ Sơ (SCR-031)</span>
          </button>

          <button
            type="button"
            disabled={!canConfigure}
            onClick={() => navigate(`/merchant/parking-lots/${lot.id}/slots`)}
            title={
              !canConfigure
                ? 'Chỉ khả dụng khi bãi đỗ đã được phê duyệt'
                : 'Cấu hình phân bổ sức chứa slot'
            }
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#ffdbca]/40 text-[#d95f00] hover:bg-[#ffdbca]/70 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-semibold text-xs lg:text-sm cursor-pointer border border-[#d95f00]/30 shadow-2xs"
          >
            <Sliders className="w-4 h-4 text-[#d95f00]" />
            <span>Cấu Hình Slot (SCR-032)</span>
          </button>

          <button
            type="button"
            disabled={!canConfigure}
            onClick={() => navigate(`/merchant/parking-lots/${lot.id}/pricing`)}
            title={
              !canConfigure
                ? 'Chỉ khả dụng khi bãi đỗ đã được phê duyệt'
                : 'Cấu hình bảng giá niêm yết'
            }
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#ffdbca]/40 text-[#d95f00] hover:bg-[#ffdbca]/70 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-semibold text-xs lg:text-sm cursor-pointer border border-[#d95f00]/30 shadow-2xs"
          >
            <DollarSign className="w-4 h-4 text-[#d95f00]" />
            <span>Cấu Hình Bảng Giá (SCR-033)</span>
          </button>

          <button
            type="button"
            onClick={() => navigate(`/merchant/qr-scanner?yardId=${lot.id}`)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#d95f00] text-white hover:bg-[#b84e00] transition-all font-bold text-xs lg:text-sm shadow-sm cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-white" />
            <span className="tracking-wide">MỞ QUÉT QR BARIE (SCR-036)</span>
          </button>
        </div>
      </div>
    </div>
  )
}
