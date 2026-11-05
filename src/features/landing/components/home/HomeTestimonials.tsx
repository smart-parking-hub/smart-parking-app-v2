import { ArrowLeft, ArrowRight, Star, StarHalf } from 'lucide-react'

export function HomeTestimonials() {
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

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="font-sora font-extrabold text-3xl sm:text-4xl lg:text-5xl text-brand-navy tracking-tight">
              Được Tin Dùng Toàn Quốc
            </h2>
            <p className="font-inter text-base sm:text-lg text-slate-600 mt-2">
              Hơn 2,400+ đội xe và chủ bãi bến vận hành thông suốt mỗi ngày.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Đánh giá trước đó"
              className="w-12 h-12 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Đánh giá tiếp theo"
              className="w-12 h-12 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
            >
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* 3 Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-slate-50 rounded-2xl p-8 flex flex-col justify-between"
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
                <div className="w-11 h-11 rounded-full bg-brand-navy text-white flex items-center justify-center font-sora font-bold text-sm">
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
          ))}
        </div>
      </div>
    </section>
  )
}
