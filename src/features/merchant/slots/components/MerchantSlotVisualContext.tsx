export function MerchantSlotVisualContext() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Photo 1: Terminal Map Context */}
      <div className="relative rounded-2xl overflow-hidden shadow-xs h-60 border border-slate-200/80 group">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          alt="Mặt bằng bến bãi Tân Cảng Cát Lái"
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1c2e]/90 via-[#0d1c2e]/50 to-transparent flex flex-col justify-end p-4 text-white">
          <span className="font-mono text-xs text-[#ffdbca] uppercase font-bold tracking-wider">
            MẶT BẰNG THỰC ĐỊA · CỤM BÃI GATE 2
          </span>
          <p className="text-xs text-slate-200 mt-1 leading-relaxed">
            Cơ sở Tân Cảng - Cát Lái trang bị 30 trạm sạc điện Reefer 380V và hệ thống cân tải tự
            động tại cổng vào.
          </p>
        </div>
      </div>

      {/* Photo 2: ALPR Gate System Context */}
      <div className="relative rounded-2xl overflow-hidden shadow-xs h-60 border border-slate-200/80 group">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          alt="Hệ thống Barie tự động nhận diện ALPR"
          src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1c2e]/90 via-[#0d1c2e]/50 to-transparent flex flex-col justify-end p-4 text-white">
          <span className="font-mono text-xs text-[#ffdbca] uppercase font-bold tracking-wider">
            HỆ THỐNG KIỂM SOÁT BARIE ALPR
          </span>
          <p className="text-xs text-slate-200 mt-1 leading-relaxed">
            Quản lý nhận diện biển số 24/7. Mọi thay đổi sức chứa sẽ đồng bộ xuống thiết bị biên
            chỉ trong 300ms.
          </p>
        </div>
      </div>
    </section>
  )
}
