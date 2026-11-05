import { Hourglass } from 'lucide-react'

interface MerchantSlotVirtualQueueCardProps {
  isQueueActive?: boolean
  activeVehicleTypeName?: string
}

export function MerchantSlotVirtualQueueCard({
  isQueueActive = true,
  activeVehicleTypeName = 'TRUCK_HEAVY',
}: MerchantSlotVirtualQueueCardProps) {
  return (
    <div className="p-5 lg:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-lg bg-[#ffdbca] text-[#d95f00] flex items-center justify-center shrink-0">
            <Hourglass className="w-4 h-4 text-[#d95f00]" />
          </div>
          <h4 className="font-sora text-base lg:text-lg text-slate-900 font-bold">
            Cơ Chế Hàng Đợi Ảo 15 Phút
          </h4>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mt-1">
          Hệ thống Fretrix tự động kích hoạt chức năng{' '}
          <strong className="text-slate-800">Hàng Đợi Ảo (Virtual Queue)</strong> cho loại
          xe tương ứng khi Available Capacity chạm mốc 0. Tài xế được cấp Ticket điện tử giữ chỗ
          trong 15 phút tại trạm đệm trước cổng.
        </p>
      </div>

      <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between font-mono text-xs">
        <span className="text-slate-500">Trạng thái Hàng Đợi:</span>
        {isQueueActive ? (
          <span className="px-2.5 py-1 rounded bg-[#341100] text-[#ffdbca] font-bold">
            ĐANG BẬT ({activeVehicleTypeName})
          </span>
        ) : (
          <span className="px-2.5 py-1 rounded bg-slate-200 text-slate-700 font-bold">
            SẴN SÀNG KÍCH HOẠT
          </span>
        )}
      </div>
    </div>
  )
}
