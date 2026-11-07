import { useState } from 'react'
import { Link } from 'react-router-dom'
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
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-inter selection:bg-[#d95f00] selection:text-white">
      {/* Top Sticky Navbar */}
      <LandingNavbar />

      {/* Main Content Sections */}
      <main className="flex-1 w-full" id="main-content">
        <nav aria-label="Đường dẫn trang" className="mx-auto flex max-w-[1240px] items-center gap-3 px-6 py-5 text-sm">
          <Link to="/" className="text-brand-muted underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-brand-orange">Trang chủ</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="font-semibold text-brand-navy">Tin tức & Báo cáo</span>
        </nav>
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
