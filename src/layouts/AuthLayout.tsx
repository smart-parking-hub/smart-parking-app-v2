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
    <main className="min-h-screen bg-[#E5EBF2] font-inter flex items-center justify-center p-2 sm:p-4 lg:p-6">
      <ScrollToTop />

      {/* Container tổng thể: Chia thành Khối Mode bên trái và Khung Hình 2 bãi đỗ xe bên phải */}
      <div className="relative w-full max-w-[1440px] h-[95vh] max-h-[920px] min-h-[640px] bg-slate-100/90 rounded-[28px] sm:rounded-[36px] lg:rounded-[44px] overflow-hidden shadow-2xl border border-white/60 flex flex-col lg:flex-row items-center p-3 sm:p-5 lg:p-7">
        
        {/* 1. PHẦN MODE (CARD FORM ĐĂNG NHẬP / ĐĂNG KÝ): NẰM BÊN TRÁI GÓC HÌNH 2, NỀN TRONG SUỐT NHÌN MỜ MỜ ẢNH BÃI ĐỖ XE PHÍA SAU */}
        <section className="relative z-20 w-full lg:w-[44%] xl:w-[40%] flex items-center justify-center lg:justify-start lg:-mr-16 xl:-mr-20 my-auto">
          <div className="w-full max-w-[430px] max-h-[88vh] overflow-y-auto bg-white/70 backdrop-blur-md rounded-[28px] sm:rounded-[32px] p-5 sm:p-7 shadow-2xl shadow-slate-950/25 border border-white/60">
            {children}
          </div>
        </section>

        {/* 2. PHẦN HÌNH 2: BÃI ĐỖ XE THÔNG MINH TĨNH (KHÔNG CO GIÃN KHI HOVER) VỚI TÔNG MÀU CAM, ĐEN, XANH BIỂN VÀ TRẮNG NẰM Ở BÊN PHẢI */}
        <aside className="relative flex-1 w-full h-[320px] lg:h-full rounded-[24px] sm:rounded-[30px] lg:rounded-[36px] overflow-hidden bg-slate-950 shadow-inner">
          {/* Bức ảnh bãi đỗ xe tĩnh 100% */}
          <img
            src="/images/auth-parking-lot-bg.jpg"
            alt="SmartTruck Hub Intelligent Parking Depot"
            className="absolute inset-0 h-full w-full object-cover object-center scale-100"
          />

          {/* Lớp gradient nhẹ tạo chiều sâu cho ảnh */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/50 via-transparent to-slate-950/20 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-slate-950/30 pointer-events-none" />

          {/* Thông điệp thương hiệu góc trên bên phải */}
          <div className="absolute top-6 right-6 sm:top-8 sm:right-10 hidden sm:block max-w-[340px] text-right pointer-events-none">
            <p className="font-sora text-sm sm:text-base font-semibold leading-relaxed text-white drop-shadow-md">
              Một điểm đỗ. <span className="text-brand-orange">Ngàn hành trình.</span>
            </p>
            <p className="mt-1 text-xs text-slate-200/90 leading-relaxed drop-shadow-sm font-normal">
              Bãi đỗ xe thông minh &amp; Điều phối vận tải toàn diện.
            </p>
          </div>

          {/* Badge bảo mật góc dưới bên phải */}
          <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-10 hidden sm:flex items-center gap-2 rounded-full bg-slate-950/65 backdrop-blur-md border border-white/20 px-4 py-2 text-xs font-medium text-white shadow-lg pointer-events-none">
            <ShieldCheck className="w-4 h-4 text-brand-orange shrink-0" />
            <span>An tâm trên từng chặng đường</span>
          </div>
        </aside>
      </div>
    </main>
  )
}
