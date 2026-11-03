export function LandingConversionCta() {
  return (
    <section className="bg-brand-navy py-20 sm:py-28 relative overflow-hidden border-t border-slate-800">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800/40 via-brand-navy to-brand-navy pointer-events-none"></div>
      <div className="max-w-[1240px] mx-auto px-6 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-navy-light border border-slate-700 mb-6">
          <span className="w-2 h-2 rounded-full bg-brand-orange"></span>
          <span className="font-inter text-xs font-semibold text-brand-orange uppercase tracking-wider">
            KẾT NỐI NGAY TRONG 60 GIÂY
          </span>
        </div>
        <h2 className="font-sora font-extrabold text-3xl sm:text-5xl text-white tracking-tight max-w-3xl mx-auto leading-tight">
          Sẵn Sàng Số Hóa Điểm Đỗ Xe Tải <br />
          <span className="text-brand-orange">Không Còn Bất Cứ Bất Ngờ Nào?</span>
        </h2>
        <p className="font-inter text-sm sm:text-base text-slate-300 max-w-xl mx-auto mt-6 leading-relaxed">
          Gia nhập mạng lưới điều phối bãi thông minh lớn nhất Việt Nam. Tiết kiệm thời gian, tối ưu doanh thu và xây dựng chuỗi cung ứng vững chắc.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
          <a
            className="inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-sora font-semibold text-base px-8 py-4 rounded-xl shadow-xl shadow-brand-orange/20 transition-all hover:scale-105"
            href="#tim-bai"
          >
            <span>TÌM BÃI ĐỖ NGAY LẬP TỨC</span>
            <span className="material-symbols-outlined text-[20px]">local_shipping</span>
          </a>
          <a
            className="inline-flex items-center justify-center gap-2 bg-brand-navy-light hover:bg-slate-800 text-white border border-slate-700 font-sora font-semibold text-base px-8 py-4 rounded-xl transition-all"
            href="#giai-phap-chu-bai"
          >
            <span className="material-symbols-outlined text-[20px] text-slate-400">handshake</span>
            <span>ĐĂNG KÝ HỢP TÁC CHỦ BÃI</span>
          </a>
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs font-inter text-slate-400">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-orange text-[18px]">check_circle</span>
            <span>Không cần hợp đồng giấy tờ rườm rà</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-orange text-[18px]">check_circle</span>
            <span>Tích hợp thiết bị Barie sẵn có trong 48h</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-orange text-[18px]">check_circle</span>
            <span>Đối soát tài chính tự động mỗi ngày</span>
          </div>
        </div>
      </div>
    </section>
  )
}
