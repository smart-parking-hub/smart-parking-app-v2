import { Link } from 'react-router-dom'
import { MapPinOff, ArrowLeft, Search } from 'lucide-react'

interface ParkingDetailEmptyStateProps {
  facilityId?: string | number
  onBackToSearch?: () => void
}

export function ParkingDetailEmptyState({
  facilityId,
  onBackToSearch,
}: ParkingDetailEmptyStateProps) {
  return (
    <div
      role="region"
      aria-label="Không tìm thấy bãi đỗ xe"
      className="w-full min-h-[60vh] flex items-center justify-center p-6 bg-[#f8f9ff]"
    >
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm p-8 text-center flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
          <MapPinOff className="w-8 h-8 text-slate-400" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            KHÔNG TÌM THẤY DỮ LIỆU
          </span>
          <h2 className="text-xl font-bold text-slate-900">
            Bãi Đỗ Xe Không Tồn Tại
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            {facilityId
              ? `Không tìm thấy thông tin bãi đỗ với mã số #${facilityId}. Có thể bãi đã tạm đóng hoặc ngừng dịch vụ điều phối ALPR.`
              : 'Không tìm thấy bãi đỗ xe được chỉ định. Vui lòng quay lại bản đồ tìm kiếm.'}
          </p>
        </div>

        <div className="w-full pt-2 flex flex-col gap-2">
          {onBackToSearch ? (
            <button
              type="button"
              onClick={onBackToSearch}
              className="w-full bg-[#d95f00] hover:bg-[#b84e00] text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>QUAY LẠI BẢN ĐỒ TÌM BÃI (SCR-015)</span>
            </button>
          ) : (
            <Link
              to="/dashboard/search"
              className="w-full bg-[#d95f00] hover:bg-[#b84e00] text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>QUAY LẠI BẢN ĐỒ TÌM BÃI (SCR-015)</span>
            </Link>
          )}

          <Link
            to="/dashboard"
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>VỀ BẢNG ĐIỀU KHIỂN (SCR-014)</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
