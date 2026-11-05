import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getData, sendData, errorMessage } from '@/shared/api/resources'
import { QueryState } from '@/shared/components/QueryState'
import { Workspace, Panel, Field, Notice, control, button, secondary } from '@/shared/components/Workspace'
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
    queryFn: () => getData<Profile | null>('/api/v1/users/me'),
    retry: false,
    staleTime: 60_000,
  })
  return (
    <Workspace
      title="Hồ sơ quản trị"
      actions={<Link className={secondary} to="/admin/dashboard">Về Tổng quan</Link>}
      description="Quản lý thông tin liên hệ và bảo mật tài khoản quản trị."
    >
      <QueryState query={query}>
        {(data) => data ? <>
          <Notice>Vai trò: ADMIN · Phạm vi: Quản trị toàn hệ thống. Phiên truy cập được kiểm soát bằng RBAC.</Notice>
          <ProfileForm data={data} />
        </> : <Notice>Chưa có thông tin hồ sơ quản trị viên.</Notice>}
      </QueryState>
    </Workspace>
  )
}
function ProfileForm({ data }: { data: Profile }) {
  const cache = useQueryClient()
  const form = useForm<Profile>({ defaultValues: Object.fromEntries(Object.entries(data).map(([key, value]) => [key, value ?? ''])) })
  const password = useForm<{ oldPassword: string; newPassword: string }>({ resolver: zodResolver(z.object({ oldPassword: z.string().min(1, 'Nhập mật khẩu hiện tại.'), newPassword: z.string().min(6, 'Mật khẩu mới phải từ 6 đến 50 ký tự.').max(50, 'Mật khẩu mới phải từ 6 đến 50 ký tự.') })) })
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
          noValidate
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
              Nhập mật khẩu hiện tại và mật khẩu mới từ 6 đến 50 ký tự.
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
