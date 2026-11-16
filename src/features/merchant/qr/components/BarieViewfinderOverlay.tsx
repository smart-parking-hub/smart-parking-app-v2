import { ScanLine, CheckCircle2 } from 'lucide-react'

export interface BarieViewfinderOverlayProps {
  statusText?: string
  isScanning?: boolean
  isSuccess?: boolean
}

export function BarieViewfinderOverlay({
  statusText = 'Đang căn chỉnh mã QR...',
  isScanning = true,
  isSuccess = false,
}: BarieViewfinderOverlayProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-4 z-10"
    >
      {/* Targeting Box */}
      <div
        className={`relative w-56 h-56 sm:w-64 sm:h-64 rounded-2xl border-2 transition-all duration-300 flex items-center justify-center ${
          isSuccess
            ? 'border-emerald-400 bg-emerald-500/15 shadow-[0_0_35px_rgba(52,211,153,0.85)] scale-[1.03]'
            : 'border-emerald-400/90 shadow-[0_0_25px_rgba(52,211,153,0.35)]'
        }`}
      >
        {/* Four Corner Accents */}
        <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-emerald-300 rounded-tl-lg" />
        <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-emerald-300 rounded-tr-lg" />
        <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-emerald-300 rounded-bl-lg" />
        <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-emerald-300 rounded-br-lg" />

        {/* Animated Laser Scanning Line (Only while actively scanning) */}
        {isScanning && !isSuccess && (
          <div className="absolute inset-x-2 top-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-[bounce_2s_infinite]" />
        )}

        {/* Center Target: Crosshair or Success Checkmark */}
        {isSuccess ? (
          <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center text-slate-950 shadow-[0_0_25px_#10b981] animate-in zoom-in-75 duration-200">
            <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
          </div>
        ) : (
          <div className="w-8 h-8 border border-emerald-400/40 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
          </div>
        )}
      </div>

      {/* Realtime Status Badge */}
      <div
        className={`mt-4 inline-flex items-center gap-2 rounded-full backdrop-blur-md px-4 py-1.5 border text-xs font-semibold shadow-lg transition-all duration-200 ${
          isSuccess
            ? 'bg-emerald-950/90 border-emerald-500/80 text-emerald-300 font-bold'
            : 'bg-slate-900/90 border-slate-700/80 text-emerald-400'
        }`}
      >
        {isSuccess ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-400 animate-pulse" />
        ) : (
          <ScanLine className="h-3.5 w-3.5 animate-pulse" />
        )}
        <span>{isSuccess ? 'Đã nhận diện thành công!' : statusText}</span>
      </div>
    </div>
  )
}
