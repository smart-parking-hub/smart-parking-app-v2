import { useState } from 'react'
import { ArrowLeft, ArrowRight, Star, StarHalf } from 'lucide-react'

export function HomeTestimonials() {
  const [activeIndex, setActiveIndex] = useState(0)

  const testimonials = [
    {
      id: 1,
      theme: 'light',
      stars: 5,
      quote:
        '"Trước đây mỗi lần tài xế chạy hàng vào cụm Cát Lái là chúng tôi toát mồ hôi vì tắc đường và không tìm được bãi đậu qua đêm. Từ ngày dùng SmartTruckHub, chúng tôi đặt slot trước 2 tiếng, xe đến là barie mở ngay lập tức, tiết kiệm ít nhất 400.000đ tiền phạt đậu sai quy định mỗi chuyến."',
      name: 'Hoàng Nam Vũ',
      role: 'Giám đốc Vận hành, Vận Tải Đông Đô Logistics',
      initials: 'HN',
    },
    {
      id: 2,
      theme: 'dark',
      stars: 5,
      quote:
        '"Bãi của tôi có diện tích 15,000m² tại Đình Vũ Hải Phòng. Trước đây quản lý bằng sổ tay và vé giấy rất hay thất thoát. Tích hợp giải pháp phần mềm và barie của SmartTruckHub giúp doanh thu tăng 32% nhờ đón được các xe vãng lai đặt qua mạng và đối soát PayOS tự động mỗi sáng."',
      name: 'Trần Quốc Cường',
      role: 'Chủ bãi bến xe container Cường Phát, Hải Phòng',
      initials: 'TC',
    },
    {
      id: 3,
      theme: 'light',
      stars: 4.5,
      quote:
        '"Lái xe tải đường dài từ Bình Định ra Hà Nội điều ngán nhất là không biết đêm nay ngủ ở đâu an toàn. Có app này tôi chỉ việc nhìn bản đồ chọn trạm dừng có phòng tắm và cơm tài xế, bấm thanh toán qua quét mã VietQR là xong. Rất văn minh và an tâm không lo bị mất cắp dầu."',
      name: 'Lê Minh Hùng',
      role: 'Bác tài xe đầu kéo Bắc Nam (Kinh nghiệm 14 năm)',
      initials: 'LH',
    },
  ]

  const handlePrev = () => {
    setActiveIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setActiveIndex((prev) => Math.min(testimonials.length - 1, prev + 1))
  }

  return (
    <section className="bg-white py-20 sm:py-28" aria-label="Đánh giá từ khách hàng">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
          <div>
            <h2 className="font-sora font-extrabold text-3xl sm:text-4xl lg:text-5xl text-brand-navy tracking-tight">
              Được Tin Dùng Toàn Quốc
            </h2>
            <p className="font-inter text-base sm:text-lg text-slate-600 mt-2">
              Hơn 2,400+ đội xe và chủ bãi bến vận hành thông suốt mỗi ngày.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Slide Dots Indicator */}
            <div className="flex items-center gap-1.5 mr-2" role="tablist" aria-label="Chọn đánh giá">
              {testimonials.map((t, idx) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={activeIndex === idx}
                  aria-label={`Đánh giá ${idx + 1}: ${t.name}`}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activeIndex === idx
                      ? 'w-7 bg-brand-orange'
                      : 'w-2.5 bg-slate-200 hover:bg-slate-300'
                  }`}
                />
              ))}
            </div>

            {/* Navigation Buttons */}
            <button
              type="button"
              aria-label="Đánh giá trước đó"
              disabled={activeIndex === 0}
              onClick={handlePrev}
              className="w-12 h-12 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Đánh giá tiếp theo"
              disabled={activeIndex === testimonials.length - 1}
              onClick={handleNext}
              className="w-12 h-12 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
            >
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Mobile View: Active Card Carousel (Visible on < md) */}
        <div className="md:hidden">
          {(() => {
            const current = testimonials[activeIndex]
            return (
              <div
                key={current.id}
                className="bg-white rounded-2xl p-7 flex flex-col justify-between border-2 border-brand-orange/40 shadow-md transition-all duration-300"
              >
                <div>
                  <div className="flex items-center gap-1 text-brand-orange mb-5">
                    <Star className="h-4.5 w-4.5 fill-brand-orange text-brand-orange" aria-hidden="true" />
                    <Star className="h-4.5 w-4.5 fill-brand-orange text-brand-orange" aria-hidden="true" />
                    <Star className="h-4.5 w-4.5 fill-brand-orange text-brand-orange" aria-hidden="true" />
                    <Star className="h-4.5 w-4.5 fill-brand-orange text-brand-orange" aria-hidden="true" />
                    {current.stars === 5 ? (
                      <Star className="h-4.5 w-4.5 fill-brand-orange text-brand-orange" aria-hidden="true" />
                    ) : (
                      <StarHalf className="h-4.5 w-4.5 fill-brand-orange text-brand-orange" aria-hidden="true" />
                    )}
                  </div>
                  <p className="font-inter text-base text-slate-700 leading-relaxed mb-6 italic">
                    {current.quote}
                  </p>
                </div>
                <div className="pt-5 border-t border-slate-100 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-brand-navy text-white flex items-center justify-center font-sora font-bold text-sm shrink-0">
                    {current.initials}
                  </div>
                  <div>
                    <div className="font-sora font-bold text-base text-brand-navy">
                      {current.name}
                    </div>
                    <div className="font-inter text-sm text-slate-500">{current.role}</div>
                  </div>
                </div>
              </div>
            )
          })()}
        </div>

        {/* Desktop View: 3 Testimonial Cards Grid with Active Highlight (Visible on >= md) */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => {
            const isActive = activeIndex === idx
            return (
              <div
                key={t.id}
                onClick={() => setActiveIndex(idx)}
                className={`rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-white border-2 border-brand-orange shadow-lg scale-[1.02]'
                    : 'bg-slate-50 border border-slate-200/80 hover:bg-slate-100/70 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1 text-brand-orange mb-6">
                    <Star className="h-4.5 w-4.5 fill-brand-orange text-brand-orange" aria-hidden="true" />
                    <Star className="h-4.5 w-4.5 fill-brand-orange text-brand-orange" aria-hidden="true" />
                    <Star className="h-4.5 w-4.5 fill-brand-orange text-brand-orange" aria-hidden="true" />
                    <Star className="h-4.5 w-4.5 fill-brand-orange text-brand-orange" aria-hidden="true" />
                    {t.stars === 5 ? (
                      <Star className="h-4.5 w-4.5 fill-brand-orange text-brand-orange" aria-hidden="true" />
                    ) : (
                      <StarHalf className="h-4.5 w-4.5 fill-brand-orange text-brand-orange" aria-hidden="true" />
                    )}
                  </div>
                  <p className="font-inter text-base text-slate-700 leading-relaxed mb-6 italic">
                    {t.quote}
                  </p>
                </div>
                <div className="pt-6 flex items-center gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center font-sora font-bold text-sm shrink-0 transition-colors ${
                      isActive ? 'bg-brand-orange text-[#060D1A]' : 'bg-brand-navy text-white'
                    }`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-sora font-bold text-base text-brand-navy">
                      {t.name}
                    </div>
                    <div className="font-inter text-sm text-slate-500">{t.role}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
