import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, CheckCircle2, MapPin, Check } from 'lucide-react'
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
      className="w-full bg-brand-navy text-white py-16 px-6 relative overflow-hidden"
      id="onboarding-form"
    >
      {/* Ambient glow */}
      <div className="absolute -right-32 -bottom-32 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1240px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Copy & Perks (6 Cols) */}
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300">
              <span className="w-2 h-2 rounded-full bg-brand-orange" />
              <span>TIẾP NHẬN ĐỐI TÁC MẶT BẰNG</span>
            </div>

            <h2 className="font-sora font-extrabold text-xl sm:text-2xl lg:text-3xl text-white tracking-tight leading-snug">
              Biến Khu Đất Của Bạn Thành <br className="hidden sm:inline" />
              <span className="text-brand-orange">Trạm Dừng Xe Tự Động Sinh Lời.</span>
            </h2>

            <p className="font-inter text-base text-slate-300 leading-relaxed">
              Điền thông tin mặt bằng ngay hôm nay. Đội ngũ chuyên gia hạ tầng của SmartTruckHub sẽ
              liên hệ trong vòng 2 giờ để tư vấn phương án triển khai tối ưu nhất.
            </p>

            <div className="space-y-3 pt-1 font-inter text-sm">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-orange/20 flex items-center justify-center shrink-0">
                  <Check className="h-3.5 w-3.5 text-brand-orange" aria-hidden="true" />
                </div>
                <span className="text-slate-200">Khảo sát đo đạc thực địa miễn phí 100%</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-orange/20 flex items-center justify-center shrink-0">
                  <Check className="h-3.5 w-3.5 text-brand-orange" aria-hidden="true" />
                </div>
                <span className="text-slate-200">
                  Tặng kèm gói cài đặt cổng thanh toán PayOS VietQR tự động
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-orange/20 flex items-center justify-center shrink-0">
                  <Check className="h-3.5 w-3.5 text-brand-orange" aria-hidden="true" />
                </div>
                <span className="text-slate-200">
                  Cam kết kết nối tối thiểu 200 lượt xe/tháng từ sàn SmartTruck
                </span>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-4 text-slate-400 text-xs font-inter border-t border-slate-800">
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
          <div className="lg:col-span-6 bg-[#0B1528] border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xs">
            <div className="mb-5">
              <h3 className="font-sora font-bold text-lg sm:text-xl text-white">
                Đăng Ký Khảo Sát &amp; Mở Bãi Hợp Tác
              </h3>
              <p className="text-xs text-slate-400 font-inter mt-1">
                Vui lòng cung cấp vị trí và diện tích khu đất để nhận báo cáo phân tích dòng tiền trong 24h.
              </p>
            </div>

            {isSubmitSuccessful ? (
              <div
                className="py-8 text-center space-y-3.5 animate-in fade-in zoom-in duration-300"
                id="onboarding-success-state"
              >
                <div className="w-12 h-12 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-7 w-7 text-brand-orange" aria-hidden="true" />
                </div>
                <h4 className="font-sora text-lg sm:text-xl font-bold text-white">
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
                    className="text-xs cursor-pointer"
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
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 font-inter text-sm" id="merchant-reg-form">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                      className={`w-full bg-[#060D1A] border text-white px-3.5 py-2.5 rounded-xl placeholder:text-slate-500 focus:outline-none focus:border-brand-orange text-sm ${
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
                      className={`w-full bg-[#060D1A] border text-white px-3.5 py-2.5 rounded-xl placeholder:text-slate-500 focus:outline-none focus:border-brand-orange text-sm ${
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
                      className={`w-full bg-[#060D1A] border text-white px-3.5 py-2.5 pr-10 rounded-xl placeholder:text-slate-500 focus:outline-none focus:border-brand-orange text-sm ${
                        errors.location ? 'border-rose-500' : 'border-slate-700'
                      }`}
                    />
                    <MapPin className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
                  </div>
                  {errors.location && (
                    <p className="text-xs text-rose-400 mt-1">{errors.location.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                      className="w-full bg-[#060D1A] border border-slate-700 text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange text-sm"
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
                      className="w-full bg-[#060D1A] border border-slate-700 text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange text-sm"
                    >
                      <option value="operating">Đang hoạt động giữ xe thủ công</option>
                      <option value="empty-land">Đất trống chưa khai thác</option>
                      <option value="warehouse">Kho bãi kết hợp trạm dừng</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full bg-brand-orange hover:bg-brand-orange-hover text-[#060D1A] font-sora font-bold text-sm sm:text-base py-3.5 rounded-xl cursor-pointer"
                    isLoading={isSubmitting}
                  >
                    <span>XÁC NHẬN ĐĂNG KÝ KHẢO SÁT MIỄN PHÍ</span>
                    <ArrowRight className="h-5 w-5 ml-2" aria-hidden="true" />
                  </Button>
                </div>

                <p className="text-center text-xs text-slate-400 pt-1">
                  Thông tin của bạn được cam kết bảo mật theo tiêu chuẩn ISO 27001. Tuyệt đối không spam.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
