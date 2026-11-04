import type { ReactNode } from 'react'
import { LandingNavbar } from '@/features/landing/components/common/LandingNavbar'
import { LandingFooter } from '@/features/landing/components/common/LandingFooter'

export function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#060D1A] text-slate-100 flex flex-col font-inter selection:bg-[#F97316] selection:text-white">
      <LandingNavbar />
      <main className="flex-1 w-full" id="main-content">{children}</main>
      <LandingFooter />
    </div>
  )
}
