import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle2, MapPin, Sparkles, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Modal } from '@/shared/components/Modal'
import { Button } from '@/shared/components/Button'
import { Alert } from '@/shared/components/Alert'

const driverLeadSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Vui lòng nhập họ và tên của bác tài (tối thiểu 2 ký tự)'),
  phone: z
    .string()
    .regex(/^(0|\+84)[35789][0-9]{8}$/, 'Số điện thoại không hợp lệ (10 chữ số VN)'),
  vehicleType: z
    .string()
    .min(1, 'Vui lòng chọn loại xe / tải trọng'),
  destination: z
    .string()
    .min(1, 'Vui lòng chọn tuyến đường hoặc cụm cảng cần đỗ'),
  notes: z.string().optional(),
})

export type DriverLeadFormData = z.infer<typeof driverLeadSchema>

export interface DriverLeadModalProps {
  isOpen: boolean
  onClose: () => void
  initialDepotName?: string
  onSuccessSubmit?: (data: DriverLeadFormData) => void
}

export function DriverLeadModal({
  isOpen,
  onClose,
  initialDepotName,
  onSuccessSubmit,
}: DriverLeadModalProps) {
  const [isSuccess, setIsSuccess] = useState(false)
  const [submissionError, setSubmissionError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DriverLeadFormData>({
    resolver: zodResolver(driverLeadSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      vehicleType: 'container_40ft',
      destination: initialDepotName || 'Cát Lái Hub Depot #02',
      notes: '',
    },
  })

  const onSubmit = async (data: DriverLeadFormData) => {
    try {
      setSubmissionError(null)
      // Simulate client caching / fast mock network processing
      await new Promise((resolve) => setTimeout(resolve, 600))
      setIsSuccess(true)
      onSuccessSubmit?.(data)
    } catch {
      setSubmissionError('Không thể gửi yêu cầu. Vui lòng kiểm tra lại kết nối mạng.')
    }
  }

  const handleClose = () => {
    setIsSuccess(false)
    setSubmissionError(null)
    reset()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Khóa Chỗ Đỗ Nhanh & Nhận Mã Giảm 20%"
      description="Điền thông tin xe để nhân viên điều phối giữ chỗ tức thời trong 15 phút và gửi mã ưu đãi vào tin nhắn."
      maxWidth="lg"
    >
      {isSuccess ? (
        <div className="py-4 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
          </div>
          <h4 className="font-sora text-xl font-bold text-slate-900">
            Đăng Ký Khóa Chỗ Thành Công!
          </h4>
          <p className="font-inter text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Hệ thống SmartTruckHub đã nhận thông tin. Mã voucher{' '}
            <strong className="text-[#F97316] font-mono bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
              STH-TAIXE-20
            </strong>{' '}
            đã được kích hoạt cho số điện thoại của bác tài.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-left text-xs text-slate-700 space-y-1">
            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-[#F97316]" aria-hidden="true" />
              <span>Quyền lợi ưu tiên:</span>
            </div>
            <p>• Miễn phí 100% thời gian chờ 15 phút tại cổng kiểm soát ALPR</p>
            <p>• Hỗ trợ mở barie tự động nhận diện biển số xe qua camera AI</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <Link
              to="/search"
              onClick={handleClose}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-[#060D1A] font-sora font-bold text-sm px-6 py-2.5 rounded-xl transition-all"
            >
              <MapPin className="h-4 w-4" aria-hidden="true" />
              <span>Xem Bãi Trên Bản Đồ</span>
            </Link>
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleClose}
              className="w-full sm:w-auto"
            >
              Đóng Cửa Sổ
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1 font-inter">
          {submissionError && (
            <Alert variant="error" title="Lỗi xử lý">
              {submissionError}
            </Alert>
          )}

          <div>
            <label htmlFor="lead-name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Họ Và Tên Bác Tài <span className="text-red-500">*</span>
            </label>
            <input
              id="lead-name"
              type="text"
              placeholder="VD: Nguyễn Văn Nam"
              {...register('fullName')}
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F97316] ${
                errors.fullName ? 'border-red-500 bg-red-50/30' : 'border-slate-300 bg-white'
              }`}
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="lead-phone" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Số Điện Thoại Nhận Mã Ưu Đãi <span className="text-red-500">*</span>
            </label>
            <input
              id="lead-phone"
              type="tel"
              placeholder="VD: 0912345678"
              {...register('phone')}
              className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F97316] ${
                errors.phone ? 'border-red-500 bg-red-50/30' : 'border-slate-300 bg-white'
              }`}
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.phone.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="lead-vehicle" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Loại Phương Tiện <span className="text-red-500">*</span>
              </label>
              <select
                id="lead-vehicle"
                {...register('vehicleType')}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
              >
                <option value="container_40ft">Container 40ft (Đầu kéo)</option>
                <option value="container_20ft">Container 20ft</option>
                <option value="container_45ft">Container 45ft HC</option>
                <option value="reefer_container">Xe Container Lạnh (Reefer)</option>
                <option value="heavy_truck_15t">Xe tải nặng 10T - 15T</option>
                <option value="heavy_truck_over_15t">Xe tải nặng trên 15T</option>
              </select>
              {errors.vehicleType && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.vehicleType.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="lead-destination" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Cụm Cảng / Bãi Muốn Đỗ <span className="text-red-500">*</span>
              </label>
              <select
                id="lead-destination"
                {...register('destination')}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
              >
                <option value="Cát Lái Hub Depot #02">Cát Lái Hub Depot #02 (TP. Thủ Đức)</option>
                <option value="Cái Mép - Thị Vải Port">Cụm Bãi Cảng Cái Mép - Thị Vải</option>
                <option value="ICD Sóng Thần">ICD Sóng Thần Depot (Bình Dương)</option>
                <option value="Cảng Đình Vũ">Cảng Hải Phòng - Đình Vũ</option>
                <option value="Logistics Tiên Sơn">Khu Tiếp Vận Tiên Sơn (Bắc Ninh)</option>
              </select>
              {errors.destination && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.destination.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="lead-notes" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Yêu Cầu Thêm (Không bắt buộc)
            </label>
            <textarea
              id="lead-notes"
              rows={2}
              placeholder="VD: Cần cắm điện lạnh 380V, giờ dự kiến vào bãi 22:30 đêm..."
              {...register('notes')}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
            />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              className="w-full sm:w-auto"
            >
              <Truck className="h-4 w-4 mr-2" aria-hidden="true" />
              <span>Xác Nhận Khóa Chỗ &amp; Nhận Mã</span>
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}

