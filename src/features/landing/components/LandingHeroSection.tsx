import { ArrowRight, SlidersHorizontal, Star, StarHalf } from 'lucide-react'

export function LandingHeroSection() {
  const heroImage =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA4ig97Cnuonq7Ww5GfB1GaBLig34jDUJzG2pLI21FDH47vqUk8ecTZwu6yfDDsu1ZZqkJrYKLysKr6BIEIbSE8CUsPu5RiYj9_S5kYW-leMZGAFNKkw_GEklWj-EmFSQZ96Udu32sEa1KUSlsupNA1ngpRuCcFEzkHahc-ECwx2D_NIbw_1YOMHUKPqQHWHHLDPIj1mBAgfbLvW66ZaAnF9RoxHpc8bKgC621qKWo0'

  const partners = [
    'TÂN CẢNG SÀI GÒN',
    'CÁT LÁI ICD',
    'CÁI MÉP - THỊ VẢI',
    'ĐÌNH VŨ HẢI PHÒNG',
    'SÓNG THẦN LOGISTICS',
    'TIÊN SƠN ICD',
  ]

  return (
    <section className="relative bg-brand-navy overflow-hidden pt-12 pb-24 md:pt-16 md:pb-32">
      {/* Ambient Radial Glows */}
      <div className="absolute -top-32 right-10 w-[580px] h-[580px] bg-brand-orange/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-[420px] h-[420px] bg-slate-800/40 rounded-full blur-2xl pointer-events-none"></div>

      <div className="max-w-[1240px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-navy-light/90 border border-slate-700/80">
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-ping"></span>
              <span className="font-inter text-xs font-semibold tracking-wider text-brand-orange uppercase">
                HẠ TẦNG LOGISTICS SỐ HÓA · 320+ CỤM BÃI
              </span>
            </div>

            {/* Main Hero Heading */}
            <h1 className="font-sora font-extrabold text-4xl sm:text-5xl lg:text-[58px] text-white leading-[1.12] tracking-tight">
              Sự Kết Tinh Giữa <br className="hidden sm:inline" />
              <span className="text-white">Công Nghệ Và </span>
              <span className="text-brand-orange">Bãi Đỗ Xe Tải</span>
            </h1>

            {/* Body Description */}
            <p className="font-inter text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              Nền tảng số hóa quản lý và điều phối phương tiện bãi container, kho bãi ICD và trạm dừng xe tải toàn quốc. Tối ưu thời gian chờ, kết nối barie tự động và bảo hiểm minh bạch.
            </p>

            {/* Dual Button Action Group */}
            <div className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
              <a
                className="inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-sora font-semibold text-sm sm:text-base px-7 py-4 rounded-xl shadow-lg shadow-brand-orange/20 transition-all hover:scale-[1.02] active:scale-[0.99]"
                href="#tim-bai"
              >
                <span>ĐẶT CHỖ BÃI XE NGAY</span>
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                className="inline-flex items-center justify-center gap-2 bg-brand-navy-light/80 hover:bg-slate-800 text-white border border-slate-700 font-sora font-semibold text-sm sm:text-base px-6 py-4 rounded-xl transition-all"
                href="#giai-phap-chu-bai"
              >
                <SlidersHorizontal className="h-5 w-5 text-slate-400" aria-hidden="true" />
                <span>ĐIỀU PHỐI CHUỖI CUNG ỨNG</span>
              </a>
            </div>

            {/* Social Proof Strip */}
            <div className="pt-6 flex flex-wrap items-center gap-6 border-t border-slate-800/80 w-full mt-4">
              <div className="flex items-center gap-1 text-brand-orange">
                <Star className="h-5 w-5 fill-brand-orange text-brand-orange" aria-hidden="true" />
                <Star className="h-5 w-5 fill-brand-orange text-brand-orange" aria-hidden="true" />
                <Star className="h-5 w-5 fill-brand-orange text-brand-orange" aria-hidden="true" />
                <Star className="h-5 w-5 fill-brand-orange text-brand-orange" aria-hidden="true" />
                <StarHalf className="h-5 w-5 fill-brand-orange text-brand-orange" aria-hidden="true" />
                <span className="font-sora font-bold text-white text-sm ml-1">4.9 / 5.0</span>
              </div>
              <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>
              <div className="font-inter text-xs sm:text-sm text-slate-400">
                <strong className="text-white font-semibold">2,400+ Đánh giá</strong> · 45,000+ Bác tài &amp; Đội xe vận hành hằng ngày
              </div>
            </div>
          </div>

          {/* Right Column: Fretrix Floating Terminal Card */}
          <div className="lg:col-span-5 relative w-full">
            <div className="relative rounded-3xl overflow-hidden bg-brand-navy-light border border-slate-700/80 shadow-2xl p-3">
              <div className="relative w-full h-[380px] sm:h-[440px] rounded-2xl overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  alt="Xe container tại bãi đỗ logistics thông minh ban đêm"
                  src={heroImage}
                  fetchPriority="high"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/30 to-transparent"></div>

                {/* Floating Pill Top Right */}
                <div className="absolute top-4 right-4 bg-brand-navy/90 backdrop-blur-md border border-slate-700 px-3.5 py-2 rounded-xl flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-orange animate-pulse"></span>
                  <span className="font-inter text-xs font-semibold text-white">Barie ALPR: Sẵn sàng</span>
                </div>

                {/* Floating Live Metric Bar Bottom */}
                <div className="absolute bottom-4 inset-x-4 bg-brand-navy/95 backdrop-blur-md border border-slate-700 p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-inter uppercase tracking-wider text-slate-400">Tỷ lệ mở tự động</div>
                    <div className="font-sora font-bold text-xl sm:text-2xl text-white">
                      99.4% <span className="text-xs font-normal text-slate-400">(&lt; 0.2s)</span>
                    </div>
                  </div>
                  <div className="h-8 w-px bg-slate-800"></div>
                  <div>
                    <div className="text-[11px] font-inter uppercase tracking-wider text-slate-400">Điểm bãi kết nối</div>
                    <div className="font-sora font-bold text-xl sm:text-2xl text-brand-orange">
                      320+ <span className="text-xs font-normal text-slate-400">Cụm ICD</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Partner Logistics Marquee Strip */}
        <div className="mt-20 pt-10 border-t border-slate-800/80">
          <p className="font-inter text-xs uppercase tracking-widest text-slate-400 text-center mb-6">
            KẾT NỐI HỆ THỐNG CẢNG BIỂN &amp; HÃNG TÀU HÀNG ĐẦU VIỆT NAM
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-75 grayscale hover:grayscale-0 transition-all">
            {partners.map((partner) => (
              <span key={partner} className="font-sora font-bold text-slate-400 text-lg sm:text-xl tracking-wider">
                {partner}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
