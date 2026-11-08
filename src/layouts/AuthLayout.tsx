import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Truck } from 'lucide-react'
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
    <main className="min-h-screen bg-brand-surface font-inter lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <ScrollToTop />
      <aside className="relative hidden flex-col justify-between lg:flex overflow-hidden bg-brand-navy p-8 text-white lg:p-16">
        <Link
          to="/"
          className="flex items-center gap-3 font-sora text-xl font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-lg p-1 transition-colors"
        >
          <Truck className="text-brand-orange" />
          SMARTTRUCK HUB
        </Link>
        <div className="py-12 lg:py-24">
          <p className="mb-6 font-mono text-xs tracking-[.3em] text-brand-orange">
            KẾT NỐI MỌI ĐIỂM ĐỖ
          </p>
          <h2 className="max-w-xl font-sora text-4xl leading-tight lg:text-6xl">
            Một điểm đỗ.
            <br />
            <span className="text-brand-orange">Ngàn hành trình.</span>
          </h2>
          <p className="mt-8 max-w-md text-sm leading-7 text-slate-300">
            Quản lý bãi đỗ, đặt chỗ và vận hành cổng trong cùng một hệ thống
            dành cho cộng đồng vận tải.
          </p>
        </div>
        <div className="flex items-center gap-3 border-t border-slate-700 pt-6 text-sm text-slate-300">
          <ShieldCheck className="text-brand-orange" />
          An tâm trên từng chặng đường
        </div>
      </aside>
      <section className="flex items-center justify-center px-6 py-12 md:px-14 md:py-16 xl:px-20 2xl:px-28">
        <div className="w-full max-w-[600px]">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-3 font-sora text-lg font-bold text-brand-navy lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] rounded-lg p-1 transition-colors"
          >
            <Truck className="text-brand-orange" />
            SMARTTRUCK HUB
          </Link>
          {children}
        </div>
      </section>
    </main>
  )
}
