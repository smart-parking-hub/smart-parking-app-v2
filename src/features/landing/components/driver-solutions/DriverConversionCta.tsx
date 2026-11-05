import { ArrowRight, CheckCircle2, Headset, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

export interface DriverConversionCtaProps {
  onOpenLeadModal?: () => void
}

export function DriverConversionCta({ onOpenLeadModal }: DriverConversionCtaProps = {}) {
  const assurances = [
    'Không thu phí duy trì',
    '100% hóa đơn VAT điện tử',
    'Hỗ trợ kỹ thuật cứu hộ 24/7 toàn quốc',
  ]

  return (
    <section className="w-full bg-[#060D1A] py-20 px-6 text-white">
      <div className="max-w-[1240px] mx-auto text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-sora text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Lái Xe An Tâm Trên Mọi Chặng Đường
          </h2>
          <p className="font-inter text-base sm:text-lg text-slate-300 mb-10 max-w-xl mx-auto leading-relaxed">
            Tải ứng dụng miễn phí dành riêng cho tài xế hoặc đăng ký thông tin để nhận ngay mã ưu đãi giảm 20% cho lần đỗ đầu tiên.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            {onOpenLeadModal ? (
              <button
                type="button"
                onClick={onOpenLeadModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-[#060D1A] font-sora font-bold text-base px-8 py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange cursor-pointer"
              >
                <span>TẠO TÀI KHOẢN TÀI XẾ MIỄN PHÍ</span>
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </button>
            ) : (
              <Link
                to="/search"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-[#060D1A] font-sora font-bold text-base px-8 py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
              >
                <span>TẠO TÀI KHOẢN TÀI XẾ MIỄN PHÍ</span>
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            )}
            <a
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0B1528] hover:bg-slate-800 text-white border border-slate-700 font-sora font-semibold text-base px-8 py-4 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              href="tel:19006868"
            >
              <Headset className="h-5 w-5 text-brand-orange" aria-hidden="true" />
              <span>TỔNG ĐÀI HỖ TRỢ: 1900 6868</span>
            </a>
          </div>

          {/* Outbound Link to Parking Search */}
          <div className="mb-10">
            <Link
              to="/parking"
              className="inline-flex items-center gap-2 text-sm font-inter text-slate-300 hover:text-brand-orange transition-colors underline underline-offset-4"
            >
              <MapPin className="h-4 w-4 text-brand-orange" aria-hidden="true" />
              <span>Hoặc tra cứu trực tiếp 320+ bãi đỗ trên Bản Đồ Bãi Đỗ Tương Tác</span>
            </Link>
          </div>

          {/* Reassurance Badges Row */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm font-inter text-slate-300">
            {assurances.map((item) => (
              <div key={item} className="flex items-center gap-2.5">
                <CheckCircle2 className="h-5 w-5 text-brand-orange shrink-0" aria-hidden="true" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
