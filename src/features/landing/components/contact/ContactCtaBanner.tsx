import { Rocket, ArrowRight, Phone, Check } from 'lucide-react'

export function ContactCtaBanner() {
  const perks = [
    'Miễn phí khảo sát thiết bị barie',
    'Cấp tài khoản dùng thử API 14 ngày',
    'Hỗ trợ tài xế đêm xuyên tuyến',
  ]

  return (
    <section className="w-full bg-[#060D1A] py-16 text-white border-t border-slate-800">
      <div className="max-w-[1240px] mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[#d95f00] font-mono text-xs uppercase tracking-wider mb-4 font-semibold">
          <Rocket className="w-3.5 h-3.5" />
          <span>TRIỂN KHAI NHANH CHÓNG TRONG 48 GIỜ</span>
        </div>

        <h2 className="font-sora font-bold text-2xl md:text-4xl text-white max-w-3xl mx-auto tracking-tight mb-4 leading-snug">
          Sẵn Sàng Tối Ưu Hóa Mặt Bằng Hoặc Kết Nối Đội Xe Toàn Diện?
        </h2>

        <p className="font-inter text-sm md:text-base text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
          Gia nhập mạng lưới hơn 140 bãi đỗ thông minh và hàng nghìn doanh nghiệp vận tải đang vận hành trên nền tảng SmartTruckHub.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#enterpriseContactForm"
            className="w-full sm:w-auto bg-[#d95f00] hover:bg-[#b84e00] text-white font-sora font-semibold text-sm px-8 py-3.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            <span>ĐĂNG KÝ KHẢO SÁT NGAY</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="tel:19006868"
            className="w-full sm:w-auto bg-slate-900/80 hover:bg-slate-900 text-white font-sora font-semibold text-sm px-8 py-3.5 rounded-lg border border-slate-700 transition-colors flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4 text-[#d95f00]" />
            <span>GỌI HOTLINE 1900 6868</span>
          </a>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 text-slate-400 font-inter text-xs">
          {perks.map((perk, idx) => (
            <span key={idx} className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#d95f00]" />
              {perk}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
