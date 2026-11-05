import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '@/app/store'
import { sessionRole, type Role } from '../model/session'
export function RequireRole({ role, children }: { role: Role; children: ReactNode }) {
  useSelector((state: RootState) => state.auth.role)
  const location = useLocation()
  const actual = sessionRole()
  if (!actual) return <Navigate replace to={`/login?next=${encodeURIComponent(location.pathname + location.search)}`} />
  return actual === role ? <>{children}</> : <Navigate replace to="/403" />
}
