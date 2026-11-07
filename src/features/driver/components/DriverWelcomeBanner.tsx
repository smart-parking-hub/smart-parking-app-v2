import { Link } from 'react-router-dom'
import { ArrowRight, ListPlus, Activity } from 'lucide-react'

interface DriverWelcomeBannerProps {
  driverName: string
  driverPhone?: string
}

export function DriverWelcomeBanner({
  driverName,
}: DriverWelcomeBannerProps) {
  return (
    <section className="w-full text-white rounded-xl mb-6 p-5 lg:p-6 border border-slate-800 bg-[#0f172a]">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="flex flex-col max-w-3xl">
          {/* Status chips */}
          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs font-normal border border-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d95f00]" />
              <span>Hạ tầng điều phối điểm đỗ thông minh · Cập nhật thời gian thực</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-xs font-normal border border-slate-700">
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              <span>Lưu thông: Ổn định tại Cát Lái &amp; Đình Vũ</span>
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-sora text-xl lg:text-2xl text-white tracking-tight font-semibold mb-1">
            <span className="text-slate-400 mr-2">Xin Chào,</span>
            <span>Bác Tài {driverName}</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Điều phối hành trình xe container, kiểm tra 320+ cụm bãi đỗ an toàn trên các tuyến vành
            đai và cao tốc Bắc - Nam.
          </p>
        </div>

        {/* CTA Actions: Compact and flat */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 sm:w-auto lg:w-[220px]">
          <Link
            to="/parking"
            className="w-full inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-brand-primary hover:bg-brand-primary-hover text-white font-medium text-xs transition-colors cursor-pointer text-center"
          >
            <span>Tìm bãi đỗ gần nhất</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/queues"
            className="w-full inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors border border-slate-700 cursor-pointer text-center"
          >
            <ListPlus className="w-3.5 h-3.5" />
            <span>Đợi slot</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
