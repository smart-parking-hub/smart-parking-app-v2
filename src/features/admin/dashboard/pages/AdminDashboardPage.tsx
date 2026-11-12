import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Workspace } from '@/shared/components/Workspace'
import { QueryState } from '@/shared/components/QueryState'
import {
  fetchAdminDashboardData,
  ADMIN_DASHBOARD_QUERY_KEY,
} from '../api/adminDashboardApi'
import { AdminMacroMetrics } from '../components/AdminMacroMetrics'
import { AdminTriagePanels } from '../components/AdminTriagePanels'
import { AdminUserEcosystemCard } from '../components/AdminUserEcosystemCard'
import { AdminSystemHealthCard } from '../components/AdminSystemHealthCard'
import {
  AdminDashboardFilterForm,
  type DashboardFilterValues,
} from '../components/AdminDashboardFilterForm'

export function AdminDashboardPage() {
  const [filter, setFilter] = useState<DashboardFilterValues>({
    timeRange: 'ALL',
    autoRefreshInterval: 0,
  })

  const query = useQuery({
    queryKey: [...ADMIN_DASHBOARD_QUERY_KEY, filter.timeRange],
    queryFn: ({ signal }) => fetchAdminDashboardData(signal),
    refetchInterval:
      filter.autoRefreshInterval > 0
        ? filter.autoRefreshInterval * 1000
        : false,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: false,
  })

  return (
    <Workspace
      title="Toàn cảnh vận hành"
      eyebrow="SMARTTRUCK / COMMAND CENTER"
      description="Các quyết định hôm nay bắt đầu từ dữ liệu chính xác."
    >
      <div className="space-y-6">
        <AdminDashboardFilterForm
          defaultValues={filter}
          onFilterChange={setFilter}
          onManualRefresh={() => void query.refetch()}
          isFetching={query.isFetching}
        />

        <QueryState query={query}>
          {(data) => (
            <div className="space-y-6">
              <AdminMacroMetrics data={data} />
              <AdminTriagePanels data={data} />
              <div className="grid gap-6 lg:grid-cols-2">
                <AdminUserEcosystemCard data={data} />
                <AdminSystemHealthCard />
              </div>
            </div>
          )}
        </QueryState>
      </div>
    </Workspace>
  )
}

