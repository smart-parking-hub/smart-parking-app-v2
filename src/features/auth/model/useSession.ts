import { useEffect, useState } from 'react'
import {
  clearSession,
  getToken,
  isSessionRemembered,
  readSession,
  roleHome,
  SESSION_EVENT,
  type Role,
} from './session'

export interface UseSessionReturn {
  session: { role: Role; expiresAt: number } | null
  role: Role | null
  isAuthenticated: boolean
  dashboardUrl: string
  isRemembered: boolean
  logout: () => void
}

/**
 * React Hook that subscribes to the current user authentication session.
 * Automatically synchronizes state across multiple tabs (via 'storage' event)
 * and within the same window (via custom SESSION_EVENT).
 */
export function useSession(): UseSessionReturn {
  const [session, setSession] = useState(() => readSession(getToken()))
  const [isRemembered, setIsRemembered] = useState(() => isSessionRemembered())

  useEffect(() => {
    const handleSync = () => {
      setSession(readSession(getToken()))
      setIsRemembered(isSessionRemembered())
    }

    const onStorage = (event: StorageEvent) => {
      if (event.key === 'access_token' || event.key === null) {
        handleSync()
      }
    }

    window.addEventListener(SESSION_EVENT, handleSync)
    window.addEventListener('storage', onStorage)
    window.addEventListener('focus', handleSync)

    return () => {
      window.removeEventListener(SESSION_EVENT, handleSync)
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('focus', handleSync)
    }
  }, [])

  const role = session?.role ?? null

  return {
    session,
    role,
    isAuthenticated: Boolean(role),
    dashboardUrl: role ? roleHome(role) : '/dashboard',
    isRemembered,
    logout: clearSession,
  }
}
