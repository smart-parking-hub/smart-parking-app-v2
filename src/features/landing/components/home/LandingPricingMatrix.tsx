import { Link } from 'react-router-dom'
import { Bus, Tractor, Truck } from 'lucide-react'

export function LandingPricingMatrix() {
  const tiers = [
    {
      name: 'Xe Tải Nhẹ (< 3.5 Tấn)',
      Icon: Bus,
      length: '< 6.2 mét',
      tripPrice: '30.000 đ',
      nightPrice: '60.000 đ',
      monthPrice: '1.200.000 đ',
      isPopular: false,
    },
    {
      name: 'Xe Tải Nặng (3.5T - 15T)',
      Icon: Truck,
      length: '< 9.8 mét',
      tripPrice: '50.000 đ',
      nightPrice: '100.000 đ',
      monthPrice: '2.100.000 đ',
      isPopular: false,
    },
    {
      name: 'Đầu Kéo Container 40ft',
      Icon: Truck,
      length: '14.5 mét',
      tripPrice: '80.000 đ',
      nightPrice: '160.000 đ',
      monthPrice: '3.500.000 đ',
      isPopular: true,
    },
    {
      name: 'Container 45ft & Fooc Lùn',
      Icon: Tractor,
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
            <h2 className="font-sora font-extrabold text-3xl sm:text-4xl lg:text-5xl text-brand-navy tracking-tight">
              Bảng Giá Thuê Bãi Niêm Yết
            </h2>
          </div>
          <p className="font-inter text-base sm:text-lg text-slate-600 max-w-md">
            Áp dụng đồng nhất cho các cụm bãi chuẩn SmartHub. Miễn phí 15 phút đầu vào trả hàng. Chiết khấu 15% cho hợp đồng đoàn xe trên 10 chiếc.
          </p>
        </div>

        {/* Mobile View: Vertical Cards to avoid side-scroll */}
        <div className="md:hidden flex flex-col gap-5">
          {tiers.map((row) => {
            const RowIcon = row.Icon
            return (
              <div
                key={row.name}
                className={`p-6 rounded-2xl transition-colors ${
                  row.isPopular ? 'bg-white border-2 border-brand-orange' : 'bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                      <RowIcon
                        className={`h-5 w-5 ${row.isPopular ? 'text-brand-orange' : 'text-slate-600'}`}
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <h3 className="font-sora font-bold text-base text-brand-navy">{row.name}</h3>
                      <p className="font-inter text-sm text-slate-500">Chiều dài tối đa: {row.length}</p>
                    </div>
                  </div>
                  {row.isPopular && (
                    <span className="bg-brand-orange text-[#060D1A] text-sm font-bold px-2.5 py-1 rounded-md">
                      Phổ biến
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 py-3 px-2 bg-slate-50/80 rounded-xl my-3 text-center">
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Theo lượt</div>
                    <div className="font-sora font-bold text-base text-brand-navy">{row.tripPrice}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Qua đêm</div>
                    <div className="font-sora font-bold text-base text-brand-navy">{row.nightPrice}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Theo tháng</div>
                    <div className="font-sora font-bold text-base text-[#9A3412]">{row.monthPrice}</div>
                  </div>
                </div>

                <Link
                  to="/search"
                  className={`mt-2 w-full flex items-center justify-center font-sora font-semibold text-sm py-3 rounded-xl transition-all ${
                    row.isPopular
                      ? 'bg-brand-orange hover:bg-brand-orange-hover text-[#060D1A] font-bold'
                      : 'bg-slate-100 hover:bg-brand-orange hover:text-[#060D1A] text-brand-navy'
                  }`}
                >
                  {row.isPopular ? 'Đặt chỗ ưu tiên' : 'Đặt chỗ ngay'}
                </Link>
              </div>
            )
          })}
        </div>

        {/* Desktop View: Full Comparison Table */}
        <div className="hidden md:block bg-white rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-sora text-sm font-semibold">
                  <th scope="col" className="py-4 px-6">Loại Phương Tiện</th>
                  <th scope="col" className="py-4 px-6">Chiều Dài Xe Tối Đa</th>
                  <th scope="col" className="py-4 px-6">Giá Theo Lượt (0-4h)</th>
                  <th scope="col" className="py-4 px-6">Giá Qua Đêm (18h-06h)</th>
                  <th scope="col" className="py-4 px-6">Thuê Cố Định Theo Tháng</th>
                  <th scope="col" className="py-4 px-6 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-inter text-base text-slate-800">
                {tiers.map((row) => {
                  const RowIcon = row.Icon
                  return (
                    <tr
                      key={row.name}
                      className={
                        row.isPopular
                          ? 'bg-brand-surface/40 hover:bg-slate-50/80 transition-colors'
                          : 'hover:bg-slate-50/70 transition-colors'
                      }
                    >
                      <th
                        scope="row"
                        className="py-4 px-6 font-semibold text-brand-navy flex items-center gap-3 text-left font-normal"
                      >
                        <RowIcon
                          className={`h-5 w-5 shrink-0 ${row.isPopular ? 'text-brand-orange' : 'text-slate-400'}`}
                          aria-hidden="true"
                        />
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-brand-navy">{row.name}</span>
                          {row.isPopular && (
                            <span className="bg-brand-orange text-[#060D1A] text-xs font-bold px-2 py-0.5 rounded">
                              Phổ biến
                            </span>
                          )}
                        </div>
                      </th>
                      <td className="py-4 px-6 text-sm text-slate-600">{row.length}</td>
                      <td className="py-4 px-6 font-semibold text-brand-navy">{row.tripPrice}</td>
                      <td className="py-4 px-6 font-semibold text-brand-navy">{row.nightPrice}</td>
                      <td className="py-4 px-6 font-bold text-[#9A3412]">{row.monthPrice}</td>
                      <td className="py-4 px-6 text-right">
                        <Link
                          to="/search"
                          className={
                            row.isPopular
                              ? 'inline-block bg-brand-orange text-[#060D1A] font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-brand-orange-hover transition-colors'
                              : 'inline-block bg-slate-100 hover:bg-brand-orange hover:text-[#060D1A] text-brand-navy font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors'
                          }
                        >
                          {row.isPopular ? 'Đặt ngay' : 'Đặt chỗ'}
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
