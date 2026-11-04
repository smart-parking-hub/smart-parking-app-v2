import { useState } from 'react'
import { useForm } from 'react-hook-form'
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
  Panel,
  Field,
  Notice,
  Badge,
  DataTable,
  date,
  control,
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
interface Profile {
  fullName: string
  phone: string
  email: string
  emergencyContact: string
  address: string
}
export function AdminProfilePage() {
  const query = useQuery({
    queryKey: ['admin-profile'],
    queryFn: () => getData<Profile>('/api/v1/users/me'),
    retry: false,
  })
  return (
    <Workspace
      title="Hồ sơ quản trị"
      description="Quản lý thông tin liên hệ và bảo mật tài khoản quản trị."
    >
      <QueryState query={query}>
        {(data) => <ProfileForm data={data} />}
      </QueryState>
    </Workspace>
  )
}
function ProfileForm({ data }: { data: Profile }) {
  const cache = useQueryClient()
  const form = useForm<Profile>({ defaultValues: data })
  const password = useForm<{ oldPassword: string; newPassword: string }>()
  const save = useMutation({
    mutationFn: (values: Profile) =>
      sendData('put', '/api/v1/users/me', values),
    onSuccess: () =>
      void cache.invalidateQueries({ queryKey: ['admin-profile'] }),
  })
  const change = useMutation({
    mutationFn: (values: { oldPassword: string; newPassword: string }) =>
      sendData('post', '/api/v1/users/me/password', {
        currentPassword: values.oldPassword,
        newPassword: values.newPassword,
      }),
    onSuccess: () => password.reset(),
  })
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Panel title="Thông tin cá nhân">
        <form
          className="space-y-5"
          onSubmit={form.handleSubmit((values) => save.mutate(values))}
        >
          {(
            [
              'fullName',
              'email',
              'phone',
              'address',
              'emergencyContact',
            ] as const
          ).map((key) => (
            <Field
              key={key}
              label={
                {
                  fullName: 'Họ tên',
                  email: 'Email',
                  phone: 'Điện thoại',
                  address: 'Địa chỉ',
                  emergencyContact: 'Liên hệ khẩn cấp',
                }[key]
              }
            >
              <input
                className={control}
                type={key === 'email' ? 'email' : 'text'}
                {...form.register(key)}
              />
            </Field>
          ))}
          {save.isError && <Notice error>{errorMessage(save.error)}</Notice>}
          {save.isSuccess && <Notice>Đã lưu thông tin.</Notice>}
          <button className={button} disabled={save.isPending}>
            Lưu hồ sơ
          </button>
        </form>
      </Panel>
      <Panel title="Đổi mật khẩu">
        <form
          className="space-y-5"
          onSubmit={password.handleSubmit((values) => change.mutate(values))}
        >
          <Field label="Mật khẩu hiện tại">
            <input
              className={control}
              type="password"
              autoComplete="current-password"
              {...password.register('oldPassword', { required: true })}
            />
          </Field>
          <Field label="Mật khẩu mới">
            <input
              className={control}
              type="password"
              autoComplete="new-password"
              {...password.register('newPassword', {
                required: true,
                minLength: 6,
              })}
            />
          </Field>
          {Object.keys(password.formState.errors).length > 0 && (
            <Notice error>
              Nhập mật khẩu hiện tại và mật khẩu mới ít nhất 6 ký tự.
            </Notice>
          )}
          {change.isError && (
            <Notice error>{errorMessage(change.error)}</Notice>
          )}
          {change.isSuccess && <Notice>Đã đổi mật khẩu thành công.</Notice>}
          <button className={button} disabled={change.isPending}>
            Cập nhật mật khẩu
          </button>
        </form>
      </Panel>
    </div>
  )
}
