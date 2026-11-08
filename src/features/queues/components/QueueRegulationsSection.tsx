import { useState } from 'react'
import { ShieldCheck, Clock, Radio, Truck, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react'
import type { QueueRegulationItem } from '../types/queueTypes'

interface QueueRegulationsSectionProps {
  regulations: QueueRegulationItem[]
}

export function QueueRegulationsSection({
  regulations,
}: QueueRegulationsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getIcon = (name: string) => {
    switch (name) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />
      case 'ClockAlert':
      case 'Clock':
        return <Clock className="w-4 h-4 text-amber-600" />
      case 'Radio':
        return <Radio className="w-4 h-4 text-blue-600" />
      case 'Truck':
        return <Truck className="w-4 h-4 text-orange-600" />
      default:
        return <HelpCircle className="w-4 h-4 text-slate-600" />
    }
  }

  return (
    <section className="mt-8">
      {/* Collapsible Accordion Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 md:p-5 hover:bg-slate-50/80 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </span>
            <div>
              <h3 className="text-sm md:text-base font-bold font-sora text-slate-900">
                Quy Định Vận Hành Hàng Đợi Ảo & Giữ Chỗ Tự Động
              </h3>
              <p className="text-xs text-slate-500">
                Tìm hiểu các nguyên tắc điều phối thứ tự, thời gian giữ slot 15 phút và bán kính giữ chỗ quanh bãi xe
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline-block text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              {isExpanded ? 'Bấm để thu gọn' : 'Bấm để xem'}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </div>
        </button>

        {/* Collapsible Content */}
        {isExpanded && (
          <div className="p-4 md:p-6 border-t border-slate-100 bg-slate-50/50 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {regulations.map((reg) => (
                <div
                  key={reg.number}
                  className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                        {getIcon(reg.iconName)}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {reg.tag}
                      </span>
                    </div>

                    <div className="text-[11px] font-mono font-bold text-slate-400 mb-0.5">
                      ĐIỀU #{reg.number}
                    </div>

                    <h4 className="text-xs md:text-sm font-bold text-slate-900 mb-1.5">
                      {reg.title}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {reg.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
