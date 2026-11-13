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
        <div className="mb-3.5 sm:mb-4 flex flex-col items-center text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 font-sora text-lg sm:text-xl font-bold text-black mb-2 sm:mb-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] rounded-xl p-1 transition-all hover:scale-105 group"
          >
            <img
              src="/image-smart-parking-hub.png"
              alt="Smart Parking Hub Logo"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-contain shrink-0 shadow-sm ring-1 ring-white/60 group-hover:shadow-md transition-all"
            />
            <span className="tracking-tight text-black drop-shadow-xs font-bold text-lg sm:text-xl group-hover:text-[#d95f00] transition-colors">SMARTTRUCK HUB</span>
          </Link>
          <h1 className="font-sora text-2xl sm:text-3xl font-bold tracking-tight text-black drop-shadow-xs">Chào mừng trở lại.</h1>
          <p className="mt-1 text-xs sm:text-sm text-black/75 font-normal">Đăng nhập để tiếp tục công việc của bạn.</p>
        </div>
        <LoginForm />
      </div>
    </AuthLayout>
  )
}
