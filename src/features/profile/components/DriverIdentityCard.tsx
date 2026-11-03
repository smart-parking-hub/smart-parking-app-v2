import { ShieldCheck, Star, Camera } from 'lucide-react'
import type { DriverProfile } from '../types/profileTypes'

interface DriverIdentityCardProps {
  profile: DriverProfile
  onOpenAvatarUpload: () => void
}

export function DriverIdentityCard({
  profile,
  onOpenAvatarUpload,
}: DriverIdentityCardProps) {
  return (
    <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-4">
      {/* Top Profile Strip */}
      <div className="flex items-start gap-4">
        {/* Avatar with Verified Badge & Upload trigger */}
        <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-slate-900 border border-slate-200 group">
          <img
            src={profile.avatarUrl}
            alt={profile.fullName}
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={onOpenAvatarUpload}
            className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
            title="Đổi ảnh đại diện"
          >
            <Camera className="w-5 h-5" />
          </button>
          <span className="absolute bottom-0 right-0 w-5 h-5 bg-orange-600 rounded-tl-lg flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-white" />
          </span>
        </div>

        {/* Identity Details */}
        <div className="flex flex-col min-w-0 flex-1">
          <h2 className="text-lg md:text-xl font-bold font-sora text-slate-900 truncate">
            {profile.fullName}
          </h2>
          <span className="font-mono text-xs text-slate-500 font-medium">
            {profile.driverCode}
          </span>
          <span className="font-mono text-xs font-bold text-slate-800 mt-0.5">
            {profile.phone}
          </span>

          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 border border-orange-200 text-orange-700 rounded-lg text-xs font-bold self-start">
            <span className="w-2 h-2 rounded-full bg-orange-600 animate-ping inline-block" />
            <span className="uppercase tracking-wider font-mono text-[11px]">
              {profile.dutyStatusText}
            </span>
          </div>
        </div>
      </div>

      {/* Professional Qualification Chip */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 font-mono">
              HẠNG {profile.licenseClass} CHUYÊN NGHIỆP
            </div>
            <div className="text-[11px] text-slate-500 leading-tight">
              {profile.experienceYears} năm vận tải Bắc - Nam liên tỉnh
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span className="font-mono text-xs font-bold text-slate-900">
            {profile.rating.toFixed(2)}/5.0
          </span>
        </div>
      </div>

      {/* Operational Bento Indicators (2x2 Grid) */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        {/* KPI 1 */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 flex flex-col justify-between">
          <span className="font-mono text-[10px] text-slate-500 block uppercase tracking-wider">
            Chuyến Hoàn Thành
          </span>
          <span className="text-xl font-bold font-sora text-slate-900 mt-1">
            {profile.kpis.completedTrips}
          </span>
          <span className="text-[11px] text-slate-600 block mt-0.5 truncate">
            {profile.kpis.completedTripsRoute}
          </span>
        </div>

        {/* KPI 2 */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 flex flex-col justify-between">
          <span className="font-mono text-[10px] text-slate-500 block uppercase tracking-wider">
            Vi Phạm Quá Giờ
          </span>
          <span className="text-xl font-bold font-sora text-slate-900 mt-1">
            {profile.kpis.overtimeViolations}
          </span>
          <span className="text-[11px] text-slate-600 block mt-0.5 truncate">
            {profile.kpis.overtimeViolationsDesc}
          </span>
        </div>

        {/* KPI 3 */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 flex flex-col justify-between">
          <span className="font-mono text-[10px] text-slate-500 block uppercase tracking-wider">
            Check-in Đúng Hạn
          </span>
          <span className="text-xl font-bold font-sora text-orange-600 mt-1">
            {profile.kpis.onTimeCheckinRate}
          </span>
          <span className="text-[11px] text-slate-600 block mt-0.5 truncate">
            {profile.kpis.onTimeCheckinDesc}
          </span>
        </div>

        {/* KPI 4 */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 flex flex-col justify-between">
          <span className="font-mono text-[10px] text-slate-500 block uppercase tracking-wider">
            Sự Cố Khiếu Nại
          </span>
          <span className="text-xl font-bold font-sora text-slate-900 mt-1">
            {profile.kpis.complaintIncidents}
          </span>
          <span className="text-[11px] text-slate-600 block mt-0.5 truncate">
            {profile.kpis.complaintIncidentsDesc}
          </span>
        </div>
      </div>
    </div>
  )
}
