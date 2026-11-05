import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, ShieldCheck, MapPin, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ownerLeadSchema, type OwnerLeadFormValues } from '@/entities/owner/types'
import { Modal } from '@/shared/components/Modal'
import { Button } from '@/shared/components/Button'
import { Alert } from '@/shared/components/Alert'

export interface OwnerLeadModalProps {
  isOpen: boolean
  onClose: () => void
  initialLocation?: string
  initialArea?: string
  onSuccessSubmit?: (data: OwnerLeadFormValues) => void
}

export function OwnerLeadModal({
  isOpen,
  onClose,
  initialLocation = '',
  initialArea = '7000-15000',
  onSuccessSubmit,
}: OwnerLeadModalProps) {
  const [isSuccess, setIsSuccess] = useState(false)
  const [submissionError, setSubmissionError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OwnerLeadFormValues>({
    resolver: zodResolver(ownerLeadSchema),
    defaultValues: {
      name: '',
      phone: '',
      location: initialLocation,
      area: initialArea,
      status: 'operating',
      email: '',
      notes: '',
    },
  })

  const onSubmit = async (data: OwnerLeadFormValues) => {
    try {
      setSubmissionError(null)
      // Giả lập xử lý gửi hồ sơ khảo sát mặt bằng và cache local
      await new Promise((resolve) => setTimeout(resolve, 600))
      setIsSuccess(true)
      onSuccessSubmit?.(data)
    } catch {
      setSubmissionError('Không thể gửi đăng ký khảo sát. Vui lòng kiểm tra lại kết nối mạng.')
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
      title="Đăng Ký Khảo Sát & Tư Vấn Mặt Bằng Miễn Phí"
      description="Đội ngũ kỹ sư hạ tầng SmartTruckHub sẽ liên hệ trong 2 giờ và cử kỹ thuật viên đo đạc thực địa trong vòng 24 giờ."
      maxWidth="lg"
    >
      {isSuccess ? (
        <div className="py-4 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
          </div>
          <h4 className="font-sora text-xl font-bold text-slate-900">
            Hồ Sơ Mặt Bằng Đã Tiếp Nhận Thành Công!
          </h4>
          <p className="font-inter text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Chuyên viên tư vấn giải pháp bãi đỗ sẽ gọi điện qua số đã cung cấp để chốt lịch khảo sát đo đạc thực tế.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left max-w-md mx-auto space-y-2 text-xs font-inter text-slate-700">
            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-orange" />
              Cam kết dịch vụ cho chủ mặt bằng:
            </div>
            <p>• 100% miễn phí đo đạc, thiết kế layout phân luồng luồng xe.</p>
            <p>• Hỗ trợ gói thiết bị Barie ALPR camera AI trả góp hoặc thuê 0đ.</p>
            <p>• Ký cam kết bảo mật thông tin pháp lý mặt bằng.</p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="primary" onClick={handleClose}>
              Hoàn Tất & Đóng
            </Button>
            <Link
              to="/merchant/parking-lots"
              className="inline-flex items-center justify-center text-sm font-semibold text-brand-navy hover:text-brand-orange transition-colors px-4 py-2"
              onClick={handleClose}
            >
              Xem Cổng Quản Trị Merchant &rarr;
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {submissionError && (
            <Alert variant="error" title="Gửi Yêu Cầu Thất Bại">
              {submissionError}
            </Alert>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Họ và tên chủ bãi / Đại diện *
              </label>
              <input
                {...register('name')}
                placeholder="VD: Trần Đình Hùng"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-orange ${
                  errors.name ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300'
                }`}
              />
              {errors.name && (
                <p className="text-xs text-rose-600 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Số điện thoại liên hệ *
              </label>
              <input
                {...register('phone')}
                placeholder="0912 345 678"
                type="tel"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-orange ${
                  errors.phone ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300'
                }`}
              />
              {errors.phone && (
                <p className="text-xs text-rose-600 mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Vị trí mặt bằng bãi xe (Tỉnh/Thành & Tuyến đường) *
            </label>
            <div className="relative">
              <input
                {...register('location')}
                placeholder="VD: Nguyễn Thị Định, P. Cát Lái, TP. Thủ Đức"
                className={`w-full px-3.5 py-2.5 pr-9 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-orange ${
                  errors.location ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300'
                }`}
              />
              <MapPin className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>
            {errors.location && (
              <p className="text-xs text-rose-600 mt-1">{errors.location.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Diện tích ước tính
              </label>
              <select
                {...register('area')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white"
              >
                <option value="under-3000">Dưới 3.000 m² (20 - 40 xe)</option>
                <option value="3000-7000">3.000 - 7.000 m² (50 - 100 xe)</option>
                <option value="7000-15000">7.000 - 15.000 m² (100 - 200 xe)</option>
                <option value="over-15000">Trên 15.000 m² (ICD quy mô lớn)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Hiện trạng mặt bằng
              </label>
              <select
                {...register('status')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white"
              >
                <option value="operating">Đang hoạt động giữ xe thủ công</option>
                <option value="empty-land">Đất trống chưa khai thác</option>
                <option value="warehouse">Kho bãi kết hợp trạm dừng</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Email nhận báo cáo doanh thu (Không bắt buộc)
              </label>
              <input
                {...register('email')}
                placeholder="chubai@gmail.com"
                type="email"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-orange ${
                  errors.email ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300'
                }`}
              />
              {errors.email && (
                <p className="text-xs text-rose-600 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Ghi chú thêm nhu cầu
              </label>
              <input
                {...register('notes')}
                placeholder="Cần lắp đặt 2 làn Barie ALPR, điện lạnh 380V..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isSubmitting}
            >
              <span>XÁC NHẬN ĐĂNG KÝ KHẢO SÁT MIỄN PHÍ</span>
              <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
            </Button>
          </div>

          <p className="text-center text-[11px] text-slate-500 pt-1 font-inter">
            Thông tin cam kết bảo mật theo tiêu chuẩn ISO 27001. Hotline hỗ trợ 24/7: 1900 6868.
          </p>
        </form>
      )}
    </Modal>
  )
}
