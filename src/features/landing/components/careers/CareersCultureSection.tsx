import { Terminal, Brain, TrendingUp, ShieldCheck } from 'lucide-react'

export function CareersCultureSection() {
  const cultures = [
    {
      step: '01 / THỰC ĐỊA LỚN',
      icon: Terminal,
      title: 'Giải Quyết Bài Toán Thực Địa Khó',
      description:
        'Xử lý hàng chục triệu sự kiện IoT barie, kết nối GPS telematics thời gian thực và tự động hóa hàng đợi điều phối cho cảng Cát Lái, Đình Vũ và các cao tốc trọng điểm.',
      tags: ['IoT Telematics', '<0.2s ALPR'],
    },
    {
      step: '02 / TỰ CHỦ HOÀN TOÀN',
      icon: Brain,
      title: 'Quyền Tự Chủ Tuyệt Đối (Ownership)',
      description:
        'Văn hóa dựa trên kết quả đầu ra (No micromanagement). Đội ngũ tự do đề xuất giải pháp kiến trúc mới, tự động hóa pipeline và sở hữu toàn diện sản phẩm được giao.',
      tags: ['Outcome-driven', 'Zero-Bureaucracy'],
    },
    {
      step: '03 / ĐÃI NGỘ XỨNG ĐÁNG',
      icon: TrendingUp,
      title: 'Lộ Trình Thăng Tiến & Cổ Phần ESOP',
      description:
        'Review lương định kỳ 2 lần/năm minh bạch. Cấp quỹ ngân sách đào tạo chứng chỉ quốc tế và chính sách ESOP dài hạn dành riêng cho các cá nhân cống hiến vượt trội.',
      tags: ['2x Review/Năm', 'ESOP Pool'],
    },
    {
      step: '04 / TOÀN DIỆN',
      icon: ShieldCheck,
      title: 'Chăm Sóc Sức Khỏe & Năng Lượng',
      description:
        'Gói bảo hiểm sức khỏe VIP PVI nội ngoại trú, khám định kỳ tại bệnh viện quốc tế cùng kỳ nghỉ teambuilding thường niên tại các resort tiêu chuẩn hàng đầu.',
      tags: ['Bảo Hiểm VIP PVI', 'Annual Retreat'],
    },
  ]

  return (
    <section className="w-full bg-slate-100 py-20 border-b border-[#E2E8F0]">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="font-sora text-xs uppercase tracking-wider text-[#F97316] font-bold">
              ĐẶC QUYỀN & MÔI TRƯỜNG
            </span>
            <h2 className="font-sora text-2xl lg:text-3xl text-[#060D1A] font-bold mt-2 tracking-tight">
              Văn Hóa Làm Việc Thực Chiến Tại SmartTruckHub
            </h2>
          </div>
          <p className="font-inter text-sm text-slate-600 max-w-md">
            Không thủ tục rườm rà. Mọi quyết định đều dựa trên dữ liệu vận hành và hiệu quả khai phóng chuỗi cung ứng.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cultures.map((item, idx) => {
            const Icon = item.icon
            return (
              <div
                key={idx}
                className="p-8 rounded-xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-sora text-xs font-bold text-[#F97316] tracking-wider">
                      {item.step}
                    </span>
                    <Icon className="w-7 h-7 text-[#F97316]" />
                  </div>
                  <h3 className="font-sora text-lg text-[#060D1A] mb-3 font-bold">
                    {item.title}
                  </h3>
                  <p className="font-inter text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-2.5">
                  {item.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="font-inter text-xs text-slate-700 bg-slate-100 px-3 py-1 rounded font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
