import { Timer } from 'lucide-react'

interface CountdownHoldAlertBoxProps {
  remainingSeconds: number
  totalSeconds?: number
  berthCode?: string
  parkingLotName?: string
}

export function CountdownHoldAlertBox({
  remainingSeconds,
  totalSeconds = 600,
  berthCode = 'Slot Berth C-114',
  parkingLotName = 'Bãi Tân Cảng Gate 2',
}: CountdownHoldAlertBoxProps) {
  const formatTime = (sec: number) => {
    const safeSec = Math.max(0, sec)
    const m = Math.floor(safeSec / 60)
    const s = safeSec % 60
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`
  }

  const percent = Math.min(
    100,
    Math.max(0, (Math.max(0, remainingSeconds) / totalSeconds) * 100)
  )

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden border border-slate-800">
      {/* Decorative background shape */}
      <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-white/5 pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        {/* Left Explanation */}
        <div className="flex flex-col gap-2 max-w-xl">
          <div className="flex items-center gap-2.5">
            <Timer className="w-5 h-5 text-orange-500 shrink-0" />
            <span className="font-mono text-xs uppercase tracking-widest text-orange-400 font-bold">
              CẢNH BÁO THỜI GIAN BẢO LƯU SLOT
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Vị trí container tại{' '}
            <strong className="text-white font-bold">
              {parkingLotName} ({berthCode})
            </strong>{' '}
            của bạn vẫn đang được hệ thống{' '}
            <span className="text-orange-400 font-bold uppercase underline">
              BẢO LƯU TỰ ĐỘNG
            </span>{' '}
            trong thời gian bên dưới trước khi tự động nhường quyền cho xe khác trong hàng đợi ảo.
          </p>
        </div>

        {/* Right Countdown Digital Tile */}
        <div className="shrink-0 flex flex-col items-center justify-center bg-slate-800/90 rounded-2xl px-6 py-4 border border-slate-700/80 shadow-inner text-center min-w-[160px]">
          <span className="font-mono text-[11px] text-slate-400 tracking-widest uppercase">
            THỜI GIAN CÒN LẠI
          </span>
          <div className="flex items-baseline gap-1 my-1">
            <span
              data-testid="countdown-timer"
              className="font-sora text-3xl sm:text-4xl font-bold text-orange-500 tracking-tight"
            >
              {formatTime(remainingSeconds)}
            </span>
            <span className="font-mono text-xs text-slate-400">PHÚT</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden mt-1">
            <div
              data-testid="countdown-progress"
              className="bg-orange-500 h-full transition-all duration-1000"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
