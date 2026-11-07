import { clearSession } from '@/features/auth'
import { useQuery } from '@tanstack/react-query'
import { getData } from '@/shared/api/resources'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Building2,
  Store,
  Plus,
  Bell,
  User,
  Menu,
  LogOut,
} from 'lucide-react'

interface MerchantHeaderProps {
  onToggleMobileMenu?: () => void
}

export function MerchantHeader({ onToggleMobileMenu }: MerchantHeaderProps) {
  const navigate = useNavigate()
  const { data: profile } = useQuery({
    queryKey: ['merchant-header-profile'],
    queryFn: () => getData<{ merchantId: number; fullName: string | null } | null>('/api/v1/merchant/profile'),
    staleTime: 60000,
  })
  const location = useLocation()
  if (location.pathname === '/merchant/profile') return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-brand-border bg-white px-4 font-inter text-base lg:left-[260px] lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button type="button" onClick={onToggleMobileMenu} aria-label="Mở menu" className="rounded-lg p-2 lg:hidden focus-visible:outline-2 focus-visible:outline-brand-orange"><Menu size={22} /></button>
        <nav aria-label="Đường dẫn" className="flex flex-wrap items-center gap-2 text-brand-muted"><Link to="/merchant/dashboard" className="hover:text-brand-navy">Tổng quan</Link><span aria-hidden="true">/</span><span aria-current="page" className="font-semibold text-brand-navy">Hồ sơ chủ bãi</span></nav>
      </div>
      <button type="button" className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-3.5 py-2 text-sm font-semibold text-red-700 transition-colors hover:border-red-300 hover:bg-red-50 active:bg-red-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500" onClick={() => { clearSession(); navigate('/login', { replace: true }) }}><LogOut size={16} aria-hidden="true" />Đăng xuất</button>
    </header>
  )

  return (
    <header className="fixed top-0 left-0 lg:left-[260px] right-0 h-16 bg-white border-b border-slate-200/90 z-40 px-4 lg:px-6 flex items-center justify-between shadow-2xs">
      {/* Left: Mobile Toggle & Breadcrumb & Yard Filter */}
      <div className="flex items-center gap-3 lg:gap-4 min-w-0">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Mở menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Operational Breadcrumb */}
        <div className="hidden sm:flex items-center gap-1.5 text-slate-500 text-xs font-medium">
          <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-[#0d1c2e] font-semibold">Tổng quan vận hành</span>
          <span className="text-slate-300">/</span>
        </div>

        {/* Owned yards navigation */}
        <div className="w-[190px] sm:w-[230px]">
          <Link to="/merchant/parking-lots" className="inline-flex items-center gap-2 text-xs font-semibold text-brand-navy">
            <Store className="w-4 h-4" />Bãi đỗ của tôi
          </Link>
        </div>
      </div>

      {/* Right Controls: ALPR Indicator + CTA + Notifications + Merchant User Profile */}
      <div className="flex items-center gap-3 lg:gap-4 shrink-0">
        {/* 24/7 ALPR Gate Status Strip */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-50/70 border border-orange-200/60">
          <span className="w-2 h-2 rounded-full bg-[#d95f00] animate-pulse shrink-0" />
          <span className="font-mono text-[11px] font-bold text-[#d95f00] tracking-wider uppercase">
            CỔNG QUẢN LÝ CHỦ BÃI
          </span>
        </div>

        {/* Primary Action Button */}
        <button
          type="button"
          onClick={() => navigate('/merchant/parking-lots/new')}
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#d95f00] hover:bg-[#b84e00] text-white transition-all text-xs font-bold shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Đăng Ký Bãi Mới</span>
        </button>

        {/* Notification center */}
        <div className="relative flex items-center">
          <Link
            to="/merchant/notifications"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 hover:bg-[#eff4ff] hover:text-[#0d1c2e] transition-colors"
            aria-label="Thông báo chủ bãi"
          >
            <Bell className="w-5 h-5" />
          </Link>
        </div>

        <div className="h-6 w-px bg-slate-200 hidden sm:block" />

        <button type="button" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-3.5 py-2 text-sm font-semibold text-red-700 transition-colors hover:border-red-300 hover:bg-red-50 active:bg-red-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500" onClick={() => { clearSession(); navigate('/login', { replace: true }) }}><LogOut size={16} aria-hidden="true" />Đăng xuất</button>
        {/* Merchant Profile */}
        <Link
          to="/merchant/profile"
          className="flex items-center gap-2.5 hover:opacity-90 transition-opacity"
        >
          <div className="w-8 h-8 rounded-full bg-[#131b2e] flex items-center justify-center text-white shrink-0 border border-slate-300">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-bold text-[#0d1c2e] leading-tight max-w-[170px] truncate">
              {profile?.fullName?.trim() || 'Tài khoản chủ bãi'}
            </span>
            <span className="font-mono text-[11px] text-slate-500 font-medium">{profile ? `#MCH-${profile.merchantId}` : 'Merchant'}</span>
          </div>
        </Link>
      </div>
    </header>
  )
}

