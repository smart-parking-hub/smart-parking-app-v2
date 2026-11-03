import { LandingNavbar } from '../components/common/LandingNavbar'
import { LandingFooter } from '../components/common/LandingFooter'
import { ApiHeroSection } from '../components/api-docs/ApiHeroSection'
import { ApiTerminalSection } from '../components/api-docs/ApiTerminalSection'
import { ApiSolutionsBentoSection } from '../components/api-docs/ApiSolutionsBentoSection'
import { ApiWorkflowSection } from '../components/api-docs/ApiWorkflowSection'
import { ApiCtaBanner } from '../components/api-docs/ApiCtaBanner'

export function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-[#060D1A] text-slate-100 flex flex-col font-inter selection:bg-[#F97316] selection:text-white">
      {/* Top Navbar */}
      <LandingNavbar />

      {/* Main Content Sections */}
      <main className="flex-1 w-full" id="main-content">
        <ApiHeroSection />
        <ApiTerminalSection />
        <ApiSolutionsBentoSection />
        <ApiWorkflowSection />
        <ApiCtaBanner />
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  )
}
