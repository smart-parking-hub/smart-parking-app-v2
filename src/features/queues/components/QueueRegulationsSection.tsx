import { ShieldCheck, Clock, Radio, Truck, HelpCircle } from 'lucide-react'
import type { QueueRegulationItem } from '../types/queueTypes'

interface QueueRegulationsSectionProps {
  regulations: QueueRegulationItem[]
}

export function QueueRegulationsSection({
  regulations,
}: QueueRegulationsSectionProps) {
  const getIcon = (name: string) => {
    switch (name) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-emerald-600" />
      case 'ClockAlert':
      case 'Clock':
        return <Clock className="w-5 h-5 text-amber-600" />
      case 'Radio':
        return <Radio className="w-5 h-5 text-blue-600" />
      case 'Truck':
        return <Truck className="w-5 h-5 text-orange-600" />
      default:
        return <HelpCircle className="w-5 h-5 text-slate-600" />
    }
  }

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold font-sora text-slate-900">
            Quy Định Vận Hành Hàng Đợi Ảo
          </h3>
          <p className="text-xs text-slate-500">
            Các nguyên tắc cốt lõi đảm bảo phân bổ slot công bằng, chính xác và minh bạch
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
          Phiên bản 2026.2
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {regulations.map((reg) => (
          <div
            key={reg.number}
            className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                  {getIcon(reg.iconName)}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {reg.tag}
                </span>
              </div>

              <div className="text-xs font-mono font-bold text-slate-400 mb-1">
                ĐIỀU KHOẢN #{reg.number}
              </div>

              <h4 className="text-sm font-bold text-slate-900 mb-2">
                {reg.title}
              </h4>

              <p className="text-xs text-slate-600 leading-relaxed">
                {reg.description}
              </p>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Áp dụng toàn mạng lưới</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
