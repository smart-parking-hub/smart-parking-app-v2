import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { MailCheck, CheckCircle2 } from 'lucide-react'

export function InsightsNewsletterSection() {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<{ email: string }>({
    resolver: zodResolver(z.object({ email: z.string().trim().email('Vui lòng nhập email hợp lệ.') })),
    defaultValues: { email: '' },
  })

  return (
    <section id="ban-tin" className="scroll-mt-24 w-full bg-white py-14 border-b border-[#E2E8F0]">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="relative overflow-hidden bg-[#060D1A] text-white rounded-2xl p-8 md:p-12 lg:p-14 shadow-xl border border-slate-800">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 font-mono text-xs uppercase text-[#d95f00] mb-4 font-semibold">
                <MailCheck className="w-3.5 h-3.5" />
                <span>FRETRIX WEEKLY LOGISTICS INTELLIGENCE</span>
              </div>

              <h2 className="font-sora font-bold text-2xl lg:text-3xl text-white tracking-tight mb-4">
                Nhận Báo Cáo Tải Trọng & Xu Hướng Giá Cước Sáng Thứ Hai Hàng Tuần
              </h2>

              <p className="font-inter text-sm md:text-base text-slate-300 max-w-xl leading-relaxed">
                Được hơn 3,400+ giám đốc vận hành, trưởng đội xe và chủ bến bãi tin đọc. Tổng hợp dữ liệu thực tế về tắc nghẽn cảng biển, cảnh báo trạm cân và giá lưu bãi cập nhật trực tiếp.
              </p>
            </div>

            <div className="lg:col-span-5">
              <form className="flex flex-col gap-3" noValidate onSubmit={handleSubmit(() => setIsSubscribed(true))}>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    aria-label="Email nhận bản tin"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby="newsletter-feedback"
                    {...register('email')}
                    placeholder="Nhập email doanh nghiệp của bạn..."
                    className="bg-slate-900 border border-slate-700 text-white font-inter text-sm px-4 py-3.5 rounded-lg flex-1 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-[#d95f00] transition-all"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3.5 rounded-lg bg-[#d95f00] hover:bg-[#b84e00] text-white font-sora text-xs font-bold transition-transform active:scale-95 whitespace-nowrap shadow-md"
                  >
                    ĐĂNG KÝ BẢN TIN
                  </button>
                </div>

                <div id="newsletter-feedback" role="status">
                {errors.email && <p className="text-sm text-orange-300">{errors.email.message}</p>}
                {isSubscribed && (
                  <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Chưa thể gửi đăng ký vì dịch vụ bản tin chưa được kết nối. Vui lòng thử lại sau.</span>
                  </div>
                )}

                </div>
                <p className="font-mono text-xs text-slate-400">
                  Không spam. Hủy đăng ký bất kỳ lúc nào. Dữ liệu bảo mật theo ISO 27001.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
