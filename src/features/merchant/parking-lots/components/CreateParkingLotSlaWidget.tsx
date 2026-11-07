import { ShieldCheck, Clock, AlertTriangle, PhoneCall } from 'lucide-react'

export function CreateParkingLotSlaWidget() {
  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-2xs border border-slate-200/80 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-[#eff4ff] text-[#0d1c2e] flex items-center justify-center shrink-0">
          <ShieldCheck className="w-4 h-4 text-[#d95f00]" />
        </div>
        <h3 className="font-sora text-sm sm:text-base text-[#0d1c2e] font-bold">
          Cam Kết SLA &amp; Thẩm Định
        </h3>
      </div>

      <div className="flex flex-col gap-3 text-xs text-slate-600">
        {/* Item 1 */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-[#eff4ff] border border-slate-200/60">
          <Clock className="w-4 h-4 text-[#d95f00] shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="font-bold text-[#0d1c2e] text-xs">
              Thời gian kiểm định hồ sơ
            </span>
            <span className="mt-0.5 leading-relaxed text-slate-600">
              Từ 24 đến 48 giờ làm việc kể từ thời điểm gửi xác nhận ở Bước 3.
            </span>
          </div>
        </div>

        {/* Item 2 */}
        <div className="flex items-start gap-3 p-3 rounded-xl bg-[#eff4ff] border border-slate-200/60">
          <AlertTriangle className="w-4 h-4 text-[#d95f00] shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="font-bold text-[#0d1c2e] text-xs">
              Quy trình cấp phép mở bán
            </span>
            <span className="mt-0.5 leading-relaxed text-slate-600">
              Sau khi Admin phê duyệt (APPROVED), bạn mới được cấu hình Sức chứa Slot và Biểu phí niêm yết để mở bán chỗ trên bản đồ tài xế.
            </span>
          </div>
        </div>
      </div>

      {/* Hotline Assistance Desk */}
      <div className="p-3.5 rounded-xl bg-[#0d1c2e] text-white flex items-center justify-between border border-slate-700">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#341100] text-[#d95f00] flex items-center justify-center shrink-0">
            <PhoneCall className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
              Đường Dây Nóng Khảo Sát
            </span>
            <span className="font-mono text-xs font-bold text-[#ffb690]">
              1900 6868 (Nhánh 3)
            </span>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-md bg-white/10 text-slate-300 font-mono text-[10px]">
          8:00 - 18:00
        </span>
      </div>
    </div>
  )
}
