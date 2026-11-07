import React from 'react'
import { Outlet } from 'react-router-dom'
import { LandingNavbar } from '@/features/landing/components/common/LandingNavbar'
import { LandingFooter } from '@/features/landing/components/common/LandingFooter'
import { ScrollToTop } from '@/shared/components/ScrollToTop'

export interface LandingLayoutProps {
  children?: React.ReactNode
}

export function LandingLayout({ children }: LandingLayoutProps = {}) {
  return (
    <div className="min-h-screen bg-white font-inter text-slate-800 antialiased selection:bg-brand-orange selection:text-white flex flex-col">
      <ScrollToTop />
      <LandingNavbar />
      <main className="w-full flex-1" id="main-content">
        {children ?? <Outlet />}
      </main>
      <LandingFooter />
    </div>
  )
}

export default LandingLayout
