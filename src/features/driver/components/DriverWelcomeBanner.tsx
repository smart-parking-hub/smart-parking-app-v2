import { Link } from 'react-router-dom'
import { ArrowRight, ListPlus, Activity } from 'lucide-react'

interface DriverWelcomeBannerProps {
  driverName: string
  driverPhone: string
}

export function DriverWelcomeBanner({
  driverName,
  driverPhone,
}: DriverWelcomeBannerProps) {
  return (
    <section className="relative w-full bg-[#131b2e] text-white rounded-2xl overflow-hidden shadow-xl mb-6 p-6 lg:p-9 border border-[#233144]">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#131b2e] via-[#233144] to-[#131b2e] opacity-95" />
      <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-[#d95f00]/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-col max-w-3xl">
          {/* Status chips */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#233144] text-[#ffdbca] text-xs font-mono uppercase tracking-wider font-semibold border border-white/5">
              <span className="w-2 h-2 rounded-full bg-[#d95f00] animate-pulse" />
              HẠ TẦNG ĐIỀU PHỐI ĐIỂM ĐỖ THÔNG MINH · CẬP NHẬT THỜI GIAN THỰC
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#dce9ff] text-[#001c3b] text-xs font-medium">
              <Activity className="w-3.5 h-3.5 text-[#001c3b]" />
              TÌNH TRẠNG LƯU THÔNG: ỔN ĐỊNH TẠI CÁT LÁI &amp; ĐÌNH VŨ
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-sora text-2xl lg:text-3xl text-white tracking-tight font-bold mb-2">
            Xin Chào, Bác Tài {driverName}{' '}
            {driverPhone ? (
              <span className="font-mono text-base lg:text-lg text-[#bec6e0] font-normal">
                ({driverPhone})
              </span>
            ) : null}
          </h1>

          <p className="text-sm lg:text-base text-[#bec6e0] leading-relaxed">
            Điều phối hành trình xe container, kiểm tra 320+ cụm bãi đỗ an toàn trên các tuyến vành
            đai và cao tốc Bắc - Nam.
          </p>
        </div>

        {/* CTA Actions */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
          <Link
            to="/parking"
            className="inline-flex items-center justify-center gap-2 h-[52px] px-6 rounded-xl bg-[#d95f00] hover:bg-[#b85000] text-white font-semibold text-sm transition-all active:scale-[0.99] shadow-lg shadow-[#d95f00]/25 cursor-pointer"
          >
            <span>TÌM BÃI ĐỖ GẦN NHẤT</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/queues"
            className="inline-flex items-center justify-center gap-2 h-[52px] px-6 rounded-xl bg-[#233144] hover:bg-[#2d3e56] text-[#eaf1ff] font-semibold text-sm transition-colors border border-white/10"
          >
            <ListPlus className="w-4 h-4" />
            <span>XẾP HÀNG ẢO</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
