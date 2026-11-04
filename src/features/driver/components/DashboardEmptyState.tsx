import { Link } from 'react-router-dom'
import { Truck, Search, PlusCircle, ShieldCheck, PhoneCall } from 'lucide-react'

interface DashboardEmptyStateProps {
  driverName?: string
}

export function DashboardEmptyState({ driverName = 'Bác tài' }: DashboardEmptyStateProps) {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden my-6">
      {/* Top Banner Notice */}
      <div className="p-6 lg:p-8 bg-gradient-to-r from-[#131b2e] to-[#233144] text-white">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#233144] text-[#ffdbca] text-xs font-mono uppercase tracking-wider font-semibold border border-white/10">
            HỆ THỐNG ĐIỀU PHỐI ĐIỂM ĐỖ
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-500/20 text-emerald-300 text-xs font-medium border border-emerald-400/20">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            TÀI KHOẢN ĐÃ SẴN SÀNG HOẠT ĐỘNG
          </span>
        </div>
        <h2 className="font-sora text-2xl lg:text-3xl font-bold tracking-tight">
          Chào Mừng {driverName} Đến Với SmartTruckHub!
        </h2>
        <p className="text-sm lg:text-base text-[#bec6e0] mt-2 max-w-2xl leading-relaxed">
          Tài khoản của bạn hiện chưa có dữ liệu phương tiện hoặc phiên đỗ xe nào. Hãy bắt đầu bằng cách thêm xe vào đội hoặc đặt chỗ bãi cảng gần nhất.
        </p>
      </div>

      {/* Main Empty State Content */}
      <div className="p-8 lg:p-12 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-2xl bg-[#eff4ff] text-[#131b2e] flex items-center justify-center mb-4 shadow-sm border border-blue-100">
          <Truck className="w-10 h-10 text-blue-600" />
        </div>

        <h3 className="font-sora text-xl lg:text-2xl font-bold text-[#0d1c2e] mb-2">
          Chưa Có Hoạt Động Điều Phối Nào
        </h3>
        <p className="text-sm text-[#45464d] max-w-lg mb-8 leading-relaxed">
          Hệ thống sẵn sàng hỗ trợ bạn theo dõi vị trí bãi đỗ, quản lý số đăng kiểm rơ-moóc, kiểm tra tĩnh không cầu vượt và xuất hóa đơn điện tử tự động.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/vehicles"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#d95f00] hover:bg-[#b85000] text-white font-semibold text-sm transition-all shadow-md active:scale-[0.99] cursor-pointer"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Đăng Ký Xe Đầu Tiên (SCR-020)</span>
          </Link>
          <Link
            to="/parking"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#e6eeff] hover:bg-[#dce9ff] text-[#0d1c2e] font-semibold text-sm transition-colors border border-blue-200 cursor-pointer"
          >
            <Search className="w-5 h-5 text-blue-600" />
            <span>Tìm Bãi Đỗ Xe & Bảng Giá (SCR-015)</span>
          </Link>
        </div>

        {/* Quick Help Footer */}
        <div className="mt-12 pt-6 border-t border-slate-100 w-full flex flex-wrap items-center justify-center gap-6 text-xs text-[#76777d]">
          <span className="flex items-center gap-1.5">
            <PhoneCall className="w-4 h-4 text-[#d95f00]" />
            Hotline điều phối trực ban 24/7: <strong className="text-[#0d1c2e]">1900 6868</strong>
          </span>
          <span>·</span>
          <span>Hỗ trợ kết nối API bến cảng Cát Lái, Sóng Thần, Đình Vũ</span>
        </div>
      </div>
    </div>
  )
}
