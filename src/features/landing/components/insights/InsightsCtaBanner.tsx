import { Truck } from 'lucide-react'
import { Link } from 'react-router-dom'

export function InsightsCtaBanner() {
  return (
    <section className="w-full bg-[#060D1A] text-white py-16">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 p-10 md:p-12 rounded-2xl bg-slate-900/90 border border-slate-800">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 font-mono text-xs text-[#F97316] uppercase tracking-wider mb-3">
              <Truck className="w-4 h-4 text-[#F97316]" />
              <span>HẠ TẦNG KẾT NỐI BẾN BÃI TOÀN QUỐC</span>
            </div>

            <h2 className="font-sora font-bold text-2xl lg:text-3xl text-white tracking-tight mb-4">
              Sẵn Sàng Tối Ưu Hóa Chi Phí Lưu Bãi Cho Đội Xe Của Bạn?
            </h2>

            <p className="font-inter text-sm md:text-base text-slate-300 leading-relaxed">
              Kết nối ngay với mạng lưới 120+ trạm dừng nghỉ và bãi xe tải thông minh trên các tuyến hành lang logistics huyết mạch Việt Nam. Đặt chỗ trước, quét QR mở barie, thanh toán tự động qua PayOS.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <Link to="/" className="rounded-lg border border-brand-border px-7 py-3.5 text-sm font-semibold focus-visible:ring-2 focus-visible:ring-brand-orange">Về trang chủ</Link>
            <Link
              to="/driver-solutions"
              className="px-7 py-3.5 rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white font-sora text-xs font-bold shadow-md transition-all active:scale-95 text-center"
            >
              Tìm Bãi Đỗ Ngay
            </Link>
            <Link
              to="/owner-solutions"
              className="px-7 py-3.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-sora text-xs font-bold border border-slate-700 transition-all text-center"
            >
              Dành Cho Chủ Bãi
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
