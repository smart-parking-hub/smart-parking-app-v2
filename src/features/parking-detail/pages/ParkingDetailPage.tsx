import { useState, useMemo } from 'react'
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
import { ParkingDetailEmptyState } from '../components/ParkingDetailEmptyState'
import { ParkingDetailErrorState } from '../components/ParkingDetailErrorState'

export function ParkingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const facilityId = id ? parseInt(id, 10) || 1 : 1

  const [isModalOpen, setIsModalOpen] = useState(false)

  // Fetch facility dossier with client caching
  const {
    data: facility,
    isLoading: isLoadingFacility,
    isError: isErrorFacility,
    error: facilityError,
    refetch: refetchFacility,
  } = useQuery({
    queryKey: ['parking-facility-detail', facilityId],
    queryFn: () => fetchFacilityDetail(facilityId),
    initialData: facilityId === 1 ? fallbackFacilityDetail : undefined,
    staleTime: 60000,
  })

  // Fetch driver reviews with initial fallback
  const { data: reviews = fallbackDriverReviews } = useQuery({
    queryKey: ['parking-driver-reviews', facilityId],
    queryFn: () => fetchDriverReviews(facilityId),
    initialData: fallbackDriverReviews,
    staleTime: 60000,
  })

  const dynamicCapacityCategories = useMemo(() => {
    if (!facility || facility.id === 1) return fallbackCapacityCategories
    const total = facility.totalCapacity || 100
    const avail = facility.totalAvailableSlots || 0
    const occupiedPercent = total > 0 ? Math.round(((total - avail) / total) * 100) : 0
    return [
      {
        id: 'cont40-45',
        categoryName: 'Xe Đầu Kéo & Container 40FT / 45FT',
        subDescription: 'Chiều dài ô đỗ 16.5m · Tải trục 40T · Sẵn dây cắm Reefer',
        highDemandLabel: avail < total * 0.2 ? `MẬT ĐỘ CAO ${occupiedPercent}%` : undefined,
        highDemandOccupiedPercent: occupiedPercent,
        availableSlots: Math.round(avail * 0.45),
        totalSlots: Math.round(total * 0.45),
        occupiedPercent,
        iconName: 'directions_boat',
      },
      {
        id: 'heavy-truck',
        categoryName: 'Xe Tải Nặng (trên 10 tấn - 3, 4 chân)',
        subDescription: 'Ô đỗ xe tải 12m · Tự do quay đầu bán kính 18m',
        availableSlots: Math.round(avail * 0.3),
        totalSlots: Math.round(total * 0.3),
        occupiedPercent,
        iconName: 'local_shipping',
      },
      {
        id: 'medium-truck',
        categoryName: 'Xe Tải Trung (3.5 - 10 tấn)',
        subDescription: 'Ô đỗ 8.5m · Lối ra thông thoáng',
        availableSlots: Math.max(0, avail - Math.round(avail * 0.45) - Math.round(avail * 0.3)),
        totalSlots: Math.max(0, total - Math.round(total * 0.45) - Math.round(total * 0.3)),
        occupiedPercent,
        iconName: 'local_shipping',
      },
    ]
  }, [facility])

  const dynamicReservationState = useMemo(() => {
    if (!facility || facility.id === 1) return fallbackReservationState
    return {
      ...fallbackReservationState,
      matchingSlotsCount: facility.totalAvailableSlots,
      suggestedBerth: `BERTH ${facility.code || 'GATE'}-${Math.max(1, Math.min(20, facility.totalAvailableSlots))}`,
    }
  }, [facility])

  // 1. Loading State
  if (isLoadingFacility && !facility) {
    return <ParkingDetailSkeleton />
  }

  // 2. Error State
  if (isErrorFacility) {
    return (
      <ParkingDetailErrorState
        errorMessage={
          facilityError instanceof Error
            ? facilityError.message
            : 'Không thể kết nối đến máy chủ điều phối bãi đỗ.'
        }
        onRetry={() => refetchFacility()}
      />
    )
  }

  // 3. Empty State
  if (!facility) {
    return <ParkingDetailEmptyState facilityId={facilityId} />
  }

  const currentFacility = facility

  return (
    <div className="w-full bg-[#f8f9ff] min-h-[calc(100vh-140px)]">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-6">
        <div className="flex flex-col w-full">
          {/* Top Breadcrumb Navigation & Realtime Status */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
            <Link
              to="/dashboard/search"
              className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 text-xs font-semibold transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#d95f00]" />
              <span>QUAY LẠI BẢN ĐỒ TÌM BÃI (/dashboard/search)</span>
            </Link>

            <div className="flex items-center gap-2 font-mono text-xs text-slate-600">
              <span className="w-2 h-2 rounded-full bg-[#d95f00] animate-pulse inline-block" />
              <span>
                CẬP NHẬT TRẠNG THÁI REALTIME:{' '}
                {currentFacility.id === 1 ? 'CÁT LÁI GATE 2' : (currentFacility.name?.toUpperCase() || 'CÁT LÁI GATE 2')}
              </span>
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
                categories={dynamicCapacityCategories}
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
              reservationState={dynamicReservationState}
              onOpenBookingModal={() => setIsModalOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Interactive 2-Step Booking Flow Modal (GAP-05 · SCR-MOD-07) */}
      <BookingPaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        facilityName={currentFacility.name || 'Tân Cảng Cát Lái - Gate 2'}
        facilityId={facilityId}
        reservationState={dynamicReservationState}
      />
    </div>
  )
}
