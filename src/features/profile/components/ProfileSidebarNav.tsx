import { Link } from 'react-router-dom'
import {
  UserCheck,
  Truck,
  Receipt,
  KeyRound,
  ArrowRight,
  ChevronRight,
  UserRound,
} from 'lucide-react'

export type AccountSidebarTab =
  | 'profile'
  | 'vehicles'
  | 'payments'
  | 'change-password'

export interface ProfileSidebarNavProps {
  compact?: boolean
  activeTab?: AccountSidebarTab
  onOpenChangePassword?: () => void
}

export function ProfileSidebarNav({
  compact = false,
  activeTab = 'profile',
}: ProfileSidebarNavProps) {
  if (compact) {
    const items = [
      { id: 'profile', to: '/profile', label: 'Thông tin cá nhân', icon: UserCheck },
      { id: 'vehicles', to: '/vehicles', label: 'Đội xe của tôi', icon: Truck },
      { id: 'payments', to: '/payments', label: 'Lịch sử thanh toán', icon: Receipt },
      { id: 'change-password', to: '/profile#bao-mat', label: 'Bảo mật tài khoản', icon: KeyRound },
    ]
    return <div className="overflow-hidden rounded-2xl border border-brand-border bg-white font-inter text-sm text-brand-navy">
      <div className="flex items-center gap-3 border-b border-brand-border p-5">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-navy text-white"><UserRound size={21} aria-hidden="true" /></div>
        <div><p className="text-base font-semibold">Tài khoản tài xế</p><p className="mt-1 text-sm text-brand-muted">Hồ sơ và hoạt động</p></div>
      </div>
      <nav aria-label="Liên kết tài khoản" className="space-y-1 p-3">
        {items.map(item => {
          const Icon = item.icon
          const current = item.id === activeTab
          return <Link key={item.id} to={item.to} aria-current={current ? 'page' : undefined}
            className={`flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 font-medium transition-colors focus-visible:outline-2 focus-visible:outline-brand-orange ${current ? 'bg-brand-surface font-semibold text-brand-orange-ink' : 'text-brand-muted hover:bg-brand-surface hover:text-brand-navy'}`}>
            <Icon size={18} aria-hidden="true" /><span className="min-w-0 flex-1">{item.label}</span><ChevronRight size={15} aria-hidden="true" />
          </Link>
        })}
      </nav>
    </div>
  }
  return (
    <nav className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
      {/* Title Header */}
      <div className="px-5 py-3 bg-slate-100 border-b border-slate-200/80">
        <span className="font-mono text-xs text-slate-800 font-bold uppercase tracking-wider">
          CẤU HÌNH TÀI KHOẢN VẬN HÀNH
        </span>
      </div>

      {/* Nav Link 1: Profile */}
      {activeTab === 'profile' ? (
        <div className="flex items-center justify-between px-5 py-4 bg-orange-50/60 text-slate-900 border-l-4 border-orange-600 transition-colors">
          <div className="flex items-center gap-3">
            <UserCheck className="w-5 h-5 text-orange-600" />
            <span className="text-xs md:text-sm font-bold">
              Thông tin cá nhân &amp; Giấy phép
            </span>
          </div>
          <ArrowRight className="w-4 h-4 text-orange-600" />
        </div>
      ) : (
        <Link
          to="/profile"
          className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 text-slate-600 hover:text-slate-900 border-l-4 border-transparent transition-colors"
        >
          <div className="flex items-center gap-3">
            <UserCheck className="w-5 h-5 text-slate-500" />
            <span className="text-xs md:text-sm font-medium">
              Thông tin cá nhân &amp; Giấy phép
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </Link>
      )}

      {/* Nav Link 2: Vehicles */}
      {activeTab === 'vehicles' ? (
        <div className="flex items-center justify-between px-5 py-4 bg-orange-50/60 text-slate-900 border-l-4 border-orange-600 transition-colors">
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-orange-600" />
            <span className="text-xs md:text-sm font-bold">Đội xe của tôi</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-orange-100 text-orange-800 font-mono text-[11px] font-bold px-2 py-0.5 rounded">
              3 XE
            </span>
            <ArrowRight className="w-4 h-4 text-orange-600" />
          </div>
        </div>
      ) : (
        <Link
          to="/vehicles"
          className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 text-slate-600 hover:text-slate-900 border-l-4 border-transparent transition-colors"
        >
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-slate-500" />
            <span className="text-xs md:text-sm font-medium">Đội xe của tôi</span>
          </div>
          <span className="bg-slate-100 text-slate-800 font-mono text-[11px] font-bold px-2 py-0.5 rounded">
            3 XE
          </span>
        </Link>
      )}

      {/* Nav Link 3: Payments */}
      {activeTab === 'payments' ? (
        <div className="flex items-center justify-between px-5 py-4 bg-orange-50/60 text-slate-900 border-l-4 border-orange-600 transition-colors">
          <div className="flex items-center gap-3">
            <Receipt className="w-5 h-5 text-orange-600" />
            <span className="text-xs md:text-sm font-bold">
              Lịch sử cước &amp; Hóa đơn VAT
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-orange-100 text-orange-800 font-mono text-[11px] font-bold px-2 py-0.5 rounded">
              18 HÓA ĐƠN
            </span>
            <ArrowRight className="w-4 h-4 text-orange-600" />
          </div>
        </div>
      ) : (
        <Link
          to="/payments"
          className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 text-slate-600 hover:text-slate-900 border-l-4 border-transparent transition-colors"
        >
          <div className="flex items-center gap-3">
            <Receipt className="w-5 h-5 text-slate-500" />
            <span className="text-xs md:text-sm font-medium">
              Lịch sử cước &amp; Hóa đơn VAT
            </span>
          </div>
          <span className="bg-slate-100 text-slate-800 font-mono text-[11px] font-bold px-2 py-0.5 rounded">
            18 HÓA ĐƠN
          </span>
        </Link>
      )}

      {/* Nav Link 4: Change Password (Active on change-password, direct link on profile) */}
      {activeTab === 'change-password' ? (
        <div className="flex items-center justify-between px-5 py-4 bg-orange-50/60 text-slate-900 border-l-4 border-orange-600 transition-colors">
          <div className="flex items-center gap-3">
            <KeyRound className="w-5 h-5 text-orange-600" />
            <span className="text-xs md:text-sm font-bold">Đổi mật khẩu bảo mật</span>
          </div>
          <ArrowRight className="w-4 h-4 text-orange-600" />
        </div>
      ) : (
        <Link
          to="/profile#bao-mat"
          className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 text-slate-600 hover:text-slate-900 border-l-4 border-transparent transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <KeyRound className="w-5 h-5 text-slate-500" />
            <span className="text-xs md:text-sm font-medium">Đổi mật khẩu bảo mật</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </Link>
      )}
    </nav>
  )
}
