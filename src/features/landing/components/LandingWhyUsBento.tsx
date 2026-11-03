import { Radio, Receipt, ShieldCheck } from 'lucide-react'

export function LandingWhyUsBento() {
  return (
    <section className="bg-brand-navy py-20 sm:py-28 relative overflow-hidden" id="giai-phap-chu-bai">
      <div className="max-w-[1240px] mx-auto px-6 relative z-10">
        {/* Split Heading Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-brand-navy-light border border-slate-700 text-brand-orange text-xs font-semibold uppercase tracking-wider mb-3">
              ĐỘ TIN CẬY TUYỆT ĐỐI
            </div>
            <h2 className="font-sora font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight">
              Được Thiết Kế Cho Doanh Nghiệp <br />
              <span className="text-brand-orange">Không Thể Chấp Nhận Rủi Ro.</span>
            </h2>
          </div>
          <p className="font-inter text-sm sm:text-base text-slate-300 max-w-md leading-relaxed">
            Tối ưu chi phí lưu bãi, minh bạch từng phút đỗ và loại bỏ hoàn toàn tình trạng thất thoát vé giấy hoặc tranh chấp slot đậu xe giữa các nhà xe.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Large Hero Bento Card (Left, Col 7) */}
          <div className="lg:col-span-7 bg-brand-navy-light rounded-3xl border border-slate-700/80 p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <span className="bg-slate-800 text-brand-orange border border-slate-700 text-xs font-semibold px-3 py-1 rounded-full uppercase">
                  SLA Cam Kết 99.8%
                </span>
                <ShieldCheck className="h-5 w-5 text-slate-400" aria-hidden="true" />
              </div>
              <h3 className="font-sora font-bold text-2xl sm:text-3xl text-white mb-4">
                Không Còn Cảnh Đậu Tràn Lề Đường Chờ Lốt Cảng Biển
              </h3>
              <p className="font-inter text-sm text-slate-300 leading-relaxed max-w-lg mb-8">
                Hệ thống tự động đồng bộ thời gian xả hàng tại cầu cảng và phân luồng xe vào điểm dừng đệm gần nhất. Tài xế nhận tin nhắn thông báo giờ vào cảng chuẩn xác từng phút.
              </p>
            </div>

            {/* Bottom Stat Strip */}
            <div className="relative z-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <div className="font-sora font-extrabold text-4xl text-white">98%</div>
                <div className="font-inter text-xs text-slate-400 mt-1">Giảm thiểu thời gian chờ tại cổng bãi</div>
              </div>
              <div className="h-10 w-px bg-slate-800 hidden sm:block"></div>
              <div>
                <div className="font-sora font-extrabold text-4xl text-brand-orange">0 đ</div>
                <div className="font-inter text-xs text-slate-400 mt-1">Phí phạt trễ giờ khi có đăng ký trước</div>
              </div>
              <div className="h-10 w-px bg-slate-800 hidden sm:block"></div>
              <div>
                <div className="font-sora font-extrabold text-4xl text-white">100%</div>
                <div className="font-inter text-xs text-slate-400 mt-1">Hóa đơn điện tử VAT xuất tự động</div>
              </div>
            </div>
          </div>

          {/* 3 Stacked Technical Cards (Right, Col 5) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Small Bento 1 */}
            <div className="bg-brand-navy-light rounded-2xl border border-slate-700/80 p-6 hover:border-slate-500 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-brand-orange mb-4">
                <Radio className="h-6 w-6" aria-hidden="true" />
              </div>
              <h4 className="font-sora font-bold text-lg text-white mb-2">Giám Sát Vị Trí Realtime 0ms</h4>
              <p className="font-inter text-xs text-slate-300 leading-relaxed">
                Cập nhật tức thời sơ đồ bãi đỗ với cảm biến mặt đất và camera AI. Tài xế biết chính xác vị trí ô đỗ số mấy trước khi lăn bánh vào bãi.
              </p>
            </div>

            {/* Small Bento 2 */}
            <div className="bg-brand-navy-light rounded-2xl border border-slate-700/80 p-6 hover:border-slate-500 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-brand-orange mb-4">
                <Receipt className="h-6 w-6" aria-hidden="true" />
              </div>
              <h4 className="font-sora font-bold text-lg text-white mb-2">Đối Soát &amp; Thanh Toán PayOS T+1</h4>
              <p className="font-inter text-xs text-slate-300 leading-relaxed">
                Tích hợp cổng thanh toán chuẩn VietQR và PayOS. Chủ bãi nhận tiền đối soát tự động mỗi sáng, không thất thoát tiền mặt vé xe.
              </p>
            </div>

            {/* Small Bento 3 */}
            <div className="bg-brand-navy-light rounded-2xl border border-slate-700/80 p-6 hover:border-slate-500 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-brand-orange mb-4">
                <ShieldCheck className="h-6 w-6" aria-hidden="true" />
              </div>
              <h4 className="font-sora font-bold text-lg text-white mb-2">Bảo Hiểm Hàng Hóa &amp; Xe Lưu Bãi</h4>
              <p className="font-inter text-xs text-slate-300 leading-relaxed">
                Mọi lượt đỗ đặt qua SmartTruckHub đều được bảo hiểm trách nhiệm dân sự và rủi ro cháy nổ bãi đỗ với mức bồi thường lên tới 2 tỷ đồng.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
