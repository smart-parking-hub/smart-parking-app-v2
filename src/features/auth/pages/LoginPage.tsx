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
      <div>
        <div className="mb-6 sm:mb-8 flex flex-col items-center text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-3.5 font-sora text-xl sm:text-2xl font-bold text-black mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] rounded-2xl p-1.5 transition-all hover:scale-105 group"
          >
            <img
              src="/image-smart-parking-hub.png"
              alt="Smart Parking Hub Logo"
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl object-contain shrink-0 shadow-md ring-1 ring-white/60 group-hover:shadow-lg transition-all"
            />
            <span className="tracking-tight text-black drop-shadow-xs font-bold text-xl sm:text-2xl group-hover:text-[#d95f00] transition-colors">SMARTTRUCK HUB</span>
          </Link>
          <h1 className="font-sora text-3xl sm:text-4xl font-bold tracking-tight text-black drop-shadow-xs">Chào mừng trở lại.</h1>
          <p className="mt-2 text-sm sm:text-base text-black font-normal">Đăng nhập để tiếp tục công việc của bạn.</p>
        </div>
        <LoginForm />
      </div>
    </AuthLayout>
  )
}
