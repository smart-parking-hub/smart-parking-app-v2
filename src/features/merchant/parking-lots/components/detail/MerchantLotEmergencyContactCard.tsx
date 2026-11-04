import { Headphones, Phone, Radio, ShieldCheck } from 'lucide-react'
import type { YardOperationalProfile } from '../../types/merchantParkingLotTypes'

interface MerchantLotEmergencyContactCardProps {
  operationalProfile: YardOperationalProfile
}

export function MerchantLotEmergencyContactCard({
  operationalProfile,
}: MerchantLotEmergencyContactCardProps) {
  const {
    managerName,
    managerPhone,
    managerOtpVerified,
    uhfRadioChannel,
    uhfNote,
    techHotline,
    techSlaNotice,
  } = operationalProfile

  return (
    <div className="bg-white p-5 lg:p-6 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
        <div className="w-8 h-8 rounded-lg bg-[#eff4ff] flex items-center justify-center text-slate-800">
          <Headphones className="w-4 h-4 text-slate-700" />
        </div>
        <div>
          <h2 className="font-sora text-base lg:text-lg text-[#0d1c2e] font-bold">
            Kênh Trực Ban Bãi Đỗ
          </h2>
          <p className="text-xs text-slate-500">Đầu mối liên lạc khẩn cấp và bảo dưỡng thiết bị</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {/* Manager info */}
        <div className="p-3.5 rounded-xl bg-[#eff4ff]/40 border border-slate-200/60 flex flex-col gap-1">
          <div className="text-slate-500 font-mono text-[11px] uppercase font-semibold">
            Trưởng Bãi Trực Ban
          </div>
          <div className="text-xs sm:text-sm text-[#0d1c2e] font-bold flex items-center justify-between">
            <span>{managerName}</span>
            {managerOtpVerified && (
              <span className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 inline-flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3 h-3 text-blue-600" />
                OTP Verified
              </span>
            )}
          </div>
          <a
            href={`tel:${managerPhone.replace(/\s+/g, '')}`}
            className="font-mono text-sm text-[#0d1c2e] hover:text-[#d95f00] font-bold mt-1 inline-flex items-center gap-1.5 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#d95f00]" />
            <span>{managerPhone}</span>
          </a>
        </div>

        {/* Radio VHF channel */}
        <div className="p-3.5 rounded-xl bg-[#eff4ff]/40 border border-slate-200/60 flex flex-col gap-1">
          <div className="text-slate-500 font-mono text-[11px] uppercase font-semibold">
            Bộ Đàm Nội Bộ Điều Phối
          </div>
          <div className="font-mono text-xs sm:text-sm font-bold text-[#0d1c2e] flex items-center gap-1.5 mt-0.5">
            <Radio className="w-3.5 h-3.5 text-blue-600" />
            <span>{uhfRadioChannel}</span>
          </div>
          <span className="text-slate-500 font-mono text-[11px] mt-0.5">{uhfNote}</span>
        </div>

        {/* Barie tech hotline */}
        <div className="p-4 rounded-xl bg-[#131b2e] text-white flex flex-col gap-1 shadow-md border border-slate-700/60">
          <div className="text-[#ffdbca] font-mono text-[11px] uppercase font-bold tracking-wider">
            Hotline Kỹ Thuật Barie Fretrix 24/7
          </div>
          <a
            href="tel:19006868"
            className="font-mono text-lg sm:text-xl text-[#ffdbca] hover:text-white font-bold flex items-center gap-2 my-0.5 transition-colors"
          >
            <Phone className="w-5 h-5 text-[#d95f00]" />
            <span>{techHotline}</span>
          </a>
          <span className="font-mono text-[11px] text-slate-300">{techSlaNotice}</span>
        </div>
      </div>
    </div>
  )
}
