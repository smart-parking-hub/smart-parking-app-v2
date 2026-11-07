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
    <div className="w-full bg-white rounded-xl border border-slate-200 p-8 lg:p-12 text-center mb-6">
      <div className="max-w-xl mx-auto flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 mx-auto mb-4">
          <Truck className="w-8 h-8 text-slate-700" />
        </div>

        <h3 className="font-sora text-lg lg:text-xl font-bold text-slate-900 mb-2">
          {displayTitle}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mb-6 leading-relaxed">
          Hệ thống sẵn sàng hỗ trợ bạn theo dõi vị trí bãi đỗ, quản lý số đăng kiểm rơ-moóc, kiểm tra tĩnh không cầu vượt và xuất hóa đơn điện tử tự động.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/vehicles"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-primary hover:bg-brand-primary-hover text-white font-medium text-xs sm:text-sm transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Đăng Ký Xe Đầu Tiên</span>
          </Link>
          <Link
            to="/parking"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 font-medium text-xs sm:text-sm transition-colors border border-slate-200 cursor-pointer"
          >
            <Search className="w-4 h-4 text-slate-500" />
            <span>Tìm Bãi Đỗ Xe & Bảng Giá</span>
          </Link>
        </div>

        {/* Quick Help Footer */}
        <div className="mt-8 pt-4 border-t border-slate-100 w-full flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-[#d95f00]" />
            Hotline điều phối trực ban 24/7: <strong className="text-slate-800">1900 6868</strong>
          </span>
          <span>·</span>
          <span>Hỗ trợ kết nối API bến cảng Cát Lái, Sóng Thần, Đình Vũ</span>
        </div>
      </div>
    </div>
  )
}
