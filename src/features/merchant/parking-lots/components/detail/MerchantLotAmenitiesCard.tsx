import {
  CheckSquare,
  ShieldCheck,
  Video,
  Zap,
  Scale,
  ShowerHead,
  UtensilsCrossed,
} from 'lucide-react'

export function MerchantLotAmenitiesCard() {
  const amenitiesList = [
    {
      id: 1,
      icon: ShieldCheck,
      iconColor: 'text-blue-600',
      title: 'Bảo Vệ Tuần Tra 24/7',
      desc: 'Chốt gác 2 cổng + tuần tra xe máy ban đêm',
    },
    {
      id: 2,
      icon: Video,
      iconColor: 'text-blue-600',
      title: 'Hệ Thống Camera AI 360°',
      desc: 'Lưu trữ 45 ngày, tự động phát hiện xâm nhập',
    },
    {
      id: 3,
      icon: Zap,
      iconColor: 'text-[#d95f00]',
      title: 'Trạm Sạc Container Reefer 380V',
      desc: '30 Ổ cắm công nghiệp Mennekes IP67',
    },
    {
      id: 4,
      icon: Scale,
      iconColor: 'text-blue-600',
      title: 'Trạm Cân Điện Tử 100 Tấn',
      desc: 'In phiếu cân tải trọng tức thì cho hải quan',
    },
    {
      id: 5,
      icon: ShowerHead,
      iconColor: 'text-blue-600',
      title: 'Phòng Tắm Nóng Lạnh Miễn Phí',
      desc: '08 Buồng riêng biệt vệ sinh chuẩn khách sạn',
    },
    {
      id: 6,
      icon: UtensilsCrossed,
      iconColor: 'text-blue-600',
      title: 'Căng Tin & Cơm Tài Xế Đối Diện',
      desc: 'Mở cửa 24/24, phục vụ cơm niêu và cà phê võng',
    },
  ]

  return (
    <div className="bg-white p-5 lg:p-6 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
        <div className="w-8 h-8 rounded-lg bg-[#eff4ff] flex items-center justify-center text-slate-800">
          <CheckSquare className="w-4 h-4 text-slate-700" />
        </div>
        <div>
          <h2 className="font-sora text-base lg:text-lg text-[#0d1c2e] font-bold">
            Tiện Ích Thực Tế Tại Bến
          </h2>
          <p className="text-xs text-slate-500">Cơ sở hạ tầng phục vụ phương tiện và tài xế</p>
        </div>
      </div>

      {/* Checklist */}
      <div className="flex flex-col gap-2.5">
        {amenitiesList.map((item) => {
          const Icon = item.icon

          return (
            <div
              key={item.id}
              className="flex items-start gap-3 p-3 rounded-xl bg-[#eff4ff]/40 border border-slate-200/60"
            >
              <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shadow-2xs shrink-0 mt-0.5">
                <Icon className={`w-4 h-4 ${item.iconColor}`} />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-xs sm:text-sm text-[#0d1c2e]">
                  {item.title}
                </span>
                <span className="font-mono text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  {item.desc}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
