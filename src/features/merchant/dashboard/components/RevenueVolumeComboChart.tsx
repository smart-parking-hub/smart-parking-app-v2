import { useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import type { DailyRevenueVolumePoint } from '../types/merchantDashboardTypes'
import { cn } from '@/shared/utils/cn'

interface RevenueVolumeComboChartProps {
  data: DailyRevenueVolumePoint[]
}

export function RevenueVolumeComboChart({ data: _data }: RevenueVolumeComboChartProps) {
  const [activeTab, setActiveTab] = useState<'7days' | 'month' | 'quarter'>('7days')

  return (
    <div className="bg-white p-5 lg:p-6 rounded-2xl shadow-xs border border-slate-200/90 flex flex-col gap-4">
      {/* Chart Header & Range Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-3 border-b border-slate-100">
        <div className="flex flex-col">
          <span className="font-mono text-[11px] text-[#d95f00] uppercase tracking-wider font-bold">
            TỔNG HỢP GIAO DỊCH VẬN TẢI
          </span>
          <h2 className="font-sora text-base lg:text-lg text-[#0d1c2e] font-bold m-0 mt-0.5">
            Doanh Thu &amp; Lưu Lượng 7 Ngày Gần Nhất
          </h2>
        </div>

        {/* Range Selector Tabs */}
        <div className="flex items-center bg-[#eff4ff] p-1 rounded-xl font-mono text-xs border border-blue-100">
          <button
            type="button"
            onClick={() => setActiveTab('7days')}
            className={cn(
              'px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold',
              activeTab === '7days'
                ? 'bg-white text-[#0d1c2e] shadow-xs'
                : 'text-[#45464d] hover:text-[#0d1c2e]',
            )}
          >
            7 Ngày Gần Nhất
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('month')}
            className={cn(
              'px-3 py-1.5 rounded-lg transition-all cursor-pointer font-semibold',
              activeTab === 'month'
                ? 'bg-white text-[#0d1c2e] shadow-xs'
                : 'text-[#45464d] hover:text-[#0d1c2e]',
            )}
          >
            Tháng 02/2026
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('quarter')}
            className={cn(
              'px-3 py-1.5 rounded-lg transition-all cursor-pointer font-semibold',
              activeTab === 'quarter'
                ? 'bg-white text-[#0d1c2e] shadow-xs'
                : 'text-[#45464d] hover:text-[#0d1c2e]',
            )}
          >
            Quý 1/2026
          </button>
        </div>
      </div>

      {/* Highlight Peak Badge & Legend Strip */}
      <div className="p-3 bg-[#eff4ff] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-2.5 font-mono text-xs border border-blue-50">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#d95f00] shrink-0" />
          <span className="text-[#0d1c2e] font-bold">Đỉnh điểm lưu lượng: 18/02/2026</span>
          <span className="text-[#45464d]">· 26.400.000 ₫ (72 lượt vào/ra)</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 lg:gap-4 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-[#0d1c2e] rounded-xs" />
            <span className="text-[#45464d]">Doanh thu bãi chính</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-[#d95f00] rounded-xs" />
            <span className="text-[#45464d]">Phụ phí lưu ca reefer</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 bg-[#455f87] rounded-full" />
            <span className="text-[#45464d]">Số chuyến (Lượt xe)</span>
          </div>
        </div>
      </div>

      {/* Precision Composed Chart Visual (High-Fidelity SVG) */}
      <div className="w-full h-[280px] pt-2 pb-1 relative overflow-x-auto">
        <svg
          className="w-full h-full min-w-[620px] overflow-visible select-none"
          fill="none"
          viewBox="0 0 700 240"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Biểu đồ doanh thu và lưu lượng 7 ngày"
        >
          {/* Horizontal Grid Lines */}
          <line opacity="0.6" stroke="#d5e3fc" strokeDasharray="3 3" x1="40" x2="680" y1="20" y2="20" />
          <line opacity="0.6" stroke="#d5e3fc" strokeDasharray="3 3" x1="40" x2="680" y1="70" y2="70" />
          <line opacity="0.6" stroke="#d5e3fc" strokeDasharray="3 3" x1="40" x2="680" y1="120" y2="120" />
          <line opacity="0.6" stroke="#d5e3fc" strokeDasharray="3 3" x1="40" x2="680" y1="170" y2="170" />
          <line opacity="0.4" stroke="#45464d" x1="40" x2="680" y1="220" y2="220" />

          {/* Y-Axis Labels (Left: VNĐ in Triệu, Right: Lượt xe) */}
          <text fill="#45464d" fontFamily="Inter" fontSize="10" fontWeight="600" textAnchor="end" x="35" y="24">30M</text>
          <text fill="#45464d" fontFamily="Inter" fontSize="10" fontWeight="600" textAnchor="end" x="35" y="74">22M</text>
          <text fill="#45464d" fontFamily="Inter" fontSize="10" fontWeight="600" textAnchor="end" x="35" y="124">15M</text>
          <text fill="#45464d" fontFamily="Inter" fontSize="10" fontWeight="600" textAnchor="end" x="35" y="174">7M</text>
          <text fill="#45464d" fontFamily="Inter" fontSize="10" fontWeight="600" textAnchor="end" x="35" y="224">0</text>
          <text fill="#455f87" fontFamily="Inter" fontSize="10" fontWeight="600" textAnchor="start" x="685" y="24">80x</text>
          <text fill="#455f87" fontFamily="Inter" fontSize="10" fontWeight="600" textAnchor="start" x="685" y="124">40x</text>
          <text fill="#455f87" fontFamily="Inter" fontSize="10" fontWeight="600" textAnchor="start" x="685" y="224">0x</text>

          {/* Day 1: 14/02 */}
          <rect fill="#0d1c2e" height="110" width="18" x="75" y="110" rx="2" />
          <rect fill="#341100" height="70" width="12" x="96" y="150" rx="2" />
          <text fill="#45464d" fontFamily="Inter" fontSize="10" textAnchor="middle" x="94" y="235">14/02</text>

          {/* Day 2: 15/02 */}
          <rect fill="#0d1c2e" height="130" width="18" x="155" y="90" rx="2" />
          <rect fill="#341100" height="90" width="12" x="176" y="130" rx="2" />
          <text fill="#45464d" fontFamily="Inter" fontSize="10" textAnchor="middle" x="174" y="235">15/02</text>

          {/* Day 3: 16/02 */}
          <rect fill="#0d1c2e" height="90" width="18" x="235" y="130" rx="2" />
          <rect fill="#341100" height="55" width="12" x="256" y="165" rx="2" />
          <text fill="#45464d" fontFamily="Inter" fontSize="10" textAnchor="middle" x="254" y="235">16/02</text>

          {/* Day 4: 17/02 */}
          <rect fill="#0d1c2e" height="150" width="18" x="315" y="70" rx="2" />
          <rect fill="#341100" height="105" width="12" x="336" y="115" rx="2" />
          <text fill="#45464d" fontFamily="Inter" fontSize="10" textAnchor="middle" x="334" y="235">17/02</text>

          {/* Day 5: 18/02 (Peak Day) */}
          <rect fill="#0d1c2e" height="185" width="18" x="395" y="35" rx="2" />
          <rect fill="#d95f00" height="140" width="12" x="416" y="80" rx="2" />
          {/* Highlight pill on peak bar */}
          <rect fill="#341100" height="16" rx="4" width="46" x="388" y="15" />
          <text fill="#ffdbca" fontFamily="Inter" fontSize="9" fontWeight="700" textAnchor="middle" x="411" y="26">26.4M</text>
          <text fill="#0d1c2e" fontFamily="Inter" fontSize="10" fontWeight="700" textAnchor="middle" x="414" y="235">18/02</text>

          {/* Day 6: 19/02 */}
          <rect fill="#0d1c2e" height="140" width="18" x="475" y="80" rx="2" />
          <rect fill="#341100" height="100" width="12" x="496" y="120" rx="2" />
          <text fill="#45464d" fontFamily="Inter" fontSize="10" textAnchor="middle" x="494" y="235">19/02</text>

          {/* Day 7: Hôm nay 20/02 */}
          <rect fill="#0d1c2e" height="160" opacity="0.9" width="18" x="555" y="60" rx="2" />
          <rect fill="#d95f00" height="115" width="12" x="576" y="105" rx="2" />
          <text fill="#0d1c2e" fontFamily="Inter" fontSize="10" fontWeight="700" textAnchor="middle" x="574" y="235">H.Nay</text>

          {/* Trendline for Vehicle volume */}
          <polyline
            fill="none"
            points="94,130 174,105 254,145 334,85 414,40 494,95 574,75"
            stroke="#455f87"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
          />

          {/* Trendline data points */}
          <circle cx="94" cy="130" fill="#ffffff" r="3.5" stroke="#455f87" strokeWidth="2" />
          <circle cx="174" cy="105" fill="#ffffff" r="3.5" stroke="#455f87" strokeWidth="2" />
          <circle cx="254" cy="145" fill="#ffffff" r="3.5" stroke="#455f87" strokeWidth="2" />
          <circle cx="334" cy="85" fill="#ffffff" r="3.5" stroke="#455f87" strokeWidth="2" />
          <circle cx="414" cy="40" fill="#d95f00" r="4.5" stroke="#0d1c2e" strokeWidth="2" />
          <circle cx="494" cy="95" fill="#ffffff" r="3.5" stroke="#455f87" strokeWidth="2" />
          <circle cx="574" cy="75" fill="#ffffff" r="3.5" stroke="#455f87" strokeWidth="2" />
        </svg>
      </div>
    </div>
  )
}
