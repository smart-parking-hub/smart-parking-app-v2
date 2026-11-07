import { Outlet, Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, ShieldCheck, Layers, Truck, ArrowLeft } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { ScrollToTop } from '@/shared/components/ScrollToTop'

export function RootLayout() {
  const location = useLocation()
  const isCrmActive = location.pathname.startsWith('/crm')

  return (
    <div className="flex min-h-screen bg-slate-50 font-inter text-slate-800">
      <ScrollToTop />
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200/90 bg-white p-5 flex flex-col justify-between shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5 mb-8 px-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#341100] border border-[#d95f00]/30 text-[#d95f00] font-bold shrink-0">
              <Truck className="h-5 w-5 text-[#d95f00]" />
            </div>
            <div>
              <h1 className="text-sm font-bold font-sora text-brand-navy leading-tight">
                SMARTTRUCK <span className="text-brand-primary">HUB</span>
              </h1>
              <p className="text-[11px] font-mono text-slate-500 font-medium tracking-wide">CRM Master Hub v2</p>
            </div>
          </div>

          <nav className="space-y-1.5" aria-label="Điều hướng hệ thống">
            <Link
              to="/crm"
              className={cn(
                'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium transition-colors',
                isCrmActive
                  ? 'bg-orange-50 font-semibold text-brand-primary border border-orange-200/70 shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              <LayoutDashboard className="h-4 w-4 shrink-0 text-brand-primary" />
              <span>Tổng Quan & Trạng Thái</span>
            </Link>

            <Link
              to="/"
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 shrink-0 text-slate-400" />
              <span>Về Trang Chủ Khách</span>
            </Link>
          </nav>
        </div>

        {/* Footer info */}
        <div className="border-t border-slate-100 pt-4 px-1 font-mono text-[11px]">
          <div className="flex items-center gap-2 text-slate-600">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Agent Governance: Active</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 mt-1.5">
            <Layers className="h-4 w-4 shrink-0" />
            <span>Architecture: 4 Layers</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
