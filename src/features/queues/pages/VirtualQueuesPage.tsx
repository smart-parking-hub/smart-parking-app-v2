import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Plus, Radio, RefreshCw } from 'lucide-react'
import { EmptyState } from '@/shared/components/EmptyState'
import { Alert } from '@/shared/components/Alert'
import { Toast } from '@/shared/components/Toast'
import type { ActiveQueueItem } from '../types/queueTypes'
import {
  fetchMyActiveQueue,
  fetchQueueHistory,
  fetchQueueTelemetry,
  fetchQueueRegulations,
  leaveQueueApi,
  acceptQueueApi,
  declineQueueApi,
  fallbackActiveQueue,
  fallbackWaitingQueue,
  fallbackQueueHistory,
  fallbackTelemetry,
  fallbackRegulations,
} from '../api/queueApi'
import { QueueCommandToolbar } from '../components/QueueCommandToolbar'
import { ActiveQueueCard } from '../components/ActiveQueueCard'
import { QueueHistoryTable } from '../components/QueueHistoryTable'
import { QueueRegulationsSection } from '../components/QueueRegulationsSection'
import { LeaveQueueConfirmModal } from '../components/LeaveQueueConfirmModal'
import { AcceptQueueSuccessModal } from '../components/AcceptQueueSuccessModal'
import { QueueSkeleton } from '../components/QueueSkeleton'
import { useQueueStore } from '../store/queueStore'
import type { LeaveQueueFormData } from '../schemas/queueSchemas'

export function VirtualQueuesPage() {
  const queryClient = useQueryClient()

  // Zustand UI State
  const activeTab = useQueueStore((s) => s.activeTab)
  const setActiveTab = useQueueStore((s) => s.setActiveTab)
  const isLeaveModalOpen = useQueueStore((s) => s.isLeaveModalOpen)
  const openLeaveModal = useQueueStore((s) => s.openLeaveModal)
  const closeLeaveModal = useQueueStore((s) => s.closeLeaveModal)
  const isAcceptSuccessOpen = useQueueStore((s) => s.isAcceptSuccessOpen)
  const openAcceptSuccessModal = useQueueStore((s) => s.openAcceptSuccessModal)
  const closeAcceptSuccessModal = useQueueStore((s) => s.closeAcceptSuccessModal)
  const isLeaving = useQueueStore((s) => s.isLeaving)
  const setIsLeaving = useQueueStore((s) => s.setIsLeaving)
  const createdBooking = useQueueStore((s) => s.createdBooking)
  const setCreatedBooking = useQueueStore((s) => s.setCreatedBooking)
  const toastMessage = useQueueStore((s) => s.toastMessage)
  const toastType = useQueueStore((s) => s.toastType)
  const showToast = useQueueStore((s) => s.showToast)
  const clearToast = useQueueStore((s) => s.clearToast)

  // Simulated active queue item in local state for seamless mutations / demo toggling
  const [isQueueCancelled, setIsQueueCancelled] = useState(false)
  const [simulatedActiveItem, setSimulatedActiveItem] = useState<ActiveQueueItem | null>(
    fallbackActiveQueue
  )

  // React Queries
  const {
    data: serverActiveQueue,
    isLoading: isLoadingActive,
    isError: isErrorActive,
    refetch: refetchActive,
  } = useQuery({
    queryKey: ['my-active-queue'],
    queryFn: fetchMyActiveQueue,
    initialData: fallbackActiveQueue,
    staleTime: 30000,
  })

  const {
    data: queueHistory = fallbackQueueHistory,
    isLoading: isLoadingHistory,
    isError: isErrorHistory,
    refetch: refetchHistory,
  } = useQuery({
    queryKey: ['queue-history'],
    queryFn: fetchQueueHistory,
    initialData: fallbackQueueHistory,
    staleTime: 60000,
  })

  const { data: telemetry = fallbackTelemetry } = useQuery({
    queryKey: ['queue-telemetry'],
    queryFn: fetchQueueTelemetry,
    initialData: fallbackTelemetry,
    staleTime: 60000,
  })

  const { data: regulations = fallbackRegulations } = useQuery({
    queryKey: ['queue-regulations'],
    queryFn: fetchQueueRegulations,
    initialData: fallbackRegulations,
    staleTime: 120000,
  })

  // Active queue item to display
  const currentActiveQueue = isQueueCancelled
    ? null
    : (simulatedActiveItem ?? serverActiveQueue)

  // Handlers
  const handleOpenLeaveModal = () => {
    openLeaveModal()
  }

  const handleConfirmLeave = async (formData?: LeaveQueueFormData) => {
    if (!currentActiveQueue) return
    setIsLeaving(true)
    try {
      await leaveQueueApi(currentActiveQueue.id, {
        reason: formData?.reason,
        note: formData?.customReason,
      })
      setIsQueueCancelled(true)
      setSimulatedActiveItem(null)
      closeLeaveModal()
      showToast('Đã rời khỏi hàng đợi ảo thành công', 'success')
      void queryClient.invalidateQueries({ queryKey: ['my-active-queue'] })
    } catch {
      showToast('Không thể hủy lượt xếp hàng, vui lòng thử lại', 'error')
    } finally {
      setIsLeaving(false)
    }
  }

  const handleAcceptSlot = async () => {
    if (!currentActiveQueue) return
    try {
      const result = await acceptQueueApi(currentActiveQueue.id)
      setCreatedBooking({
        bookingCode: result.bookingCode,
        berthCode: currentActiveQueue.berthCode,
        parkingLotName: currentActiveQueue.parkingLotName,
      })
      openAcceptSuccessModal()
      showToast('Đã nhận slot thành công! Vui lòng hoàn tất đặt chỗ.', 'success')
      void queryClient.invalidateQueries({ queryKey: ['my-active-queue'] })
    } catch {
      showToast('Có lỗi xảy ra khi xác nhận slot, vui lòng thử lại', 'error')
    }
  }

  const handleDeclineSlot = async () => {
    if (!currentActiveQueue) return
    try {
      await declineQueueApi(currentActiveQueue.id)
      // Switch to waiting queue or empty to reflect giving up slot
      setSimulatedActiveItem(fallbackWaitingQueue)
      showToast('Đã từ chối slot và nhường cho xe tiếp theo', 'info')
    } catch {
      showToast('Thao tác không thành công', 'error')
    }
  }

  const handleToggleDemoStatus = () => {
    setIsQueueCancelled(false)
    if (!currentActiveQueue) {
      setSimulatedActiveItem(fallbackActiveQueue)
      return
    }
    if (currentActiveQueue.status === 'NOTIFIED') {
      setSimulatedActiveItem(fallbackWaitingQueue)
    } else {
      setSimulatedActiveItem(fallbackActiveQueue)
    }
  }

  const handleRestoreDefaultQueue = () => {
    setIsQueueCancelled(false)
    setSimulatedActiveItem(fallbackActiveQueue)
  }

  if (isLoadingActive && isLoadingHistory) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-8">
        <QueueSkeleton />
      </div>
    )
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-8 font-inter relative">
      {/* Toast Notification Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md animate-in slide-in-from-bottom duration-200">
          <Toast
            title={toastMessage}
            variant={toastType}
            onClose={clearToast}
            duration={4000}
          />
        </div>
      )}

      {/* Error Alert with Retry button */}
      {(isErrorActive || isErrorHistory) && (
        <div className="mb-6">
          <Alert
            variant="error"
            title="Lỗi nạp dữ liệu hàng đợi"
            action={
              <button
                type="button"
                onClick={() => {
                  void refetchActive()
                  void refetchHistory()
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Thử lại</span>
              </button>
            }
          >
            Không thể tải đồng bộ thông tin hàng đợi ảo từ máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.
          </Alert>
        </div>
      )}

      {/* Command Deck Toolbar */}
      <QueueCommandToolbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeCount={currentActiveQueue ? 1 : 0}
        historyCount={queueHistory.length}
        telemetry={telemetry}
      />

      {/* Main Tab Panels */}
      {activeTab === 'ACTIVE' ? (
        <section aria-label="Lượt xếp hàng đang hoạt động">
          {currentActiveQueue ? (
            <ActiveQueueCard
              item={currentActiveQueue}
              onLeave={handleOpenLeaveModal}
              onAccept={handleAcceptSlot}
              onDecline={handleDeclineSlot}
              onToggleStatusDemo={handleToggleDemoStatus}
            />
          ) : (
            <EmptyState
              icon={Radio}
              title="Bạn chưa có lượt xếp hàng nào đang hoạt động"
              description="Khi các bãi xe trọng điểm kín chỗ, bạn có thể tham gia hàng đợi ảo để tự động giữ lốt mà không cần đậu xe nối đuôi lấn chiếm lề đường."
              variant="card"
              action={
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    to="/parking"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tìm bãi xe khác</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleRestoreDefaultQueue}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4 text-slate-600" />
                    <span>Khôi phục dữ liệu mẫu</span>
                  </button>
                </div>
              }
            />
          )}
        </section>
      ) : (
        <section aria-label="Lịch sử giữ chỗ">
          <QueueHistoryTable items={queueHistory} />
        </section>
      )}

      {/* Operational Regulations Bento */}
      <QueueRegulationsSection regulations={regulations} />

      {/* Confirm Leave Modal */}
      {currentActiveQueue && (
        <LeaveQueueConfirmModal
          isOpen={isLeaveModalOpen}
          onClose={closeLeaveModal}
          onConfirm={handleConfirmLeave}
          queueCode={currentActiveQueue.queueCode}
          parkingLotName={currentActiveQueue.parkingLotName}
          isLeaving={isLeaving}
        />
      )}

      {/* Accept Success Modal */}
      <AcceptQueueSuccessModal
        isOpen={isAcceptSuccessOpen}
        onClose={closeAcceptSuccessModal}
        bookingCode={createdBooking.bookingCode}
        berthCode={createdBooking.berthCode}
        parkingLotName={createdBooking.parkingLotName}
      />
    </div>
  )
}

export { VirtualQueuesPage as DriverQueuesPage }
