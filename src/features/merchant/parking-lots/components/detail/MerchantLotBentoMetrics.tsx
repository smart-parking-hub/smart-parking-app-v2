import { Wallet, TrendingUp, AlertTriangle, Star, Gauge, CheckCircle2 } from 'lucide-react'
import type { MerchantParkingLotDetailData } from '../../types/merchantParkingLotTypes'

interface MerchantLotBentoMetricsProps {
  lot: MerchantParkingLotDetailData
}

export function MerchantLotBentoMetrics({ lot }: MerchantLotBentoMetricsProps) {
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const occupancy = lot.occupancyRate || Math.round((lot.usedSlots / (lot.totalCapacity || 1)) * 100)
  const isNearFull = occupancy >= 85

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* Metric 1: Doanh Thu Tháng Này */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-slate-500 uppercase tracking-wider font-semibold">
            Doanh Thu Tháng Này (Net)
          </span>
          <div className="w-8 h-8 rounded-lg bg-[#eff4ff] flex items-center justify-center text-slate-700">
            <Wallet className="w-4 h-4 text-slate-600" />
          </div>
        </div>

        <div className="my-3">
          <div className="font-sora text-2xl lg:text-3xl text-[#0d1c2e] font-bold tracking-tight">
            {formatMoney(lot.monthlyRevenue || 82500000)}
          </div>
          <div className="flex items-center gap-1.5 mt-1 font-mono text-xs text-[#d95f00] font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+16.4% so với tháng trước</span>
          </div>
        </div>

        <div className="pt-2.5 border-t border-slate-100 flex justify-between font-mono text-xs text-slate-500">
          <span>Sản lượng luân chuyển</span>
          <strong className="text-[#0d1c2e] font-bold">
            {lot.reviewCount ? `${lot.reviewCount} lượt xe` : '284 lượt xe'}
          </strong>
        </div>
      </div>

      {/* Metric 2: Tỷ Lệ Chiếm Dụng Slot */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-slate-500 uppercase tracking-wider font-semibold">
            Tỷ Lệ Chiếm Dụng Slot
          </span>
          <div className="w-8 h-8 rounded-lg bg-[#ffdbca]/40 flex items-center justify-center text-[#d95f00]">
            <AlertTriangle className="w-4 h-4 text-[#d95f00]" />
          </div>
        </div>

        <div className="my-3">
          <div className="flex items-baseline gap-2">
            <span className="font-sora text-2xl lg:text-3xl text-[#0d1c2e] font-bold tracking-tight">
              {occupancy.toFixed(1)}%
            </span>
            <span className="font-mono text-xs text-slate-500">
              {lot.usedSlots} / {lot.totalCapacity} Slot
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-[#d95f00] h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, occupancy))}%` }}
            />
          </div>
        </div>

        {isNearFull ? (
          <div className="px-2.5 py-1 rounded-md bg-[#ffdbca] text-[#341100] font-mono text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#d95f00] animate-ping" />
            <span>CẢNH BÁO: BÃI SẮP ĐẦY TẢI VẬT LÝ</span>
          </div>
        ) : (
          <div className="pt-2.5 border-t border-slate-100 flex justify-between font-mono text-xs text-slate-500">
            <span>Khả dụng còn lại</span>
            <strong className="text-emerald-700 font-bold">
              {lot.totalCapacity - lot.usedSlots} Slot trống
            </strong>
          </div>
        )}
      </div>

      {/* Metric 3: Đánh Giá Bác Tài */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-slate-500 uppercase tracking-wider font-semibold">
            Đánh Giá Bác Tài
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
          </div>
        </div>

        <div className="my-3">
          <div className="flex items-baseline gap-2">
            <span className="font-sora text-2xl lg:text-3xl text-[#0d1c2e] font-bold tracking-tight">
              {lot.ratingAverage ? lot.ratingAverage.toFixed(1) : '4.9'}
            </span>
            <span className="font-mono text-xs text-slate-400">/ 5.0</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-amber-500">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
          </div>
        </div>

        <div className="pt-2.5 border-t border-slate-100 flex justify-between font-mono text-xs text-slate-500">
          <span>Xác minh trên hệ thống</span>
          <strong className="text-[#0d1c2e] font-bold">
            {lot.reviewCount || 284} nhận xét
          </strong>
        </div>
      </div>

      {/* Metric 4: Tốc Độ ALPR Gate */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-slate-500 uppercase tracking-wider font-semibold">
            Tốc Độ Xử Lý ALPR Gate
          </span>
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <Gauge className="w-4 h-4 text-blue-600" />
          </div>
        </div>

        <div className="my-3">
          <div className="font-sora text-2xl lg:text-3xl text-[#0d1c2e] font-bold tracking-tight">
            {lot.alprLatencySec ? `${lot.alprLatencySec}s / xe` : '0.18s / xe'}
          </div>
          <div className="flex items-center gap-1.5 mt-1 font-mono text-xs text-slate-700 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Nhận diện biển số tự động 100%</span>
          </div>
        </div>

        <div className="pt-2.5 border-t border-slate-100 flex justify-between font-mono text-xs text-slate-500">
          <span>Camera Barie #01 &amp; #02</span>
          <strong className="text-emerald-700 font-bold">Đồng bộ đám mây</strong>
        </div>
      </div>
    </div>
  )
}
