export function LandingMetricsBanner() {
  return (
    <section className="bg-white py-16 sm:py-20 border-b border-brand-border">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Metric 1 */}
          <div className="flex flex-col border-l-2 border-brand-orange pl-5">
            <div className="font-sora font-extrabold text-4xl sm:text-5xl text-brand-navy tracking-tight">20K+</div>
            <div className="font-inter text-xs sm:text-sm font-semibold text-slate-600 mt-2">Lượt Xe Lưu Bãi / Ngày</div>
            <div className="font-inter text-xs text-slate-400 mt-1">Xác thực biển số và check-in tự động qua QR code</div>
          </div>
          {/* Metric 2 */}
          <div className="flex flex-col border-l-2 border-slate-300 pl-5">
            <div className="font-sora font-extrabold text-4xl sm:text-5xl text-brand-navy tracking-tight">320+</div>
            <div className="font-inter text-xs sm:text-sm font-semibold text-slate-600 mt-2">Cụm Bãi Đỗ &amp; Depot</div>
            <div className="font-inter text-xs text-slate-400 mt-1">Bao phủ 18 tỉnh thành trọng điểm logistics Bắc - Nam</div>
          </div>
          {/* Metric 3 */}
          <div className="flex flex-col border-l-2 border-slate-300 pl-5">
            <div className="font-sora font-extrabold text-4xl sm:text-5xl text-brand-navy tracking-tight">99.8%</div>
            <div className="font-inter text-xs sm:text-sm font-semibold text-slate-600 mt-2">Độ Chính Xác SLA Barie</div>
            <div className="font-inter text-xs text-slate-400 mt-1">Không ùn tắc cổng phụ, giải tỏa áp lực giờ cao điểm</div>
          </div>
          {/* Metric 4 */}
          <div className="flex flex-col border-l-2 border-brand-orange pl-5">
            <div className="font-sora font-extrabold text-4xl sm:text-5xl text-brand-navy tracking-tight">24/7</div>
            <div className="font-inter text-xs sm:text-sm font-semibold text-slate-600 mt-2">Điều Phối Hiện Trường</div>
            <div className="font-inter text-xs text-slate-400 mt-1">Đội ngũ kỹ thuật hỗ trợ cứu hộ &amp; điều xe liên tục</div>
          </div>
        </div>
      </div>
    </section>
  )
}
