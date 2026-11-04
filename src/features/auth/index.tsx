import { useEffect, useState, type ReactNode } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowUpRight, Check, ShieldCheck, Truck } from 'lucide-react'
import { errorMessage, sendData } from '@/shared/api/resources'
import {
  button,
  control,
  Field,
  Notice,
  secondary,
} from '@/shared/components/Workspace'
export type Role = 'DRIVER' | 'MERCHANT' | 'ADMIN'
export const roleHome = (role: Role) =>
  role === 'ADMIN'
    ? '/admin/dashboard'
    : role === 'MERCHANT'
      ? '/merchant/dashboard'
      : '/dashboard'
export function sessionRole(): Role | null {
  const token = localStorage.getItem('access_token')
  if (!token) return null
  try {
    const encoded = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(encoded)) as {
      role?: string
      roles?: string[]
      exp?: number
    }
    if (!payload.exp || payload.exp * 1000 <= Date.now()) return null
    const role = (payload.role || payload.roles?.[0] || '').replace(
      /^ROLE_/,
      '',
    )
    return role === 'ADMIN' || role === 'MERCHANT' || role === 'DRIVER'
      ? role
      : null
  } catch {
    return null
  }
}
export function RequireRole({
  role,
  children,
}: {
  role: Role
  children: ReactNode
}) {
  const location = useLocation()
  const actual = sessionRole()
  if (!actual)
    return (
      <Navigate
        replace
        to={`/login?next=${encodeURIComponent(location.pathname + location.search)}`}
      />
    )
  return actual === role ? <>{children}</> : <Navigate replace to="/403" />
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
export function AuthPage({ mode }: { mode: 'login' | 'register' | 'forgot' }) {
  const navigate = useNavigate()
  const location = useLocation()
  const cache = useQueryClient()
  const form = useForm<AuthFields>({ defaultValues: { role: 'DRIVER' } })
  const [sent, setSent] = useState(false)
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
      if (mode === 'login') {
        const result = await sendData<{ token: string; role: Role }>(
          'post',
          '/api/v1/auth/login',
          { phone: data.phone, password: data.password },
        )
        localStorage.setItem('access_token', result.token)
        cache.clear()
        const next = new URLSearchParams(location.search).get('next')
        navigate(
          next?.startsWith('/') && !next.startsWith('//')
            ? next
            : roleHome(result.role),
          { replace: true },
        )
        return
      }
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
  ) => (
    <Field label={label}>
      <input
        className={control}
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
        {...form.register(name, { required: true, ...options })}
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
          SMARTTRUCK HUB
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
          className={`w-full ${mode === 'register' ? 'max-w-[680px]' : 'max-w-[600px]'}`}
        >
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
                    <select className={control} {...form.register('role')}>
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
                    className={secondary}
                    onClick={() => otp.mutate()}
                  >
                    {countdown ? `Gửi lại sau ${countdown}s` : 'Gửi mã OTP'}
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
                <Notice error>{errorMessage(submit.error)}</Notice>
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
          <nav className="mt-7 flex flex-wrap gap-5 text-sm text-brand-muted">
            {mode !== 'login' && <Link to="/login">Đăng nhập</Link>}
            {mode !== 'register' && <Link to="/register">Tạo tài khoản</Link>}
            {mode !== 'forgot' && (
              <Link to="/forgot-password">Quên mật khẩu?</Link>
            )}
          </nav>
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
        className={`${button} min-h-14 w-full sm:w-auto sm:min-w-64`}
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
