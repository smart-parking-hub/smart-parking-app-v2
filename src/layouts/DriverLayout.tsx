import { Outlet, useLocation } from 'react-router-dom'
import { DriverHeader } from './driver/DriverHeader'
import { DriverFooter } from './driver/DriverFooter'
import { AiCopilot } from '@/features/copilot'
import { ScrollToTop } from '@/shared/components/ScrollToTop'
import { useDocumentTitle } from '@/shared/utils/useDocumentTitle'

export function DriverLayout() {
  useDocumentTitle()
  const { pathname } = useLocation()
  const isProfile = ['/profile', '/dashboard/profile', '/driver/profile'].includes(pathname)
  const isPaymentResult = /^\/(?:dashboard\/|driver\/)?payment\/(?:cancel|success|return)$/.test(pathname)
  const isParkingSearch = /^\/(?:dashboard\/|driver\/)?(?:search|parking)(?:\/)?$/.test(pathname)
  const hideFooter = isProfile || isPaymentResult || isParkingSearch

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9ff] overflow-x-clip w-full max-w-full">
      <ScrollToTop />
      <DriverHeader />
      <main className="flex-1 w-full pt-[var(--driver-header-height)]">
        <Outlet />
      </main>
      {!hideFooter && <DriverFooter />}
      {!isProfile && !isPaymentResult && <AiCopilot />}
    </div>
  )
}
