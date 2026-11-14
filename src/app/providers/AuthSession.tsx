import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useQueryClient } from '@tanstack/react-query'
import { authenticated, signedOut } from '@/features/auth/model/authSlice'
import { readSession, SESSION_EVENT } from '@/features/auth/model/session'
export function AuthSession() {
  const dispatch = useDispatch()
  const cache = useQueryClient()
  const [toast, setToast] = useState(false)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    let previousToken = localStorage.getItem('access_token')
    const synchronize = () => {
      clearTimeout(timer)
      const token = localStorage.getItem('access_token')
      if (token !== previousToken) cache.clear()
      previousToken = token
      const session = readSession(token)
      if (session) {
        dispatch(authenticated({ role: session.role }))
        timer = setTimeout(synchronize, Math.min(session.expiresAt - Date.now(), 2147483647))
      } else {
        dispatch(signedOut())
        if (token) { localStorage.removeItem('access_token'); cache.clear() }
      }
    }
    const onStorage = (event: StorageEvent) => { if (event.key === 'access_token' || event.key === null) synchronize() }
    synchronize()
    window.addEventListener(SESSION_EVENT, synchronize)
    window.addEventListener('storage', onStorage)
    window.addEventListener('focus', synchronize)
    return () => { clearTimeout(timer); window.removeEventListener(SESSION_EVENT, synchronize); window.removeEventListener('storage', onStorage); window.removeEventListener('focus', synchronize) }
  }, [dispatch, cache])
  useEffect(() => {
    const success = () => setToast(true)
    window.addEventListener('smartparking:login-success', success)
    return () => window.removeEventListener('smartparking:login-success', success)
  }, [])
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(false), 5000)
    return () => clearTimeout(timer)
  }, [toast])
  return toast ? <div role="status" className="fixed top-20 right-4 sm:right-6 z-[100] max-w-[calc(100vw-3rem)] rounded-xl border border-brand-border bg-white p-4 text-brand-navy shadow-lg animate-in fade-in slide-in-from-top-2 slide-in-from-right-4">Đăng nhập thành công.<button type="button" className="ml-4 underline" aria-label="Đóng thông báo" onClick={() => setToast(false)}>Đóng</button></div> : null
}
