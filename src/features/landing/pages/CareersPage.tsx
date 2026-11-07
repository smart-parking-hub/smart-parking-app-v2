import { useState } from 'react'
import { LandingNavbar } from '../components/common/LandingNavbar'
import { LandingFooter } from '../components/common/LandingFooter'
import { CareersHeroSection } from '../components/careers/CareersHeroSection'
import { CareersCultureSection } from '../components/careers/CareersCultureSection'
import { CareersJobListSection } from '../components/careers/CareersJobListSection'
import { CareersProcessSection } from '../components/careers/CareersProcessSection'
import { CareersFastApplySection } from '../components/careers/CareersFastApplySection'
import { CareersApplyModal } from '../components/careers/CareersApplyModal'

export function CareersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState('')

  const handleOpenApply = (jobTitle: string) => {
    setSelectedJob(jobTitle)
    setIsModalOpen(true)
  }

  const handleCloseApply = () => {
    setIsModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-inter selection:bg-[#d95f00] selection:text-white">
      {/* Top Sticky Navbar */}
      <LandingNavbar />

      {/* Main Content Sections */}
      <main className="flex-1 w-full" id="main-content">
        <CareersHeroSection />
        <CareersCultureSection />
        <CareersJobListSection onApply={handleOpenApply} />
        <CareersProcessSection />
        <CareersFastApplySection />
      </main>

      {/* Recruitment Application Modal */}
      <CareersApplyModal
        isOpen={isModalOpen}
        jobTitle={selectedJob}
        onClose={handleCloseApply}
      />

      {/* Footer */}
      <LandingFooter />
    </div>
  )
}
