import { ArrowRight, ChevronRight, Radio, Scale, Smartphone, Star, Truck } from 'lucide-react'

export function DriverHeroSection() {
  const heroImage =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAdYXM3b3nMajbShu6J7fGL8GbD3MnP2lxAnGRszRicvkBL-9DGEB3gaiP5EaH3L7RlpsHS-p1zKrvNfh5HL8-F446b6DJ6m0v9_RmtTaKIjsBNT_aCrTiOt94MFAB3aZiEdIjPk7verEs3lvLS6fCf8hv3ZiH9Wrq0MaEA1tOVlbZN7mb7YnUQyHtyNojQ2b149A-xHjBkeK5BFLnJNkrsGqADyYYdfkgagQCGChVI'

  const partners = [
    'TÂN CẢNG SÀI GÒN',
    'CÁI MÉP - THỊ VẢI',
    'CÁT LÁI ICD',
    'CẢNG ĐÌNH VŨ',
    'ICD SÓNG THẦN',
    'LOGISTICS TIÊN SƠN',
  ]

  return (
    <section className="w-full bg-[#060D1A] text-white pt-12 pb-20 px-6">
      <div className="max-w-[1240px] mx-auto">
        {/* Breadcrumb / Eyebrow pill */}
        <div className="flex items-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0F172A] border border-[#1E3A5F]">
            <span className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse"></span>
            <span className="font-inter text-[12px] font-semibold tracking-wider uppercase text-slate-300">
              Giải Pháp Vận Tải Thực Địa · 45,000+ Bác Tài Toàn Quốc
            </span>
          </div>
        </div>

        {/* Main Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left: Content */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <h1 className="font-sora text-3xl sm:text-4xl lg:text-[46px] lg:leading-[56px] font-bold tracking-tight text-white mb-6">
              Lộ Trình Chủ Động. <br />
              <span className="text-[#F97316]">Không Còn Cảnh Đậu Tràn Lề Đường</span> Chờ Lốt.
            </h1>
            <p className="font-inter text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl">
              Chấm dứt việc chạy lòng vòng tìm chỗ đỗ sau giờ cấm tải hoặc chờ giờ vào cảng. Đặt trước ô đỗ container, kiểm tra tiện ích trạm dừng và quét mã QR mở barie tự động chỉ trong 30 giây.
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-8 w-full sm:w-auto">
              <a
                className="inline-flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-inter font-semibold text-sm px-7 py-3.5 rounded transition-all shadow-md group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316]"
                href="#tim-bai-ngay"
              >
                <span>TÌM BÃI ĐỖ GẦN NHẤT</span>
                <ArrowRight className="h-[18px] w-[18px] transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </a>
              <a
                className="inline-flex items-center justify-center gap-2 bg-[#0F172A] hover:bg-[#1E293B] text-slate-200 border border-[#1E3A5F] font-inter font-semibold text-sm px-6 py-3.5 rounded transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                href="#tai-app"
              >
                <Smartphone className="h-[18px] w-[18px]" aria-hidden="true" />
                <span>TẢI ỨNG DỤNG BÁC TÀI</span>
              </a>
            </div>

            {/* Rating & Driver Count */}
            <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-[#1E3A5F] w-full">
              <div className="flex items-center gap-1 text-[#F97316]">
                <Star className="h-[18px] w-[18px] fill-[#F97316]" aria-hidden="true" />
                <Star className="h-[18px] w-[18px] fill-[#F97316]" aria-hidden="true" />
                <Star className="h-[18px] w-[18px] fill-[#F97316]" aria-hidden="true" />
                <Star className="h-[18px] w-[18px] fill-[#F97316]" aria-hidden="true" />
                <Star className="h-[18px] w-[18px] fill-[#F97316]" aria-hidden="true" />
              </div>
              <span className="font-sora text-sm font-bold text-white">4.9 / 5.0</span>
              <span className="text-slate-400 text-xs sm:text-sm font-inter">
                · 2,400+ Đánh giá từ Bác tài Container &amp; Xe tải nặng đường dài
              </span>
            </div>
          </div>

          {/* Hero Right: Interactive Telemetry Card */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-[#0F172A] border border-[#1E3A5F] rounded-lg p-5 shadow-2xl relative overflow-hidden">
              {/* Terminal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#1E3A5F] mb-4">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-[#F97316]" aria-hidden="true" />
                  <span className="font-sora text-sm font-bold text-white tracking-wide uppercase">Cát Lái Hub Depot #02</span>
                </div>
                <span className="text-[11px] font-inter font-medium uppercase tracking-wider text-[#F97316] bg-[#1E293B] px-2 py-0.5 rounded border border-[#1E3A5F]">
                  Trực tuyến 24/7
                </span>
              </div>

              {/* Visual Asset with Data Scrim */}
              <div className="relative w-full h-56 rounded bg-[#1E293B] overflow-hidden mb-4">
                <img
                  className="w-full h-full object-cover opacity-75"
                  alt="Xe container tại bãi đỗ Cát Lái Hub Depot"
                  src={heroImage}
                  fetchPriority="high"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent"></div>

                {/* Pinned Realtime Spot Counter */}
                <div className="absolute bottom-3 left-3 bg-[#060D1A]/95 border border-[#1E3A5F] px-3 py-1.5 rounded flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#F97316]"></span>
                  <span className="text-xs font-inter font-semibold text-white">Bãi Cát Lái: 14 ô trống (Loại 40ft)</span>
                </div>
              </div>

              {/* Real-time Indicators Grid */}
              <div className="grid grid-cols-2 gap-3 font-inter">
                <div className="bg-[#060D1A] border border-[#1E3A5F] p-3 rounded flex items-center gap-3">
                  <Radio className="h-[22px] w-[22px] text-[#F97316]" aria-hidden="true" />
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400">Barie ALPR</div>
                    <div className="text-xs font-bold text-white">Mở trong 0.2s</div>
                  </div>
                </div>
                <div className="bg-[#060D1A] border border-[#1E3A5F] p-3 rounded flex items-center gap-3">
                  <Scale className="h-[22px] w-[22px] text-[#F97316]" aria-hidden="true" />
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400">Trạm Cân 120T</div>
                    <div className="text-xs font-bold text-white">Hoạt động 24/7</div>
                  </div>
                </div>
              </div>

              {/* Quick Action in Card */}
              <div className="mt-4 pt-3 border-t border-[#1E3A5F] flex items-center justify-between text-xs font-inter">
                <span className="text-slate-400">Cổng vào: Xa lộ Hà Nội rẽ Nguyễn Thị Định</span>
                <a className="text-[#F97316] hover:text-[#EA580C] font-semibold flex items-center gap-1 focus-visible:outline-none focus-visible:underline" href="#dat-cho">
                  <span>Khóa chỗ ngay</span>
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Partner Logistics Strips */}
        <div className="mt-16 pt-10 border-t border-[#1E3A5F]">
          <p className="font-inter text-xs uppercase tracking-widest text-slate-400 text-center mb-6">
            MẠNG LƯỚI ĐIỀU PHỐI ĐẬU ĐỖ KẾT NỐI TRỰC TIẾP CÁC CỤM CẢNG VÀ TRUNG TÂM TIẾP VẬN
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 items-center">
            {partners.map((partner) => (
              <div
                key={partner}
                className="h-12 bg-[#0F172A] border border-[#1E3A5F] rounded flex items-center justify-center px-4 text-center hover:border-slate-500 transition-colors"
              >
                <span className="font-sora text-xs font-bold text-slate-300 tracking-wider">
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
