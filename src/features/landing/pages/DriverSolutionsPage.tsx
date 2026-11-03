import { LandingNavbar } from '../components/common/LandingNavbar'
import { LandingFooter } from '../components/common/LandingFooter'
import { DriverHeroSection } from '../components/driver-solutions/DriverHeroSection'
import { LandingPainPointsSection } from '../components/driver-solutions/LandingPainPointsSection'
import { DriverWorkflowSection } from '../components/driver-solutions/DriverWorkflowSection'
import { LandingAmenityFilterSection } from '../components/driver-solutions/LandingAmenityFilterSection'
import { DriverTestimonialsSection } from '../components/driver-solutions/DriverTestimonialsSection'
import { DriverConversionCta } from '../components/driver-solutions/DriverConversionCta'

export function DriverSolutionsPage() {
  return (
    <div className="min-h-screen bg-white font-inter text-slate-800 antialiased selection:bg-brand-orange selection:text-white">
      {/* 1. Sticky Top Navbar */}
      <LandingNavbar />

      <main className="w-full">
        {/* Section 1: Hero (Dark Navy Deep #060D1A) - Lộ Trình Chủ Động */}
        <DriverHeroSection />

        {/* Section 2: 4 Pain Points vs Solutions (Gray Highlight #EEF2F7) */}
        <LandingPainPointsSection />

        {/* Section 3: 4-Step Driver Workflow (White #FFFFFF) */}
        <DriverWorkflowSection />

        {/* Section 4: Real-time Amenity Filter Preview (Dark Navy Deep #060D1A) */}
        <LandingAmenityFilterSection />

        {/* Section 5: Driver Reviews & Community Voices (Light Gray #EEF2F7) */}
        <DriverTestimonialsSection />

        {/* Section 6: Final CTA Banner (Navy Deep #060D1A with Orange #F97316 Accent) */}
        <DriverConversionCta />
      </main>

      {/* 4-Column Footer (Dark Navy #060D1A) */}
      <LandingFooter />
    </div>
  )
}

export default DriverSolutionsPage
