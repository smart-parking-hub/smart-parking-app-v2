import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { updateMerchantProfileApi } from '../api/merchantProfileApi'
import type { MerchantProfile, UpdateMerchantProfileRequest } from '../types/merchantProfileTypes'
import { errorMessage } from '@/shared/api/resources'
import { Notice } from '@/shared/components/Workspace'
import { ProfileSection, ProfileField, profileInput, profileButton } from './ProfileSection'

const schema = z.object({
  fullName: z.string().trim().min(1, 'Vui lòng nhập họ tên.').max(100, 'Tối đa 100 ký tự.'),
  email: z.union([z.literal(''), z.string().email('Email không hợp lệ.')]).refine(value => value.length <= 100, 'Tối đa 100 ký tự.'),
  address: z.string().max(255, 'Tối đa 255 ký tự.'),
  emergencyContact: z.string().max(20, 'Tối đa 20 ký tự.'),
})
const defaults = (data: MerchantProfile): UpdateMerchantProfileRequest => ({ fullName: data.fullName ?? '', email: data.email ?? '', address: data.address ?? '', emergencyContact: data.emergencyContact ?? '' })
export function MerchantProfileForm({ profile, onUpdated }: { profile: MerchantProfile; onUpdated: (profile: MerchantProfile) => void }) {
  const form = useForm<UpdateMerchantProfileRequest>({ resolver: zodResolver(schema), defaultValues: defaults(profile) })
  const save = useMutation({ mutationFn: updateMerchantProfileApi, onSuccess: data => { onUpdated(data); form.reset(defaults(data)) } })
  const { errors, isDirty } = form.formState
  return <ProfileSection id="lien-he" title="Thông tin liên hệ" description="Cập nhật thông tin để liên hệ trong quá trình vận hành bãi đỗ.">
    <form noValidate onSubmit={form.handleSubmit(values => save.mutate(values))} className="space-y-6">
      <fieldset disabled={save.isPending} className="grid min-w-0 gap-5 sm:grid-cols-2">
        <legend className="sr-only">Thông tin liên hệ chủ bãi</legend>
        {([['fullName', 'Họ và tên', 'name'], ['email', 'Email', 'email'], ['emergencyContact', 'Số liên hệ khẩn cấp', 'tel'], ['address', 'Địa chỉ', 'street-address']] as const).map(([key, label, complete]) => <ProfileField key={key} id={`profile-${key}`} label={label} error={errors[key]?.message}>
          <input id={`profile-${key}`} type={key === 'email' ? 'email' : key === 'emergencyContact' ? 'tel' : 'text'} autoComplete={complete} className={profileInput} aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `profile-${key}-error` : undefined} {...form.register(key, { onChange: () => save.reset() })} />
        </ProfileField>)}
      </fieldset>
      {save.isError && <Notice error>{errorMessage(save.error)}</Notice>}
      {save.isSuccess && <Notice>Đã lưu thông tin liên hệ.</Notice>}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-brand-border pt-5">
        <p className="text-sm text-brand-muted">{isDirty ? 'Bạn có thay đổi chưa lưu.' : 'Thông tin liên hệ hiện tại của bạn.'}</p>
        <div className="flex items-center gap-4"><button type="button" className="rounded-lg px-2 py-3 text-base text-brand-muted underline underline-offset-4 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-brand-orange" disabled={!isDirty || save.isPending} onClick={() => { form.reset(defaults(profile)); save.reset() }}>Hủy thay đổi</button><button className={profileButton} disabled={!isDirty || save.isPending}>{save.isPending ? 'Đang lưu…' : 'Lưu thay đổi'}</button></div>
      </div>
    </form>
  </ProfileSection>
}
