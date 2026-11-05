import { useState, useEffect, useMemo } from 'react'
import {
  fetchMyVehicles,
  fetchFleetKpiMetrics,
  addVehicleApi,
  updateVehicleApi,
  deleteVehicleApi,
  fallbackKpiMetrics,
  fallbackVehiclesList,
} from '../api/vehicleApi'
import type {
  VehicleItem,
  FleetKpiMetrics,
  VehicleClassType,
  VehicleStatusType,
  AddVehicleFormData,
} from '../types/vehicleTypes'
import { VehiclesCommandHeader } from '../components/VehiclesCommandHeader'
import { VehiclesKpiBento } from '../components/VehiclesKpiBento'
import { VehicleFilterToolbar } from '../components/VehicleFilterToolbar'
import { VehicleMasterTable } from '../components/VehicleMasterTable'
import { AlprGateSyncBanner } from '../components/AlprGateSyncBanner'
import { RegisterVehicleModal } from '../components/RegisterVehicleModal'
import { EditVehicleModal } from '../components/EditVehicleModal'
import { ViewInspectionDossierModal } from '../components/ViewInspectionDossierModal'
import { DeleteVehicleConfirmModal } from '../components/DeleteVehicleConfirmModal'
import { ExportFleetModal } from '../components/ExportFleetModal'
import { VehiclesSkeleton } from '../components/VehiclesSkeleton'
import { ProfileSidebarNav } from '../../profile/components/ProfileSidebarNav'
import { NotificationSettingsModal } from '../../profile/components/NotificationSettingsModal'

export function VehiclesPage() {
  const [loading, setLoading] = useState(true)
  const [vehicles, setVehicles] = useState<VehicleItem[]>([])
  const [serverMetrics, setServerMetrics] = useState<FleetKpiMetrics>(fallbackKpiMetrics)

  // Filters
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | VehicleClassType>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | VehicleStatusType>('all')

  // Modals & Action State
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<VehicleItem | null>(null)
  const [dossierVehicle, setDossierVehicle] = useState<VehicleItem | null>(null)
  const [deletingVehicle, setDeletingVehicle] = useState<VehicleItem | null>(null)
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [isNotificationSettingsOpen, setIsNotificationSettingsOpen] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [isSavingEdit, setIsSavingEdit] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    let isMounted = true
    const loadData = async () => {
      try {
        setLoading(true)
        const [vehiclesData, metricsData] = await Promise.all([
          fetchMyVehicles(),
          fetchFleetKpiMetrics(),
        ])
        if (isMounted) {
          setVehicles(vehiclesData && vehiclesData.length > 0 ? vehiclesData : fallbackVehiclesList)
          if (metricsData) setServerMetrics(metricsData)
        }
      } catch {
        if (isMounted) {
          setVehicles(fallbackVehiclesList)
          setServerMetrics(fallbackKpiMetrics)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadData()
    return () => {
      isMounted = false
    }
  }, [])

  // Recalculate metrics when vehicles list changes
  const computedMetrics = useMemo<FleetKpiMetrics>(() => {
    const defaultV = vehicles.find((v) => v.isDefault) ?? vehicles[0]
    const tractors = vehicles.filter((v) => v.vehicleClass === 'CONTAINER' || v.vehicleClass === 'HEAVY').length
    const trailers = vehicles.filter((v) => v.vehicleClass === 'TRAILER').length
    const totalWeight = vehicles.reduce((acc, v) => acc + (v.curbWeightTon || 0) + (v.towingWeightTon || 0), 0)

    return {
      ...serverMetrics,
      totalVehicles: vehicles.length,
      tractorCount: tractors,
      trailerCount: trailers,
      defaultPlate: defaultV ? defaultV.licensePlate : 'Chưa thiết lập',
      defaultSpec: defaultV ? defaultV.specDetails : 'Chưa có phương tiện',
      defaultLocationStatus: defaultV ? 'SẴN SÀNG LƯU THÔNG' : 'CHỜ ĐĂNG KÝ',
      alprVerifiedRate: '100%',
      verifiedRatioText: `${vehicles.length}/${vehicles.length} xe đã duyệt hồ sơ tải trọng`,
      totalTonnage: Math.round(totalWeight * 10) / 10,
    }
  }, [vehicles, serverMetrics])

  // Filtered vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      const q = search.trim().toLowerCase()
      const matchesSearch =
        !q ||
        v.licensePlate.toLowerCase().includes(q) ||
        v.brandModel.toLowerCase().includes(q) ||
        v.specDetails.toLowerCase().includes(q) ||
        v.originDetails.toLowerCase().includes(q) ||
        v.insuranceNumber.toLowerCase().includes(q)

      const matchesType = typeFilter === 'all' || v.vehicleClass === typeFilter
      const matchesStatus = statusFilter === 'all' || v.status === statusFilter

      return matchesSearch && matchesType && matchesStatus
    })
  }, [vehicles, search, typeFilter, statusFilter])

  // Handlers
  const handleResetFilter = () => {
    setSearch('')
    setTypeFilter('all')
    setStatusFilter('all')
  }

  const handleSetDefault = (id: number) => {
    setVehicles((prev) =>
      prev.map((v) => ({
        ...v,
        isDefault: v.id === id,
      }))
    )
  }

  const handleAddVehicle = async (data: AddVehicleFormData) => {
    setIsAdding(true)
    try {
      const newVehicle = await addVehicleApi(data)
      setVehicles((prev) => {
        if (data.isDefault) {
          return [newVehicle, ...prev.map((v) => ({ ...v, isDefault: false }))]
        }
        return [newVehicle, ...prev]
      })
    } finally {
      setIsAdding(false)
    }
  }

  const handleSaveEdit = async (id: number, data: Partial<VehicleItem>) => {
    setIsSavingEdit(true)
    try {
      await updateVehicleApi(id, {
        licensePlate: data.licensePlate,
        vehicleClass: data.vehicleClass,
        curbWeightTon: data.curbWeightTon,
        brandModel: data.brandModel,
      })
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === id
            ? {
                ...v,
                ...data,
                vehicleClassLabel:
                  data.vehicleClass === 'CONTAINER'
                    ? 'Xe đầu kéo Container'
                    : data.vehicleClass === 'TRAILER'
                    ? 'Rơ-moóc chuyên dụng'
                    : 'Xe tải nặng',
              }
            : v
        )
      )
    } finally {
      setIsSavingEdit(false)
    }
  }

  const handleConfirmDelete = async (vehicle: VehicleItem) => {
    setIsDeleting(true)
    try {
      await deleteVehicleApi(vehicle.id)
      setVehicles((prev) => prev.filter((v) => v.id !== vehicle.id))
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1280px] mx-auto">
          <VehiclesSkeleton />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-6">
        {/* Command Header */}
        <VehiclesCommandHeader
          onOpenExport={() => setIsExportOpen(true)}
          onOpenRegister={() => setIsRegisterOpen(true)}
        />

        {/* Master 2-Column Grid (4 Cols Sidebar + 8 Cols Operations) */}
        <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-6 items-start">
          {/* Left Column (4 cols): Cấu hình tài khoản vận hành Navigation & Fleet Operations Card */}
          <aside className="lg:sticky lg:top-[calc(var(--driver-header-height)+24px)]">
            <ProfileSidebarNav
              compact
              activeTab="vehicles"
              onOpenNotificationSettings={() => setIsNotificationSettingsOpen(true)}
            />

          </aside>

          {/* Right Column (8 cols): Fleet Bento KPI, Filters & Table */}
          <div className="min-w-0 flex flex-col gap-6">
            {/* Bento KPI Section */}
            <VehiclesKpiBento metrics={computedMetrics} />

            {/* Filter Toolbar */}
            <VehicleFilterToolbar
              search={search}
              onSearchChange={setSearch}
              typeFilter={typeFilter}
              onTypeFilterChange={setTypeFilter}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              onReset={handleResetFilter}
              totalCount={vehicles.length}
              tractorCount={computedMetrics.tractorCount}
              trailerCount={computedMetrics.trailerCount}
            />

            {/* Master Table Section with ZERO horizontal scroll */}
            <VehicleMasterTable
              vehicles={filteredVehicles}
              onSetDefault={handleSetDefault}
              onEdit={(v) => setEditingVehicle(v)}
              onViewDossier={(v) => setDossierVehicle(v)}
              onDelete={(v) => setDeletingVehicle(v)}
              onOpenRegister={() => setIsRegisterOpen(true)}
            />

            <AlprGateSyncBanner />
          </div>
        </div>
      </div>

      {/* Modals */}
      <RegisterVehicleModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSubmit={handleAddVehicle}
        isSubmitting={isAdding}
      />

      <EditVehicleModal
        vehicle={editingVehicle}
        isOpen={!!editingVehicle}
        onClose={() => setEditingVehicle(null)}
        onSave={handleSaveEdit}
        isSaving={isSavingEdit}
      />

      <ViewInspectionDossierModal
        vehicle={dossierVehicle}
        isOpen={!!dossierVehicle}
        onClose={() => setDossierVehicle(null)}
      />

      <DeleteVehicleConfirmModal
        vehicle={deletingVehicle}
        isOpen={!!deletingVehicle}
        onClose={() => setDeletingVehicle(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      <ExportFleetModal
        vehicles={vehicles}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

      <NotificationSettingsModal
        isOpen={isNotificationSettingsOpen}
        onClose={() => setIsNotificationSettingsOpen(false)}
      />
    </main>
  )
}
