import { ArrowRight, Calculator, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

export interface OwnerHeroSectionProps {
  onOpenLeadModal?: () => void
}

export function OwnerHeroSection({ onOpenLeadModal }: OwnerHeroSectionProps = {}) {
  return (
    <section
      className="relative bg-brand-navy text-white pt-12 pb-24 md:pt-16 md:pb-32 overflow-hidden"
      id="giai-phap-chu-bai"
    >
      {/* Ambient Radial Glows (Orange Accent Only, Zero Greens/Blues/Teals) */}
      <div className="absolute -top-32 right-10 w-[580px] h-[580px] bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[420px] h-[420px] bg-slate-800/40 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Hero Left: Content */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-brand-navy-light/90 border border-[#1E3A5F]">
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-ping" />
              <span className="font-inter text-xs font-semibold tracking-wider text-brand-orange uppercase">
                HẠ TẦNG LOGISTICS SỐ HÓA · DÀNH CHO CHỦ MẶT BẰNG &amp; CẢNG ICD
              </span>
            </div>

            {/* Main Hero Heading */}
            <h1 className="font-sora font-extrabold text-4xl sm:text-5xl lg:text-[56px] text-white leading-[1.14] tracking-tight">
              Chuyển Đổi Số Bến Bãi. <br className="hidden sm:inline" />
              <span className="text-white">Tối Đa Lợi Nhuận </span>
              <span className="text-brand-orange">Từng Mét Vuông Mặt Bằng.</span>
            </h1>

            {/* Body Description */}
            <p className="font-inter text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              Nền tảng số hóa quản trị trạm dừng xe tải nặng &amp; bãi container chuẩn cảng biển: Tự
              động nhận diện biển số ALPR trong 0.18s, thu phí tự động PayOS không tiền mặt và kết
              nối trực tiếp hơn 45,000+ đội xe đang tìm chỗ đỗ.
            </p>

            {/* Dual Button Action Group */}
            <div className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
              {onOpenLeadModal ? (
                <button
                  type="button"
                  onClick={onOpenLeadModal}
                  className="inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-sora font-semibold text-sm sm:text-base px-7 py-4 rounded-xl shadow-lg shadow-brand-orange/20 transition-all hover:scale-[1.02] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                >
                  <span>ĐĂNG KÝ HỢP TÁC BÃI ĐỖ</span>
                  <ArrowRight className="h-5 w-5 text-white" aria-hidden="true" />
                </button>
              ) : (
                <a
                  className="inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-sora font-semibold text-sm sm:text-base px-7 py-4 rounded-xl shadow-lg shadow-brand-orange/20 transition-all hover:scale-[1.02] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
                  href="#onboarding-form"
                >
                  <span>ĐĂNG KÝ HỢP TÁC BÃI ĐỖ</span>
                  <ArrowRight className="h-5 w-5 text-white" aria-hidden="true" />
                </a>
              )}
              <a
                className="inline-flex items-center justify-center gap-2 bg-brand-navy-light/80 hover:bg-slate-800 text-white border border-[#1E3A5F] font-sora font-semibold text-sm sm:text-base px-6 py-4 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                href="#roi-calculator"
              >
                <Calculator className="h-5 w-5 text-brand-orange" aria-hidden="true" />
                <span>TÍNH THỬ DOANH THU BÃI</span>
              </a>
            </div>

            {/* Inbound & Outbound Quick Link to SCR-028 & SCR-011 */}
            <div className="flex items-center gap-4 text-xs font-inter text-slate-400">
              <span>Đã có tài khoản đối tác?</span>
              <Link
                to="/merchant/parking-lots"
                className="text-brand-orange hover:underline font-semibold"
              >
                Vào Cổng Bãi Đỗ &rarr;
              </Link>
            </div>

            {/* Fretrix Social Proof Strip */}
            <div className="pt-6 flex flex-wrap items-center gap-6 border-t border-slate-800/80 w-full mt-2">
              <div className="flex items-center gap-1.5 text-brand-orange">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-brand-orange text-brand-orange"
                    aria-hidden="true"
                  />
                ))}
                <span className="font-sora font-bold text-white text-sm ml-1">4.9 / 5.0</span>
              </div>
              <div className="h-4 w-px bg-slate-800 hidden sm:block" />
              <div className="font-inter text-xs sm:text-sm text-slate-400">
                <strong className="text-white font-semibold">120+ Đối tác mặt bằng</strong> · 0%
                Thất thoát tiền vé gác cổng
              </div>
            </div>
          </div>

          {/* Hero Right: Fretrix Floating Terminal Card */}
          <div className="lg:col-span-5 relative w-full">
            <div className="relative rounded-3xl overflow-hidden bg-brand-navy-light border border-[#1E3A5F] shadow-2xl p-3">
              {/* Terminal Image */}
              <div className="relative w-full h-[380px] sm:h-[440px] rounded-2xl overflow-hidden bg-[#1E293B]">
                <img
                  className="w-full h-full object-cover opacity-85"
                  alt="Modern freight terminal depot with heavy container trucks and AI smart gate barie at twilight"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdYXM3b3nMajbShu6J7fGL8GbD3MnP2lxAnGRszRicvkBL-9DGEB3gaiP5EaH3L7RlpsHS-p1zKrvNfh5HL8-F446b6DJ6m0v9_RmtTaKIjsBNT_aCrTiOt94MFAB3aZiEdIjPk7verEs3lvLS6fCf8hv3ZiH9Wrq0MaEA1tOVlbZN7mb7YnUQyHtyNojQ2b149A-xHjBkeK5BFLnJNkrsGqADyYYdfkgagQCGChVI"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/35 to-transparent" />

                {/* Floating Pill Top Right */}
                <div className="absolute top-4 right-4 bg-brand-navy/90 backdrop-blur-md border border-[#1E3A5F] px-3.5 py-2 rounded-xl flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-orange animate-pulse" />
                  <span className="font-inter text-xs font-semibold text-white">
                    Trạm Cổng AI: Hoạt Động
                  </span>
                </div>

                {/* Mid Floating Badge */}
                <div className="absolute top-4 left-4 bg-brand-navy/90 backdrop-blur-md border border-[#1E3A5F] px-3 py-1.5 rounded-lg flex items-center gap-2">
                  <span className="text-xs font-inter text-slate-300">Cát Lái Hub Node 04</span>
                </div>

                {/* Floating Live Metric Bar Bottom */}
                <div className="absolute bottom-4 inset-x-4 bg-brand-navy/95 backdrop-blur-md border border-[#1E3A5F] p-4 rounded-xl">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-[10px] font-inter uppercase tracking-wider text-slate-400">
                        Công suất bãi
                      </div>
                      <div className="font-sora font-bold text-lg sm:text-xl text-white">
                        88% <span className="text-[11px] font-normal text-slate-400">TẢI</span>
                      </div>
                    </div>
                    <div className="border-x border-slate-800">
                      <div className="text-[10px] font-inter uppercase tracking-wider text-slate-400">
                        Camera ALPR
                      </div>
                      <div className="font-sora font-bold text-lg sm:text-xl text-brand-orange">
                        0.18s <span className="text-[11px] font-normal text-slate-400">SCAN</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-inter uppercase tracking-wider text-slate-400">
                        Tự động PayOS
                      </div>
                      <div className="font-sora font-bold text-lg sm:text-xl text-white">
                        100%{' '}
                        <span className="text-[11px] font-normal text-slate-400">TỰ ĐỘNG</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Partner Logistics Marquee Strip (Đồng bộ SCR-001/SCR-002) */}
        <div className="mt-20 pt-10 border-t border-slate-800/80">
          <p className="font-inter text-xs uppercase tracking-widest text-slate-400 text-center mb-6">
            KẾT NỐI HỆ THỐNG CẢNG BIỂN &amp; HÃNG TÀU HÀNG ĐẦU VIỆT NAM
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-75 grayscale hover:grayscale-0 transition-all">
            <span className="font-sora font-bold text-slate-400 text-lg sm:text-xl tracking-wider">
              TÂN CẢNG SÀI GÒN
            </span>
            <span className="font-sora font-bold text-slate-400 text-lg sm:text-xl tracking-wider">
              CÁT LÁI ICD
            </span>
            <span className="font-sora font-bold text-slate-400 text-lg sm:text-xl tracking-wider">
              CÁI MÉP - THỊ VẢI
            </span>
            <span className="font-sora font-bold text-slate-400 text-lg sm:text-xl tracking-wider">
              ĐÌNH VŨ HẢI PHÒNG
            </span>
            <span className="font-sora font-bold text-slate-400 text-lg sm:text-xl tracking-wider">
              SÓNG THẦN LOGISTICS
            </span>
            <span className="font-sora font-bold text-slate-400 text-lg sm:text-xl tracking-wider">
              TIÊN SƠN ICD
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
