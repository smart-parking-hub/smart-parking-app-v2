import { ArrowRight, ChevronRight, Radio, Scale, Smartphone, Star, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'

export interface DriverHeroSectionProps {
  onOpenLeadModal?: () => void
}

export function DriverHeroSection({ onOpenLeadModal }: DriverHeroSectionProps = {}) {
  const heroImage =
    '/images/landing/terminal-1.webp'

  const partners = [
    'Tân Cảng Sài Gòn',
    'Cái Mép - Thị Vải',
    'Cát Lái ICD',
    'Cảng Đình Vũ',
    'ICD Sóng Thần',
    'Logistics Tiên Sơn',
  ]

  return (
    <section className="w-full bg-[#060D1A] text-white pt-12 pb-20 px-6" id="driver-hero">
      <div className="max-w-[1240px] mx-auto">
        {/* Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left: Content */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <h1 className="font-sora text-[26px] sm:text-4xl lg:text-[50px] font-extrabold tracking-tight text-white mb-6 leading-[1.12]">
              Lộ Trình Chủ Động, <br className="hidden sm:inline" />
              <span className="text-brand-orange">Không Lo Chờ Lốt Bến Bãi</span>
            </h1>
            <p className="font-inter text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl">
              Mạng lưới 320+ cụm bãi đỗ xe container và xe tải nặng toàn quốc phục vụ hơn 45,000 bác tài. Đặt trước ô đỗ, kiểm tra tiện ích trạm dừng và quét mã QR mở barie tự động chỉ trong 30 giây.
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-8 w-full sm:w-auto">
              <Link
                to="/search"
                className="inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-[#060D1A] font-sora font-bold text-base px-7 py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
              >
                <span>TÌM BÃI ĐỖ GẦN NHẤT</span>
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
              {onOpenLeadModal ? (
                <button
                  type="button"
                  onClick={onOpenLeadModal}
                  className="inline-flex items-center justify-center gap-2 bg-[#0B1528] hover:bg-slate-800 text-white border border-slate-700 font-sora font-semibold text-base px-6 py-4 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 cursor-pointer"
                >
                  <Smartphone className="h-5 w-5 text-brand-orange" aria-hidden="true" />
                  <span>TẢI ỨNG DỤNG BÁC TÀI</span>
                </button>
              ) : (
                <a
                  className="inline-flex items-center justify-center gap-2 bg-[#0B1528] hover:bg-slate-800 text-white border border-slate-700 font-sora font-semibold text-base px-6 py-4 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                  href="#tai-app"
                >
                  <Smartphone className="h-5 w-5 text-brand-orange" aria-hidden="true" />
                  <span>TẢI ỨNG DỤNG BÁC TÀI</span>
                </a>
              )}
            </div>

            {/* Rating & Driver Count */}
            <div className="flex flex-wrap items-center gap-3 pt-2 w-full">
              <div className="flex items-center gap-1 text-brand-orange">
                <Star className="h-4 w-4 fill-brand-orange" aria-hidden="true" />
                <Star className="h-4 w-4 fill-brand-orange" aria-hidden="true" />
                <Star className="h-4 w-4 fill-brand-orange" aria-hidden="true" />
                <Star className="h-4 w-4 fill-brand-orange" aria-hidden="true" />
                <Star className="h-4 w-4 fill-brand-orange" aria-hidden="true" />
              </div>
              <span className="font-sora text-sm font-bold text-white">4.9 / 5.0</span>
              <span className="text-slate-300 text-sm font-inter">
                · 2,400+ Đánh giá từ Bác tài Container &amp; Xe tải nặng đường dài
              </span>
            </div>
          </div>

          {/* Hero Right: Interactive Telemetry Card */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-[#0B1528] border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden">
              {/* Terminal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4">
                <div className="flex items-center gap-2.5">
                  <Truck className="h-5 w-5 text-brand-orange" aria-hidden="true" />
                  <span className="font-sora text-base font-bold text-white tracking-wide">Cát Lái Hub Depot #02</span>
                </div>
                <span className="text-xs font-inter font-semibold text-brand-orange bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                  Trực tuyến 24/7
                </span>
              </div>

              {/* Visual Asset */}
              <div className="relative w-full h-56 rounded-xl bg-slate-900 overflow-hidden mb-4">
                <img
                  className="w-full h-full object-cover"
                  alt="Xe container tại bãi đỗ Cát Lái Hub Depot"
                  src={heroImage}
                  fetchPriority="high"
                  loading="eager"
                />

                {/* Pinned Realtime Spot Counter */}
                <div className="absolute bottom-3 left-3 bg-[#060D1A]/95 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-orange animate-pulse"></span>
                  <span className="text-xs font-inter font-semibold text-white">Bãi Cát Lái: 14 ô trống (Loại 40ft)</span>
                </div>
              </div>

              {/* Real-time Indicators Grid */}
              <div className="grid grid-cols-2 gap-3 font-inter">
                <div className="bg-[#060D1A] border border-slate-800/70 p-3.5 rounded-xl flex items-center gap-3">
                  <Radio className="h-5 w-5 text-brand-orange shrink-0" aria-hidden="true" />
                  <div>
                    <div className="text-xs text-slate-400">Barie ALPR</div>
                    <div className="text-sm font-bold text-white">Mở trong 0.2s</div>
                  </div>
                </div>
                <div className="bg-[#060D1A] border border-slate-800/70 p-3.5 rounded-xl flex items-center gap-3">
                  <Scale className="h-5 w-5 text-brand-orange shrink-0" aria-hidden="true" />
                  <div>
                    <div className="text-xs text-slate-400">Trạm cân 120T</div>
                    <div className="text-sm font-bold text-white">Hoạt động 24/7</div>
                  </div>
                </div>
              </div>

              {/* Quick Action in Card */}
              <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-sm font-inter">
                <span className="text-slate-400 text-xs sm:text-sm">Cổng vào: Xa lộ Hà Nội rẽ Nguyễn Thị Định</span>
                {onOpenLeadModal ? (
                  <button
                    type="button"
                    onClick={onOpenLeadModal}
                    className="text-brand-orange hover:text-brand-orange-hover font-semibold flex items-center gap-1 focus-visible:outline-none focus-visible:underline cursor-pointer"
                  >
                    <span>Khóa chỗ ngay</span>
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                ) : (
                  <Link
                    to="/search"
                    className="text-brand-orange hover:text-brand-orange-hover font-semibold flex items-center gap-1 focus-visible:outline-none focus-visible:underline"
                  >
                    <span>Khóa chỗ ngay</span>
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Partner Logistics Strips */}
        <div className="mt-16 pt-10">
          <p className="font-inter text-sm text-slate-400 text-center mb-6">
            Mạng lưới điều phối đậu đỗ kết nối trực tiếp các cụm cảng và trung tâm tiếp vận
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 items-center">
            {partners.map((partner) => (
              <div
                key={partner}
                className="h-14 bg-slate-900/80 border border-slate-800/70 rounded-xl flex items-center justify-center px-4 text-center hover:border-slate-600 transition-colors"
              >
                <span className="font-sora text-sm font-semibold text-slate-300">
                  {partner}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
