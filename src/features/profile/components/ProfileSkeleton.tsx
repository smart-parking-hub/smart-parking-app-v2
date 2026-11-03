export function ProfileSkeleton() {
  return (
    <div className="w-full flex flex-col gap-6 animate-pulse" data-testid="profile-skeleton">
      {/* Top Header Skeleton */}
      <div className="flex flex-col gap-2">
        <div className="h-4 w-64 bg-slate-200 rounded" />
        <div className="flex flex-col lg:flex-row justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-96 bg-slate-200 rounded" />
            <div className="h-4 w-full max-w-xl bg-slate-200 rounded" />
          </div>
          <div className="h-10 w-72 bg-slate-200 rounded-lg" />
        </div>
      </div>

      {/* Grid: 4 cols Left + 8 cols Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column Skeleton */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 h-80" />
          <div className="bg-white p-6 rounded-2xl border border-slate-200 h-64" />
          <div className="bg-slate-900 rounded-2xl h-28" />
        </div>

        {/* Right Column Skeleton */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 h-64" />
          <div className="bg-white p-6 rounded-2xl border border-slate-200 h-64" />
          <div className="bg-white p-6 rounded-2xl border border-slate-200 h-64" />
          <div className="bg-white p-4 rounded-2xl border border-slate-200 h-20" />
        </div>
      </div>
    </div>
  )
}
