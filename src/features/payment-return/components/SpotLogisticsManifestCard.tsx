import {
  Warehouse,
  MapPin,
  ParkingCircle,
  Zap,
  Truck,
  Clock,
} from 'lucide-react'
import type { PaymentReturnManifestDto } from '../types/paymentReturnTypes'

interface SpotLogisticsManifestCardProps {
  manifest: PaymentReturnManifestDto
}

export function SpotLogisticsManifestCard({
  manifest,
}: SpotLogisticsManifestCardProps) {
  return (
    <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header: Booking Code & Guaranteed Badge */}
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-slate-500 font-bold block mb-1">
              MÃ XÁC NHẬN GIỮ CHỖ
            </span>
            <div className="font-sora text-2xl font-bold text-slate-900 tracking-tight">
              {manifest.bookingCode}
            </div>
          </div>
          <span className="px-3 py-1 rounded-lg bg-slate-900 text-white font-mono text-xs font-bold uppercase tracking-wider">
            BERTH GUARANTEED
          </span>
        </div>

        {/* Tabular Details */}
        <div className="space-y-2.5 pt-4 text-xs sm:text-sm">
          {/* Row 1: Bãi đỗ */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2.5 bg-slate-50 px-3.5 rounded-xl border border-slate-200/60">
            <span className="text-slate-600 font-medium uppercase text-xs flex items-center gap-2">
              <Warehouse className="w-4 h-4 text-orange-600" />
              Bãi đỗ xác nhận
            </span>
            <span className="font-bold text-slate-900 text-right mt-1 sm:mt-0">
              {manifest.parkingLotName}
            </span>
          </div>

          {/* Row 2: Địa chỉ */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2.5 px-3.5 rounded-xl">
            <span className="text-slate-600 font-medium uppercase text-xs flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-600" />
              Địa chỉ trạm
            </span>
            <span className="text-slate-800 text-right text-xs sm:text-sm mt-1 sm:mt-0 font-medium">
              {manifest.parkingLotAddress}
            </span>
          </div>

          {/* Row 3: Berth chỉ định */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2.5 bg-slate-50 px-3.5 rounded-xl border border-slate-200/60">
            <span className="text-slate-600 font-medium uppercase text-xs flex items-center gap-2">
              <ParkingCircle className="w-4 h-4 text-orange-600" />
              Vị trí Berth chỉ định
            </span>
            <span className="font-sora font-bold text-orange-600 text-right text-base sm:text-lg mt-1 sm:mt-0">
              {manifest.berthCode}
            </span>
          </div>

          {/* Row 4: Tiện ích kèm theo */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2.5 px-3.5 rounded-xl">
            <span className="text-slate-600 font-medium uppercase text-xs flex items-center gap-2">
              <Zap className="w-4 h-4 text-slate-500" />
              Tiện ích kèm theo
            </span>
            <span className="text-slate-900 text-right font-semibold mt-1 sm:mt-0">
              {manifest.amenitiesText}
            </span>
          </div>

          {/* Row 5: Phương tiện đăng ký */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2.5 bg-slate-50 px-3.5 rounded-xl border border-slate-200/60">
            <span className="text-slate-600 font-medium uppercase text-xs flex items-center gap-2">
              <Truck className="w-4 h-4 text-slate-500" />
              Phương tiện đăng ký
            </span>
            <div className="text-right font-mono text-xs sm:text-sm mt-1 sm:mt-0">
              <span className="font-bold text-slate-900">{manifest.vehiclePlate}</span>
              {manifest.trailerPlate && (
                <span className="text-slate-600"> (Rơ-moóc: {manifest.trailerPlate})</span>
              )}
            </div>
          </div>

          {/* Row 6: Hạn giữ chỗ */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2.5 px-3.5 rounded-xl">
            <span className="text-slate-600 font-medium uppercase text-xs flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              Hạn giữ chỗ 100%
            </span>
            <span className="font-mono font-bold text-slate-900 text-right mt-1 sm:mt-0">
              {manifest.guaranteedUntilText}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Deposit Strip */}
      <div className="mt-6 pt-3.5 bg-slate-100 p-3.5 rounded-xl flex items-center justify-between text-xs sm:text-sm border border-slate-200/80">
        <span className="text-slate-600 font-medium">Cọc đảm bảo slot đã thanh toán:</span>
        <span className="font-mono font-bold text-slate-900 text-sm sm:text-base">
          {manifest.depositStatusText}
        </span>
      </div>
    </div>
  )
}
