import { LoginPage } from './pages/LoginPage'
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

export function AuthPage({ mode }: { mode: 'login' | 'register' | 'forgot' }) {
  return mode === 'login' ? <LoginPage /> : <LegacyAuthPage mode={mode} />
}

interface AuthFields {
  phone: string
  password: string
  email: string
  fullName: string
  citizenId: string
  otpCode: string
  newPassword: string
  role: 'DRIVER' | 'MERCHANT'
}

function LegacyAuthPage({ mode }: { mode: 'login' | 'register' | 'forgot' }) {
  const form = useForm<AuthFields>({ defaultValues: { role: 'DRIVER' } })
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
      const key = mode === 'register' ? 'phone' : 'email'
      if (!(await form.trigger(key)))
        throw new Error('Kiểm tra thông tin nhận OTP.')
      return sendData<{ expiresInSeconds: number }>(
        'post',
        `/api/v1/auth/${mode === 'register' ? 'otp/send' : 'forgot-password/otp'}`,
        { [key]: form.getValues(key) },
      )
    },
    onSuccess: (data) => {
      setSent(true)
      setCountdown(Math.max(1, data.expiresInSeconds || 60))
    },
  })

  const submit = useMutation({
    mutationFn: async (data: AuthFields) => {
      if (mode === 'register')
        await sendData('post', '/api/v1/auth/register', {
          phone: data.phone,
          password: data.password,
          email: data.email,
          role: data.role,
          fullName: data.fullName,
          citizenId: data.citizenId,
          otpCode: data.otpCode,
        })
      else
        await sendData('post', '/api/v1/auth/forgot-password/reset', {
          email: data.email,
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
            className={`${control} min-h-14 text-base focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-1`}
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
      <h1 className="font-sora text-3xl font-semibold leading-snug tracking-tight text-brand-navy xl:text-4xl">
        {title}
      </h1>
      <p className="mb-10 mt-4 text-base leading-7 text-brand-muted">
        {mode === 'login'
          ? 'Đăng nhập để tiếp tục công việc của bạn.'
          : 'Thông tin được xác thực bởi hệ thống SmartTruck Hub.'}
      </p>

      {submit.isSuccess && mode !== 'login' ? (
        <AuthSuccess mode={mode} />
      ) : (
        <form
          className="space-y-6 [&_input]:min-h-14 [&_input]:text-base [&_select]:min-h-14 [&_label]:gap-3 [&_label]:text-base"
          onSubmit={form.handleSubmit((data) => submit.mutate(data))}
        >
          {mode !== 'forgot' &&
            input('phone', 'Số điện thoại', 'tel', {
              pattern: /^(0|\+84)[35789][0-9]{8}$/,
            })}
          {mode !== 'login' && input('email', 'Email', 'email')}
          {mode === 'register' && (
            <>
              <Field label="Bạn tham gia với vai trò">
                <select
                  className={`${control} focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-1`}
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
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-border bg-white px-4 py-3 text-sm font-semibold text-brand-navy hover:bg-brand-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-2 disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
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
                  'Gửi mã OTP'
                )}
              </button>
              {sent && (
                <Notice>
                  Yêu cầu OTP đã được gửi. Kiểm tra kênh nhận mã của bạn.
                </Notice>
              )}
              {input('otpCode', 'Mã OTP 6 chữ số', 'text', {
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
      <nav aria-label="Tài khoản" className="mt-7 flex flex-wrap gap-5 text-sm text-brand-muted">
        {mode !== 'login' && (
          <Link
            to="/login"
            className="hover:text-[#d95f00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] rounded-sm transition-colors"
          >
            Đăng nhập
          </Link>
        )}
        {mode !== 'register' && (
          <Link
            to="/register"
            className="hover:text-[#d95f00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] rounded-sm transition-colors"
          >
            Tạo tài khoản
          </Link>
        )}
        {mode !== 'forgot' && (
          <Link
            to="/forgot-password"
            className="hover:text-[#d95f00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] rounded-sm transition-colors"
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
