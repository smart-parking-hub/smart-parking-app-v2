import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Plus, Radio, Sparkles } from 'lucide-react'
import type { QueueTab, ActiveQueueItem } from '../types/queueTypes'
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

export function VirtualQueuesPage() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<QueueTab>('ACTIVE')

  // Modals and interactive actions
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false)
  const [isAcceptSuccessOpen, setIsAcceptSuccessOpen] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)
  const [createdBooking, setCreatedBooking] = useState<{
    bookingCode: string
    berthCode?: string
    parkingLotName: string
  }>({
    bookingCode: 'BK-2026-9081',
    berthCode: 'Berth #B04',
    parkingLotName: fallbackActiveQueue.parkingLotName,
  })

  // Simulated active queue item in local state for seamless mutations
  const [isQueueCancelled, setIsQueueCancelled] = useState(false)
  const [simulatedActiveItem, setSimulatedActiveItem] = useState<ActiveQueueItem | null>(
    fallbackActiveQueue
  )

  // React Queries
  const { data: serverActiveQueue, isLoading: isLoadingActive } = useQuery({
    queryKey: ['my-active-queue'],
    queryFn: fetchMyActiveQueue,
    initialData: fallbackActiveQueue,
    staleTime: 30000,
  })

  const { data: queueHistory = fallbackQueueHistory, isLoading: isLoadingHistory } = useQuery({
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
    setIsLeaveModalOpen(true)
  }

  const handleConfirmLeave = async () => {
    if (!currentActiveQueue) return
    setIsLeaving(true)
    try {
      await leaveQueueApi(currentActiveQueue.id)
      setIsQueueCancelled(true)
      setSimulatedActiveItem(null)
      setIsLeaveModalOpen(false)
      void queryClient.invalidateQueries({ queryKey: ['my-active-queue'] })
    } finally {
      setIsLeaving(false)
    }
  }

  const handleAcceptSlot = async () => {
    if (!currentActiveQueue) return
    const result = await acceptQueueApi(currentActiveQueue.id)
    setCreatedBooking({
      bookingCode: result.bookingCode,
      berthCode: currentActiveQueue.berthCode,
      parkingLotName: currentActiveQueue.parkingLotName,
    })
    setIsAcceptSuccessOpen(true)
  }

  const handleDeclineSlot = async () => {
    if (!currentActiveQueue) return
    await declineQueueApi(currentActiveQueue.id)
    // Switch to waiting queue or empty to reflect giving up slot
    setSimulatedActiveItem(fallbackWaitingQueue)
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
    <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-8 font-inter">
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
            <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12 text-center shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center mx-auto mb-4">
                <Radio className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-sora text-slate-900 mb-2">
                Bạn chưa có lượt xếp hàng nào đang hoạt động
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
                Khi các bãi xe trọng điểm kín chỗ, bạn có thể tham gia hàng đợi ảo để tự động giữ lốt mà không cần đậu xe nối đuôi lấn chiếm lề đường.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/parking"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tìm bãi & Đăng ký hàng đợi</span>
                </Link>
                <button
                  type="button"
                  onClick={handleRestoreDefaultQueue}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <span>Kích hoạt mẫu giả lập để trải nghiệm</span>
                </button>
              </div>
            </div>
          )}
        </section>
      ) : (
        <section aria-label="Lịch sử xếp hàng">
          <QueueHistoryTable items={queueHistory} />
        </section>
      )}

      {/* Operational Regulations Bento */}
      <QueueRegulationsSection regulations={regulations} />

      {/* Confirm Leave Modal */}
      {currentActiveQueue && (
        <LeaveQueueConfirmModal
          isOpen={isLeaveModalOpen}
          onClose={() => setIsLeaveModalOpen(false)}
          onConfirm={handleConfirmLeave}
          queueCode={currentActiveQueue.queueCode}
          parkingLotName={currentActiveQueue.parkingLotName}
          isLeaving={isLeaving}
        />
      )}

      {/* Accept Success Modal */}
      <AcceptQueueSuccessModal
        isOpen={isAcceptSuccessOpen}
        onClose={() => setIsAcceptSuccessOpen(false)}
        bookingCode={createdBooking.bookingCode}
        berthCode={createdBooking.berthCode}
        parkingLotName={createdBooking.parkingLotName}
      />
    </div>
  )
}
