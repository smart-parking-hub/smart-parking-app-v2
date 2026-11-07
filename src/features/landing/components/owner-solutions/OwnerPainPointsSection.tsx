import { Banknote, TrafficCone, Coins, ShieldCheck, CheckCircle2 } from 'lucide-react'

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
    <section className="w-full bg-slate-50/70 py-16 px-6 text-slate-900 border-b border-slate-200/80">
      <div className="max-w-[1240px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="font-inter text-xs font-semibold text-slate-500 uppercase tracking-normal mb-2">
            SO SÁNH HIỆU QUẢ VẬN HÀNH THỰC TẾ
          </div>
          <h2 className="font-sora text-lg sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 max-w-2xl">
            4 Lỗ Hổng Khiến Chủ Bãi Thất Thoát Hàng Trăm Triệu Mỗi Năm.
          </h2>
          <p className="font-inter text-sm sm:text-base text-slate-600 mt-2.5 max-w-xl">
            Thay thế hoàn toàn quy trình ghi sổ tay thủ công bằng nền tảng kiểm soát xe tải nặng
            chuẩn hóa, minh bạch dòng tiền từng phút đỗ.
          </p>
        </div>

        {/* 4 Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {painPoints.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-300 transition-colors shadow-xs"
              >
                <div>
                  <div className="mb-4">
                    <Icon className="h-6 w-6 text-brand-orange" aria-hidden="true" />
                  </div>
                  <div className="text-xs font-inter font-medium text-slate-500 mb-1">
                    Lỗ hổng #{item.id}
                  </div>
                  <h3 className="font-sora text-base sm:text-lg font-bold text-slate-900 mb-2.5">{item.title}</h3>
                  <p className="font-inter text-sm text-slate-600 leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <div className="text-xs font-inter font-semibold text-slate-900 mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-brand-orange shrink-0" aria-hidden="true" />
                    <span>Giải pháp SmartTruckHub</span>
                  </div>
                  <div className="font-inter text-xs text-slate-600 font-medium leading-relaxed">
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
