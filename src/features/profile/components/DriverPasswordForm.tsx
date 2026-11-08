import { useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { changeMyPasswordApi } from '../api/profileApi'
import { Notice } from '@/shared/components/Workspace'
import { Toast } from '@/shared/components/Toast'
import { errorMessage } from '@/shared/api/resources'
import { AccountSection, AccountField, accountInput, accountButton } from './AccountSection'
const schema = z.object({
  currentPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại.'),
  newPassword: z.string().min(6, 'Mật khẩu mới phải từ 6 đến 50 ký tự.').max(50, 'Mật khẩu mới phải từ 6 đến 50 ký tự.'),
  confirmation: z.string(),
}).refine(data => data.newPassword === data.confirmation, { path: ['confirmation'], message: 'Mật khẩu xác nhận không khớp.' })
type Values = z.infer<typeof schema>
export function DriverPasswordForm() {
  const [successToastId, setSuccessToastId] = useState<number | null>(null)
  const closeSuccessToast = useCallback(() => setSuccessToastId(null), [])
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { currentPassword: '', newPassword: '', confirmation: '' } })
  const save = useMutation({ mutationFn: (data: Values) => changeMyPasswordApi(data.currentPassword, data.newPassword), onSuccess: () => {
    form.reset()
    setSuccessToastId(id => (id ?? 0) + 1)
  } })
  const { errors } = form.formState
  return <AccountSection id="bao-mat" title="Bảo mật tài khoản" description="Đổi mật khẩu đăng nhập. Mật khẩu mới cần từ 6 đến 50 ký tự.">
    <form noValidate onSubmit={form.handleSubmit(values => { if (save.isPending) return; save.mutate(values) })} className="space-y-6">
      <fieldset disabled={save.isPending} className="grid min-w-0 gap-6 sm:grid-cols-2">
        <legend className="sr-only">Đổi mật khẩu</legend>
        {([['currentPassword', 'Mật khẩu hiện tại', 'current-password'], ['newPassword', 'Mật khẩu mới', 'new-password'], ['confirmation', 'Xác nhận mật khẩu mới', 'new-password']] as const).map(([key, label, complete]) => <AccountField key={key} id={`driver-${key}`} label={label} error={errors[key]?.message}><input id={`driver-${key}`} type="password" autoComplete={complete} className={accountInput} aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `driver-${key}-error` : undefined} {...form.register(key, { onChange: () => save.reset() })} /></AccountField>)}
      </fieldset>
      {save.isError && <Notice error>{errorMessage(save.error)}</Notice>}
      {successToastId !== null && createPortal(
        <div className="fixed right-4 top-4 z-[100] w-[calc(100%-2rem)] max-w-sm">
          <Toast key={successToastId} title="Đã đổi mật khẩu thành công." variant="success" duration={5000} onClose={closeSuccessToast} />
        </div>,
        document.body,
      )}
      <div className="border-t border-brand-border pt-5"><button className={accountButton} disabled={save.isPending} aria-busy={save.isPending}>{save.isPending ? 'Đang cập nhật…' : 'Cập nhật mật khẩu'}</button></div>
    </form>
  </AccountSection>
}
