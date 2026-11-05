import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, UserRound } from 'lucide-react'
import { fetchMerchantProfile } from '../api/merchantProfileApi'
import { errorMessage } from '@/shared/api/resources'
import { Notice } from '@/shared/components/Workspace'
import { MerchantProfileForm } from '../components/MerchantProfileForm'
import { ProfileDocuments } from '../components/ProfileDocuments'
import { ProfileBankDetails } from '../components/ProfileBankDetails'
import { profileButton } from '../components/ProfileSection'

export const merchantProfileKey = ['merchant-profile-summary'] as const
export function MerchantProfilePage() {
  const cache = useQueryClient()
  const query = useQuery({ queryKey: merchantProfileKey, queryFn: fetchMerchantProfile, staleTime: 30_000, retry: false, refetchOnWindowFocus: false })
  const profile = query.data
  return <div className="mx-auto w-full max-w-[1180px] px-4 py-8 font-inter text-base leading-relaxed text-brand-navy sm:px-8 lg:py-10">
    <header className="mb-8">
      <Link to="/merchant/dashboard" className="mb-5 inline-flex items-center gap-2 text-base text-brand-muted hover:text-brand-navy focus-visible:outline-2 focus-visible:outline-brand-orange"><ArrowLeft size={16} aria-hidden="true" /> Tổng quan</Link>
      <div className="border-l-4 border-brand-orange pl-5">
        <h1 className="font-sora text-2xl font-semibold tracking-tight sm:text-3xl">Hồ sơ chủ bãi</h1>
        <p className="mt-3 text-base text-brand-muted">Quản lý thông tin liên hệ, giấy tờ và tài khoản nhận tiền.</p>
      </div>
    </header>
    {query.isPending ? <div role="status" className="space-y-5 motion-safe:animate-pulse"><p>Đang tải hồ sơ…</p><div className="h-40 rounded-2xl bg-brand-border" /><div className="h-72 rounded-2xl bg-brand-border" /></div>
      : query.isError ? <Notice error><div><p>{errorMessage(query.error)}</p><button type="button" disabled={query.isFetching} className={`${profileButton} mt-4`} onClick={() => void query.refetch()}>Thử lại</button></div></Notice>
      : !profile ? <Notice>Chưa có hồ sơ chủ bãi.</Notice>
      : <div className="grid items-start gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
        <aside aria-label="Tóm tắt tài khoản chủ bãi" className="overflow-hidden rounded-2xl border border-brand-border bg-white xl:sticky xl:top-24">
          <div className="flex items-center gap-3 border-b border-brand-border p-5">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-navy text-white"><UserRound size={21} aria-hidden="true" /></div>
            <div className="min-w-0"><p className="break-words text-base font-semibold">{profile.fullName || 'Chưa cập nhật tên'}</p><p className="mt-1 break-words text-sm text-brand-muted">{profile.phone || 'Chưa có số điện thoại'}</p></div>
          </div>
          <nav aria-label="Các phần hồ sơ" className="flex flex-col gap-1 p-3">
            {[["lien-he", "Thông tin liên hệ"], ["giay-to", "Giấy tờ pháp lý"], ["ngan-hang", "Tài khoản ngân hàng"]].map(([id, label], index) => <a key={id} href={`#${id}`} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-brand-navy hover:bg-brand-surface focus-visible:outline-2 focus-visible:outline-brand-orange"><span className="text-sm text-brand-orange-ink" aria-hidden="true">0{index + 1}</span>{label}</a>)}
          </nav>
          {profile.verificationLabel && <p className="border-t border-brand-border px-5 py-4 text-sm text-brand-muted">Trạng thái hồ sơ<br /><span className="mt-1 inline-block font-semibold text-brand-navy">{profile.verificationLabel}</span></p>}
          {profile.walletBalance !== null && <div className="border-t border-brand-border px-5 py-4"><p className="text-sm text-brand-muted">Số dư ví</p><p className="mt-1 text-lg font-semibold tabular-nums">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(profile.walletBalance))}</p><Link className="mt-3 inline-flex items-center gap-1 rounded text-sm font-medium text-brand-orange-ink focus-visible:outline-2 focus-visible:outline-brand-orange" to="/merchant/withdrawals">Đến Ví & Rút tiền <ArrowUpRight size={15} aria-hidden="true" /></Link></div>}
        </aside>
        <div className="min-w-0 space-y-6">
          <MerchantProfileForm key={profile.merchantId} profile={profile} onUpdated={data => cache.setQueryData(merchantProfileKey, data)} />
          <ProfileDocuments profile={profile} onUpdated={data => cache.setQueryData(merchantProfileKey, data)} />
          <ProfileBankDetails profile={profile} />
        </div>
      </div>}
  </div>
}
