import { Link } from 'react-router-dom'
import { ArrowRight, ListPlus, Activity } from 'lucide-react'

interface DriverWelcomeBannerProps {
  driverName: string
  driverPhone?: string
}

export function DriverWelcomeBanner({
  driverName,
}: DriverWelcomeBannerProps) {
  return (
    <section className="relative w-full text-white rounded-2xl overflow-hidden shadow-xl mb-6 p-6 lg:p-8 border border-slate-700/60 bg-slate-900">
      {/* Background Container Terminal Photography (Theme: Freight & Logistics Yard) */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 scale-105"
        style={{
          backgroundImage: `url('/images/hero-container-port.jpg'), url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2000&q=85')`,
        }}
      />

      {/* Atmospheric Dark Gradient Overlay to ensure crisp contrast & readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-900/65" />
      <div className="absolute inset-0 bg-black/25" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-col max-w-3xl">
          {/* Status chips */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-900/80 text-[#ffdbca] text-xs font-mono uppercase tracking-wider font-semibold border border-white/10 backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-[#d95f00] animate-pulse" />
              HẠ TẦNG ĐIỀU PHỐI ĐIỂM ĐỖ THÔNG MINH · CẬP NHẬT THỜI GIAN THỰC
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#dce9ff]/90 text-[#001c3b] text-xs font-medium backdrop-blur-xs">
              <Activity className="w-3.5 h-3.5 text-[#001c3b]" />
              TÌNH TRẠNG LƯU THÔNG: ỔN ĐỊNH TẠI CÁT LÁI &amp; ĐÌNH VŨ
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-sora text-2xl lg:text-3xl text-white tracking-tight font-bold mb-2 drop-shadow-xs">
            <span className="block text-white/90">Xin Chào,</span>
            <span className="block mt-1">Bác Tài {driverName}</span>
          </h1>

          <p className="text-sm lg:text-base text-slate-200 leading-relaxed drop-shadow-xs">
            Điều phối hành trình xe container, kiểm tra 320+ cụm bãi đỗ an toàn trên các tuyến vành
            đai và cao tốc Bắc - Nam.
          </p>
        </div>

        {/* CTA Actions: Vertically stacked and equal size */}
        <div className="flex flex-col gap-3 shrink-0 w-full sm:w-[240px]">
          <Link
            to="/parking"
            className="w-full inline-flex items-center justify-center gap-2 h-[48px] px-5 rounded-xl bg-[#d95f00] hover:bg-[#b85000] text-white font-semibold text-sm transition-all active:scale-[0.99] shadow-lg shadow-[#d95f00]/30 cursor-pointer text-center"
          >
            <span>TÌM BÃI ĐỖ GẦN NHẤT</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/queues"
            className="w-full inline-flex items-center justify-center gap-2 h-[48px] px-5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 text-[#eaf1ff] font-semibold text-sm transition-colors border border-white/20 backdrop-blur-xs text-center"
          >
            <ListPlus className="w-4 h-4" />
            <span>ĐỢI SLOT</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
