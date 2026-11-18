import { useState, useMemo } from 'react'
import { ShieldCheck, TrendingUp } from 'lucide-react'
import type { RevenueSeriesPointDto } from '../types/merchantDashboardTypes'

interface RevenueVolumeComboChartProps {
  data?: RevenueSeriesPointDto[]
  isLoading?: boolean
  parkingLotName?: string
  totalNetRevenue?: number
}

export function RevenueVolumeComboChart({
  data = [],
  isLoading = false,
  parkingLotName,
}: RevenueVolumeComboChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const effectiveData = useMemo(() => {
    if (!data || data.length === 0) return []
    return data.map((d) => {
      const transfer = d.revenue ?? 0
      const cash = d.cashRevenue ?? 0
      return {
        ...d,
        transferRevenue: transfer,
        cashRevenue: cash,
        cashBookingCount: d.cashBookingCount ?? 0,
        totalDayRevenue: transfer + cash,
      }
    })
  }, [data])

  const formatVND = (val: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)

  const formatVNDShort = (val: number) => {
    if (val >= 1_000_000) {
      const m = val / 1_000_000
      return `${Number.isInteger(m) ? m : m.toFixed(1)}M`
    }
    if (val >= 1_000) {
      return `${Math.round(val / 1_000)}k`
    }
    return `${val}`
  }

  if (isLoading) {
    return (
      <div
        className="bg-white p-5 lg:p-6 rounded-2xl shadow-xs border border-slate-200/90 flex flex-col gap-4 animate-pulse"
        role="status"
        aria-label="Đang tải biểu đồ"
      >
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <div className="space-y-2">
            <div className="h-3 w-32 bg-slate-200 rounded" />
            <div className="h-5 w-56 bg-slate-200 rounded" />
          </div>
        </div>
        <div className="h-10 bg-slate-100 rounded-xl" />
        <div className="h-[240px] flex items-end justify-between gap-4 px-8 pt-6 pb-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="flex w-full justify-center gap-1 items-end h-36">
                <div
                  className="w-4 bg-slate-200 rounded-t"
                  style={{ height: `${30 + (i % 4) * 20}%` }}
                />
                <div
                  className="w-4 bg-orange-100 rounded-t"
                  style={{ height: `${20 + (i % 3) * 18}%` }}
                />
              </div>
              <div className="h-3 w-8 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const hasAnyActivity = effectiveData.some(
    (d) => d.totalDayRevenue > 0 || d.bookingCount > 0,
  )

  if (effectiveData.length === 0 || !hasAnyActivity) {
    return (
      <div className="bg-white p-5 lg:p-6 rounded-2xl shadow-xs border border-slate-200/90 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-3 border-b border-slate-100">
          <div className="flex flex-col">
            <span className="font-mono text-[11px] text-[#d95f00] uppercase tracking-wider font-bold">
              TỔNG HỢP GIAO DỊCH VẬN TẢI
            </span>
            <h2 className="font-sora text-base lg:text-lg text-[#0d1c2e] font-bold m-0 mt-0.5">
              Doanh Thu &amp; Lưu Lượng {parkingLotName ? `· ${parkingLotName}` : 'Toàn Hệ Thống'}
            </h2>
          </div>
        </div>
        <div className="py-12 px-4 flex flex-col items-center justify-center text-center gap-3 bg-[#f8faff] rounded-xl border border-dashed border-slate-200">
          <TrendingUp className="w-10 h-10 text-slate-400 stroke-[1.5]" />
          <p className="font-sora text-sm font-semibold text-[#0d1c2e] m-0">
            Chưa có dữ liệu biểu đồ doanh thu.
          </p>
          <p className="text-xs text-slate-500 max-w-sm m-0">
            Bãi xe chưa phát sinh lượt đặt chỗ hoặc doanh thu trong khoảng thời gian này.
          </p>
        </div>
      </div>
    )
  }

  const maxBarValue = Math.max(
    1,
    ...effectiveData.map((d) => Math.max(d.transferRevenue, d.cashRevenue)),
  )
  const maxVolume = Math.max(1, ...effectiveData.map((d) => d.bookingCount))
  const peakItem = effectiveData.reduce(
    (max, cur) => (cur.totalDayRevenue > max.totalDayRevenue ? cur : max),
    effectiveData[0],
  )

  const chartWidth = 720
  const chartHeight = 250
  const padLeft = 48
  const padRight = 45
  const topY = 30
  const baseY = 215
  const plotH = baseY - topY
  const plotW = chartWidth - padLeft - padRight
  const n = effectiveData.length

  const groupWidth = plotW / n
  const gapBetweenBars = Math.max(2, Math.min(6, groupWidth * 0.08))
  const singleBarWidth = Math.min(22, Math.max(7, (groupWidth * 0.62 - gapBetweenBars) / 2))

  const points = effectiveData.map((d, i) => {
    const cx = padLeft + (i + 0.5) * groupWidth
    const transferH =
      d.transferRevenue > 0
        ? Math.max(4, (d.transferRevenue / maxBarValue) * plotH)
        : 0
    const cashH =
      d.cashRevenue > 0 ? Math.max(4, (d.cashRevenue / maxBarValue) * plotH) : 0

    const transferX = cx - gapBetweenBars / 2 - singleBarWidth
    const cashX = cx + gapBetweenBars / 2

    const transferTopY = baseY - transferH
    const cashTopY = baseY - cashH
    const highestBarY = Math.min(
      transferH > 0 ? transferTopY : baseY,
      cashH > 0 ? cashTopY : baseY,
    )
    const lineY = baseY - (d.bookingCount / maxVolume) * plotH

    return {
      ...d,
      cx,
      transferX,
      cashX,
      transferH,
      transferTopY,
      cashH,
      cashTopY,
      highestBarY,
      lineY,
    }
  })

  const polylinePoints = points.map((p) => `${p.cx},${p.lineY}`).join(' ')
  const yTicks = [1, 0.75, 0.5, 0.25, 0]
  const labelEvery = n > 14 ? Math.ceil(n / 10) : 1

  return (
    <div className="bg-white p-5 lg:p-6 rounded-2xl shadow-xs border border-slate-200/90 flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-3 border-b border-slate-100">
        <div className="flex flex-col">
          <span className="font-mono text-[11px] text-[#d95f00] uppercase tracking-wider font-bold">
            SO SÁNH CHUYỂN KHOẢN &amp; TIỀN MẶT
          </span>
          <h2 className="font-sora text-base lg:text-lg text-[#0d1c2e] font-bold m-0 mt-0.5">
            Doanh Thu &amp; Lưu Lượng {parkingLotName ? `· ${parkingLotName}` : 'Toàn Hệ Thống'}
          </h2>
        </div>
        <span className="font-mono text-[11px] font-semibold text-slate-500">
          2 cột đứng cạnh nhau · {n} ngày
        </span>
      </div>

      {/* Peak Highlight & Legend Strip */}
      <div className="p-3 bg-[#eff4ff] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-2.5 font-mono text-xs border border-blue-50">
        <div className="flex flex-wrap items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#d95f00] shrink-0" />
          <span className="text-[#0d1c2e] font-bold">Đỉnh điểm doanh thu</span>
          <span className="text-[#45464d]">
            · {formatVND(peakItem?.totalDayRevenue ?? 0)} ({peakItem?.bookingCount ?? 0} lượt xe)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-[#0d1c2e] rounded-xs" />
            <span className="text-[#45464d]">Chuyển khoản (sau phí)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-[#d95f00] rounded-xs" />
            <span className="text-[#45464d]">Tiền mặt</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 bg-[#455f87] rounded-full" />
            <span className="text-[#45464d]">Số lượt đặt chỗ</span>
          </div>
        </div>
      </div>

      {/* Grouped Bar + Trendline Chart (SVG) */}
      <div className="relative w-full">
        <div className="w-full h-[290px] pt-2 pb-1 overflow-x-auto">
          <svg
            className="w-full h-full min-w-[640px] overflow-visible select-none"
          fill="none"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Biểu đồ 2 cột so sánh doanh thu chuyển khoản và tiền mặt"
        >
          {/* Horizontal Grid lines and Axis Ticks */}
          {yTicks.map((ratio) => {
            const y = topY + (1 - ratio) * plotH
            return (
              <g key={ratio}>
                <line
                  opacity="0.6"
                  stroke="#d5e3fc"
                  strokeDasharray="3 3"
                  x1={padLeft}
                  x2={chartWidth - padRight}
                  y1={y}
                  y2={y}
                />
                <text
                  fill="#45464d"
                  fontFamily="Inter, sans-serif"
                  fontSize="10"
                  fontWeight="600"
                  textAnchor="end"
                  x={padLeft - 8}
                  y={y + 3}
                >
                  {formatVNDShort(maxBarValue * ratio)}
                </text>
                <text
                  fill="#455f87"
                  fontFamily="Inter, sans-serif"
                  fontSize="10"
                  fontWeight="600"
                  textAnchor="start"
                  x={chartWidth - padRight + 8}
                  y={y + 3}
                >
                  {Math.round(maxVolume * ratio)}x
                </text>
              </g>
            )
          })}

          {/* Baseline */}
          <line
            opacity="0.4"
            stroke="#45464d"
            x1={padLeft}
            x2={chartWidth - padRight}
            y1={baseY}
            y2={baseY}
          />

          {/* 2 Grouped Bars Side-by-Side (Left = Chuyển khoản, Right = Tiền mặt) */}
          {points.map((p, idx) => {
            const isHovered = hoveredIndex === idx
            const isPeak = p.period === peakItem?.period && p.totalDayRevenue > 0
            const showXLabel = idx % labelEvery === 0 || idx === n - 1

            return (
              <g
                key={p.period}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              >
                <rect
                  x={p.cx - groupWidth / 2}
                  y={topY}
                  width={groupWidth}
                  height={plotH}
                  fill={isHovered ? '#eff4ff' : 'transparent'}
                  opacity="0.55"
                  rx="4"
                />

                {/* Left Bar: Chuyển khoản */}
                {p.transferH > 0 && (
                  <rect
                    data-testid={`bar-transfer-${p.period}`}
                    fill={isHovered ? '#1e3a5f' : '#0d1c2e'}
                    height={p.transferH}
                    width={singleBarWidth}
                    x={p.transferX}
                    y={p.transferTopY}
                    rx="3"
                    className="transition-colors duration-150"
                  />
                )}

                {/* Right Bar: Tiền mặt */}
                {p.cashH > 0 && (
                  <rect
                    data-testid={`bar-cash-${p.period}`}
                    fill={isHovered ? '#b84e00' : '#d95f00'}
                    height={p.cashH}
                    width={singleBarWidth}
                    x={p.cashX}
                    y={p.cashTopY}
                    rx="3"
                    className="transition-colors duration-150"
                  />
                )}

                {/* Date Label on X Axis */}
                {showXLabel && (
                  <text
                    fill={isPeak || isHovered ? '#0d1c2e' : '#45464d'}
                    fontFamily="Inter, sans-serif"
                    fontSize="10"
                    fontWeight={isPeak || isHovered ? '700' : '500'}
                    textAnchor="middle"
                    x={p.cx}
                    y={baseY + 17}
                  >
                    {n > 10 ? p.period.slice(5) : p.period}
                  </text>
                )}

                {/* Top value badges */}
                {n <= 10 && p.transferRevenue > 0 && (
                  <text
                    fill="#0d1c2e"
                    fontFamily="Inter, sans-serif"
                    fontSize="8.5"
                    fontWeight="700"
                    textAnchor="middle"
                    x={p.transferX + singleBarWidth / 2}
                    y={p.transferTopY - 5}
                  >
                    {formatVNDShort(p.transferRevenue)}
                  </text>
                )}
                {n <= 10 && p.cashRevenue > 0 && (
                  <text
                    fill="#d95f00"
                    fontFamily="Inter, sans-serif"
                    fontSize="8.5"
                    fontWeight="700"
                    textAnchor="middle"
                    x={p.cashX + singleBarWidth / 2}
                    y={p.cashTopY - 5}
                  >
                    {formatVNDShort(p.cashRevenue)}
                  </text>
                )}
              </g>
            )
          })}

          {/* Volume Trendline */}
          <polyline
            fill="none"
            points={polylinePoints}
            stroke="#455f87"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.25"
          />

          {/* Volume Circle Points */}
          {points.map((p, idx) => (
            <circle
              key={p.period}
              cx={p.cx}
              cy={p.lineY}
              fill={hoveredIndex === idx ? '#d95f00' : '#ffffff'}
              r={hoveredIndex === idx ? 5 : 3.25}
              stroke="#455f87"
              strokeWidth="2"
              className="transition-all duration-150"
            />
          ))}
        </svg>
        </div>

        {/* Floating Tooltip rendered outside scroll container so it is never clipped or overlapping bars */}
        {hoveredIndex !== null &&
          points[hoveredIndex] &&
          (() => {
            const hovered = points[hoveredIndex]
            const isRightHalf = hoveredIndex >= Math.ceil(points.length / 2)
            const rawLeftPct = (hovered.cx / chartWidth) * 100
            const tooltipPositionStyle = isRightHalf
              ? {
                  right: `${Math.min(72, Math.max(16, 100 - rawLeftPct + 5))}%`,
                  top: '14px',
                }
              : {
                  left: `${Math.min(72, Math.max(16, rawLeftPct + 5))}%`,
                  top: '14px',
                }

            return (
              <div
                data-testid="revenue-chart-tooltip"
                className="absolute z-30 pointer-events-none bg-[#0d1c2e]/95 backdrop-blur-xs text-white px-3.5 py-2.5 rounded-xl text-xs shadow-xl font-mono border border-slate-700/90 min-w-[216px]"
                style={tooltipPositionStyle}
              >
                <p className="font-bold text-[#ffdbca] border-b border-slate-700 pb-1 mb-1.5">
                  {hovered.period}
                </p>
                <p className="flex justify-between gap-3 text-slate-200">
                  <span>Chuyển khoản (sau phí):</span>
                  <span className="font-bold text-white">
                    {formatVND(hovered.transferRevenue)}
                  </span>
                </p>
                <p className="flex justify-between gap-3 text-orange-200">
                  <span>Tiền mặt:</span>
                  <span className="font-bold text-orange-300">
                    {formatVND(hovered.cashRevenue)}
                  </span>
                </p>
                <p className="flex justify-between gap-3 border-t border-slate-700 mt-1.5 pt-1 text-amber-200">
                  <span>Tổng ngày ({hovered.bookingCount} lượt):</span>
                  <span className="font-bold text-amber-300">
                    {formatVND(hovered.totalDayRevenue)}
                  </span>
                </p>
              </div>
            )
          })()}
      </div>
    </div>
  )
}
