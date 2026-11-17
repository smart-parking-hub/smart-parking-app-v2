export type Role = 'DRIVER' | 'MERCHANT' | 'ADMIN'
export const SESSION_EVENT = 'smartparking:session'

export const roleHome = (role: Role) =>
  role === 'ADMIN' ? '/admin/dashboard' : role === 'MERCHANT' ? '/merchant/dashboard' : '/dashboard'

/**
 * Retrieve active JWT access token from sessionStorage or localStorage.
 * Checks sessionStorage first (for single-tab non-remembered sessions),
 * falling back to persistent localStorage.
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem('access_token') ?? sessionStorage.getItem('access_token')
  } catch {
    return null
  }
}

/**
 * Parses and validates the JWT session claim.
 * Returns decoded role and expiration timestamp, or null if expired/invalid.
 */
export function readSession(token: string | null = getToken()): { role: Role; expiresAt: number } | null {
  if (!token) return null
  try {
    if (token.split('.').length !== 3) return null
    const encoded = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const payload: unknown = JSON.parse(atob(encoded))
    if (!payload || typeof payload !== 'object') return null
    const claims = payload as { role?: unknown; roles?: unknown; exp?: unknown }
    const rawRole = claims.role ?? (Array.isArray(claims.roles) ? claims.roles[0] : null)
    if (typeof rawRole !== 'string' || typeof claims.exp !== 'number' || !Number.isFinite(claims.exp)) return null
    const role = rawRole.replace(/^ROLE_/, '')
    if (!['DRIVER', 'MERCHANT', 'ADMIN'].includes(role) || claims.exp * 1000 <= Date.now()) return null
    return { role: role as Role, expiresAt: claims.exp * 1000 }
  } catch {
    return null
  }
}

export const sessionRole = (): Role | null => readSession()?.role ?? null

/**
 * Completely clears the active session from both storage layers and notifies listeners.
 */
export function clearSession() {
  try {
    localStorage.removeItem('access_token')
    sessionStorage.removeItem('access_token')
    localStorage.removeItem('smart-truck-parking.auth')
  } catch {
    // Ignore storage clear errors
  }
  window.dispatchEvent(new Event(SESSION_EVENT))
}

/**
 * Saves access token into storage.
 * - remember = true: Persists in localStorage across browser restarts / tab closes.
 * - remember = false: Confines to sessionStorage (destroyed on tab close).
 */
export function saveSession(token: string, remember = true) {
  try {
    if (remember) {
      localStorage.setItem('access_token', token)
      sessionStorage.removeItem('access_token')
    } else {
      sessionStorage.setItem('access_token', token)
      localStorage.removeItem('access_token')
    }
  } catch {
    // Fallback if one storage fails
    try {
      localStorage.setItem('access_token', token)
    } catch {
      // Ignore
    }
  }
  window.dispatchEvent(new Event(SESSION_EVENT))
}

export function isSessionRemembered(): boolean {
  if (typeof window === 'undefined') return true
  try {
    return Boolean(localStorage.getItem('access_token'))
  } catch {
    return true
  }
}

export function loginDestination(next: string | null, role: Role) {
  if (!next || !next.startsWith('/') || next.startsWith('//') || /[\\\s]/.test(next)) return roleHome(role)
  const path = next.split(/[?#]/)[0]
  if (['/login', '/register', '/forgot-password', '/403'].includes(path)) return roleHome(role)
  if (path.startsWith('/admin') && role !== 'ADMIN') return roleHome(role)
  if (path.startsWith('/merchant') && role !== 'MERCHANT') return roleHome(role)
  if (role !== 'DRIVER' && !path.startsWith('/admin/') && !path.startsWith('/merchant/')) return roleHome(role)
  return next
}
