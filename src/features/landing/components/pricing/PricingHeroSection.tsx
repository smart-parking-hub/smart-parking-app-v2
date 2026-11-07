interface PricingHeroSectionProps {
  billingType: 'turn' | 'month'
  onBillingTypeChange: (type: 'turn' | 'month') => void
}

export function PricingHeroSection({
  billingType,
  onBillingTypeChange,
}: PricingHeroSectionProps) {
  return (
    <section className="relative w-full bg-brand-navy text-white py-16 sm:py-20 lg:py-24 overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(var(--color-api-border)_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10 flex flex-col items-center text-center">
        {/* Pill Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-navy-light border border-api-border mb-6 max-w-full">
          <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse shrink-0" />
          <span className="font-inter text-[11px] sm:text-xs font-semibold tracking-wider text-brand-orange uppercase truncate">
            BIỂU PHÍ NIÊM YẾT VẬN HÀNH · MINH BẠCH 100%
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-sora font-extrabold text-2xl sm:text-4xl lg:text-[56px] lg:leading-[64px] max-w-4xl text-white mb-6 leading-tight tracking-tight">
          Định Phí Rõ Ràng. Tối Ưu Chi Phí Đỗ Cho{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-orange-hover">
            Từng Chuyến Hàng.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="font-inter text-sm sm:text-base lg:text-lg text-api-muted max-w-3xl mb-8 sm:mb-10 text-center leading-relaxed">
          Không phí ẩn, không phụ thu bất ngờ. Nền tảng miễn phí 100% cho tài xế tìm bãi, chiết khấu
          tối ưu chỉ 5% cho chủ mặt bằng và gói quản trị hạn mức cho doanh nghiệp 3PL.
        </p>

        {/* Billing Toggle Switch */}
        <div className="inline-flex max-w-full flex-wrap sm:flex-nowrap justify-center items-center bg-brand-navy-light p-1 sm:p-1.5 rounded-2xl sm:rounded-full border border-api-border shadow-inner mb-4 gap-1 sm:gap-0">
          <button
            type="button"
            className={`px-4 sm:px-6 py-2 rounded-full font-inter text-xs sm:text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange ${
              billingType === 'turn'
                ? 'text-white bg-api-border'
                : 'text-api-muted hover:text-white'
            }`}
            id="billing-per-turn"
            onClick={() => onBillingTypeChange('turn')}
          >
            Thanh toán theo lượt
          </button>
          <button
            type="button"
            className={`px-4 sm:px-6 py-2 rounded-full font-inter text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 sm:gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange ${
              billingType === 'month'
                ? 'text-white bg-api-border'
                : 'text-api-muted hover:text-white'
            }`}
            id="billing-monthly"
            onClick={() => onBillingTypeChange('month')}
          >
            <span>Hợp đồng tháng</span>
            <span className="px-2 py-0.5 text-[10px] sm:text-[11px] font-bold bg-brand-orange text-white rounded-full uppercase">
              -15%
            </span>
          </button>
        </div>

        <p className="font-inter text-xs text-api-muted/70 px-4">
          Áp dụng đối soát điện tử tức thì và miễn phí tích hợp hệ thống TMS
        </p>
      </div>
    </section>
  )
}
