import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { isAxiosError } from 'axios'
import { ArrowUpRight, Check, Eye, EyeOff, LoaderCircle, ShieldCheck, Store, Truck } from 'lucide-react'
import { control, Notice } from '@/shared/components/Workspace'
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
    {import.meta.env.DEV && <section aria-label="Tài khoản trải nghiệm" className="mb-8 rounded-2xl border border-brand-muted/20 bg-white/60 p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div><p className="font-sora text-base font-semibold text-brand-navy">Chọn vai trò. Bắt đầu ngay.</p><p className="mt-1 text-xs text-brand-muted">Chọn tài khoản mẫu để tự động điền thông tin.</p></div>
        <span className="rounded-full bg-brand-navy px-3 py-1 text-xs font-semibold text-white">DEMO</span>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {demoAccounts.map(({ phone, name, role, icon: Icon }) => <button key={phone} type="button" disabled={login.isPending} aria-pressed={selectedPhone === phone} onClick={() => {
          setSelectedPhone(phone)
          form.setValue('phone', phone, { shouldValidate: true })
          form.setValue('password', 'password123', { shouldValidate: true })
          login.reset()
        }} className={`group flex items-center gap-3 rounded-xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-2 disabled:opacity-50 ${selectedPhone === phone ? 'border-[#d95f00] bg-orange-50' : 'border-brand-muted/20 bg-white hover:border-[#d95f00]'}`}>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-navy text-white"><Icon size={20} aria-hidden="true" /></span>
          <span className="min-w-0 flex-1"><span className="block text-xs font-semibold text-brand-muted">{role}</span><span className="mt-1 block truncate text-sm font-semibold text-brand-navy">{name}</span></span>
          {selectedPhone === phone && <Check size={16} className="text-orange-700" aria-hidden="true" />}
        </button>)}
      </div>
      <p role="status" className="mt-3 text-xs text-brand-muted">{selectedPhone ? 'Đã điền tài khoản mẫu. Nhấn Đăng nhập để tiếp tục.' : '4 tài khoản mẫu · 2 tài xế / 1 chủ bãi / 1 quản trị viên'}</p>
    </section>}
    <form noValidate onSubmit={submit} className="space-y-6" aria-busy={login.isPending}>
      <fieldset disabled={login.isPending} className="space-y-6">
        <div className="space-y-3">
          <label htmlFor="login-phone" className="block font-medium text-brand-navy">Số điện thoại</label>
          <input id="login-phone" className={`${control} min-h-14 text-base focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-1`} type="tel" autoComplete="tel" inputMode="tel" aria-invalid={Boolean(form.formState.errors.phone)} aria-describedby={form.formState.errors.phone ? 'login-phone-error' : undefined} {...form.register('phone')} />
          {form.formState.errors.phone && <p id="login-phone-error" role="alert" className="text-sm font-medium text-red-700">{form.formState.errors.phone.message}</p>}
        </div>
        <div className="space-y-3">
          <label htmlFor="login-password" className="block font-medium text-brand-navy">Mật khẩu</label>
          <div className="relative">
          <input id="login-password" className={`${control} min-h-14 pr-14 text-base`} type={showPassword ? 'text' : 'password'} autoComplete="current-password" aria-invalid={Boolean(form.formState.errors.password)} aria-describedby={form.formState.errors.password ? 'login-password-error' : undefined} {...form.register('password')} />
            <button type="button" aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'} aria-controls="login-password" aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-1 flex w-12 items-center justify-center rounded-lg text-brand-muted hover:text-brand-navy focus-visible:outline-2 focus-visible:outline-orange-600">
              {showPassword ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
            </button>
          </div>
          {form.formState.errors.password && <p id="login-password-error" role="alert" className="text-sm text-red-700">{form.formState.errors.password.message}</p>}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="accent-orange-600" />Ghi nhớ số điện thoại</label>

        </div>
      </fieldset>
      {login.isError && <Notice error>
        {isAxiosError(login.error) && login.error.response && <span>Mã lỗi {login.error.response.status}: </span>}
        {errorMessage(login.error)}
        <button type="button" disabled={login.isPending} className="ml-3 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] rounded-sm" onClick={submit}>Thử lại</button>
      </Notice>}
      <button type="submit" disabled={login.isPending} className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#d95f00] px-5 py-3 text-base font-semibold text-white hover:bg-[#b84e00] active:bg-[#9e4300] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-2 disabled:opacity-50 transition-colors shadow-xs cursor-pointer">
        {login.isPending ? <><LoaderCircle className="animate-spin" aria-hidden="true" />Đang đăng nhập…</> : <>Đăng nhập<ArrowUpRight size={18} aria-hidden="true" /></>}
      </button>
    </form>
    <nav aria-label="Tài khoản" className="mt-7 flex flex-wrap gap-5 text-sm text-brand-muted">
      <Link to="/register" className="hover:text-[#d95f00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] rounded-sm transition-colors">Tạo tài khoản</Link>
      <Link to="/forgot-password" className="hover:text-[#d95f00] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] rounded-sm transition-colors">Quên mật khẩu?</Link>
    </nav>
  </>
}
