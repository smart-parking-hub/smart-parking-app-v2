import { FileText, ShieldCheck, AlertCircle, Sparkles, RefreshCw } from 'lucide-react'
import type { AiContentSegments, ParkingLotImageItem } from '../types/merchantParkingLotTypes'

interface CreateParkingLotConfirmStepProps {
  values: {
    name: string
    address: string
    latitude: number
    longitude: number
  }
  images: ParkingLotImageItem[]
  aiContent: AiContentSegments | null
  uploadError?: string
  createdParkingLotId?: number
  onRetryUpload?: () => void
  submitting: boolean
}

export function CreateParkingLotConfirmStep({
  values,
  images,
  aiContent,
  uploadError,
  createdParkingLotId,
  onRetryUpload,
  submitting,
}: CreateParkingLotConfirmStepProps) {
  return (
    <div className="bg-white p-5 sm:p-6 lg:p-8 rounded-2xl shadow-2xs border border-slate-200/80 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#d95f00] shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-sora text-lg sm:text-xl text-[#0d1c2e] font-bold">
              Xác Nhận Toàn Bộ Hồ Sơ Bãi Đỗ
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Vui lòng kiểm tra kỹ lưỡng thông số kỹ thuật và ảnh hiện trường trước khi gửi đến Ban Quản Trị Hệ Thống.
            </p>
          </div>
        </div>
        <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-[#341100] text-[#d95f00] font-bold border border-[#d95f00]/30">
          STATUS: DRAFT &rarr; PENDING
        </span>
      </div>

      {/* Partial Failure Warning Banner if creation succeeded but image upload failed */}
      {uploadError && createdParkingLotId && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-bold">
                Bãi đỗ đã được tạo thành công với mã #{createdParkingLotId}, nhưng upload ảnh gặp lỗi
              </span>
              <span className="text-xs text-amber-800 mt-0.5">{uploadError}</span>
            </div>
          </div>
          {onRetryUpload && (
            <button
              type="button"
              onClick={onRetryUpload}
              disabled={submitting}
              className="px-4 py-2 rounded-lg bg-[#d95f00] hover:bg-[#b84e00] text-white text-xs font-bold flex items-center gap-2 shrink-0 cursor-pointer shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${submitting ? 'animate-spin' : ''}`} />
              <span>Thử Upload Lại Ảnh</span>
            </button>
          )}
        </div>
      )}

      {/* Summary Table Grid */}
      <div className="rounded-xl overflow-hidden border border-slate-200 divide-y divide-slate-200 text-xs sm:text-sm">
        {/* Name */}
        <div className="grid grid-cols-1 sm:grid-cols-3 p-4 bg-slate-50/50">
          <span className="font-semibold text-slate-600 sm:col-span-1">Tên Bãi Đỗ Khai Báo</span>
          <span className="font-bold text-[#0d1c2e] sm:col-span-2 mt-1 sm:mt-0">
            {values.name || '—'}
          </span>
        </div>

        {/* Address */}
        <div className="grid grid-cols-1 sm:grid-cols-3 p-4 bg-white">
          <span className="font-semibold text-slate-600 sm:col-span-1">Địa Chỉ Mặt Bằng</span>
          <span className="text-[#0d1c2e] sm:col-span-2 mt-1 sm:mt-0 leading-relaxed">
            {values.address || '—'}
          </span>
        </div>

        {/* Coordinates */}
        <div className="grid grid-cols-1 sm:grid-cols-3 p-4 bg-slate-50/50">
          <span className="font-semibold text-slate-600 sm:col-span-1">Tọa Độ Vị Trí (WGS-84)</span>
          <div className="flex items-center gap-3 sm:col-span-2 mt-1 sm:mt-0 font-mono text-xs">
            <span className="px-2 py-0.5 rounded bg-[#eff4ff] text-[#0d1c2e] font-bold border border-slate-200">
              LAT: {values.latitude ? values.latitude.toFixed(7) : '—'}
            </span>
            <span className="px-2 py-0.5 rounded bg-[#eff4ff] text-[#0d1c2e] font-bold border border-slate-200">
              LNG: {values.longitude ? values.longitude.toFixed(7) : '—'}
            </span>
          </div>
        </div>

        {/* AI Content Segments if provided */}
        {aiContent && (
          <div className="grid grid-cols-1 sm:grid-cols-3 p-4 bg-white">
            <span className="font-semibold text-slate-600 sm:col-span-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#d95f00]" />
              <span>Nội Dung Trợ Lý AI</span>
            </span>
            <div className="sm:col-span-2 mt-1 sm:mt-0 text-xs text-slate-700 space-y-1.5 leading-relaxed">
              <p>
                <strong>Tiếp vận:</strong> {aiContent.logisticsCapacity}
              </p>
              <p>
                <strong>PCCC:</strong> {aiContent.safetyRegulations}
              </p>
              <p>
                <strong>Chỉ dẫn ALPR:</strong> {aiContent.circulationGuide}
              </p>
            </div>
          </div>
        )}

        {/* Uploaded Photos Count & Previews */}
        <div className="grid grid-cols-1 sm:grid-cols-3 p-4 bg-slate-50/50">
          <span className="font-semibold text-slate-600 sm:col-span-1">Hồ Sơ Ảnh Kiểm Định</span>
          <div className="sm:col-span-2 mt-1 sm:mt-0 flex flex-col gap-2">
            <span className="font-bold text-[#0d1c2e]">
              {images.length > 0 ? `${images.length} tệp ảnh đã chọn` : 'Chưa chọn tệp ảnh nào'}
            </span>
            {images.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mt-1">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-16 h-12 rounded-md overflow-hidden border border-slate-300"
                    title={img.name}
                  >
                    <img src={img.previewUrl} alt={img.name} className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute bottom-0 inset-x-0 bg-[#d95f00] text-white text-[8px] font-bold text-center py-0.2">
                        BÌA
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Status after submission */}
        <div className="grid grid-cols-1 sm:grid-cols-3 p-4 bg-white">
          <span className="font-semibold text-slate-600 sm:col-span-1">Trạng Thái Sau Khi Tạo</span>
          <div className="sm:col-span-2 mt-1 sm:mt-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#341100] text-[#d95f00] font-mono text-xs font-bold border border-[#d95f00]/40">
              <span className="w-2 h-2 rounded-full bg-[#d95f00] animate-pulse" />
              PENDING_APPROVAL (CHỜ PHÊ DUYỆT)
            </span>
          </div>
        </div>
      </div>

      {/* Admin Review Information Notice */}
      <div className="p-4 rounded-xl bg-[#eff4ff] border border-slate-200 text-xs text-slate-700 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#d95f00] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold text-[#0d1c2e] block mb-0.5">
            Quy trình tiếp nhận &amp; cấp phép bãi đỗ thương mại
          </span>
          Sau khi bạn nhấn <strong>"Tạo bãi đỗ"</strong>, hồ sơ sẽ được mã hóa và gửi tới Hội đồng Quản trị Hệ thống (Admin). Chuyên viên sẽ đối soát tọa độ ranh giới thực tế và hồ sơ PCCC trong vòng 24 - 48 giờ làm việc trước khi kích hoạt hiển thị trên bản đồ tài xế.
        </div>
      </div>
    </div>
  )
}
