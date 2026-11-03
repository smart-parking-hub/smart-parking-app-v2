import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { MerchantSidebar } from './merchant/MerchantSidebar'
import { MerchantHeader } from './merchant/MerchantHeader'

export function MerchantLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0d1c2e] antialiased">
      {/* 260px Fixed Sidebar */}
      <MerchantSidebar
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Top Header */}
      <MerchantHeader onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)} />

      {/* Main Operational Core Content Container */}
      <div className="lg:pl-[260px] pt-16 min-h-screen flex flex-col">
        <main className="flex-1 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
