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
      <div className="mb-6 sm:mb-8">
        <Link
          to="/"
          className="inline-flex items-center gap-3.5 font-sora text-xl sm:text-2xl font-bold text-brand-navy mb-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] rounded-xl p-1 -m-1 transition-colors group"
        >
          <img
            src="/image-smart-parking-hub.png"
            alt="Smart Parking Hub Logo"
            className="w-11 h-11 rounded-2xl object-contain shrink-0 shadow-md group-hover:scale-105 transition-transform ring-1 ring-white/60"
          />
          <span className="tracking-tight text-brand-navy drop-shadow-xs font-extrabold text-xl sm:text-2xl">SMARTTRUCK HUB</span>
        </Link>
        <h1 className="font-sora text-3xl sm:text-4xl font-extrabold tracking-tight text-brand-navy drop-shadow-xs">Chào mừng trở lại.</h1>
        <p className="mt-2 text-base sm:text-lg text-slate-700 font-medium">Đăng nhập để tiếp tục công việc của bạn.</p>
      </div>
      <LoginForm />
    </AuthLayout>
  )
}
