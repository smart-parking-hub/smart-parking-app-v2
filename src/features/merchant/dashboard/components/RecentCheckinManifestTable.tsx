import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, AlertTriangle } from 'lucide-react'
import type { RecentCheckinItem } from '../types/merchantDashboardTypes'
import { cn } from '@/shared/utils/cn'

interface RecentCheckinManifestTableProps {
  checkins: RecentCheckinItem[]
}

export function RecentCheckinManifestTable({ checkins }: RecentCheckinManifestTableProps) {
  const navigate = useNavigate()

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' ₫'
  }

  const renderStatusBadge = (item: RecentCheckinItem) => {
    switch (item.statusTag) {
      case 'OVERDUE':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold bg-[#341100] text-[#ffdbca] border border-[#d95f00]/40">
            {item.statusLabel}
          </span>
        )
      case 'REEFER_PLUGGED':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold bg-[#eff4ff] text-[#0d1c2e] border border-blue-100">
            {item.statusLabel}
          </span>
        )
      case 'UNLOADING':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold bg-[#e6eeff] text-[#455f87] border border-blue-100">
            {item.statusLabel}
          </span>
        )
      case 'PARKING_VALID':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold bg-[#f8f9ff] text-slate-700 border border-slate-200">
            {item.statusLabel}
          </span>
        )
    }
  }

  return (
    <div className="bg-white p-5 lg:p-6 rounded-2xl shadow-xs border border-slate-200/90 flex flex-col gap-4">
      {/* Table Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div className="flex flex-col">
          <span className="font-mono text-[11px] text-[#45464d] uppercase tracking-wider font-bold">
            KIỂM SOÁT THỜI GIAN THỰC
          </span>
          <h2 className="font-sora text-base lg:text-lg text-[#0d1c2e] font-bold m-0 mt-0.5">
            5 Đơn Check-in Gần Nhất Cần Chú Ý
          </h2>
        </div>

        <Link
          to="/merchant/bookings"
          className="font-mono text-xs text-[#455f87] hover:text-[#0d1c2e] font-bold flex items-center gap-1 transition-colors self-start sm:self-auto"
        >
          <span>Xem toàn bộ 48 xe</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Tabular Freight Manifest */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-[#eff4ff] text-[#45464d] font-mono text-[11px] uppercase tracking-wider h-10 border-b border-blue-100">
              <th className="px-4 font-bold rounded-l-xl">Biển Số Xe</th>
              <th className="px-4 font-bold">Loại Xe / Slot</th>
              <th className="px-4 font-bold">Cổng Vào</th>
              <th className="px-4 font-bold">Giờ Check-in</th>
              <th className="px-4 font-bold text-right">Cọc Giữ Chỗ</th>
              <th className="px-4 font-bold text-right rounded-r-xl">Trạng Thái Vận Hành</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {checkins.map((item, idx) => (
              <tr
                key={item.id}
                onClick={() => navigate(`/merchant/bookings/${item.id}`)}
                className={cn(
                  'hover:bg-[#eff4ff]/60 transition-colors h-14 cursor-pointer',
                  idx % 2 === 1 ? 'bg-slate-50/40' : 'bg-white',
                )}
              >
                {/* Plate */}
                <td className="px-4 font-mono font-bold text-[#0d1c2e]">
                  <div className="flex items-center gap-2">
                    {item.isWarning ? (
                      <AlertTriangle className="w-4 h-4 text-[#d95f00] shrink-0" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-[#455f87] shrink-0" />
                    )}
                    <span className="bg-[#eff4ff] px-2 py-0.5 rounded-lg text-[#0d1c2e] font-bold border border-blue-100">
                      {item.licensePlate}
                    </span>
                  </div>
                </td>

                {/* Vehicle & Slot */}
                <td className="px-4">
                  <span className="font-semibold text-[#0d1c2e] block">{item.vehicleType}</span>
                  <span className="font-mono text-[11px] text-slate-500 block">
                    {item.berthSlot} ({item.yardName})
                  </span>
                </td>

                {/* Gate */}
                <td className="px-4 font-mono text-slate-600 font-medium">{item.gateIn}</td>

                {/* Check-in time */}
                <td className="px-4 font-mono text-slate-700 font-semibold">{item.checkinTimeText}</td>

                {/* Deposit */}
                <td className="px-4 font-mono font-bold text-[#0d1c2e] text-right tabular-nums">
                  {formatCurrency(item.depositAmount)}
                </td>

                {/* Status */}
                <td className="px-4 text-right">{renderStatusBadge(item)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
