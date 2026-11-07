import { LandingNavbar } from '../components/common/LandingNavbar'
import { LandingFooter } from '../components/common/LandingFooter'
import { ContactHeroSection } from '../components/contact/ContactHeroSection'
import { ContactFormSection } from '../components/contact/ContactFormSection'
import { ContactStationsSection } from '../components/contact/ContactStationsSection'
import { ContactSlaSection } from '../components/contact/ContactSlaSection'
import { ContactCtaBanner } from '../components/contact/ContactCtaBanner'

export function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-inter selection:bg-[#d95f00] selection:text-white">
      {/* Top Sticky Navbar */}
      <LandingNavbar />

      {/* Main Content Sections */}
      <main className="flex-1 w-full" id="main-content">
        <ContactHeroSection />
        <ContactFormSection />
        <ContactStationsSection />
        <ContactSlaSection />
        <ContactCtaBanner />
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  )
}
