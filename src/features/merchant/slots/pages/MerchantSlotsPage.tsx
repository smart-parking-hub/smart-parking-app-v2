import { useState, useMemo, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, AlertCircle, X } from 'lucide-react'

import {
  fetchMerchantLotSimpleInfo,
  fetchMerchantLotSlots,
  updateMerchantLotSlotsBulk,
} from '../api/merchantSlotsApi'
import type {
  BulkSlotConfigRequest,
  SlotKpiMetrics,
  VehicleType,
} from '../types/merchantSlotsTypes'
import {
  MerchantSlotsHeader,
  MerchantSlotsInvariantBanner,
  MerchantSlotsKpiSection,
  MerchantSlotMatrixGrid,
  MerchantSlotWeightCalculator,
  MerchantSlotVirtualQueueCard,
  MerchantSlotVisualContext,
  MerchantSlotsStickyFooter,
  MerchantSlotsSkeleton,
  ConfirmDecreaseModal,
} from '../components'

interface ToastState {
  id: number
  message: string
  isError: boolean
}

export function MerchantSlotsPage() {
  const { parkingLotId } = useParams<{ parkingLotId: string }>()
  const lotId = Number(parkingLotId) || 1
  const queryClient = useQueryClient()

  // 1. Fetch Lot Info & Slots Data
  const { data: lotInfo, isLoading: loadingLot } = useQuery({
    queryKey: ['merchant-lot-simple', lotId],
    queryFn: () => fetchMerchantLotSimpleInfo(lotId),
    staleTime: 60000,
  })

  const { data: slots = [], isLoading: loadingSlots } = useQuery({
    queryKey: ['merchant-lot-slots', lotId],
    queryFn: () => fetchMerchantLotSlots(lotId),
    staleTime: 60000,
  })

  // 2. Drafts state for in-memory editing
  const [drafts, setDrafts] = useState<Record<VehicleType, number>>({} as Record<VehicleType, number>)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [toasts, setToasts] = useState<ToastState[]>([])

  // Helper toast notification
  const showToast = useCallback((message: string, isError = false) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, isError }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  // Sync drafts when slots data is fetched
  useEffect(() => {
    if (slots.length > 0) {
      const initialDrafts: Record<VehicleType, number> = {} as Record<VehicleType, number>
      slots.forEach((s) => {
        initialDrafts[s.vehicleType] = s.totalCapacity
      })
      setDrafts(initialDrafts)
    }
  }, [slots])

  // 3. Invariants & Dynamic KPIs Recalculation
  const metrics: SlotKpiMetrics = useMemo(() => {
    let totalCap = 0
    let totalOcc = 0

    slots.forEach((slot) => {
      const draftCap = drafts[slot.vehicleType] ?? slot.totalCapacity
      totalCap += draftCap
      totalOcc += slot.occupiedCapacity
    })

    const totalAvail = Math.max(0, totalCap - totalOcc)
    const pct = totalCap > 0 ? (totalOcc / totalCap) * 100 : 0
    const alertStatus: 'NORMAL' | 'NEAR_FULL' | 'FULL' =
      pct >= 100 ? 'FULL' : pct >= 85 ? 'NEAR_FULL' : 'NORMAL'

    return {
      totalCapacity: totalCap,
      totalOccupied: totalOcc,
      totalAvailable: totalAvail,
      occupancyPercent: pct,
      alertStatus,
    }
  }, [slots, drafts])

  // Surface Weight calculation
  const calculatedWeightTonnage = useMemo(() => {
    // Estimations: Container = 40T, Heavy = 28T, Light = 10T, Bus = 12T, Sedan = 2T
    let tonnage = 0
    slots.forEach((slot) => {
      const occ = slot.occupiedCapacity
      if (slot.vehicleType === 'CONTAINER') tonnage += occ * 40
      else if (slot.vehicleType === 'HEAVY_TRUCK') tonnage += occ * 28
      else if (slot.vehicleType === 'LIGHT_TRUCK') tonnage += occ * 10
      else if (slot.vehicleType === 'BUS_COACH') tonnage += occ * 12
      else tonnage += occ * 2
    })
    return Math.max(4120, tonnage)
  }, [slots])

  // Check state changes & decrease
  const hasChanges = useMemo(() => {
    return slots.some(
      (slot) => (drafts[slot.vehicleType] ?? slot.totalCapacity) !== slot.totalCapacity,
    )
  }, [slots, drafts])

  const hasDecrease = useMemo(() => {
    return slots.some((slot) => {
      const nextVal = drafts[slot.vehicleType] ?? slot.totalCapacity
      return nextVal < slot.totalCapacity
    })
  }, [slots, drafts])

  const isLocked = Boolean(
    lotInfo && (lotInfo.status === 'REJECTED' || lotInfo.status === 'SUSPENDED'),
  )

  // 4. Mutation Bulk Save
  const saveMutation = useMutation({
    mutationFn: (payload: BulkSlotConfigRequest) =>
      updateMerchantLotSlotsBulk(lotId, payload),
    onSuccess: (updatedSlots) => {
      queryClient.setQueryData(['merchant-lot-slots', lotId], updatedSlots)
      const newDrafts: Record<VehicleType, number> = {} as Record<VehicleType, number>
      updatedSlots.forEach((s) => {
        newDrafts[s.vehicleType] = s.totalCapacity
      })
      setDrafts(newDrafts)
      setConfirmModalOpen(false)
      showToast(
        'Lưu cấu hình sức chứa thành công! Đã gửi PUT /api/v1/merchant/parking-lots/slots/bulk (200 OK)',
      )
    },
    onError: (err: unknown) => {
      const errMsg =
        err instanceof Error ? err.message : 'Có lỗi xảy ra khi lưu cấu hình sức chứa!'
      showToast(errMsg, true)
    },
  })

  // Handlers
  const handleDraftChange = (vehicleType: VehicleType, nextVal: number) => {
    const currentSlot = slots.find((s) => s.vehicleType === vehicleType)
    const occupied = currentSlot ? currentSlot.occupiedCapacity : 0

    if (nextVal < occupied) {
      setDrafts((prev) => ({ ...prev, [vehicleType]: occupied }))
      showToast(
        `Ràng buộc bất biến: Không thể giảm sức chứa của ${
          currentSlot?.typeNameVi || vehicleType
        } nhỏ hơn ${occupied} xe đang đỗ thực tế!`,
        true,
      )
      return
    }

    setDrafts((prev) => ({ ...prev, [vehicleType]: nextVal }))
  }

  const handleResetToOrigin = () => {
    const originalDrafts: Record<VehicleType, number> = {} as Record<VehicleType, number>
    slots.forEach((s) => {
      originalDrafts[s.vehicleType] = s.totalCapacity
    })
    setDrafts(originalDrafts)
    showToast('Đã khôi phục ma trận sức chứa về thông số ban đầu.')
  }

  const handleSaveClick = () => { if (saveMutation.isPending) return
    if (isLocked) {
      showToast('Bãi đỗ đang bị khóa hoặc chưa được phê duyệt!', true)
      return
    }

    // Validate invariant for all slots
    for (const slot of slots) {
      const nextVal = drafts[slot.vehicleType] ?? slot.totalCapacity
      if (nextVal < slot.occupiedCapacity) {
        showToast(
          `Khóa bất biến vi phạm: Loại xe ${slot.typeNameVi} có ${slot.occupiedCapacity} xe đang đỗ!`,
          true,
        )
        return
      }
    }

    if (!hasChanges) {
      showToast('Dữ liệu sức chứa không có thay đổi nào.')
      return
    }

    if (hasDecrease) {
      setConfirmModalOpen(true)
      return
    }

    executeBulkSave()
  }

  const executeBulkSave = () => { if (saveMutation.isPending) return
    const payload: BulkSlotConfigRequest = {
      slots: slots.map((s) => ({
        vehicleType: s.vehicleType,
        totalCapacity: drafts[s.vehicleType] ?? s.totalCapacity,
      })),
    }
    saveMutation.mutate(payload)
  }

  if (loadingLot || loadingSlots) {
    return <MerchantSlotsSkeleton />
  }

  return (
    <div className="w-full min-h-screen bg-[#f8f9ff] flex flex-col">
      {/* Toast floating notices */}
      <div className="fixed top-20 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-xl shadow-xl text-white text-xs font-semibold flex items-center gap-2.5 transition-all transform duration-300 pointer-events-auto border ${
              toast.isError
                ? 'bg-[#ba1a1a] border-red-400 text-white'
                : 'bg-[#131b2e] border-slate-700 text-white'
            }`}
          >
            {toast.isError ? (
              <AlertCircle className="w-4 h-4 text-red-200 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="ml-2 text-white/60 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Main Container */}
      <div className="w-full max-w-[1280px] mx-auto px-4 lg:px-8 py-6 flex flex-col gap-6">
        {/* Section 1: Header & Quick Navigations */}
        {lotInfo && <MerchantSlotsHeader lotInfo={lotInfo} />}

        {/* Section 1.5: Invariant Protection Banner */}
        <MerchantSlotsInvariantBanner isLocked={isLocked} status={lotInfo?.status} />

        {/* Section 2: Real-time Facility Capacity KPIs */}
        <MerchantSlotsKpiSection metrics={metrics} />

        {/* Section 3: Slot Capacity Matrix - 5 Standard Vehicle Categories */}
        <MerchantSlotMatrixGrid
          slots={slots}
          drafts={drafts}
          onChangeDraft={handleDraftChange}
          onViolation={(msg) => showToast(msg, true)}
          disabled={isLocked || saveMutation.isPending}
        />

        {/* Section 4: Surface Weight Calculator & Real-time Queue Integration */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8">
            <MerchantSlotWeightCalculator
              currentLoadedTonnage={calculatedWeightTonnage}
              maxDesignTonnage={4800}
              totalOccupied={metrics.totalOccupied}
            />
          </div>
          <div className="lg:col-span-4">
            <MerchantSlotVirtualQueueCard
              isQueueActive={metrics.totalAvailable === 0}
              activeVehicleTypeName="TRUCK_HEAVY"
            />
          </div>
        </section>

        {/* Section 5: Operational Visuals (Terminal Map & ALPR System) */}
        <MerchantSlotVisualContext />

        {/* Section 6: Bulk Save Sticky Action Dock */}
        <MerchantSlotsStickyFooter
          hasChanges={hasChanges}
          isSaving={saveMutation.isPending}
          isLocked={isLocked}
          lotCode={lotInfo?.code || 'VN-SGN-CLG2-09'}
          onReset={handleResetToOrigin}
          onSave={handleSaveClick}
        />
      </div>

      {/* Confirm Decrease Modal */}
      <ConfirmDecreaseModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={executeBulkSave}
        slots={slots}
        drafts={drafts}
        isSaving={saveMutation.isPending}
      />
    </div>
  )
}
