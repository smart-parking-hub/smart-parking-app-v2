import { LandingNavbar } from '../components/common/LandingNavbar'
import { LandingFooter } from '../components/common/LandingFooter'
import { AboutHeroSection } from '../components/about-us/AboutHeroSection'
import { AboutNarrativeSection } from '../components/about-us/AboutNarrativeSection'
import { AboutCorePrinciplesSection } from '../components/about-us/AboutCorePrinciplesSection'
import { AboutRoadmapSection } from '../components/about-us/AboutRoadmapSection'
import { AboutLeadershipSection } from '../components/about-us/AboutLeadershipSection'
import { AboutCtaBanner } from '../components/about-us/AboutCtaBanner'

export function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-inter selection:bg-[#F97316] selection:text-white">
      {/* Top Sticky Navbar */}
      <LandingNavbar />

      {/* Main Content Sections */}
      <main className="flex-1 w-full" id="main-content">
        <AboutHeroSection />
        <AboutNarrativeSection />
        <AboutCorePrinciplesSection />
        <AboutRoadmapSection />
        <AboutLeadershipSection />
        <AboutCtaBanner />
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  )
}
