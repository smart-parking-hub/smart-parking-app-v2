import { useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import type { MerchantProfile } from '../types/merchantProfileTypes'
import { uploadMerchantDocumentApi } from '../api/merchantProfileApi'
import { errorMessage } from '@/shared/api/resources'
import { Notice } from '@/shared/components/Workspace'
import { ProfileSection, ProfileField, profileInput, profileButton } from './ProfileSection'

export function ProfileDocuments({ profile, onUpdated }: { profile: MerchantProfile; onUpdated: (profile: MerchantProfile) => void }) {
  const [license, setLicense] = useState(profile.businessLicense ?? '')
  const [file, setFile] = useState<File | null>(null)
  const [validation, setValidation] = useState('')
  const input = useRef<HTMLInputElement>(null)
  const upload = useMutation({ mutationFn: ({ file, license }: { file: File | null; license: string }) => uploadMerchantDocumentApi(file, license), onSuccess: data => { onUpdated(data); setLicense(data.businessLicense ?? ''); setFile(null); if (input.current) input.current.value = '' } })
  return <ProfileSection id="giay-to" title="Giấy tờ pháp lý" description="Xem thông tin định danh và gửi bổ sung giấy tờ của bạn.">
    <dl className="mb-6 grid gap-5 sm:grid-cols-2">
      <div><dt className="text-sm text-brand-muted">CCCD / CMND</dt><dd className="mt-1 font-semibold">{profile.maskedCitizenId || (profile.citizenId ? '•'.repeat(Math.max(0, profile.citizenId.length - 4)) + profile.citizenId.slice(-4) : 'Chưa cập nhật')}</dd></div>
      <div><dt className="text-sm text-brand-muted">Giấy phép kinh doanh</dt><dd className="mt-1 break-words font-semibold">{profile.businessLicense || 'Chưa cập nhật'}</dd></div>
    </dl>
    <form className="space-y-5 border-t border-brand-border pt-6" onSubmit={event => {
      event.preventDefault()
      if (!file && (!license.trim() || license.trim() === profile.businessLicense)) { setValidation('Vui lòng chọn tệp hoặc cập nhật số giấy phép.'); return }
      if (license.length > 50) { setValidation('Số giấy phép tối đa 50 ký tự.'); return }
      setValidation(''); upload.mutate({ file, license })
    }}>
      <fieldset disabled={upload.isPending} className="grid min-w-0 gap-5 sm:grid-cols-2">
        <legend className="sr-only">Bổ sung giấy tờ</legend>
        <ProfileField id="profile-license" label="Số giấy phép kinh doanh"><input id="profile-license" className={profileInput} value={license} maxLength={50} onChange={event => { setLicense(event.target.value); upload.reset() }} /></ProfileField>
        <ProfileField id="profile-document" label="Tệp đính kèm">
          <input ref={input} id="profile-document" type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" aria-describedby="profile-file-help" className="block w-full min-w-0 rounded-lg py-2 text-sm text-brand-muted file:mr-3 file:rounded-lg file:border-0 file:bg-brand-surface file:px-3 file:py-2 file:text-sm file:font-semibold file:text-brand-navy focus-visible:outline-2 focus-visible:outline-brand-orange" onChange={event => {
            upload.reset(); setValidation(''); setFile(null)
            const selected = event.target.files?.[0]
            if (!selected) return
            if (!['application/pdf', 'image/jpeg', 'image/png', 'image/webp'].includes(selected.type) || selected.size > 5 * 1024 * 1024 || selected.size === 0) { setValidation('Chọn PDF, JPEG, PNG hoặc WEBP có dung lượng từ 1 byte đến 5 MB.'); event.target.value = ''; return }
            setFile(selected)
          }} />
        </ProfileField>
      </fieldset>
      <p id="profile-file-help" className="text-sm text-brand-muted">PDF, JPEG, PNG hoặc WEBP · Tối đa 5 MB.</p>
      {validation && <Notice error>{validation}</Notice>}
      {upload.isError && <Notice error>{errorMessage(upload.error)}</Notice>}
      {upload.isSuccess && <Notice>Đã gửi giấy tờ thành công.</Notice>}
      <button className={profileButton} disabled={(!file && (!license.trim() || license.trim() === profile.businessLicense)) || upload.isPending}>{upload.isPending ? 'Đang gửi…' : 'Gửi giấy tờ'}</button>
    </form>
  </ProfileSection>
}
