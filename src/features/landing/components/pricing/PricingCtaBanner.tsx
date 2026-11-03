import { ArrowRight } from 'lucide-react'

export function PricingCtaBanner() {
  return (
    <section className="w-full bg-[#060D1A] py-20 lg:py-24 text-white relative overflow-hidden border-t border-[#1E293B]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 relative z-10 text-center flex flex-col items-center">
        <span className="inline-block px-4 py-1 rounded bg-[#1E293B] text-[#F97316] font-inter text-xs uppercase font-semibold mb-6 tracking-wider">
          HẠ TẦNG SỐ HÓA BÃI XE TẢI VIỆT NAM
        </span>
        <h2 className="font-sora font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white max-w-3xl mb-6 leading-tight tracking-tight">
          Sẵn Sàng Tối Ưu Chi Phí Dừng Đỗ &amp; Quản Lý Đội Xe?
        </h2>
        <p className="font-inter text-base sm:text-lg text-[#D7DFE9] max-w-2xl mb-10 leading-relaxed">
          Được tin dùng bởi hơn 2,400+ đội xe và 320+ cụm bãi trên khắp các tuyến hành lang kinh tế
          Bắc - Nam.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <a
            className="w-full sm:w-auto px-8 py-4 bg-[#F97316] hover:bg-[#EA580C] text-white font-sora font-semibold text-sm rounded-lg shadow-xl transition-all flex items-center justify-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
            href="#lien-he"
          >
            <span>LIÊN HỆ NHẬN BÁO GIÁ ĐỘI XE</span>
            <ArrowRight className="h-5 w-5 text-white" aria-hidden="true" />
          </a>
          <a
            className="w-full sm:w-auto px-8 py-4 bg-[#0F172A] border border-[#1E3A5F] hover:bg-[#1E293B] text-white font-sora font-semibold text-sm rounded-lg transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
            href="#lien-he"
          >
            ĐĂNG KÝ DÙNG THỬ 30 NGÀY
          </a>
        </div>
      </div>
    </section>
  )
}
