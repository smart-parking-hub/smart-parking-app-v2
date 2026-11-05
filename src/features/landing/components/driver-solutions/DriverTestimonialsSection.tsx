import { Snowflake, Star, Trailer, Truck } from 'lucide-react'

export function DriverTestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      quote:
        '"Chạy tuyến Bắc - Nam từ Tiên Sa ra Hải Phòng, ngán nhất là đêm hôm tìm bãi không biết còn chỗ không, đậu đại ở cây xăng thì lo ngay ngáy mất trộm bánh xe sơ-cua hoặc bị rút dầu. Từ hồi dùng app đặt trước ở cụm Đình Vũ, tới nơi quét mã cái rụp là vào ngủ thẳng cẳng."',
      author: 'Anh Hoàng Văn Tuấn',
      role: 'Tài xế xe đầu kéo · Tuyến Bắc - Nam (12 năm kinh nghiệm)',
      Icon: Truck,
    },
    {
      id: 2,
      quote:
        '"Kéo hàng nông sản lạnh từ miền Tây lên Cát Lái xuất khẩu sợ nhất là cắm máy lạnh mà đứt điện giữa chừng. Bãi trên SmartTruckHub kiểm định rõ ràng có trụ điện 380V riêng cho reefer, hóa đơn tiền điện tiền bãi gửi thẳng công ty quyết toán, không phải bỏ tiền túi ứng trước."',
      author: 'Bác Ba Hùng',
      role: 'Tài xế container lạnh 40ft · Tuyến Miền Tây - Cát Lái',
      Icon: Snowflake,
    },
    {
      id: 3,
      quote:
        '"Chạy cửa khẩu Hữu Nghị - Lạng Sơn vào vụ tắc đường kinh khủng. Trước kia toàn phải canh lốt cả đêm trên dốc, giờ book bãi trung chuyển có trạm cân 100 tấn ngay ngoài rìa, xe nằm an toàn, có phòng tắm nóng lạnh giặt giũ đàng hoàng, đảm bảo sức khỏe hôm sau chạy tiếp."',
      author: 'Anh Đỗ Minh Trí',
      role: 'Tài xế xe tải hạng nặng · Tuyến Hà Nội - Cửa Khẩu Hữu Nghị',
      Icon: Trailer,
    },
  ]

  return (
    <section className="w-full bg-[#EEF2F7] py-24 px-6 text-[#0F172A]" id="danh-gia-tai-xe">
      <div className="max-w-[1240px] mx-auto">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="font-sora text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A]">
            Những Chuyến Xe Bình An Sau Tay Lái
          </h2>
          <p className="font-inter text-base sm:text-lg text-slate-600 mt-3 max-w-xl">
            Hơn 45,000 bác tài khắp các tuyến huyết mạch tin dùng SmartTruckHub mỗi ngày để giữ an toàn cho hàng hóa và giấc ngủ.
          </p>
        </div>

        {/* 3 Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => {
            const Icon = t.Icon
            return (
              <div
                key={t.id}
                className="bg-white border border-slate-200/80 rounded-2xl p-7 flex flex-col justify-between hover:border-slate-400 transition-all"
              >
                <div>
                  <div className="flex items-center gap-1 text-brand-orange mb-4">
                    <Star className="h-4 w-4 fill-brand-orange" aria-hidden="true" />
                    <Star className="h-4 w-4 fill-brand-orange" aria-hidden="true" />
                    <Star className="h-4 w-4 fill-brand-orange" aria-hidden="true" />
                    <Star className="h-4 w-4 fill-brand-orange" aria-hidden="true" />
                    <Star className="h-4 w-4 fill-brand-orange" aria-hidden="true" />
                  </div>
                  <p className="font-inter text-base text-slate-700 leading-relaxed mb-6">
                    {t.quote}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="font-sora text-base font-bold text-slate-900">{t.author}</div>
                    <div className="text-sm text-slate-500 font-inter mt-0.5">{t.role}</div>
                  </div>
                  <Icon className="h-6 w-6 text-slate-400 shrink-0" aria-hidden="true" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
