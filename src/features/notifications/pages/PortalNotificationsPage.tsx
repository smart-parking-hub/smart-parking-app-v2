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
  secondary,
  Field,
  control,
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
  const [sort, setSort] = useState('createdAt,desc')
  const cache = useQueryClient()
  const query = useQuery({
    queryKey: ['portal-notifications', page, sort],
    queryFn: () =>
      getData<Page<Notification>>('/api/v1/notifications', { page, size: 20, sort }),
    retry: false,
  })
  const read = useMutation({
    mutationFn: (id?: number) =>
      sendData(
        'put',
        `/api/v1/notifications/${id ? `${id}/read` : 'read-all'}`,
      ),
    onSuccess: async () => {
      await Promise.all([
        cache.invalidateQueries({ queryKey: ['portal-notifications'] }),
        cache.invalidateQueries({ queryKey: ['notification-indicator'] }),
      ])
    },
  })
  return (
    <Workspace
      title="Trung tâm thông báo"
      description="Các cập nhật liên quan đến tài khoản và hoạt động vận hành."
      actions={
        <button
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d95f00] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#b84e00] active:bg-[#9e4300] transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
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
      <div className="flex flex-wrap items-end justify-between gap-3">
        <Field label="Sắp xếp thông báo">
          <select className={control} value={sort} onChange={event => {
            setSort(event.target.value)
            setPage(0)
          }}>
            <option value="createdAt,desc">Mới nhất trước</option>
            <option value="createdAt,asc">Cũ nhất trước</option>
          </select>
        </Field>
        <button type="button" className={secondary} disabled={query.isFetching} onClick={() => void query.refetch()}>
          {query.isFetching ? 'Đang cập nhật…' : 'Cập nhật'}
        </button>
      </div>
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
