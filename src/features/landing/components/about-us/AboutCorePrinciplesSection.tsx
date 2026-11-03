import { Receipt, ShieldCheck, Gauge, HeartHandshake, CheckCircle2 } from 'lucide-react'

export function AboutCorePrinciplesSection() {
  const principles = [
    {
      num: '01',
      icon: Receipt,
      title: 'Minh Bạch (Radical Transparency)',
      description:
        'Triệt tiêu hoàn toàn nạn tiêu cực và phụ phí bến bãi bộc phát. Toàn bộ giá cước lưu bãi được niêm yết công khai từng block giờ. 100% giao dịch có biên lai đối soát và xuất hóa đơn điện tử VAT tự động về hệ thống kế toán doanh nghiệp vận tải.',
      footer: 'Không phí ẩn · Tự động đối chiếu PayOS VietQR',
    },
    {
      num: '02',
      icon: ShieldCheck,
      title: 'An Toàn (Zero-Compromise Security)',
      description:
        'Kiểm soát tuyệt đối với mạng lưới Camera AI 360° quét toàn diện cabin và container. Lực lượng bảo vệ tuần tra 24/7 kết hợp gói bảo hiểm trách nhiệm dân sự và lưu kho bãi lên đến 2 tỷ đồng cho mỗi phương tiện trong suốt thời gian đỗ.',
      footer: 'Bảo hiểm 2 Tỷ đồng · Chống trộm dầu & Cạy niêm phong',
    },
    {
      num: '03',
      icon: Gauge,
      title: 'Tốc Độ (Sub-Second Latency)',
      description:
        'Giải tỏa hoàn toàn điểm nghẽn ùn ứ trước barie. Thuật toán nhận diện quang học biển số (ALPR) xử lý dưới 0.2 giây với độ chính xác 99.4%, liên thông lệnh giữ chỗ đám mây giúp xe container không cần dừng lăn bánh để trình thẻ vật lý.',
      footer: 'Độ trễ < 0.2 giây · Giảm 90% ùn tắc cổng bãi',
    },
    {
      num: '04',
      icon: HeartHandshake,
      title: 'Cộng Đồng (Driver-First Empathy)',
      description:
        'Tài xế là xương sống của nền kinh tế vận tải. Tiêu chuẩn SmartTruck bắt buộc mọi trạm bãi phải cung cấp nhà tắm sạch sẽ, phòng nghỉ máy lạnh, điểm sạc điện bờ cho container lạnh (Reefer Shore Power) và nguồn nước nóng miễn phí.',
      footer: 'Trạm nghỉ chuẩn hóa · Trạm cắm Reefer 3-Phase',
    },
  ]

  return (
    <section className="w-full bg-[#EEF2F7] py-24 px-6 lg:px-12 flex justify-center border-b border-[#E2E8F0]">
      <div className="max-w-[1240px] w-full flex flex-col">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <span className="font-mono text-xs text-[#F97316] uppercase tracking-widest block mb-2 font-semibold">
              QUY CHUẨN VẬN HÀNH
            </span>
            <h2 className="font-sora font-bold text-2xl sm:text-3xl lg:text-4xl text-[#060D1A] tracking-tight">
              4 Trụ Cột Giá Trị Cốt Lõi
            </h2>
          </div>
          <p className="text-base text-slate-600 max-w-md font-normal leading-relaxed">
            Mỗi bãi đỗ gia nhập hệ sinh thái SmartTruck Hub đều phải cam kết tuân thủ nghiêm ngặt bộ tiêu chuẩn an toàn và công nghệ đồng nhất.
          </p>
        </div>

        {/* 4 Bento Grid Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {principles.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.num}
                className="p-8 rounded bg-white border border-[#E2E8F0] flex flex-col justify-between hover:border-slate-400 transition-colors shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-sora text-3xl text-slate-300 font-bold">
                      {item.num}
                    </span>
                    <div className="w-12 h-12 rounded bg-[#EEF2F7] border border-[#E2E8F0] flex items-center justify-center text-[#F97316]">
                      <Icon className="w-6 h-6" aria-hidden="true" />
                    </div>
                  </div>
                  <h3 className="font-sora font-bold text-lg sm:text-xl text-[#060D1A] mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6 font-normal">
                    {item.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-4 border-t border-[#E2E8F0] text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono">
                  <CheckCircle2 className="w-4 h-4 text-[#F97316] shrink-0" aria-hidden="true" />
                  <span>{item.footer}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
