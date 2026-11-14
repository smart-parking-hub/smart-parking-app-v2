import { useState, useMemo, useEffect, useCallback } from 'react'
import './MerchantSlotsPage.css'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, AlertCircle, X } from 'lucide-react'

import {
  vehicleNames,
  fetchMerchantLotSimpleInfo,
  fetchMerchantLotSlots,
  updateMerchantLotSlotsBulk,
} from '../api/merchantSlotsApi'
import type {
  BulkSlotConfigRequest,
  SlotKpiMetrics,
  SlotMatrixItem,
  VehicleType,
} from '../types/merchantSlotsTypes'
import {
  MerchantSlotsHeader,
  MerchantSlotsInvariantBanner,
  MerchantSlotsKpiSection,
  MerchantSlotMatrixGrid,
  MerchantSlotsStickyFooter,
  MerchantSlotsSkeleton,
  ConfirmDecreaseModal,
} from '../components'

const emptySlots: SlotMatrixItem[] = []

interface ToastState {
  id: number
  message: string
  isError: boolean
}

export function MerchantSlotsPage() {
  const { parkingLotId } = useParams<{ parkingLotId: string }>()
  const lotId = Number(parkingLotId)
  const validLotId = Number.isSafeInteger(lotId) && lotId > 0
  const queryClient = useQueryClient()

  // 1. Fetch Lot Info & Slots Data
  const { data: lotInfo, isLoading: loadingLot, isError: lotError, refetch: retryLot } = useQuery({
    queryKey: ['merchant-lot-simple', lotId],
    queryFn: () => fetchMerchantLotSimpleInfo(lotId),
    staleTime: 60000,
    enabled: validLotId,
  })

  const { data: serverSlots = emptySlots, isLoading: loadingSlots, isError: slotsError, refetch: retrySlots } = useQuery({
    queryKey: ['merchant-lot-slots', lotId],
    queryFn: () => fetchMerchantLotSlots(lotId),
    staleTime: 60000,
    enabled: validLotId,
  })

  // 2. Drafts state for in-memory editing
  const [drafts, setDrafts] = useState<Record<VehicleType, number>>({} as Record<VehicleType, number>)
  const [addedTypes, setAddedTypes] = useState<VehicleType[]>([])
  const slots = useMemo(() => [
    ...serverSlots,
    ...addedTypes.filter((type) => !serverSlots.some((slot) => slot.vehicleType === type)).map((vehicleType) => ({
      vehicleType,
      typeNameVi: vehicleNames[vehicleType],
      totalCapacity: 0,
      availableCapacity: 0,
      occupiedCapacity: 0,
    })),
  ], [serverSlots, addedTypes])
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
    const initialDrafts: Record<VehicleType, number> = {} as Record<VehicleType, number>
    serverSlots.forEach((s) => {
      initialDrafts[s.vehicleType] = s.totalCapacity
    })
    setDrafts(initialDrafts)
  }, [serverSlots])

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

  // Check state changes & decrease
  const hasChanges = useMemo(() => {
    return addedTypes.length > 0 || slots.some(
      (slot) => (drafts[slot.vehicleType] ?? slot.totalCapacity) !== slot.totalCapacity,
    )
  }, [slots, drafts, addedTypes])

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
      void queryClient.invalidateQueries({ queryKey: ['merchant-owned-parking-lots'] })
      void queryClient.invalidateQueries({ queryKey: ['merchant-lot-detail', String(lotId)] })
      const newDrafts: Record<VehicleType, number> = {} as Record<VehicleType, number>
      updatedSlots.forEach((s) => {
        newDrafts[s.vehicleType] = s.totalCapacity
      })
      setDrafts(newDrafts)
      setAddedTypes([])
      setConfirmModalOpen(false)
      showToast(
        'Lưu cấu hình sức chứa thành công!',
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
        } nhỏ hơn ${occupied} chỗ đã sử dụng!`,
        true,
      )
      return
    }

    setDrafts((prev) => ({ ...prev, [vehicleType]: nextVal }))
  }

  const handleResetToOrigin = () => {
    const originalDrafts: Record<VehicleType, number> = {} as Record<VehicleType, number>
    serverSlots.forEach((s) => {
      originalDrafts[s.vehicleType] = s.totalCapacity
    })
    setDrafts(originalDrafts)
    setAddedTypes([])
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
          `Khóa bất biến vi phạm: Loại xe ${slot.typeNameVi} có ${slot.occupiedCapacity} chỗ đã sử dụng!`,
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

  if (!validLotId || lotError || slotsError) {
    return <div className="merchant-slots"><div className="slots-error" role="alert"><AlertCircle size={28} /><h1>Không tải được dữ liệu bãi đỗ</h1><p>{!validLotId ? 'Mã bãi đỗ không hợp lệ.' : 'Vui lòng kiểm tra kết nối và thử lại.'}</p>{validLotId && <button type="button" onClick={() => { void retryLot(); void retrySlots() }}>Thử lại</button>}</div></div>
  }
  if (loadingLot || loadingSlots) {
    return <MerchantSlotsSkeleton />
  }

  return (
    <div className="merchant-slots">
      {/* Toast floating notices */}
      <div className="fixed top-20 right-4 sm:right-6 z-[100] flex flex-col gap-2.5 max-w-sm sm:max-w-md pointer-events-none w-[calc(100%-2rem)] sm:w-auto">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role={toast.isError ? 'alert' : 'status'}
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
              aria-label="Đóng thông báo"
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="ml-2 text-white/60 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Main Container */}
      <div className="slots-container">
        {/* Section 1: Header & Quick Navigations */}
        {lotInfo && <MerchantSlotsHeader lotInfo={lotInfo} />}

        {/* Section 1.5: Invariant Protection Banner */}
        <MerchantSlotsInvariantBanner isLocked={isLocked} status={lotInfo?.status} />

        {/* Section 2: Real-time Facility Capacity KPIs */}
        <MerchantSlotsKpiSection metrics={metrics} />

        {/* Vehicle categories configured for this lot */}
        <MerchantSlotMatrixGrid
          slots={slots}
          drafts={drafts}
          onAddType={(type) => {
            if (isLocked || saveMutation.isPending || slots.some((slot) => slot.vehicleType === type)) return
            setAddedTypes((prev) => [...prev, type])
            setDrafts((prev) => ({ ...prev, [type]: 0 }))
          }}
          onRemoveType={(type) => {
            if (isLocked || saveMutation.isPending || !addedTypes.includes(type)) return
            setAddedTypes((prev) => prev.filter((item) => item !== type))
            setDrafts((prev) => {
              const next = { ...prev }
              delete next[type]
              return next
            })
            requestAnimationFrame(() => document.getElementById('new-slot-vehicle')?.focus())
          }}
          onChangeDraft={handleDraftChange}
          onViolation={(msg) => showToast(msg, true)}
          disabled={isLocked || saveMutation.isPending}
        />

        <MerchantSlotsStickyFooter
          hasChanges={hasChanges}
          isSaving={saveMutation.isPending}
          isLocked={isLocked}
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
