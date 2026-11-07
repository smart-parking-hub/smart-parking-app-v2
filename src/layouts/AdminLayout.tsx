import { clearSession } from '@/features/auth'
import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { ScrollToTop } from '@/shared/components/ScrollToTop'
import {
  ShieldCheck,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Warehouse,
  Users,
  CreditCard,
  ArrowDownToLine,
  Scale,
  ScrollText,
  Bell,
  UserCheck,
} from 'lucide-react'

const navItems = [
  { path: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
  { path: 'parking-lots', label: 'Kiểm duyệt bãi', icon: Warehouse },
  { path: 'users', label: 'Người dùng', icon: Users },
  { path: 'transactions', label: 'Giao dịch', icon: CreditCard },
  { path: 'withdrawals', label: 'Duyệt rút tiền', icon: ArrowDownToLine },
  { path: 'disputes', label: 'Tranh chấp', icon: Scale },
  { path: 'audit-logs', label: 'Nhật ký kiểm toán', icon: ScrollText },
  { path: 'notifications', label: 'Thông báo', icon: Bell },
  { path: 'profile', label: 'Hồ sơ quản trị', icon: UserCheck },
]

export function AdminLayout() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const cache = useQueryClient()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open])

  const currentItem = navItems.find((item) =>
    location.pathname.startsWith(`/admin/${item.path}`)
  )

  return (
    <div className="min-h-screen bg-brand-surface font-inter text-slate-800">
      <ScrollToTop />
      {/* Top Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-700 bg-brand-navy px-5 text-white lg:pl-64">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="lg:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Mở menu quản trị"
            aria-expanded={open}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs tracking-widest text-brand-orange uppercase">
              ADMIN
            </span>
            <span className="text-slate-500 text-xs">/</span>
            <span className="font-sora text-xs font-semibold text-slate-200">
              {currentItem ? currentItem.label : 'Command Center'}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d95f00] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#b84e00] active:bg-[#9e4300] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d95f00] cursor-pointer shadow-xs"
          onClick={() => {
            clearSession()
            localStorage.removeItem('smart-truck-parking.auth')
            cache.clear()
            navigate('/login')
          }}
        >
          <LogOut className="w-4 h-4" aria-hidden="true" />
          <span>Đăng xuất</span>
        </button>
      </header>

      {/* Mobile Backdrop */}
      {open && (
        <div
          role="presentation"
          aria-label="Đóng menu quản trị"
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-700 bg-brand-navy p-5 text-white transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="mb-6 flex items-center justify-between border-b border-slate-700/80 pb-4">
          <NavLink
            to="/admin/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 font-sora font-bold text-white hover:text-orange-300 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-[#341100] border border-[#d95f00]/30 flex items-center justify-center text-[#d95f00]">
              <ShieldCheck className="w-5 h-5 text-[#d95f00]" />
            </div>
            <div>
              <span className="font-sora text-sm font-bold text-white tracking-tight">
                SMARTTRUCK <span className="text-[#d95f00]">HUB</span>
              </span>
              <span className="block font-mono text-[9px] text-slate-400 font-semibold tracking-wider uppercase">
                ADMIN SYSTEM
              </span>
            </div>
          </NavLink>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Đóng menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav aria-label="Quản trị" className="flex-1 space-y-1.5 overflow-y-auto pr-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                onClick={() => setOpen(false)}
                key={item.path}
                to={`/admin/${item.path}`}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#d95f00] font-semibold text-white shadow-xs'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="mt-4 border-t border-slate-700/80 pt-4 text-xs leading-5 text-slate-400 font-mono">
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold">Bảo mật kết nối SSL/TLS</span>
          </div>
          <p className="text-[11px] text-slate-400">Ghi nhận toàn bộ Audit Logs</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="lg:pl-64">
        <Outlet />
      </main>
    </div>
  )
}
