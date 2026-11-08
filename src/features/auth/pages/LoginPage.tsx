import { Link, Navigate, useLocation } from 'react-router-dom'
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
  return (
    <AuthLayout>
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-3 font-sora text-xl font-bold text-brand-navy mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] rounded-lg p-1 -m-1 transition-colors group"
        >
          <img
            src="/image-smart-parking-hub.png"
            alt="Smart Parking Hub Logo"
            className="w-9 h-9 rounded-xl object-contain shrink-0 shadow-xs group-hover:scale-105 transition-transform"
          />
          <span className="tracking-tight">SMARTTRUCK HUB</span>
        </Link>
        <h1 className="font-sora text-2xl lg:text-3xl font-bold tracking-tight text-brand-navy">Chào mừng trở lại.</h1>
        <p className="mt-1 text-sm text-brand-muted">Đăng nhập để tiếp tục công việc của bạn.</p>
      </div>
      <LoginForm />
    </AuthLayout>
  )
}
