import { ArrowRight, Calculator, Star } from 'lucide-react'

export function OwnerHeroSection() {
  return (
    <section
      className="relative bg-brand-navy text-white pt-8 pb-16 md:pt-12 md:pb-24 overflow-hidden"
      id="giai-phap-chu-bai"
    >
      {/* Ambient Radial Glows */}
      <div className="absolute -top-32 right-10 w-[580px] h-[580px] bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[420px] h-[420px] bg-slate-800/40 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Hero Left: Content */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-5">
            {/* Category / Scope Tag */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300">
              <span className="w-2 h-2 rounded-full bg-brand-orange" />
              <span>HẠ TẦNG LOGISTICS SỐ HÓA · DÀNH CHO CHỦ MẶT BẰNG &amp; CẢNG ICD</span>
            </div>

            {/* Main Hero Heading */}
            <h1 className="font-sora font-extrabold text-xl sm:text-2xl lg:text-3xl text-white tracking-tight leading-snug">
              Chuyển Đổi Số Bến Bãi.{' '}
              <span className="text-brand-orange">Tối Đa Hóa Lợi Nhuận Mặt Bằng.</span>
            </h1>

            {/* Body Description */}
            <p className="font-inter text-base text-slate-300 max-w-xl leading-relaxed">
              Nền tảng số hóa quản trị trạm dừng xe tải nặng &amp; bãi container chuẩn cảng biển: Tự
              động nhận diện biển số ALPR trong 0.18s, thu phí tự động PayOS không tiền mặt và kết
              nối trực tiếp hơn 45,000+ đội xe đang tìm chỗ đỗ.
            </p>

            {/* Dual Button Action Group */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1 w-full sm:w-auto">
              <a
                className="inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-[#060D1A] font-sora font-bold text-sm sm:text-base px-6 py-3.5 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange cursor-pointer"
                href="#onboarding-form"
              >
                <span>ĐĂNG KÝ HỢP TÁC BÃI ĐỖ</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                className="inline-flex items-center justify-center gap-2 bg-[#0B1528] hover:bg-slate-800 text-white border border-slate-700 font-sora font-semibold text-sm sm:text-base px-5 py-3.5 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 cursor-pointer"
                href="#roi-calculator"
              >
                <Calculator className="h-4 w-4 text-brand-orange" aria-hidden="true" />
                <span>TÍNH THỬ DOANH THU BÃI</span>
              </a>
            </div>

            {/* Social Proof Strip */}
            <div className="pt-4 flex flex-wrap items-center gap-5 border-t border-slate-800/80 w-full mt-2">
              <div className="flex items-center gap-1.5 text-brand-orange">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-brand-orange text-brand-orange"
                    aria-hidden="true"
                  />
                ))}
                <span className="font-sora font-bold text-white text-sm ml-1 tabular-nums">
                  4.9 / 5.0
                </span>
              </div>
              <div className="h-4 w-px bg-slate-800 hidden sm:block" />
              <div className="font-inter text-xs sm:text-sm text-slate-400">
                <strong className="text-white font-semibold">120+ Đối tác mặt bằng</strong> · 0%
                Thất thoát tiền vé gác cổng
              </div>
            </div>
          </div>

          {/* Hero Right: Terminal Cockpit Card */}
          <div className="lg:col-span-5 relative w-full">
            <div className="relative rounded-2xl overflow-hidden bg-[#0B1528] border border-slate-800 p-2.5 shadow-md">
              {/* Terminal Image */}
              <div className="relative w-full h-[320px] sm:h-[380px] rounded-xl overflow-hidden bg-slate-900">
                <img
                  className="w-full h-full object-cover opacity-85"
                  alt="Modern freight terminal depot with heavy container trucks and AI smart gate barie at twilight"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdYXM3b3nMajbShu6J7fGL8GbD3MnP2lxAnGRszRicvkBL-9DGEB3gaiP5EaH3L7RlpsHS-p1zKrvNfh5HL8-F446b6DJ6m0v9_RmtTaKIjsBNT_aCrTiOt94MFAB3aZiEdIjPk7verEs3lvLS6fCf8hv3ZiH9Wrq0MaEA1tOVlbZN7mb7YnUQyHtyNojQ2b149A-xHjBkeK5BFLnJNkrsGqADyYYdfkgagQCGChVI"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-slate-950/40 pointer-events-none" />

                {/* Floating Badge Top Right */}
                <div className="absolute top-3.5 right-3.5 bg-brand-navy/95 border border-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-orange" />
                  <span className="font-inter text-xs font-semibold text-white">
                    Trạm Cổng AI: Hoạt Động
                  </span>
                </div>

                {/* Mid Floating Badge */}
                <div className="absolute top-3.5 left-3.5 bg-brand-navy/95 border border-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-2">
                  <span className="text-xs font-inter text-slate-300">Cát Lái Hub Node 04</span>
                </div>

                {/* Floating Live Metric Bar Bottom */}
                <div className="absolute bottom-3.5 inset-x-3.5 bg-brand-navy/95 border border-slate-700 p-3 rounded-xl">
                  <div className="grid grid-cols-3 gap-2 text-center font-inter">
                    <div>
                      <div className="text-xs text-slate-400 mb-0.5">Công suất bãi</div>
                      <div className="font-sora font-bold text-sm sm:text-base text-white tabular-nums">
                        88% <span className="text-xs font-normal text-slate-400">TẢI</span>
                      </div>
                    </div>
                    <div className="border-x border-slate-800">
                      <div className="text-xs text-slate-400 mb-0.5">Camera ALPR</div>
                      <div className="font-sora font-bold text-sm sm:text-base text-brand-orange tabular-nums">
                        0.18s <span className="text-xs font-normal text-slate-400">SCAN</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 mb-0.5">Tự động PayOS</div>
                      <div className="font-sora font-bold text-sm sm:text-base text-white tabular-nums">
                        100%{' '}
                        <span className="text-xs font-normal text-slate-400">TỰ ĐỘNG</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Partner Logistics Strip */}
        <div className="mt-12 pt-6 border-t border-slate-800/80">
          <p className="font-inter text-xs uppercase text-slate-400 text-center mb-4 font-semibold">
            KẾT NỐI HỆ THỐNG CẢNG BIỂN &amp; HÃNG TÀU HÀNG ĐẦU VIỆT NAM
          </p>
          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-10 opacity-80">
            <span className="font-sora font-bold text-slate-400 text-sm sm:text-base">
              TÂN CẢNG SÀI GÒN
            </span>
            <span className="font-sora font-bold text-slate-400 text-sm sm:text-base">
              CÁT LÁI ICD
            </span>
            <span className="font-sora font-bold text-slate-400 text-sm sm:text-base">
              CÁI MÉP - THỊ VẢI
            </span>
            <span className="font-sora font-bold text-slate-400 text-sm sm:text-base">
              ĐÌNH VŨ HẢI PHÒNG
            </span>
            <span className="font-sora font-bold text-slate-400 text-sm sm:text-base">
              SÓNG THẦN LOGISTICS
            </span>
            <span className="font-sora font-bold text-slate-400 text-sm sm:text-base">
              TIÊN SƠN ICD
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
