import { Link } from 'react-router-dom'
import { Panel, Badge } from '@/shared/components/Workspace'

interface ServiceStatusItem {
  id: string
  name: string
  detail: string
  status: string
  variant: 'success' | 'info' | 'warning'
}

const SYSTEM_SERVICES: ServiceStatusItem[] = [
  {
    id: 'alpr-barie',
    name: 'ALPR & Trạm Barie tự động',
    detail: 'Nhận diện biển số và đồng bộ cảm biến quang học cổng bãi.',
    status: 'Hoạt động bình thường',
    variant: 'success',
  },
  {
    id: 'payment-payos',
    name: 'Cổng thanh toán & đối soát ví',
    detail: 'Cổng PayOS kết nối ngân hàng VietQR và thanh toán ký quỹ.',
    status: 'Sẵn sàng (PayOS / Demo)',
    variant: 'success',
  },
  {
    id: 'virtual-queue',
    name: 'Hàng đợi ảo & điều phối slot',
    detail: 'Thuật toán xếp lốt tự động và chống ùn ứ xe đầu kéo tại cảng.',
    status: 'Kích hoạt tự động',
    variant: 'success',
  },
]

export function AdminSystemHealthCard() {
  return (
    <Panel className="flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-sora text-lg font-semibold text-brand-navy">
            Giám sát dịch vụ lõi
          </h2>
          <div className="flex items-center gap-3">
            <Link
              to="/admin/transactions"
              className="text-xs font-semibold text-brand-navy hover:text-[#d95f00] transition-colors"
            >
              Đối soát ví →
            </Link>
            <span className="text-slate-300">·</span>
            <Link
              to="/admin/audit-logs"
              className="text-xs font-semibold text-[#d95f00] hover:underline"
            >
              Nhật ký kiểm toán →
            </Link>
          </div>
        </div>

        <div className="space-y-3">
          {SYSTEM_SERVICES.map((service) => (
            <div
              key={service.id}
              className="flex items-start justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 transition-colors hover:bg-slate-50"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-sm font-semibold text-brand-navy">
                    {service.name}
                  </span>
                </div>
                <p className="mt-1 text-xs text-brand-muted leading-relaxed">
                  {service.detail}
                </p>
              </div>
              <Badge variant={service.variant} className="shrink-0 text-xs font-medium">
                {service.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  )
}
