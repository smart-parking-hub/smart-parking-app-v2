import { useState, useId } from 'react'
import { BarChart3, BadgeCheck } from 'lucide-react'

export function OwnerRoiCalculator() {
  const [slots, setSlots] = useState(150)
  const [rate, setRate] = useState(80000)
  const [occupancy, setOccupancy] = useState(75)

  const slotsId = useId()
  const rateId = useId()
  const occupancyId = useId()

  const approxArea = slots * 65
  // Turn factor = 1.25 turns/slot/day
  const monthlyRevenue = Math.round(slots * (occupancy / 100) * 1.25 * rate * 30)
  const annualRevenue = Math.round(monthlyRevenue * 12)

  const formatVND = (val: number) => new Intl.NumberFormat('vi-VN').format(val) + ' ₫'
  const annualBillionStr = (annualRevenue / 1000000000).toFixed(2).replace('.', ',')

  return (
    <section className="w-full bg-white py-24 px-6 text-[#0F172A]" id="roi-calculator">
      <div className="max-w-[1240px] mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-inter text-xs font-bold tracking-widest text-brand-orange uppercase bg-slate-100 border border-slate-200 px-3 py-1 rounded inline-block mb-3">
            CÔNG CỤ MÔ PHỎNG HIỆU QUẢ ĐẦU TƯ
          </span>
          <h2 className="font-sora text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0F172A]">
            Ước Tính Doanh Thu Khai Thác Bãi Của Bạn Mỗi Tháng.
          </h2>
          <p className="font-inter text-sm sm:text-base text-slate-600 mt-3">
            Tự động hóa toàn diện quy trình vận hành giúp nâng cao tỷ lệ lấp đầy thêm 25 - 40% và
            loại bỏ 100% thất thoát tiền mặt.
          </p>
        </div>

        {/* ROI Calculator Split Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Interactive Sliders (7 Cols) */}
          <div className="lg:col-span-7 bg-[#EEF2F7] border border-[#D7DFE9] p-8 rounded-2xl flex flex-col justify-between">
            <div className="space-y-6">
              {/* Slider 1: Sức chứa */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label
                    className="font-sora text-sm sm:text-base font-bold text-[#0F172A]"
                    htmlFor={slotsId}
                  >
                    1. Sức chứa &amp; Quy mô bãi
                  </label>
                  <span
                    className="font-inter text-sm bg-white border border-[#D7DFE9] px-3 py-1 rounded font-bold text-[#0F172A]"
                    id="roi-slots-display"
                  >
                    {slots} Slot Container (~{new Intl.NumberFormat('vi-VN').format(approxArea)} m²)
                  </span>
                </div>
                <input
                  id={slotsId}
                  className="w-full accent-brand-orange cursor-pointer h-2 bg-slate-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                  max="500"
                  min="30"
                  step="10"
                  type="range"
                  value={slots}
                  onChange={(e) => setSlots(Number(e.target.value))}
                  aria-label="Sức chứa và quy mô bãi container"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1 font-inter">
                  <span>Bãi nhỏ (30 slot)</span>
                  <span>Bãi trung bình (150 slot)</span>
                  <span>Depot quy mô lớn (500 slot)</span>
                </div>
              </div>

              {/* Slider 2: Đơn giá */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label
                    className="font-sora text-sm sm:text-base font-bold text-[#0F172A]"
                    htmlFor={rateId}
                  >
                    2. Đơn giá lưu bãi bình quân / lượt
                  </label>
                  <span
                    className="font-inter text-sm bg-white border border-[#D7DFE9] px-3 py-1 rounded font-bold text-[#0F172A]"
                    id="roi-rate-display"
                  >
                    {formatVND(rate)} / lượt
                  </span>
                </div>
                <input
                  id={rateId}
                  className="w-full accent-brand-orange cursor-pointer h-2 bg-slate-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                  max="250000"
                  min="40000"
                  step="10000"
                  type="range"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  aria-label="Đơn giá lưu bãi bình quân mỗi lượt"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1 font-inter">
                  <span>40.000 ₫ (Xe tải nhẹ)</span>
                  <span>80.000 ₫ (Container tiêu chuẩn)</span>
                  <span>250.000 ₫ (Cắm điện lạnh &amp; qua đêm)</span>
                </div>
              </div>

              {/* Slider 3: Tỷ lệ lấp đầy */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label
                    className="font-sora text-sm sm:text-base font-bold text-[#0F172A]"
                    htmlFor={occupancyId}
                  >
                    3. Tỷ lệ lấp đầy kỳ vọng với SmartTruckHub
                  </label>
                  <span
                    className="font-inter text-sm bg-white border border-[#D7DFE9] px-3 py-1 rounded font-bold text-[#0F172A]"
                    id="roi-occupancy-display"
                  >
                    {occupancy}% Công suất
                  </span>
                </div>
                <input
                  id={occupancyId}
                  className="w-full accent-brand-orange cursor-pointer h-2 bg-slate-300 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                  max="95"
                  min="40"
                  step="5"
                  type="range"
                  value={occupancy}
                  onChange={(e) => setOccupancy(Number(e.target.value))}
                  aria-label="Tỷ lệ lấp đầy kỳ vọng với SmartTruckHub"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1 font-inter">
                  <span>40% (Truyền thống vắng khách)</span>
                  <span>75% (Kết nối sàn SmartTruck)</span>
                  <span>95% (Cạnh cảng biển cao điểm)</span>
                </div>
              </div>
            </div>

            {/* Explanatory note */}
            <div className="mt-6 pt-4 border-t border-[#D7DFE9] text-xs font-inter text-slate-600">
              <strong className="text-[#0F172A]">Cơ sở dữ liệu thực địa:</strong> Dựa trên dữ liệu
              thực tế tại 120+ bãi đối tác quanh cụm Cát Lái, ICD Sóng Thần, và Đình Vũ Hải Phòng.
              Hệ số luân chuyển trung bình đạt 1.25 lượt/slot/ngày.
            </div>
          </div>

          {/* Right: Result Card (5 Cols - Dark Navy Fretrix Cockpit) */}
          <div className="lg:col-span-5 bg-brand-navy border border-[#1E3A5F] rounded-2xl p-8 text-white flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="font-inter text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  KẾT QUẢ DỰ BÁO TÀI CHÍNH
                </span>
                <BarChart3 className="h-5 w-5 text-brand-orange" aria-hidden="true" />
              </div>

              <div className="py-6">
                <span className="text-xs uppercase tracking-wider text-slate-400">
                  Doanh thu dự kiến mỗi tháng:
                </span>
                <div
                  className="font-sora font-extrabold text-3xl sm:text-4xl text-brand-orange mt-2"
                  id="roi-result-revenue"
                >
                  {formatVND(monthlyRevenue)}
                </div>
                <span className="text-xs text-slate-400 mt-1 block font-inter">
                  Tương đương ~ {annualBillionStr} tỷ ₫ mỗi năm
                </span>
              </div>

              <div className="space-y-3 pt-2 font-inter text-xs">
                <div className="flex justify-between items-center py-2.5 px-3 bg-brand-navy-light rounded-lg border border-slate-800">
                  <span className="text-slate-300">Tiết kiệm nhân sự gác cổng:</span>
                  <span className="font-sora font-bold text-white">~ 25.000.000 ₫ / tháng</span>
                </div>
                <div className="flex justify-between items-center py-2.5 px-3 bg-brand-navy-light rounded-lg border border-slate-800">
                  <span className="text-slate-300">Chống thất thoát tiền mặt:</span>
                  <span className="font-sora font-bold text-brand-orange">100% Thu tự động</span>
                </div>
                <div className="flex justify-between items-center py-2.5 px-3 bg-brand-navy-light rounded-lg border border-slate-800">
                  <span className="text-slate-300">Quyết toán doanh thu:</span>
                  <span className="font-sora font-bold text-white">T+1 Vào Ngân Hàng</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 space-y-3">
              <a
                className="w-full inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-sora font-semibold text-sm py-4 rounded-xl shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                href="#onboarding-form"
              >
                <span>ĐĂNG KÝ KHẢO SÁT MẶT BẰNG MIỄN PHÍ</span>
                <BadgeCheck className="h-5 w-5 text-white" aria-hidden="true" />
              </a>
              <p className="text-center text-[11px] text-slate-400 font-inter">
                Kỹ sư thực địa SmartTruckHub khảo sát mặt bằng trong vòng 24 giờ làm việc.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
