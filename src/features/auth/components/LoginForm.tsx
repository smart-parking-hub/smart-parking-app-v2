import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AlertCircle, ArrowUpRight, Check, Eye, EyeOff, LoaderCircle, ShieldCheck, Store, Truck } from 'lucide-react'
import { control } from '@/shared/components/Workspace'
import { errorMessage, sendData } from '@/shared/api/resources'
import { loginDestination, readSession, saveSession } from '../model/session'
export const loginSchema = z.object({
  phone: z.string().transform((value) => value.replace(/\s/g, '')).pipe(z.string().regex(/^(0|\+84)[35789][0-9]{8}$/, 'Số điện thoại Việt Nam chưa hợp lệ.')),
  password: z.string().min(6, 'Mật khẩu phải từ 6 đến 50 ký tự.').max(50, 'Mật khẩu phải từ 6 đến 50 ký tự.'),
})
type LoginFields = z.infer<typeof loginSchema>
const responseSchema = z.object({ token: z.string().min(1), role: z.enum(['DRIVER', 'MERCHANT', 'ADMIN']) })
const demoAccounts = [
  { phone: '0909128374', name: 'Nguyễn Văn Hùng', role: 'Tài xế 01', icon: Truck },
  { phone: '0918239485', name: 'Trần Quốc Tuấn', role: 'Tài xế 02', icon: Truck },
  { phone: '0908123456', name: 'Lê Văn Thành', role: 'Chủ bãi đỗ', icon: Store },
  { phone: '0903829145', name: 'Nguyễn Hoàng Nam', role: 'Quản trị viên', icon: ShieldCheck },
]
export function LoginForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const cache = useQueryClient()
  const [showPassword, setShowPassword] = useState(false)
  const [selectedPhone, setSelectedPhone] = useState('')
  const [remember, setRemember] = useState(() => Boolean(localStorage.getItem('remembered_phone')))
  const form = useForm<LoginFields>({ resolver: zodResolver(loginSchema), defaultValues: { phone: localStorage.getItem('remembered_phone') || '', password: '' } })
  const login = useMutation({
    retry: false,
    mutationFn: async (fields: LoginFields) => {
      const result = responseSchema.parse(await sendData<unknown>('post', '/api/v1/auth/login', fields))
      if (readSession(result.token)?.role !== result.role) throw new Error('Phiên đăng nhập không hợp lệ. Vui lòng thử lại.')
      return result
    },
    onSuccess: (result, fields) => {
      cache.clear()
      if (remember) localStorage.setItem('remembered_phone', fields.phone)
      else localStorage.removeItem('remembered_phone')
      const destination = loginDestination(new URLSearchParams(location.search).get('next'), result.role)
      navigate(destination, { replace: true })
      saveSession(result.token)
      window.dispatchEvent(new Event('smartparking:login-success'))
    },
  })
  const submit = form.handleSubmit((fields) => { if (!login.isPending) login.mutate(fields) })
  return <>
    {import.meta.env.DEV && <section aria-label="Tài khoản trải nghiệm" className="mb-4 rounded-xl border border-brand-muted/20 bg-white/80 backdrop-blur-md p-3 shadow-xs">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div>
          <p className="font-sora text-xs font-bold text-brand-navy">Chọn vai trò mẫu</p>
          <p className="text-[11px] text-brand-muted">Nhấn để tự động điền thông tin.</p>
        </div>
        <span className="rounded-full bg-brand-navy px-2.5 py-0.5 text-[10px] font-semibold text-white tracking-wider">DEMO</span>
      </div>
      <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
        {demoAccounts.map(({ phone, name, role, icon: Icon }) => <button key={phone} type="button" disabled={login.isPending} aria-pressed={selectedPhone === phone} onClick={() => {
          setSelectedPhone(phone)
          form.setValue('phone', phone, { shouldValidate: true })
          form.setValue('password', 'password123', { shouldValidate: true })
          login.reset()
        }} className={`group flex items-center gap-2 rounded-lg border p-1.5 sm:p-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-1 disabled:opacity-50 ${selectedPhone === phone ? 'border-[#d95f00] bg-orange-50 ring-1 ring-[#d95f00]' : 'border-slate-200/90 bg-white/90 hover:border-[#d95f00]'}`}>
          <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-brand-navy text-white"><Icon size={14} aria-hidden="true" /></span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[11px] font-semibold text-brand-navy">{name}</span>
            <span className="block text-[10px] text-brand-muted">{role}</span>
          </span>
          {selectedPhone === phone && <Check size={14} className="text-orange-700 shrink-0" aria-hidden="true" />}
        </button>)}
      </div>
      <p role="status" className="mt-2 text-[11px] text-brand-muted">{selectedPhone ? 'Đã điền tài khoản mẫu. Nhấn Đăng nhập để tiếp tục.' : '4 tài khoản mẫu · 2 tài xế / 1 chủ bãi / 1 quản trị viên'}</p>
    </section>}
    <form noValidate onSubmit={submit} className="space-y-4" aria-busy={login.isPending}>
      <fieldset disabled={login.isPending} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="login-phone" className="block text-sm font-semibold text-brand-navy">Số điện thoại</label>
          <input id="login-phone" className={`${control} min-h-11 sm:min-h-12 text-sm bg-white/90 border border-slate-300 text-brand-navy placeholder:text-slate-400 focus:bg-white focus:border-[#d95f00] focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-1`} type="tel" autoComplete="tel" inputMode="tel" aria-invalid={Boolean(form.formState.errors.phone)} aria-describedby={form.formState.errors.phone ? 'login-phone-error' : undefined} {...form.register('phone')} />
          {form.formState.errors.phone && <p id="login-phone-error" role="alert" className="text-xs font-semibold text-red-700 bg-red-100/90 px-2 py-0.5 rounded-sm inline-block">{form.formState.errors.phone.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label htmlFor="login-password" className="block text-sm font-semibold text-brand-navy">Mật khẩu</label>
          <div className="relative">
          <input id="login-password" className={`${control} min-h-11 sm:min-h-12 pr-12 text-sm bg-white/90 border border-slate-300 text-brand-navy placeholder:text-slate-400 focus:bg-white focus:border-[#d95f00]`} type={showPassword ? 'text' : 'password'} autoComplete="current-password" aria-invalid={Boolean(form.formState.errors.password)} aria-describedby={form.formState.errors.password ? 'login-password-error' : undefined} {...form.register('password')} />
            <button type="button" aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'} aria-controls="login-password" aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-1 flex w-10 items-center justify-center rounded-lg text-brand-muted hover:text-brand-navy focus-visible:outline-2 focus-visible:outline-orange-600">
              {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
            </button>
          </div>
          {form.formState.errors.password && <p id="login-password-error" role="alert" className="text-xs font-semibold text-red-700 bg-red-100/90 px-2 py-0.5 rounded-sm inline-block">{form.formState.errors.password.message}</p>}
        </div>
        <div className="flex items-center text-sm">
          <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm text-slate-700 select-none">
            <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="rounded-sm accent-[#d95f00] focus-visible:ring-2 focus-visible:ring-[#d95f00]" />
            Ghi nhớ số điện thoại
          </label>
        </div>
      </fieldset>
      {login.isError && <div
        role="alert"
        aria-labelledby="login-error-title"
        aria-atomic="true"
        className="grid grid-cols-[2rem_minmax(0,1fr)] items-start gap-2.5 rounded-xl border border-status-danger-border bg-status-danger-bg/80 p-3"
      >
        <span className="flex size-8 items-center justify-center rounded-full border border-status-danger-border bg-surface text-status-danger" aria-hidden="true">
          <AlertCircle size={16} />
        </span>
        <div className="min-w-0 self-center">
          <p id="login-error-title" className="font-heading text-xs font-semibold leading-4 text-text-primary">Chưa thể đăng nhập</p>
          <p className="mt-0.5 break-words font-body text-xs leading-4 text-text-secondary">{errorMessage(login.error)}</p>
        </div>
      </div>}
      <button type="submit" disabled={login.isPending} className="inline-flex min-h-11 sm:min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#d95f00] px-5 py-2.5 text-sm sm:text-base font-semibold text-white hover:bg-[#b84e00] active:bg-[#9e4300] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-2 disabled:opacity-50 transition-colors shadow-lg shadow-orange-950/20 cursor-pointer">
        {login.isPending ? <><LoaderCircle className="animate-spin" aria-hidden="true" size={18} />Đang đăng nhập…</> : <>Đăng nhập<ArrowUpRight size={18} aria-hidden="true" /></>}
      </button>
    </form>
    <nav aria-label="Tài khoản" className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-brand-muted">
      <div>
        <span>Chưa có tài khoản? </span>
        <Link to="/register" className="font-semibold text-brand-orange hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] rounded-xs transition-colors">Tạo tài khoản</Link>
      </div>
      <Link to="/forgot-password" className="font-medium text-brand-orange hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] rounded-xs transition-colors">Quên mật khẩu?</Link>
    </nav>
  </>
}
