import { ArrowRight, FileText, CheckCircle2, Gauge, Lock } from 'lucide-react'

export function ApiHeroSection() {
  return (
    <section className="w-full bg-[#060D1A] text-white py-20 lg:py-28 px-6 lg:px-12 flex justify-center border-b border-[#1E3A5F]">
      <div className="max-w-[1240px] w-full flex flex-col items-center text-center">
        {/* Eyebrow Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F172A] border border-[#1E3A5F] mb-6">
          <span className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse" />
          <span className="font-mono text-xs text-[#F97316] tracking-wider uppercase font-semibold">
            HẠ TẦNG KẾT NỐI MỞ · RESTFUL API &amp; WEBHOOKS V3
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="font-sora font-extrabold text-3xl sm:text-4xl lg:text-5xl max-w-4xl tracking-tight text-white mb-6 leading-tight">
          Tích Hợp API Điều Phối Bãi Đỗ Vào Hệ Thống{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F97316] to-[#EA580C]">
            TMS / ERP
          </span>{' '}
          Của Bạn.
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-[#D7DFE9] max-w-3xl mb-10 leading-relaxed font-normal">
          Kết nối trực tiếp phần mềm quản lý vận tải nội bộ với mạng lưới 320+ bãi đỗ xe toàn quốc. Tự động đặt ô đỗ, cấp vé QR và nhận trạng thái Barie realtime với độ trễ dưới 50ms.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
          <a
            className="inline-flex items-center justify-center gap-2 h-[52px] px-8 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold text-sm sm:text-base rounded transition-colors shadow-sm"
            href="#sandbox-register"
          >
            ĐĂNG KÝ NHẬN API KEY SANDBOX
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
          <a
            className="inline-flex items-center justify-center gap-2 h-[52px] px-8 bg-[#0F172A] hover:bg-[#1E293B] text-white border border-[#1E3A5F] font-semibold text-sm sm:text-base rounded transition-colors"
            href="#swagger-docs"
          >
            <FileText className="w-5 h-5 text-[#F97316]" aria-hidden="true" />
            XEM TÀI LIỆU SWAGGER / OPENAPI 3.0
          </a>
        </div>

        {/* Live Telemetry Badges (Strict Zero-Green, industrial navy/steel/orange) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
          <div className="flex items-center justify-center gap-3 p-3.5 bg-[#0F172A] border border-[#1E3A5F] rounded">
            <CheckCircle2 className="w-5 h-5 text-[#F97316] shrink-0" aria-hidden="true" />
            <div className="text-left">
              <div className="font-mono text-xs text-[#D7DFE9]">ĐỘ SẴN SÀNG</div>
              <div className="text-sm text-white font-semibold">99.98% SLA Uptime</div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 p-3.5 bg-[#0F172A] border border-[#1E3A5F] rounded">
            <Gauge className="w-5 h-5 text-[#F97316] shrink-0" aria-hidden="true" />
            <div className="text-left">
              <div className="font-mono text-xs text-[#D7DFE9]">ĐỘ TRỄ TRUNG BÌNH</div>
              <div className="text-sm text-white font-semibold">38ms Network Latency</div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 p-3.5 bg-[#0F172A] border border-[#1E3A5F] rounded">
            <Lock className="w-5 h-5 text-[#F97316] shrink-0" aria-hidden="true" />
            <div className="text-left">
              <div className="font-mono text-xs text-[#D7DFE9]">CHUẨN BẢO MẬT</div>
              <div className="text-sm text-white font-semibold">OAuth2 / Bearer JWT</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
