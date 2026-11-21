import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  FileQuestion,
  Home,
  LayoutDashboard,
  LogIn,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react'
import { useSession } from '@/features/auth/model/useSession'

const ROLE_NAMES: Record<string, string> = {
  DRIVER: 'Tài xế',
  MERCHANT: 'Chủ bãi',
  ADMIN: 'Quản trị viên',
}

export function AccessPage({ notFound = false }: { notFound?: boolean }) {
  const navigate = useNavigate()
  const { role, isAuthenticated, dashboardUrl } = useSession()

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <main
      id="main-content"
      role="main"
      className="relative flex min-h-screen w-full items-center justify-center bg-brand-navy p-4 sm:p-8 text-white selection:bg-[#d95f00]/30 selection:text-white overflow-hidden font-inter"
      style={{
        '--font-inter': "'Inter', 'Source Sans 3', sans-serif",
        '--font-sora': "'Sora', 'Inter', 'Be Vietnam Pro', sans-serif",
      } as React.CSSProperties}
    >
      {/* Background ambient decorative glows */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-40 -left-40 size-96 rounded-full bg-[#d95f00]/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 size-96 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-slate-900/60 blur-2xl" />
      </div>

      <div className="relative z-10 w-full max-w-xl">
        {/* Branding header */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 font-sora text-sm sm:text-base font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] rounded-xl p-1 transition-all hover:scale-105 group"
            aria-label="SmartTruck Hub"
          >
            <img
              src="/image-smart-parking-hub-168.png"
              alt="Smart Parking Hub Logo"
              className="size-8 sm:size-9 rounded-xl object-contain shrink-0 shadow-sm ring-1 ring-white/20 group-hover:shadow-md transition-all"
            />
            <span className="tracking-tight text-white font-bold text-base sm:text-lg group-hover:text-[#d95f00] transition-colors">
              SMARTTRUCK HUB
            </span>
          </Link>

          <button
            type="button"
            onClick={handleGoBack}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors cursor-pointer"
            aria-label="Quay lại trang trước"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            <span className="hidden sm:inline">Trang trước</span>
          </button>
        </div>

        {/* Main Card */}
        <section
          className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl ring-1 ring-white/5"
          aria-labelledby="access-page-title"
        >
          {/* Status Icon */}
          <div className="mb-5 flex items-center justify-between">
            <div
              className={`flex size-14 sm:size-16 items-center justify-center rounded-2xl border ring-8 transition-transform ${
                notFound
                  ? 'border-amber-500/30 bg-amber-500/10 text-amber-400 ring-amber-500/5'
                  : 'border-[#d95f00]/30 bg-[#d95f00]/10 text-[#d95f00] ring-[#d95f00]/5'
              }`}
              aria-hidden="true"
            >
              {notFound ? (
                <FileQuestion className="size-7 sm:size-8" strokeWidth={2} />
              ) : (
                <ShieldAlert className="size-7 sm:size-8" strokeWidth={2} />
              )}
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] font-semibold tracking-wider uppercase text-slate-300">
              <span
                className={`size-2 rounded-full animate-pulse ${
                  notFound ? 'bg-amber-400' : 'bg-[#d95f00]'
                }`}
              />
              {notFound ? 'Trang không tồn tại' : 'Từ chối quyền hạn'}
            </span>
          </div>

          {/* Badge & Title */}
          <p className="font-mono text-brand-orange text-xs tracking-widest uppercase mb-2">
            SMARTTRUCK / {notFound ? '404' : '403'}
          </p>

          <h1
            id="access-page-title"
            className="my-4 font-sora text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight"
          >
            {notFound ? 'Không tìm thấy trang.' : 'Bạn chưa có quyền truy cập.'}
          </h1>

          <p className="mb-6 text-slate-300 leading-relaxed text-sm sm:text-base font-normal">
            {notFound
              ? 'Liên kết có thể đã thay đổi hoặc không tồn tại. Hãy trở về trang chủ để tiếp tục.'
              : 'Đăng nhập bằng tài khoản có vai trò phù hợp hoặc liên hệ quản trị viên.'}
          </p>

          {/* Context Banner when user is already logged in on 403 */}
          {isAuthenticated && role && !notFound && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-slate-700/60 bg-white/[0.03] p-3.5 sm:p-4 text-xs sm:text-sm text-slate-300">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-orange-500/20 text-[#d95f00] font-bold text-xs mt-0.5">
                !
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-white">
                  Vai trò hiện tại: <span className="text-[#d95f00]">{ROLE_NAMES[role] || role}</span>
                </p>
                <p className="text-slate-400 mt-0.5 text-xs leading-relaxed">
                  Trang này yêu cầu quyền hạn cao hơn hoặc thuộc phân hệ khác. Bạn có thể quay về Bảng điều khiển tài khoản của mình.
                </p>
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
            <Link
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#d95f00] px-5 py-3 text-sm font-semibold text-white hover:bg-[#b84e00] active:bg-[#9e4300] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy transition-all shadow-xs cursor-pointer"
              to="/"
            >
              <Home size={16} aria-hidden="true" />
              <span>Về trang chủ</span>
            </Link>

            <Link
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-transparent px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 active:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy transition-all cursor-pointer"
              to="/login"
            >
              <LogIn size={16} aria-hidden="true" />
              <span>Đăng nhập</span>
            </Link>

            {isAuthenticated && (
              <Link
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-orange-500/40 bg-orange-500/10 px-5 py-3 text-sm font-semibold text-orange-300 hover:bg-orange-500/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy transition-all cursor-pointer"
                to={dashboardUrl}
              >
                <LayoutDashboard size={16} aria-hidden="true" />
                <span>Vào Bảng điều khiển</span>
              </Link>
            )}
          </div>
        </section>

        {/* Security watermark footer */}
        <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-slate-500">
          <ShieldCheck size={14} className="text-[#d95f00]/70 shrink-0" aria-hidden="true" />
          <span>Hệ thống Bãi đỗ xe Thông minh SmartTruck Hub · An toàn & Bảo mật RBAC</span>
        </div>
      </div>
    </main>
  )
}
