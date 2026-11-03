import { Info } from 'lucide-react'
import type { BerthSpotItem } from '../types/paymentCancelTypes'

interface TerminalBerthBlueprintCardProps {
  spotsMatrix?: BerthSpotItem[]
  entryGateLane?: string
  shorePowerAvailable?: boolean
  waitingNextVehiclePlate?: string
  heldSpotCode?: string
}

export function TerminalBerthBlueprintCard({
  spotsMatrix = [],
  entryGateLane = 'Làn số 04',
  shorePowerAvailable = true,
  waitingNextVehiclePlate = '50LD-112.44',
  heldSpotCode = 'C-114',
}: TerminalBerthBlueprintCardProps) {
  return (
    <div className="md:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs uppercase font-bold text-slate-700">
            TỌA ĐỘ VỊ TRÍ BÃI THỰC TẾ
          </span>
          <span className="font-mono text-xs text-orange-600 font-bold px-2 py-0.5 bg-orange-100 rounded-lg">
            KHÓA 10 PHÚT
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Sơ đồ cụm kho bãi Gate 2 - Khoang Container Lạnh &amp; Quá Cảnh
        </p>

        {/* Architectural Terminal Spot Matrix Container */}
        <div className="bg-slate-900 p-4 rounded-xl my-2 border border-slate-800 shadow-inner">
          <div className="text-center font-mono text-[10px] text-slate-400 uppercase pb-1.5 tracking-wider border-b border-slate-800">
            HƯỚNG ĐƯỜNG NỘI BỘ N1 - VÀO BÃI GATE 2
          </div>

          {/* 4x2 Spot Grid */}
          <div className="grid grid-cols-4 gap-2 my-3">
            {spotsMatrix.map((spot) => {
              if (spot.status === 'HELD' || spot.code === heldSpotCode) {
                return (
                  <div
                    key={spot.code}
                    data-testid={`spot-${spot.code}`}
                    className="h-11 bg-orange-600 text-white rounded-lg flex flex-col items-center justify-center text-[10px] font-mono font-bold animate-pulse shadow-sm border border-orange-400"
                  >
                    <span>{spot.code}</span>
                    <span className="text-[9px] uppercase">GIỮ CHỖ</span>
                  </div>
                )
              }
              if (spot.status === 'OCCUPIED') {
                return (
                  <div
                    key={spot.code}
                    className="h-11 bg-slate-800 text-slate-300 rounded-lg flex flex-col items-center justify-center text-[10px] font-mono border border-slate-700/60"
                  >
                    <span>{spot.code}</span>
                    <span className="text-[9px] opacity-70">XE ĐẬU</span>
                  </div>
                )
              }
              return (
                <div
                  key={spot.code}
                  className="h-11 bg-slate-100 text-slate-700 rounded-lg flex flex-col items-center justify-center text-[10px] font-mono border border-slate-200"
                >
                  <span>{spot.code}</span>
                  <span className="text-[9px] font-semibold text-slate-500">TRỐNG</span>
                </div>
              )
            })}
          </div>

          {/* Matrix Footnotes */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800">
            <span>Cổng vào: <strong className="text-slate-200">{entryGateLane}</strong></span>
            <span>
              Cắm điện:{' '}
              <strong className="text-orange-400 font-bold">
                {shorePowerAvailable ? 'CÓ' : 'KHÔNG'}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Info Callout */}
      <div className="p-3 bg-slate-100 rounded-xl flex items-start gap-2.5 border border-slate-200/80">
        <Info className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
        <span className="text-xs text-slate-600 leading-relaxed">
          Sau khi hết 10 phút, hệ thống sẽ tự động gỡ khóa vị trí {heldSpotCode} để chuyển cho container{' '}
          <strong className="text-slate-900">{waitingNextVehiclePlate}</strong> đang chờ ở thứ tự tiếp theo.
        </span>
      </div>
    </div>
  )
}
