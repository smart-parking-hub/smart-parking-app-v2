import { LandingLayout } from '@/layouts/LandingLayout'
import { AboutHeroSection } from '../components/about-us/AboutHeroSection'
import { AboutNarrativeSection } from '../components/about-us/AboutNarrativeSection'
import { AboutCorePrinciplesSection } from '../components/about-us/AboutCorePrinciplesSection'
import { AboutRoadmapSection } from '../components/about-us/AboutRoadmapSection'
import { AboutLeadershipSection } from '../components/about-us/AboutLeadershipSection'
import { AboutCtaBanner } from '../components/about-us/AboutCtaBanner'

export function AboutUsPage() {
  return (
    <LandingLayout>
      <div className="bg-white text-slate-800">
        <AboutHeroSection />
        <AboutNarrativeSection />
        <AboutCorePrinciplesSection />
        <AboutRoadmapSection />
        <AboutLeadershipSection />
        <AboutCtaBanner />
      </div>
    </LandingLayout>
  )
}
