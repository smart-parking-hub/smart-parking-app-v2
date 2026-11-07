import { CheckCircle2 } from 'lucide-react'

export function PricingComparisonTableSection() {
  const tableRows = [
    {
      feature: 'Quản lý & Đặt chỗ trước theo tọa độ GPS',
      driver: { type: 'icon' as const },
      fleet: { type: 'icon' as const },
      owner: { type: 'text' as const, label: 'Quản trị sơ đồ bãi' },
    },
    {
      feature: 'Tự động mở Barie ALPR (Nhận diện biển số 0.2s)',
      driver: { type: 'icon' as const },
      fleet: { type: 'icon' as const },
      owner: { type: 'icon' as const },
    },
    {
      feature: 'Hóa đơn điện tử VAT',
      driver: { type: 'text' as const, label: 'Theo chuyến lẻ' },
      fleet: { type: 'text' as const, label: 'Xuất gộp cuối tháng', highlight: true },
      owner: { type: 'text' as const, label: 'Đối soát doanh thu' },
    },
    {
      feature: 'Cổng thanh toán tự động PayOS VietQR',
      driver: { type: 'icon' as const },
      fleet: { type: 'icon' as const },
      owner: { type: 'icon' as const },
    },
    {
      feature: 'Ví công nợ tập trung (Fleet Corporate Wallet)',
      mobileFeature: 'Ví công nợ doanh nghiệp (Fleet Wallet)',
      driver: { type: 'dash' as const },
      fleet: { type: 'icon' as const },
      owner: { type: 'dash' as const },
    },
    {
      feature: 'Tích hợp API Webhook / Hệ thống TMS & ERP',
      driver: { type: 'dash' as const },
      fleet: { type: 'icon' as const },
      owner: { type: 'icon' as const },
    },
    {
      feature: 'Cam kết chất lượng SLA & Đường dây nóng 24/7',
      driver: { type: 'text' as const, label: 'Tiêu chuẩn (1900 6868)' },
      fleet: { type: 'text' as const, label: 'Ưu tiên (Chuyên viên riêng)', highlight: true },
      owner: { type: 'text' as const, label: 'Kỹ thuật 24/7' },
    },
  ]

  return (
    <section className="w-full bg-white py-20 lg:py-24 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="font-inter text-xs text-[#d95f00] font-bold uppercase tracking-wider">
            ĐỐI CHIẾU NĂNG LỰC HỆ THỐNG
          </span>
          <h2 className="font-sora text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] mt-2 mb-4 tracking-tight">
            Bảng So Sánh Tính Năng Chi Tiết
          </h2>
          <p className="font-inter text-sm sm:text-base text-[#475569]">
            Chọn giải pháp phù hợp với quy mô vận hành của bạn để chuẩn hóa dòng tiền và phương tiện.
          </p>
        </div>

        {/* Mobile View: Cards (< md) to prevent page-level horizontal overflow on 375px */}
        <div className="md:hidden space-y-4" data-testid="pricing-comparison-mobile">
          {tableRows.map((row) => (
            <div
              key={row.feature}
              className="p-4 rounded-xl border border-[#D7DFE9] bg-white shadow-xs space-y-3"
            >
              <h3 className="font-sora font-semibold text-sm text-[#0F172A] leading-snug">
                {row.mobileFeature || row.feature}
              </h3>
              <div className="grid grid-cols-1 gap-2 pt-2 border-t border-[#EEF2F7] text-xs font-inter">
                {/* Driver */}
                <div className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-[#F8FAFC]">
                  <span className="text-[#64748B] font-medium">Tài xế cá nhân</span>
                  <div className="font-semibold text-right">
                    {row.driver.type === 'icon' ? (
                      <CheckCircle2
                        className="h-4 w-4 text-[#d95f00] inline-block"
                        aria-hidden="true"
                      />
                    ) : row.driver.type === 'dash' ? (
                      <span className="text-[#94A3B8]">—</span>
                    ) : (
                      <span className="text-[#334155]">{row.driver.label}</span>
                    )}
                  </div>
                </div>

                {/* Fleet 3PL */}
                <div className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-[#FFF7ED] border border-[#FFEDD5]">
                  <span className="text-[#9A3412] font-semibold">Đội xe &amp; 3PL</span>
                  <div className="font-bold text-right">
                    {row.fleet.type === 'icon' ? (
                      <CheckCircle2
                        className="h-4 w-4 text-[#d95f00] inline-block"
                        aria-hidden="true"
                      />
                    ) : (
                      <span
                        className={
                          row.fleet.highlight ? 'font-bold text-[#d95f00]' : 'text-[#334155]'
                        }
                      >
                        {row.fleet.label}
                      </span>
                    )}
                  </div>
                </div>

                {/* Owner */}
                <div className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-[#F8FAFC]">
                  <span className="text-[#64748B] font-medium">Chủ bãi &amp; Depot</span>
                  <div className="font-semibold text-right">
                    {row.owner.type === 'icon' ? (
                      <CheckCircle2
                        className="h-4 w-4 text-[#d95f00] inline-block"
                        aria-hidden="true"
                      />
                    ) : row.owner.type === 'dash' ? (
                      <span className="text-[#94A3B8]">—</span>
                    ) : (
                      <span className="text-[#334155]">{row.owner.label}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Full Table (>= md) */}
        <div
          className="hidden md:block overflow-x-auto rounded-xl border border-[#D7DFE9]"
          data-testid="pricing-comparison-desktop"
        >
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#0F172A] text-white">
                <th className="py-4 px-6 font-inter text-xs sm:text-sm uppercase tracking-wider w-2/5 font-semibold">
                  Tính Năng Vận Hành
                </th>
                <th className="py-4 px-6 font-inter text-xs sm:text-sm uppercase tracking-wider text-center w-1/5 font-semibold">
                  Tài Xế Cá Nhân
                </th>
                <th className="py-4 px-6 font-inter text-xs sm:text-sm uppercase tracking-wider text-center w-1/5 bg-[#1E293B] text-[#d95f00] font-bold">
                  Đội Xe &amp; 3PL
                </th>
                <th className="py-4 px-6 font-inter text-xs sm:text-sm uppercase tracking-wider text-center w-1/5 font-semibold">
                  Chủ Bãi &amp; Depot
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D7DFE9] text-[#0F172A] font-inter text-sm">
              {tableRows.map((row) => (
                <tr key={row.feature} className="hover:bg-[#EEF2F7] transition-colors">
                  <td className="py-4 px-6 font-semibold">{row.feature}</td>

                  {/* Driver Col */}
                  <td className="py-4 px-6 text-center">
                    {row.driver.type === 'icon' ? (
                      <CheckCircle2
                        className="h-5 w-5 text-[#d95f00] mx-auto"
                        aria-hidden="true"
                      />
                    ) : row.driver.type === 'dash' ? (
                      <span className="text-[#D7DFE9] text-base">—</span>
                    ) : (
                      <span className="text-[#475569]">{row.driver.label}</span>
                    )}
                  </td>

                  {/* Fleet 3PL Col */}
                  <td className="py-4 px-6 text-center bg-[#EEF2F7]/50">
                    {row.fleet.type === 'icon' ? (
                      <CheckCircle2
                        className="h-5 w-5 text-[#d95f00] mx-auto"
                        aria-hidden="true"
                      />
                    ) : (
                      <span
                        className={
                          row.fleet.highlight ? 'font-bold text-[#d95f00]' : 'text-[#475569]'
                        }
                      >
                        {row.fleet.label}
                      </span>
                    )}
                  </td>

                  {/* Owner Col */}
                  <td className="py-4 px-6 text-center">
                    {row.owner.type === 'icon' ? (
                      <CheckCircle2
                        className="h-5 w-5 text-[#d95f00] mx-auto"
                        aria-hidden="true"
                      />
                    ) : row.owner.type === 'dash' ? (
                      <span className="text-[#D7DFE9] text-base">—</span>
                    ) : (
                      <span className="text-[#475569]">{row.owner.label}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
