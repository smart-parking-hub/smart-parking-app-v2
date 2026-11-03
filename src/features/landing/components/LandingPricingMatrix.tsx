import { Link } from 'react-router-dom'

export function LandingPricingMatrix() {
  const tiers = [
    {
      name: 'Xe Tải Nhẹ (< 3.5 Tấn)',
      icon: 'airport_shuttle',
      length: '< 6.2 mét',
      tripPrice: '30.000 đ',
      nightPrice: '60.000 đ',
      monthPrice: '1.200.000 đ',
      isPopular: false,
    },
    {
      name: 'Xe Tải Nặng (3.5T - 15T)',
      icon: 'rv_hookup',
      length: '< 9.8 mét',
      tripPrice: '50.000 đ',
      nightPrice: '100.000 đ',
      monthPrice: '2.100.000 đ',
      isPopular: false,
    },
    {
      name: 'Đầu Kéo Container 40ft',
      icon: 'local_shipping',
      length: '14.5 mét',
      tripPrice: '80.000 đ',
      nightPrice: '160.000 đ',
      monthPrice: '3.500.000 đ',
      isPopular: true,
    },
    {
      name: 'Container 45ft & Fooc Lùn',
      icon: 'agriculture',
      length: '> 16 mét',
      tripPrice: '110.000 đ',
      nightPrice: '220.000 đ',
      monthPrice: '4.600.000 đ',
      isPopular: false,
    },
  ]

  return (
    <section className="bg-brand-surface py-20 sm:py-28" id="bang-gia">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white border border-brand-border text-brand-orange text-xs font-semibold uppercase tracking-wider mb-3">
              BIỂU PHÍ NIÊM YẾT MINH BẠCH
            </div>
            <h2 className="font-sora font-extrabold text-3xl sm:text-4xl text-brand-navy tracking-tight">
              Bảng Giá Thuê Bãi Theo Loại Phương Tiện
            </h2>
          </div>
          <p className="font-inter text-xs sm:text-sm text-slate-500 max-w-sm">
            Áp dụng đồng nhất cho các cụm bãi chuẩn SmartHub. Miễn phí 15 phút đầu vào trả hàng. Chiết khấu thêm 15% cho hợp đồng đoàn xe trên 10 chiếc.
          </p>
        </div>

        {/* Comparison Matrix Table */}
        <div className="bg-white rounded-2xl border border-brand-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/80 border-b border-brand-border text-slate-600 font-sora text-xs uppercase tracking-wider">
                  <th className="py-4 px-6">Loại Phương Tiện</th>
                  <th className="py-4 px-6">Chiều Dài Xe Tối Đa</th>
                  <th className="py-4 px-6">Giá Theo Lượt (0-4h)</th>
                  <th className="py-4 px-6">Giá Qua Đêm (18h-06h)</th>
                  <th className="py-4 px-6">Thuê Cố Định Theo Tháng</th>
                  <th className="py-4 px-6 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-inter text-sm text-slate-700">
                {tiers.map((row) => (
                  <tr
                    key={row.name}
                    className={
                      row.isPopular
                        ? 'bg-brand-surface/40 hover:bg-slate-50 transition-colors'
                        : 'hover:bg-slate-50/70 transition-colors'
                    }
                  >
                    <td className="py-4 px-6 font-semibold text-brand-navy flex items-center gap-3">
                      <span className={`material-symbols-outlined ${row.isPopular ? 'text-brand-orange' : 'text-slate-400'}`}>
                        {row.icon}
                      </span>
                      <div className="flex items-center gap-2">
                        <span>{row.name}</span>
                        {row.isPopular && (
                          <span className="bg-brand-orange text-white text-[10px] font-bold px-2 py-0.5 rounded">
                            Phổ biến
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500">{row.length}</td>
                    <td className="py-4 px-6 font-semibold text-brand-navy">{row.tripPrice}</td>
                    <td className="py-4 px-6 font-semibold text-brand-navy">{row.nightPrice}</td>
                    <td className="py-4 px-6 font-bold text-brand-orange">{row.monthPrice}</td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        to="/search"
                        className={
                          row.isPopular
                            ? 'inline-block bg-brand-orange text-white font-semibold text-xs px-4 py-2 rounded-lg hover:bg-brand-orange-hover transition-colors'
                            : 'inline-block bg-slate-100 hover:bg-brand-orange hover:text-white text-brand-navy font-semibold text-xs px-4 py-2 rounded-lg transition-colors'
                        }
                      >
                        {row.isPopular ? 'Đặt ngay' : 'Đặt chỗ'}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
