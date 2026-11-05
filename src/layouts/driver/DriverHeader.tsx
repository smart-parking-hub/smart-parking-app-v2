import { clearSession } from '@/features/auth'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Bell,
  ChevronDown,
  Menu,
  X,
  User,
  LogOut,
  KeyRound,
  Truck,
} from 'lucide-react'

const links = [
  ['/dashboard', 'Tổng quan'],
  ['/parking', 'Bản đồ tìm bãi'],
  ['/bookings', 'Vé & Đặt chỗ'],
  ['/queues', 'Hàng đợi ảo'],
  ['/payments', 'Lịch sử cước'],
  ['/vehicles', 'Đội xe của tôi'],
  ['/disputes', 'Khiếu nại'],
]
export function DriverHeader() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [identity] = useState(() => {
    let phone = ''
    try {
      phone =
        (
          JSON.parse(
            localStorage.getItem('smart-truck-parking.auth') || '{}',
          ) as { phone?: string }
        ).phone || ''
    } catch {
      /* No previous session profile. */
    }
    return {
      name: localStorage.getItem('smart-truck-parking.driver_name') || 'Tài xế',
      phone,
    }
  })
  const initials = identity.name
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
  const active = (path: string) => {
    const current = location.pathname
      .replace(/^\/design-preview/, '')
      .replace(/^\/(driver|dashboard)\//, '/')
    if (current === '/search') return path === '/parking'
    return path === '/dashboard'
      ? ['/dashboard', '/driver', '/driver/dashboard'].includes(
          location.pathname,
        )
      : current.startsWith(path)
  }
  const closeMenus = () => {
    setAccountOpen(false)
    setMobileOpen(false)
  }
  const nav = (mobile = false) =>
    links.map(([to, label]) => (
      <Link
        key={to}
        to={to}
        onClick={closeMenus}
        aria-current={active(to) ? 'page' : undefined}
        className={`${mobile ? 'w-full px-4 py-3' : 'px-3.5 py-3 2xl:px-4'} inline-flex shrink-0 items-center whitespace-nowrap rounded-xl text-[15px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange ${active(to) ? 'bg-white text-brand-navy' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
      >
        {label}
      </Link>
    ))
  return (
    <header
      className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-brand-navy font-inter text-white"
      onKeyDown={(event) => {
        if (event.key === 'Escape') closeMenus()
      }}
    >
      <div className="driver-header-inner">
        <div className="driver-header-top">
          <Link
            to="/dashboard"
            onClick={closeMenus}
            className="driver-header-brand flex shrink-0 items-center gap-3"
          >
            <span className="hidden h-10 w-10 items-center justify-center rounded-xl border border-brand-orange/30 text-brand-orange sm:flex">
              <Truck size={22} />
            </span>
            <span>
              <span className="block font-sora text-[14px] font-bold tracking-tight sm:text-lg">
                SMARTTRUCK<span className="text-brand-orange">HUB</span>
              </span>
              <span className="mt-1 block text-[9px] font-semibold tracking-wider text-slate-400 sm:text-[10px] sm:tracking-[.2em]">
                CỔNG THÔNG TIN TÀI XẾ
              </span>
            </span>
          </Link>
          <div className="driver-header-account flex shrink-0 items-center gap-1.5 sm:gap-5">
            <Link
              to="/notifications"
              aria-label="Thông báo"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 text-slate-300 hover:bg-white/10"
            >
              <Bell size={20} />
            </Link>
            <div className="relative">
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                aria-expanded={accountOpen}
                aria-controls="driver-account-menu"
                aria-label="Menu tài khoản"
                className="flex min-h-12 shrink-0 items-center gap-3 rounded-xl px-1 text-left sm:pr-3"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sm font-bold">
                  {initials}
                </span>
                <span className="hidden w-36 min-w-0 sm:block">
                  <span className="block truncate text-[15px] font-semibold leading-6">
                    {identity.name}
                  </span>
                  <span className="block whitespace-nowrap text-sm leading-5 text-slate-400">
                    {identity.phone || 'Tài khoản tài xế'}
                  </span>
                </span>
                <ChevronDown
                  size={15}
                  className="hidden shrink-0 text-slate-400 sm:block"
                />
              </button>
              {accountOpen && (
                <>
                  <button
                    aria-label="Đóng menu tài khoản"
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setAccountOpen(false)}
                  />
                  <div
                    id="driver-account-menu"
                    className="absolute right-0 z-50 mt-3 w-64 rounded-2xl border border-brand-border bg-white p-2 text-brand-navy shadow-xl"
                  >
                    <p className="truncate border-b border-brand-border px-3 py-4 font-semibold">
                      {identity.name}
                    </p>
                    <Link
                      to="/profile"
                      onClick={closeMenus}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm hover:bg-brand-surface"
                    >
                      <User size={17} />
                      Hồ sơ cá nhân
                    </Link>
                    <Link
                      to="/change-password"
                      onClick={closeMenus}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm hover:bg-brand-surface"
                    >
                      <KeyRound size={17} />
                      Đổi mật khẩu
                    </Link>
                    <button
                      onClick={() => {
                        clearSession()
                        localStorage.removeItem('smart-truck-parking.auth')
                        window.location.href = '/login'
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-red-700 hover:bg-red-50"
                    >
                      <LogOut size={17} />
                      Đăng xuất
                    </button>
                  </div>
                </>
              )}
            </div>
            <button
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-lg p-2 lg:hidden"
            >
              {mobileOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        <nav aria-label="Điều hướng tài xế" className="driver-header-nav">
          {nav()}
        </nav>
      </div>
      {mobileOpen && (
        <nav
          aria-label="Điều hướng di động"
          className="grid gap-1 border-t border-white/10 px-5 pb-5 pt-3 sm:grid-cols-2 lg:hidden"
        >
          {nav(true)}
        </nav>
      )}
    </header>
  )
}
