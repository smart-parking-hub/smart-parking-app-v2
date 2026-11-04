import { Building2, ShieldCheck, ArrowUpDown } from 'lucide-react'
import type { UseFormRegister, FieldErrors } from 'react-hook-form'
import type { EditParkingLotFormData } from '../../types/merchantParkingLotTypes'

interface EditMerchantBasicInfoCardProps {
  register: UseFormRegister<EditParkingLotFormData>
  errors: FieldErrors<EditParkingLotFormData>
  disabled?: boolean
  lotCode?: string
}

export function EditMerchantBasicInfoCard({
  register,
  errors,
  disabled = false,
  lotCode = 'TAN-CANG-PH2',
}: EditMerchantBasicInfoCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 space-y-5 shadow-2xs border border-slate-200/80">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#eff4ff] text-[#455f87] flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-[#455f87]" />
          </div>
          <h2 className="font-sora text-base sm:text-lg text-[#131b2e] font-bold">
            Thông Tin Mặt Bằng &amp; Pháp Lý Vận Hành
          </h2>
        </div>
        <span className="font-mono text-xs text-[#455f87] font-semibold bg-[#eff4ff] px-2.5 py-1 rounded-md border border-slate-200">
          MÃ: {lotCode}
        </span>
      </div>

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label
            htmlFor="lot-name-input"
            className="block text-xs sm:text-sm font-semibold text-[#131b2e] mb-1.5 cursor-pointer"
          >
            Tên bãi đỗ thương mại (Hiển thị cho tài xế &amp; điều vận){' '}
            <span className="text-red-500">*</span>
          </label>
          <input
            id="lot-name-input"
            type="text"
            disabled={disabled}
            {...register('name')}
            placeholder="Ví dụ: Depot Container Tân Cảng - Phú Hữu (Cơ Sở 2)"
            className="w-full h-11 px-3.5 bg-[#eff4ff] text-[#131b2e] text-xs sm:text-sm rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#d95f00]/30 border border-slate-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed font-medium"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.name.message}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label
            htmlFor="lot-address-input"
            className="block text-xs sm:text-sm font-semibold text-[#131b2e] mb-1.5 cursor-pointer"
          >
            Địa chỉ kinh doanh đăng ký <span className="text-red-500">*</span>
          </label>
          <textarea
            id="lot-address-input"
            rows={3}
            disabled={disabled}
            {...register('address')}
            placeholder="Địa chỉ chi tiết bao gồm số nhà, tên đường, phường/xã, quận/huyện..."
            className="w-full p-3.5 bg-[#eff4ff] text-[#131b2e] text-xs sm:text-sm rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#d95f00]/30 border border-slate-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed leading-relaxed font-medium"
          />
          {errors.address && (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.address.message}</p>
          )}
        </div>

        {/* Hotline & Clearance Height Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="lot-hotline-input"
              className="block text-xs sm:text-sm font-semibold text-[#131b2e] mb-1.5 cursor-pointer"
            >
              Hotline điều phối trực ban 24/7 <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center">
              <input
                id="lot-hotline-input"
                type="text"
                disabled={disabled}
                {...register('hotline')}
                placeholder="0908 123 456"
                className="w-full h-11 pl-3.5 pr-28 bg-[#eff4ff] text-[#131b2e] text-xs sm:text-sm rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#d95f00]/30 border border-slate-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed font-medium"
              />
              <span className="absolute right-2 px-2 py-0.5 rounded-md bg-[#dce9ff] text-[#131b2e] font-mono text-[11px] font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                OTP Verified
              </span>
            </div>
            {errors.hotline && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.hotline.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="lot-clearance-input"
              className="block text-xs sm:text-sm font-semibold text-[#131b2e] mb-1.5 cursor-pointer"
            >
              Tĩnh không cổng tiếp nhận (Clearance Height) <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center">
              <input
                id="lot-clearance-input"
                type="text"
                disabled={disabled}
                {...register('clearanceHeight')}
                placeholder="4.85 mét (Đạt chuẩn 53' High Cube)"
                className="w-full h-11 px-3.5 pr-24 bg-[#eff4ff] text-[#131b2e] text-xs sm:text-sm rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#d95f00]/30 border border-slate-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed font-medium"
              />
              <span className="absolute right-2.5 text-slate-500 font-mono text-[11px] flex items-center gap-1 font-semibold">
                <ArrowUpDown className="w-3 h-3 text-[#455f87]" />
                QC: &gt;= 4.80m
              </span>
            </div>
            {errors.clearanceHeight && (
              <p className="mt-1 text-xs text-red-600 font-medium">
                {errors.clearanceHeight.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
