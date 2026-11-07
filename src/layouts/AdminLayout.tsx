import { clearSession } from '@/features/auth'
import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { ShieldCheck, Menu, X, LogOut } from 'lucide-react'

const items = [
  ['dashboard', 'Tổng quan'],
  ['parking-lots', 'Kiểm duyệt bãi'],
  ['users', 'Người dùng'],
  ['transactions', 'Giao dịch'],
  ['withdrawals', 'Duyệt rút tiền'],
  ['disputes', 'Tranh chấp'],
  ['audit-logs', 'Nhật ký kiểm toán'],
  ['notifications', 'Thông báo'],
  ['profile', 'Hồ sơ quản trị'],
]

export function AdminLayout() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const cache = useQueryClient()

  return (
    <div className="min-h-screen bg-brand-surface font-inter">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-700 bg-brand-navy px-5 text-white lg:pl-72">
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden"
          aria-label="Mở menu quản trị"
        >
          {open ? <X /> : <Menu />}
        </button>
        <p className="font-mono text-xs tracking-widest text-slate-300">
          ADMIN / COMMAND CENTER
        </p>
        <button
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d95f00] px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-[#b84e00] active:bg-[#9e4300] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d95f00] cursor-pointer shadow-xs"
          onClick={() => {
            clearSession()
            localStorage.removeItem('smart-truck-parking.auth')
            cache.clear()
            navigate('/login')
          }}
        >
          <LogOut size={16} />
          <span>Đăng xuất</span>
        </button>
      </header>
      {open && (
        <button
          aria-label="Đóng menu quản trị"
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-700 bg-brand-navy p-5 text-white ${open ? '' : 'hidden lg:flex'}`}
      >
        <NavLink
          to="/admin/dashboard"
          className="mb-8 flex items-center gap-3 py-3 font-sora font-bold text-white hover:text-orange-300 transition-colors"
        >
          <ShieldCheck className="text-[#d95f00]" />
          <span>SMARTTRUCK HUB</span>
        </NavLink>
        <nav aria-label="Quản trị" className="flex-1 space-y-2 overflow-y-auto">
          {items.map(([path, label]) => (
            <NavLink
              onClick={() => setOpen(false)}
              key={path}
              to={`/admin/${path}`}
              className={({ isActive }) =>
                `block rounded-xl px-4 py-3 text-sm transition-colors ${
                  isActive
                    ? 'bg-[#d95f00] font-semibold text-white shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <p className="mt-5 border-t border-slate-700 pt-5 text-xs leading-6 text-slate-300">
          Kết nối bảo mật
          <br />
          Hệ thống ghi nhận Audit Logs
        </p>
      </aside>
      <main className="lg:pl-64">
        <Outlet />
      </main>
    </div>
  )
}
