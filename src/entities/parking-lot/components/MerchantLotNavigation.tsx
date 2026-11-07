import { NavLink, Link } from 'react-router-dom'
import { LayoutDashboard, CircleParking, Wallet, Settings2, QrCode } from 'lucide-react'

export function MerchantLotNavigation({ lotId, status }: { lotId: number | string; status?: string }) {
  const base = `/merchant/parking-lots/${lotId}`
  const items = [
    { to: base, label: 'Tổng quan', icon: LayoutDashboard },
    ...(status === 'REJECTED' || status === 'CHANGES_REQUESTED'
      ? [{ to: `${base}/edit`, label: 'Hồ sơ', icon: Settings2 }] : []),
    ...(status === 'APPROVED'
      ? [
          { to: `${base}/slots`, label: 'Cấu hình chỗ đỗ', icon: CircleParking },
          { to: `${base}/pricing`, label: 'Bảng giá', icon: Wallet },
        ] : []),
  ]
  return (
    <nav aria-label="Điều hướng hồ sơ bãi" className="flex min-w-0 flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-border bg-white p-2 text-sm font-semibold text-brand-navy">
      <div className="flex min-w-0 max-w-full gap-1 overflow-x-auto p-1">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end className={({ isActive }) => `inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange ${isActive ? 'bg-brand-orange text-white shadow-sm' : 'text-brand-muted hover:bg-brand-surface hover:text-brand-navy'}`}>
            <Icon size={17} aria-hidden="true" />{label}
          </NavLink>
        ))}
      </div>
      <Link to={`/merchant/qr-scanner?lot=${lotId}`} className="mx-1 inline-flex shrink-0 items-center gap-2 rounded-xl border border-brand-border px-4 py-3 hover:bg-brand-surface focus-visible:outline-2 focus-visible:outline-brand-orange"><QrCode size={17} aria-hidden="true" />Quét QR</Link>
    </nav>
  )
}
