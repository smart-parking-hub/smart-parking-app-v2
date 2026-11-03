import { CheckCircle2 } from 'lucide-react'

export function PricingComparisonTableSection() {
  const tableRows = [
    {
      feature: 'Quản lý & Đặt chỗ trước theo tọa độ GPS',
      driver: { type: 'icon' },
      fleet: { type: 'icon' },
      owner: { type: 'text', label: 'Quản trị sơ đồ bãi' },
    },
    {
      feature: 'Tự động mở Barie ALPR (Nhận diện biển số 0.2s)',
      driver: { type: 'icon' },
      fleet: { type: 'icon' },
      owner: { type: 'icon' },
    },
    {
      feature: 'Hóa đơn điện tử VAT',
      driver: { type: 'text', label: 'Theo chuyến lẻ' },
      fleet: { type: 'text', label: 'Xuất gộp cuối tháng', highlight: true },
      owner: { type: 'text', label: 'Đối soát doanh thu' },
    },
    {
      feature: 'Cổng thanh toán tự động PayOS VietQR',
      driver: { type: 'icon' },
      fleet: { type: 'icon' },
      owner: { type: 'icon' },
    },
    {
      feature: 'Ví công nợ tập trung (Fleet Corporate Wallet)',
      driver: { type: 'dash' },
      fleet: { type: 'icon' },
      owner: { type: 'dash' },
    },
    {
      feature: 'Tích hợp API Webhook / Hệ thống TMS & ERP',
      driver: { type: 'dash' },
      fleet: { type: 'icon' },
      owner: { type: 'icon' },
    },
    {
      feature: 'Cam kết chất lượng SLA & Đường dây nóng 24/7',
      driver: { type: 'text', label: 'Tiêu chuẩn (1900 6868)' },
      fleet: { type: 'text', label: 'Ưu tiên (Chuyên viên riêng)', highlight: true },
      owner: { type: 'text', label: 'Kỹ thuật 24/7' },
    },
  ]

  return (
    <section className="w-full bg-white py-20 lg:py-24">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-inter text-xs text-[#F97316] font-bold uppercase tracking-wider">
            ĐỐI CHIẾU NĂNG LỰC HỆ THỐNG
          </span>
          <h2 className="font-sora text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] mt-2 mb-4 tracking-tight">
            Bảng So Sánh Tính Năng Chi Tiết
          </h2>
          <p className="font-inter text-sm sm:text-base text-[#475569]">
            Chọn giải pháp phù hợp với quy mô vận hành của bạn để chuẩn hóa dòng tiền và phương tiện.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#D7DFE9]">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#0F172A] text-white">
                <th className="py-4 px-6 font-inter text-xs sm:text-sm uppercase tracking-wider w-2/5 font-semibold">
                  Tính Năng Vận Hành
                </th>
                <th className="py-4 px-6 font-inter text-xs sm:text-sm uppercase tracking-wider text-center w-1/5 font-semibold">
                  Tài Xế Cá Nhân
                </th>
                <th className="py-4 px-6 font-inter text-xs sm:text-sm uppercase tracking-wider text-center w-1/5 bg-[#1E293B] text-[#F97316] font-bold">
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
                        className="h-5 w-5 text-[#F97316] mx-auto"
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
                        className="h-5 w-5 text-[#F97316] mx-auto"
                        aria-hidden="true"
                      />
                    ) : (
                      <span
                        className={
                          row.fleet.highlight ? 'font-bold text-[#F97316]' : 'text-[#475569]'
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
                        className="h-5 w-5 text-[#F97316] mx-auto"
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
