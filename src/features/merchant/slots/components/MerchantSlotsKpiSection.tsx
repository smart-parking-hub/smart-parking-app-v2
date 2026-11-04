import { Grid, Truck, CalendarCheck, RefreshCw } from 'lucide-react'
import type { SlotKpiMetrics } from '../types/merchantSlotsTypes'

interface MerchantSlotsKpiSectionProps {
  metrics: SlotKpiMetrics
}

export function MerchantSlotsKpiSection({ metrics }: MerchantSlotsKpiSectionProps) {
  const isNearFull = metrics.occupancyPercent >= 85
  const isFull = metrics.occupancyPercent >= 100

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 1. Tổng Sức Chứa Toàn Bãi */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs uppercase text-slate-500 tracking-wider font-semibold">
            Tổng Sức Chứa Toàn Bãi
          </span>
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
            <Grid className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span
            className="font-sora text-3xl lg:text-4xl text-slate-900 font-bold"
            data-testid="kpi-total-cap"
          >
            {metrics.totalCapacity}
          </span>
          <span className="text-xs text-slate-500 font-medium">Chỗ Đỗ Thiết Kế</span>
        </div>
        <div className="mt-3 flex items-center gap-1.5 font-mono text-xs text-slate-500 border-t border-slate-100 pt-2.5">
          <span>Quy chuẩn cấp phép: Cụm Gate 2 Cát Lái</span>
        </div>
      </div>

      {/* 2. Xe Đang Đỗ Thực Tế */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs uppercase text-slate-500 tracking-wider font-semibold">
            Xe Đang Đỗ Thực Tế
          </span>
          <div className="w-8 h-8 rounded-lg bg-[#ffdbca] text-[#d95f00] flex items-center justify-center">
            <Truck className="w-4 h-4 text-[#d95f00]" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span
            className="font-sora text-3xl lg:text-4xl text-slate-900 font-bold"
            data-testid="kpi-occupied-cap"
          >
            {metrics.totalOccupied}
          </span>
          <span className="text-xs text-[#d95f00] font-semibold">Xe Hiện Hữu</span>
        </div>
        <div className="mt-3 flex items-center justify-between font-mono text-xs border-t border-slate-100 pt-2.5">
          <span className="text-slate-600">
            Tỷ lệ lấp đầy: <strong>{metrics.occupancyPercent.toFixed(1)}%</strong>
          </span>
          {isFull ? (
            <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold text-[11px] uppercase">
              Bãi Kín Chỗ
            </span>
          ) : isNearFull ? (
            <span className="px-2 py-0.5 rounded bg-[#341100] text-[#ffdbca] font-bold text-[11px] uppercase">
              Cảnh Báo Sắp Đầy
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[11px] uppercase">
              Ổn Định
            </span>
          )}
        </div>
      </div>

      {/* 3. Chỗ Trống Khả Dụng */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs uppercase text-slate-500 tracking-wider font-semibold">
            Chỗ Trống Khả Dụng
          </span>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
            <CalendarCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span
            className="font-sora text-3xl lg:text-4xl text-slate-900 font-bold"
            data-testid="kpi-available-cap"
          >
            {metrics.totalAvailable < 10 && metrics.totalAvailable >= 0
              ? `0${metrics.totalAvailable}`
              : metrics.totalAvailable}
          </span>
          <span className="text-xs text-slate-500 font-medium">Slot Đón Khách</span>
        </div>
        <div className="mt-3 flex items-center gap-1.5 font-mono text-xs text-slate-500 border-t border-slate-100 pt-2.5">
          <RefreshCw className="w-3.5 h-3.5 text-slate-600 animate-spin" />
          <span>Đồng bộ thời gian thực Barie ALPR</span>
        </div>
      </div>
    </section>
  )
}
