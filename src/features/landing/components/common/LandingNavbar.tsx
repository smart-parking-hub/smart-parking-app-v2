import { LandingMetadata } from './LandingMetadata'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Truck, Headset, Menu, X } from 'lucide-react'

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  const isDriverPage =
    location.pathname.includes('driver-solutions') || location.pathname.includes('giai-phap-tai-xe') || location.pathname.includes('solutions/drivers')
  const isOwnerPage =
    location.pathname.includes('owner-solutions') || location.pathname.includes('giai-phap-chu-bai') || location.pathname.includes('solutions/owners')
  const isPricingPage =
    location.pathname.includes('pricing') || location.pathname.includes('bang-gia')
  const isApiPage =
    location.pathname.includes('api-docs') || location.pathname.includes('ket-noi-api')
  const isAboutPage =
    location.pathname.includes('about') || location.pathname.includes('ve-chung-toi')
  const isCareersPage =
    location.pathname.includes('careers') || location.pathname.includes('tuyen-dung')
  const isInsightsPage =
    location.pathname === '/company/blog' ||
    location.pathname.includes('insights') ||
    location.pathname.includes('tin-tuc') ||
    location.pathname.includes('bai-viet')
  const isContactPage =
    location.pathname.includes('contact') ||
    location.pathname.includes('lien-he') ||
    location.pathname.includes('ho-tro')
  const isHomePage =
    !isDriverPage &&
    !isOwnerPage &&
    !isPricingPage &&
    !isApiPage &&
    !isAboutPage &&
    !isCareersPage &&
    !isInsightsPage &&
    !isContactPage

  const navLinks = isContactPage
    ? [
        { label: 'Trang chủ', href: '/' },
        { label: 'Giải pháp Tài xế', href: '/driver-solutions' },
        { label: 'Giải pháp Chủ bãi', href: '/owner-solutions' },
        { label: 'Bảng giá', href: '/pricing' },
        { label: 'Kết nối API', href: '/api-docs' },
        { label: 'Về chúng tôi', href: '/about' },
        { label: 'Tin tức & Báo cáo', href: '/company/blog' },
        {
          label: 'Liên hệ',
          href: '/contact',
          isCurrent: true,
        },
      ]
    : isInsightsPage
    ? [
        { label: 'Trang chủ', href: '/' },
        { label: 'Giải pháp Tài xế', href: '/driver-solutions' },
        { label: 'Giải pháp Chủ bãi', href: '/owner-solutions' },
        { label: 'Bảng giá', href: '/pricing' },
        { label: 'Kết nối API', href: '/api-docs' },
        { label: 'Về chúng tôi', href: '/about' },
        {
          label: 'Tin tức & Báo cáo',
          href: '/company/blog',
          isCurrent: true,
        },
        { label: 'Liên hệ', href: '/contact' },
      ]
    : isCareersPage
    ? [
        { label: 'Trang chủ', href: '/' },
        { label: 'Giải pháp Tài xế', href: '/driver-solutions' },
        { label: 'Giải pháp Chủ bãi', href: '/owner-solutions' },
        { label: 'Bảng giá', href: '/pricing' },
        { label: 'Kết nối API', href: '/api-docs' },
        { label: 'Về chúng tôi', href: '/about' },
        {
          label: 'Tuyển dụng',
          href: '/careers',
          isCurrent: true,
        },
        { label: 'Liên hệ', href: '#lien-he' },
      ]
    : isAboutPage
    ? [
        { label: 'Trang chủ', href: '/' },
        { label: 'Giải pháp Tài xế', href: '/driver-solutions' },
        { label: 'Giải pháp Chủ bãi', href: '/owner-solutions' },
        { label: 'Bảng giá', href: '/pricing' },
        { label: 'Kết nối API', href: '/api-docs' },
        {
          label: 'Về chúng tôi',
          href: '/company/about',
          isCurrent: true,
        },
        { label: 'Liên hệ', href: '/company/contact' },
      ]
    : isApiPage
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
        { label: 'Về chúng tôi', href: '/about' },
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
        { label: 'Về chúng tôi', href: '/about' },
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
            label: 'Kết nối API',
            href: '/api-docs',
          },
          {
            label: 'Về chúng tôi',
            href: '/about',
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
              label: 'Về chúng tôi',
              href: '/about',
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
              label: 'Về chúng tôi',
              href: '/about',
              isCurrent: false,
            },
            {
              label: 'Liên hệ',
              href: '#lien-he',
            },
          ]

  if (!navLinks.some((item) => item.href === '/company/blog')) {
    navLinks.push({ label: 'Tin tức & Báo cáo', href: '/company/blog', isCurrent: false })
  }

  const closeMobileMenu = () => setMobileMenuOpen(false)

  const ctaLabel = isContactPage
    ? 'Gửi yêu cầu 24/7'
    : isInsightsPage
      ? 'Đăng ký bản tin'
    : isCareersPage
      ? 'Ứng tuyển ngay'
      : isAboutPage
        ? 'Gia nhập mạng lưới'
      : isApiPage
        ? 'Nhận Sandbox Key'
        : isOwnerPage
          ? 'Hợp tác bãi đỗ'
          : 'Tìm bãi đỗ ngay'

  const ctaHref = isContactPage
    ? '#enterpriseContactForm'
    : isInsightsPage
      ? '#ban-tin'
    : isCareersPage
      ? '#vi-tri-tuyen-dung'
      : isAboutPage
        ? '#gia-nhap'
      : isApiPage
        ? '#sandbox-register'
        : isOwnerPage
          ? '#onboarding-form'
          : isDriverPage
            ? '#tim-bai-ngay'
            : isPricingPage
              ? '/driver-solutions'
              : '#tim-bai'

  const isDarkNav = isHomePage

  return (
    <header
      className={`sticky top-0 inset-x-0 z-50 transition-colors backdrop-blur-md ${
        isDarkNav
          ? 'bg-[#060D1A]/95 text-white'
          : 'bg-white/95 border-b border-brand-border text-slate-800'
      }`}
    >
      <LandingMetadata />
      <div className="max-w-[1440px] mx-auto h-20 px-4 xl:px-6 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <Link
          className="flex items-center gap-2 sm:gap-2.5 shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded-lg"
          to="/"
          aria-label="SmartTruckHub Trang chủ"
        >
          <div className="w-10 h-10 rounded-lg bg-brand-orange flex items-center justify-center text-[#060D1A] transition-transform group-hover:scale-105">
            <Truck className="h-6 w-6 text-[#060D1A]" aria-hidden="true" />
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className={`font-sora font-bold text-base sm:text-xl tracking-tight ${
                isDarkNav ? 'text-white' : 'text-brand-navy'
              }`}
            >
              SMART<span className="text-brand-orange">TRUCK</span>
            </span>
            <span
              className={`hidden sm:inline text-sm font-semibold tracking-wider px-2 py-0.5 rounded uppercase border ${
                isDarkNav
                  ? 'bg-slate-800/90 text-slate-300 border-slate-700'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              HUB
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex items-center gap-1 xl:gap-2.5 whitespace-nowrap" aria-label="Điều hướng chính">
          {navLinks.map((item) => {
            const isInternal = item.href.startsWith('/') && !item.href.includes('#')
            const activeClass = item.isCurrent
              ? 'text-brand-orange font-semibold border-b-2 border-brand-orange pb-0.5'
              : isDarkNav
                ? 'text-slate-300 hover:text-white font-medium'
                : 'text-slate-600 hover:text-brand-navy font-medium'

            if (isInternal) {
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded px-2.5 py-1 ${activeClass}`}
                >
                  {item.label}
                </Link>
              )
            }
            return (
              <a
                key={item.label}
                className={`text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded px-2.5 py-1 ${activeClass}`}
                href={item.href}
              >
                {item.label}
              </a>
            )
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3 shrink-0 whitespace-nowrap">
          <a
            className={`hidden min-[1400px]:flex items-center gap-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded px-2 py-1 ${
              isDarkNav ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-brand-navy'
            }`}
            href="tel:19006868"
          >
            <Headset className={`h-5 w-5 ${isDarkNav ? 'text-brand-orange' : 'text-slate-400'}`} aria-hidden="true" />
            <span>1900 6868</span>
          </a>
          <div className={`h-4 w-px hidden min-[1400px]:block ${isDarkNav ? 'bg-slate-800' : 'bg-slate-200'}`} />
          <Link
            className={`hidden md:inline-flex text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded px-3 py-1.5 ${
              isDarkNav ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-brand-navy'
            }`}
            to="/login"
          >
            Đăng nhập
          </Link>
          <a
            className="hidden sm:inline-flex items-center justify-center bg-brand-orange hover:bg-brand-orange-hover text-[#060D1A] text-sm font-bold px-4 sm:px-5 py-2.5 rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
            href={ctaHref}
          >
            {ctaLabel}
          </a>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            className={`xl:hidden p-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange ${
              isDarkNav ? 'text-slate-200 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100'
            }`}
            aria-label={mobileMenuOpen ? 'Đóng menu điều hướng' : 'Mở menu điều hướng'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className={`h-6 w-6 ${isDarkNav ? 'text-white' : 'text-brand-navy'}`} aria-hidden="true" />
            ) : (
              <Menu className={`h-6 w-6 ${isDarkNav ? 'text-white' : 'text-brand-navy'}`} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <div className="xl:hidden border-t border-brand-border bg-white px-4 py-2">
        <Link
          to="/company/blog"
          onClick={closeMobileMenu}
          aria-current={isInsightsPage ? 'page' : undefined}
          className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-semibold text-brand-orange-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
        >
          Tin tức & Báo cáo <span aria-hidden="true">→</span>
        </Link>
      </div>

      {/* Mobile Navigation Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div
          className={`xl:hidden px-6 py-6 shadow-xl animate-in slide-in-from-top-2 duration-200 border-b ${
            isDarkNav
              ? 'bg-[#0B1528] border-slate-800 text-white'
              : 'bg-white border-brand-border text-slate-800'
          }`}
        >
          <nav className="flex flex-col gap-4 mb-6" aria-label="Điều hướng di động">
            {navLinks.map((item) => {
              const isInternal = item.href.startsWith('/') && !item.href.includes('#')
              const activeClass = item.isCurrent
                ? 'text-brand-orange font-semibold'
                : isDarkNav
                  ? 'text-slate-200 hover:text-brand-orange font-medium'
                  : 'text-slate-700 hover:text-brand-orange font-medium'
              const borderClass = isDarkNav ? 'border-slate-800' : 'border-slate-100'

              if (isInternal) {
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={`text-base py-2 border-b ${borderClass} ${activeClass}`}
                    onClick={closeMobileMenu}
                  >
                    {item.label}
                  </Link>
                )
              }
              return (
                <a
                  key={item.label}
                  className={`text-base py-2 border-b ${borderClass} ${activeClass}`}
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
              href={ctaHref}
              onClick={closeMobileMenu}
              className="sm:hidden text-center rounded-lg bg-brand-orange text-[#060D1A] font-bold px-4 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
            >
              {ctaLabel}
            </a>
            <a
              className={`flex items-center justify-center gap-2 font-semibold text-sm py-2 ${
                isDarkNav ? 'text-slate-300' : 'text-slate-700'
              }`}
              href="tel:19006868"
            >
              <Headset className="h-5 w-5 text-brand-orange" aria-hidden="true" />
              <span>Tổng đài: 1900 6868</span>
            </a>
            <Link
              to="/login"
              className={`w-full text-center py-2.5 rounded-lg border text-sm font-semibold transition-colors ${
                isDarkNav
                  ? 'border-slate-700 text-slate-200 hover:bg-slate-800'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
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
