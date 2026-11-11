import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { errorMessage } from '@/shared/api/resources'
import {
  DEFAULT_NOTIFICATION_PAGE_SIZE,
  fetchNotificationsPageApi,
  fetchUnreadCountApi,
  markAllAsReadApi,
  markAsReadApi,
} from '../api/notificationApi'
import { getNotificationStoreSnapshot } from '../store/notificationStore'
import type { NotificationPage } from '../types/notificationTypes'

export const notificationQueryKeys = {
  all: ['notifications'] as const,
  lists: () => ['notifications', 'list'] as const,
  list: (page: number, size: number) =>
    ['notifications', 'list', { page, size }] as const,
  unreadCount: ['notifications', 'unread-count'] as const,
}

export function useNotificationsListQuery(
  page: number,
  size = DEFAULT_NOTIFICATION_PAGE_SIZE,
) {
  return useQuery({
    queryKey: notificationQueryKeys.list(page, size),
    queryFn: () => fetchNotificationsPageApi({ page, size }),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
    retry: false,
    refetchOnWindowFocus: false,
  })
}

export function useUnreadCountQuery(options?: {
  enabled?: boolean
  refetchInterval?: number | false
}) {
  return useQuery({
    queryKey: notificationQueryKeys.unreadCount,
    queryFn: fetchUnreadCountApi,
    staleTime: 30_000,
    retry: false,
    refetchOnWindowFocus: false,
    enabled: options?.enabled ?? true,
    refetchInterval: options?.refetchInterval ?? 30_000,
  })
}

interface OptimisticNotificationSnapshot {
  previousLists: Array<[readonly unknown[], NotificationPage | undefined]>
  previousUnread: number | undefined
}

export type MarkNotificationReadInput =
  | number
  | { id: number; notifySuccess?: boolean }

function resolveMarkReadInput(input: MarkNotificationReadInput): {
  id: number
  notifySuccess: boolean
} {
  if (typeof input === 'number') {
    return { id: input, notifySuccess: true }
  }
  return {
    id: input.id,
    notifySuccess: input.notifySuccess ?? true,
  }
}

export function useMarkNotificationReadMutation() {
  const queryClient = useQueryClient()

  return useMutation<
    void,
    unknown,
    MarkNotificationReadInput,
    OptimisticNotificationSnapshot
  >({
    mutationFn: (input) => markAsReadApi(resolveMarkReadInput(input).id),
    onMutate: async (input) => {
      const { id: notificationId } = resolveMarkReadInput(input)
      await queryClient.cancelQueries({ queryKey: notificationQueryKeys.all })

      const previousLists = queryClient.getQueriesData<NotificationPage>({
        queryKey: notificationQueryKeys.lists(),
      })
      const previousUnread = queryClient.getQueryData<number>(
        notificationQueryKeys.unreadCount,
      )

      const nowIso = new Date().toISOString()
      let foundUnreadMatch = false

      for (const [queryKey, pageData] of previousLists) {
        if (!pageData) continue
        const targetItem = pageData.content.find((item) => item.id === notificationId)
        if (!targetItem) continue

        if (targetItem.isUnread) {
          foundUnreadMatch = true
        }

        queryClient.setQueryData<NotificationPage>(queryKey, {
          ...pageData,
          content: pageData.content.map((item) =>
            item.id === notificationId
              ? { ...item, readAt: item.readAt ?? nowIso, isUnread: false }
              : item,
          ),
        })
      }

      if (typeof previousUnread === 'number' && foundUnreadMatch) {
        queryClient.setQueryData<number>(
          notificationQueryKeys.unreadCount,
          Math.max(0, previousUnread - 1),
        )
      }

      return { previousLists, previousUnread }
    },
    onError: (error, _input, context) => {
      if (context) {
        for (const [queryKey, pageData] of context.previousLists) {
          queryClient.setQueryData(queryKey, pageData)
        }
        if (context.previousUnread !== undefined) {
          queryClient.setQueryData(
            notificationQueryKeys.unreadCount,
            context.previousUnread,
          )
        }
      }
      getNotificationStoreSnapshot().showToast(
        'Không thể đánh dấu đã đọc',
        'error',
        errorMessage(error),
      )
    },
    onSuccess: (_data, input) => {
      if (resolveMarkReadInput(input).notifySuccess) {
        getNotificationStoreSnapshot().showToast(
          'Đã đánh dấu thông báo là đã đọc',
          'success',
        )
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all })
    },
  })
}

export function useMarkAllNotificationsReadMutation() {
  const queryClient = useQueryClient()

  return useMutation<void, unknown, void, OptimisticNotificationSnapshot>({
    mutationFn: () => markAllAsReadApi(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: notificationQueryKeys.all })

      const previousLists = queryClient.getQueriesData<NotificationPage>({
        queryKey: notificationQueryKeys.lists(),
      })
      const previousUnread = queryClient.getQueryData<number>(
        notificationQueryKeys.unreadCount,
      )

      const nowIso = new Date().toISOString()
      for (const [queryKey, pageData] of previousLists) {
        if (!pageData) continue
        queryClient.setQueryData<NotificationPage>(queryKey, {
          ...pageData,
          content: pageData.content.map((item) =>
            item.isUnread ? { ...item, readAt: nowIso, isUnread: false } : item,
          ),
        })
      }

      queryClient.setQueryData<number>(notificationQueryKeys.unreadCount, 0)

      return { previousLists, previousUnread }
    },
    onError: (error, _variables, context) => {
      if (context) {
        for (const [queryKey, pageData] of context.previousLists) {
          queryClient.setQueryData(queryKey, pageData)
        }
        if (context.previousUnread !== undefined) {
          queryClient.setQueryData(
            notificationQueryKeys.unreadCount,
            context.previousUnread,
          )
        }
      }
      getNotificationStoreSnapshot().showToast(
        'Không thể đánh dấu tất cả đã đọc',
        'error',
        errorMessage(error),
      )
    },
    onSuccess: () => {
      getNotificationStoreSnapshot().showToast(
        'Đã đánh dấu tất cả thông báo là đã đọc',
        'success',
      )
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all })
    },
  })
}
