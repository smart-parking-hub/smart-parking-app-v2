import { useState } from 'react'
import {
  CornerUpRight,
  Plus,
  Minus,
  Layers,
  Crosshair,
  Truck,
  CheckCircle2,
  Lock,
  AlertTriangle,
} from 'lucide-react'
import type { ParkingLotItem } from '../types/parkingSearchTypes'

interface InteractiveMapCanvasProps {
  lots: ParkingLotItem[]
  selectedLot?: ParkingLotItem
  onSelectLot: (lot: ParkingLotItem) => void
  onQuickBook: (lot: ParkingLotItem) => void
}

export function InteractiveMapCanvas({
  lots,
  selectedLot,
  onSelectLot,
  onQuickBook,
}: InteractiveMapCanvasProps) {
  const [zoomLevel, setZoomLevel] = useState(14)
  const [showHeavyLayer, setShowHeavyLayer] = useState(true)

  const activeLot = selectedLot || lots[0]

  return (
    <div className="flex flex-col gap-3 sticky top-[80px]">
      {/* Realistic Container Map Canvas */}
      <div className="relative w-full h-[680px] bg-[#e4ebf5] rounded-2xl overflow-hidden shadow-sm select-none border border-slate-200">
        {/* Cartographic Grid/Tile Surface Background */}
        <div
          className="absolute inset-0 bg-[#e4ebf5]"
          style={{
            backgroundImage:
              'radial-gradient(#cad7ea 1.5px, transparent 1.5px), linear-gradient(to right, #d9e3f0 1px, transparent 1px), linear-gradient(to bottom, #d9e3f0 1px, transparent 1px)',
            backgroundSize: '32px 32px, 64px 64px, 64px 64px',
          }}
        >
          {/* Vector Styled Road Arteries Mock */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" role="img">
            {/* Major Highway Long Thanh Dau Giay */}
            <path
              d="M-50,220 C220,180 480,260 850,210"
              fill="none"
              stroke="#ffffff"
              strokeLinecap="round"
              strokeWidth="12"
            />
            <path
              d="M-50,220 C220,180 480,260 850,210"
              fill="none"
              stroke="#becfe4"
              strokeLinecap="round"
              strokeWidth="8"
            />

            {/* Nguyen Thi Dinh Connector */}
            <path
              d="M340,680 C360,520 370,410 420,310 C460,230 480,180 500,20"
              fill="none"
              stroke="#ffffff"
              strokeWidth="10"
            />
            <path
              d="M340,680 C360,520 370,410 420,310 C460,230 480,180 500,20"
              fill="none"
              stroke="#becfe4"
              strokeWidth="6"
            />

            {/* Port Entrance Avenue */}
            <path d="M120,440 L420,310" fill="none" stroke="#ffffff" strokeWidth="8" />
            <path d="M120,440 L420,310" fill="none" stroke="#cad7ea" strokeWidth="4" />

            {/* Calculated Heavy Truck Nav Path (Active Route to Selected Yard) */}
            <path
              d="M220,490 Q290,440 370,390 T540,290"
              fill="none"
              stroke="#0f172a"
              strokeDasharray="10 6"
              strokeLinecap="round"
              strokeWidth="6"
            />
            <path
              d="M220,490 Q290,440 370,390 T540,290"
              fill="none"
              stroke="#d95f00"
              strokeLinecap="round"
              strokeWidth="3"
            />
          </svg>
        </div>

        {/* Top Floating Direction Banner */}
        <div className="absolute top-4 left-4 right-4 z-20 bg-[#233144]/95 text-white backdrop-blur-md rounded-2xl p-3 shadow-lg flex items-center justify-between gap-3 border border-white/10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#d95f00] flex items-center justify-center shrink-0">
              <CornerUpRight className="w-4 h-4 text-white" />
            </div>
            <div className="truncate">
              <span className="text-[11px] font-mono text-[#ffdbca] uppercase tracking-wider block font-bold">
                LỘ TRÌNH TỐI ƯU XE CONTAINER 40FT
              </span>
              <p className="text-xs text-[#eaf1ff] truncate font-medium mt-0.5">
                Hướng QL51 qua Cầu Bà Cua · Tĩnh không 4.8m · Không cấm tải giờ này
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <span className="bg-[#131b2e] px-2.5 py-1 rounded-lg font-mono text-white text-xs font-bold whitespace-nowrap border border-white/10">
              {activeLot?.distanceKm || 2.4} KM · {activeLot?.etaMinutes || 6}P
            </span>
          </div>
        </div>

        {/* Floating Map Utility Layer Controls */}
        <div className="absolute top-20 right-4 z-20 flex flex-col gap-1.5 bg-white/95 backdrop-blur-sm rounded-xl p-1 shadow-md border border-slate-200">
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(z + 1, 18))}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#0d1c2e] hover:bg-[#eff4ff] transition-colors cursor-pointer"
            title="Phóng to"
            aria-label="Phóng to bản đồ"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(z - 1, 10))}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#0d1c2e] hover:bg-[#eff4ff] transition-colors cursor-pointer"
            title="Thu nhỏ"
            aria-label="Thu nhỏ bản đồ"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowHeavyLayer(!showHeavyLayer)}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
              showHeavyLayer ? 'text-[#d95f00] bg-[#eff4ff]' : 'text-[#0d1c2e] hover:bg-[#eff4ff]'
            }`}
            title="Lớp bản đồ tải trọng"
            aria-label="Lớp bản đồ tải trọng"
          >
            <Layers className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#d95f00] hover:bg-[#eff4ff] transition-colors cursor-pointer"
            title="Định vị tâm xe"
            aria-label="Định vị tâm xe"
          >
            <Crosshair className="w-4 h-4" />
          </button>
        </div>

        {/* Map Marker 1: User's Commercial Vehicle Pin */}
        <div className="absolute top-[480px] left-[200px] z-30 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="bg-[#233144] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-md shadow-md whitespace-nowrap mb-1 border border-white/10">
            XE CỦA BẠN (51D-894.12)
          </div>
          <div className="relative flex items-center justify-center">
            <span className="absolute w-8 h-8 rounded-full bg-[#d95f00]/30 animate-ping" />
            <div className="w-9 h-9 rounded-full bg-[#131b2e] border-2 border-white flex items-center justify-center shadow-lg">
              <Truck className="w-5 h-5 text-[#d95f00]" />
            </div>
          </div>
        </div>

        {/* Map Marker 2: Selected Yard 1 (Tân Cảng Phú Hữu) */}
        <div
          onClick={() => lots[0] && onSelectLot(lots[0])}
          className="absolute top-[280px] left-[540px] z-30 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group"
        >
          <div className="bg-black text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xl flex items-center gap-1.5 whitespace-nowrap scale-105 group-hover:scale-110 transition-transform border border-white/20">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#d95f00]" />
            <span>40K · 12 Slot trống</span>
          </div>
          <div className="w-3.5 h-3.5 bg-black rotate-45 -mt-1.5" />
          <div className="w-4 h-1 bg-black/30 rounded-full mt-1 blur-[1px]" />
        </div>

        {/* Map Marker 3: ICD Sóng Thần 2 */}
        <div
          onClick={() => lots[1] && onSelectLot(lots[1])}
          className="absolute top-[160px] left-[390px] z-20 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer opacity-90 hover:opacity-100 transition-opacity"
        >
          <div className="bg-[#233144] text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1 whitespace-nowrap border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#d95f00]" />
            <span>35K · 5 Slot</span>
          </div>
          <div className="w-2.5 h-2.5 bg-[#233144] rotate-45 -mt-1" />
        </div>

        {/* Map Marker 4: Depot Cát Lái Gate 2 (Full Lot) */}
        <div
          onClick={() => lots[2] && onSelectLot(lots[2])}
          className="absolute top-[370px] left-[360px] z-20 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer opacity-90 hover:opacity-100 transition-opacity"
        >
          <div className="bg-white text-[#0d1c2e] text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg shadow-md flex items-center gap-1 whitespace-nowrap border border-slate-300">
            <Lock className="w-3 h-3 text-rose-600" />
            <span>HẾT CHỖ · Chờ 3 xe</span>
          </div>
          <div className="w-2 h-2 bg-white rotate-45 -mt-1 border-r border-b border-slate-300" />
        </div>

        {/* Map Marker 5: Long Thành Dầu Giây */}
        <div
          onClick={() => lots[3] && onSelectLot(lots[3])}
          className="absolute top-[200px] left-[730px] z-20 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer opacity-90 hover:opacity-100 transition-opacity"
        >
          <div className="bg-[#233144] text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1 whitespace-nowrap border border-white/10">
            <span>30K · 18 Slot</span>
          </div>
          <div className="w-2.5 h-2.5 bg-[#233144] rotate-45 -mt-1" />
        </div>

        {/* Bottom Left Operational Coordinates Legend */}
        <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-sm text-xs font-mono text-[#45464d] flex items-center gap-2 border border-slate-200">
          <span>GPS: 10.7681° N, 106.7942° E</span>
          <span>·</span>
          <span>Zoom: {zoomLevel}x</span>
          <span>·</span>
          <span>Bản đồ OSM Cảng Biển V2.4</span>
        </div>

        {/* Bottom Right Route Preview Pill */}
        {activeLot && (
          <div className="absolute bottom-4 right-4 z-20 bg-white/95 rounded-xl px-3 py-2 shadow-lg flex items-center gap-3 border border-slate-200">
            <div className="w-2.5 h-2.5 rounded-full bg-[#d95f00]" />
            <span className="text-xs font-bold text-[#0d1c2e] max-w-[150px] truncate">
              {activeLot.name} (Đang chọn)
            </span>
            <button
              type="button"
              onClick={() => onQuickBook(activeLot)}
              className="bg-black hover:bg-[#233144] text-white px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              GIỮ CHỖ
            </button>
          </div>
        )}
      </div>

      {/* Quick Dispatch Warning Bar */}
      <div className="bg-white rounded-2xl p-3.5 flex items-center justify-between shadow-sm border border-slate-200/80">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
          <span className="text-xs text-[#0d1c2e]">
            Đoạn Đỗ Xuân Hợp qua Nguyễn Duy Trinh mật độ cao:{' '}
            <strong className="text-[#d95f00]">Lưu lượng xe 85%</strong>
          </span>
        </div>
        <span className="font-mono text-slate-400 text-xs">Cập nhật 1 phút trước</span>
      </div>
    </div>
  )
}
