import { Scale, AlertTriangle, ShieldCheck } from 'lucide-react'

interface MerchantSlotsInvariantBannerProps {
  isLocked?: boolean
  status?: string
}

export function MerchantSlotsInvariantBanner({
  isLocked = false,
  status,
}: MerchantSlotsInvariantBannerProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Khóa Invariant Bảo Toàn Thực Địa */}
      <div className="flex items-start sm:items-center gap-3.5 p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#ffdbca] text-[#341100] shrink-0">
          <Scale className="w-5 h-5 text-[#d95f00]" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-900 font-bold">
              Quy Chuẩn Bảo Toàn Thực Địa &amp; Khóa Ràng Buộc Vật Lý
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <ShieldCheck className="w-3 h-3" />
              Invariant Active
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
            Ràng buộc bất biến: Tổng sức chứa không thể giảm thấp hơn số xe đang đỗ thực tế
            (Occupied) nhằm chống tràn bãi vật lý và sai lệch dữ liệu trạm barie ALPR.
          </p>
        </div>
      </div>

      {/* Cảnh báo nếu Bãi bị Khóa hoặc Từ chối */}
      {isLocked && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-amber-950">
              Bãi đỗ đang bị khóa cấu hình sức chứa
            </span>
            <span>
              Trạng thái hiện tại: <strong>{status}</strong>. Chỉ những bãi đỗ đã được phê duyệt
              (APPROVED) mới được phép thay đổi sức chứa slot và lưu cấu hình.
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
