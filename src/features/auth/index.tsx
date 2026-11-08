import type { AuthFields } from './model/authFields'
import { LoginPage } from './pages/LoginPage'
import { BankField } from './components/BankField'
import { requestEmailOtp } from './api/emailOtp'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { ArrowUpRight, Check, Eye, EyeOff, LoaderCircle } from 'lucide-react'
import { errorMessage, sendData } from '@/shared/api/resources'
import { AuthLayout } from '@/layouts/AuthLayout'
import {
  control,
  Field,
  Notice,
} from '@/shared/components/Workspace'

export { roleHome, sessionRole, clearSession } from './model/session'
export type { Role } from './model/session'
export { RequireRole } from './components/RequireRole'
export { LoginPage } from './pages/LoginPage'
export { ForgotPasswordPage } from './pages/ForgotPasswordPage'

export function AuthPage({ mode }: { mode: 'login' | 'register' | 'forgot' }) {
  if (mode === 'login') return <LoginPage />
  if (mode === 'forgot') return <ForgotPasswordPage />
  return <LegacyAuthPage mode={mode} />
}

function LegacyAuthPage({ mode }: { mode: 'login' | 'register' | 'forgot' }) {
  const form = useForm<AuthFields>({ defaultValues: { role: 'DRIVER' } })
  const emailValue = (form.watch('email') ?? '').trim().toLowerCase()
  const [sent, setSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({})

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
      const email = form.getValues('email')?.trim()
      const valid = Boolean(email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      if (!valid)
        throw new Error('Nhập email hợp lệ để nhận mã.')
      return requestEmailOtp(
        mode === 'register' ? 'register' : 'forgot',
        email.toLowerCase(),
      )
    },
    onSuccess: (data) => {
      setSent(true)
      setCountdown(Math.max(1, data.resendAfterSeconds || data.expiresInSeconds || 60))
    },
  })

  const sentValid = sent && otp.data?.email === emailValue

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
          otpCode: data.otpCode,
          ...(data.role === 'MERCHANT' && data.bankName
            ? {
                bankName: data.bankName,
                bankAccountNum: data.bankAccountNum,
              }
            : {}),
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
  ) => {
    const isPassword = type === 'password'
    return (
      <Field label={label}>
        <div className="relative">
          <input
            id={`auth-${name}`}
            className={`${control} min-h-11 sm:min-h-12 text-sm bg-white/50 hover:bg-white/65 focus:bg-white/90 backdrop-blur-sm border border-white/60 text-brand-navy placeholder:text-slate-500 focus:border-[#d95f00] focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-1`}
            disabled={submit.isPending}
            aria-invalid={Boolean(form.formState.errors[name])}
            aria-describedby={form.formState.errors[name] ? `auth-${name}-error` : undefined}
            type={isPassword && showPassword[name] ? 'text' : type}
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
            {...form.register(name, {
              required: true,
              ...options,
              ...(name === 'phone' ? { setValueAs: (value: string) => value.replace(/\s/g, '') } : {}),
            })}
          />
          {isPassword && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] rounded-lg transition-colors cursor-pointer"
              onClick={() => setShowPassword((prev) => ({ ...prev, [name]: !prev[name] }))}
              aria-label={showPassword[name] ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showPassword[name] ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {form.formState.errors[name] && (
          <span id={`auth-${name}-error`} role="alert" className="text-xs text-red-700 font-medium">
            Thông tin chưa hợp lệ.
          </span>
        )}
      </Field>
    )
  }

  return (
    <AuthLayout>
      <div className="mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2.5 font-sora text-lg sm:text-xl font-bold text-brand-navy mb-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] rounded-lg p-1 -m-1 transition-colors group"
        >
          <img
            src="/image-smart-parking-hub.png"
            alt="Smart Parking Hub Logo"
            className="w-8 h-8 rounded-xl object-contain shrink-0 shadow-xs group-hover:scale-105 transition-transform"
          />
          <span className="tracking-tight text-brand-navy">SMARTTRUCK HUB</span>
        </Link>
        <h1 className="font-sora text-2xl lg:text-3xl font-bold tracking-tight text-brand-navy">
          {title}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-brand-muted">
          {mode === 'login'
            ? 'Đăng nhập để tiếp tục công việc của bạn.'
            : 'Thông tin được xác thực bởi hệ thống SmartTruck Hub.'}
        </p>
      </div>

      {submit.isSuccess && mode !== 'login' ? (
        <AuthSuccess mode={mode} />
      ) : (
        <form
          className="space-y-4 [&_input]:min-h-11 [&_input]:text-sm [&_select]:min-h-11 [&_label]:gap-1.5 [&_label]:text-sm [&_label]:text-brand-navy [&_label]:font-semibold"
          onSubmit={form.handleSubmit((data) => submit.mutate(data))}
        >
          {mode !== 'forgot' &&
            input('phone', 'Số điện thoại', 'tel', {
              pattern: /^(0|\+84)[35789][0-9]{8}$/,
            })}
          {mode !== 'login' && input('email', 'Email nhận mã xác thực', 'email')}
          {mode === 'register' && (
            <>
              <Field label="Bạn tham gia với vai trò">
                <select
                  className={`${control} bg-white/50 backdrop-blur-sm border border-white/60 text-brand-navy focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-1`}
                  {...form.register('role')}
                >
                  <option value="DRIVER">Tài xế</option>
                  <option value="MERCHANT">Chủ bãi</option>
                </select>
              </Field>
              {input('fullName', 'Họ và tên', 'text', { maxLength: 100 })}
              {input('citizenId', 'CCCD / CMND', 'text', {
                required: false,
                pattern: /^$|^(?:[0-9]{9}|[0-9]{12})$/,
              })}
              {form.watch('role') === 'MERCHANT' && (
                <>
                  <BankField control={form.control} disabled={submit.isPending} />
                  {input('bankAccountNum', 'Số tài khoản ngân hàng', 'text', {
                    required: true,
                  })}
                </>
              )}
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
                disabled={otp.isPending || countdown > 0}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/60 bg-white/50 backdrop-blur-sm px-4 py-2.5 text-sm font-semibold text-brand-navy hover:bg-white/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-2 disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
                onClick={() => otp.mutate()}
              >
                {otp.isPending ? (
                  <>
                    <LoaderCircle className="animate-spin" size={16} />
                    Đang gửi…
                  </>
                ) : countdown ? (
                  `Gửi lại sau ${countdown}s`
                ) : (
                  'Gửi mã qua email'
                )}
              </button>
              {sentValid && (
                <div className="flex items-start gap-3 rounded-xl border border-brand-border bg-brand-surface p-4 text-xs">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-orange text-white">
                    <Check size={20} strokeWidth={2.5} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-sora text-sm font-semibold leading-5">
                      {mode === 'forgot' ? 'Kiểm tra hộp thư của bạn' : 'Mã xác thực đã được gửi'}
                    </p>
                    <p className="mt-1 text-sm leading-5 text-brand-muted">
                      {mode === 'forgot' ? (
                        'Nếu email đã đăng ký, bạn sẽ nhận được mã. '
                      ) : (
                        <>
                          Gửi đến{' '}
                          <strong className="break-all font-medium text-brand-navy">
                            {otp.data?.email || form.getValues('email')}
                          </strong>
                          .{' '}
                        </>
                      )}
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
            className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#d95f00] px-5 py-3 text-base font-semibold text-white hover:bg-[#b84e00] active:bg-[#9e4300] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-2 disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
          >
            {submit.isPending ? (
              <>
                <LoaderCircle className="animate-spin" size={18} aria-hidden="true" />
                Đang xử lý…
              </>
            ) : (
              <>
                {mode === 'login'
                  ? 'Đăng nhập'
                  : mode === 'register'
                    ? 'Tạo tài khoản'
                    : 'Đặt lại mật khẩu'}
                <ArrowUpRight size={18} />
              </>
            )}
          </button>
        </form>
      )}
      <nav aria-label="Tài khoản" className="mt-5 flex flex-wrap gap-5 text-sm text-slate-300">
        {mode !== 'login' && (
          <Link
            to="/login"
            className="text-brand-orange hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] rounded-sm transition-colors"
          >
            Đăng nhập
          </Link>
        )}
        {mode !== 'register' && (
          <Link
            to="/register"
            className="text-brand-orange hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] rounded-sm transition-colors"
          >
            Tạo tài khoản
          </Link>
        )}
        {mode !== 'forgot' && (
          <Link
            to="/forgot-password"
            className="text-brand-orange hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] rounded-sm transition-colors"
          >
            Quên mật khẩu?
          </Link>
        )}
      </nav>
    </AuthLayout>
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
      className="rounded-3xl border border-brand-border bg-white p-7 shadow-sm sm:p-10"
    >
      <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-navy text-brand-orange">
        <Check size={28} strokeWidth={2.5} />
      </div>
      <p className="mb-3 text-xs font-semibold tracking-[.18em] text-brand-muted">
        {mode === 'register'
          ? 'TÀI KHOẢN ĐÃ SẴN SÀNG'
          : 'BẢO MẬT ĐÃ ĐƯỢC CẬP NHẬT'}
      </p>
      <h2 className="font-sora text-2xl font-semibold leading-relaxed text-brand-navy">
        {mode === 'register' ? 'Đăng ký thành công!' : 'Đã đặt lại mật khẩu.'}
      </h2>
      <p className="mb-8 mt-3 max-w-md text-base leading-7 text-brand-muted">
        {mode === 'register'
          ? 'Chào mừng bạn đến với SmartTruck Hub. Đăng nhập để tìm điểm đỗ và bắt đầu hành trình của mình.'
          : 'Bạn có thể đăng nhập bằng mật khẩu mới để tiếp tục sử dụng tài khoản.'}
      </p>
      <Link
        className="inline-flex min-h-14 w-full sm:w-auto sm:min-w-64 items-center justify-center gap-2 rounded-xl bg-[#d95f00] px-5 py-3 text-base font-semibold text-white hover:bg-[#b84e00] active:bg-[#9e4300] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-2 transition-colors shadow-xs"
        to="/login"
      >
        Đến trang đăng nhập
        <ArrowUpRight size={20} />
      </Link>
    </section>
  )
}

export function AccessPage({ notFound = false }: { notFound?: boolean }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-navy p-8 text-white">
      <div className="max-w-xl">
        <p className="font-mono text-brand-orange text-xs tracking-widest uppercase mb-2">
          SMARTTRUCK / {notFound ? '404' : '403'}
        </p>
        <h1 className="my-4 font-sora text-3xl sm:text-4xl font-bold">
          {notFound ? 'Không tìm thấy trang.' : 'Bạn chưa có quyền truy cập.'}
        </h1>
        <p className="mb-8 text-slate-300 leading-relaxed text-sm sm:text-base">
          {notFound
            ? 'Liên kết có thể đã thay đổi hoặc không tồn tại. Hãy trở về trang chủ để tiếp tục.'
            : 'Đăng nhập bằng tài khoản có vai trò phù hợp hoặc liên hệ quản trị viên.'}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d95f00] px-5 py-3 text-sm font-semibold text-white hover:bg-[#b84e00] active:bg-[#9e4300] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy transition-colors shadow-xs"
            to="/"
          >
            Về trang chủ
          </Link>
          <Link
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-transparent px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy transition-colors"
            to="/login"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    </main>
  )
}
