import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useLocation } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { fetchMyProfile } from '../api/profileApi'
import { errorMessage } from '@/shared/api/resources'
import { Notice } from '@/shared/components/Workspace'
import { DriverContactForm } from '../components/DriverContactForm'
import { DriverPasswordForm } from '../components/DriverPasswordForm'
import { ProfileSidebarNav } from '../components/ProfileSidebarNav'
import { accountButton } from '../components/AccountSection'

export const driverProfileKey = ['current-user', 'profile'] as const
export function ProfilePage() {
  const { hash, key } = useLocation()
  const cache = useQueryClient()
  const query = useQuery({ queryKey: driverProfileKey, queryFn: fetchMyProfile, staleTime: 30_000, retry: false, refetchOnWindowFocus: false })
  const profile = query.data
  const hasProfile = Boolean(profile)
  useEffect(() => {
    if (!hash || !hasProfile) return
    const target = document.getElementById(hash.replace(/^#/, ''))
    if (typeof target?.scrollIntoView === 'function') {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }, [hash, key, hasProfile])
  return <div className="mx-auto w-full max-w-[1120px] px-4 py-8 font-inter text-base leading-relaxed text-brand-navy sm:px-8 lg:py-10">
    <header className="mb-8">
      <Link to="/dashboard" className="mb-5 inline-flex items-center gap-2 text-brand-muted hover:text-brand-navy focus-visible:outline-2 focus-visible:outline-brand-orange"><ArrowLeft size={16} aria-hidden="true" /> Tổng quan</Link>
      <div className="border-l-4 border-brand-orange pl-5">
        <h1 className="font-sora text-2xl font-semibold tracking-tight sm:text-3xl">Hồ sơ tài xế</h1>
        <p className="mt-3 text-base text-brand-muted">Cập nhật thông tin cá nhân, liên hệ khẩn cấp và bảo mật tài khoản.</p>
      </div>
    </header>
    {query.isPending ? <div role="status" className="space-y-5 motion-safe:animate-pulse"><p>Đang tải hồ sơ…</p><div className="h-40 rounded-2xl bg-brand-border" /><div className="h-72 rounded-2xl bg-brand-border" /></div>
      : query.isError ? <Notice error><div><p>{errorMessage(query.error)}</p><button className={`${accountButton} mt-4`} type="button" disabled={query.isFetching} onClick={() => void query.refetch()}>Thử lại</button></div></Notice>
        : !profile ? <Notice>Chưa có thông tin hồ sơ.</Notice>
          : <div className="grid items-start gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
            <aside aria-label="Tóm tắt tài khoản" className="lg:sticky lg:top-[calc(var(--driver-header-height)+24px)]">
              <ProfileSidebarNav compact activeTab="profile" />
            </aside>
            <div className="min-w-0 space-y-6">
              <DriverContactForm profile={profile} onUpdated={data => { cache.setQueryData(driverProfileKey, data); void cache.invalidateQueries({ queryKey: ['current-user', 'header'] }) }} />
              <DriverPasswordForm />
            </div>
          </div>}
  </div>
}
