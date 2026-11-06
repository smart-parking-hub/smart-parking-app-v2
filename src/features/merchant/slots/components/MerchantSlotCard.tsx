import { Minus, Plus, Zap, Scale, RotateCcw, Clock, ShieldCheck } from 'lucide-react'
import type { SlotMatrixItem } from '../types/merchantSlotsTypes'

interface MerchantSlotCardProps {
  item: SlotMatrixItem
  draftCapacity: number
  onChangeCapacity: (nextValue: number) => void
  onViolation: (message: string) => void
  disabled?: boolean
}

export function MerchantSlotCard({
  item,
  draftCapacity,
  onChangeCapacity,
  onViolation,
  disabled = false,
}: MerchantSlotCardProps) {
  const occupied = item.occupiedCapacity
  const available = Math.max(0, draftCapacity - occupied)
  const isConfigured = draftCapacity > 0
  const occupancyPercent = isConfigured
    ? Math.min(100, (occupied / draftCapacity) * 100)
    : 0

  const handleStepDown = () => {
    if (disabled) return
    if (draftCapacity > occupied) {
      onChangeCapacity(draftCapacity - 1)
    } else {
      onViolation(
        `Khóa bảo toàn: Đang có ${occupied} xe đỗ thuộc loại ${item.typeNameVi}, không thể giảm thêm!`,
      )
    }
  }

  const handleStepUp = () => {
    if (disabled) return
    if (draftCapacity < item.maxAllowed) {
      onChangeCapacity(draftCapacity + 1)
    } else {
      onViolation(`Đã đạt giới hạn tối đa ${item.maxAllowed} slot quy chuẩn!`)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return
    const rawVal = e.target.value.trim()
    if (rawVal === '') {
      onChangeCapacity(occupied)
      return
    }
    const parsed = parseInt(rawVal, 10)
    if (isNaN(parsed) || parsed < occupied) {
      onChangeCapacity(occupied)
      onViolation(`Sức chứa tối thiểu của ${item.typeNameVi} phải là ${occupied}!`)
    } else if (parsed > item.maxAllowed) {
      onChangeCapacity(item.maxAllowed)
      onViolation(`Giới hạn tối đa là ${item.maxAllowed} slot!`)
    } else {
      onChangeCapacity(parsed)
    }
  }

  return (
    <article
      data-vehicle={item.vehicleType}
      data-occupied={occupied}
      className={`p-5 lg:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 lg:gap-6 transition-all ${
        !isConfigured ? 'opacity-85' : ''
      }`}
    >
      {/* Cột 1: Thông tin phân loại & Specs kỹ thuật */}
      <div className="flex flex-col gap-2 max-w-xl">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`px-2.5 py-0.5 rounded font-mono text-[11px] font-bold tracking-wider uppercase ${
              item.tagTone === 'navy'
                ? 'bg-[#131b2e] text-white'
                : item.tagTone === 'orange'
                  ? 'bg-[#ffdbca] text-[#341100]'
                  : item.tagTone === 'blue'
                    ? 'bg-blue-100 text-blue-900'
                    : 'bg-slate-200 text-slate-700'
            }`}
          >
            {item.tagLabel}
          </span>
          <h3 className="font-sora text-base lg:text-lg text-slate-900 font-bold">
            {item.typeNameVi}
          </h3>
          {item.codeRange && (
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px] font-medium">
              {item.codeRange}
            </span>
          )}
          {occupancyPercent >= 100 && (
            <span className="px-2 py-0.5 rounded bg-[#341100] text-[#ffdbca] font-mono text-[11px] font-bold">
              FULL 100%
            </span>
          )}
          {!isConfigured && (
            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-mono text-[11px]">
              Chưa Kích Hoạt
            </span>
          )}
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">{item.subTitle}</p>

        {/* Thông số kỹ thuật chi tiết */}
        <div className="flex flex-wrap items-center gap-3 pt-1 font-mono text-xs text-slate-700">
          <span className="flex items-center gap-1">
            <span className="text-slate-400">Dài:</span> {item.specs.lengthMeters}m
          </span>
          {item.specs.powerOutlet && (
            <span className="flex items-center gap-1 text-[#d95f00] font-medium">
              <Zap className="w-3.5 h-3.5 text-[#d95f00]" />
              {item.specs.powerOutlet}
            </span>
          )}
          {item.specs.maxTonnageTon && (
            <span className="flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-slate-400" />
              Tải trọng: {item.specs.maxTonnageTon}T
            </span>
          )}
          {item.specs.turningRadiusM && (
            <span className="flex items-center gap-1">
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              Bán kính: {item.specs.turningRadiusM}m
            </span>
          )}
          {item.specs.specialLane && (
            <span className="flex items-center gap-1 text-blue-700 font-medium">
              <Clock className="w-3.5 h-3.5" />
              {item.specs.specialLane}
            </span>
          )}
        </div>
      </div>

      {/* Cột 2: Thanh tiến trình Occupancy & Bộ Điều Khiển Stepper */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 md:shrink-0 w-full md:w-auto justify-between sm:justify-end">
        {/* Thanh tỷ lệ lấp đầy */}
        <div className="w-full sm:w-52 lg:w-56 flex flex-col gap-1.5">
          <div className="flex justify-between font-mono text-xs">
            <span className="text-slate-600">
              Đang đỗ: <strong className="text-slate-900 font-bold">{occupied}</strong> /{' '}
              <span className="cap-display">{draftCapacity}</span>
            </span>
            <span
              className={`font-bold occ-pct ${
                occupancyPercent >= 100
                  ? 'text-[#d95f00]'
                  : occupancyPercent >= 80
                    ? 'text-amber-700'
                    : 'text-slate-700'
              }`}
            >
              {occupancyPercent.toFixed(1)}%
            </span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-slate-200/80 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                occupancyPercent >= 100
                  ? 'bg-[#d95f00]'
                  : occupancyPercent >= 80
                    ? 'bg-[#e07525]'
                    : isConfigured
                      ? 'bg-blue-600'
                      : 'bg-slate-300'
              }`}
              style={{ width: `${occupancyPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between font-mono text-[11px] text-slate-500">
            {available === 0 && isConfigured ? (
              <span className="text-[#d95f00] font-bold">HÀNG ĐỢI ẢO (VIRTUAL QUEUE)</span>
            ) : isConfigured ? (
              <span className="text-slate-800 font-semibold">
                Còn {available < 10 ? `0${available}` : available} chỗ trống
              </span>
            ) : (
              <span className="text-slate-400">Chưa khai thác</span>
            )}
            <span className="flex items-center gap-0.5 text-slate-400">
              <ShieldCheck className="w-3 h-3 text-slate-400" />
              Khóa min: {occupied}
            </span>
          </div>
        </div>

        {/* Stepper Controller */}
        <div className="flex flex-col gap-1 w-full sm:w-auto">
          <label className="font-mono text-xs text-slate-500 font-medium">
            Tổng Sức Chứa (Capacity)
          </label>
          <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200 shadow-xs">
            <button
              type="button"
              onClick={handleStepDown}
              disabled={disabled || draftCapacity <= occupied}
              aria-label={`Giảm sức chứa ${item.typeNameVi}`}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white text-slate-800 hover:bg-slate-200 transition-colors flex items-center justify-center font-bold disabled:opacity-35 disabled:hover:bg-white disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>

            <input
              type="number"
              min={occupied}
              max={item.maxAllowed}
              value={draftCapacity}
              onChange={handleInputChange}
              disabled={disabled}
              className="w-20 text-center font-sora text-lg font-bold bg-transparent text-slate-900 focus:outline-none tabular-nums font-mono"
            />

            <button
              type="button"
              onClick={handleStepUp}
              disabled={disabled || draftCapacity >= item.maxAllowed}
              aria-label={`Tăng sức chứa ${item.typeNameVi}`}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-white text-slate-800 hover:bg-slate-200 transition-colors flex items-center justify-center font-bold disabled:opacity-35 disabled:hover:bg-white disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <span className="font-mono text-[11px] text-slate-500 text-center">
            Tối thiểu: {occupied} slot
          </span>
        </div>
      </div>
    </article>
  )
}
