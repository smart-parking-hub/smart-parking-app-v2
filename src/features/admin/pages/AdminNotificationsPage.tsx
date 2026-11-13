import { Bell, CheckCheck, RefreshCw } from 'lucide-react'
import { Alert } from '@/shared/components/Alert'
import { Button } from '@/shared/components/Button'
import { EmptyState } from '@/shared/components/EmptyState'
import { Pagination } from '@/shared/components/Pagination'
import { errorMessage } from '@/shared/api/resources'
import { ADMIN_NOTIFICATION_PAGE_SIZE } from '../api/adminNotifications'
import { AdminNotificationFeed, AdminNotificationsSkeleton } from '../components/AdminNotificationFeed'
import { useAdminNotificationSession, useAdminNotifications } from '../hooks/useAdminNotifications'
import './admin-notifications.css'

export function AdminNotificationsPage() {
  const session = useAdminNotificationSession()
  // Remount local page/mutation state synchronously when the session changes.
  return <AdminNotificationsInbox key={session} session={session} />
}

function AdminNotificationsInbox({ session }: { session: number }) {
  const { page, setPage, list, count, read, markRead } = useAdminNotifications(session)
  const syncFailed = read.isSuccess && (list.isError || count.isError)
  const countKnown = count.isSuccess
  const refreshing = list.isFetching || count.isFetching

  return <section className="admin-notifications" aria-labelledby="admin-notifications-title">
    <header className="admin-notifications-header">
      <div className="admin-notifications-heading-meta">
        <p className="admin-notifications-eyebrow">THÔNG BÁO QUẢN TRỊ</p>
        <p className="admin-notifications-count" role="status">
          <Bell size={16} aria-hidden="true" />
          {countKnown ? `${count.data} thông báo chưa đọc` : count.isError ? 'Chưa tải được số chưa đọc' : 'Đang tải số chưa đọc…'}
        </p>
      </div>
      <div className="admin-notifications-heading-row">
        <div>
          <h1 id="admin-notifications-title">Trung tâm thông báo quản trị</h1>
          <p className="admin-notifications-description">Theo dõi các cập nhật liên quan đến tài khoản và hoạt động vận hành của bạn.</p>
        </div>
        <Button
          className="min-h-12 shrink-0"
          isLoading={read.isPending && read.variables === undefined}
          disabled={!countKnown || count.data === 0 || count.isFetching || list.isPending || list.isError || read.isPending}
          leftIcon={<CheckCheck size={18} aria-hidden="true" />}
          onClick={() => markRead()}
        >Đánh dấu tất cả đã đọc</Button>
      </div>
    </header>

    <div className="admin-notifications-content">
      {count.isError && <Alert variant="error" title="Không tải được số thông báo chưa đọc">
        <p>{errorMessage(count.error)}</p>
        <Button variant="outline" className="mt-3 min-h-12" isLoading={count.isFetching} onClick={() => void count.refetch()}>Thử lại số chưa đọc</Button>
      </Alert>}
      {read.isError && <Alert variant="error" title="Chưa thể đánh dấu đã đọc">{errorMessage(read.error)} Vui lòng thử lại thao tác.</Alert>}
      {syncFailed && <Alert variant="warning" title="Đã ghi nhận thao tác, chưa làm mới được dữ liệu">Thông báo đã được đánh dấu đã đọc. Vui lòng thử lại để cập nhật danh sách và số chưa đọc.</Alert>}
      {read.isSuccess && !syncFailed && !refreshing && <p role="status" className="admin-notifications-success">Đã cập nhật trạng thái đọc thông báo.</p>}

      <div className="admin-notifications-feed-header">
        <h2>Danh sách thông báo</h2>
        <span>Mới nhất trước</span>
        <Button variant="ghost" className="min-h-12" disabled={read.isPending} isLoading={refreshing} leftIcon={<RefreshCw size={16} aria-hidden="true" />} onClick={() => {
          void list.refetch()
          void count.refetch()
        }}>Cập nhật</Button>
      </div>
      {list.isError && <Alert variant="error" title={list.data ? 'Chưa làm mới được danh sách' : 'Không tải được thông báo'}>
        <p>{errorMessage(list.error)}{list.data && ' Dữ liệu bên dưới chưa được cập nhật.'}</p>
        <Button variant="outline" className="mt-3 min-h-12" isLoading={list.isFetching} onClick={() => void list.refetch()}>Thử lại danh sách</Button>
      </Alert>}
      {list.isPending ? <AdminNotificationsSkeleton /> : list.data && <>
        {list.data.content.length === 0
          ? <EmptyState icon={Bell} title="Bạn chưa có thông báo" description="Các cập nhật mới sẽ xuất hiện tại đây." />
          : <AdminNotificationFeed items={list.data.content} pending={read.isPending} pendingId={read.variables} disabled={list.isError || list.isFetching} onRead={markRead} />}
        <fieldset disabled={read.isPending || list.isFetching} className="admin-notifications-pagination" aria-label="Phân trang thông báo">
          <Pagination currentPage={page} zeroIndexed totalPages={list.data.totalPages} totalItems={list.data.totalElements} pageSize={ADMIN_NOTIFICATION_PAGE_SIZE} onPageChange={setPage} />
        </fieldset>
      </>}
    </div>
  </section>
}
