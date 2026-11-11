import { Skeleton } from '@/shared/components/Skeleton'

export function NotificationsSkeleton() {
  return (
    <div
      className="space-y-4"
      role="status"
      aria-label="Đang tải danh sách thông báo"
      data-testid="notifications-skeleton"
    >
      <span className="sr-only">Đang tải thông báo...</span>

      {/* Filter toolbar skeleton */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <Skeleton className="h-11 w-28 rounded-xl" />
            <Skeleton className="h-11 w-36 rounded-xl" />
          </div>
          <Skeleton className="h-12 w-full sm:w-[420px] rounded-xl" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-36 rounded-lg" />
          <Skeleton className="h-10 w-40 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>

      {/* Gmail-style compact rows skeleton */}
      <div className="overflow-hidden rounded-2xl border border-brand-border bg-white divide-y divide-slate-100">
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <div key={index} className="flex items-center gap-5 px-4 sm:px-6 py-4">
            <Skeleton className="h-5 w-32 shrink-0" />
            <Skeleton className="h-5 flex-1" />
            <Skeleton className="h-5 w-28 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  )
}
