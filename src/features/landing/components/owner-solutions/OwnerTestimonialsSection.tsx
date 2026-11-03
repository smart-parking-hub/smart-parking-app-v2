import { Star, Warehouse, Snowflake, Truck } from 'lucide-react'

export function OwnerTestimonialsSection() {
  const testimonials = [
    {
      id: 'dinh-vu',
      stars: 5,
      quote:
        'Trước đây bãi 15.000 m² của tôi thuê 4 bảo vệ chia 3 ca trực, cuối tháng kiểm kê sổ vé lúc nào cũng chênh lệch tiền mặt 15-20 triệu. Sau khi gắn Barie ALPR của SmartTruckHub, 100% tài xế quét PayOS hoặc trừ ví. Doanh thu tháng đầu tăng thêm 68 triệu mà tôi không cần phải xuống bãi giám sát.',
      author: 'Ông Trần Đình Hùng',
      role: 'Chủ Bãi Container Đình Vũ (Hải Phòng)',
      meta: 'QUY MÔ: 180 SLOT CONT · HỢP TÁC TỪ 2024',
      icon: Warehouse,
    },
    {
      id: 'song-than',
      stars: 5,
      quote:
        'Cái hay nhất là tính năng Điều phối Hàng đợi ảo và Phân luồng xe 40ft lạnh. Xe đến nơi quét mã trong 0.2 giây là barie mở, không còn cảnh kẹt xe tràn ra đường ĐT743 như trước. Các chủ hàng chạy lạnh rất thích bãi tôi vì hệ thống tự động ghi nhận số giờ cắm điện Reefer minh bạch.',
      author: 'Bà Lê Thị Kim Oanh',
      role: 'Bãi Xe & Kho ICD Sóng Thần (Bình Dương)',
      meta: 'QUY MÔ: 220 SLOT · 2 CỔNG ALPR AI',
      icon: Snowflake,
    },
    {
      id: 'long-an',
      stars: 5,
      quote:
        'Đất mặt tiền QL1A của tôi trước đây chỉ làm quán cơm và rửa xe, ban đêm bãi trống rất uổng. Khi kết nối lên ứng dụng SmartTruckHub, các bác tài chạy tuyến Tây Nam Bộ - TP.HCM tự tìm đến nghỉ đêm. Tôi chỉ việc mở ứng dụng xem tiền đổ về ví Vietcombank mỗi sáng.',
      author: 'Ông Nguyễn Văn Phúc',
      role: 'Trạm Dừng Nghỉ QL1A (Bến Lức, Long An)',
      meta: 'QUY MÔ: 80 XE TẢI NẶNG · DOANH THU +45 TR/THÁNG',
      icon: Truck,
    },
  ]

  return (
    <section className="w-full bg-[#EEF2F7] py-24 px-6 text-[#0F172A]">
      <div className="max-w-[1240px] mx-auto">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="font-inter text-xs font-bold tracking-widest text-brand-orange uppercase bg-white border border-[#D7DFE9] px-3.5 py-1.5 rounded mb-3">
            Ý KIẾN ĐỐI TÁC KHAI THÁC THỰC TẾ
          </span>
          <h2 className="font-sora text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0F172A]">
            Những Chủ Bãi Đang Vận Hành Cùng SmartTruckHub.
          </h2>
          <p className="font-inter text-sm sm:text-base text-slate-600 mt-2 max-w-xl">
            Minh chứng hiệu quả tăng trưởng công suất lấp đầy và kiểm soát thất thoát tuyệt đối từ
            các cụm bến bãi container trọng điểm.
          </p>
        </div>

        {/* 3 Testimonial Cards Grid (Fretrix Clean Architecture) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.id}
                className="bg-white border border-[#D7DFE9] rounded-2xl p-6 flex flex-col justify-between hover:border-[#1E3A5F] transition-all hover:shadow-md"
              >
                <div>
                  <div className="flex items-center gap-1 text-brand-orange mb-4">
                    {[...Array(item.stars)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-brand-orange text-brand-orange"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="font-inter text-sm text-[#0F172A] leading-relaxed mb-6 italic">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>
                <div className="pt-4 border-t border-[#D7DFE9] flex items-center justify-between">
                  <div>
                    <div className="font-sora text-sm font-bold text-[#0F172A]">{item.author}</div>
                    <div className="text-xs text-slate-500 font-inter">{item.role}</div>
                    <div className="text-[11px] text-slate-400 font-inter mt-0.5">{item.meta}</div>
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
