import { Link } from 'react-router-dom'
import { Phone, ShieldCheck } from 'lucide-react'

export function DriverFooter() {
  return (
    <footer className="w-full bg-[#131b2e] text-[#bec6e0] mt-auto border-t border-[#233144]">
      {/* Top Section */}
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-sora text-lg text-white font-bold tracking-tight">
              SMARTTRUCK HUB
            </span>
            <span className="bg-[#233144] text-[#bec6e0] px-2 py-0.5 rounded text-xs font-mono uppercase border border-white/5">
              V2.8.4-OPS
            </span>
          </div>
          <p className="text-xs text-[#7c839b] max-w-lg">
            Cổng điều phối bến bãi &amp; quản lý chuyến cho lái xe container thương mại toàn quốc.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#233144] rounded text-[#eaf1ff] border border-white/5 font-mono">
            <ShieldCheck className="w-4 h-4 text-[#bec6e0]" />
            <span className="font-semibold">ISO/IEC 27001:2022</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#233144] rounded border border-white/5">
            <Phone className="w-4 h-4 text-[#d95f00]" />
            <a
              href="tel:19006868"
              className="text-white font-bold font-mono hover:text-[#d95f00] transition-colors"
            >
              1900 6868
            </a>
            <span className="text-[#7c839b]">(Hỗ trợ 24/7)</span>
          </div>
        </div>
      </div>

      {/* Sub-footer bottom bar */}
      <div className="bg-[#233144] py-3 border-t border-white/5">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#7c839b]">
          <p>© 2025 SmartTruckHub Logistics Network. Toàn bộ quyền được bảo lưu.</p>
          <div className="flex items-center gap-4">
            <Link to="/profile" className="hover:text-white transition-colors">
              Tài khoản
            </Link>
            <Link to="/change-password" className="hover:text-white transition-colors">
              Đổi mật khẩu
            </Link>
            <a
              href="#terms"
              className="hover:text-white transition-colors"
              onClick={(e) => {
                e.preventDefault()
              }}
            >
              Điều khoản dịch vụ
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
