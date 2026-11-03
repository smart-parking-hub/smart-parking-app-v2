import { Headphones, Smartphone, ShieldCheck } from 'lucide-react'

export function CancelSupportGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* 24/7 Hotline Support Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-orange-500 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <span className="font-sora text-sm sm:text-base text-slate-900 font-bold block">
                HỖ TRỢ THANH TOÁN 24/7
              </span>
              <span className="font-mono text-xs text-slate-500 uppercase">
                TRUNG TÂM ĐIỀU PHỐI TÂN CẢNG &amp; PAYOS
              </span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
            Nếu tiền đã bị trừ từ tài khoản ngân hàng nhưng hệ thống chưa ghi nhận vé thành công, vui lòng gọi ngay hotline để tổng đài viên khóa slot trực tiếp.
          </p>
        </div>
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/80">
          <span className="text-xs font-mono text-slate-500 font-medium">
            HOTLINE KHẨN CẤP (NHÁNH 2):
          </span>
          <a
            href="tel:19006868"
            className="font-sora text-sm sm:text-base text-orange-600 font-bold hover:underline"
          >
            1900 6868 - Ext 2
          </a>
        </div>
      </div>

      {/* Bank App Guide Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200">
              <Smartphone className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <span className="font-sora text-sm sm:text-base text-slate-900 font-bold block">
                HƯỚNG DẪN QUÉT VIETQR
              </span>
              <span className="font-mono text-xs text-slate-500 uppercase">
                XÁC THỰC TỨC THÌ QUA NAPAS247
              </span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mb-3 leading-relaxed">
            Mở bất kỳ ứng dụng ngân hàng hoặc ví điện tử để quét mã thanh toán PayOS hợp chuẩn:
          </p>
          <div className="grid grid-cols-4 gap-2 py-1 text-center font-mono text-[11px] font-bold">
            <div className="p-2 bg-slate-100 rounded-lg text-slate-800 border border-slate-200">
              VCB Digibank
            </div>
            <div className="p-2 bg-slate-100 rounded-lg text-slate-800 border border-slate-200">
              MB Bank
            </div>
            <div className="p-2 bg-slate-100 rounded-lg text-slate-800 border border-slate-200">
              Techcombank
            </div>
            <div className="p-2 bg-slate-100 rounded-lg text-slate-800 border border-slate-200">
              BIDV Smart
            </div>
          </div>
        </div>
        <div className="mt-4 pt-2 text-xs font-mono text-slate-500 flex items-center gap-1.5 border-t border-slate-100">
          <ShieldCheck className="w-4 h-4 text-orange-600 shrink-0" />
          <span>Tự động giải phóng cổng barrier sau 2 giây nhận giao dịch</span>
        </div>
      </div>
    </div>
  )
}
