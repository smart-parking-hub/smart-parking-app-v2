export function QueueSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" data-testid="queue-skeleton">
      {/* Header Skeleton */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <div className="h-4 w-48 bg-slate-200 rounded mb-3" />
        <div className="h-8 w-72 bg-slate-200 rounded mb-2" />
        <div className="h-4 w-96 bg-slate-200 rounded" />
      </div>

      {/* Card Skeleton */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="h-6 w-56 bg-slate-200 rounded mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="h-24 bg-slate-100 rounded-xl" />
          <div className="h-24 bg-slate-100 rounded-xl" />
          <div className="h-24 bg-slate-100 rounded-xl" />
        </div>
        <div className="h-40 bg-slate-100 rounded-xl mb-6" />
        <div className="h-12 w-48 bg-slate-200 rounded-lg" />
      </div>

      {/* Regulations Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-36 bg-white rounded-xl border border-slate-200 p-4" />
        ))}
      </div>
    </div>
  )
}
