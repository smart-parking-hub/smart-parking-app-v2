interface PayOsTelemetryStripProps {
  latency?: string
  status?: string
}

export function PayOsTelemetryStrip({
  latency = '0.18s',
  status = 'PAID_VERIFIED',
}: PayOsTelemetryStripProps) {
  return (
    <div className="w-full bg-slate-900 py-3 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
      <div className="max-w-[860px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-white">
        <div className="flex items-center gap-2.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse shrink-0" />
          <span className="font-mono text-xs uppercase tracking-wider text-slate-200 font-bold">
            ĐỒNG BỘ CỔNG THANH TOÁN QUỐC GIA PAYOS
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs text-slate-400">
          <span>
            ĐỘ TRỄ ĐỐI SOÁT: <strong className="text-white font-semibold">{latency}</strong>
          </span>
          <span className="text-slate-600">·</span>
          <span>
            TRẠNG THÁI: <strong className="text-orange-500 font-bold">{status}</strong>
          </span>
        </div>
      </div>
    </div>
  )
}
