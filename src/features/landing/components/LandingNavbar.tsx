import { Link } from 'react-router-dom'
import { Truck, Headset } from 'lucide-react'

export function LandingNavbar() {
  return (
    <header className="sticky top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-b border-brand-border">
      <div className="max-w-[1240px] mx-auto h-20 px-6 flex items-center justify-between gap-6">
        {/* Brand Logo */}
        <Link className="flex items-center gap-2.5 shrink-0 group" to="/">
          <div className="w-10 h-10 rounded-lg bg-brand-navy flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <Truck className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-sora font-bold text-xl tracking-tight text-brand-navy">
              SMART<span className="text-brand-orange">TRUCK</span>
            </span>
            <span className="bg-slate-100 text-slate-700 text-[11px] font-semibold tracking-wider px-2 py-0.5 rounded border border-slate-200 uppercase">
              HUB
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          <a className="text-sm font-medium text-slate-600 hover:text-brand-navy transition-colors" href="#giai-phap-tai-xe">
            Giải pháp Tài xế
          </a>
          <a className="text-sm font-medium text-slate-600 hover:text-brand-navy transition-colors" href="#giai-phap-chu-bai">
            Chủ bãi
          </a>
          <a className="text-sm font-medium text-slate-600 hover:text-brand-navy transition-colors" href="#quy-trinh">
            Quy trình
          </a>
          <a className="text-sm font-medium text-slate-600 hover:text-brand-navy transition-colors" href="#bang-gia">
            Bảng giá
          </a>
          <a className="text-sm font-medium text-slate-600 hover:text-brand-navy transition-colors" href="#api">
            Kết nối API
          </a>
          <a className="text-sm font-medium text-slate-600 hover:text-brand-navy transition-colors" href="#lien-he">
            Liên hệ
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-5 shrink-0">
          <a
            className="hidden sm:flex items-center gap-2 text-slate-600 hover:text-brand-navy text-sm font-semibold transition-colors"
            href="tel:19006868"
          >
            <Headset className="h-5 w-5 text-slate-400" aria-hidden="true" />
            <span>1900 6868</span>
          </a>
          <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>
          <Link
            className="hidden md:inline-flex text-sm font-medium text-slate-700 hover:text-brand-navy transition-colors"
            to="/login"
          >
            Đăng nhập
          </Link>
          <a
            className="inline-flex items-center justify-center bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-all"
            href="#tim-bai"
          >
            Tìm bãi đỗ ngay
          </a>
        </div>
      </div>
    </header>
  )
}
