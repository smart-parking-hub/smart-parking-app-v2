import { useNavigate } from 'react-router-dom'
import { Radio, ArrowRight, ShieldCheck } from 'lucide-react'
import type { ActiveVehicleTelemetry } from '../../types/merchantParkingLotTypes'

interface MerchantLotLiveVehiclesTableProps {
  lotId: number
  vehicles: ActiveVehicleTelemetry[]
}

export function MerchantLotLiveVehiclesTable({
  lotId,
  vehicles,
}: MerchantLotLiveVehiclesTableProps) {
  const navigate = useNavigate()

  return (
    <div className="bg-white p-5 lg:p-6 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#eff4ff] flex items-center justify-center text-slate-800">
            <Radio className="w-4 h-4 text-slate-700 animate-pulse" />
          </div>
          <div>
            <h2 className="font-sora text-base lg:text-lg text-[#0d1c2e] font-bold">
              Giám Sát Xe Đang Đỗ Thực Tế (Live Telemetry)
            </h2>
            <p className="text-xs text-slate-500">
              Dữ liệu nhận diện camera ALPR 2 làn vào/ra và cảm biến hiện trường
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-[#eff4ff] text-[#0d1c2e] font-mono text-[11px] font-semibold border border-slate-200/60">
            Cập nhật tức thời qua Sensor &amp; ALPR
          </span>
          <button
            type="button"
            onClick={() => navigate(`/merchant/bookings?parkingLotId=${lotId}`)}
            className="hidden sm:inline-flex items-center gap-1 font-mono text-xs text-[#d95f00] hover:underline font-bold cursor-pointer"
          >
            <span>Tất cả booking</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0">
        <table className="w-full text-left font-sans text-xs sm:text-sm">
          <thead>
            <tr className="bg-[#eff4ff]/60 font-mono text-[11px] uppercase tracking-wider text-slate-600 border-b border-slate-200/70">
              <th className="py-2.5 px-3 rounded-l-lg">Biển Số Xe</th>
              <th className="py-2.5 px-3">Slot Chỉ Định</th>
              <th className="py-2.5 px-3">Thời Gian Đỗ</th>
              <th className="py-2.5 px-3">Dịch Vụ Kèm Theo</th>
              <th className="py-2.5 px-3 rounded-r-lg text-right">Trạng Thái Thực Tế</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {vehicles.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400 font-mono text-xs">
                  Hiện chưa có phương tiện nào đỗ tại bến bãi này.
                </td>
              </tr>
            ) : (
              vehicles.map((v) => {
                const isOver = v.isOvertime

                return (
                  <tr
                    key={v.id}
                    className={`transition-colors ${
                      isOver ? 'bg-[#ffdbca]/20 hover:bg-[#ffdbca]/30' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    {/* License Plate */}
                    <td className="py-3 px-3">
                      <span className="font-mono text-xs sm:text-sm font-bold text-[#0d1c2e] bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/80 shadow-2xs">
                        {v.licensePlate}
                      </span>
                    </td>

                    {/* Slot Code */}
                    <td className="py-3 px-3 font-mono font-bold text-[#0d1c2e] text-xs sm:text-sm">
                      {v.slotCode}
                    </td>

                    {/* Duration */}
                    <td className="py-3 px-3 font-mono text-xs sm:text-sm">
                      <span
                        className={
                          isOver ? 'text-[#d95f00] font-bold' : 'text-slate-800 font-medium'
                        }
                      >
                        {v.durationFormatted}
                      </span>
                    </td>

                    {/* Service Name */}
                    <td className="py-3 px-3 text-slate-600 text-xs sm:text-sm">
                      {v.serviceName}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3 text-right">
                      {isOver ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#ffdbca] text-[#d95f00] font-mono text-[11px] font-bold border border-[#d95f00]/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#d95f00] animate-ping" />
                          {v.statusLabel}
                        </span>
                      ) : v.statusTone === 'valid' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#d5e3fc]/60 text-[#0d1c2e] font-mono text-[11px] font-semibold">
                          <ShieldCheck className="w-3 h-3 text-blue-600" />
                          {v.statusLabel}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono text-[11px] font-medium">
                          {v.statusLabel}
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
