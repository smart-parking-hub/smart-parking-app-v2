export function MerchantParkingLotsMetrics({ counts }: { counts?: { total: number; approved: number; pending: number } }) {
  const metrics = [
    ['Tổng Cơ Sở', counts?.total], ['Đã Phê Duyệt', counts?.approved], ['Đang Chờ Duyệt', counts?.pending],
  ] as const
  return <section className="w-full bg-[#eff4ff] px-4 sm:px-6 lg:px-8 py-5 border-b border-slate-200/80">
    <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
      {metrics.map(([label, value]) => <div key={label} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <p className="font-mono text-xs text-slate-500 uppercase tracking-wider font-semibold">{label}</p>
        <p className="mt-3 font-sora text-3xl font-bold text-[#0d1c2e]">{value ?? '—'}</p>
      </div>)}
    </div>
  </section>
}
