import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, X } from 'lucide-react'
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
        if (token) {
          localStorage.removeItem('access_token')
          cache.clear()
        }
      }
    }
    const onStorage = (event: StorageEvent) => {
      if (event.key === 'access_token' || event.key === null) synchronize()
    }
    synchronize()
    window.addEventListener(SESSION_EVENT, synchronize)
    window.addEventListener('storage', onStorage)
    window.addEventListener('focus', synchronize)
    return () => {
      clearTimeout(timer)
      window.removeEventListener(SESSION_EVENT, synchronize)
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('focus', synchronize)
    }
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

  return toast ? (
    <div
      role="status"
      className="fixed top-4 right-4 sm:top-5 sm:right-6 z-[100] flex max-w-[calc(100vw-2rem)] items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900 shadow-xl backdrop-blur-xs animate-toast-bounce"
    >
      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
      <span>Đăng nhập thành công.</span>
      <button
        type="button"
        className="ml-2.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-emerald-700/70 hover:bg-emerald-100 hover:text-emerald-950 transition-colors focus-visible:outline-2 focus-visible:outline-emerald-600 cursor-pointer"
        aria-label="Đóng thông báo"
        onClick={() => setToast(false)}
      >
        <X className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  ) : null
}
