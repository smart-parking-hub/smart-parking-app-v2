import { ArrowRight } from 'lucide-react'

export function AboutHeroSection() {
  const stats = [
    {
      metric: '320+',
      label: 'Cụm bãi số hóa',
      description: 'Phủ sóng 28 tỉnh thành và cửa ngõ cảng biển',
    },
    {
      metric: '45,000+',
      label: 'Bác tài & Đội xe',
      description: 'Chủ động giữ chỗ và check-in tự động qua app',
    },
    {
      metric: '18%',
      label: 'Tiết kiệm nhiên liệu',
      description: 'Cắt giảm hành trình chạy rỗng tìm điểm đậu',
    },
    {
      metric: '0 vụ',
      label: 'Thất thoát hàng hóa',
      description: 'Tại các cụm bãi chuẩn hóa an ninh Fretrix',
    },
  ]

  return (
    <section className="w-full bg-[#060D1A] text-white py-20 lg:py-28 px-6 lg:px-12 flex justify-center border-b border-slate-800">
      <div className="max-w-[1240px] w-full flex flex-col items-start">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded bg-slate-900 border border-slate-700 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#F97316] motion-safe:animate-pulse" />
          <span className="font-mono text-xs text-slate-200 uppercase tracking-wider font-semibold">
            SỨ MỆNH SỐ HÓA HẠ TẦNG LOGISTICS · KHỞI TẠO NĂM 2024
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="font-sora font-extrabold text-3xl sm:text-4xl lg:text-5xl max-w-4xl text-white tracking-tight mb-8 leading-tight">
          Chúng Tôi Xây Dựng Hạ Tầng Điểm Đỗ Cho Mọi{' '}
          <span className="text-[#F97316]">Bánh Xe Container Lăn Bánh.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed mb-10 font-normal">
          Xuất phát từ nỗi trăn trở của hàng vạn bác tài xe tải đường dài phải thức trắng đêm tìm chỗ đậu ven quốc lộ, đối mặt nguy cơ trộm dầu và kẹt cảng. SmartTruck Hub ra đời để kết nối mạng lưới bãi đỗ với công nghệ điều phối thời gian thực.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center gap-4 mb-20">
          <a
            className="inline-flex items-center justify-center h-[52px] px-8 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold text-sm sm:text-base rounded transition-colors shadow-sm gap-2"
            href="/company/contact"
          >
            GIA NHẬP MẠNG LƯỚI BÃI ĐỖ
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
          <a
            className="inline-flex items-center justify-center h-[52px] px-8 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm sm:text-base rounded border border-slate-700 transition-colors"
            href="#bao-cao" aria-label="Xem báo cáo tác động: số liệu mạng lưới"
          >
            XEM BÁO CÁO TÁC ĐỘNG
          </a>
        </div>

        {/* 4 Stats Grid */}
        <div id="bao-cao" tabIndex={-1} className="scroll-mt-28 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-12 border-t border-slate-800">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className="flex flex-col bg-white p-6 rounded border border-[#E2E8F0] shadow-sm text-slate-800"
            >
              <div className="flex items-baseline gap-1 mb-2">
                <span className="font-sora text-3xl font-bold text-[#F97316]">
                  {s.metric}
                </span>
              </div>
              <p className="font-mono text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold">
                {s.label}
              </p>
              <span className="text-sm text-slate-700 font-normal leading-relaxed">
                {s.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
