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
    {import.meta.env.DEV && <section aria-label="Tài khoản trải nghiệm" className="mb-5 sm:mb-6 rounded-2xl border border-slate-200/90 bg-slate-50/90 backdrop-blur-md p-3.5 sm:p-4 shadow-xs">
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <div>
          <p className="font-sora text-sm sm:text-base font-bold text-brand-navy">Chọn vai trò mẫu</p>
          <p className="text-xs sm:text-[13px] text-slate-600 font-medium">Nhấn để tự động điền thông tin.</p>
        </div>
        <span className="rounded-full bg-brand-navy px-3 py-0.5 text-[11px] font-bold text-white tracking-wider">DEMO</span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
        {demoAccounts.map(({ phone, name, role, icon: Icon }) => <button key={phone} type="button" disabled={login.isPending} aria-pressed={selectedPhone === phone} onClick={() => {
          setSelectedPhone(phone)
          form.setValue('phone', phone, { shouldValidate: true })
          form.setValue('password', 'password123', { shouldValidate: true })
          login.reset()
        }} className={`group flex items-center gap-2.5 rounded-xl border p-2 sm:p-2.5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-1 disabled:opacity-50 ${selectedPhone === phone ? 'border-[#d95f00] bg-orange-100 ring-2 ring-[#d95f00] shadow-sm' : 'border-slate-200 bg-white hover:border-[#d95f00] hover:bg-orange-50/70 hover:shadow-sm hover:scale-[1.01] active:scale-[0.99]'}`}>
          <span className="flex size-8 sm:size-9 shrink-0 items-center justify-center rounded-lg bg-brand-navy text-white shadow-xs group-hover:scale-105 transition-transform"><Icon size={16} aria-hidden="true" /></span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs sm:text-sm font-bold text-brand-navy group-hover:text-brand-orange transition-colors">{name}</span>
            <span className="block text-[11px] sm:text-xs text-slate-600 font-medium">{role}</span>
          </span>
          {selectedPhone === phone && <Check size={16} className="text-orange-700 shrink-0" aria-hidden="true" />}
        </button>)}
      </div>
      <p role="status" className="mt-2.5 text-xs sm:text-[13px] text-slate-600 font-medium">{selectedPhone ? 'Đã điền tài khoản mẫu. Nhấn Đăng nhập để tiếp tục.' : '4 tài khoản mẫu · 2 tài xế / 1 chủ bãi / 1 quản trị viên'}</p>
    </section>}
    <form noValidate onSubmit={submit} className="space-y-5" aria-busy={login.isPending}>
      <fieldset disabled={login.isPending} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="login-phone" className="block text-sm sm:text-base font-bold text-brand-navy">Số điện thoại</label>
          <input id="login-phone" className={`${control} min-h-12 sm:min-h-14 text-base bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 hover:border-slate-400 focus:border-[#d95f00] focus:ring-2 focus:ring-[#d95f00]/20 focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-1 rounded-xl px-4 py-3 shadow-2xs transition-all`} type="tel" autoComplete="tel" inputMode="tel" placeholder="Ví dụ: 0918239485" aria-invalid={Boolean(form.formState.errors.phone)} aria-describedby={form.formState.errors.phone ? 'login-phone-error' : undefined} {...form.register('phone')} />
          {form.formState.errors.phone && <p id="login-phone-error" role="alert" className="text-xs sm:text-sm font-semibold text-red-700 bg-red-100/95 px-2.5 py-1 rounded-md inline-block">{form.formState.errors.phone.message}</p>}
        </div>
        <div className="space-y-2">
          <label htmlFor="login-password" className="block text-sm sm:text-base font-bold text-brand-navy">Mật khẩu</label>
          <div className="relative">
          <input id="login-password" className={`${control} min-h-12 sm:min-h-14 pr-14 text-base bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 hover:border-slate-400 focus:border-[#d95f00] focus:ring-2 focus:ring-[#d95f00]/20 rounded-xl px-4 py-3 shadow-2xs transition-all`} type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Nhập mật khẩu (từ 6 đến 50 ký tự)" aria-invalid={Boolean(form.formState.errors.password)} aria-describedby={form.formState.errors.password ? 'login-password-error' : undefined} {...form.register('password')} />
            <button type="button" aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'} aria-controls="login-password" aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-1.5 flex w-11 items-center justify-center rounded-xl text-slate-400 hover:text-brand-navy hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-orange-600 active:scale-95 transition-all">
              {showPassword ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
            </button>
          </div>
          {form.formState.errors.password && <p id="login-password-error" role="alert" className="text-xs sm:text-sm font-semibold text-red-700 bg-red-100/95 px-2.5 py-1 rounded-md inline-block">{form.formState.errors.password.message}</p>}
        </div>
        <div className="flex items-center text-sm sm:text-base">
          <label className="group flex items-center gap-3 cursor-pointer text-sm sm:text-base text-slate-800 font-semibold select-none hover:text-brand-navy transition-colors">
            <input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="size-5 rounded-full border-2 border-slate-400 bg-white checked:bg-[#d95f00] checked:border-[#d95f00] checked:bg-[url('data:image/svg+xml;utf8,<svg%20viewBox=%220%200%2016%2016%22%20fill=%22white%22%20xmlns=%22http://www.w3.org/2000/svg%22><path%20d=%22M12.207%204.793a1%201%200%20010%201.414l-5%205a1%201%200%2001-1.414%200l-2-2a1%201%200%20011.414-1.414L6.5%209.086l4.293-4.293a1%201%200%20011.414%200z%22/></svg>')] bg-no-repeat bg-center bg-[length:12px_12px] appearance-none cursor-pointer focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-1 transition-all group-hover:border-[#d95f00] group-hover:scale-105 shrink-0" />
            <span className="group-hover:text-brand-orange transition-colors">Ghi nhớ số điện thoại</span>
          </label>
        </div>
      </fieldset>
      {login.isError && <div
        role="alert"
        aria-labelledby="login-error-title"
        aria-atomic="true"
        className="grid grid-cols-[2rem_minmax(0,1fr)] items-start gap-3 rounded-xl border border-status-danger-border bg-status-danger-bg/90 p-3.5"
      >
        <span className="flex size-8 items-center justify-center rounded-full border border-status-danger-border bg-surface text-status-danger" aria-hidden="true">
          <AlertCircle size={18} />
        </span>
        <div className="min-w-0 self-center">
          <p id="login-error-title" className="font-heading text-sm font-bold leading-5 text-text-primary">Chưa thể đăng nhập</p>
          <p className="mt-0.5 break-words font-body text-xs sm:text-sm leading-5 text-text-secondary">{errorMessage(login.error)}</p>
        </div>
      </div>}
      <button type="submit" disabled={login.isPending} className="inline-flex min-h-12 sm:min-h-14 w-full items-center justify-center gap-2.5 rounded-xl bg-[#d95f00] px-6 py-3.5 text-base sm:text-lg font-bold text-white hover:bg-[#b84e00] active:bg-[#9e4300] hover:scale-[1.01] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-2 disabled:opacity-50 transition-all shadow-lg shadow-orange-950/25 cursor-pointer">
        {login.isPending ? <><LoaderCircle className="animate-spin" aria-hidden="true" size={20} />Đang đăng nhập…</> : <>Đăng nhập<ArrowUpRight size={20} aria-hidden="true" /></>}
      </button>
    </form>
    <nav aria-label="Tài khoản" className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm sm:text-base text-slate-700 font-medium">
      <div>
        <span>Chưa có tài khoản? </span>
        <Link to="/register" className="font-bold text-brand-orange hover:text-[#9e4300] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] rounded-xs transition-colors">Tạo tài khoản</Link>
      </div>
      <Link to="/forgot-password" className="font-semibold text-brand-orange hover:text-[#9e4300] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] rounded-xs transition-colors">Quên mật khẩu?</Link>
    </nav>
  </>
}
