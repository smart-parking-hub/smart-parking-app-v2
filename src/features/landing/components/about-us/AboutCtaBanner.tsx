import { ArrowRight, Phone } from 'lucide-react'

export function AboutCtaBanner() {
  return (
    <section className="w-full bg-[#060D1A] text-white py-20 px-6 lg:px-12 flex justify-center border-t border-slate-800">
      <div className="max-w-[1240px] w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
        <div className="flex flex-col max-w-2xl">
          <span className="font-mono text-xs text-[#F97316] uppercase tracking-widest block mb-3 font-semibold">
            HỢP TÁC CHIẾN LƯỢC
          </span>
          <h2 className="font-sora font-bold text-2xl sm:text-3xl text-white tracking-tight mb-4 leading-tight">
            Đồng Hành Cùng Chúng Tôi Kiến Tạo Tương Lai Vận Tải Việt Nam
          </h2>
          <p className="text-base text-slate-300 leading-relaxed font-normal">
            Dù bạn là chủ quỹ đất muốn gia tăng doanh thu bãi hay doanh nghiệp vận tải cần giải pháp đặt chỗ tự động, nền tảng SmartTruck Hub luôn sẵn sàng tích hợp trong 24 giờ.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0 w-full lg:w-auto">
          <a
            className="inline-flex items-center justify-center h-[52px] px-8 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold text-sm sm:text-base rounded transition-colors gap-2 shadow-sm text-center"
            href="/company/contact"
          >
            LIÊN HỆ ĐỐI TÁC CHIẾN LƯỢC
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
          <a
            className="inline-flex items-center justify-center h-[52px] px-6 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm sm:text-base rounded border border-slate-700 transition-colors gap-2 text-center"
            href="tel:19006868"
          >
            <Phone className="w-4 h-4 text-slate-400" aria-hidden="true" />
            1900 6868
          </a>
        </div>
      </div>
    </section>
  )
}
