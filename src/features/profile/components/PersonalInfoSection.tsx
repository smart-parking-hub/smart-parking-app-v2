import { useState } from 'react'
import { UserCheck, CheckCircle2, Eye, EyeOff } from 'lucide-react'
import type { DriverProfile } from '../types/profileTypes'

interface PersonalInfoSectionProps {
  profile: DriverProfile
  address: string
  onAddressChange: (val: string) => void
  fullName: string
  onFullNameChange: (val: string) => void
  phone: string
  onPhoneChange: (val: string) => void
}

export function PersonalInfoSection({
  profile,
  address,
  onAddressChange,
  fullName,
  onFullNameChange,
  phone,
  onPhoneChange,
}: PersonalInfoSectionProps) {
  const [isCccdMasked, setIsCccdMasked] = useState(true)

  return (
    <section className="bg-white p-6 md:p-7 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-5">
      {/* Section Title */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
            <UserCheck className="w-4 h-4" />
          </div>
          <h3 className="font-sora font-bold text-slate-900 text-base md:text-lg">
            1. Thông tin cá nhân &amp; Giấy phép lái xe FC
          </h3>
        </div>
        <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg font-mono text-xs font-bold uppercase tracking-wider">
          EKYC ĐÃ XÁC THỰC
        </span>
      </div>

      {/* Grid Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="profile-fullname" className="text-xs font-bold font-mono text-slate-700 uppercase">
            Họ và tên bác tài
          </label>
          <input
            id="profile-fullname"
            type="text"
            value={fullName}
            onChange={(e) => onFullNameChange(e.target.value)}
            className="h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
          />
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="profile-phone" className="text-xs font-bold font-mono text-slate-700 uppercase flex items-center justify-between">
            <span>Số điện thoại đăng nhập</span>
            <span className="text-orange-600 font-mono text-[11px] font-bold">
              ĐÃ XÁC THỰC OTP
            </span>
          </label>
          <div className="relative">
            <input
              id="profile-phone"
              type="text"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              className="h-11 pl-3.5 pr-9 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900 text-sm w-full focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
            />
            <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute right-3 top-3.5" />
          </div>
        </div>

        {/* CCCD Mask/Unmask */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="profile-cccd" className="text-xs font-bold font-mono text-slate-700 uppercase">
            Số thẻ CCCD / Mã định danh
          </label>
          <div className="h-11 px-3.5 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between">
            <span id="profile-cccd" className="font-mono text-sm font-semibold text-slate-900 tracking-wider">
              {isCccdMasked ? profile.maskedCccd : profile.cccdNumber}
            </span>
            <button
              type="button"
              onClick={() => setIsCccdMasked(!isCccdMasked)}
              className="text-slate-600 hover:text-slate-900 flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded hover:bg-slate-200 transition-colors cursor-pointer"
            >
              {isCccdMasked ? (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Hiện</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Ẩn</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* GPLX FC */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-bold font-mono text-slate-700 uppercase">
            Giấy phép lái xe Hạng FC
          </span>
          <div className="h-11 px-3.5 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-slate-900 text-white text-[11px] font-mono font-bold px-1.5 py-0.5 rounded">
                FC
              </span>
              <span className="font-mono text-sm font-bold text-slate-900">
                {profile.licenseNumber}
              </span>
            </div>
            <span className="font-mono text-[11px] font-semibold text-orange-600">
              HẠN: {profile.licenseExpiry}
            </span>
          </div>
        </div>
      </div>

      {/* Authority Info Strip */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-slate-600">
        <span>
          Cơ quan cấp GPLX: <strong className="text-slate-900">{profile.issuingAuthority}</strong>
        </span>
        <span className="font-mono font-bold text-slate-700">
          TRA CỨU CSDL BỘ GTVT: HỢP LỆ
        </span>
      </div>

      {/* Permanent Address */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="profile-address" className="text-xs font-bold font-mono text-slate-700 uppercase">
          Địa chỉ thường trú theo CCCD
        </label>
        <input
          id="profile-address"
          type="text"
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          className="h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs md:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
        />
      </div>
    </section>
  )
}
