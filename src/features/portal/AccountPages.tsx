import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getData,
  sendData,
  errorMessage,
  type Page,
} from '@/shared/api/resources'
import { QueryState } from '@/shared/components/QueryState'
import {
  Workspace,
  Notice,
  Badge,
  DataTable,
  date,
  button,
  secondary,
} from '@/shared/components/Workspace'
interface Notification {
  id: number
  title: string
  content: string
  type: string
  readAt: string | null
  createdAt: string
}
export function PortalNotificationsPage() {
  const [page, setPage] = useState(0)
  const cache = useQueryClient()
  const query = useQuery({
    queryKey: ['portal-notifications', page],
    queryFn: () =>
      getData<Page<Notification>>('/api/v1/notifications', { page, size: 20 }),
    retry: false,
  })
  const read = useMutation({
    mutationFn: (id?: number) =>
      sendData(
        'put',
        `/api/v1/notifications/${id ? `${id}/read` : 'read-all'}`,
      ),
    onSuccess: () =>
      void cache.invalidateQueries({ queryKey: ['portal-notifications'] }),
  })
  return (
    <Workspace
      title="Trung tâm thông báo"
      description="Các cập nhật liên quan đến tài khoản và hoạt động vận hành."
      actions={
        <button
          className={button}
          disabled={read.isPending}
          onClick={() => read.mutate(undefined)}
        >
          Đánh dấu tất cả đã đọc
        </button>
      }
    >
      {read.isError && <Notice error>{errorMessage(read.error)}</Notice>}
      <QueryState query={query}>
        {(data) => (
          <DataTable
            rows={data.content}
            page={page}
            totalPages={data.totalPages}
            onPage={setPage}
            columns={[
              {
                label: 'Thông báo',
                render: (r) => (
                  <div>
                    <p className="font-semibold">{r.title}</p>
                    <p className="mt-2 max-w-xl whitespace-pre-wrap text-brand-muted">
                      {r.content}
                    </p>
                  </div>
                ),
              },
              { label: 'Thời gian', render: (r) => date(r.createdAt) },
              {
                label: 'Tình trạng',
                render: (r) =>
                  r.readAt ? (
                    <Badge value="Đã đọc" />
                  ) : (
                    <button
                      disabled={read.isPending}
                      className={secondary}
                      onClick={() => read.mutate(r.id)}
                    >
                      Đánh dấu đã đọc
                    </button>
                  ),
              },
            ]}
          />
        )}
      </QueryState>
    </Workspace>
  )
}
export { AdminProfilePage } from '../admin/pages/AdminProfilePage'
