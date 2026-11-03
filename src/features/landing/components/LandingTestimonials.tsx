import { ArrowLeft, ArrowRight, Star, StarHalf } from 'lucide-react'

export function LandingTestimonials() {
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-100 border border-slate-200 text-brand-orange text-xs font-semibold uppercase tracking-wider mb-3">
              BẢO CHỨNG TỪ KHÁCH HÀNG THỰC TẾ
            </div>
            <h2 className="font-sora font-extrabold text-3xl sm:text-4xl text-brand-navy tracking-tight">
              Được Tin Dùng Bởi Hơn 2,400+ <br />
              <span className="text-brand-orange">Đội Xe &amp; Quản Lý Vận Hành Toàn Quốc</span>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Đánh giá trước đó"
              className="w-12 h-12 rounded-xl border border-brand-border bg-white text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Đánh giá tiếp theo"
              className="w-12 h-12 rounded-xl border border-brand-border bg-white text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
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
              className={
                t.theme === 'dark'
                  ? 'bg-brand-navy rounded-2xl p-8 border border-slate-800 flex flex-col justify-between text-white'
                  : 'bg-brand-surface rounded-2xl p-8 border border-brand-border flex flex-col justify-between'
              }
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
                <p
                  className={
                    t.theme === 'dark'
                      ? 'font-inter text-sm text-slate-200 leading-relaxed mb-6 italic'
                      : 'font-inter text-sm text-slate-700 leading-relaxed mb-6 italic'
                  }
                >
                  {t.quote}
                </p>
              </div>
              <div
                className={
                  t.theme === 'dark'
                    ? 'pt-6 border-t border-slate-800 flex items-center gap-3.5'
                    : 'pt-6 border-t border-slate-200 flex items-center gap-3.5'
                }
              >
                <div
                  className={
                    t.theme === 'dark'
                      ? 'w-11 h-11 rounded-full bg-brand-orange text-white flex items-center justify-center font-sora font-bold text-sm'
                      : 'w-11 h-11 rounded-full bg-slate-800 text-white flex items-center justify-center font-sora font-bold text-sm'
                  }
                >
                  {t.initials}
                </div>
                <div>
                  <div
                    className={
                      t.theme === 'dark'
                        ? 'font-sora font-bold text-sm text-white'
                        : 'font-sora font-bold text-sm text-brand-navy'
                    }
                  >
                    {t.name}
                  </div>
                  <div className="font-inter text-xs text-slate-400">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
