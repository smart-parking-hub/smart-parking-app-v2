import {
  Wallet,
  RotateCcw,
  ClockAlert,
  BadgeCheck,
  Truck,
  CheckCircle2,
  ShieldCheck,
  CloudCheck,
} from 'lucide-react'
import type { FinancialMetricsData } from '../types/paymentTypes'

interface FinancialMetricsBentoProps {
  metrics: FinancialMetricsData
}

export function FinancialMetricsBento({ metrics }: FinancialMetricsBentoProps) {
  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Card 1: Total Spent */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between gap-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="font-mono text-xs text-slate-500 uppercase font-semibold">
              TỔNG CHI PHÍ THÁNG NÀY
            </span>
            <div className="text-2xl md:text-3xl font-bold font-sora text-slate-900 mt-1 leading-none">
              {formatMoney(metrics.totalSpentMonth)}{' '}
              <span className="text-lg font-semibold text-slate-500">₫</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-600 flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-slate-400" />
            {metrics.containerTripsCount} lượt đỗ container
          </span>
          <span className="font-mono px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-bold text-[11px]">
            {metrics.quarterLabel}
          </span>
        </div>
      </div>

      {/* Card 2: Refunded Deposit */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between gap-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="font-mono text-xs text-slate-500 uppercase font-semibold">
              TIỀN CỌC ĐÃ HOÀN TRẢ
            </span>
            <div className="text-2xl md:text-3xl font-bold font-sora text-orange-600 mt-1 leading-none">
              {formatMoney(metrics.refundAmount)}{' '}
              <span className="text-lg font-semibold text-orange-400">₫</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-200">
            <RotateCcw className="w-5 h-5" />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-orange-600" />
            {metrics.onTimeCheckInCount} lượt check-in đúng hẹn hoàn 100%
          </span>
          <span className="font-mono px-2 py-0.5 bg-orange-100 text-orange-800 rounded font-bold text-[11px]">
            100% AUTO
          </span>
        </div>
      </div>

      {/* Card 3: Penalty */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between gap-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="font-mono text-xs text-slate-500 uppercase font-semibold">
              PHẠT QUÁ GIỜ PHÁT SINH
            </span>
            <div className="text-2xl md:text-3xl font-bold font-sora text-slate-900 mt-1 leading-none">
              {formatMoney(metrics.penaltyAmount)}{' '}
              <span className="text-lg font-semibold text-slate-500">₫</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <ClockAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-600 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
            {metrics.overtimeViolationsCount} vi phạm vượt giờ đỗ bãi
          </span>
          <span className="font-mono px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-bold text-[11px]">
            CHUẨN GIỜ
          </span>
        </div>
      </div>

      {/* Card 4: Synced VAT */}
      <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between gap-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <span className="font-mono text-xs text-slate-500 uppercase font-semibold">
              HĐĐT VAT ĐÃ ĐỒNG BỘ
            </span>
            <div className="text-2xl md:text-3xl font-bold font-sora text-slate-900 mt-1 leading-none">
              {metrics.syncedVatCount}{' '}
              <span className="text-lg font-medium text-slate-500">
                / {metrics.totalVatCount} HĐ
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 border border-blue-200">
            <BadgeCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-600 flex items-center gap-1">
            <CloudCheck className="w-3.5 h-3.5 text-blue-600" />
            100% đồng bộ tự động TT78
          </span>
          <span className="font-mono px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-bold text-[11px]">
            CQT ACTIVE
          </span>
        </div>
      </div>
    </div>
  )
}
