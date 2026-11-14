import { useMemo } from 'react'
import { CheckCheck, RefreshCw } from 'lucide-react'
import { errorMessage } from '@/shared/api/resources'
import { Alert } from '@/shared/components/Alert'
import { Button } from '@/shared/components/Button'
import { ErrorState } from '@/shared/components/ErrorState'
import { Toast, ToastContainer } from '@/shared/components/Toast'
import { Workspace } from '@/shared/components/Workspace'
import { DEFAULT_NOTIFICATION_PAGE_SIZE } from '../api/notificationApi'
import { NotificationDetailModal } from '../components/NotificationDetailModal'
import { NotificationRowItem } from '../components/NotificationRowItem'
import { NotificationsEmptyState } from '../components/NotificationsEmptyState'
import { NotificationsFilterBar } from '../components/NotificationsFilterBar'
import { NotificationsPagination } from '../components/NotificationsPagination'
import { NotificationsSkeleton } from '../components/NotificationsSkeleton'
import {
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
  useNotificationsListQuery,
  useUnreadCountQuery,
} from '../hooks/useNotificationsQuery'
import { useNotificationStore } from '../store/notificationStore'
import type {
  NotificationEmptyVariant,
  NotificationViewModel,
} from '../types/notificationTypes'

export function NotificationsPage() {
  const {
    statusFilter,
    typeFilter,
    searchKeyword,
    currentPage,
    selectedNotificationId,
    toast,
    setStatusFilter,
    setTypeFilter,
    setSearchKeyword,
    setCurrentPage,
    setSelectedNotificationId,
    resetFilters,
    clearToast,
  } = useNotificationStore()

  const listQuery = useNotificationsListQuery(
    currentPage,
    DEFAULT_NOTIFICATION_PAGE_SIZE,
  )
  const unreadCountQuery = useUnreadCountQuery()
  const markReadMutation = useMarkNotificationReadMutation()
  const markAllReadMutation = useMarkAllNotificationsReadMutation()

  const pageData = listQuery.data
  const pageItems = useMemo(() => pageData?.content ?? [], [pageData?.content])

  const pageUnreadCount = useMemo(
    () => pageItems.filter((item) => item.isUnread).length,
    [pageItems],
  )

  const unreadCount =
    typeof unreadCountQuery.data === 'number'
      ? unreadCountQuery.data
      : pageUnreadCount

  const filteredItems = useMemo(() => {
    const keyword = searchKeyword.trim().toLocaleLowerCase('vi')

    return pageItems.filter((item) => {
      if (statusFilter === 'UNREAD' && !item.isUnread) {
        return false
      }
      if (typeFilter !== 'ALL' && item.type !== typeFilter) {
        return false
      }
      if (keyword) {
        const haystack = `${item.title} ${item.content} ${item.typeLabel}`.toLocaleLowerCase('vi')
        if (!haystack.includes(keyword)) {
          return false
        }
      }
      return true
    })
  }, [pageItems, statusFilter, typeFilter, searchKeyword])

  const selectedNotification = useMemo(
    () => pageItems.find((item) => item.id === selectedNotificationId) ?? null,
    [pageItems, selectedNotificationId],
  )

  const serverTotalCount = pageData?.totalElements ?? pageItems.length
  const totalPages = pageData?.totalPages ?? 1
  const resolvedPage = pageData?.currentPage ?? currentPage

  const emptyVariant: NotificationEmptyVariant =
    serverTotalCount === 0
      ? 'no-notifications'
      : statusFilter === 'UNREAD' &&
          typeFilter === 'ALL' &&
          !searchKeyword.trim()
        ? 'all-read'
        : 'filtered'

  const handleRefresh = () => {
    void listQuery.refetch()
    void unreadCountQuery.refetch()
  }

  const handlePageChange = (nextPage: number) => {
    setCurrentPage(nextPage)
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } catch {
        window.scrollTo(0, 0)
      }
    }
  }

  const handleMarkRead = (id: number, notifySuccess = true) => {
    if (markReadMutation.isPending) return
    markReadMutation.mutate({ id, notifySuccess })
  }

  const handleSelectNotification = (notification: NotificationViewModel) => {
    setSelectedNotificationId(notification.id)
    if (notification.isUnread) {
      handleMarkRead(notification.id, false)
    }
  }

  const handleMarkAllAsRead = () => {
    if (markAllReadMutation.isPending || unreadCount === 0) return
    markAllReadMutation.mutate()
  }

  const isRefreshing = listQuery.isFetching || unreadCountQuery.isFetching

  return (
    <Workspace
      eyebrow="TÀI KHOẢN / THÔNG BÁO"
      title="Trung tâm thông báo"
      description="Theo dõi thông báo đặt chỗ, hàng đợi ảo, giao dịch thanh toán và cập nhật hệ thống."
      actions={
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            aria-busy={isRefreshing}
            aria-label="Làm mới danh sách thông báo"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[15px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-2xs cursor-pointer"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
              aria-hidden="true"
            />
            <span>Làm mới</span>
          </button>

          <button
            type="button"
            id="mark-all-read-btn"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0 || markAllReadMutation.isPending}
            aria-busy={markAllReadMutation.isPending}
            title={
              unreadCount === 0
                ? 'Tất cả thông báo đã được đọc'
                : 'Đánh dấu tất cả thông báo là đã đọc'
            }
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#d95f00] px-4 py-2.5 text-[15px] font-semibold text-white hover:bg-[#b84e00] active:bg-[#9e4300] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-2"
          >
            <CheckCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>
              {markAllReadMutation.isPending
                ? 'Đang cập nhật...'
                : 'Đánh dấu tất cả đã đọc'}
            </span>
          </button>
        </div>
      }
    >
      {listQuery.isPending && !pageData ? (
        <NotificationsSkeleton />
      ) : listQuery.isError && !pageData ? (
        <ErrorState
          variant="card"
          title="Không thể tải thông báo"
          description="Hệ thống tạm thời chưa thể kết nối để lấy danh sách thông báo vận hành. Vui lòng thử lại."
          errorDetail={errorMessage(listQuery.error)}
          onRetry={handleRefresh}
          isRetrying={listQuery.isFetching}
        />
      ) : (
        <>
          {/* Background Refetch Error Banner */}
          {listQuery.isError && (
            <Alert
              variant="error"
              title="Không thể làm mới danh sách thông báo"
              action={
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  isLoading={listQuery.isFetching}
                >
                  Thử lại
                </Button>
              }
            >
              {errorMessage(listQuery.error)}
            </Alert>
          )}

          {/* Filter & Search Toolbar (React Hook Form + Zod) */}
          <NotificationsFilterBar
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            searchKeyword={searchKeyword}
            onSearchKeywordChange={setSearchKeyword}
            onResetFilters={resetFilters}
            serverTotalCount={serverTotalCount}
            pageTotalCount={pageItems.length}
            unreadCount={unreadCount}
            matchedCount={filteredItems.length}
          />

          {/* Compact Gmail-Style Inbox List */}
          {filteredItems.length === 0 ? (
            <div className="space-y-4">
              <NotificationsEmptyState
                variant={emptyVariant}
                onResetFilters={resetFilters}
              />
              {serverTotalCount > 0 && totalPages > 1 && (
                <NotificationsPagination
                  currentPage={resolvedPage}
                  totalPages={totalPages}
                  pageSize={DEFAULT_NOTIFICATION_PAGE_SIZE}
                  totalItems={serverTotalCount}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          ) : (
            <section
              aria-label="Hộp thư thông báo"
              className="overflow-hidden rounded-2xl border border-brand-border bg-white shadow-2xs"
            >
              <ul role="list" className="divide-y divide-slate-100">
                {filteredItems.map((item) => (
                  <NotificationRowItem
                    key={item.id}
                    notification={item}
                    onSelect={handleSelectNotification}
                  />
                ))}
              </ul>

              {serverTotalCount > 0 && (
                <NotificationsPagination
                  embedded
                  currentPage={resolvedPage}
                  totalPages={totalPages}
                  pageSize={DEFAULT_NOTIFICATION_PAGE_SIZE}
                  totalItems={serverTotalCount}
                  onPageChange={handlePageChange}
                />
              )}
            </section>
          )}
        </>
      )}

      {/* Detail Modal when clicking a notification row */}
      <NotificationDetailModal
        notification={selectedNotification}
        isOpen={Boolean(selectedNotification)}
        onClose={() => setSelectedNotificationId(null)}
        onMarkRead={(id) => handleMarkRead(id, true)}
        isMarkingRead={
          markReadMutation.isPending &&
          (typeof markReadMutation.variables === 'number'
            ? markReadMutation.variables === selectedNotification?.id
            : markReadMutation.variables?.id === selectedNotification?.id)
        }
      />

      {/* Live Toast Feedback */}
      {toast && (
        <ToastContainer>
          <Toast
            key={toast.id}
            title={toast.title}
            message={toast.message}
            variant={toast.variant}
            onClose={clearToast}
          />
        </ToastContainer>
      )}
    </Workspace>
  )
}
