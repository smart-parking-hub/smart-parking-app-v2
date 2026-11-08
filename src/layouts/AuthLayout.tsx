import type { CSSProperties, ReactNode } from 'react'
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
  const isRecovery = variant === 'recovery'

  return (
    <div
      style={RECOVERY_TYPOGRAPHY_SCOPE}
      className="relative min-h-screen w-full bg-[#060D1A] font-inter flex flex-col justify-between selection:bg-[#d95f00]/30 selection:text-white overflow-x-hidden"
    >
      <ScrollToTop />

      {/* 1. Ảnh bãi đỗ xe chụp thực tế trải rộng toàn màn hình (full-bleed), tĩnh 100% */}
      <img
        src="/images/auth-parking-lot-bg.jpg"
        alt="SmartTruck Hub Commercial Logistics Parking Depot"
        className="fixed inset-0 h-full w-full object-cover object-[30%_center] sm:object-center scale-100"
      />

      {/* Lớp phủ gradient mờ điện ảnh để card modal và thông điệp nổi bật rõ nét */}
      <div className="fixed inset-0 bg-gradient-to-l from-slate-950/45 via-slate-950/20 to-transparent pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-slate-950/20 pointer-events-none" />

      {/* Thông điệp slogan thương hiệu ở góc trên bên TRÁI trên nền ảnh */}
      <div className="fixed top-6 left-6 sm:top-10 sm:left-12 hidden md:block max-w-[380px] text-left pointer-events-none z-10">
        <p className="font-sora text-base sm:text-lg font-bold leading-relaxed text-white drop-shadow-md">
          Một điểm đỗ. <span className="text-[#d95f00]">Ngàn hành trình.</span>
        </p>
        <p className="mt-1 text-xs sm:text-sm text-white/90 leading-relaxed drop-shadow-sm font-normal">
          Bãi đỗ xe thông minh &amp; Điều phối vận tải toàn diện.
        </p>
      </div>

      {/* Badge bảo mật góc dưới bên TRÁI */}
      <div className="fixed bottom-6 left-6 sm:bottom-10 sm:left-12 hidden md:flex items-center gap-2 rounded-full bg-slate-950/65 backdrop-blur-md border border-white/20 px-4 py-2 text-xs font-normal text-white shadow-lg pointer-events-none z-10">
        <ShieldCheck className="w-4 h-4 text-[#d95f00] shrink-0" />
        <span>An tâm trên từng chặng đường</span>
      </div>

      {/* 2. PHẦN MODE (MODAL FORM): NẰM LỆCH PHẢI XÍCH VÀO GIỮA, RỘNG RÃI, NỀN KÍNH TRONG SUỐT TĨNH KHÔNG ĐỔI MÀU KHI HOVER */}
      <main className="relative z-20 w-full flex-1 flex items-center justify-end overflow-hidden py-4 sm:py-6">
        <section className="relative z-20 w-full max-w-[540px] sm:max-w-[560px] lg:max-w-[580px] my-auto mx-auto sm:mx-0 sm:mr-10 md:mr-14 lg:mr-20 xl:mr-28 2xl:mr-36 p-3 sm:p-0">
          <div className="w-full max-h-[94vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden bg-white/60 backdrop-blur-2xl rounded-[32px] sm:rounded-[36px] p-6 sm:p-8 lg:p-9 shadow-[0_25px_60px_rgba(0,0,0,0.4)] border border-white/70 ring-1 ring-white/40 text-black">
            {children}
          </div>
        </section>
      </main>

      {/* Footer bar for recovery */}
      {isRecovery && (
        <footer className="relative z-20 w-full py-3 border-t border-white/10 bg-slate-950/80 backdrop-blur-md text-white">
          <div className="max-w-7xl mx-auto px-4 md:px-9 flex flex-col sm:flex-row items-center justify-between gap-2 font-inter text-xs leading-4 font-normal tracking-[0.06em] text-white">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#d95f00] shrink-0" aria-hidden="true" />
              <span>SMARTTRUCK HUB — BẢO MẬT TÀI KHOẢN &amp; ĐIỀU PHỐI BẾN BÃI</span>
            </div>
            <div className="flex items-center gap-4">
              <span>XÁC THỰC EMAIL OTP</span>
              <span className="text-white/30" aria-hidden="true">
                |
              </span>
              <span>MÃ MÀN HÌNH: SCR-012</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}
