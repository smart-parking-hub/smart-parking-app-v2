export function BookingsSkeleton() {
  return (
    <div className="w-full bg-[#f8f9ff] min-h-[calc(100vh-140px)] animate-pulse">
      {/* Toolbar placeholder */}
      <div className="w-full bg-white border-b border-slate-200 py-6">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-6 space-y-4">
          <div className="h-4 w-48 bg-slate-200 rounded" />
          <div className="h-8 w-64 bg-slate-200 rounded" />
          <div className="h-10 w-full bg-slate-100 rounded-lg" />
        </div>
      </div>

      {/* 2-column placeholder */}
      <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-3">
            <div className="h-6 w-40 bg-slate-200 rounded" />
            <div className="h-36 bg-white rounded-xl border border-slate-200" />
            <div className="h-36 bg-white rounded-xl border border-slate-200" />
            <div className="h-36 bg-white rounded-xl border border-slate-200" />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="h-48 bg-white rounded-xl border border-slate-200" />
            <div className="h-56 bg-white rounded-xl border border-slate-200" />
            <div className="h-64 bg-white rounded-xl border border-slate-200" />
          </div>
        </div>
      </div>
    </div>
  )
}
