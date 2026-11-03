import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'

import {
  fetchFacilityDetail,
  fetchDriverReviews,
  fallbackFacilityDetail,
  fallbackDriverReviews,
  fallbackCapacityCategories,
  fallbackPricingRules,
  fallbackAmenities,
  fallbackReservationState,
} from '../api/parkingDetailApi'
import { FacilityHeaderSection } from '../components/FacilityHeaderSection'
import { PhotoGallerySection } from '../components/PhotoGallerySection'
import { SlotCapacityMatrixSection } from '../components/SlotCapacityMatrixSection'
import { PricingRulesTableSection } from '../components/PricingRulesTableSection'
import { AmenitiesChecklistSection } from '../components/AmenitiesChecklistSection'
import { DriverReviewsSection } from '../components/DriverReviewsSection'
import { StickyReservationDesk } from '../components/StickyReservationDesk'
import { BookingPaymentModal } from '../components/BookingPaymentModal'
import { ParkingDetailSkeleton } from '../components/ParkingDetailSkeleton'

export function ParkingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const facilityId = id ? parseInt(id, 10) || 1 : 1

  const [isModalOpen, setIsModalOpen] = useState(false)

  // Fetch facility dossier with initial fallback
  const {
    data: facility = fallbackFacilityDetail,
    isLoading: isLoadingFacility,
  } = useQuery({
    queryKey: ['parking-facility-detail', facilityId],
    queryFn: () => fetchFacilityDetail(facilityId),
    initialData: fallbackFacilityDetail,
    staleTime: 30000,
  })

  // Fetch driver reviews with initial fallback
  const {
    data: reviews = fallbackDriverReviews,
  } = useQuery({
    queryKey: ['parking-driver-reviews', facilityId],
    queryFn: () => fetchDriverReviews(facilityId),
    initialData: fallbackDriverReviews,
    staleTime: 30000,
  })

  if (isLoadingFacility && !facility) {
    return <ParkingDetailSkeleton />
  }

  const currentFacility = facility

  return (
    <div className="w-full bg-[#f8f9ff] min-h-[calc(100vh-140px)]">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-6">
        <div className="flex flex-col w-full">
          {/* Top Breadcrumb Navigation & Realtime Status */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
            <Link
              to="/parking"
              className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 text-xs font-semibold transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#d95f00]" />
              <span>QUAY LẠI BẢN ĐỒ TÌM BÃI (/parking)</span>
            </Link>

            <div className="flex items-center gap-2 font-mono text-xs text-slate-600">
              <span className="w-2 h-2 rounded-full bg-[#d95f00] animate-pulse inline-block" />
              <span>CẬP NHẬT TRẠNG THÁI REALTIME: CÁT LÁI GATE 2</span>
            </div>
          </div>

          {/* Primary Asymmetric Two-Column Grid (65% Facility Dossier / 35% Reservation Desk) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: 65% (8 cols) Main Facility Dossier */}
            <div className="lg:col-span-8 flex flex-col gap-6 min-w-0">
              {/* 1. Facility Header */}
              <FacilityHeaderSection facility={currentFacility} />

              {/* 2. Photo Inspection Gallery */}
              <PhotoGallerySection />

              {/* 3. Live Slot Capacity Matrix */}
              <SlotCapacityMatrixSection
                categories={fallbackCapacityCategories}
                totalAvailable={currentFacility.totalAvailableSlots}
                totalCapacity={currentFacility.totalCapacity}
                totalAreaM2={currentFacility.totalAreaM2}
                lastUpdatedSecondsAgo={currentFacility.lastUpdatedSecondsAgo}
              />

              {/* 4. Transparent Pricing Rules */}
              <PricingRulesTableSection pricingRules={fallbackPricingRules} />

              {/* 5. Amenities Checklist */}
              <AmenitiesChecklistSection amenities={fallbackAmenities} />

              {/* 6. Driver Community Reviews */}
              <DriverReviewsSection
                reviews={reviews}
                totalReviewsCount={currentFacility.reviewCount}
              />
            </div>

            {/* RIGHT COLUMN: 35% (4 cols) Sticky Reservation Desk */}
            <StickyReservationDesk
              reservationState={fallbackReservationState}
              onOpenBookingModal={() => setIsModalOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Interactive Booking Flow Modal */}
      <BookingPaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        facilityName="Tân Cảng Cát Lái - Gate 2"
        reservationState={fallbackReservationState}
      />
    </div>
  )
}
