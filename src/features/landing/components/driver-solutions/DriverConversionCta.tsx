import { ArrowRight, CheckCircle2, Headset } from 'lucide-react'

export function DriverConversionCta() {
  const assurances = [
    'Không thu phí duy trì',
    '100% hóa đơn VAT điện tử',
    'Hỗ trợ kỹ thuật cứu hộ 24/7 toàn quốc',
  ]

  return (
    <section className="w-full bg-[#060D1A] py-20 px-6 text-white border-t border-[#1E3A5F]">
      <div className="max-w-[1240px] mx-auto text-center">
        <div className="max-w-3xl mx-auto">
          <span className="font-inter text-xs font-bold tracking-widest text-[#F97316] uppercase bg-[#0F172A] border border-[#1E3A5F] px-3.5 py-1.5 rounded inline-block mb-4">
            AN TOÀN HÀNG HÓA · VỮNG VÀNG TAY LÁI
          </span>
          <h2 className="font-sora text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6">
            Lái Xe An Tâm Hơn Trên Mọi Chặng Đường. <br />
            <span className="text-[#F97316]">Bắt Đầu Ngay Hôm Nay.</span>
          </h2>
          <p className="font-inter text-base text-slate-300 mb-10 max-w-xl mx-auto leading-relaxed">
            Tải ứng dụng miễn phí dành riêng cho tài xế hoặc đăng ký tài khoản qua số điện thoại để nhận mã ưu đãi giảm 20% cho lần đỗ đầu tiên.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <a
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-inter font-bold text-sm px-8 py-4 rounded shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316]"
              href="#dang-ky-tai-xe"
            >
              <span>TẠO TÀI KHOẢN TÀI XẾ MIỄN PHÍ</span>
              <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
            </a>
            <a
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0F172A] hover:bg-[#1E293B] text-slate-200 border border-[#1E3A5F] font-inter font-semibold text-sm px-7 py-4 rounded transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              href="tel:19006868"
            >
              <Headset className="h-[18px] w-[18px] text-[#F97316]" aria-hidden="true" />
              <span>TỔNG ĐÀI HỖ TRỢ BÁC TÀI: 1900 6868</span>
            </a>
          </div>

          {/* Reassurance Badges Row */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-inter text-slate-400">
            {assurances.map((item, index) => (
              <div key={item} className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-[18px] w-[18px] text-[#F97316] shrink-0" aria-hidden="true" />
                  <span>{item}</span>
                </div>
                {index < assurances.length - 1 && (
                  <div className="h-3 w-px bg-[#1E3A5F] hidden sm:block" aria-hidden="true"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
