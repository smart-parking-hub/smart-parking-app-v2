import { AlertTriangle, KeyRound } from 'lucide-react'
import type { SecurityAuditStatus } from '../types/changePasswordTypes'

interface ChangePasswordCommandHeaderProps {
  audit: SecurityAuditStatus
}

export function ChangePasswordCommandHeader({ audit }: ChangePasswordCommandHeaderProps) {
  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Top Breadcrumb & Metadata Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-orange-600 uppercase tracking-wider font-bold">
            BẢO MẬT TÀI KHOẢN VẬN HÀNH
          </span>
          <span className="text-slate-400">/</span>
          <span className="text-slate-500 uppercase tracking-wider">
            XÁC THỰC HAI LỚP 2FA
          </span>
          <span className="text-slate-400">/</span>
          <span className="text-slate-900 font-bold uppercase tracking-wider">
            MÃ BẢO VỆ {audit.driverId}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-slate-100 text-slate-800 font-mono text-xs font-bold rounded-lg border border-slate-200">
            {audit.protocolVersion}
          </span>
          {audit.isOverdue && (
            <span className="px-2.5 py-1 bg-amber-100 text-amber-900 font-mono text-xs font-bold rounded-lg border border-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>YÊU CẦU ĐỔI ĐỊNH KỲ ({audit.daysAgo} NGÀY)</span>
            </span>
          )}
        </div>
      </div>

      {/* Page Header Block */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-[760px]">
            <h1 className="text-2xl md:text-3xl font-bold font-sora text-slate-900 tracking-tight">
              Đổi Mật Khẩu Đăng Nhập
            </h1>
            <p className="text-sm md:text-base text-slate-600 mt-2 leading-relaxed">
              Định kỳ thay đổi mật khẩu sau 90 ngày để bảo vệ tài khoản tài xế, tài khoản ngân hàng liên kết PayOS và tránh rủi ro kẻ xấu thao túng vé QR check-in barie tại các cụm bãi.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                <KeyRound className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Cấp quyền vận hành</p>
                <p className="text-xs font-mono font-bold text-slate-900 mt-0.5">
                  TIÊU CHUẨN LOẠI 1 (COMMERCIAL TRUCK)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
