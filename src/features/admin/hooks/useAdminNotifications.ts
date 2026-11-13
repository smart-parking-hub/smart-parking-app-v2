import { useRef, useState, useSyncExternalStore } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { SESSION_EVENT } from '@/features/auth'
import {
  getAdminNotifications,
  getAdminUnreadCount,
  readAdminNotification,
} from '../api/adminNotifications'

// An opaque session revision keeps credentials out of query keys. Observe the
// existing session events; authentication and token storage remain in auth.
let previousToken: string | null | undefined
let sessionRevision = 0
function getSessionRevision() {
  const token = localStorage.getItem('access_token')
  if (token !== previousToken) {
    previousToken = token
    sessionRevision += 1
  }
  return sessionRevision
}
function subscribeToSession(onChange: () => void) {
  window.addEventListener(SESSION_EVENT, onChange)
  window.addEventListener('storage', onChange)
  window.addEventListener('focus', onChange)
  return () => {
    window.removeEventListener(SESSION_EVENT, onChange)
    window.removeEventListener('storage', onChange)
    window.removeEventListener('focus', onChange)
  }
}

export function useAdminNotificationSession() {
  return useSyncExternalStore(subscribeToSession, getSessionRevision)
}

export function useAdminNotifications(session: number) {
  const [page, setPage] = useState(0)
  const [sort, setSort] = useState('createdAt,desc')
  const cache = useQueryClient()
  const inFlight = useRef(false)
  const scope = ['admin-notifications', session] as const
  const list = useQuery({
    queryKey: [...scope, 'list', page, sort],
    queryFn: ({ signal }) => getAdminNotifications(page, signal, sort),
    retry: false,
    refetchOnWindowFocus: false,
  })
  const count = useQuery({
    queryKey: [...scope, 'unread-count'],
    queryFn: ({ signal }) => getAdminUnreadCount(signal),
    retry: false,
    refetchOnWindowFocus: false,
  })
  const read = useMutation({
    mutationFn: (id: number | undefined) => {
      if (getSessionRevision() !== session) {
        throw new Error('Phiên đăng nhập đã thay đổi. Vui lòng thử lại trong phiên hiện tại.')
      }
      return readAdminNotification(id)
    },
    retry: false,
    onMutate: () => cache.cancelQueries({ queryKey: scope }),
    // Await refetch so controls stay pending until the displayed page and count
    // settle. Inactive pages become stale and refresh when visited again.
    onSuccess: () => cache.invalidateQueries({ queryKey: scope }),
  })

  function markRead(id?: number) {
    if (inFlight.current || read.isPending || list.isPending || list.isError) return
    if (id === undefined && (count.isError || count.isFetching || !count.data)) return
    if (id !== undefined && !list.data?.content.some(item => item.id === id && item.readAt == null)) return
    inFlight.current = true
    read.mutate(id, { onSettled: () => { inFlight.current = false } })
  }

  return { page, setPage, sort, setSort: (value: string) => { setSort(value); setPage(0) }, list, count, read, markRead }
}
