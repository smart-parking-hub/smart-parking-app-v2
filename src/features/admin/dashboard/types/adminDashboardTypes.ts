export interface AdminDashboardData {
  totalUsers: number
  totalDrivers: number
  totalMerchants: number
  totalParkingLots: number
  pendingParkingLots: number
  totalBookings: number
  pendingWithdrawals: number
  openDisputes: number
  platformRevenue: number
}

export interface AdminSystemHealthService {
  key: string
  name: string
  status: 'ONLINE' | 'STANDBY' | 'WARNING'
  statusLabel: string
  description: string
  badgeVariant: 'success' | 'info' | 'warning'
}
