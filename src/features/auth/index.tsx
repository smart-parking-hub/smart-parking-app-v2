import type { AuthFields } from './model/authFields'
import { BankField } from './components/BankField'
import { requestEmailOtp } from './api/emailOtp'
import { LoginPage } from './pages/LoginPage'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { ArrowUpRight, Check, ShieldCheck, Truck } from 'lucide-react'
import { errorMessage, sendData } from '@/shared/api/resources'
import {
  button,
  control,
  Field,
  Notice,
  secondary,
} from '@/shared/components/Workspace'
export { roleHome, sessionRole, clearSession } from './model/session'
export type { Role } from './model/session'
export { RequireRole } from './components/RequireRole'
export { LoginPage } from './pages/LoginPage'
export function AuthPage({ mode }: { mode: 'login' | 'register' | 'forgot' }) {
  return mode === 'login' ? <LoginPage /> : <LegacyAuthPage mode={mode} />
}
function LegacyAuthPage({ mode }: { mode: 'login' | 'register' | 'forgot' }) {
  const form = useForm<AuthFields>({ defaultValues: { role: 'DRIVER' } })
  const email = (form.watch('email') ?? '').trim().toLowerCase()
  const [countdown, setCountdown] = useState(0)
  useEffect(() => {
    if (!countdown) return
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])
  const title =
    mode === 'login'
      ? 'Chào mừng trở lại.'
      : mode === 'register'
        ? 'Bắt đầu hành trình mới.'
        : 'Khôi phục quyền truy cập.'
  const otp = useMutation({
    mutationFn: async () => {
      if (!(await form.trigger('email')))
        throw new Error('Nhập email hợp lệ để nhận mã.')
      return requestEmailOtp(mode === 'register' ? 'register' : 'forgot', form.getValues('email').trim().toLowerCase())
    },
    onSuccess: (data) => {
      setCountdown(Math.max(1, data.resendAfterSeconds || 60))
    },
  })
  const sent = otp.isSuccess && otp.data.email === email
  const submit = useMutation({
    mutationFn: async (data: AuthFields) => {
      if (mode === 'register')
        await sendData('post', '/api/v1/auth/register', {
          phone: data.phone,
          password: data.password,
          email: data.email.trim().toLowerCase(),
          role: data.role,
          fullName: data.fullName,
          citizenId: data.citizenId,
          ...(data.role === 'MERCHANT' ? { bankName: data.bankName, bankAccountNum: data.bankAccountNum } : {}),
          otpCode: data.otpCode,
        })
      else
        await sendData('post', '/api/v1/auth/forgot-password/reset', {
          email: data.email.trim().toLowerCase(),
          otpCode: data.otpCode,
          newPassword: data.newPassword,
        })
    },
  })
  const input = (
    name: keyof AuthFields,
    label: string,
    type = 'text',
    options: Parameters<typeof form.register>[1] = {},
  ) => (
    <Field label={label}>
      <input
        className={control}
        disabled={submit.isPending}
        aria-invalid={Boolean(form.formState.errors[name])}
        type={type}
        autoComplete={
          name === 'password'
            ? mode === 'login'
              ? 'current-password'
              : 'new-password'
            : name === 'newPassword'
              ? 'new-password'
              : name === 'otpCode'
                ? 'one-time-code'
                : name === 'phone'
                  ? 'tel'
                  : name === 'email'
                    ? 'email'
                    : 'off'
        }
        {...form.register(name, { required: true, ...options, ...(name === 'phone' ? { setValueAs: (value: string) => value.replace(/\s/g, '') } : {}) })}
      />
      {form.formState.errors[name] && (
        <span role="alert" className="text-xs text-red-700">
          Thông tin chưa hợp lệ.
        </span>
      )}
    </Field>
  )
  return (
    <main className="min-h-screen bg-brand-surface font-inter lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <aside className="relative flex flex-col justify-between overflow-hidden bg-brand-navy p-8 text-white lg:p-16">
        <Link
          to="/"
          className="flex items-center gap-3 font-sora text-xl font-bold"
        >
          <Truck className="text-brand-orange" />
          Smart Parking Hub
        </Link>
        <div className="py-12 lg:py-24">
          <p className="mb-6 font-mono text-xs tracking-[.3em] text-brand-orange">
            KẾT NỐI MỌI ĐIỂM ĐỖ
          </p>
          <h2 className="max-w-xl font-sora text-4xl leading-tight lg:text-6xl">
            Một điểm đỗ.
            <br />
            <span className="text-brand-orange">Ngàn hành trình.</span>
          </h2>
          <p className="mt-8 max-w-md text-sm leading-7 text-slate-300">
            Quản lý bãi đỗ, đặt chỗ và vận hành cổng trong cùng một hệ thống
            dành cho cộng đồng vận tải.
          </p>
        </div>
        <div className="flex items-center gap-3 border-t border-slate-700 pt-6 text-sm text-slate-300">
          <ShieldCheck className="text-brand-orange" />
          An tâm trên từng chặng đường
        </div>
      </aside>
      <section className="flex items-center justify-center px-6 py-12 md:px-14 md:py-16 xl:px-20 2xl:px-28">
        <div
          className={`w-full ${submit.isSuccess ? 'max-w-[520px]' : mode === 'register' ? 'max-w-[680px]' : 'max-w-[600px]'}`}
        >
          {!submit.isSuccess && <>
          <h1 className="font-sora text-3xl font-semibold leading-snug tracking-tight text-brand-navy xl:text-4xl">
            {title}
          </h1>
          <p className="mb-10 mt-4 text-base leading-7 text-brand-muted">
            {mode === 'login'
              ? 'Đăng nhập để tiếp tục công việc của bạn.'
              : 'Xác thực email để bảo vệ tài khoản của bạn.'}
          </p>
          </>}
          {submit.isSuccess && mode !== 'login' ? (
            <AuthSuccess mode={mode} />
          ) : (
            <form
              noValidate
              className="space-y-6 [&_input]:min-h-14 [&_input]:text-base [&_select]:min-h-14 [&_label]:gap-3 [&_label]:text-base"
              onSubmit={form.handleSubmit((data) => submit.mutate(data))}
            >
              {mode !== 'forgot' &&
                <div className="space-y-2">{input('phone', 'Số điện thoại', 'tel', {
                  pattern: /^(0|\+84)[35789][0-9]{8}$/,
                })}<p className="text-sm text-brand-muted">Dùng để đăng nhập. Bước này chưa xác thực số điện thoại.</p></div>}
              {mode !== 'login' && input('email', 'Email nhận mã xác thực', 'email', {
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                maxLength: 100,
                setValueAs: (value: string) => value.trim(),
              })}
              {mode === 'register' && (
                <>
                  <Field label="Bạn tham gia với vai trò">
                    <select className={control} {...form.register('role')}>
                      <option value="DRIVER">Tài xế</option>
                      <option value="MERCHANT">Chủ bãi</option>
                    </select>
                  </Field>
                  {input('fullName', 'Họ và tên', 'text', { maxLength: 100 })}
                  {form.watch('role') === 'MERCHANT' && <>
                    <BankField control={form.control} disabled={submit.isPending} />
                    {input('bankAccountNum', 'Số tài khoản ngân hàng', 'text', { pattern: /^\d{6,30}$/ })}
                  </>}
                  {input('citizenId', 'CCCD / CMND', 'text', {
                    required: false,
                    pattern: /^$|^(?:[0-9]{9}|[0-9]{12})$/,
                  })}
                </>
              )}
              {mode !== 'forgot' &&
                input('password', 'Mật khẩu', 'password', {
                  minLength: 6,
                  maxLength: 50,
                })}
              {mode !== 'login' && (
                <>
                  <button
                    type="button"
                    disabled={otp.isPending || submit.isPending || countdown > 0}
                    className={secondary}
                    onClick={() => otp.mutate()}
                  >
                    {otp.isPending ? 'Đang gửi email…' : countdown ? `Gửi lại sau ${countdown}s` : 'Gửi mã qua email'}
                  </button>
                  {sent && (
                    <div
                      role="status"
                      aria-live="polite"
                      className="flex items-start gap-3 rounded-xl border border-brand-orange/25 border-l-4 border-l-brand-orange bg-brand-orange/5 p-4 text-brand-navy"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-orange text-white">
                        <Check size={20} strokeWidth={2.5} aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-sora text-sm font-semibold leading-5">
                          {mode === 'forgot' ? 'Kiểm tra hộp thư của bạn' : 'Mã xác thực đã được gửi'}
                        </p>
                        <p className="mt-1 text-sm leading-5 text-brand-muted">
                          {mode === 'forgot' ? 'Nếu email đã đăng ký, bạn sẽ nhận được mã. ' : <>Gửi đến <strong className="break-all font-medium text-brand-navy">{otp.data?.email}</strong>. </>}
                          Mã gồm 6 số, có hiệu lực 5 phút. Kiểm tra cả thư rác.
                        </p>
                      </div>
                    </div>
                  )}
                  {input('otpCode', 'Mã xác thực email (6 số)', 'text', {
                    pattern: /^\d{6}$/,
                  })}
                  {mode === 'forgot' &&
                    input('newPassword', 'Mật khẩu mới', 'password', {
                      minLength: 6,
                      maxLength: 50,
                    })}
                </>
              )}
              {otp.isError && <Notice error>{errorMessage(otp.error)}</Notice>}
              {submit.isError && (
                <Notice error>
                  {errorMessage(submit.error)}
                </Notice>
              )}
              <button
                disabled={submit.isPending}
                className={`${button} w-full`}
              >
                {submit.isPending
                  ? 'Đang xử lý…'
                  : mode === 'login'
                    ? 'Đăng nhập'
                    : mode === 'register'
                      ? 'Tạo tài khoản'
                      : 'Đặt lại mật khẩu'}
                <ArrowUpRight size={18} />
              </button>
            </form>
          )}
          {!submit.isSuccess && <nav className="mt-7 flex flex-wrap gap-5 text-sm text-brand-muted">
            {mode !== 'login' && <Link to="/login">Đăng nhập</Link>}
            {mode !== 'register' && <Link to="/register">Tạo tài khoản</Link>}
            {mode !== 'forgot' && (
              <Link to="/forgot-password">Quên mật khẩu?</Link>
            )}
          </nav>}
        </div>
      </section>
    </main>
  )
}
export function AuthSuccess({
  mode = 'register',
}: {
  mode?: 'register' | 'forgot'
}) {
  return (
    <section
      role="status"
      aria-live="polite"
      className="overflow-hidden rounded-2xl border border-brand-border border-t-4 border-t-brand-orange bg-white p-6 font-inter sm:p-8"
    >
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-brand-navy">
          <Check size={24} strokeWidth={2.5} aria-hidden="true" />
        </span>
        <p className="text-sm font-semibold text-brand-navy">
          {mode === 'register' ? 'Tài khoản đã sẵn sàng' : 'Mật khẩu đã cập nhật'}
        </p>
      </div>
      <h1 className="font-sora text-2xl font-semibold leading-snug tracking-tight text-brand-navy sm:text-3xl">
        {mode === 'register' ? 'Đăng ký thành công' : 'Đặt lại mật khẩu thành công'}
      </h1>
      <p className="mt-3 text-base leading-6 text-brand-muted">
        {mode === 'register'
          ? 'Đăng nhập để bắt đầu tìm và đặt chỗ đỗ xe.'
          : 'Đăng nhập bằng mật khẩu mới để tiếp tục.'}
      </p>
      <Link
        className={`${button} mt-7 min-h-12 w-full text-base`}
        to="/login"
      >
        Đăng nhập
        <ArrowUpRight size={18} aria-hidden="true" />
      </Link>
    </section>
  )
}

export function AccessPage({ notFound = false }: { notFound?: boolean }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-navy p-8 text-white">
      <div className="max-w-xl">
        <p className="font-mono text-brand-orange">
          SMARTTRUCK / {notFound ? '404' : '403'}
        </p>
        <h1 className="my-6 font-sora text-4xl">
          {notFound ? 'Không tìm thấy trang.' : 'Bạn chưa có quyền truy cập.'}
        </h1>
        <p className="mb-8 text-slate-300">
          {notFound
            ? 'Liên kết có thể đã thay đổi. Hãy trở về trang chủ để tiếp tục.'
            : 'Đăng nhập bằng tài khoản có vai trò phù hợp hoặc liên hệ quản trị viên.'}
        </p>
        <Link className={button} to="/">
          Về trang chủ
        </Link>
        <Link className="ml-6 underline" to="/login">
          Đăng nhập
        </Link>
      </div>
    </main>
  )
}
