import { Truck, Coins, Video, Wallet, FileText, CheckCircle2 } from 'lucide-react'

export function OwnerMerchantFeaturesSection() {
  return (
    <section
      className="w-full bg-brand-navy py-16 px-6 text-white border-b border-slate-800"
      id="tinh-nang"
    >
      <div className="max-w-[1240px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
          <div>
            <div className="font-inter text-xs font-semibold text-slate-400 uppercase tracking-normal mb-2">
              HỆ THỐNG QUẢN TRỊ MERCHANT PORTAL CHUYÊN SÂU
            </div>
            <h2 className="font-sora font-extrabold text-xl sm:text-2xl lg:text-3xl text-white tracking-tight">
              5 Công Cụ Quản Trị Trọng Yếu <span className="text-brand-orange">Dành Cho Chủ Bãi.</span>
            </h2>
          </div>
          <p className="font-inter text-sm sm:text-base text-slate-300 max-w-md leading-relaxed">
            Được thiết kế dựa trên quy chuẩn vận hành của các cụm cảng cạn ICD lớn nhất Việt Nam,
            giúp chủ mặt bằng kiểm soát từ xa toàn bộ hoạt động 24/7 qua điện thoại hoặc máy tính.
          </p>
        </div>

        {/* Bento Grid: 5 Platform Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Feature 1: Cấu Hình Phân Luồng & Sức Chứa (Col 7) */}
          <div className="md:col-span-7 bg-[#0B1528] rounded-2xl border border-slate-800 p-6 sm:p-8 flex flex-col justify-between gap-6 hover:border-slate-700 transition-colors shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-4">
                <Truck className="h-6 w-6 text-brand-orange" aria-hidden="true" />
                <span className="text-xs text-slate-400 font-inter">Khai thác tối đa slot</span>
              </div>
              <h3 className="font-sora font-bold text-lg sm:text-xl text-white mb-2.5">
                Cấu Hình Phân Luồng &amp; Sức Chứa 5 Loại Xe
              </h3>
              <p className="font-inter text-sm text-slate-300 leading-relaxed mb-4">
                Tùy biến phân chia khu vực bãi theo loại xe chuyên dụng: Xe tải nhỏ (&lt; 3.5T), Xe
                tải nặng 3-4 chân, Đầu kéo Container 20ft/40ft và Khu cắm điện Reefer container
                lạnh.
              </p>
            </div>

            {/* Mini allocation table */}
            <div className="bg-[#060D1A] rounded-xl p-4 border border-slate-800 text-xs font-inter">
              <div className="grid grid-cols-4 gap-2 text-slate-400 font-semibold uppercase pb-2 border-b border-slate-800">
                <span>Phân khu</span>
                <span>Loại xe hỗ trợ</span>
                <span>Sức chứa</span>
                <span className="text-right">Hiện có</span>
              </div>
              <div className="divide-y divide-slate-800 text-slate-200">
                <div className="grid grid-cols-4 gap-2 py-2 items-center">
                  <span className="font-bold text-white">Zone R</span>
                  <span>Container Lạnh 40&apos;</span>
                  <span className="tabular-nums">30 slot</span>
                  <span className="text-right font-bold text-brand-orange tabular-nums">8 trống</span>
                </div>
                <div className="grid grid-cols-4 gap-2 py-2 items-center">
                  <span className="font-bold text-white">Zone C</span>
                  <span>Container Khô 40/45&apos;</span>
                  <span className="tabular-nums">90 slot</span>
                  <span className="text-right font-bold text-brand-orange tabular-nums">12 trống</span>
                </div>
                <div className="grid grid-cols-4 gap-2 py-2 items-center">
                  <span className="font-bold text-white">Zone T</span>
                  <span>Tải nặng 15T - 4 chân</span>
                  <span className="tabular-nums">50 slot</span>
                  <span className="text-right font-bold text-white bg-slate-800 px-2 py-0.5 rounded inline-block justify-self-end tabular-nums">
                    5 trống
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2: Ma Trận Biểu Phí Đa Tầng Linh Hoạt (Col 5) */}
          <div className="md:col-span-5 bg-[#0B1528] rounded-2xl border border-slate-800 p-6 sm:p-8 flex flex-col justify-between gap-6 hover:border-slate-700 transition-colors shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-4">
                <Coins className="h-6 w-6 text-brand-orange" aria-hidden="true" />
                <span className="text-xs text-slate-400 font-inter">Tự động hóa giá</span>
              </div>
              <h3 className="font-sora font-bold text-lg sm:text-xl text-white mb-2.5">
                Ma Trận Biểu Phí Đa Tầng Linh Hoạt
              </h3>
              <p className="font-inter text-sm text-slate-300 leading-relaxed mb-4">
                Thiết lập giá theo giờ linh hoạt, giá qua đêm, phụ thu cao điểm cảng và cơ chế lũy
                tiến phạt đỗ quá giờ nhằm giải phóng mặt bằng nhanh chóng.
              </p>
            </div>

            <div className="bg-[#060D1A] rounded-xl p-4 border border-slate-800 space-y-2 text-xs font-inter">
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">Giờ đầu tiên:</span>
                <span className="font-bold text-white tabular-nums">30.000 ₫</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">Block 30 phút kế tiếp:</span>
                <span className="font-bold text-white tabular-nums">+15.000 ₫</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">Trọn gói qua đêm (18h - 06h):</span>
                <span className="font-bold text-white tabular-nums">120.000 ₫</span>
              </div>
              <div className="flex justify-between items-center py-1 border-t border-slate-800 pt-2">
                <span className="text-brand-orange font-semibold">Phụ thu cao điểm (22h - 02h):</span>
                <span className="font-bold text-brand-orange tabular-nums">+20%</span>
              </div>
            </div>
          </div>

          {/* Feature 3: Trạm Barie Tự Động & Camera ALPR 360° (Col 4) */}
          <div className="md:col-span-4 bg-[#0B1528] rounded-2xl border border-slate-800 p-6 flex flex-col justify-between gap-5 hover:border-slate-700 transition-colors shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <Video className="h-6 w-6 text-brand-orange" aria-hidden="true" />
                <span className="text-xs text-slate-400 font-inter">Cổng thông minh</span>
              </div>
              <h3 className="font-sora font-bold text-base sm:text-lg text-white mb-2">
                Trạm Barie Tự Động &amp; Camera ALPR 360°
              </h3>
              <p className="font-inter text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                Camera ANPR nhận diện biển số xe tải Việt Nam chính xác 99.4%, mở cần barie tự động
                chỉ trong 0.2 giây mà không cần bảo vệ bấm nút.
              </p>
            </div>

            <div className="bg-[#060D1A] rounded-xl p-3.5 border border-slate-800 text-xs font-inter space-y-1">
              <div className="text-slate-400">Giao thức: RTSP / ONVIF Edge</div>
              <div className="text-brand-orange font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>Hoạt động ngoại tuyến 100%</span>
              </div>
              <div className="text-slate-400">Lưu trữ 10,000 lượt quét khi mất mạng</div>
            </div>
          </div>

          {/* Feature 4: Ví Doanh Thu & Quyết Toán Tức Thì (Col 4) */}
          <div className="md:col-span-4 bg-[#0B1528] rounded-2xl border border-slate-800 p-6 flex flex-col justify-between gap-5 hover:border-slate-700 transition-colors shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <Wallet className="h-6 w-6 text-brand-orange" aria-hidden="true" />
                <span className="text-xs text-slate-400 font-inter">Tài chính T+1</span>
              </div>
              <h3 className="font-sora font-bold text-base sm:text-lg text-white mb-2">
                Ví Doanh Thu &amp; Quyết Toán Tức Thì
              </h3>
              <p className="font-inter text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                Dòng tiền thanh toán từ tài xế đổ trực tiếp vào Ví Merchant. Rút tiền về tài khoản
                ngân hàng doanh nghiệp qua VietQR trong 60 giây.
              </p>
            </div>

            <div className="bg-[#060D1A] rounded-xl p-3.5 border border-slate-800 space-y-1.5 text-xs font-inter">
              <div className="text-slate-400">Số dư khả dụng:</div>
              <div className="font-sora font-extrabold text-xl text-white tabular-nums">
                184.200.000 ₫
              </div>
              <div className="text-slate-400">
                Liên kết: Vietcombank · Techcombank · MB
              </div>
            </div>
          </div>

          {/* Feature 5: Báo Cáo Tài Chính & Đồng Bộ Hóa Đơn VAT (Col 4) */}
          <div className="md:col-span-4 bg-[#0B1528] rounded-2xl border border-slate-800 p-6 flex flex-col justify-between gap-5 hover:border-slate-700 transition-colors shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <FileText className="h-6 w-6 text-brand-orange" aria-hidden="true" />
                <span className="text-xs text-slate-400 font-inter">Thuế &amp; Hóa đơn</span>
              </div>
              <h3 className="font-sora font-bold text-base sm:text-lg text-white mb-2">
                Báo Cáo Tài Chính &amp; Đồng Bộ Hóa Đơn VAT
              </h3>
              <p className="font-inter text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                Biểu đồ trực quan phân tích công suất bãi theo khung giờ và tự động xuất hóa đơn điện
                tử VAT cho khách doanh nghiệp qua hệ thống MISA, Viettel.
              </p>
            </div>

            <div className="bg-[#060D1A] rounded-xl p-3.5 border border-slate-800 flex items-center justify-between text-xs font-inter">
              <div>
                <div className="font-bold text-white uppercase">ĐỒNG BỘ HÓA ĐƠN VAT</div>
                <div className="text-slate-400">Tự động gửi email doanh nghiệp</div>
              </div>
              <CheckCircle2 className="h-5 w-5 text-brand-orange" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
