import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
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
          className={`${button} flex items-center gap-2`}
          disabled={read.isPending}
          aria-busy={read.isPending}
          onClick={() => {
            if (read.isPending) return
            read.mutate(undefined)
          }}
        >
          {read.isPending && read.variables === undefined ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin shrink-0" />
              <span>Đang xử lý…</span>
            </>
          ) : (
            'Đánh dấu tất cả đã đọc'
          )}
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
                  <div className="relative pl-3">
                    {!r.readAt && (
                      <span
                        className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-blue-100"
                        title="Chưa đọc"
                        aria-label="Chưa đọc"
                      />
                    )}
                    <p className={`font-semibold ${!r.readAt ? 'text-slate-900' : 'text-slate-700'}`}>
                      {r.title}
                    </p>
                    <p className="mt-1.5 max-w-xl whitespace-pre-wrap text-brand-muted text-xs leading-relaxed">
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
                      aria-busy={read.isPending}
                      className={`${secondary} inline-flex items-center gap-1.5`}
                      onClick={() => {
                        if (read.isPending) return
                        read.mutate(r.id)
                      }}
                    >
                      {read.isPending && read.variables === r.id && (
                        <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />
                      )}
                      <span>Đánh dấu đã đọc</span>
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
