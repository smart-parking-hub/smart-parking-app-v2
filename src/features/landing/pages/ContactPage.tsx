import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { LandingNavbar } from '../components/common/LandingNavbar'
import { LandingFooter } from '../components/common/LandingFooter'
import {
  Workspace,
  Panel,
  Field,
  button,
  control,
} from '@/shared/components/Workspace'
export function ContactPage() {
  const form = useForm<{ name: string; email: string; message: string }>()
  return (
    <>
      <LandingNavbar />
      <main className="bg-brand-surface pb-12 pt-28">
        <Workspace
          title="Kết nối cùng SmartTruck Hub"
          eyebrow="CONTACT / LET’S MOVE FORWARD"
          description="Hỗ trợ hành trình của bạn, kết nối vận hành của doanh nghiệp."
        >
          <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
            <Panel className="!bg-brand-navy !text-white">
              <h2 className="font-sora text-3xl leading-snug">
                Mỗi câu hỏi.
                <br />
                <span className="text-brand-orange">Một kết nối mới.</span>
              </h2>
              <div className="mt-10 space-y-6">
                <a className="block text-2xl" href="tel:19006868">
                  1900 6868
                </a>
                <a
                  className="block underline"
                  href="mailto:hotro@smarttruckhub.vn"
                >
                  hotro@smarttruckhub.vn
                </a>
                <Link className="block text-brand-orange" to="/disputes">
                  Khiếu nại về lượt đỗ →
                </Link>
              </div>
            </Panel>
            <Panel title="Gửi lời nhắn">
              <form
                className="space-y-5"
                onSubmit={form.handleSubmit((data) => {
                  window.location.href = `mailto:hotro@smarttruckhub.vn?subject=${encodeURIComponent(`Liên hệ SmartTruck — ${data.name}`)}&body=${encodeURIComponent(`Họ tên: ${data.name}\nEmail: ${data.email}\n\n${data.message}`)}`
                })}
              >
                <Field label="Họ và tên">
                  <input
                    className={control}
                    {...form.register('name', { required: true })}
                  />
                </Field>
                <Field label="Email liên hệ">
                  <input
                    className={control}
                    type="email"
                    {...form.register('email', { required: true })}
                  />
                </Field>
                <Field label="Nội dung cần hỗ trợ">
                  <textarea
                    rows={6}
                    className={control}
                    {...form.register('message', { required: true })}
                  />
                </Field>
                <p className="text-xs text-brand-muted">
                  Mở ứng dụng email để kiểm tra và gửi lời nhắn tới đội hỗ trợ.
                </p>
                <button className={button}>Soạn email liên hệ →</button>
              </form>
            </Panel>
          </div>
        </Workspace>
      </main>
      <LandingFooter />
    </>
  )
}
