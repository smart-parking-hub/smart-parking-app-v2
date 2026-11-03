import { Link } from 'react-router-dom'
import {
  BadgeCheck,
  Truck,
  CreditCard,
  KeyRound,
  Laptop,
  ShieldCheck,
  ShieldAlert,
  ChevronRight,
  ArrowRight,
  CheckSquare,
  Ban,
  Power,
  Smartphone,
  Tablet,
  Headphones,
} from 'lucide-react'
import type { SecurityAuditStatus } from '../types/changePasswordTypes'

interface SecurityPolicySidebarProps {
  audit: SecurityAuditStatus
  onOpenTwoFactorModal?: () => void
  onOpenDevicesModal?: () => void
}

export function SecurityPolicySidebar({
  audit,
  onOpenTwoFactorModal,
  onOpenDevicesModal,
}: SecurityPolicySidebarProps) {
  return (
    <aside className="flex flex-col gap-5">
      {/* 1. ProfileSidebar Navigation */}
      <nav className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs flex flex-col gap-1">
        <div className="px-3 py-2 mb-1">
          <p className="font-mono text-xs text-slate-500 uppercase tracking-wider font-bold">
            Danh mục hồ sơ tài xế
          </p>
        </div>

        <Link
          to="/profile"
          className="flex items-center justify-between px-3.5 py-3 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <BadgeCheck className="w-5 h-5 text-slate-500" />
            <span className="text-sm font-medium">Thông tin cá nhân &amp; Bằng lái</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </Link>

        <Link
          to="/vehicles"
          className="flex items-center justify-between px-3.5 py-3 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-slate-500" />
            <span className="text-sm font-medium">Đầu kéo &amp; Rơ-moóc gán</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </Link>

        <Link
          to="/payments"
          className="flex items-center justify-between px-3.5 py-3 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-slate-500" />
            <span className="text-sm font-medium">Ví cước PayOS &amp; Ngân hàng</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </Link>

        {/* Active item: Đổi mật khẩu bảo mật */}
        <div className="flex items-center justify-between px-3.5 py-3 rounded-xl bg-slate-900 text-white font-semibold shadow-xs">
          <div className="flex items-center gap-3">
            <KeyRound className="w-5 h-5 text-orange-500" />
            <span className="text-sm text-white">Đổi mật khẩu bảo mật</span>
          </div>
          <ArrowRight className="w-4 h-4 text-orange-500" />
        </div>

        <button
          type="button"
          onClick={onOpenDevicesModal}
          className="flex items-center justify-between px-3.5 py-3 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Laptop className="w-5 h-5 text-slate-500" />
            <span className="text-sm font-medium">Phiên đăng nhập &amp; Thiết bị</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          type="button"
          onClick={onOpenTwoFactorModal}
          className="flex items-center justify-between px-3.5 py-3 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-slate-500" />
            <span className="text-sm font-medium">Xác thực OTP 2 lớp (2FA)</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>
      </nav>

      {/* 2. Hộp Cảnh Báo Quy Chuẩn An Toàn Fretrix */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold font-sora text-slate-900">
            Quy chuẩn Fretrix
          </h2>
        </div>

        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <div className="flex items-start gap-2.5">
            <CheckSquare className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
            <span>Tối thiểu 8 ký tự, có ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <Ban className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
            <span>Không sử dụng lại 3 mật khẩu đã cài đặt gần nhất.</span>
          </div>
          <div className="flex items-start gap-2.5">
            <Power className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
            <span>Tự động đăng xuất trên các thiết bị khác ngay sau khi lưu mật khẩu mới.</span>
          </div>
        </div>

        <div className="h-px w-full bg-slate-100" />

        {/* Trạng thái bảo mật hiện tại */}
        <div>
          <span className="font-mono text-xs uppercase tracking-wider font-bold text-slate-500 block mb-2.5">
            Trạng thái bảo mật hiện tại
          </span>
          <div className="bg-slate-50 rounded-xl p-3.5 space-y-3 border border-slate-200/70">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-slate-500">Lần đổi mật khẩu gần nhất:</span>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-900">
                  {audit.lastChangedDate}
                </span>
                <span className="bg-amber-100 text-amber-900 border border-amber-300 font-mono text-xs font-bold px-2 py-0.5 rounded">
                  {audit.daysAgo} ngày trước
                </span>
              </div>
              {audit.isOverdue && (
                <p className="text-xs text-orange-700 font-medium mt-1">
                  {audit.warningText}
                </p>
              )}
            </div>

            <div className="h-px w-full bg-slate-200/80" />

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500">Thiết bị đang kích hoạt:</span>
                <span className="font-mono text-xs font-bold text-slate-900">
                  0{audit.activeDevicesCount} THIẾT BỊ
                </span>
              </div>

              <div className="space-y-2">
                {audit.activeDevices.map((dev) => (
                  <div
                    key={dev.id}
                    className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-slate-200/80"
                  >
                    {dev.deviceType === 'tablet' ? (
                      <Tablet className="w-4 h-4 text-slate-600 shrink-0" />
                    ) : (
                      <Smartphone className="w-4 h-4 text-slate-600 shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {dev.name}
                      </p>
                      <p className="font-mono text-[11px] text-slate-500">
                        {dev.location} · {dev.lastActive}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Hotline Support Mini Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-4.5 border border-slate-800 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-600/20 text-orange-500 flex items-center justify-center shrink-0">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">An ninh tài khoản 24/7</p>
            <p className="text-[11px] font-mono text-slate-400">Tự động khóa nếu sai 5 lần</p>
          </div>
        </div>
        <span className="font-mono text-sm font-bold text-orange-400">1900 6868</span>
      </div>
    </aside>
  )
}
