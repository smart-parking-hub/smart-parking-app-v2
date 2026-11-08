import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { ScrollToTop } from '@/shared/components/ScrollToTop'

export interface AuthLayoutProps {
  children: ReactNode
  variant?: 'default' | 'recovery'
}

const RECOVERY_TYPOGRAPHY_SCOPE: CSSProperties = {
  '--font-inter': "'Inter', 'Source Sans 3', sans-serif",
  '--font-sora': "'Sora', 'Inter', 'Be Vietnam Pro', sans-serif",
} as CSSProperties

export function AuthLayout({ children, variant = 'default' }: AuthLayoutProps) {
  if (variant === 'recovery') {
    return (
      <div
        style={RECOVERY_TYPOGRAPHY_SCOPE}
        className="bg-[#f8f9ff] font-inter text-[#0d1c2e] antialiased min-h-screen flex flex-col justify-between selection:bg-[#b5d0fd] selection:text-[#3e5980]"
      >
        <ScrollToTop />
        <main className="w-full flex-1 flex flex-col items-center justify-center p-4 md:p-9">
          <div className="flex flex-col w-full">
            <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center py-2 md:py-4">
              {children}
            </div>
          </div>
        </main>
        <footer className="w-full py-4 border-t border-[#c6c6cd]/30 bg-white/60 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 md:px-9 flex flex-col sm:flex-row items-center justify-between gap-2 font-inter text-xs leading-4 font-medium tracking-[0.06em] text-[#45464d]">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#455f87] shrink-0" aria-hidden="true" />
              <span>SMARTTRUCK HUB — BẢO MẬT TÀI KHOẢN &amp; ĐIỀU PHỐI BẾN BÃI</span>
            </div>
            <div className="flex items-center gap-4">
              <span>XÁC THỰC EMAIL OTP</span>
              <span className="text-[#c6c6cd]" aria-hidden="true">
                |
              </span>
              <span>MÃ MÀN HÌNH: SCR-012</span>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  return (
    <main className="relative min-h-screen w-full bg-[#060D1A] font-inter flex items-center justify-start overflow-hidden">
      <ScrollToTop />

      {/* 1. Ảnh bãi đỗ xe chụp thực tế trải rộng toàn màn hình (full-bleed), tĩnh 100%, chủ thể bãi đỗ tập trung bên phải */}
      <img
        src="/images/auth-parking-lot-bg.jpg"
        alt="SmartTruck Hub Commercial Logistics Parking Depot"
        className="absolute inset-0 h-full w-full object-cover object-[70%_center] sm:object-center scale-100"
      />

      {/* Lớp phủ gradient mờ điện ảnh để card modal trắng mờ và thông điệp nổi bật rõ nét */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-950/30 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/30 pointer-events-none" />

      {/* Thông điệp slogan thương hiệu ở góc trên bên phải trên nền ảnh */}
      <div className="absolute top-6 right-6 sm:top-10 sm:right-12 hidden md:block max-w-[360px] text-right pointer-events-none z-10">
        <p className="font-sora text-base sm:text-lg font-bold leading-relaxed text-white drop-shadow-md">
          Một điểm đỗ. <span className="text-brand-orange">Ngàn hành trình.</span>
        </p>
        <p className="mt-1 text-xs sm:text-sm text-slate-200/90 leading-relaxed drop-shadow-sm font-normal">
          Bãi đỗ xe thông minh &amp; Điều phối vận tải toàn diện.
        </p>
      </div>

      {/* Badge bảo mật góc dưới bên phải */}
      <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-12 hidden md:flex items-center gap-2 rounded-full bg-slate-950/65 backdrop-blur-md border border-white/20 px-4 py-2 text-xs font-medium text-white shadow-lg pointer-events-none z-10">
        <ShieldCheck className="w-4 h-4 text-brand-orange shrink-0" />
        <span>An tâm trên từng chặng đường</span>
      </div>

      {/* 2. PHẦN MODE (MODAL FORM): NẰM BÊN TRÁI, NỀN TRẮNG TRONG SUỐT NHÌN MỜ MỜ ẢNH BÃI ĐỖ XE PHÍA SAU */}
      <section className="relative z-20 w-full max-w-[440px] my-auto mx-auto sm:mx-0 sm:ml-8 md:ml-14 lg:ml-20 xl:ml-28 p-4 sm:p-0">
        <div className="w-full max-h-[90vh] overflow-y-auto bg-white/75 backdrop-blur-xl rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 shadow-2xl shadow-slate-950/40 border border-white/80 text-brand-navy">
          {children}
        </div>
      </section>
    </main>
  )
}
