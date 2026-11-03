import { Headset } from 'lucide-react'

export function DispatchHotlineSupportCard() {
  return (
    <div className="bg-[#131b2e] text-white p-5 md:p-6 rounded-2xl shadow-xs flex items-start gap-3.5 border border-slate-800">
      <div className="w-10 h-10 rounded-xl bg-[#233144] flex items-center justify-center shrink-0">
        <Headset className="w-5 h-5 text-[#d95f00]" />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="font-sora font-bold text-sm text-white">
          Gặp Trục Trặc Nhận Slot?
        </span>
        <p className="text-xs text-slate-300 leading-relaxed">
          Liên hệ điều phối viên trực ban tại Cát Lái và Sóng Thần qua tổng đài nội bộ hoặc kênh radio UHF Kênh 4.
        </p>

        <div className="flex items-center gap-2 pt-1">
          <span className="font-mono text-xs bg-[#233144] text-white px-2.5 py-1 rounded font-bold border border-white/10">
            HOTLINE: 1900 6868
          </span>
        </div>
      </div>
    </div>
  )
}
