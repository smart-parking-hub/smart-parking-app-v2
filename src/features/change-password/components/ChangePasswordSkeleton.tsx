export function ChangePasswordSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      {/* Top strip */}
      <div className="h-6 w-72 bg-slate-200 rounded-md" />

      {/* Header card shimmer */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-3 w-full max-w-xl">
          <div className="h-8 w-64 bg-slate-200 rounded-lg" />
          <div className="h-4 w-full bg-slate-100 rounded-md" />
        </div>
        <div className="h-16 w-52 bg-slate-200 rounded-xl shrink-0" />
      </div>

      {/* 2-col Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left col */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 h-64" />
          <div className="bg-white p-5 rounded-2xl border border-slate-200 h-56" />
          <div className="bg-slate-900 rounded-2xl h-16" />
        </div>

        {/* Right col */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 h-96" />
          <div className="bg-slate-100 rounded-2xl border border-slate-200 h-20" />
        </div>
      </div>
    </div>
  )
}
