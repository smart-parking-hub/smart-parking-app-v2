import { ShieldAlert, Clock, Phone } from 'lucide-react'

export function EditMerchantGatekeeperCard() {
  return (
    <div className="bg-white rounded-2xl p-5 space-y-4 shadow-2xs border border-slate-200/80">
      <div className="flex items-center gap-2 text-[#131b2e] pb-2 border-b border-slate-100">
        <ShieldAlert className="w-5 h-5 text-[#d95f00]" />
        <h3 className="font-sora text-sm font-bold">Quy Chuẩn Thẩm Định Gatekeeper</h3>
      </div>

      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
        <strong className="text-[#131b2e] font-semibold">Lưu ý nghiệp vụ:</strong> Hồ sơ sau khi
        gửi lại sẽ lập tức chuyển trạng thái sang{' '}
        <span className="font-mono text-[11px] font-bold text-[#131b2e] px-1.5 py-0.5 rounded bg-[#e6eeff] border border-slate-300">
          PENDING_APPROVAL
        </span>
        . Hội đồng Kỹ thuật Admin sẽ phúc tra hiện trường trong vòng{' '}
        <strong className="text-[#131b2e]">12 - 24 giờ làm việc</strong>.
      </p>

      <div className="p-3 rounded-xl bg-[#ffdbca]/40 text-[#783200] text-xs space-y-1 border border-[#ffdbca]">
        <div className="font-bold flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#d95f00]" />
          <span>Giới hạn mở bán vị trí</span>
        </div>
        <p className="text-slate-700 leading-relaxed">
          Trong thời gian chờ duyệt, bãi chưa thể mở bán vé đặt chỗ trên ứng dụng SmartTruck Driver để
          bảo đảm an toàn dữ liệu luồng xe.
        </p>
      </div>

      <div className="pt-1 flex items-center justify-between text-slate-600 font-mono text-xs border-t border-slate-100">
        <span className="flex items-center gap-1">
          <Phone className="w-3 h-3 text-[#455f87]" />
          Kênh hỗ trợ khẩn:
        </span>
        <span className="font-bold text-[#131b2e]">Hotline: 1900 6868 (Nhánh 3)</span>
      </div>
    </div>
  )
}
