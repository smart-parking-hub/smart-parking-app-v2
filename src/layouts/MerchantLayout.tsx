import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { MerchantSidebar } from './merchant/MerchantSidebar'
import { MerchantHeader } from './merchant/MerchantHeader'

export function MerchantLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0d1c2e] antialiased">
      {/* Responsive merchant sidebar */}
      <MerchantSidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        collapsed={sidebarCollapsed}
      />

      {/* Top Header */}
      <MerchantHeader
        onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
      />

      {/* Main Operational Core Content Container */}
      <div className={`pt-16 min-h-screen flex flex-col transition-[padding] duration-300 motion-reduce:transition-none ${sidebarCollapsed ? 'lg:pl-[76px]' : 'lg:pl-[260px]'}`}>
        <main className="flex-1 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
