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
    <main className="min-h-screen bg-[#F0F4F9] font-inter flex items-center justify-center p-3 sm:p-5 lg:p-7">
      <ScrollToTop />
      {/* SVG ClipPath Definition cho viền cắt nghệ thuật lồi/lõm uốn lượn đặc trưng giống ảnh mẫu */}
      <svg width="0" height="0" className="absolute pointer-events-none" aria-hidden="true">
        <defs>
          <clipPath id="bus-hero-clip" clipPathUnits="objectBoundingBox">
            <path d="M 0.16,0 
                     L 0.86,0 
                     C 0.94,0 1,0.06 1,0.14 
                     L 1,0.84 
                     C 0.93,0.84 0.84,0.93 0.84,1 
                     L 0.14,1 
                     C 0.06,1 0,0.94 0,0.86 
                     L 0,0.16 
                     C 0.07,0.16 0.16,0.07 0.16,0 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Card container lớn màu trắng bao trọn 2 cột */}
      <div className="w-full max-w-[1240px] xl:max-w-[1280px] bg-white rounded-[32px] sm:rounded-[40px] shadow-2xl shadow-slate-200/80 border border-slate-100 flex flex-col lg:flex-row items-stretch overflow-hidden lg:h-[88vh] lg:max-h-[820px] lg:min-h-[620px]">
        {/* CỘT TRÁI: FORM ĐĂNG NHẬP / ĐĂNG KÝ (Rộng vừa phải, vừa khít khung nhìn, không bị cuộn kéo) */}
        <section className="w-full lg:w-[48%] xl:w-[45%] flex flex-col justify-center px-6 py-6 sm:px-10 sm:py-8 lg:px-12 lg:py-8 overflow-y-auto">
          <div className="w-full max-w-[420px] mx-auto my-auto">
            {children}
          </div>
        </section>

        {/* CỘT PHẢI: KHỐI HÌNH ẢNH XE BUS VỚI ĐƯỜNG CẮT NGHỆ THUẬT */}
        <aside className="hidden lg:flex flex-1 p-4 lg:p-6 items-center justify-center relative overflow-hidden bg-white">
          <div
            className="relative w-full h-full overflow-hidden shadow-xl"
            style={{
              clipPath: 'url(#bus-hero-clip)',
              WebkitClipPath: 'url(#bus-hero-clip)',
            }}
          >
            {/* Ảnh chiếc xe bus hiện đại sắc nét */}
            <img
              src="/images/auth-bus-bg.jpg"
              alt="SmartTruck Hub Bus Transit Fleet"
              className="absolute inset-0 h-full w-full object-cover object-center scale-100 hover:scale-105 transition-transform duration-700 ease-out"
            />

            {/* Gradient phủ nhẹ */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-slate-950/45 pointer-events-none" />

            {/* Text slogan góc trên bên phải theo ảnh mẫu */}
            <div className="absolute top-8 right-8 max-w-[320px] text-right pointer-events-none">
              <p className="font-sora text-sm sm:text-base font-semibold leading-relaxed text-white drop-shadow-md">
                Một điểm đỗ. <span className="text-brand-orange">Ngàn hành trình.</span>
              </p>
              <p className="mt-1 text-xs text-slate-200/90 leading-relaxed drop-shadow-sm font-normal">
                Quản lý bãi đỗ xe tải và xe bus thông minh trên toàn quốc.
              </p>
            </div>

            {/* Badge bảo mật góc dưới bên trái */}
            <div className="absolute bottom-8 left-8 flex items-center gap-2 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/20 px-4 py-2 text-xs font-medium text-white shadow-lg pointer-events-none">
              <ShieldCheck className="w-4 h-4 text-brand-orange shrink-0" />
              <span>An tâm trên từng chặng đường</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
