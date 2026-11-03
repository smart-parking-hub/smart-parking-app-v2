import { useNavigate } from 'react-router-dom'
import { Eye, FileText, Inbox } from 'lucide-react'
import type { MerchantParkingLotCardData } from '../types/merchantParkingLotTypes'

interface MerchantParkingLotsTableViewProps {
  lots: MerchantParkingLotCardData[]
}

export function MerchantParkingLotsTableView({ lots }: MerchantParkingLotsTableViewProps) {
  const navigate = useNavigate()

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val)
  }

  if (lots.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-12 text-center shadow-2xs flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
          <Inbox className="w-6 h-6" />
        </div>
        <h4 className="font-sora text-sm font-bold text-[#0d1c2e]">Không có bãi đỗ nào phù hợp bộ lọc</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          Vui lòng thử tìm kiếm với từ khóa khác hoặc điều chỉnh lại bộ lọc trạng thái.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#eff4ff] text-slate-600 font-mono text-[11px] uppercase tracking-wider border-b border-slate-200/80">
              <th className="py-3.5 px-4 sm:px-6">Mã Bãi &amp; Tên Cơ Sở</th>
              <th className="py-3.5 px-4 hidden md:table-cell">Địa Chỉ Vận Hành</th>
              <th className="py-3.5 px-4">Trạng Thái</th>
              <th className="py-3.5 px-4 font-mono">Sức Chứa / Sử Dụng</th>
              <th className="py-3.5 px-4 font-mono">Doanh Thu Tháng</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Thao Tác</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm text-[#0d1c2e]">
            {lots.map((lot) => {
              const isApproved = lot.status === 'APPROVED'
              const isPending = lot.status === 'PENDING_APPROVAL'

              return (
                <tr
                  key={lot.id}
                  className="hover:bg-[#eff4ff]/50 transition-colors group"
                >
                  {/* Name & Code */}
                  <td className="py-4 px-4 sm:px-6">
                    <div className="font-sora font-bold text-[#0d1c2e] leading-snug">
                      {lot.name}
                    </div>
                    <div className="font-mono text-[11px] text-slate-500 mt-0.5 font-medium">
                      {lot.code}
                    </div>
                  </td>

                  {/* Address */}
                  <td className="py-4 px-4 text-slate-600 text-xs hidden md:table-cell max-w-xs truncate">
                    {lot.address}
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    {isApproved ? (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold uppercase rounded-md border border-emerald-300">
                        APPROVED
                      </span>
                    ) : isPending ? (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-mono text-[10px] font-bold uppercase rounded-md border border-amber-300">
                        PENDING
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-slate-200 text-slate-800 font-mono text-[10px] font-bold uppercase rounded-md">
                        {lot.status}
                      </span>
                    )}
                  </td>

                  {/* Capacity */}
                  <td className="py-4 px-4 font-mono text-xs whitespace-nowrap">
                    {isApproved ? (
                      <span className="font-medium">
                        <strong className="text-[#d95f00]">{lot.usedSlots}</strong> / {lot.totalCapacity} Slot ({lot.occupancyRate}%)
                      </span>
                    ) : (
                      <span className="text-slate-500 font-medium">
                        {lot.totalCapacity} Chỗ Đăng Ký
                      </span>
                    )}
                  </td>

                  {/* Revenue */}
                  <td className="py-4 px-4 font-mono text-xs font-bold whitespace-nowrap">
                    {isApproved ? (
                      <span>{formatCurrency(lot.monthlyRevenue)} ₫</span>
                    ) : (
                      <span className="text-slate-400 font-normal">--</span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => navigate(`/merchant/parking-lots/${lot.id}`)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-[#d5e3fc] hover:text-[#0d1c2e] rounded-lg text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                    >
                      {isApproved ? (
                        <>
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          <span>Chi Tiết</span>
                        </>
                      ) : (
                        <>
                          <FileText className="w-3.5 h-3.5 text-slate-500" />
                          <span>Hồ Sơ</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
