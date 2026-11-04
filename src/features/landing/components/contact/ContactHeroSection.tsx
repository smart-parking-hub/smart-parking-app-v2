import { ShieldCheck, Zap, Radio } from 'lucide-react'

export function ContactHeroSection() {
  const metas = [
    {
      icon: ShieldCheck,
      text: 'Đối soát PayOS & Bảo mật ISO 27001',
    },
    {
      icon: Zap,
      text: 'Cứu hộ barie tự động dưới 3 phút',
    },
    {
      icon: Radio,
      text: 'Kết nối IoT trạm dừng 63 tỉnh thành',
    },
  ]

  return (
    <section className="w-full bg-[#EEF2F7] py-16 md:py-24 border-b border-[#E2E8F0]">
      <div className="max-w-[1240px] mx-auto px-6 flex flex-col items-center text-center">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#F97316] text-[#F97316] shadow-sm mb-6">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F97316] animate-pulse"></span>
          <span className="font-mono text-xs uppercase tracking-widest font-semibold">
            KẾT NỐI TRỰC TIẾP · HỖ TRỢ 24/7 TOÀN QUỐC
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="font-sora font-bold text-3xl md:text-5xl text-[#0F172A] max-w-4xl tracking-tight mb-4 leading-tight">
          Liên Hệ Với Đội Ngũ <span className="text-[#F97316]">Chuyên Gia Vận Hành</span> SmartTruck.
        </h1>

        {/* Subtitle Description */}
        <p className="font-inter text-base md:text-lg text-slate-600 max-w-3xl leading-relaxed mb-8">
          Dù bạn là chủ bãi cần số hóa mặt bằng, doanh nghiệp vận tải cần báo giá đội xe 3PL, hay bác tài cần hỗ trợ khẩn cấp tại trạm barie — chúng tôi luôn sẵn sàng 24/7.
        </p>

        {/* Key Metas */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {metas.map((meta, idx) => {
            const Icon = meta.icon
            return (
              <span
                key={idx}
                className="flex items-center gap-2 bg-white border border-slate-200 px-3.5 py-1.5 rounded-lg text-slate-700 font-medium text-xs shadow-sm"
              >
                <Icon className="w-4 h-4 text-[#F97316]" />
                {meta.text}
              </span>
            )
          })}
        </div>
      </div>
    </section>
  )
}
