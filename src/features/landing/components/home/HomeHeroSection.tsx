import { ArrowRight, SlidersHorizontal, Star, StarHalf } from 'lucide-react'

export function HomeHeroSection() {
  const heroImage =
    '/images/landing/terminal-1.webp'

  const partners = [
    'TÂN CẢNG SÀI GÒN',
    'CÁT LÁI ICD',
    'CÁI MÉP - THỊ VẢI',
    'ĐÌNH VŨ HẢI PHÒNG',
    'SÓNG THẦN LOGISTICS',
    'TIÊN SƠN ICD',
  ]

  return (
    <section className="relative bg-brand-navy overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28">
      <div className="max-w-[1240px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-7">
            {/* Main Hero Heading */}
            <h1 className="font-sora font-extrabold text-4xl sm:text-5xl lg:text-[48px] xl:text-[52px] text-white leading-[1.12] tracking-tight">
              Mạng Lưới Bãi Đỗ Xe Tải <br className="hidden sm:inline" />
              <span className="text-brand-orange">Toàn Quốc</span>
            </h1>

            {/* Body Description */}
            <p className="font-inter text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              Nền tảng số hóa quản lý và điều phối phương tiện bãi container, kho bãi ICD và trạm dừng xe tải toàn quốc. Tối ưu thời gian chờ, kết nối barie tự động và bảo hiểm minh bạch.
            </p>

            {/* Dual Button Action Group */}
            <div className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
              <a
                className="inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-[#060D1A] font-sora font-bold text-base px-7 py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                href="#tim-bai"
              >
                <span>ĐẶT CHỖ BÃI XE NGAY</span>
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                className="inline-flex items-center justify-center gap-2 bg-[#0B1528] hover:bg-slate-800 text-white border border-slate-700 font-sora font-semibold text-base px-6 py-4 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                href="#giai-phap-chu-bai"
              >
                <SlidersHorizontal className="h-5 w-5 text-brand-orange" aria-hidden="true" />
                <span>ĐIỀU PHỐI CHUỖI CUNG ỨNG</span>
              </a>
            </div>

            {/* Social Proof Strip */}
            <div className="pt-6 flex flex-wrap items-center gap-6 w-full mt-4">
              <div className="flex items-center gap-1.5 text-brand-orange" aria-label="Đánh giá 4.9 trên 5 sao">
                <Star className="h-5 w-5 fill-brand-orange text-brand-orange" aria-hidden="true" />
                <Star className="h-5 w-5 fill-brand-orange text-brand-orange" aria-hidden="true" />
                <Star className="h-5 w-5 fill-brand-orange text-brand-orange" aria-hidden="true" />
                <Star className="h-5 w-5 fill-brand-orange text-brand-orange" aria-hidden="true" />
                <StarHalf className="h-5 w-5 fill-brand-orange text-brand-orange" aria-hidden="true" />
                <span className="font-sora font-bold text-white text-base ml-1.5">4.9 / 5.0</span>
              </div>
              <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>
              <div className="font-inter text-sm sm:text-base text-slate-300">
                <strong className="text-white font-semibold">2,400+ Đánh giá</strong> · 45,000+ Bác tài &amp; Đội xe vận hành hằng ngày
              </div>
            </div>
          </div>

          {/* Right Column: Terminal Visual Card */}
          <div className="lg:col-span-5 relative w-full">
            <div className="relative rounded-2xl overflow-hidden bg-brand-navy-light p-2">
              <div className="relative w-full h-[400px] sm:h-[460px] lg:h-[480px] rounded-xl overflow-hidden">
                <img
                  width={960}
                  height={640}
                  decoding="async"
                  className="w-full h-full object-cover"
                  alt="Xe đầu kéo container tại bãi đỗ logistics ban đêm trang bị công nghệ barie tự động"
                  src={heroImage}
                  fetchPriority="high"
                  loading="eager"
                />

                {/* Floating Status Badge Top Right */}
                <div className="absolute top-4 right-4 bg-[#060D1A]/90 backdrop-blur-md px-3.5 py-1.5 rounded-lg flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-orange animate-pulse"></span>
                  <span className="font-inter text-sm font-semibold text-white">Barie ALPR: Sẵn sàng</span>
                </div>

                {/* Live Metric Bar Bottom */}
                <div className="absolute bottom-4 inset-x-4 bg-[#060D1A]/95 backdrop-blur-md p-4 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-sm font-inter text-slate-300">Tỷ lệ mở tự động</div>
                    <div className="font-sora font-bold text-xl sm:text-2xl text-white">
                      99.4% <span className="text-sm font-normal text-slate-400">(&lt; 0.2s)</span>
                    </div>
                  </div>
                  <div className="h-8 w-px bg-slate-800"></div>
                  <div>
                    <div className="text-sm font-inter text-slate-300">Điểm bãi kết nối</div>
                    <div className="font-sora font-bold text-xl sm:text-2xl text-brand-orange">
                      320+ <span className="text-sm font-normal text-slate-400">Cụm ICD</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Partner Logistics Marquee Strip */}
        <div className="mt-20 pt-10">
          <p className="font-inter text-sm text-slate-400 text-center mb-6">
            Kết nối hệ thống cảng biển &amp; hãng tàu hàng đầu Việt Nam
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-80">
            {partners.map((partner) => (
              <span key={partner} className="font-sora font-bold text-slate-300 text-base sm:text-lg tracking-wider">
                {partner}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
