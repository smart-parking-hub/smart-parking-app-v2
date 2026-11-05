import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import type { MerchantProfile } from '../types/merchantProfileTypes'
import { ProfileSection } from './ProfileSection'
export function ProfileBankDetails({ profile }: { profile: MerchantProfile }) {
  const [visible, setVisible] = useState(false)
  const masked = profile.maskedBankAccount || (profile.bankAccountNum ? '•'.repeat(Math.max(0, profile.bankAccountNum.length - 4)) + profile.bankAccountNum.slice(-4) : 'Chưa cập nhật')
  return <ProfileSection id="ngan-hang" title="Tài khoản ngân hàng" description="Thông tin tài khoản nhận tiền đang được lưu trong hồ sơ.">
    <dl className="grid gap-6 sm:grid-cols-2">
      <div><dt className="text-sm text-brand-muted">Ngân hàng</dt><dd className="mt-2 font-semibold">{profile.bankName || 'Chưa cập nhật'}</dd></div>
      <div><dt className="text-sm text-brand-muted">Số tài khoản</dt><dd className="mt-2 flex flex-wrap items-center gap-3"><span className="break-all font-semibold tabular-nums">{visible ? profile.bankAccountNum : masked}</span>{profile.bankAccountNum && <button type="button" aria-label={visible ? 'Ẩn số tài khoản' : 'Hiển thị số tài khoản'} aria-pressed={visible} onClick={() => setVisible(value => !value)} className="rounded-lg p-2 text-brand-muted hover:bg-brand-surface focus-visible:outline-2 focus-visible:outline-brand-orange">{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button>}</dd></div>
    </dl>
  </ProfileSection>
}
