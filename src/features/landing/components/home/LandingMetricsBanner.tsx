export function LandingMetricsBanner() {
  const metrics = [
    {
      value: '20K+',
      label: 'Lượt Xe Lưu Bãi / Ngày',
      desc: 'Xác thực biển số và check-in tự động qua QR code',
      isAccent: true,
    },
    {
      value: '320+',
      label: 'Cụm Bãi Đỗ & Depot',
      desc: 'Bao phủ 18 tỉnh thành trọng điểm logistics Bắc - Nam',
      isAccent: false,
    },
    {
      value: '99.8%',
      label: 'Độ Chính Xác SLA Barie',
      desc: 'Không ùn tắc cổng phụ, giải tỏa áp lực giờ cao điểm',
      isAccent: false,
    },
    {
      value: '24/7',
      label: 'Điều Phối Hiện Trường',
      desc: 'Đội ngũ kỹ thuật hỗ trợ cứu hộ & điều xe liên tục',
      isAccent: true,
    },
  ]

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="flex flex-col"
            >
              <div className="font-sora font-extrabold text-4xl sm:text-5xl text-brand-navy tracking-tight">
                {metric.value}
              </div>
              <div className="font-inter text-base sm:text-lg font-bold text-slate-900 mt-2">
                {metric.label}
              </div>
              <div className="font-inter text-sm sm:text-base text-slate-600 mt-1.5 leading-relaxed">
                {metric.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
