import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Truck } from 'lucide-react'
import { ScrollToTop } from '@/shared/components/ScrollToTop'

export function AuthLayout({ children }: { children: ReactNode }) {
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
