import { Link } from 'react-router-dom'
import { Truck, PlusCircle, Search, PhoneCall } from 'lucide-react'

interface DashboardEmptyStateProps {
  driverName?: string
}

export function DashboardEmptyState({ driverName }: DashboardEmptyStateProps) {
  const displayTitle =
    driverName && driverName.trim() !== '' && driverName !== 'Tài xế'
      ? `Bác Tài ${driverName} Chưa Có Hoạt Động Điều Phối Nào`
      : 'Bác Tài Chưa Có Hoạt Động Điều Phối Nào'

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-8 lg:p-12 text-center shadow-sm mb-6">
      <div className="max-w-xl mx-auto flex flex-col items-center">
        {/* Animated Empty Illustration */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-[#eff4ff] flex items-center justify-center text-[#455f87] mx-auto shadow-inner">
            <Truck className="w-12 h-12 text-[#131b2e]" />
          </div>
          <span className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#d95f00] text-white flex items-center justify-center font-bold text-xs shadow-md">
            0
          </span>
        </div>

        <h3 className="font-sora text-xl lg:text-2xl font-bold text-[#0d1c2e] mb-2">
          {displayTitle}
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
            <span>Đăng Ký Xe Đầu Tiên</span>
          </Link>
          <Link
            to="/parking"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#e6eeff] hover:bg-[#dce9ff] text-[#0d1c2e] font-semibold text-sm transition-colors border border-blue-200 cursor-pointer"
          >
            <Search className="w-5 h-5 text-blue-600" />
            <span>Tìm Bãi Đỗ Xe & Bảng Giá</span>
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
