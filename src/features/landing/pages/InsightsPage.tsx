import { useState } from 'react'
import { LandingNavbar } from '../components/common/LandingNavbar'
import { LandingFooter } from '../components/common/LandingFooter'
import {
  InsightsHeroSection,
  type InsightCategory,
} from '../components/insights/InsightsHeroSection'
import { InsightsFeaturedSection } from '../components/insights/InsightsFeaturedSection'
import { InsightsArticlesGridSection } from '../components/insights/InsightsArticlesGridSection'
import { InsightsNewsletterSection } from '../components/insights/InsightsNewsletterSection'
import { InsightsCtaBanner } from '../components/insights/InsightsCtaBanner'

export function InsightsPage() {
  const [selectedCategory, setSelectedCategory] = useState<InsightCategory>('all')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-inter selection:bg-[#F97316] selection:text-white">
      {/* Top Sticky Navbar */}
      <LandingNavbar />

      {/* Main Content Sections */}
      <main className="flex-1 w-full" id="main-content">
        <InsightsHeroSection
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <InsightsFeaturedSection />
        <InsightsArticlesGridSection
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
        />
        <InsightsNewsletterSection />
        <InsightsCtaBanner />
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  )
}
