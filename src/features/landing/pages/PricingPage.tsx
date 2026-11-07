import { useState } from 'react'
import { LandingNavbar } from '../components/common/LandingNavbar'
import { LandingFooter } from '../components/common/LandingFooter'
import { PricingHeroSection } from '../components/pricing/PricingHeroSection'
import { PricingCardsSection } from '../components/pricing/PricingCardsSection'
import { PricingComparisonTableSection } from '../components/pricing/PricingComparisonTableSection'
import { PricingFaqSection } from '../components/pricing/PricingFaqSection'
import { PricingCtaBanner } from '../components/pricing/PricingCtaBanner'

export function PricingPage() {
  const [billingType, setBillingType] = useState<'turn' | 'month'>('turn')

  return (
    <div className="min-h-screen bg-surface font-inter text-slate-800 antialiased selection:bg-[#d95f00] selection:text-white">
      {/* 1. Sticky Navigation Bar */}
      <LandingNavbar />

      {/* Main Content Area */}
      <main className="w-full">
        <div className="flex flex-col w-full">
          {/* SECTION 1: HERO SECTION & BILLING TOGGLE */}
          <PricingHeroSection
            billingType={billingType}
            onBillingTypeChange={setBillingType}
          />

          {/* SECTION 2: 3-TIER PRICING CARDS */}
          <PricingCardsSection billingType={billingType} />

          {/* SECTION 3: FEATURE COMPARISON TABLE */}
          <PricingComparisonTableSection />

          {/* SECTION 4: PRICING FAQ ACCORDION */}
          <PricingFaqSection />

          {/* SECTION 5: BOTTOM CTA BANNER */}
          <PricingCtaBanner />
        </div>
      </main>

      {/* 6. Footer */}
      <LandingFooter />
    </div>
  )
}
