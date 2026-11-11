import { Metrics, money } from '@/shared/components/Workspace'
import type { AdminDashboardData } from '../types/adminDashboardTypes'

interface AdminMacroMetricsProps {
  data: AdminDashboardData
}

export function AdminMacroMetrics({ data }: AdminMacroMetricsProps) {
  return (
    <Metrics
      items={[
        {
          label: 'Doanh thu nền tảng',
          value: money(data.platformRevenue),
        },
        {
          label: 'Bãi đỗ',
          value: data.totalParkingLots,
        },
        {
          label: 'Tổng lượt đặt chỗ',
          value: data.totalBookings,
        },
        {
          label: 'Người dùng',
          value: data.totalUsers,
        },
      ]}
    />
  )
}

