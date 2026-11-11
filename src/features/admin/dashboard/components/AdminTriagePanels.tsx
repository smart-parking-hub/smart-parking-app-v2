import { Link } from 'react-router-dom'
import { Panel } from '@/shared/components/Workspace'
import type { AdminDashboardData } from '../types/adminDashboardTypes'

interface AdminTriagePanelsProps {
  data: AdminDashboardData
}

interface TriageItemConfig {
  path: string
  title: string
  count: number
  description: string
}

export function AdminTriagePanels({ data }: AdminTriagePanelsProps) {
  const items: TriageItemConfig[] = [
    {
      path: 'parking-lots',
      title: 'Bãi đang chờ thẩm định',
      count: data.pendingParkingLots,
      description: 'Hồ sơ pháp lý, vị trí và PCCC chờ phê duyệt mở bến.',
    },
    {
      path: 'withdrawals',
      title: 'Yêu cầu rút tiền',
      count: data.pendingWithdrawals,
      description: 'Lệnh rút tiền từ ví merchant cần đối soát và giải ngân.',
    },
    {
      path: 'disputes',
      title: 'Tranh chấp đang mở',
      count: data.openDisputes,
      description: 'Khiếu nại cọc và thời gian đỗ xe giữa tài xế và chủ bãi.',
    },
  ]

  return (
    <div className="grid gap-5 md:grid-cols-3">
      {items.map(({ path, title, count, description }) => {
        const isAlert = typeof count === 'number' && count > 0
        return (
          <Panel key={path} className="flex flex-col justify-between transition-all hover:shadow-xs">
            <div>
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-brand-muted">{title}</p>
                {isAlert ? (
                  <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800 border border-amber-200">
                    Cần xử lý
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
                    Đã xử lý xong
                  </span>
                )}
              </div>
              <p
                className={`my-4 font-sora text-5xl font-semibold tracking-tight tabular-nums ${
                  isAlert ? 'text-[#d95f00]' : 'text-brand-navy'
                }`}
              >
                {count}
              </p>
              <p className="text-xs text-brand-muted leading-relaxed mb-5">
                {description}
              </p>
            </div>
            <Link
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-border bg-white px-4 py-2.5 text-sm font-semibold text-brand-navy hover:bg-brand-surface hover:text-[#d95f00] transition-colors"
              to={`/admin/${path}`}
            >
              Mở bàn xử lý →
            </Link>
          </Panel>
        )
      })}
    </div>
  )
}
