import { LandingNavbar } from '../components/common/LandingNavbar'
import { LandingFooter } from '../components/common/LandingFooter'
import { OwnerHeroSection } from '../components/owner-solutions/OwnerHeroSection'
import { OwnerPainPointsSection } from '../components/owner-solutions/OwnerPainPointsSection'
import { OwnerRoiCalculator } from '../components/owner-solutions/OwnerRoiCalculator'
import { OwnerMerchantFeaturesSection } from '../components/owner-solutions/OwnerMerchantFeaturesSection'
import { OwnerWorkflowSection } from '../components/owner-solutions/OwnerWorkflowSection'
import { OwnerTestimonialsSection } from '../components/owner-solutions/OwnerTestimonialsSection'
import { OwnerFaqSection } from '../components/owner-solutions/OwnerFaqSection'
import { OwnerOnboardingFormSection } from '../components/owner-solutions/OwnerOnboardingFormSection'

export function OwnerSolutionsPage() {
  return (
    <div className="min-h-screen bg-white font-inter text-slate-800 antialiased selection:bg-brand-orange selection:text-white">
      {/* 1. Sticky Navigation Bar */}
      <LandingNavbar />

      {/* Main Content Area */}
      <main className="w-full">
        <div className="flex flex-col w-full">
          {/* SECTION 1: HERO SECTION */}
          <OwnerHeroSection />

          {/* SECTION 2: 4 NỖI ĐAU CHỦ BÃI TRUYỀN THỐNG */}
          <OwnerPainPointsSection />

          {/* SECTION 3: BẢNG TÍNH LỢI NHUẬN TƯƠNG TÁC (ROI ESTIMATOR) */}
          <OwnerRoiCalculator />

          {/* SECTION 4: 5 TÍNH NĂNG NỀN TẢNG (MERCHANT SUITE) */}
          <OwnerMerchantFeaturesSection />

          {/* SECTION 5: QUY TRÌNH 4 BƯỚC TRIỂN KHAI */}
          <OwnerWorkflowSection />

          {/* SECTION 6: Ý KIẾN CHỦ BÃI THỰC TẾ */}
          <OwnerTestimonialsSection />

          {/* SECTION 7: SEO CONTENT & FAQ ACCORDION */}
          <OwnerFaqSection />

          {/* SECTION 8: BOTTOM CTA & REGISTRATION FORM */}
          <OwnerOnboardingFormSection />
        </div>
      </main>

      {/* 9. Organized 4-Column Footer */}
      <LandingFooter />
    </div>
  )
}
