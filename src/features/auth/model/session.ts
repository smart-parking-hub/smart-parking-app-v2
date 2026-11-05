export type Role = 'DRIVER' | 'MERCHANT' | 'ADMIN'
export const SESSION_EVENT = 'smartparking:session'
export const roleHome = (role: Role) => role === 'ADMIN' ? '/admin/dashboard' : role === 'MERCHANT' ? '/merchant/dashboard' : '/dashboard'
export function readSession(token = localStorage.getItem('access_token')): { role: Role; expiresAt: number } | null {
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
  } catch { return null }
}
export const sessionRole = (): Role | null => readSession()?.role ?? null
export function clearSession() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('smart-truck-parking.auth')
  window.dispatchEvent(new Event(SESSION_EVENT))
}
export function saveSession(token: string) {
  localStorage.setItem('access_token', token)
  window.dispatchEvent(new Event(SESSION_EVENT))
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
