import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, CheckCircle2, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ownerLeadSchema, type OwnerLeadFormValues } from '@/entities/owner/types'
import { Button } from '@/shared/components/Button'

export interface OwnerOnboardingFormSectionProps {
  onSuccessSubmit?: (data: OwnerLeadFormValues) => void
}

export function OwnerOnboardingFormSection({ onSuccessSubmit }: OwnerOnboardingFormSectionProps = {}) {
  const nameId = useId()
  const phoneId = useId()
  const locationId = useId()
  const areaId = useId()
  const statusId = useId()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<OwnerLeadFormValues>({
    resolver: zodResolver(ownerLeadSchema),
    defaultValues: {
      name: '',
      phone: '',
      location: '',
      area: '7000-15000',
      status: 'operating',
      email: '',
      notes: '',
    },
  })

  const onSubmit = async (data: OwnerLeadFormValues) => {
    // Giả lập lưu trữ lead và gọi callback
    await new Promise((resolve) => setTimeout(resolve, 600))
    onSuccessSubmit?.(data)
  }

  return (
    <section
      className="w-full bg-brand-navy text-white py-24 px-6 relative overflow-hidden border-t border-slate-800"
      id="onboarding-form"
    >
      {/* Ambient glow */}
      <div className="absolute -right-32 -bottom-32 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1240px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Copy & Perks (6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-navy-light border border-[#1E3A5F]">
              <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
              <span className="font-inter text-xs font-semibold tracking-wider text-brand-orange uppercase">
                TIẾP NHẬN ĐỐI TÁC MẶT BẰNG
              </span>
            </div>

            <h2 className="font-sora font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
              Sẵn Sàng Biến Khu Đất Của Bạn Thành <br />
              <span className="text-brand-orange">Trạm Dừng Xe Tự Động Sinh Lời?</span>
            </h2>

            <p className="font-inter text-base text-slate-300 leading-relaxed">
              Điền thông tin mặt bằng ngay hôm nay. Đội ngũ chuyên gia hạ tầng của SmartTruckHub sẽ
              liên hệ trong vòng 2 giờ để tư vấn phương án triển khai tối ưu nhất.
            </p>

            <div className="space-y-3 pt-2 font-inter text-sm">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center font-bold text-xs">
                  ✓
                </div>
                <span className="text-slate-200">Khảo sát đo đạc thực địa miễn phí 100%</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center font-bold text-xs">
                  ✓
                </div>
                <span className="text-slate-200">
                  Tặng kèm gói cài đặt cổng thanh toán PayOS VietQR tự động
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center font-bold text-xs">
                  ✓
                </div>
                <span className="text-slate-200">
                  Cam kết kết nối tối thiểu 200 lượt xe/tháng từ sàn SmartTruck
                </span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4 text-slate-400 text-xs font-inter border-t border-slate-800">
              <span>
                HOTLINE ĐỐI TÁC:{' '}
                <a
                  href="tel:19006868"
                  className="text-white hover:text-brand-orange font-bold transition-colors"
                >
                  1900 6868
                </a>
              </span>
              <span>•</span>
              <span>
                EMAIL:{' '}
                <a
                  href="mailto:merchant@smarttruckhub.vn"
                  className="text-white hover:text-brand-orange font-bold transition-colors"
                >
                  merchant@smarttruckhub.vn
                </a>
              </span>
            </div>
          </div>

          {/* Right: Registration Form Card (6 Cols) */}
          <div className="lg:col-span-6 bg-brand-navy-light border border-[#1E3A5F] p-8 rounded-2xl shadow-2xl">
            <div className="mb-6">
              <h3 className="font-sora font-bold text-xl text-white">
                Đăng Ký Khảo Sát &amp; Mở Bãi Hợp Tác
              </h3>
              <p className="text-xs text-slate-400 font-inter mt-1">
                Vui lòng cung cấp vị trí và diện tích khu đất để nhận báo cáo phân tích dòng tiền trong 24h.
              </p>
            </div>

            {isSubmitSuccessful ? (
              <div
                className="py-10 text-center space-y-4 animate-in fade-in zoom-in duration-300"
                id="onboarding-success-state"
              >
                <div className="w-16 h-16 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-10 w-10" aria-hidden="true" />
                </div>
                <h4 className="font-sora text-2xl font-bold text-white">
                  Đã Tiếp Nhận Thông Tin Thành Công!
                </h4>
                <p className="font-inter text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
                  Cảm ơn bạn đã tin tưởng SmartTruckHub. Chuyên viên quản lý mặt bằng sẽ liên hệ trong 2 giờ làm việc để xếp lịch đo đạc thực địa.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => reset()}
                    className="text-xs"
                  >
                    Gửi thêm hồ sơ mặt bằng khác
                  </Button>
                  <Link
                    to="/merchant/parking-lots"
                    className="inline-flex items-center justify-center text-xs font-semibold text-brand-orange hover:text-white transition-colors px-3 py-2"
                  >
                    Đến Cổng Quản Trị Bãi &rarr;
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-inter">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-xs font-semibold text-slate-300 uppercase mb-1.5"
                      htmlFor={nameId}
                    >
                      Họ và tên chủ bãi *
                    </label>
                    <input
                      id={nameId}
                      {...register('name')}
                      placeholder="VD: Nguyễn Văn Hưng"
                      className={`w-full bg-brand-navy border text-white px-3.5 py-3 rounded-xl placeholder:text-slate-500 focus:outline-none focus:border-brand-orange text-sm ${
                        errors.name ? 'border-rose-500' : 'border-slate-700'
                      }`}
                    />
                    {errors.name && (
                      <p className="text-xs text-rose-400 mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label
                      className="block text-xs font-semibold text-slate-300 uppercase mb-1.5"
                      htmlFor={phoneId}
                    >
                      Số điện thoại liên hệ *
                    </label>
                    <input
                      id={phoneId}
                      {...register('phone')}
                      placeholder="0912 345 678"
                      type="tel"
                      className={`w-full bg-brand-navy border text-white px-3.5 py-3 rounded-xl placeholder:text-slate-500 focus:outline-none focus:border-brand-orange text-sm ${
                        errors.phone ? 'border-rose-500' : 'border-slate-700'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-xs text-rose-400 mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    className="block text-xs font-semibold text-slate-300 uppercase mb-1.5"
                    htmlFor={locationId}
                  >
                    Vị trí mặt bằng bãi xe (Tỉnh/Thành &amp; Tuyến đường) *
                  </label>
                  <div className="relative">
                    <input
                      id={locationId}
                      {...register('location')}
                      placeholder="VD: Cạnh KCN Sóng Thần, Dĩ An, Bình Dương"
                      className={`w-full bg-brand-navy border text-white px-3.5 py-3 pr-10 rounded-xl placeholder:text-slate-500 focus:outline-none focus:border-brand-orange text-sm ${
                        errors.location ? 'border-rose-500' : 'border-slate-700'
                      }`}
                    />
                    <MapPin className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
                  </div>
                  {errors.location && (
                    <p className="text-xs text-rose-400 mt-1">{errors.location.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-xs font-semibold text-slate-300 uppercase mb-1.5"
                      htmlFor={areaId}
                    >
                      Diện tích ước tính (m²)
                    </label>
                    <select
                      id={areaId}
                      {...register('area')}
                      className="w-full bg-brand-navy border border-slate-700 text-white px-3.5 py-3 rounded-xl focus:outline-none focus:border-brand-orange text-sm"
                    >
                      <option value="under-3000">Dưới 3.000 m² (20 - 40 xe)</option>
                      <option value="3000-7000">3.000 - 7.000 m² (50 - 100 xe)</option>
                      <option value="7000-15000">7.000 - 15.000 m² (100 - 200 xe)</option>
                      <option value="over-15000">Trên 15.000 m² (ICD quy mô lớn)</option>
                    </select>
                  </div>
                  <div>
                    <label
                      className="block text-xs font-semibold text-slate-300 uppercase mb-1.5"
                      htmlFor={statusId}
                    >
                      Hiện trạng mặt bằng
                    </label>
                    <select
                      id={statusId}
                      {...register('status')}
                      className="w-full bg-brand-navy border border-slate-700 text-white px-3.5 py-3 rounded-xl focus:outline-none focus:border-brand-orange text-sm"
                    >
                      <option value="operating">Đang hoạt động giữ xe thủ công</option>
                      <option value="empty-land">Đất trống chưa khai thác</option>
                      <option value="warehouse">Kho bãi kết hợp trạm dừng</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    isLoading={isSubmitting}
                  >
                    <span>XÁC NHẬN ĐĂNG KÝ KHẢO SÁT MIỄN PHÍ</span>
                    <ArrowRight className="h-5 w-5 ml-2 text-white" aria-hidden="true" />
                  </Button>
                </div>

                <p className="text-center text-[11px] text-slate-400 pt-1">
                  Thông tin của bạn được cam kết bảo mật theo tiêu chuẩn ISO 27001. Tuyệt đối không
                  spam.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
