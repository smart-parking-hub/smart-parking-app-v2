import { useState } from 'react'
import { LandingNavbar } from '../components/common/LandingNavbar'
import { LandingFooter } from '../components/common/LandingFooter'
import { OwnerHeroSection } from '../components/owner-solutions/OwnerHeroSection'
import { OwnerPainPointsSection } from '../components/owner-solutions/OwnerPainPointsSection'
import { OwnerRoiCalculator } from '../components/owner-solutions/OwnerRoiCalculator'
import { OwnerMerchantFeaturesSection } from '../components/owner-solutions/OwnerMerchantFeaturesSection'
import { OwnerWorkflowSection } from '../components/owner-solutions/OwnerWorkflowSection'
import { OwnerLiveTelemetrySection } from '../components/owner-solutions/OwnerLiveTelemetrySection'
import { OwnerTestimonialsSection } from '../components/owner-solutions/OwnerTestimonialsSection'
import { OwnerFaqSection } from '../components/owner-solutions/OwnerFaqSection'
import { OwnerOnboardingFormSection } from '../components/owner-solutions/OwnerOnboardingFormSection'
import { OwnerLeadModal } from '../components/owner-solutions/OwnerLeadModal'
import { LandingLayout } from '@/layouts/LandingLayout'

export interface OwnerSolutionsPageProps {
  withLayout?: boolean
  simulateLoading?: boolean
  simulateEmpty?: boolean
  simulateError?: boolean
}

export function OwnerSolutionsPage({
  withLayout = false,
  simulateLoading,
  simulateEmpty,
  simulateError,
}: OwnerSolutionsPageProps = {}) {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false)

  const pageContent = (
    <div className="flex flex-col w-full">
      {/* SECTION 1: HERO SECTION */}
      <OwnerHeroSection onOpenLeadModal={() => setIsLeadModalOpen(true)} />

      {/* SECTION 2: 4 NỖI ĐAU CHỦ BÃI TRUYỀN THỐNG */}
      <OwnerPainPointsSection />

      {/* SECTION 3: BẢNG TÍNH LỢI NHUẬN TƯƠNG TÁC (ROI ESTIMATOR) */}
      <OwnerRoiCalculator />

      {/* SECTION 4: 5 TÍNH NĂNG NỀN TẢNG (MERCHANT SUITE) */}
      <OwnerMerchantFeaturesSection />

      {/* SECTION 5: QUY TRÌNH 4 BƯỚC TRIỂN KHAI */}
      <OwnerWorkflowSection />

      {/* SECTION 6: GIÁM SÁT MẪU BÃI THỰC ĐỊA REAL-TIME (TanStack Query Telemetry + 4 UI States) */}
      <OwnerLiveTelemetrySection
        onRegisterClick={() => setIsLeadModalOpen(true)}
        simulateLoading={simulateLoading}
        simulateEmpty={simulateEmpty}
        simulateError={simulateError}
      />

      {/* SECTION 7: Ý KIẾN CHỦ BÃI THỰC TẾ */}
      <OwnerTestimonialsSection />

      {/* SECTION 8: SEO CONTENT & FAQ ACCORDION */}
      <OwnerFaqSection />

      {/* SECTION 9: BOTTOM CTA & REGISTRATION FORM */}
      <OwnerOnboardingFormSection onSuccessSubmit={() => {}} />

      {/* MODAL ĐĂNG KÝ KHẢO SÁT MẶT BẰNG NHANH */}
      <OwnerLeadModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        initialLocation="Cụm cảng Cát Lái - Phú Hữu, TP. Thủ Đức"
      />
    </div>
  )

  if (withLayout) {
    return <LandingLayout>{pageContent}</LandingLayout>
  }

  return (
    <div className="min-h-screen bg-white font-inter text-slate-800 antialiased selection:bg-brand-orange selection:text-white">
      {/* 1. Sticky Navigation Bar */}
      <LandingNavbar />

      {/* Main Content Area */}
      <main className="w-full">
        {pageContent}
      </main>

      {/* 9. Organized 4-Column Footer */}
      <LandingFooter />
    </div>
  )
}

export default OwnerSolutionsPage
