interface ProfileCommandHeaderProps {
  station: string
}

export function ProfileCommandHeader({ station }: ProfileCommandHeaderProps) {
  return (
    <div className="flex flex-col gap-2 mb-6">
      {/* Breadcrumb & Top Eyebrow */}
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-orange-600 uppercase tracking-wider font-semibold">
          TÀI KHOẢN VẬN HÀNH DRIVER OPS
        </span>
        <span className="text-slate-400 font-mono text-xs">/</span>
        <span className="font-mono text-xs text-slate-500 uppercase tracking-wider">
          ĐỊNH DANH ĐIỆN TỬ EKYC
        </span>
      </div>

      {/* Title & Dispatch Status */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-sora text-slate-900 tracking-tight">
            Hồ Sơ Bác Tài &amp; Thông Tin Trực Ban
          </h1>
          <p className="text-sm md:text-base text-slate-600 max-w-3xl mt-1 leading-relaxed">
            Thông tin định danh tài xế đường dài, giấy phép lái xe hạng FC, thông tin liên lạc khẩn cấp 24/7 và cấu hình kênh nhận hóa đơn VAT điện tử về doanh nghiệp vận tải.
          </p>
        </div>

        {/* Live Station Status Badge */}
        <div className="flex items-center gap-2.5 self-start lg:self-auto bg-slate-200/80 px-4 py-2 rounded-xl text-slate-900 border border-slate-300/60 shadow-2xs">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-600 animate-pulse inline-block shrink-0" />
          <span className="font-mono text-xs uppercase tracking-wider font-bold">
            TRẠM ĐIỀU PHỐI ĐANG TRỰC: {station}
          </span>
        </div>
      </div>
    </div>
  )
}
