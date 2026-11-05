import { Outlet } from 'react-router-dom'
import { DriverHeader } from './driver/DriverHeader'
import { DriverFooter } from './driver/DriverFooter'

export function DriverLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9ff]">
      <DriverHeader />
      <main className="flex-1 w-full pt-[68px]">
        <Outlet />
      </main>
      <DriverFooter />
    </div>
  )
}
