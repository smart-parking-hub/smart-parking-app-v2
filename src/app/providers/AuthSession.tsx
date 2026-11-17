import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useQueryClient } from '@tanstack/react-query'
import { Toast, ToastContainer } from '@/shared/components/Toast'
import { authenticated, signedOut } from '@/features/auth/model/authSlice'
import { clearSession, getToken, readSession, SESSION_EVENT } from '@/features/auth/model/session'

export function AuthSession() {
  const dispatch = useDispatch()
  const cache = useQueryClient()
  const [toast, setToast] = useState(false)
  const closeNotification = useCallback(() => setToast(false), [])

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    let previousToken = getToken()
    const synchronize = () => {
      clearTimeout(timer)
      const token = getToken()
      if (token !== previousToken) cache.clear()
      previousToken = token
      const session = readSession(token)
      if (session) {
        dispatch(authenticated({ role: session.role }))
        timer = setTimeout(synchronize, Math.min(session.expiresAt - Date.now(), 2147483647))
      } else {
        dispatch(signedOut())
        if (token) {
          clearSession()
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

  return toast ? (
    <ToastContainer position="top-right">
      <Toast title="Đăng nhập thành công." variant="success" duration={5000} onClose={closeNotification} />
    </ToastContainer>
  ) : null
}
