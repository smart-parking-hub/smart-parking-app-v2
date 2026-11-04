import { clearSession } from '@/features/auth'
import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { ShieldCheck, Menu, X, LogOut } from 'lucide-react'
import { button } from '@/shared/components/Workspace'
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
        <p className="font-mono text-xs tracking-widest">
          ADMIN / COMMAND CENTER
        </p>
        <button
          className={button}
          onClick={() => {
            clearSession()
            localStorage.removeItem('smart-truck-parking.auth')
            cache.clear()
            navigate('/login')
          }}
        >
          <LogOut size={16} />
          Đăng xuất
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
          className="mb-8 flex items-center gap-3 py-3 font-sora font-bold"
        >
          <ShieldCheck className="text-brand-orange" />
          SMARTTRUCK HUB
        </NavLink>
        <nav aria-label="Quản trị" className="flex-1 space-y-2 overflow-y-auto">
          {items.map(([path, label]) => (
            <NavLink
              onClick={() => setOpen(false)}
              key={path}
              to={`/admin/${path}`}
              className={({ isActive }) =>
                `block rounded-xl px-4 py-3 text-sm ${isActive ? 'bg-brand-orange font-semibold text-brand-navy' : 'text-slate-300 hover:bg-slate-800'}`
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
