import { clearSession } from '@/features/auth'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getData } from '@/shared/api/resources'
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
  ['/queues', 'Chờ vào bãi'],
  ['/payments', 'Lịch sử cước'],
  ['/vehicles', 'Đội xe của tôi'],
  ['/disputes', 'Khiếu nại'],
]

export function DriverHeader() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const { data: profile } = useQuery({
    queryKey: ['current-user', 'header'],
    queryFn: () => getData<{ fullName?: string }>('/api/v1/users/me'),
    staleTime: 60_000,
  })
  const identity = { name: profile?.fullName?.trim() || 'Tài khoản của bạn', role: 'Tài xế' }
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
            <img
              src="/image-smart-parking-hub.png"
              alt="Smart Parking Hub Logo"
              className="hidden h-10 w-10 rounded-xl object-contain sm:flex"
            />
            <span>
              <span className="block font-sora text-[14px] font-bold tracking-tight sm:text-lg">
                Smart Parking <span className="text-brand-orange">Hub</span>
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
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 text-slate-300 hover:bg-white/10 transition-colors"
            >
              <Bell size={20} />
            </Link>
            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountOpen(!accountOpen)}
                aria-expanded={accountOpen}
                aria-controls="driver-account-menu"
                aria-label="Menu tài khoản"
                className="group flex min-h-12 shrink-0 items-center gap-3 rounded-xl px-2 py-1.5 text-left transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange sm:pr-3"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-orange/30 bg-brand-orange/10 font-sora text-sm font-semibold text-brand-orange">
                  {profile?.fullName?.trim() ? initials : <User size={20} aria-hidden="true" />}
                </span>
                <span className="hidden w-36 min-w-0 sm:block">
                  <span title={identity.name} className="block truncate font-sora text-[13px] font-semibold leading-6">
                    {identity.name}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs leading-5 text-slate-300">
                    <Truck size={12} className="text-brand-orange" aria-hidden="true" />Tài xế
                  </span>
                </span>
                <ChevronDown
                  size={15}
                  className={`hidden shrink-0 text-slate-400 transition-transform duration-200 group-hover:text-white sm:block ${accountOpen ? 'rotate-180 text-white' : ''
                    }`}
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
                      <span className="mt-1 block text-xs font-normal text-brand-muted">Tài xế · Tài khoản cá nhân</span>
                    </p>
                    <Link
                      to="/profile"
                      onClick={closeMenus}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-brand-surface text-slate-700 hover:text-brand-navy transition-colors"
                    >
                      <User size={17} />
                      Hồ sơ cá nhân
                    </Link>
                    <Link
                      to="/profile#bao-mat"
                      onClick={closeMenus}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-brand-surface text-slate-700 hover:text-brand-navy transition-colors"
                    >
                      <KeyRound size={17} />
                      Đổi mật khẩu
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        clearSession()
                        localStorage.removeItem('smart-truck-parking.auth')
                        window.location.href = '/login'
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
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
              className="rounded-lg p-2 lg:hidden text-slate-200 hover:text-white hover:bg-white/10"
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

