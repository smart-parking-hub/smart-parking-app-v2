import { LandingNavbar } from '../components/common/LandingNavbar'
import { LandingFooter } from '../components/common/LandingFooter'
import { HomeHeroSection } from '../components/home/HomeHeroSection'
import { LandingMetricsBanner } from '../components/home/LandingMetricsBanner'
import { LandingServicesGrid } from '../components/home/LandingServicesGrid'
import { LandingWhyUsBento } from '../components/home/LandingWhyUsBento'
import { LandingHowItWorks } from '../components/home/LandingHowItWorks'
import { LandingPricingMatrix } from '../components/home/LandingPricingMatrix'
import { HomeTestimonials } from '../components/home/HomeTestimonials'
import { HomeConversionCta } from '../components/home/HomeConversionCta'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-inter text-slate-800 antialiased selection:bg-brand-orange selection:text-white">
      {/* 1. Sticky Top Navbar */}
      <LandingNavbar />

      <main className="landing-content w-full">
        {/* Section 1: Hero Section (Dark Navy #060D1A) */}
        <HomeHeroSection />

        {/* Section 2: Metrics Banner (White Background #FFFFFF) */}
        <LandingMetricsBanner />

        {/* Section 3: Services Grid (Light Gray #EEF2F7 - "Every Mode. Every Lane.") */}
        <LandingServicesGrid />

        {/* Section 4: Why Us Bento Section (Dark Navy #060D1A - SLA 99.8%) */}
        <LandingWhyUsBento />

        {/* Section 5: How It Works (White Background #FFFFFF - 4 Clear Linear Steps) */}
        <LandingHowItWorks />

        {/* Section 6: Pricing & Logistical Matrix (Light Gray #EEF2F7) */}
        <LandingPricingMatrix />

        {/* Section 7: Social Proof / Testimonials (White Background #FFFFFF) */}
        <HomeTestimonials />

        {/* Section 8: Final Conversion Banner (Dark Navy #060D1A) */}
        <HomeConversionCta />
      </main>

      {/* 4-Column Footer (Dark Navy #060D1A) */}
      <LandingFooter />
    </div>
  )
}

export default LandingPage
