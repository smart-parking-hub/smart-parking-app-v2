import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Building2,
  Store,
  Plus,
  Bell,
  User,
  Menu,
} from 'lucide-react'
import { Select, type SelectOption } from '@/shared/components/Select'

interface MerchantHeaderProps {
  onToggleMobileMenu?: () => void
}

const YARD_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'Tất cả 03 bãi đỗ' },
  { value: 'cat-lai', label: 'Bãi Cát Lái Gate 2' },
  { value: 'dinh-vu', label: 'Bãi Depot Đình Vũ Hải Phòng' },
  { value: 'song-than', label: 'Bãi ICD Sóng Thần Bình Dương' },
]

export function MerchantHeader({ onToggleMobileMenu }: MerchantHeaderProps) {
  const navigate = useNavigate()
  const [selectedYard, setSelectedYard] = useState('all')

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

        {/* Quick Yard Selector */}
        <div className="w-[190px] sm:w-[230px]">
          <Select
            value={selectedYard}
            onChange={setSelectedYard}
            options={YARD_OPTIONS}
            prefixIcon={<Store className="w-4 h-4 text-[#455f87] shrink-0" />}
            size="sm"
            variant="subtle"
            ariaLabel="Lọc theo bãi đỗ"
          />
        </div>
      </div>

      {/* Right Controls: ALPR Indicator + CTA + Notifications + Merchant User Profile */}
      <div className="flex items-center gap-3 lg:gap-4 shrink-0">
        {/* 24/7 ALPR Gate Status Strip */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-50/70 border border-orange-200/60">
          <span className="w-2 h-2 rounded-full bg-[#d95f00] animate-pulse shrink-0" />
          <span className="font-mono text-[11px] font-bold text-[#d95f00] tracking-wider uppercase">
            ALPR GATE 24/7 TRỰC TUYẾN
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

        {/* Notification Bell with Badge */}
        <div className="relative flex items-center">
          <Link
            to="/merchant/notifications"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 hover:bg-[#eff4ff] hover:text-[#0d1c2e] transition-colors"
            aria-label="Thông báo chủ bãi"
          >
            <Bell className="w-5 h-5" />
          </Link>
          <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-[#d95f00] text-white font-mono text-[10px] font-bold flex items-center justify-center shadow-xs">
            05
          </span>
        </div>

        <div className="h-6 w-px bg-slate-200 hidden sm:block" />

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
              Lê Văn Thành (Tổng Kho Tân Cảng)
            </span>
            <span className="font-mono text-[11px] text-slate-500 font-medium">#MCH-88219</span>
          </div>
        </Link>
      </div>
    </header>
  )
}

