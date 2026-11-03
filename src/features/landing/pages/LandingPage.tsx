import { LandingNavbar } from '../components/LandingNavbar'
import { LandingHeroSection } from '../components/LandingHeroSection'
import { LandingMetricsBanner } from '../components/LandingMetricsBanner'
import { LandingServicesGrid } from '../components/LandingServicesGrid'
import { LandingWhyUsBento } from '../components/LandingWhyUsBento'
import { LandingHowItWorks } from '../components/LandingHowItWorks'
import { LandingPricingMatrix } from '../components/LandingPricingMatrix'
import { LandingTestimonials } from '../components/LandingTestimonials'
import { LandingConversionCta } from '../components/LandingConversionCta'
import { LandingFooter } from '../components/LandingFooter'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-inter text-slate-800 antialiased selection:bg-brand-orange selection:text-white">
      <LandingNavbar />
      <main className="w-full">
        <LandingHeroSection />
        <LandingMetricsBanner />
        <LandingServicesGrid />
        <LandingWhyUsBento />
        <LandingHowItWorks />
        <LandingPricingMatrix />
        <LandingTestimonials />
        <LandingConversionCta />
      </main>
      <LandingFooter />
    </div>
  )
}

export default LandingPage
