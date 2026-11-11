import { getData } from '@/shared/api/resources'
import type { AdminDashboardData } from '../types/adminDashboardTypes'

export const ADMIN_DASHBOARD_QUERY_KEY = ['admin-dashboard'] as const

/**
 * Fetches macro platform statistics for the Super Admin Command Center (SCR-042).
 * Endpoint: GET /api/v1/admin/dashboard
 */
export async function fetchAdminDashboardData(signal?: AbortSignal): Promise<AdminDashboardData> {
  return getData<AdminDashboardData>('/api/v1/admin/dashboard', undefined, { signal })
}

