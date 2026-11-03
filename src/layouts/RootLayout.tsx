import { Outlet, Link } from 'react-router-dom'
import { LayoutDashboard, ShieldCheck, Layers } from 'lucide-react'

export function RootLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 bg-white p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-8 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
              P
            </div>
            <div>
              <h1 className="text-sm font-semibold text-slate-900 leading-tight">Smart Parking</h1>
              <p className="text-xs text-slate-500">CRM Hub v2</p>
            </div>
          </div>

          <nav className="space-y-1">
            <Link
              to="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50"
            >
              <LayoutDashboard className="h-4 w-4" />
              Tổng Quan & Trạng Thái
            </Link>
          </nav>
        </div>

        {/* Footer info */}
        <div className="border-t border-slate-100 pt-4 px-2">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Agent Governance: Active</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <Layers className="h-4 w-4" />
            <span>Architecture: 4 Layers</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
