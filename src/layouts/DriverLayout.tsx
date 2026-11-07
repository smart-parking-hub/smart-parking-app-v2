import { Outlet, useLocation } from 'react-router-dom'
import { DriverHeader } from './driver/DriverHeader'
import { DriverFooter } from './driver/DriverFooter'
import { AiCopilot } from '@/features/copilot'
import { ScrollToTop } from '@/shared/components/ScrollToTop'

export function DriverLayout() {
  const { pathname } = useLocation()
  const isProfile = ['/profile', '/dashboard/profile', '/driver/profile'].includes(pathname)
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9ff]">
      <ScrollToTop />
      <DriverHeader />
      <main className="flex-1 w-full pt-[var(--driver-header-height)]">
        <Outlet />
      </main>
      {!isProfile && <DriverFooter />}
      {!isProfile && <AiCopilot />}
    </div>
  )
}
