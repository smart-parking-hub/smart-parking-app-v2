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
  const [registerStep, setRegisterStep] = useState<1 | 2>(1)
  const [isOtpFocused, setIsOtpFocused] = useState(false)

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
    placeholder?: string,
  ) => {
    const isPassword = type === 'password'
    return (
      <Field label={label}>
        <div className="relative">
          <input
            id={`auth-${name}`}
            className={`${control} min-h-12 sm:min-h-14 text-base bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#d95f00] focus:ring-2 focus:ring-[#d95f00]/20 focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-1 rounded-xl px-4 py-3 shadow-2xs transition-colors`}
            disabled={submit.isPending}
            aria-invalid={Boolean(form.formState.errors[name])}
            aria-describedby={form.formState.errors[name] ? `auth-${name}-error` : undefined}
            type={isPassword && showPassword[name] ? 'text' : type}
            placeholder={placeholder}
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
      <div className="mb-6 sm:mb-8 flex flex-col items-center text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-3.5 font-sora text-xl sm:text-2xl font-bold text-brand-navy mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] rounded-2xl p-1.5 transition-all hover:scale-105 group"
        >
          <img
            src="/image-smart-parking-hub.png"
            alt="Smart Parking Hub Logo"
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl object-contain shrink-0 shadow-md ring-1 ring-white/60 group-hover:shadow-lg transition-all"
          />
          <span className="tracking-tight text-brand-navy font-extrabold text-xl sm:text-2xl group-hover:text-brand-orange transition-colors">SMARTTRUCK HUB</span>
        </Link>
        <h1 className="font-sora text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-navy drop-shadow-xs">
          {title}
        </h1>
        <p className="mt-2 text-base sm:text-lg text-slate-700 font-medium">
          {mode === 'login'
            ? 'Đăng nhập để tiếp tục công việc của bạn.'
            : 'Thông tin được xác thực bởi hệ thống SmartTruck Hub.'}
        </p>
      </div>

      {submit.isSuccess && mode !== 'login' ? (
        <AuthSuccess mode={mode} />
      ) : (
        <form
          className="space-y-4 [&_input:not([role='combobox'])]:min-h-12 [&_input:not([role='combobox'])]:sm:min-h-14 [&_input:not([role='combobox'])]:text-base [&_input:not([role='combobox'])]:rounded-xl [&_input:not([role='combobox'])]:px-4 [&_select]:min-h-12 [&_select]:sm:min-h-14 [&_select]:text-base [&_select]:rounded-xl [&_select]:px-4 [&_label]:gap-1.5 [&_label]:text-sm [&_label]:sm:text-base [&_label]:text-brand-navy [&_label]:font-bold"
          onSubmit={form.handleSubmit((data) => submit.mutate(data))}
        >
          {mode === 'register' && (
            <div className="flex items-center justify-center gap-2 mb-2">
              <button
                type="button"
                onClick={() => setRegisterStep(1)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  registerStep === 1
                    ? 'bg-[#d95f00] text-white shadow-xs ring-2 ring-[#d95f00]/30'
                    : 'bg-white/80 border border-slate-300 text-slate-700 hover:border-[#d95f00] hover:text-brand-orange'
                }`}
              >
                <span className="flex size-4 items-center justify-center rounded-full bg-white/20 text-[10px]">1</span>
                <span>Thông tin &amp; vai trò</span>
              </button>
              <div className="h-0.5 w-6 bg-slate-300" />
              <button
                type="button"
                onClick={() => setRegisterStep(2)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  registerStep === 2
                    ? 'bg-[#d95f00] text-white shadow-xs ring-2 ring-[#d95f00]/30'
                    : 'bg-white/80 border border-slate-300 text-slate-700 hover:border-[#d95f00] hover:text-brand-orange'
                }`}
              >
                <span className="flex size-4 items-center justify-center rounded-full bg-white/20 text-[10px]">2</span>
                <span>Xác thực &amp; Mật khẩu</span>
              </button>
            </div>
          )}

          {/* STEP 1: Vai trò & Thông tin cơ bản */}
          <div className={mode === 'register' && registerStep !== 1 ? 'sr-only' : 'space-y-4'}>
            {mode === 'register' && (
              <Field label="Bạn tham gia với vai trò">
                <select
                  id="auth-role"
                  className={`${control} min-h-12 sm:min-h-14 text-base bg-white border border-slate-300 text-slate-900 rounded-xl px-4 py-3 shadow-2xs focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-1`}
                  {...form.register('role')}
                >
                  <option value="DRIVER">Tài xế</option>
                  <option value="MERCHANT">Chủ bãi</option>
                </select>
              </Field>
            )}
            {mode === 'register' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {input('fullName', 'Họ và tên', 'text', { maxLength: 100 }, 'Ví dụ: Nguyễn Văn Hùng')}
                {input('phone', 'Số điện thoại', 'tel', {
                  pattern: /^(0|\+84)[35789][0-9]{8}$/,
                }, 'Ví dụ: 0918239485')}
              </div>
            ) : mode !== 'forgot' ? (
              input('phone', 'Số điện thoại', 'tel', {
                pattern: /^(0|\+84)[35789][0-9]{8}$/,
              }, 'Ví dụ: 0918239485')
            ) : null}
            {mode === 'register' &&
              input('citizenId', 'CCCD / CMND', 'text', {
                required: false,
                pattern: /^$|^(?:[0-9]{9}|[0-9]{12})$/,
              }, 'Ví dụ: 079123456789 (9 hoặc 12 số)')}
            {mode === 'register' && form.watch('role') === 'MERCHANT' && (
              <div className="space-y-3.5">
                <BankField control={form.control} disabled={submit.isPending} />
                {input('bankAccountNum', 'Số tài khoản ngân hàng', 'text', {
                  required: true,
                }, 'Ví dụ: 19036789123456')}
              </div>
            )}
            {mode === 'register' && (
              <button
                type="button"
                onClick={async () => {
                  const fieldsToValidate = form.watch('role') === 'MERCHANT'
                    ? (['phone', 'fullName', 'citizenId', 'bankName', 'bankAccountNum'] as const)
                    : (['phone', 'fullName', 'citizenId'] as const)
                  const valid = await form.trigger(fieldsToValidate as any)
                  if (valid) setRegisterStep(2)
                }}
                className="inline-flex min-h-12 sm:min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#d95f00] px-5 py-3 text-base font-bold text-white hover:bg-[#b84e00] active:bg-[#9e4300] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-2 transition-all shadow-md cursor-pointer"
              >
                <span>Tiếp tục bước 2</span>
                <ArrowUpRight size={18} />
              </button>
            )}
          </div>

          {/* STEP 2: Xác thực Email, OTP và Mật khẩu */}
          <div className={mode === 'register' && registerStep !== 2 ? 'sr-only' : 'space-y-4'}>
            {mode !== 'login' && (
              <div className="space-y-1.5">
                <label htmlFor="auth-email" className="block text-sm sm:text-base font-bold text-brand-navy">
                  Email nhận mã xác thực
                </label>
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <div className="relative flex-1">
                    <input
                      id="auth-email"
                      type="email"
                      autoComplete="email"
                      placeholder="Ví dụ: taixe.nguyen@gmail.com"
                      disabled={submit.isPending}
                      aria-invalid={Boolean(form.formState.errors.email)}
                      aria-describedby={form.formState.errors.email ? 'auth-email-error' : undefined}
                      className={`${control} min-h-12 sm:min-h-14 text-base bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-[#d95f00] focus:ring-2 focus:ring-[#d95f00]/20 rounded-xl px-4 py-3 shadow-2xs transition-colors w-full`}
                      {...form.register('email', { required: true })}
                    />
                  </div>
                  <button
                    type="button"
                    aria-label={otp.isPending ? 'Đang gửi…' : countdown ? `Gửi lại sau ${countdown}s` : 'Gửi mã qua email'}
                    disabled={otp.isPending || countdown > 0}
                    onClick={() => otp.mutate()}
                    className="shrink-0 min-h-12 sm:min-h-14 px-3 sm:px-4 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm font-bold text-brand-navy hover:bg-orange-50 hover:border-[#d95f00] hover:text-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-1 disabled:opacity-50 transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    {otp.isPending ? (
                      <>
                        <LoaderCircle className="animate-spin" size={16} />
                        <span>Gửi…</span>
                      </>
                    ) : countdown ? (
                      <span>{countdown}s</span>
                    ) : (
                      <span>Gửi mã OTP</span>
                    )}
                  </button>
                </div>
                {form.formState.errors.email && (
                  <span id="auth-email-error" role="alert" className="text-xs text-red-700 font-medium">
                    Thông tin chưa hợp lệ.
                  </span>
                )}
              </div>
            )}

            {sentValid && (
              <div className="flex items-start gap-3 rounded-xl border border-brand-border bg-brand-surface p-3 sm:p-3.5 text-xs">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-orange text-white">
                  <Check size={18} strokeWidth={2.5} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="font-sora text-xs sm:text-sm font-semibold leading-5 text-brand-navy">
                    {mode === 'forgot' ? 'Kiểm tra hộp thư của bạn' : 'Mã xác thực đã được gửi'}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-brand-muted">
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
                    Mã gồm 6 số, có hiệu lực 5 phút.
                  </p>
                </div>
              </div>
            )}

            {mode !== 'login' && (
              <div className="space-y-1.5">
                <label htmlFor="auth-otpCode" className="block text-sm sm:text-base font-bold text-brand-navy">
                  Mã xác thực email (6 số)
                </label>
                <div className="relative max-w-[360px] mx-auto py-1">
                  <input
                    id="auth-otpCode"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder="123456"
                    aria-invalid={Boolean(form.formState.errors.otpCode)}
                    aria-describedby={form.formState.errors.otpCode ? 'auth-otpCode-error' : undefined}
                    className="absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer caret-transparent"
                    {...form.register('otpCode', {
                      required: true,
                      pattern: /^\d{6}$/,
                    })}
                    onFocus={() => setIsOtpFocused(true)}
                    onBlur={() => setIsOtpFocused(false)}
                  />
                  <div className="grid grid-cols-6 gap-2 sm:gap-2.5 pointer-events-none">
                    {[0, 1, 2, 3, 4, 5].map((index) => {
                      const val = form.watch('otpCode') || ''
                      const char = val[index] || ''
                      const activeIdx = Math.min(val.length, 5)
                      const isActive = isOtpFocused && index === activeIdx
                      return (
                        <div
                          key={index}
                          className={`h-11 sm:h-13 rounded-xl border flex items-center justify-center text-lg sm:text-xl font-bold transition-all shadow-2xs ${
                            isActive
                              ? 'border-[#d95f00] ring-2 ring-[#d95f00]/30 bg-orange-50/70 text-[#d95f00]'
                              : char
                                ? 'border-slate-400 bg-white text-brand-navy'
                                : 'border-slate-300 bg-white/90 text-slate-300'
                          }`}
                        >
                          {char}
                        </div>
                      )
                    })}
                  </div>
                </div>
                {form.formState.errors.otpCode && (
                  <p id="auth-otpCode-error" role="alert" className="text-xs text-red-700 font-medium text-center">
                    Thông tin chưa hợp lệ.
                  </p>
                )}
              </div>
            )}

            {mode !== 'forgot' &&
              input('password', 'Mật khẩu', 'password', {
                minLength: 6,
                maxLength: 50,
              }, 'Mật khẩu từ 6 đến 50 ký tự')}

            {mode === 'forgot' &&
              input('newPassword', 'Mật khẩu mới', 'password', {
                minLength: 6,
              }, 'Mật khẩu mới từ 6 đến 50 ký tự')}

            {otp.isError && <Notice error>{errorMessage(otp.error)}</Notice>}
            {submit.isError && (
              <Notice error>
                {errorMessage(submit.error)}
              </Notice>
            )}

            {mode === 'register' ? (
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setRegisterStep(1)}
                  className="inline-flex min-h-12 sm:min-h-14 px-4 items-center justify-center rounded-xl border border-slate-300 bg-white text-sm sm:text-base font-bold text-slate-700 hover:bg-slate-100 hover:border-slate-400 transition-colors shadow-2xs cursor-pointer shrink-0"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  disabled={submit.isPending}
                  className="inline-flex min-h-12 sm:min-h-14 flex-1 items-center justify-center gap-2 rounded-xl bg-[#d95f00] px-5 py-3 text-base font-bold text-white hover:bg-[#b84e00] active:bg-[#9e4300] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-2 disabled:opacity-50 transition-colors shadow-md cursor-pointer"
                >
                  {submit.isPending ? (
                    <>
                      <LoaderCircle className="animate-spin" size={18} aria-hidden="true" />
                      Đang xử lý…
                    </>
                  ) : (
                    <>
                      Tạo tài khoản
                      <ArrowUpRight size={18} />
                    </>
                  )}
                </button>
              </div>
            ) : (
              <button
                type="submit"
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
                      : 'Đặt lại mật khẩu'}
                    <ArrowUpRight size={18} />
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      )}
      <nav aria-label="Tài khoản" className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm sm:text-base text-slate-700 font-medium">
        {mode !== 'login' && (
          <div>
            <span>Đã có tài khoản? </span>
            <Link
              to="/login"
              className="font-bold text-brand-orange hover:text-[#9e4300] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] rounded-xs transition-colors"
            >
              Đăng nhập
            </Link>
          </div>
        )}
        {mode !== 'register' && (
          <div>
            <span>Chưa có tài khoản? </span>
            <Link
              to="/register"
              className="font-bold text-brand-orange hover:text-[#9e4300] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] rounded-xs transition-colors"
            >
              Tạo tài khoản
            </Link>
          </div>
        )}
        {mode !== 'forgot' && (
          <Link
            to="/forgot-password"
            className="font-semibold text-brand-orange hover:text-[#9e4300] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] rounded-xs transition-colors"
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
