import { Ship, Split, Video, ArrowUpCircle } from 'lucide-react'

interface GateArrivalProtocolSectionProps {
  vehiclePlate?: string
  berthCode?: string
}

export function GateArrivalProtocolSection({
  vehiclePlate = '51D-894.12',
  berthCode = 'Berth C-114',
}: GateArrivalProtocolSectionProps) {
  return (
    <section className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs">
      {/* Title */}
      <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-slate-900 text-orange-500 flex items-center justify-center shrink-0">
          <Ship className="w-4 h-4" />
        </div>
        <h2 className="font-sora text-base sm:text-lg font-bold text-slate-900 uppercase">
          QUY TRÌNH 3 BƯỚC CHECK-IN TẠI CỔNG BARIE TÂN CẢNG
        </h2>
      </div>

      {/* 3 Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Step 1 */}
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-orange-600 bg-orange-100/70 px-2 py-0.5 rounded">
              BƯỚC 01
            </span>
            <Split className="w-5 h-5 text-slate-500" />
          </div>
          <div className="font-sora font-bold text-slate-900 text-sm">
            Tiến vào Làn Barie Số 02
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Chạy xe vào đúng Làn chuyên dụng Container SmartTruck. Duy trì tốc độ dưới 10 km/h và dừng trước vạch vàng 1.5 mét.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-orange-600 bg-orange-100/70 px-2 py-0.5 rounded">
              BƯỚC 02
            </span>
            <Video className="w-5 h-5 text-slate-500" />
          </div>
          <div className="font-sora font-bold text-slate-900 text-sm">
            Nhận diện AI ALPR hoặc Quét QR
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Camera AI tự động đọc biển số {vehiclePlate} trong 0.2s. Nếu biển số bị bụi mờ, đưa màn hình mã QR trước mắt đọc quang học bên cửa cabin.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/80 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-orange-600 bg-orange-100/70 px-2 py-0.5 rounded">
              BƯỚC 03
            </span>
            <ArrowUpCircle className="w-5 h-5 text-slate-500" />
          </div>
          <div className="font-sora font-bold text-slate-900 text-sm">
            Barie Tự Nâng &amp; Đến {berthCode}
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Cần chắn mở tự động. Di chuyển theo mũi tên bảng LED điện tử trực tiếp đến vị trí {berthCode} đã giữ sẵn cắm sạc lạnh.
          </p>
        </div>
      </div>
    </section>
  )
}
