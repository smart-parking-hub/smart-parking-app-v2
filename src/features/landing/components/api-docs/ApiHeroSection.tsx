import { ArrowRight, FileText, CheckCircle2, Gauge, Lock } from 'lucide-react'

export function ApiHeroSection() {
  return (
    <section className="w-full bg-brand-navy text-white py-20 lg:py-28 px-6 lg:px-12 flex justify-center border-b border-api-border">
      <div className="max-w-[1240px] w-full flex flex-col items-center text-center">
        {/* Eyebrow Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-navy-light border border-api-border mb-6">
          <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
          <span className="font-mono text-xs text-brand-orange tracking-wider uppercase font-semibold">
            HẠ TẦNG KẾT NỐI MỞ · RESTFUL API &amp; WEBHOOKS V3
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="font-sora font-extrabold text-3xl sm:text-4xl lg:text-5xl max-w-4xl tracking-tight text-white mb-6 leading-tight">
          Tích Hợp API Điều Phối Bãi Đỗ Vào Hệ Thống{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-orange-hover">
            TMS / ERP
          </span>{' '}
          Của Bạn.
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-api-muted max-w-3xl mb-10 leading-relaxed font-normal">
          Kết nối trực tiếp phần mềm quản lý vận tải nội bộ với mạng lưới 320+ bãi đỗ xe toàn quốc. Tự động đặt ô đỗ, cấp vé QR và nhận trạng thái Barie realtime với độ trễ dưới 50ms.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
          <a
            className="inline-flex items-center justify-center gap-2 h-[52px] px-8 bg-brand-orange hover:bg-brand-orange-hover text-brand-navy font-semibold text-sm sm:text-base rounded transition-colors shadow-sm"
            href="#sandbox-register"
          >
            ĐĂNG KÝ NHẬN API KEY SANDBOX
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
          <a
            className="inline-flex items-center justify-center gap-2 h-[52px] px-8 bg-brand-navy-light hover:bg-api-panel text-white border border-api-border font-semibold text-sm sm:text-base rounded transition-colors"
            href="#swagger-docs"
          >
            <FileText className="w-5 h-5 text-brand-orange" aria-hidden="true" />
            XEM TÀI LIỆU SWAGGER / OPENAPI 3.0
          </a>
        </div>

        {/* Live Telemetry Badges (Strict Zero-Green, industrial navy/steel/orange) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
          <div className="flex items-center justify-center gap-3 p-3.5 bg-brand-navy-light border border-api-border rounded">
            <CheckCircle2 className="w-5 h-5 text-brand-orange shrink-0" aria-hidden="true" />
            <div className="text-left">
              <div className="font-mono text-xs text-api-muted">ĐỘ SẴN SÀNG</div>
              <div className="text-sm text-white font-semibold">99.98% SLA Uptime</div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 p-3.5 bg-brand-navy-light border border-api-border rounded">
            <Gauge className="w-5 h-5 text-brand-orange shrink-0" aria-hidden="true" />
            <div className="text-left">
              <div className="font-mono text-xs text-api-muted">ĐỘ TRỄ TRUNG BÌNH</div>
              <div className="text-sm text-white font-semibold">38ms Network Latency</div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 p-3.5 bg-brand-navy-light border border-api-border rounded">
            <Lock className="w-5 h-5 text-brand-orange shrink-0" aria-hidden="true" />
            <div className="text-left">
              <div className="font-mono text-xs text-api-muted">CHUẨN BẢO MẬT</div>
              <div className="text-sm text-white font-semibold">OAuth2 / Bearer JWT</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
