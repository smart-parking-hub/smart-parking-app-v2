import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Truck, Headset, Menu, X } from 'lucide-react'

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const isDriverPage =
    location.pathname.includes('driver-solutions') || location.pathname.includes('giai-phap-tai-xe')
  const isOwnerPage =
    location.pathname.includes('owner-solutions') || location.pathname.includes('giai-phap-chu-bai')
  const isPricingPage =
    location.pathname.includes('pricing') || location.pathname.includes('bang-gia')
  const isApiPage =
    location.pathname.includes('api-docs') || location.pathname.includes('ket-noi-api')
  const isHomePage = !isDriverPage && !isOwnerPage && !isPricingPage && !isApiPage

  const navLinks = isApiPage
    ? [
        { label: 'Trang chủ', href: '/' },
        { label: 'Giải pháp Tài xế', href: '/driver-solutions' },
        { label: 'Giải pháp Chủ bãi', href: '/owner-solutions' },
        { label: 'Bảng giá', href: '/pricing' },
        {
          label: 'Kết nối API',
          href: '/api-docs',
          isCurrent: true,
        },
        { label: 'Quy trình', href: '#quy-trinh' },
        { label: 'Liên hệ', href: '#lien-he' },
      ]
    : isPricingPage
    ? [
        { label: 'Trang chủ', href: '/' },
        { label: 'Giải pháp Tài xế', href: '/driver-solutions' },
        { label: 'Giải pháp Chủ bãi', href: '/owner-solutions' },
        {
          label: 'Bảng giá',
          href: '/pricing',
          isCurrent: true,
        },
        { label: 'Kết nối API', href: '/api-docs' },
        { label: 'Liên hệ', href: '#lien-he' },
      ]
    : isOwnerPage
      ? [
          { label: 'Trang chủ', href: '/' },
          {
            label: 'Giải pháp Chủ bãi',
            href: '/owner-solutions',
            isCurrent: true,
          },
          {
            label: 'Giải pháp Tài xế',
            href: '/driver-solutions',
            isCurrent: false,
          },
          {
            label: 'Bảng giá & ROI',
            href: '/pricing',
          },
          {
            label: 'Hạ tầng IoT',
            href: '#tinh-nang',
          },
          {
            label: 'Kết nối API',
            href: '/api-docs',
          },
          {
            label: 'Liên hệ',
            href: '#onboarding-form',
          },
        ]
      : isDriverPage
        ? [
            { label: 'Trang chủ', href: '/' },
            {
              label: 'Giải pháp Tài xế',
              href: '/driver-solutions',
              isCurrent: true,
            },
            {
              label: 'Chủ bãi',
              href: '/owner-solutions',
              isCurrent: false,
            },
            {
              label: 'Quy trình',
              href: '#quy-trinh-tai-xe',
            },
            {
              label: 'Bảng giá',
              href: '/pricing',
            },
            {
              label: 'Kết nối API',
              href: '/api-docs',
            },
            {
              label: 'Liên hệ',
              href: '#lien-he',
            },
          ]
        : [
            {
              label: 'Trang chủ',
              href: '/',
              isCurrent: isHomePage,
            },
            {
              label: 'Giải pháp Tài xế',
              href: '/driver-solutions',
              isCurrent: false,
            },
            {
              label: 'Chủ bãi',
              href: '/owner-solutions',
              isCurrent: false,
            },
            {
              label: 'Bảng giá',
              href: '/pricing',
              isCurrent: false,
            },
            {
              label: 'Kết nối API',
              href: '/api-docs',
              isCurrent: false,
            },
            {
              label: 'Quy trình',
              href: '#quy-trinh',
            },
            {
              label: 'Liên hệ',
              href: '#lien-he',
            },
          ]

  const closeMobileMenu = () => setMobileMenuOpen(false)

  const ctaLabel = isApiPage
    ? 'Nhận Sandbox Key'
    : isOwnerPage
      ? 'Hợp tác bãi đỗ'
      : 'Tìm bãi đỗ ngay'

  const ctaHref = isApiPage
    ? '#sandbox-register'
    : isOwnerPage
      ? '#onboarding-form'
      : isDriverPage
        ? '#tim-bai-ngay'
        : isPricingPage
          ? '/driver-solutions'
          : '#tim-bai'

  return (
    <header className="sticky top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-b border-brand-border">
      <div className="max-w-[1240px] mx-auto h-20 px-6 flex items-center justify-between gap-6">
        {/* Brand Logo */}
        <Link
          className="flex items-center gap-2.5 shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded-lg"
          to="/"
          aria-label="SmartTruckHub Trang chủ"
        >
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
        <nav className="hidden lg:flex items-center gap-7" aria-label="Điều hướng chính">
          {navLinks.map((item) => {
            const isInternal = item.href.startsWith('/') && !item.href.includes('#')
            if (isInternal) {
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded px-1.5 py-0.5 ${
                    item.isCurrent
                      ? 'text-brand-orange font-semibold border-b-2 border-brand-orange pb-0.5'
                      : 'text-slate-600 hover:text-brand-navy font-medium'
                  }`}
                >
                  {item.label}
                </Link>
              )
            }
            return (
              <a
                key={item.label}
                className="text-sm font-medium text-slate-600 hover:text-brand-navy transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded px-1.5 py-0.5"
                href={item.href}
              >
                {item.label}
              </a>
            )
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-5 shrink-0">
          <a
            className="hidden sm:flex items-center gap-2 text-slate-600 hover:text-brand-navy text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded"
            href="tel:19006868"
          >
            <Headset className="h-5 w-5 text-slate-400" aria-hidden="true" />
            <span>1900 6868</span>
          </a>
          <div className="h-4 w-px bg-slate-200 hidden sm:block" />
          <Link
            className="hidden md:inline-flex text-sm font-medium text-slate-700 hover:text-brand-navy transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded px-2 py-1"
            to="/login"
          >
            Đăng nhập
          </Link>
          <a
            className="inline-flex items-center justify-center bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
            href={ctaHref}
          >
            {ctaLabel}
          </a>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
            aria-label={mobileMenuOpen ? 'Đóng menu điều hướng' : 'Mở menu điều hướng'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-brand-navy" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6 text-brand-navy" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-brand-border px-6 py-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-4 mb-6" aria-label="Điều hướng di động">
            {navLinks.map((item) => {
              const isInternal = item.href.startsWith('/') && !item.href.includes('#')
              if (isInternal) {
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={`text-base py-1.5 border-b border-slate-100 ${
                      item.isCurrent
                        ? 'text-brand-orange font-semibold'
                        : 'text-slate-700 hover:text-brand-orange font-medium'
                    }`}
                    onClick={closeMobileMenu}
                  >
                    {item.label}
                  </Link>
                )
              }
              return (
                <a
                  key={item.label}
                  className="text-base font-medium text-slate-700 hover:text-brand-orange transition-colors py-1.5 border-b border-slate-100"
                  href={item.href}
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </a>
              )
            })}
          </nav>
          <div className="pt-2 flex flex-col gap-3">
            <a
              className="flex items-center justify-center gap-2 text-slate-700 font-semibold text-sm py-2"
              href="tel:19006868"
            >
              <Headset className="h-5 w-5 text-slate-400" aria-hidden="true" />
              <span>Tổng đài: 1900 6868</span>
            </a>
            <Link
              to="/login"
              className="w-full text-center py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700"
              onClick={closeMobileMenu}
            >
              Đăng nhập tài khoản
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
