import { Link } from 'react-router-dom'
import { Panel } from '@/shared/components/Workspace'
import type { AdminDashboardData } from '../types/adminDashboardTypes'

interface AdminUserEcosystemCardProps {
  data: AdminDashboardData
}

export function AdminUserEcosystemCard({ data }: AdminUserEcosystemCardProps) {
  const total = Math.max(data.totalDrivers + data.totalMerchants, 1)
  const driverPercent = Math.round((data.totalDrivers / total) * 100)
  const merchantPercent = 100 - driverPercent

  return (
    <Panel className="flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-sora text-lg font-semibold text-brand-navy">
            Cộng đồng vận tải
          </h2>
          <Link
            to="/admin/users"
            className="text-xs font-semibold text-[#d95f00] hover:underline"
          >
            Quản lý tài khoản →
          </Link>
        </div>

        <p className="text-sm text-brand-muted">
          {data.totalDrivers} tài xế · {data.totalMerchants} chủ bãi đang được hệ thống quản lý.
        </p>

        {/* Visual Distribution Bar */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-brand-navy">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#d95f00]" />
              Tài xế container: {data.totalDrivers.toLocaleString('vi-VN')} ({driverPercent}%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-slate-400" />
              Chủ bãi & doanh nghiệp: {data.totalMerchants.toLocaleString('vi-VN')} ({merchantPercent}%)
            </span>
          </div>
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="bg-[#d95f00] transition-all duration-500"
              style={{ width: `${driverPercent}%` }}
              title={`Tài xế: ${driverPercent}%`}
            />
            <div
              className="bg-slate-400 transition-all duration-500"
              style={{ width: `${merchantPercent}%` }}
              title={`Chủ bãi: ${merchantPercent}%`}
            />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
          <div className="rounded-lg bg-slate-50 p-3">
            <span className="text-xs text-brand-muted">Tổng số tài xế</span>
            <p className="font-sora text-xl font-bold text-brand-navy mt-0.5">
              {data.totalDrivers.toLocaleString('vi-VN')}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <span className="text-xs text-brand-muted">Tổng đối tác bãi</span>
            <p className="font-sora text-xl font-bold text-brand-navy mt-0.5">
              {data.totalMerchants.toLocaleString('vi-VN')}
            </p>
          </div>
        </div>
      </div>
    </Panel>
  )
}
