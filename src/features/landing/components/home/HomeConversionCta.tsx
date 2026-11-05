import { CheckCircle2, Handshake, Truck } from 'lucide-react'

export function HomeConversionCta() {
  const highlights = [
    'Không cần hợp đồng giấy tờ rườm rà',
    'Tích hợp thiết bị Barie sẵn có trong 48h',
    'Đối soát tài chính tự động mỗi ngày',
  ]

  return (
    <section className="bg-brand-navy py-20 sm:py-28 relative overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-6 relative z-10 text-center">
        <h2 className="font-sora font-extrabold text-3xl sm:text-5xl text-white tracking-tight max-w-3xl mx-auto leading-tight">
          Sẵn Sàng Số Hóa Điểm Đỗ Xe Tải?
        </h2>
        <p className="font-inter text-base sm:text-lg text-slate-300 max-w-xl mx-auto mt-5 leading-relaxed">
          Gia nhập mạng lưới điều phối bãi thông minh lớn nhất Việt Nam. Tiết kiệm thời gian, tối ưu doanh thu và xây dựng chuỗi cung ứng vững chắc.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
          <a
            className="inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-[#060D1A] font-sora font-bold text-base px-8 py-4 rounded-xl transition-all hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
            href="#tim-bai"
          >
            <span>TÌM BÃI ĐỖ NGAY LẬP TỨC</span>
            <Truck className="h-5 w-5" aria-hidden="true" />
          </a>
          <a
            className="inline-flex items-center justify-center gap-2 bg-[#0B1528] hover:bg-slate-800 text-white border border-slate-700 font-sora font-semibold text-base px-8 py-4 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            href="#giai-phap-chu-bai"
          >
            <Handshake className="h-5 w-5 text-brand-orange" aria-hidden="true" />
            <span>ĐĂNG KÝ HỢP TÁC CHỦ BÃI</span>
          </a>
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm font-inter text-slate-300">
          {highlights.map((item) => (
            <div key={item} className="flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-brand-orange shrink-0" aria-hidden="true" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
