import { Link } from 'react-router-dom'
import {
  UserCheck,
  Truck,
  Receipt,
  KeyRound,
  BellRing,
  ArrowRight,
  ChevronRight,
} from 'lucide-react'

interface ProfileSidebarNavProps {
  onOpenChangePassword: () => void
  onOpenNotificationSettings: () => void
}

export function ProfileSidebarNav({
  onOpenChangePassword,
  onOpenNotificationSettings,
}: ProfileSidebarNavProps) {
  return (
    <nav className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
      {/* Title Header */}
      <div className="px-5 py-3 bg-slate-100 border-b border-slate-200/80">
        <span className="font-mono text-xs text-slate-800 font-bold uppercase tracking-wider">
          CẤU HÌNH TÀI KHOẢN VẬN HÀNH
        </span>
      </div>

      {/* Nav Link 1: Profile (Active) */}
      <div className="flex items-center justify-between px-5 py-4 bg-orange-50/60 text-slate-900 border-l-4 border-orange-600 transition-colors">
        <div className="flex items-center gap-3">
          <UserCheck className="w-5 h-5 text-orange-600" />
          <span className="text-xs md:text-sm font-bold">
            Thông tin cá nhân &amp; Giấy phép
          </span>
        </div>
        <ArrowRight className="w-4 h-4 text-orange-600" />
      </div>

      {/* Nav Link 2: Vehicles */}
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

      {/* Nav Link 3: Payments */}
      <Link
        to="/payments"
        className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 text-slate-600 hover:text-slate-900 border-l-4 border-transparent transition-colors"
      >
        <div className="flex items-center gap-3">
          <Receipt className="w-5 h-5 text-slate-500" />
          <span className="text-xs md:text-sm font-medium">Lịch sử cước &amp; Hóa đơn VAT</span>
        </div>
        <span className="bg-slate-100 text-slate-800 font-mono text-[11px] font-bold px-2 py-0.5 rounded">
          18 HÓA ĐƠN
        </span>
      </Link>

      {/* Nav Link 4: Change Password Modal */}
      <button
        type="button"
        onClick={onOpenChangePassword}
        className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 text-slate-600 hover:text-slate-900 border-l-4 border-transparent transition-colors text-left cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <KeyRound className="w-5 h-5 text-slate-500" />
          <span className="text-xs md:text-sm font-medium">Đổi mật khẩu bảo mật</span>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </button>

      {/* Nav Link 5: Notifications Modal */}
      <button
        type="button"
        onClick={onOpenNotificationSettings}
        className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 text-slate-600 hover:text-slate-900 border-l-4 border-transparent transition-colors text-left cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <BellRing className="w-5 h-5 text-slate-500" />
          <span className="text-xs md:text-sm font-medium">Thiết lập thông báo hệ thống</span>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </button>
    </nav>
  )
}
