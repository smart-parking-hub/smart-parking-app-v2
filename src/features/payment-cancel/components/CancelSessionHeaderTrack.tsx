interface CancelSessionHeaderTrackProps {
  sessionCode?: string
}

export function CancelSessionHeaderTrack({
  sessionCode = 'PAYOS-CAN-99124',
}: CancelSessionHeaderTrackProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-slate-600 bg-slate-100 px-4 py-2.5 rounded-xl border border-slate-200/80 shadow-xs">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse shrink-0" />
        <span className="uppercase tracking-wider">
          PHIÊN GIAO DỊCH: <strong className="text-slate-900 font-bold">{sessionCode}</strong>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-slate-500 uppercase">Hệ Thống Giữ Chỗ:</span>
        <span className="px-2.5 py-0.5 rounded-lg bg-orange-100 text-orange-800 border border-orange-200 font-semibold uppercase text-[11px]">
          Bảo lưu tạm thời (TTL)
        </span>
      </div>
    </div>
  )
}
