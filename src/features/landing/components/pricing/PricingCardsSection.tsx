import { Car, Truck, Warehouse, CheckCircle2, ArrowRight } from 'lucide-react'

interface PricingCardsSectionProps {
  billingType: 'turn' | 'month'
}

export function PricingCardsSection({ billingType }: PricingCardsSectionProps) {
  const tier2Price = billingType === 'month' ? '841.500 đ' : '990.000 đ'

  return (
    <section className="w-full bg-[#EEF2F7] py-16 lg:py-24 relative -mt-4">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-4">
          {/* CARD 1: TÀI XẾ & CHỦ XE CÁ NHÂN */}
          <div className="bg-white border border-[#D7DFE9] rounded-3xl p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-inter text-xs px-3 py-1 bg-[#EEF2F7] text-[#1E3A5F] rounded font-semibold tracking-wide uppercase">
                  TIẾP CẬN TỰ DO
                </span>
                <Car className="h-6 w-6 text-[#475569]" aria-hidden="true" />
              </div>
              <h3 className="font-sora text-xl font-bold text-[#0F172A] mb-2">Tài xế &amp; Chủ xe</h3>
              <p className="font-inter text-sm text-[#475569] mb-6 min-h-[44px]">
                Dành cho bác tài xe tải, đầu kéo tìm kiếm chỗ dừng nghỉ và đỗ xe an toàn dọc các
                trục quốc lộ.
              </p>
              <div className="mb-8 pb-6 border-b border-[#D7DFE9]">
                <div className="flex items-baseline gap-2">
                  <span className="font-sora text-3xl sm:text-4xl text-[#0F172A] font-extrabold">
                    0 đ
                  </span>
                  <span className="font-inter text-sm text-[#475569]">/ mãi mãi miễn phí</span>
                </div>
                <span className="font-inter text-xs text-[#F97316] font-medium block mt-1">
                  Không cần thẻ tín dụng, tải app dùng ngay
                </span>
              </div>

              {/* Checklist */}
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#F97316] shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="font-inter text-sm text-[#0F172A]">
                    Tra cứu 320+ cụm bãi đỗ &amp; depot container toàn quốc
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#F97316] shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="font-inter text-sm text-[#0F172A]">
                    Giữ chỗ trước 10 phút chống cướp lốt tại cảng biển
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#F97316] shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="font-inter text-sm text-[#0F172A]">
                    Quét mã QR barie ALPR tự động mở trong 0.2 giây
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#F97316] shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="font-inter text-sm text-[#0F172A]">
                    Xuất hóa đơn VAT điện tử từng chuyến gửi về công ty
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#F97316] shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="font-inter text-sm text-[#0F172A]">
                    Miễn phí hoàn cọc 100% nếu hủy trước 60 phút
                  </span>
                </li>
              </ul>
            </div>
            <a
              className="w-full py-3.5 px-6 rounded-lg border border-[#0F172A] text-[#0F172A] hover:bg-[#EEF2F7] font-sora font-semibold text-sm text-center transition-colors flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
              href="/driver-solutions"
            >
              <span>BẮT ĐẦU TÌM BÃI NGAY</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          {/* CARD 2 (HERO HIGHLIGHTED): ĐỘI XE & DOANH NGHIỆP 3PL */}
          <div className="bg-[#0F172A] border-2 border-[#F97316] rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative lg:-translate-y-4">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-max max-w-[90%] text-center">
              <span className="bg-[#F97316] text-white font-inter text-xs uppercase tracking-wider px-4 py-1.5 rounded-full font-bold shadow-md inline-block">
                PHỔ BIẾN NHẤT CHO DOANH NGHIỆP VẬN TẢI
              </span>
            </div>
            <div>
              <div className="flex items-center justify-between mb-4 pt-2">
                <span className="font-inter text-xs px-3 py-1 bg-[#1E293B] text-[#D7DFE9] rounded font-semibold tracking-wide uppercase">
                  FLEET &amp; 3PL ENTERPRISE
                </span>
                <Truck className="h-6 w-6 text-[#F97316]" aria-hidden="true" />
              </div>
              <h3 className="font-sora text-xl font-bold text-white mb-2">
                Đội xe &amp; Doanh nghiệp 3PL
              </h3>
              <p className="font-inter text-sm text-[#D7DFE9] mb-6 min-h-[44px]">
                Giải pháp quản trị hạn mức tập trung, xuất hóa đơn VAT gộp và kiểm soát hành trình
                cho đội xe 5 - 500 đầu kéo.
              </p>
              <div className="mb-8 pb-6 border-b border-[#1E293B]">
                <div className="flex items-baseline gap-2">
                  <span
                    className="font-sora text-3xl sm:text-4xl text-white font-extrabold"
                    id="tier2-price"
                  >
                    {tier2Price}
                  </span>
                  <span className="font-inter text-sm text-[#D7DFE9]">
                    / tháng / tài khoản điều phối
                  </span>
                </div>
                <span className="font-inter text-xs text-[#F97316] font-medium block mt-1">
                  Tiết kiệm 18% chi phí nhiên liệu &amp; chờ bãi
                </span>
              </div>

              {/* Checklist */}
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#F97316] shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="font-inter text-sm text-white font-medium">
                    Mọi tính năng của gói Tài xế cá nhân
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#F97316] shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="font-inter text-sm text-[#D7DFE9]">
                    Ví công nợ công ty tập trung (Tài xế không cần ứng tiền túi)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#F97316] shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="font-inter text-sm text-[#D7DFE9]">
                    Dashboard điều phối viên quản lý vị trí xe &amp; giờ vào/ra realtime
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#F97316] shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="font-inter text-sm text-[#D7DFE9]">
                    Hóa đơn điện tử VAT tổng hợp cuối tháng, đối soát 1 chạm
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#F97316] shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="font-inter text-sm text-[#D7DFE9]">
                    API kết nối hệ thống TMS / ERP doanh nghiệp vận tải
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#F97316] shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="font-inter text-sm text-[#D7DFE9]">
                    Tổng đài ưu tiên &amp; đội ngũ hỗ trợ khẩn cấp 24/7 chuyên trách
                  </span>
                </li>
              </ul>
            </div>
            <a
              className="w-full py-4 px-6 rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white font-sora font-semibold text-sm text-center transition-colors flex items-center justify-center gap-2 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
              href="#lien-he"
            >
              <span>ĐĂNG KÝ GÓI ĐỘI XE B2B</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          {/* CARD 3: ĐỐI TÁC CHỦ BÃI & DEPOT CẢNG */}
          <div className="bg-white border border-[#D7DFE9] rounded-3xl p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-inter text-xs px-3 py-1 bg-[#EEF2F7] text-[#1E3A5F] rounded font-semibold tracking-wide uppercase">
                  TỐI ƯU MẶT BẰNG
                </span>
                <Warehouse className="h-6 w-6 text-[#475569]" aria-hidden="true" />
              </div>
              <h3 className="font-sora text-xl font-bold text-[#0F172A] mb-2">Chủ bãi &amp; Depot</h3>
              <p className="font-inter text-sm text-[#475569] mb-6 min-h-[44px]">
                Chỉ thu phí khi bãi phát sinh doanh thu. Miễn phí trọn đời phần mềm quản trị và kết
                nối PayOS.
              </p>
              <div className="mb-8 pb-6 border-b border-[#D7DFE9]">
                <div className="flex items-baseline gap-2">
                  <span className="font-sora text-3xl sm:text-4xl text-[#0F172A] font-extrabold">
                    5%
                  </span>
                  <span className="font-inter text-sm text-[#475569]">/ trên mỗi lượt xe thực tế</span>
                </div>
                <span className="font-inter text-xs text-[#F97316] font-medium block mt-1">
                  Không phát sinh doanh thu - Không thu phí sàn
                </span>
              </div>

              {/* Checklist */}
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#F97316] shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="font-inter text-sm text-[#0F172A]">
                    Phần mềm quản trị SmartTruck Merchant Portal đa thiết bị
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#F97316] shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="font-inter text-sm text-[#0F172A]">
                    Tích hợp camera ALPR nhận diện biển số &amp; mở barie 0.2s
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#F97316] shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="font-inter text-sm text-[#0F172A]">
                    Thu tiền tự động qua PayOS VietQR, tiền về ví rút T+1
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#F97316] shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="font-inter text-sm text-[#0F172A]">
                    Cấu hình ma trận giá linh hoạt (giờ, qua đêm, cao điểm)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#F97316] shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="font-inter text-sm text-[#0F172A]">
                    Tiếp cận mạng lưới 45,000+ tài xế container đang tìm chỗ đỗ
                  </span>
                </li>
              </ul>
            </div>
            <a
              className="w-full py-3.5 px-6 rounded-lg border border-[#0F172A] text-[#0F172A] hover:bg-[#EEF2F7] font-sora font-semibold text-sm text-center transition-colors flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
              href="/owner-solutions#onboarding-form"
            >
              <span>ĐĂNG KÝ HỢP TÁC BÃI ĐỖ</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
