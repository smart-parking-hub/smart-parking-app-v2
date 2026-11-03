import { Banknote, TrafficCone, Coins, ShieldCheck } from 'lucide-react'

export function OwnerPainPointsSection() {
  const painPoints = [
    {
      id: '01',
      icon: Banknote,
      title: 'Thất Thoát Tiền Mặt Bảo Vệ Ca Trực',
      description:
        'Bảo vệ xé vé tay không vào sổ, thu tiền mặt ban đêm rồi cho xe ra không hóa đơn. Chủ bãi không thể kiểm soát xe lạ đậu đêm lúc vắng mặt.',
      solution:
        'Barie ALPR quét biển số 360°, thanh toán 100% qua PayOS VietQR. Tiền chuyển thẳng về tài khoản ngân hàng chủ bãi T+1.',
    },
    {
      id: '02',
      icon: TrafficCone,
      title: 'Xe Đậu Lộn Xộn, Kẹt Nghẽn Đường Bãi',
      description:
        'Không phân làn container 20ft/40ft và xe tải thùng. Xe lớn đậu chắn lối thoát, giờ cao điểm gây ùn ứ tràn ra đường lộ bị xử phạt.',
      solution:
        'Hệ thống tự động gán vị trí đỗ theo kích thước xe tại cổng. Kích hoạt hàng đợi ảo (Virtual Queue) khi bãi đạt 90% công suất.',
    },
    {
      id: '03',
      icon: Coins,
      title: 'Giá Cước Cố Định, Lãng Phí Giờ Vàng',
      description:
        'Giờ cao điểm trước khi vào cảng bãi đông nhưng vẫn thu giá thấp. Ngược lại ban ngày bãi vắng tanh vì thiếu kênh tiếp cận các bác tài.',
      solution:
        'Ma trận biểu phí đa tầng linh hoạt: Tự động phụ thu giờ cao điểm, tính phí theo block 30 phút và tự động áp phạt quá giờ lũy tiến.',
    },
    {
      id: '04',
      icon: ShieldCheck,
      title: 'Tranh Chấp Va Quẹt, Mất Cắp Hàng Hóa',
      description:
        'Tài xế khiếu nại bãi làm móp méo vỏ container, cạy seal hoặc rút trộm dầu ban đêm mà chủ bãi không có bằng chứng hình ảnh lúc xe mới vào.',
      solution:
        'Camera AI chụp đồng thời 4 góc xe, seal container và tình trạng vỏ xe khi qua barie. Lưu trữ đám mây 7 năm làm bằng chứng pháp lý.',
    },
  ]

  return (
    <section className="w-full bg-[#EEF2F7] py-24 px-6 text-[#0F172A]">
      <div className="max-w-[1240px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="font-inter text-xs font-bold tracking-widest text-brand-orange uppercase bg-white border border-[#D7DFE9] px-3.5 py-1.5 rounded mb-3">
            SO SÁNH HIỆU QUẢ VẬN HÀNH THỰC TẾ
          </span>
          <h2 className="font-sora text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0F172A] max-w-2xl">
            4 Lỗ Hổng Khiến Chủ Bãi Thất Thoát Hàng Trăm Triệu Mỗi Năm.
          </h2>
          <p className="font-inter text-sm sm:text-base text-slate-600 mt-3 max-w-xl">
            Thay thế hoàn toàn quy trình ghi sổ tay thủ công bằng nền tảng kiểm soát xe tải nặng
            chuẩn hóa, minh bạch dòng tiền từng phút đỗ.
          </p>
        </div>

        {/* Bento Grid: 4 Comparison Cards (Fretrix Clean Architecture) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {painPoints.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.id}
                className="bg-white border border-[#D7DFE9] rounded-2xl p-6 flex flex-col justify-between hover:border-[#1E3A5F] transition-all hover:shadow-md"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-[#EEF2F7] border border-[#D7DFE9] flex items-center justify-center text-brand-orange mb-5">
                    <Icon className="h-6 w-6 text-brand-orange" aria-hidden="true" />
                  </div>
                  <div className="text-xs font-inter font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Lỗ hổng #{item.id}
                  </div>
                  <h3 className="font-sora text-lg font-bold text-[#0F172A] mb-3">{item.title}</h3>
                  <p className="font-inter text-sm text-slate-600 leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#D7DFE9]">
                  <div className="text-[11px] font-inter uppercase font-bold text-brand-orange tracking-wider mb-1">
                    Giải pháp SmartTruckHub
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
