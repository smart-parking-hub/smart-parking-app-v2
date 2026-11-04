import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AlertCircle, RefreshCw, CheckCircle2, X } from 'lucide-react'
import {
  fetchMerchantParkingLotDetail,
  uploadAdditionalLotImages,
} from '../api/merchantParkingLotApi'
import type { MerchantParkingLotDetailData } from '../types/merchantParkingLotTypes'
import {
  MerchantLotDetailHeader,
  MerchantLotStatusBanners,
  MerchantLotBentoMetrics,
  MerchantLotGallery,
  MerchantLotCapacitySection,
  MerchantLotPricingSection,
  MerchantLotLiveVehiclesTable,
  MerchantLotGpsGuideCard,
  MerchantLotAmenitiesCard,
  MerchantLotEmergencyContactCard,
  MerchantLotDetailSkeleton,
} from '../components/detail'

export function MerchantParkingLotDetailPage() {
  const { parkingLotId } = useParams()
  const navigate = useNavigate()
  const id = Number(parkingLotId) || 1

  const [lot, setLot] = useState<MerchantParkingLotDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string>()
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(undefined)

    try {
      const data = await fetchMerchantParkingLotDetail(id)
      setLot(data)
    } catch {
      setError('Không thể tải thông tin hồ sơ bãi đỗ xe. Vui lòng kiểm tra lại kết nối mạng.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const handleUploadImages = async (files: File[]) => {
    if (!lot) return
    setUploading(true)

    try {
      const newImages = await uploadAdditionalLotImages(lot.id, files)
      setLot((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          galleryImages: [...prev.galleryImages, ...newImages],
        }
      })
      setToastMessage(`Đã tải lên thành công ${files.length} ảnh hạ tầng thực tế.`)
      setTimeout(() => setToastMessage(null), 4000)
    } catch {
      setToastMessage('Có lỗi xảy ra khi tải ảnh lên máy chủ. Vui lòng thử lại.')
      setTimeout(() => setToastMessage(null), 4000)
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return <MerchantLotDetailSkeleton />
  }

  if (error || !lot) {
    return (
      <main className="w-full bg-[#f8f9ff] min-h-screen py-12 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-slate-200 text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="font-sora text-lg sm:text-xl font-bold text-[#0d1c2e] mb-2">
            Không tìm thấy hồ sơ bãi đỗ xe
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mb-6 max-w-md">
            {error || 'Mã cơ sở không tồn tại trong hệ thống hoặc bạn không có quyền truy cập.'}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/merchant/parking-lots')}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0d1c2e] font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Quay lại danh sách bãi
            </button>
            <button
              type="button"
              onClick={() => void loadData()}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#d95f00] hover:bg-[#b84e00] text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-xs"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Thử lại</span>
            </button>
          </div>
        </div>
      </main>
    )
  }

  const canConfigure = lot.status === 'APPROVED' && (lot.ownershipVerified !== false)
  const ownershipVerified = lot.ownershipVerified ?? true

  return (
    <main className="w-full bg-[#f8f9ff] min-h-screen pb-16">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#060D1A] text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-2 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        {/* 1. Header & Action Breadcrumb Bar */}
        <MerchantLotDetailHeader
          lot={lot}
          canConfigure={canConfigure}
          ownershipVerified={ownershipVerified}
        />

        {/* 2. Status & Compliance Banners (if any) */}
        <MerchantLotStatusBanners lot={lot} ownershipVerified={ownershipVerified} />

        {/* 3. Bento Grid: 4 Lot Performance Metrics */}
        <MerchantLotBentoMetrics lot={lot} />

        {/* 4. Core 2-Column Architecture (68% Left : 32% Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN (68% ~ col-span-8) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Gallery with Lightbox */}
            <MerchantLotGallery
              images={lot.galleryImages}
              onUploadImages={handleUploadImages}
              uploading={uploading}
              disabled={!ownershipVerified}
            />

            {/* Capacity & Slot Allocation */}
            <MerchantLotCapacitySection
              lotId={lot.id}
              slots={lot.slotsDetailed}
              canConfigure={canConfigure}
            />

            {/* Pricing Matrix */}
            <MerchantLotPricingSection
              lotId={lot.id}
              pricing={lot.pricingMatrix}
              canConfigure={canConfigure}
            />

            {/* Live Telemetry Table */}
            <MerchantLotLiveVehiclesTable lotId={lot.id} vehicles={lot.activeVehicles} />
          </div>

          {/* RIGHT COLUMN (32% ~ col-span-4) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* GPS & Navigation */}
            <MerchantLotGpsGuideCard
              operationalProfile={lot.operationalProfile}
              lotName={lot.name}
            />

            {/* Amenities Checklist */}
            <MerchantLotAmenitiesCard />

            {/* Emergency & Hotline Card */}
            <MerchantLotEmergencyContactCard operationalProfile={lot.operationalProfile} />
          </div>
        </div>
      </div>
    </main>
  )
}
