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
    <main className="min-h-screen bg-[#EAEFF5] font-inter flex items-center justify-center p-2 sm:p-5 lg:p-7">
      <ScrollToTop />

      {/* Container toàn cảnh: Nền ảnh xe bus trải rộng bao phủ (như Ảnh 1) */}
      <div className="relative w-full max-w-[1440px] h-[95vh] max-h-[920px] min-h-[640px] rounded-[28px] sm:rounded-[36px] lg:rounded-[44px] overflow-hidden shadow-2xl border border-white/40 flex items-center p-4 sm:p-8 lg:p-14">
        {/* 1. Ảnh chiếc xe bus hiện đại sắc nét trải rộng toàn bộ khung */}
        <img
          src="/images/auth-bus-bg.jpg"
          alt="SmartTruck Hub Bus Transit Fleet"
          className="absolute inset-0 h-full w-full object-cover object-[center_right] sm:object-center scale-100 hover:scale-102 transition-transform duration-700 ease-out"
        />

        {/* Lớp phủ gradient mờ nhẹ để card modal login và các thông tin nổi bật sắc nét */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/45 via-slate-950/20 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-slate-950/25 pointer-events-none" />

        {/* Thông điệp slogan thương hiệu ở góc trên bên phải trên nền ảnh */}
        <div className="absolute top-6 right-6 sm:top-10 sm:right-12 hidden md:block max-w-[340px] text-right pointer-events-none">
          <p className="font-sora text-sm sm:text-base font-semibold leading-relaxed text-white drop-shadow-md">
            Một điểm đỗ. <span className="text-brand-orange">Ngàn hành trình.</span>
          </p>
          <p className="mt-1 text-xs text-slate-100/90 leading-relaxed drop-shadow-sm font-normal">
            Quản lý bãi đỗ xe tải và xe bus thông minh trên toàn quốc.
          </p>
        </div>

        {/* Badge bảo mật góc dưới bên phải */}
        <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-12 hidden md:flex items-center gap-2 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/20 px-4 py-2 text-xs font-medium text-white shadow-lg pointer-events-none">
          <ShieldCheck className="w-4 h-4 text-brand-orange shrink-0" />
          <span>An tâm trên từng chặng đường</span>
        </div>

        {/* 2. CARD MODAL FORM ĐĂNG NHẬP / ĐĂNG KÝ (NẰM BÊN TRÁI, TRONG SUỐT VÀ BO TRÒN GÓC NHƯ YÊU CẦU) */}
        <section className="relative z-10 w-full max-w-[430px] my-auto">
          <div className="w-full bg-white/92 backdrop-blur-xl rounded-[28px] sm:rounded-[32px] p-6 sm:p-7 shadow-2xl shadow-slate-950/25 border border-white/80">
            {children}
          </div>
        </section>
      </div>
    </main>
  )
}
