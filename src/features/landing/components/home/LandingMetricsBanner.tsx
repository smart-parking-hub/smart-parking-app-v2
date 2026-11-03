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
    <section className="bg-white py-14 sm:py-20 border-b border-brand-border">
      <div className="max-w-310 mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className={`flex flex-col border-l-2 pl-5 ${metric.isAccent ? 'border-brand-orange' : 'border-slate-300'}`}
            >
              <div className="font-sora font-extrabold text-4xl sm:text-5xl text-brand-navy tracking-tight">
                {metric.value}
              </div>
              <div className="font-inter text-xs sm:text-sm font-semibold text-slate-700 mt-2">
                {metric.label}
              </div>
              <div className="font-inter text-xs text-slate-400 mt-1 leading-relaxed">
                {metric.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
