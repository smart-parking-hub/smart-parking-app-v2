import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Bell,
  Menu,
  X,
  User,
  LogOut,
  KeyRound,
  ShieldCheck,
} from 'lucide-react'

interface NavLinkItem {
  to: string
  label: string
  hasBadge?: boolean
}

const navLinks: NavLinkItem[] = [
  { to: '/dashboard', label: 'Tổng quan' },
  { to: '/parking', label: 'Bản đồ tìm bãi' },
  { to: '/bookings', label: 'Vé & Đặt chỗ', hasBadge: true },
  { to: '/queues', label: 'Hàng đợi ảo' },
  { to: '/payments', label: 'Lịch sử cước' },
  { to: '/vehicles', label: 'Đội xe của tôi' },
]

export function DriverHeader() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)

  // Driver session info with fallback
  const [driverName, setDriverName] = useState<string>(() => {
    return localStorage.getItem('smart-truck-parking.driver_name') || 'Văn Tuấn'
  })
  const [driverPhone] = useState<string>(() => {
    const raw = localStorage.getItem('smart-truck-parking.auth')
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { phone?: string }
        if (parsed.phone) return parsed.phone
      } catch {
        // ignore
      }
    }
    return '0909 128 374'
  })

  useEffect(() => {
    const storedName = localStorage.getItem('smart-truck-parking.driver_name')
    if (storedName) {
      setDriverName(storedName)
    }
  }, [])

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/driver/dashboard'
    }
    return location.pathname.startsWith(path)
  }

  // Get initials for avatar
  const getInitials = (name: string) => {
    if (!name) return 'VT'
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  const handleLogout = () => {
    localStorage.removeItem('smart-truck-parking.auth')
    window.location.href = '/'
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#131b2e] shadow-[0_1px_8px_rgba(0,0,0,0.12)] border-b border-[#233144]">
      <div className="h-[68px] max-w-[1280px] mx-auto px-4 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand & Main Navigation */}
        <div className="flex items-center gap-6">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 shrink-0 group focus:outline-none"
          >
            <span className="font-sora text-xl text-white tracking-tight font-bold">
              SMARTTRUCK<span className="text-[#d95f00]">HUB</span>
            </span>
            <span className="bg-[#341100] text-[#d95f00] px-1.5 py-0.5 rounded text-[11px] uppercase tracking-wider font-semibold border border-[#d95f00]/30">
              DRIVER OPS
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map(({ to, label, hasBadge }) => {
              const active = isActive(to)
              return (
                <Link
                  key={to}
                  to={to}
                  className={`relative px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    active
                      ? 'bg-[#dae2fd] text-[#131b2e] font-semibold'
                      : 'text-[#7c839b] hover:text-white hover:bg-[#233144]/60 font-medium'
                  }`}
                >
                  <span>{label}</span>
                  {hasBadge && (
                    <span className="w-2 h-2 rounded-full bg-[#d95f00] inline-block shrink-0" />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Right Section: Notifications, User Profile & Mobile Toggle */}
        <div className="flex items-center gap-3">
          {/* Notifications Link */}
          <Link
            to="/notifications"
            className="relative p-2 rounded text-[#7c839b] hover:text-white hover:bg-[#233144] transition-colors"
            aria-label="Thông báo"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#d95f00] text-white text-[10px] font-bold flex items-center justify-center font-mono">
              3
            </span>
          </Link>

          {/* User Profile Pill & Dropdown (Bỏ chữ TRỰC TUYẾN) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2.5 p-1.5 pr-3.5 rounded-lg bg-[#233144] hover:bg-[#2d3e56] transition-colors border border-white/5 cursor-pointer text-left focus:outline-none"
            >
              <div className="w-8 h-8 rounded bg-black text-white flex items-center justify-center font-bold text-xs uppercase shadow-inner shrink-0">
                {getInitials(driverName)}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs text-white font-medium leading-none">
                  {driverName}
                </span>
                <span className="font-mono text-[#7c839b] text-[11px] leading-tight mt-1">
                  {driverPhone}
                </span>
              </div>
            </button>

            {/* User Dropdown Menu */}
            {userDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setUserDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-[#131b2e] border border-[#233144] rounded-xl shadow-2xl py-2 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-[#233144] text-[#bec6e0]">
                    <p className="font-semibold text-white">{driverName}</p>
                    <p className="font-mono text-[11px] text-[#7c839b]">{driverPhone}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-[#bec6e0] hover:text-white hover:bg-[#233144] transition-colors"
                  >
                    <User className="w-4 h-4 text-[#7c839b]" />
                    <span>Hồ sơ cá nhân</span>
                  </Link>
                  <Link
                    to="/change-password"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-[#bec6e0] hover:text-white hover:bg-[#233144] transition-colors"
                  >
                    <KeyRound className="w-4 h-4 text-[#7c839b]" />
                    <span>Đổi mật khẩu</span>
                  </Link>
                  <div className="border-t border-[#233144] my-1" />
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-400 hover:text-rose-300 hover:bg-[#233144] transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu toggle button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded text-[#7c839b] hover:text-white hover:bg-[#233144] transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#131b2e] border-t border-[#233144] px-4 py-3 space-y-1">
          {navLinks.map(({ to, label, hasBadge }) => {
            const active = isActive(to)
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                  active
                    ? 'bg-[#dae2fd] text-[#131b2e] font-semibold'
                    : 'text-[#bec6e0] hover:bg-[#233144] hover:text-white'
                }`}
              >
                <span>{label}</span>
                {hasBadge && (
                  <span className="w-2 h-2 rounded-full bg-[#d95f00]" />
                )}
              </Link>
            )
          })}
          <div className="pt-2 border-t border-[#233144] mt-2 flex items-center gap-1.5 text-xs text-[#7c839b]">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Tài khoản lái xe đã xác thực an toàn</span>
          </div>
        </div>
      )}
    </header>
  )
}
