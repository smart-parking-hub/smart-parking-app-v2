import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Truck,
  LayoutGrid,
  Warehouse,
  Ticket,
  QrCode,
  TrendingUp,
  Wallet,
  Headset,
  Building2,
  Phone,
  ShieldCheck,
  X,
  Bell,
} from 'lucide-react'
import { cn } from '@/shared/utils/cn'

interface MerchantSidebarProps {
  mobileOpen?: boolean
  onCloseMobile?: () => void
}

interface NavItem {
  to: string
  label: string
  icon: typeof LayoutGrid
  exact?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { to: '/merchant/dashboard', label: 'Tổng quan', icon: LayoutGrid, exact: true },
  { to: '/merchant/parking-lots', label: 'Bãi đỗ của tôi', icon: Warehouse },
  { to: '/merchant/bookings', label: 'Quản lý đặt chỗ', icon: Ticket },
  { to: '/merchant/qr-scanner', label: 'Trạm Barie & Quét QR', icon: QrCode },
  { to: '/merchant/revenue', label: 'Báo cáo doanh thu', icon: TrendingUp },
  { to: '/merchant/withdrawals', label: 'Ví & Rút tiền', icon: Wallet },
  { to: '/merchant/disputes', label: 'Xử lý khiếu nại', icon: Headset },
  { to: '/merchant/profile', label: 'Hồ sơ bến bãi', icon: Building2 },
  { to: '/merchant/notifications', label: 'Thông báo', icon: Bell },
]

export function MerchantSidebar({ mobileOpen = false, onCloseMobile }: MerchantSidebarProps) {
  const location = useLocation()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen && onCloseMobile) {
        onCloseMobile()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mobileOpen, onCloseMobile])

  const isCurrentActive = (item: NavItem) => {
    if (item.exact) {
      return (
        location.pathname === item.to ||
        location.pathname === '/merchant' ||
        location.pathname === '/merchant/'
      )
    }
    return location.pathname.startsWith(item.to)
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          role="presentation"
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Shell */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full w-[260px] bg-[#131b2e] z-50 flex flex-col justify-between border-r border-[#233144] shadow-xl transition-transform duration-300 ease-in-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Top Brand Header */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-[#233144]">
            <Link
              to="/merchant/dashboard"
              className="flex items-center gap-2.5 text-white focus:outline-none"
              onClick={onCloseMobile}
            >
              <div className="w-8 h-8 rounded-lg bg-[#341100] border border-[#d95f00]/30 flex items-center justify-center shrink-0">
                <Truck className="w-4 h-4 text-[#d95f00]" />
              </div>
              <div className="flex flex-col">
                <span className="font-sora text-sm font-bold text-white tracking-tight leading-none">
                  SMARTTRUCK <span className="text-[#d95f00]">HUB</span>
                </span>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded font-mono bg-[#341100] text-[#d95f00] font-bold border border-[#d95f00]/20">
                    MERCHANT OPS
                  </span>
                </div>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#233144] transition-colors"
              aria-label="Đóng menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Items List */}
          <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Menu quản lý chủ bãi">
            {NAV_ITEMS.map((item) => {
              const active = isCurrentActive(item)
              const Icon = item.icon
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onCloseMobile}
                  className={cn(
                    'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs lg:text-sm transition-all font-medium',
                    active
                      ? 'bg-[#d5e3fc] text-[#0d1c2e] font-bold shadow-xs'
                      : 'text-[#7c839b] hover:bg-[#233144]/60 hover:text-white',
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon
                    className={cn(
                      'w-4 h-4 shrink-0 transition-colors',
                      active ? 'text-[#0d1c2e]' : 'text-[#7c839b]',
                    )}
                  />
                  <span className="truncate">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Technical Operational Bottom Info */}
        <div className="p-4 border-t border-[#233144] bg-[#0c1220]/90 flex flex-col gap-2">
          <div className="flex items-center justify-between text-[#7c839b] font-mono text-xs">
            <a
              href="tel:19006868"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#d95f00]" />
              <span>1900 6868 (Nhánh 2)</span>
            </a>
          </div>
          {location.pathname !== '/merchant/profile' && (
            <div className="flex items-center justify-between font-mono text-[11px] text-[#7c839b]/80 pt-1 border-t border-[#233144]/60">
              <span>Hệ thống: V2.8.4-OPS</span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#233144] text-white border border-slate-700 text-[10px] font-semibold">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>ISO 27001</span>
              </span>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
