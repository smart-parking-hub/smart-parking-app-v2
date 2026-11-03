import { Gavel, Receipt, Shield, ShowerHead } from 'lucide-react'

export function LandingPainPointsSection() {
  const painPoints = [
    {
      id: '01',
      fearNumber: 'Nỗi sợ #01',
      title: 'Bị Phạt Dừng Đỗ Sai Quy Định',
      problem:
        'Đỗ lề đường chờ giờ cấm tải dễ bị phạt nặng, tước bằng lái và gián đoạn hợp đồng vận chuyển của chủ hàng.',
      solutionTitle: 'Giải pháp SmartTruckHub',
      solution:
        '320+ cụm bãi hợp pháp được cấp phép, cung cấp đầy đủ hóa đơn điện tử VAT để công ty vận tải hoàn tiền ngay.',
      Icon: Gavel,
    },
    {
      id: '02',
      fearNumber: 'Nỗi sợ #02',
      title: 'Rút Trộm Dầu & Mất Hàng Ban Đêm',
      problem:
        'Nằm chờ ca đêm ở khu công nghiệp vắng vẻ luôn tiềm ẩn nguy cơ bị cạy thùng container, cắt chì và rút trộm bình dầu.',
      solutionTitle: 'Giải pháp SmartTruckHub',
      solution:
        'Hệ thống Camera an ninh AI quét 360°, bảo vệ tuần tra 24/7 và gói bảo hiểm trách nhiệm lưu bãi lên tới 2 tỷ VNĐ.',
      Icon: Shield,
    },
    {
      id: '03',
      fearNumber: 'Nỗi sợ #03',
      title: 'Nghỉ Ngơi Tạm Bợ Thiếu Tiện Nghi',
      problem:
        'Ngủ lại trên cabin nóng bức, thiếu nước sạch, không có chỗ sạc điện làm suy giảm thể lực và an toàn khi cầm lái.',
      solutionTitle: 'Giải pháp SmartTruckHub',
      solution:
        'Bộ lọc bãi chuẩn hóa: Phòng tắm nóng lạnh miễn phí, nguồn điện Reefer 380V, quán ăn tài xế giá bình dân.',
      Icon: ShowerHead,
    },
    {
      id: '04',
      fearNumber: 'Nỗi sợ #04',
      title: 'Chặt Chém Giá Vé & Tranh Chấp',
      problem:
        'Thu tiền mặt tùy hứng vào ban đêm, không biên lai hóa đơn gây mâu thuẫn và thất thoát tiền tạm ứng của tài xế.',
      solutionTitle: 'Giải pháp SmartTruckHub',
      solution:
        'Biểu phí minh bạch theo khối giờ, khấu trừ tự động qua PayOS VietQR chuẩn xác tới từng phút xuất bãi.',
      Icon: Receipt,
    },
  ]

  return (
    <section className="w-full bg-[#EEF2F7] py-24 px-6 text-[#0F172A]" id="giai-phap-tai-xe">
      <div className="max-w-[1240px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="font-inter text-xs font-bold tracking-widest text-[#F97316] uppercase bg-white border border-[#D7DFE9] px-3 py-1 rounded mb-3">
            NHỮNG NỖI LO THƯỜNG TRỰC CỦA TÀI XẾ CONTAINER
          </span>
          <h2 className="font-sora text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0F172A] max-w-2xl">
            Được Thiết Kế Bởi Những Người Thấu Hiểu Bác Tài.
          </h2>
          <p className="font-inter text-sm sm:text-base text-[#475569] mt-3 max-w-xl">
            Chúng tôi xóa bỏ hoàn toàn áp lực rủi ro đường dài với hạ tầng lưu đỗ được kiểm chuẩn pháp lý và giám sát thời gian thực.
          </p>
        </div>

        {/* Bento Grid (4 Cards, Structural 1px Borders) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {painPoints.map((item) => {
            const Icon = item.Icon
            return (
              <div
                key={item.id}
                className="bg-white border border-[#D7DFE9] rounded-lg p-6 flex flex-col justify-between hover:border-[#1E3A5F] transition-colors"
              >
                <div>
                  <div className="w-10 h-10 rounded bg-[#EEF2F7] border border-[#D7DFE9] flex items-center justify-center text-[#F97316] mb-5">
                    <Icon className="h-6 w-6 text-[#F97316]" aria-hidden="true" />
                  </div>
                  <div className="text-xs font-inter font-semibold uppercase tracking-wider text-[#475569] mb-1">
                    {item.fearNumber}
                  </div>
                  <h3 className="font-sora text-lg font-bold text-[#0F172A] mb-3">
                    {item.title}
                  </h3>
                  <p className="font-inter text-sm text-[#475569] leading-relaxed mb-6">
                    {item.problem}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#D7DFE9]">
                  <div className="text-[11px] font-inter uppercase font-bold text-[#F97316] tracking-wider mb-1">
                    {item.solutionTitle}
                  </div>
                  <div className="font-inter text-xs text-[#0F172A] font-medium leading-relaxed">
                    {item.solution}
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
