import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '@/app/store'
import { AuthLayout } from '@/layouts/AuthLayout'
import { LoginForm } from '../components/LoginForm'
import { loginDestination, sessionRole } from '../model/session'
export function LoginPage() {
  const location = useLocation()
  useSelector((state: RootState) => state.auth.role)
  const role = sessionRole()
  if (role) return <Navigate to={loginDestination(new URLSearchParams(location.search).get('next'), role)} replace />
  return <AuthLayout>
    <h1 className="font-sora text-3xl font-semibold leading-snug tracking-tight text-brand-navy xl:text-4xl">Chào mừng trở lại.</h1>
    <p className="mb-10 mt-4 text-base leading-7 text-brand-muted">Đăng nhập để tiếp tục công việc của bạn.</p>
    <LoginForm />
  </AuthLayout>
}
