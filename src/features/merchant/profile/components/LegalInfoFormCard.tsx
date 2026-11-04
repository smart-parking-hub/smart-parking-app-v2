import { useState, useRef } from 'react'
import {
  Building,
  BadgeAlert,
  User,
  MapPin,
  Mail,
  Phone,
  FileText,
  Flame,
  Eye,
  UploadCloud,
  CheckCircle2,
  FileCheck2,
} from 'lucide-react'
import type { MerchantProfile, StoredDocument } from '../types/merchantProfileTypes'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'

type LegalProfileFields = { fullName: string; email: string; emergencyContact?: string; address?: string }

interface LegalInfoFormCardProps {
  profile: MerchantProfile
  register: UseFormRegister<LegalProfileFields>
  errors: FieldErrors<LegalProfileFields>
  onUploadDocument: (businessLicense: string, file: File | null) => Promise<void>
  isUploadingDoc: boolean
  onPreviewDocument: (doc: StoredDocument) => void
}

export function LegalInfoFormCard({
  profile,
  register,
  errors,
  onUploadDocument,
  isUploadingDoc,
  onPreviewDocument,
}: LegalInfoFormCardProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [licenseInput, setLicenseInput] = useState(profile.businessLicense || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 5 * 1024 * 1024) {
        alert('Dung lượng tệp vượt quá giới hạn cho phép (tối đa 5MB)!')
        return
      }
      setSelectedFile(file)
    }
  }

  const handleUploadSubmit = async () => {
    await onUploadDocument(licenseInput, selectedFile)
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <section className="bg-white rounded-2xl p-6 lg:p-7 shadow-xs border border-slate-200/80 space-y-6">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-100 gap-2">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-md bg-[#131b2e] text-white flex items-center justify-center font-mono text-[11px] font-bold">
            01
          </span>
          <h2 className="font-sora text-base lg:text-lg font-bold text-[#0d1c2e]">
            Thông Tin Pháp Lý Doanh Nghiệp
          </h2>
        </div>

        <span className="font-mono text-[11px] px-2.5 py-1 rounded-md bg-[#eff4ff] text-[#0d1c2e] font-bold border border-slate-200 uppercase">
          DỮ LIỆU ĐÃ KHÓA THẨM ĐỊNH
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
        {/* Full Name / Company Name (Locked) */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-xs font-semibold text-[#0d1c2e] block">
            Tên pháp nhân công ty đầy đủ (Theo GPKD)
          </label>
          <div className="relative">
            <input
              type="text"
              readOnly
              value={profile.companyName}
              className="w-full h-12 px-3.5 bg-[#eff4ff] rounded-xl font-medium text-xs lg:text-sm text-[#0d1c2e] focus:outline-none cursor-not-allowed pl-10 pr-10 border border-slate-200"
            />
            <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
            <span
              className="absolute right-3.5 top-4"
              title="Đã đối soát Bộ KH&ĐT"
            >
              <CheckCircle2 className="w-4 h-4 text-[#455f87]" />
            </span>
          </div>
        </div>

        {/* Tax Identification (MST) */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#0d1c2e] block">
            Mã số thuế doanh nghiệp (MST)
          </label>
          <div className="relative">
            <input
              type="text"
              readOnly
              value={profile.businessLicense}
              className="w-full h-12 px-3.5 bg-[#eff4ff] rounded-xl font-mono text-xs lg:text-sm text-[#0d1c2e] focus:outline-none cursor-not-allowed pl-10 border border-slate-200"
            />
            <BadgeAlert className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
          </div>
        </div>

        {/* Legal Representative Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#0d1c2e] block">
            Người đại diện pháp luật
          </label>
          <div className="relative">
            <input
              type="text"
              {...register('fullName')}
              className="w-full h-12 px-3.5 bg-white rounded-xl font-medium text-xs lg:text-sm text-[#0d1c2e] focus:outline-none focus:border-[#d95f00] pl-10 border border-slate-300 transition-colors"
            />
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
          </div>
          {errors.fullName && (
            <span className="text-[11px] text-rose-600 block">{errors.fullName.message}</span>
          )}
        </div>

        {/* Accounting Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#0d1c2e] block">
            Email tiếp nhận thông báo &amp; HĐĐT
          </label>
          <div className="relative">
            <input
              type="email"
              {...register('email')}
              className="w-full h-12 px-3.5 bg-white rounded-xl font-medium text-xs lg:text-sm text-[#0d1c2e] focus:outline-none focus:border-[#d95f00] pl-10 border border-slate-300 transition-colors"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
          </div>
          {errors.email && (
            <span className="text-[11px] text-rose-600 block">{errors.email.message}</span>
          )}
        </div>

        {/* Emergency Hotline */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#0d1c2e] block">
            Hotline điều phối khẩn cấp
          </label>
          <div className="relative">
            <input
              type="text"
              {...register('emergencyContact')}
              className="w-full h-12 px-3.5 bg-white rounded-xl font-mono text-xs lg:text-sm text-[#0d1c2e] focus:outline-none focus:border-[#d95f00] pl-10 border border-slate-300 transition-colors"
            />
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
          </div>
          {errors.emergencyContact && (
            <span className="text-[11px] text-rose-600 block">
              {errors.emergencyContact.message}
            </span>
          )}
        </div>

        {/* Headquarters Address */}
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-xs font-semibold text-[#0d1c2e] block">
            Địa chỉ trụ sở chính đăng ký kinh doanh
          </label>
          <div className="relative">
            <input
              type="text"
              {...register('address')}
              className="w-full h-12 px-3.5 bg-white rounded-xl text-xs lg:text-sm text-[#0d1c2e] focus:outline-none focus:border-[#d95f00] pl-10 border border-slate-300 transition-colors"
            />
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
          </div>
          {errors.address && (
            <span className="text-[11px] text-rose-600 block">{errors.address.message}</span>
          )}
        </div>
      </div>

      {/* Attachments: GPKD & PCCC Certificates */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <label className="text-xs font-semibold text-[#0d1c2e] block">
          Tệp hồ sơ chứng thực pháp lý bến bãi (Đã lưu kho điện tử)
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {profile.documents.map((doc) => (
            <div
              key={doc.id}
              className="p-3 rounded-xl bg-[#eff4ff] border border-slate-200/60 flex items-center justify-between hover:bg-slate-100/70 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#d95f00] shrink-0">
                  {doc.type === 'pccc' ? (
                    <Flame className="w-4 h-4 text-[#455f87]" />
                  ) : (
                    <FileText className="w-4 h-4 text-[#d95f00]" />
                  )}
                </div>
                <div className="truncate">
                  <span className="font-semibold text-xs text-[#0d1c2e] block truncate">
                    {doc.name}
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">
                    {doc.size} • {doc.authority}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onPreviewDocument(doc)}
                className="w-8 h-8 rounded-lg bg-white border border-slate-200/80 flex items-center justify-center text-slate-600 hover:text-[#d95f00] transition-colors cursor-pointer shrink-0 ml-2"
                title="Xem trước tài liệu"
                aria-label={`Xem tài liệu ${doc.name}`}
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Upload Zone for New / Supplementary Document */}
        <div className="mt-4 p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-[#455f87]" />
              <span className="text-xs font-semibold text-[#0d1c2e]">
                Bổ sung giấy phép kinh doanh / chứng thực mới
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              Chấp nhận: .pdf, .jpg, .png, .webp (Tối đa 5MB)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            <div className="sm:col-span-5">
              <input
                type="text"
                placeholder="Số GPKD / Mã hiệu tài liệu"
                value={licenseInput}
                onChange={(e) => setLicenseInput(e.target.value)}
                className="w-full h-10 px-3 bg-white rounded-lg text-xs font-mono border border-slate-300 focus:outline-none focus:border-[#d95f00]"
              />
            </div>

            <div className="sm:col-span-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                className="w-full text-xs text-slate-500 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#eff4ff] file:text-[#0d1c2e] hover:file:bg-blue-100 cursor-pointer"
              />
            </div>

            <div className="sm:col-span-3">
              <button
                type="button"
                onClick={handleUploadSubmit}
                disabled={isUploadingDoc || (!selectedFile && !licenseInput.trim())}
                className="w-full h-10 px-3 bg-[#131b2e] hover:bg-black text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>{isUploadingDoc ? 'Đang gửi...' : 'Gửi Giấy Tờ'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
