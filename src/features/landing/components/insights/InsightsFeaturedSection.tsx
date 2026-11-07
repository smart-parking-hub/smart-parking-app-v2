import { Clock, ArrowRight, MapPin } from 'lucide-react'

export function InsightsFeaturedSection() {
  return (
    <section className="w-full bg-white py-12 border-b border-[#E2E8F0]">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="relative overflow-hidden rounded-2xl bg-[#060D1A] text-white shadow-xl border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
            {/* Editorial Text Content */}
            <div className="lg:col-span-7 p-8 md:p-12 lg:p-14 flex flex-col justify-between z-10">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="px-3 py-1 bg-[#d95f00] text-white text-xs rounded tracking-wider uppercase font-semibold">
                    BÁO CÁO THỰC THẦU · THÁNG 10/2026
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-300">
                    <Clock className="w-4 h-4 text-[#d95f00]" />
                    Thời gian đọc: 6 phút
                  </span>
                  <span className="font-mono text-xs text-slate-400">• Mã: REP-2026-X04</span>
                </div>

                <h2 className="font-sora font-bold text-2xl lg:text-3xl text-white tracking-tight mb-5 leading-snug">
                  Chi Phí Ẩn Của Việc Đậu Xe Ven Quốc Lộ: Phân Tích Thiệt Hại 180 Triệu/Năm Của Đội Xe 20 Đầu Kéo.
                </h2>

                <p className="font-inter text-sm md:text-base text-slate-300 leading-relaxed mb-8 max-w-2xl">
                  Nghiên cứu thực tế trên 1,200 chuyến xe container tuyến Bắc - Nam chỉ ra rằng chi phí hao hụt nhiên liệu nổ máy chờ bãi, phạt dừng đỗ và mất cắp phụ tùng cao gấp 4.2 lần so với việc trả phí lưu bãi tại các trạm dừng chuẩn hóa.
                </p>

                {/* Metric micro-strip */}
                <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800 mb-8 max-w-xl">
                  <div>
                    <div className="font-mono text-xs text-slate-400 uppercase">LÃNG PHÍ MÁY LẠNH</div>
                    <div className="font-sora font-bold text-xl text-[#d95f00] mt-1">3.8 L/giờ</div>
                  </div>
                  <div>
                    <div className="font-mono text-xs text-slate-400 uppercase">RỦI RO THIỆT HẠI</div>
                    <div className="font-sora font-bold text-xl text-white mt-1">180 tr/năm</div>
                  </div>
                  <div>
                    <div className="font-mono text-xs text-slate-400 uppercase">TỶ LỆ LÃNG PHÍ</div>
                    <div className="font-sora font-bold text-xl text-[#d95f00] mt-1">4.2x</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#doc-ban-phan-tich"
                  className="inline-flex items-center gap-3 px-6 py-3.5 rounded-lg bg-[#d95f00] hover:bg-[#b84e00] text-white font-sora text-xs font-bold transition-transform active:scale-95 shadow-md"
                >
                  <span>ĐỌC BẢN PHÂN TÍCH ĐẦY ĐỦ</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <span className="font-mono text-xs text-slate-400 hidden sm:inline-block">
                  Tài liệu đã xác thực ALPR Database
                </span>
              </div>
            </div>

            {/* Feature Image with Industrial Treatment */}
            <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyiWBsfq_9lVKZGlWLKiRIJA7MP_ra1Za5dqa2Zgcr885fsB5szmIJB1-gPZaD-5SyFcRYxcW1nbpK512OwO73_w0h03xLWQ8Ub9fnpUXgP2cKdEdEp5MTQxOlf46gYuaBUuM1LJbDeggqN6NQ3pMN-ytAshwSXEyvZosz-KbGiQsJb1AeZeLzSqKr4332zgHezrfS1Nl1ImifxVA2VBReiraINXABl4HeSRzCqheZ"
                alt="Dàn xe đầu kéo container xếp hàng chuẩn bị bốc dỡ tại bãi cảng Cát Lái buổi hoàng hôn rực rỡ"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060D1A] via-[#060D1A]/30 to-transparent lg:bg-gradient-to-r lg:from-[#060D1A] lg:via-transparent lg:to-transparent"></div>
              <div className="absolute bottom-6 right-6 p-3 rounded-lg bg-[#060D1A]/90 backdrop-blur-md border border-slate-700">
                <span className="font-mono text-xs text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#d95f00]" />
                  Bãi Đình Vũ, Hải Phòng · Báo Cáo Khảo Sát
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
