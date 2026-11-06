import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import type { Dispute } from '@/entities/operations'
import {
  getData,
  sendData,
  errorMessage,
  type Page,
} from '@/shared/api/resources'
import { QueryState } from '@/shared/components/QueryState'
import {
  Workspace,
  DataTable,
  Badge,
  Panel,
  Notice,
  Dialog,
  Field,
  button,
  control,
  date,
  secondary,
} from '@/shared/components/Workspace'
export function DisputesPage({
  role,
  detail = false,
}: {
  role: 'driver' | 'merchant' | 'admin'
  detail?: boolean
}) {
  const { id } = useParams()
  const [params] = useSearchParams()
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(0)
  const root = role === 'driver' ? '/disputes' : `/${role}/disputes`
  const path = detail
    ? `/api/v1/disputes/${role === 'admin' ? 'admin/' : ''}${id}`
    : `/api/v1/disputes/${role === 'driver' ? 'me' : role}`
  const query = useQuery({
    queryKey: ['disputes', role, id, page],
    queryFn: () => getData<Dispute | Page<Dispute>>(path, { page, size: 20 }),
    retry: false,
  })
  return (
    <Workspace
      title={
        detail
          ? `Hồ sơ khiếu nại #${id}`
          : role === 'admin'
            ? 'Bàn điều tra tranh chấp'
            : 'Trung tâm khiếu nại'
      }
      eyebrow={`${role.toUpperCase()} / SUPPORT`}
      description="Theo dõi nội dung phản ánh và kết quả xử lý từ quản trị viên."
      actions={
        detail ? (
          <Link className={secondary} to={root}>
            ← Danh sách
          </Link>
        ) : role === 'driver' ? (
          <button className={button} onClick={() => setOpen(true)}>
            + Gửi khiếu nại
          </button>
        ) : undefined
      }
    >
      <QueryState query={query}>
        {(data) =>
          'content' in data ? (
            <DataTable
              rows={data.content}
              page={page}
              totalPages={data.totalPages}
              onPage={setPage}
              detailLink={(r) => `${root}/${r.id}`}
              searchText={(r) => `${r.id} ${r.bookingId} ${r.reason}`}
              columns={[
                {
                  label: 'Hồ sơ',
                  align: 'right',
                  render: (r) => <span className="font-mono tabular-nums font-semibold">KN-{r.id}</span>,
                },
                {
                  label: 'Booking',
                  align: 'right',
                  render: (r) => <span className="font-mono tabular-nums">#{r.bookingId}</span>,
                },
                { label: 'Lý do', render: (r) => r.reason },
                {
                  label: 'Tiền bồi thường',
                  align: 'right',
                  render: (r) => {
                    const amt = (r as { amount?: number; compensationAmount?: number }).compensationAmount ?? (r as { amount?: number }).amount
                    return (
                      <span className="font-mono tabular-nums">
                        {amt !== undefined && amt !== null
                          ? `${new Intl.NumberFormat('vi-VN').format(amt)} ₫`
                          : '—'}
                      </span>
                    )
                  },
                },
                { label: 'Thời gian', render: (r) => date(r.createdAt) },
                {
                  label: 'Trạng thái',
                  render: (r) => <Badge value={r.status} />,
                },
              ]}
            />
          ) : (
            <DisputeDetail data={data} admin={role === 'admin'} />
          )
        }
      </QueryState>
      {open && (
        <CreateDispute
          bookingId={params.get('bookingId')}
          onClose={() => setOpen(false)}
        />
      )}
    </Workspace>
  )
}
function DisputeDetail({ data, admin }: { data: Dispute; admin: boolean }) {
  const [resolve, setResolve] = useState(false)
  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Panel title={data.reason}>
          <p className="mb-6 whitespace-pre-wrap text-sm leading-7">
            {data.description || 'Chưa có mô tả bổ sung.'}
          </p>
          <div className="border-t border-brand-border pt-5">
            <Badge value={data.status} />
            <p className="mt-4 text-xs text-brand-muted">
              Được tạo: {date(data.createdAt)}
            </p>
          </div>
        </Panel>
        <Panel title="Thông tin liên quan">
          <dl className="space-y-4 text-sm">
            {[
              ['Booking', data.bookingId],
              ['Tài xế', data.driverId],
              ['Chủ bãi', data.merchantId],
            ].map(([key, value]) => (
              <div className="flex justify-between" key={key}>
                <dt>{key}</dt>
                <dd className="font-mono">#{value}</dd>
              </div>
            ))}
          </dl>
          {admin && data.status !== 'RESOLVED' && (
            <button
              className={`${button} mt-6 w-full`}
              onClick={() => setResolve(true)}
            >
              Ghi nhận phán quyết
            </button>
          )}
        </Panel>
      </div>
      <Panel title="Kết quả xử lý">
        <p className="whitespace-pre-wrap text-sm leading-7">
          {data.resolution ||
            'Hồ sơ đang chờ xử lý. Chưa có kết quả giải quyết.'}
        </p>
      </Panel>
      {resolve && (
        <ResolveDispute id={data.id} onClose={() => setResolve(false)} />
      )}
    </>
  )
}
function CreateDispute({
  bookingId,
  onClose,
}: {
  bookingId: string | null
  onClose: () => void
}) {
  const cache = useQueryClient()
  const form = useForm<{
    bookingId: number
    reason: string
    description: string
  }>({
    defaultValues: { bookingId: bookingId ? Number(bookingId) : undefined },
  })
  const mutation = useMutation({
    mutationFn: (data: {
      bookingId: number
      reason: string
      description: string
    }) => sendData('post', '/api/v1/disputes', data),
    onSuccess: () => {
      void cache.invalidateQueries({ queryKey: ['disputes'] })
      onClose()
    },
  })
  return (
    <Dialog
      title="Gửi phản ánh về lượt đỗ"
      onClose={() => {
        if (!mutation.isPending) onClose()
      }}
    >
      <form
        className="space-y-5"
        onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
      >
        <Field label="ID Booking">
          <input
            type="number"
            className={control}
            {...form.register('bookingId', {
              required: true,
              min: 1,
              valueAsNumber: true,
            })}
          />
        </Field>
        <Field label="Lý do">
          <input
            className={control}
            {...form.register('reason', {
              required: true,
              validate: (v) => !!v.trim(),
            })}
          />
        </Field>
        <Field label="Mô tả sự việc">
          <textarea
            rows={5}
            className={control}
            {...form.register('description')}
          />
        </Field>
        {Object.keys(form.formState.errors).length > 0 && (
          <Notice error>Nhập ID booking và lý do khiếu nại.</Notice>
        )}
        {mutation.isError && (
          <Notice error>{errorMessage(mutation.error)}</Notice>
        )}
        <button className={button} disabled={mutation.isPending}>
          {mutation.isPending ? 'Đang gửi…' : 'Gửi khiếu nại'}
        </button>
      </form>
    </Dialog>
  )
}
function ResolveDispute({ id, onClose }: { id: number; onClose: () => void }) {
  const cache = useQueryClient()
  const form = useForm<{ resolution: string }>()
  const mutation = useMutation({
    mutationFn: (data: { resolution: string }) =>
      sendData('put', `/api/v1/disputes/${id}/resolve`, data),
    onSuccess: () => {
      void cache.invalidateQueries({ queryKey: ['disputes'] })
      onClose()
    },
  })
  return (
    <Dialog
      title="Phán quyết khiếu nại"
      onClose={() => {
        if (!mutation.isPending) onClose()
      }}
    >
      <form
        className="space-y-5"
        onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
      >
        <Notice>
          Ghi rõ kết luận và phương án hỗ trợ. Việc ghi nhận này không tự thực
          hiện hoàn tiền.
        </Notice>
        <Field label="Nội dung giải quyết">
          <textarea
            className={control}
            rows={6}
            {...form.register('resolution', {
              required: true,
              validate: (value) => !!value.trim(),
            })}
          />
        </Field>
        {form.formState.errors.resolution && (
          <Notice error>Nhập nội dung giải quyết.</Notice>
        )}
        {mutation.isError && (
          <Notice error>{errorMessage(mutation.error)}</Notice>
        )}
        <button disabled={mutation.isPending} className={button}>
          Xác nhận phán quyết
        </button>
      </form>
    </Dialog>
  )
}
