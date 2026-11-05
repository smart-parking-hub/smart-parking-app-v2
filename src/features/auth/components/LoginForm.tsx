import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { isAxiosError } from 'axios'
import { ArrowUpRight, LoaderCircle } from 'lucide-react'
import { control, button, Notice } from '@/shared/components/Workspace'
import { errorMessage, sendData } from '@/shared/api/resources'
import { loginDestination, readSession, saveSession } from '../model/session'
export const loginSchema = z.object({
  phone: z.string().transform((value) => value.replace(/\s/g, '')).pipe(z.string().regex(/^(0|\+84)[35789][0-9]{8}$/, 'Số điện thoại Việt Nam chưa hợp lệ.')),
  password: z.string().min(6, 'Mật khẩu phải từ 6 đến 50 ký tự.').max(50, 'Mật khẩu phải từ 6 đến 50 ký tự.'),
})
type LoginFields = z.infer<typeof loginSchema>
const responseSchema = z.object({ token: z.string().min(1), role: z.enum(['DRIVER', 'MERCHANT', 'ADMIN']) })
export function LoginForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const cache = useQueryClient()
  const [showPassword, setShowPassword] = useState(false)
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
    <form noValidate onSubmit={submit} className="space-y-6" aria-busy={login.isPending}>
      <fieldset disabled={login.isPending} className="space-y-6">
        <div className="space-y-3">
          <label htmlFor="login-phone" className="block font-medium text-brand-navy">Số điện thoại</label>
          <input id="login-phone" className={`${control} min-h-14 text-base`} type="tel" autoComplete="tel" inputMode="tel" aria-invalid={Boolean(form.formState.errors.phone)} aria-describedby={form.formState.errors.phone ? 'login-phone-error' : undefined} {...form.register('phone')} />
          {form.formState.errors.phone && <p id="login-phone-error" role="alert" className="text-sm text-red-700">{form.formState.errors.phone.message}</p>}
        </div>
        <div className="space-y-3">
          <label htmlFor="login-password" className="block font-medium text-brand-navy">Mật khẩu</label>
          <input id="login-password" className={`${control} min-h-14 text-base`} type={showPassword ? 'text' : 'password'} autoComplete="current-password" aria-invalid={Boolean(form.formState.errors.password)} aria-describedby={form.formState.errors.password ? 'login-password-error' : undefined} {...form.register('password')} />
          {form.formState.errors.password && <p id="login-password-error" role="alert" className="text-sm text-red-700">{form.formState.errors.password.message}</p>}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="accent-orange-600" />Ghi nhớ số điện thoại</label>
          <button type="button" aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)} className="text-brand-muted underline">{showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}</button>
        </div>
      </fieldset>
      {login.isError && <Notice error>
        {isAxiosError(login.error) && login.error.response && <span>Mã lỗi {login.error.response.status}: </span>}
        {errorMessage(login.error)}
        <button type="button" disabled={login.isPending} className="ml-3 underline" onClick={submit}>Thử lại</button>
      </Notice>}
      <button type="submit" disabled={login.isPending} className={`${button} min-h-14 w-full`}>
        {login.isPending ? <><LoaderCircle className="animate-spin" aria-hidden="true" />Đang đăng nhập…</> : <>Đăng nhập<ArrowUpRight size={18} aria-hidden="true" /></>}
      </button>
    </form>
    <nav aria-label="Tài khoản" className="mt-7 flex flex-wrap gap-5 text-sm text-brand-muted"><Link to="/register">Tạo tài khoản</Link><Link to="/forgot-password">Quên mật khẩu?</Link></nav>
  </>
}
