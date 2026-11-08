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
    <main className="min-h-screen bg-brand-surface font-inter lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] p-3 lg:p-4 gap-4">
      <ScrollToTop />
      {/* Cột bên trái: Khung nền ảnh xe tải với viền bo góc tạo hình dáng cabin xe tải và Card modal kính mờ */}
      <aside className="relative hidden lg:flex flex-col justify-center overflow-hidden rounded-3xl lg:rounded-[36px] xl:rounded-tr-[90px] xl:rounded-br-[40px] border border-slate-800/80 bg-slate-950 p-6 xl:p-10 shadow-2xl ring-1 ring-brand-orange/20">
        {/* Ảnh nền chiếc xe tải độ nét cao */}
        <img
          src="/images/auth-truck-bg.jpg"
          alt="SmartTruck Hub Logistics Fleet"
          className="absolute inset-0 h-full w-full object-cover object-[65%_center] transition-transform duration-700 ease-out hover:scale-105"
        />

        {/* Lớp phủ đa tầng tạo chiều sâu điện ảnh và đảm bảo tương phản */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-slate-950/60 pointer-events-none" />
        
        {/* Dải LED viền khí động học phong cách cabin xe tải */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-brand-orange/30 via-transparent to-transparent pointer-events-none rounded-tr-[90px]" />
        <div className="absolute bottom-0 left-0 w-60 h-28 bg-gradient-to-tr from-brand-orange/20 via-transparent to-transparent pointer-events-none" />

        {/* Khối modal nổi (ảnh 2) thu nhỏ lại, đặt ở phía bên trái, phong cách Glassmorphism trong suốt */}
        <div className="relative z-10 max-w-[420px] w-full rounded-2xl xl:rounded-3xl bg-slate-950/65 backdrop-blur-xl border border-white/15 p-6 xl:p-8 shadow-2xl shadow-black/80 flex flex-col justify-between space-y-6">
          {/* Header với Logo */}
          <Link
            to="/"
            className="inline-flex items-center gap-3 font-sora text-lg font-bold text-white hover:text-brand-orange transition-colors w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded-lg p-1 -m-1"
          >
            <img
              src="/image-smart-parking-hub.png"
              alt="Smart Parking Hub Logo"
              className="w-8 h-8 rounded-lg object-contain shrink-0 ring-1 ring-white/20"
            />
            <span>SMARTTRUCK HUB</span>
          </Link>

          {/* Phần nội dung chính của Modal */}
          <div className="space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/15 border border-brand-orange/30 font-mono text-[11px] font-semibold tracking-wider text-brand-orange">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
              KẾT NỐI MỌI ĐIỂM ĐỖ
            </div>

            <h2 className="font-sora text-2xl xl:text-3xl font-extrabold leading-snug tracking-tight text-white">
              Một điểm đỗ.
              <br />
              <span className="text-brand-orange">Ngàn hành trình.</span>
            </h2>

            <p className="text-xs xl:text-sm leading-relaxed text-slate-300 font-normal">
              Quản lý bãi đỗ, đặt chỗ và vận hành cổng trong cùng một hệ thống dành cho cộng đồng vận tải.
            </p>
          </div>

          {/* Footer của Modal */}
          <div className="flex items-center gap-2.5 border-t border-white/10 pt-4 text-xs font-medium text-slate-300">
            <ShieldCheck className="w-4 h-4 text-brand-orange shrink-0" />
            <span>An tâm trên từng chặng đường</span>
          </div>
        </div>
      </aside>
      <section className="flex items-center justify-center px-6 py-12 md:px-14 md:py-16 xl:px-20 2xl:px-28">
        <div className="w-full max-w-[600px]">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-3 font-sora text-lg font-bold text-brand-navy lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] rounded-lg p-1 transition-colors"
          >
            <img
            src="/image-smart-parking-hub.png"
            alt="Smart Parking Hub Logo"
            className="w-8 h-8 rounded-lg object-contain shrink-0"
          />
            SMARTTRUCK HUB
          </Link>
          {children}
        </div>
      </section>
    </main>
  )
}
