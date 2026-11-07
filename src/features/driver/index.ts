// SCR-014: Driver Dashboard
export { DriverDashboardPage } from './pages/DriverDashboardPage'
export { DriverDashboardPage as DashboardHomePage } from './pages/DriverDashboardPage'

export { DriverWelcomeBanner } from './components/DriverWelcomeBanner'
export { DriverStatGrid } from './components/DriverStatGrid'
export { ActiveTripCard } from './components/ActiveTripCard'
export { DriverShortcuts } from './components/DriverShortcuts'
export { RecentBookingsTable } from './components/RecentBookingsTable'
export { QrCheckoutModal } from './components/QrCheckoutModal'
export { DashboardSkeleton } from './components/DashboardSkeleton'
export { DashboardEmptyState } from './components/DashboardEmptyState'

export { fetchDriverDashboardData, fallbackDashboardData } from './api/driverApi'
export { useDriverDashboardStore } from './store/driverDashboardStore'
export * from './types/driverTypes'

// SCR-015: Parking Search
export * from '../parking-search'

// SCR-016: Parking Detail & Reservation Desk
export * from '../parking-detail'

// SCR-017: Driver Bookings & QR Ticket
export {
  MyBookingsPage,
  BookingsCommandToolbar,
  BookingCardItem,
  BookingMasterList,
  BookingDetailHeader,
  BookingBentoStepper,
  BookingQrTerminalPanel,
  TariffAuditTable,
  BookingActionCommands,
  BookingDetailView,
  CancelBookingModal,
  ReviewBookingModal,
  PayOsCheckoutModal,
  BookingsSkeleton,
  BookingsEmptyState,
  BookingsErrorState,
  useBookingStore,
  getBookingStoreSnapshot,
  cancelBookingSchema,
  reviewBookingSchema,
  bookingFilterSchema,
  fetchMyBookings,
  fallbackBookingsList,
  cancelBookingApi,
  submitReviewApi,
  payBookingDepositApi,
  payBookingFinalApi,
  exportSvgToPng,
} from '../bookings'

export type {
  BookingItemDto,
  FilterStatusTab,
  CancelBookingRequest,
  ReviewBookingRequest,
  CancelBookingFormData,
  ReviewBookingFormData,
  BookingFilterFormData,
  BookingUIState,
  BookingUIActions,
  BookingStore,
} from '../bookings'

// SCR-018: Virtual Queues & Driver Queues
export {
  VirtualQueuesPage,
  DriverQueuesPage,
  QueueCommandToolbar,
  ActiveQueueCard,
  QueueTimelineFlow,
  QueueHistoryTable,
  QueueRegulationsSection,
  LeaveQueueConfirmModal,
  AcceptQueueSuccessModal,
  DeclineSlotConfirmModal,
  QueueSkeleton,
  useQueueStore,
  getQueueStoreSnapshot,
  leaveQueueSchema,
  leaveQueueReasonOptions,
  queueFilterSchema,
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
} from '../queues'

export type {
  ActiveQueueItem,
  QueueHistoryItem,
  QueueTelemetryData,
  QueueRegulationItem,
  QueueStatus,
  QueueTab,
  LeaveQueueFormData,
  QueueFilterFormData,
  QueueUIState,
  QueueUIActions,
  QueueStore,
} from '../queues'

// Shared driver feature components
export * from './components'
