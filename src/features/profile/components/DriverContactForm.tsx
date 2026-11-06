import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import type { DriverProfile, UpdateProfileFormData } from '../types/profileTypes'
import { updateMyProfile } from '../api/profileApi'
import { Notice } from '@/shared/components/Workspace'
import { errorMessage } from '@/shared/api/resources'
import { AccountSection, AccountField, accountInput, accountButton } from './AccountSection'

const schema = z.object({
  fullName: z.string().trim().min(1, 'Vui lòng nhập họ tên.').max(100, 'Tối đa 100 ký tự.'),
  email: z.union([z.literal(''), z.string().email('Email không hợp lệ.')]).refine(value => value.length <= 100, 'Tối đa 100 ký tự.'),
  address: z.string().max(255, 'Tối đa 255 ký tự.'),
  emergencyContact: z.string().max(20, 'Tối đa 20 ký tự.'),
})
const defaults = (data: DriverProfile): UpdateProfileFormData => ({ fullName: data.fullName ?? '', email: data.email ?? '', address: data.address ?? '', emergencyContact: data.emergencyContact ?? '' })
export function DriverContactForm({ profile, onUpdated }: { profile: DriverProfile; onUpdated: (data: DriverProfile) => void }) {
  const form = useForm<UpdateProfileFormData>({ resolver: zodResolver(schema), defaultValues: defaults(profile) })
  const save = useMutation({ mutationFn: (data: UpdateProfileFormData) => updateMyProfile(data, profile.phone), onSuccess: data => { onUpdated(data); form.reset(defaults(data)) } })
  const { errors, isDirty } = form.formState
  return <form noValidate onSubmit={form.handleSubmit(values => { if (save.isPending) return; save.mutate(values) })} className="space-y-6">
    <AccountSection id="ca-nhan" title="Thông tin cá nhân" description="Thông tin cơ bản dùng để liên hệ và quản lý tài khoản của bạn.">
      <fieldset disabled={save.isPending} className="grid min-w-0 gap-6 sm:grid-cols-2">
        <legend className="sr-only">Thông tin cá nhân tài xế</legend>
        <AccountField id="driver-fullName" label="Họ và tên" error={errors.fullName?.message}><input id="driver-fullName" autoComplete="name" className={accountInput} aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? 'driver-fullName-error' : undefined} {...form.register('fullName', { onChange: () => save.reset() })} /></AccountField>
        <AccountField id="driver-phone" label="Số điện thoại đăng nhập"><input id="driver-phone" type="tel" readOnly value={profile.phone ?? ''} className={`${accountInput} bg-brand-surface`} aria-describedby="driver-phone-help" /><p id="driver-phone-help" className="text-sm text-brand-muted">Số điện thoại đăng nhập không thể chỉnh sửa tại đây.</p></AccountField>
        <AccountField id="driver-email" label="Email" error={errors.email?.message}><input id="driver-email" type="email" autoComplete="email" className={accountInput} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'driver-email-error' : undefined} {...form.register('email', { onChange: () => save.reset() })} /></AccountField>
        <AccountField id="driver-address" label="Địa chỉ" error={errors.address?.message}><input id="driver-address" autoComplete="street-address" className={accountInput} aria-invalid={Boolean(errors.address)} aria-describedby={errors.address ? 'driver-address-error' : undefined} {...form.register('address', { onChange: () => save.reset() })} /></AccountField>
      </fieldset>
    </AccountSection>
    <AccountSection id="khan-cap" title="Liên hệ khẩn cấp" description="Số điện thoại để liên hệ khi bạn cần hỗ trợ trong chuyến đi.">
      <fieldset disabled={save.isPending} className="min-w-0">
        <legend className="sr-only">Liên hệ khẩn cấp</legend>
        <div className="max-w-md"><AccountField id="driver-emergency" label="Số điện thoại liên hệ khẩn cấp" error={errors.emergencyContact?.message}><input id="driver-emergency" type="tel" className={accountInput} aria-invalid={Boolean(errors.emergencyContact)} aria-describedby={errors.emergencyContact ? 'driver-emergency-error' : undefined} {...form.register('emergencyContact', { onChange: () => save.reset() })} /></AccountField></div>
      </fieldset>
    </AccountSection>
    <div className="rounded-2xl border border-brand-border bg-white p-5 sm:p-6">
      {save.isError && <div className="mb-5"><Notice error>{errorMessage(save.error)}</Notice></div>}
      {save.isSuccess && <div className="mb-5"><Notice>Đã lưu thông tin hồ sơ.</Notice></div>}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-brand-muted">{isDirty ? 'Bạn có thay đổi chưa lưu.' : 'Thông tin hồ sơ hiện tại của bạn.'}</p>
        <div className="flex flex-wrap items-center gap-4"><button type="button" disabled={!isDirty || save.isPending} onClick={() => { form.reset(defaults(profile)); save.reset() }} className="rounded-lg px-2 py-3 text-brand-muted underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-brand-orange disabled:opacity-50">Hủy thay đổi</button><button className={accountButton} disabled={!isDirty || save.isPending} aria-busy={save.isPending}>{save.isPending ? 'Đang lưu…' : 'Lưu thay đổi'}</button></div>
      </div>
    </div>
  </form>
}
