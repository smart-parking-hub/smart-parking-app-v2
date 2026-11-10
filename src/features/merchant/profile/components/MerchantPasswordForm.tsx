import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff } from 'lucide-react'
import { changeMyPasswordApi } from '@/features/profile'
import { errorMessage } from '@/shared/api/resources'
import { Notice } from '@/shared/components/Workspace'
import { ProfileSection, ProfileField, profileInput, profileButton } from './ProfileSection'

const schema = z.object({
  currentPassword: z.string().min(1, 'Nhập mật khẩu hiện tại.'),
  newPassword: z.string().min(6, 'Mật khẩu mới phải từ 6 đến 50 ký tự.')
    .max(50, 'Mật khẩu mới phải từ 6 đến 50 ký tự.')
    .refine(value => Boolean(value.trim()), 'Mật khẩu mới không được chỉ chứa khoảng trắng.'),
  confirmation: z.string().min(1, 'Nhập lại mật khẩu mới.'),
}).refine(values => values.newPassword === values.confirmation, {
  path: ['confirmation'], message: 'Mật khẩu xác nhận không khớp.',
})
type Values = z.infer<typeof schema>

export function MerchantPasswordForm() {
  const [visible, setVisible] = useState<Partial<Record<keyof Values, boolean>>>({})
  const form = useForm<Values>({ resolver: zodResolver(schema),
    defaultValues: { currentPassword: '', newPassword: '', confirmation: '' } })
  const save = useMutation({
    mutationFn: () => {
      const { currentPassword, newPassword } = form.getValues()
      return changeMyPasswordApi(currentPassword, newPassword)
    },
    onSuccess: () => { form.reset(); setVisible({}) },
  })
  return <ProfileSection id="bao-mat" title="Bảo mật tài khoản" description="Đổi mật khẩu đăng nhập của chủ bãi. Mật khẩu mới cần từ 6 đến 50 ký tự.">
    <form noValidate className="space-y-6" onSubmit={form.handleSubmit(() => { if (!save.isPending) save.mutate() })}>
      <fieldset disabled={save.isPending} className="grid min-w-0 gap-6 sm:grid-cols-2">
        <legend className="sr-only">Đổi mật khẩu</legend>
        {([
          ['currentPassword', 'Mật khẩu hiện tại', 'current-password'],
          ['newPassword', 'Mật khẩu mới', 'new-password'],
          ['confirmation', 'Xác nhận mật khẩu mới', 'new-password'],
        ] as const).map(([key, label, autoComplete]) => {
          const id = `merchant-${key}`
          return <ProfileField key={key} id={id} label={label} error={form.formState.errors[key]?.message}>
            <div className="relative">
              <input id={id} type={visible[key] ? 'text' : 'password'} autoComplete={autoComplete}
                className={`${profileInput} pr-12`} aria-invalid={Boolean(form.formState.errors[key])}
                aria-describedby={form.formState.errors[key] ? `${id}-error` : undefined}
                {...form.register(key, { onChange: () => save.reset() })} />
              <button type="button" aria-label={`${visible[key] ? 'Ẩn' : 'Hiện'} ${label.toLowerCase()}`} aria-pressed={Boolean(visible[key])}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-brand-muted hover:bg-brand-surface focus-visible:outline-2 focus-visible:outline-brand-orange"
                onClick={() => setVisible(previous => ({ ...previous, [key]: !previous[key] }))}>
                {visible[key] ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
              </button>
            </div>
          </ProfileField>
        })}
      </fieldset>
      {save.isError && <Notice error>{errorMessage(save.error)}</Notice>}
      {save.isSuccess && <p role="status" className="text-sm font-medium text-green-700">Đã đổi mật khẩu thành công.</p>}
      <div className="border-t border-brand-border pt-5">
        <button type="submit" className={profileButton} disabled={save.isPending} aria-busy={save.isPending}>
          {save.isPending ? 'Đang đổi mật khẩu…' : 'Cập nhật mật khẩu'}
        </button>
      </div>
    </form>
  </ProfileSection>
}
