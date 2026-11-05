export function AboutRoadmapSection() {
  const milestones = [
    {
      year: '2024',
      yearColor: 'text-[#F97316]',
      badge: 'ĐÃ HOÀN THÀNH',
      badgeClass: 'bg-slate-100 text-slate-600',
      title: 'Khởi Động & Thử Nghiệm Alpha',
      description:
        'Ra mắt phiên bản thử nghiệm tại Cát Lái với 15 bãi đầu tiên. Kiểm chứng giải pháp camera nhận diện biển số tự động ALPR trong điều kiện thời tiết khắc nghiệt.',
      isCurrent: false,
    },
    {
      year: '2025',
      yearColor: 'text-[#060D1A]',
      badge: 'ĐÃ HOÀN THÀNH',
      badgeClass: 'bg-slate-100 text-slate-600',
      title: 'Mở Rộng Quốc Lộ 1A',
      description:
        'Nhân rộng mạng lưới lên 120 bãi đỗ dọc tuyến hành lang kinh tế Bắc - Nam. Tích hợp cổng thanh toán tự động PayOS VietQR và cổng kết nối dữ liệu nhà xe.',
      isCurrent: false,
    },
    {
      year: '2026',
      yearColor: 'text-[#060D1A]',
      badge: 'GIAI ĐOẠN HIỆN TẠI',
      badgeClass: 'bg-[#F97316] text-white',
      title: 'Hợp Nhất 320+ Cụm Bãi',
      description:
        'Chạm mốc 320+ bãi và depot container. Kết nối API đồng bộ thời gian thực với hệ thống quản trị vận tải (TMS) của hơn 2,400 doanh nghiệp logistic hàng đầu.',
      isCurrent: true,
    },
    {
      year: '2027',
      yearColor: 'text-slate-400',
      badge: 'KẾ HOẠCH',
      badgeClass: 'bg-slate-100 text-slate-500',
      title: 'Hạ Tầng Xe Tải Điện (Heavy EV)',
      description:
        'Triển khai trạm sạc công suất lớn Megawatt Charging System (MCS) cho xe đầu kéo điện tại các điểm trung chuyển trọng yếu và điều phối luồng xe xanh.',
      isCurrent: false,
    },
  ]

  return (
    <section className="w-full bg-[#EEF2F7] py-24 px-6 lg:px-12 flex justify-center border-t border-[#E2E8F0]">
      <div className="max-w-[1240px] w-full flex flex-col">
        {/* Header */}
        <div className="mb-16">
          <span className="font-mono text-xs text-[#64748B] uppercase tracking-widest block mb-2 font-semibold">
            HÀNH TRÌNH PHÁT TRIỂN
          </span>
          <h2 className="font-sora font-bold text-2xl sm:text-3xl lg:text-4xl text-[#060D1A] tracking-tight">
            Cột Mốc Kiến Tạo Hạ Tầng Số
          </h2>
        </div>

        {/* 4-Column Timeline Track */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {milestones.map((item) => (
            <div
              key={item.year}
              className={`flex flex-col bg-white p-6 rounded ${
                item.isCurrent
                  ? 'border-2 border-[#F97316] relative shadow-sm'
                  : 'border border-[#E2E8F0]'
              }`}
            >
              {item.isCurrent ? (
                <>
                  <div className="absolute -top-3 right-4 px-2 py-0.5 rounded bg-[#F97316] text-white font-mono text-[11px] font-semibold tracking-wider uppercase">
                    {item.badge}
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-sora text-2xl font-bold text-[#060D1A]">
                      {item.year}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between mb-4">
                  <span className={`font-sora text-2xl font-bold ${item.yearColor}`}>
                    {item.year}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded font-mono text-[11px] font-semibold tracking-wider ${item.badgeClass}`}
                  >
                    {item.badge}
                  </span>
                </div>
              )}
              <h3 className="font-sora font-semibold text-base text-[#060D1A] mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
