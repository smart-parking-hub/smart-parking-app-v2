import { LoginPage } from './pages/LoginPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { RegisterPage } from './pages/RegisterPage'

export {
  roleHome,
  sessionRole,
  clearSession,
  saveSession,
  getToken,
  readSession,
  isSessionRemembered,
  SESSION_EVENT,
} from './model/session'
export type { Role } from './model/session'
export { useSession } from './model/useSession'
export type { UseSessionReturn } from './model/useSession'
export { RequireRole } from './components/RequireRole'
export { LoginPage } from './pages/LoginPage'
export { ForgotPasswordPage } from './pages/ForgotPasswordPage'
export { RegisterPage, AuthSuccess } from './pages/RegisterPage'
export { AccessPage } from './pages/AccessPage'

export function AuthPage({ mode }: { mode: 'login' | 'register' | 'forgot' }) {
  if (mode === 'login') return <LoginPage />
  if (mode === 'forgot') return <ForgotPasswordPage />
  return <RegisterPage mode={mode} />
}
