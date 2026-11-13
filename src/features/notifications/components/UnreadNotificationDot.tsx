import { useSyncExternalStore } from 'react'
import { useQuery } from '@tanstack/react-query'
import { SESSION_EVENT } from '@/features/auth'
import { getData } from '@/shared/api/resources'

let previousToken: string | null | undefined
let revision = 0
function snapshot() {
  const token = localStorage.getItem('access_token')
  if (token !== previousToken) { previousToken = token; revision += 1 }
  return revision
}
function subscribe(changed: () => void) {
  window.addEventListener(SESSION_EVENT, changed)
  window.addEventListener('storage', changed)
  window.addEventListener('focus', changed)
  return () => {
    window.removeEventListener(SESSION_EVENT, changed)
    window.removeEventListener('storage', changed)
    window.removeEventListener('focus', changed)
  }
}

export function UnreadNotificationDot() {
  const session = useSyncExternalStore(subscribe, snapshot)
  const unread = useQuery({
    queryKey: ['notification-indicator', session],
    queryFn: ({ signal }) => getData<unknown>('/api/v1/notifications/unread-count', undefined, { signal }),
    enabled: Boolean(localStorage.getItem('access_token')),
    refetchInterval: 30_000,
    staleTime: 10_000,
    retry: false,
  })
  if (!unread.isSuccess || typeof unread.data !== 'number' || !Number.isSafeInteger(unread.data) || unread.data <= 0) return null
  return <span role="img" aria-label="Có thông báo chưa đọc" title="Có thông báo chưa đọc"
    className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-600 ring-2 ring-white" />
}
