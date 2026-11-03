export function NotificationsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" data-testid="notifications-skeleton">
      {/* Hero skeleton */}
      <div className="h-32 bg-white rounded-2xl border border-slate-200 p-6" />

      {/* Filter toolbar skeleton */}
      <div className="h-24 bg-white rounded-2xl border border-slate-200 p-6" />

      {/* 8-4 Grid skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left column 8 cols */}
        <div className="xl:col-span-8 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-36 bg-white rounded-2xl border border-slate-200 p-6" />
          ))}
        </div>

        {/* Right column 4 cols */}
        <div className="xl:col-span-4 space-y-4">
          <div className="h-64 bg-white rounded-2xl border border-slate-200 p-6" />
          <div className="h-48 bg-white rounded-2xl border border-slate-200 p-6" />
          <div className="h-36 bg-[#131b2e] rounded-2xl p-6" />
        </div>
      </div>
    </div>
  )
}
