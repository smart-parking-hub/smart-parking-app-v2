import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Truck,
  Headset,
  Menu,
  X,
  ChevronDown,
  Building2,
  CodeXml,
  Info,
  Briefcase,
  FileText,
  PhoneCall,
} from 'lucide-react'
import { LandingMetadata } from './LandingMetadata'
import { cn } from '@/shared/utils/cn'
import { useScrollToTop } from '@/shared/components/ScrollToTop'

interface NavChildItem {
  label: string
  href: string
  description?: string
  icon: React.ComponentType<{ className?: string }>
}

interface NavGroupItem {
  label: string
  id: string
  children: NavChildItem[]
}

interface NavSingleItem {
  label: string
  href: string
}

type NavItem = NavSingleItem | NavGroupItem

function isGroup(item: NavItem): item is NavGroupItem {
  return 'children' in item
}

export function LandingNavbar() {
  useScrollToTop()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const location = useLocation()
  const navRef = useRef<HTMLDivElement>(null)

  const currentPath = location.pathname

  // Path matches
  const isDriverPage =
    currentPath.includes('driver-solutions') ||
    currentPath.includes('giai-phap-tai-xe') ||
    currentPath.includes('solutions/drivers')
  const isOwnerPage =
    currentPath.includes('owner-solutions') ||
    currentPath.includes('giai-phap-chu-bai') ||
    currentPath.includes('solutions/owners')
  const isApiPage =
    currentPath.includes('api-docs') || currentPath.includes('ket-noi-api') || currentPath.includes('solutions/api')
  const isPricingPage =
    currentPath.includes('pricing') || currentPath.includes('bang-gia')
  const isAboutPage =
    currentPath.includes('about') || currentPath.includes('ve-chung-toi') || currentPath.includes('company/about')
  const isCareersPage =
    currentPath.includes('careers') || currentPath.includes('tuyen-dung') || currentPath.includes('company/careers')
  const isInsightsPage =
    currentPath === '/company/blog' ||
    currentPath.includes('insights') ||
    currentPath.includes('tin-tuc') ||
    currentPath.includes('bai-viet')
  const isContactPage =
    currentPath.includes('contact') ||
    currentPath.includes('lien-he') ||
    currentPath.includes('ho-tro') ||
    currentPath.includes('company/contact')

  const isSolutionsActive = isDriverPage || isOwnerPage || isApiPage
  const isCompanyActive = isAboutPage || isCareersPage || isInsightsPage
  const isHomeActive =
    !isSolutionsActive && !isPricingPage && !isCompanyActive && !isContactPage

  const isDarkNav = isHomeActive || isDriverPage || isOwnerPage

  // Unified stable navigation tree across all pages
  const navTree: NavItem[] = [
    {
      label: 'Trang chủ',
      href: '/',
    },
    {
      label: 'Giải pháp',
      id: 'solutions',
      children: [
        {
          label: 'Giải pháp Tài xế',
          href: '/driver-solutions',
          description: 'Tìm bãi đỗ thông minh, đặt chỗ trước & vé điện tử QR ALPR',
          icon: Truck,
        },
        {
          label: 'Giải pháp Chủ bãi',
          href: '/owner-solutions',
          description: 'Tự động hóa cổng barie, kiểm soát sức chứa & tối ưu doanh thu',
          icon: Building2,
        },
        {
          label: 'Kết nối API',
          href: '/api-docs',
          description: 'Cổng API mở tích hợp TMS, ERP đội xe và bến bãi',
          icon: CodeXml,
        },
      ],
    },
    {
      label: 'Bảng giá',
      href: '/pricing',
    },
    {
      label: 'Doanh nghiệp',
      id: 'company',
      children: [
        {
          label: 'Về chúng tôi',
          href: '/about',
          description: 'Sứ mệnh số hóa hạ tầng logistics bến bãi Việt Nam',
          icon: Info,
        },
        {
          label: 'Tuyển dụng',
          href: '/careers',
          description: 'Cơ hội phát triển nghề nghiệp cùng đội ngũ kỹ thuật cao',
          icon: Briefcase,
        },
        {
          label: 'Tin tức & Báo cáo',
          href: '/company/blog',
          description: 'Báo cáo chỉ số logistics, thị trường bến bãi & công nghệ',
          icon: FileText,
        },
      ],
    },
    {
      label: 'Liên hệ',
      href: '/contact',
    },
  ]

  // Close dropdowns on outside click or escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpenDropdown(null)
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Close menus on route change
  useEffect(() => {
    setOpenDropdown(null)
    setMobileMenuOpen(false)
  }, [location.pathname])

  const toggleDropdown = (id: string) => {
    setOpenDropdown((prev) => (prev === id ? null : id))
  }

  // Adaptive contextual CTA on the right
  const ctaLabel = isInsightsPage
    ? 'Đăng ký bản tin'
    : isContactPage
      ? 'Gửi yêu cầu 24/7'
      : isCareersPage
        ? 'Ứng tuyển ngay'
        : isApiPage
          ? 'Nhận Sandbox Key'
          : isOwnerPage
            ? 'Hợp tác bãi đỗ'
            : 'Tìm bãi đỗ ngay'

  const ctaHref = isInsightsPage
    ? '#ban-tin'
    : isContactPage
      ? '#enterpriseContactForm'
      : isCareersPage
        ? '#vi-tri-tuyen-dung'
        : isApiPage
          ? '#sandbox-register'
          : isOwnerPage
            ? '#onboarding-form'
            : '/parking'

  return (
    <header
      className={cn(
        'sticky top-0 inset-x-0 z-50 transition-colors backdrop-blur-md',
        isDarkNav
          ? 'bg-[#060D1A]/95 text-white border-b border-slate-800/80 shadow-md'
          : 'bg-white/95 border-b border-brand-border text-slate-800 shadow-2xs'
      )}
    >
      <LandingMetadata />

      <div
        ref={navRef}
        className="max-w-[1440px] mx-auto h-20 px-4 xl:px-8 flex items-center justify-between gap-4"
      >
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange rounded-xl p-1"
          aria-label="SmartTruckHub Trang chủ"
        >
          <img
            src="/image-smart-parking-hub.png"
            alt="Smart Parking Hub Logo"
            className="w-10 h-10 rounded-xl object-contain shadow-xs transition-transform group-hover:scale-105"
          />
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                'font-sora font-bold text-lg sm:text-xl tracking-tight leading-none',
                isDarkNav ? 'text-white' : 'text-brand-navy'
              )}
            >
              SMART<span className="text-brand-orange">TRUCK</span>
            </span>
            <span
              className={cn(
                'hidden sm:inline-block text-[11px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-md uppercase border',
                isDarkNav
                  ? 'bg-slate-800 text-slate-300 border-slate-700'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              )}
            >
              HUB
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Bar */}
        <nav
          className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium"
          aria-label="Điều hướng chính"
        >
          {navTree.map((item) => {
            if (!isGroup(item)) {
              const isCurrent =
                item.href === '/'
                  ? isHomeActive
                  : currentPath.startsWith(item.href)

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={cn(
                    'px-3.5 py-2 rounded-xl transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange',
                    isCurrent
                      ? 'text-brand-orange font-semibold bg-brand-orange/10'
                      : isDarkNav
                        ? 'text-slate-300 hover:text-white hover:bg-white/10'
                        : 'text-slate-700 hover:text-brand-navy hover:bg-slate-100'
                  )}
                >
                  {item.label}
                </Link>
              )
            }

            // Group Dropdown Item
            const isGroupActive =
              item.id === 'solutions' ? isSolutionsActive : isCompanyActive
            const isOpen = openDropdown === item.id

            return (
              <div
                key={item.id}
                className="relative group"
                onMouseEnter={() => setOpenDropdown(item.id)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  type="button"
                  onClick={() => toggleDropdown(item.id)}
                  aria-haspopup="menu"
                  aria-expanded={isOpen}
                  className={cn(
                    'flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange cursor-pointer',
                    isGroupActive
                      ? 'text-brand-orange font-semibold bg-brand-orange/10'
                      : isDarkNav
                        ? 'text-slate-300 hover:text-white hover:bg-white/10'
                        : 'text-slate-700 hover:text-brand-navy hover:bg-slate-100'
                  )}
                >
                  <span>{item.label}</span>
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 transition-transform duration-200',
                      isOpen && 'rotate-180 text-brand-orange'
                    )}
                    aria-hidden="true"
                  />
                </button>

                {/* Dropdown Flyout Card */}
                <div
                  aria-label={item.label}
                  className={cn(
                    'absolute left-0 top-full pt-2 w-72 xl:w-80 transition-all duration-150 z-50',
                    isOpen
                      ? 'opacity-100 visible translate-y-0 pointer-events-auto'
                      : 'opacity-0 invisible -translate-y-1 pointer-events-none'
                  )}
                >
                  <div
                    className={cn(
                      'rounded-2xl border p-2 shadow-xl backdrop-blur-md',
                      isDarkNav
                        ? 'bg-[#0B1528] border-slate-700 text-white'
                        : 'bg-white border-slate-200 text-slate-800'
                    )}
                  >
                    {item.children.map((child) => {
                      const Icon = child.icon
                      const isChildCurrent = currentPath.startsWith(child.href)

                      return (
                        <Link
                          key={child.href}
                          to={child.href}
                          onClick={() => setOpenDropdown(null)}
                          className={cn(
                            'flex items-start gap-3 p-2.5 rounded-xl transition-colors group/item',
                            isChildCurrent
                              ? isDarkNav
                                ? 'bg-slate-800/80 text-brand-orange'
                                : 'bg-orange-50 text-brand-orange font-semibold'
                              : isDarkNav
                                ? 'hover:bg-slate-800/60 text-slate-200 hover:text-white'
                                : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900'
                          )}
                        >
                          <div
                            className={cn(
                              'p-2 rounded-lg shrink-0 mt-0.5 transition-colors',
                              isChildCurrent
                                ? 'bg-brand-orange/20 text-brand-orange'
                                : isDarkNav
                                  ? 'bg-slate-800 text-slate-400 group-hover/item:text-brand-orange'
                                  : 'bg-slate-100 text-slate-500 group-hover/item:text-brand-orange group-hover/item:bg-orange-50'
                            )}
                          >
                            <Icon className="w-4 h-4" aria-hidden="true" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-semibold leading-snug">
                              {child.label}
                            </p>
                            {child.description && (
                              <p
                                className={cn(
                                  'text-xs mt-0.5 line-clamp-1 leading-relaxed',
                                  isDarkNav ? 'text-slate-400' : 'text-slate-500'
                                )}
                              >
                                {child.description}
                              </p>
                            )}
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </nav>

        {/* Right Actions: Hotline + Login + CTA + Mobile Toggle */}
        <div className="flex items-center gap-3 shrink-0 whitespace-nowrap">
          <a
            href="tel:19006868"
            className={cn(
              'hidden xl:flex items-center gap-2 text-xs xl:text-sm font-semibold transition-colors rounded-xl px-2.5 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange',
              isDarkNav
                ? 'text-slate-300 hover:text-white'
                : 'text-slate-600 hover:text-brand-navy'
            )}
          >
            <Headset className="h-4 w-4 text-brand-orange shrink-0" aria-hidden="true" />
            <span>1900 6868</span>
          </a>

          <div
            className={cn(
              'h-4 w-px hidden xl:block',
              isDarkNav ? 'bg-slate-800' : 'bg-slate-200'
            )}
          />

          <Link
            to="/login"
            className={cn(
              'hidden md:inline-flex text-xs sm:text-sm font-semibold transition-colors px-3 py-2 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange',
              isDarkNav
                ? 'text-slate-300 hover:text-white hover:bg-white/10'
                : 'text-slate-700 hover:text-brand-navy hover:bg-slate-100'
            )}
          >
            Đăng nhập
          </Link>

          <a
            href={ctaHref}
            className="inline-flex items-center justify-center bg-brand-orange hover:bg-brand-orange-hover text-[#060D1A] text-xs sm:text-sm font-bold px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 cursor-pointer"
          >
            {ctaLabel}
          </a>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className={cn(
              'lg:hidden p-2 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange cursor-pointer',
              isDarkNav
                ? 'text-slate-200 hover:bg-slate-800'
                : 'text-slate-700 hover:bg-slate-100'
            )}
            aria-label={mobileMenuOpen ? 'Đóng menu điều hướng' : 'Mở menu điều hướng'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          role="navigation"
          aria-label="Điều hướng di động"
          className={cn(
            'lg:hidden px-5 py-6 shadow-2xl border-t animate-in slide-in-from-top-2 duration-200 max-h-[85vh] overflow-y-auto',
            isDarkNav
              ? 'bg-[#0B1528] border-slate-800 text-white'
              : 'bg-white border-slate-200 text-slate-800'
          )}
        >
          <div className="space-y-4">
            {navTree.map((item) => {
              if (!isGroup(item)) {
                const isCurrent =
                  item.href === '/'
                    ? isHomeActive
                    : currentPath.startsWith(item.href)

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'block py-2 text-base font-semibold border-b transition-colors',
                      isDarkNav ? 'border-slate-800/80' : 'border-slate-100',
                      isCurrent ? 'text-brand-orange' : 'text-slate-200'
                    )}
                  >
                    {item.label}
                  </Link>
                )
              }

              return (
                <div key={item.id} className="pt-2">
                  <p className="font-mono text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    {item.label}
                  </p>
                  <div className="space-y-1 pl-2 border-l-2 border-slate-700/60">
                    {item.children.map((child) => {
                      const Icon = child.icon
                      const isChildCurrent = currentPath.startsWith(child.href)

                      return (
                        <Link
                          key={child.href}
                          to={child.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            'flex items-center gap-2.5 py-2 px-2 rounded-lg text-sm transition-colors',
                            isChildCurrent
                              ? 'text-brand-orange font-semibold bg-brand-orange/10'
                              : isDarkNav
                                ? 'text-slate-300 hover:text-white'
                                : 'text-slate-700 hover:text-slate-900'
                          )}
                        >
                          <Icon className="w-4 h-4 shrink-0 text-slate-400" />
                          <span>{child.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="pt-6 mt-6 border-t border-slate-800/80 space-y-3">
            <a
              href="tel:19006868"
              className={cn(
                'flex items-center justify-center gap-2 font-semibold text-sm py-2 rounded-xl border',
                isDarkNav
                  ? 'border-slate-700 text-slate-200 bg-slate-800/40'
                  : 'border-slate-200 text-slate-700 bg-slate-50'
              )}
            >
              <PhoneCall className="h-4 w-4 text-brand-orange" aria-hidden="true" />
              <span>Tổng đài: 1900 6868 (24/7)</span>
            </a>

            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                'block text-center py-2.5 rounded-xl border text-sm font-semibold transition-colors',
                isDarkNav
                  ? 'border-slate-700 text-slate-200 hover:bg-slate-800'
                  : 'border-slate-300 text-slate-700 hover:bg-slate-100'
              )}
            >
              Đăng nhập tài khoản
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
