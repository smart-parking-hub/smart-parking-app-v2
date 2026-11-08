import { ShieldCheck, AlertTriangle } from 'lucide-react'
export function MerchantSlotsInvariantBanner({ isLocked }: { isLocked: boolean; status?: string }) {
  return <aside className={`slots-notice ${isLocked ? 'is-locked' : ''}`}>
    {isLocked ? <AlertTriangle size={20} /> : <ShieldCheck size={20} />}
    <p>{isLocked ? 'Bãi đang bị từ chối hoặc tạm ngưng. Bạn chưa thể thay đổi sức chứa.' : 'Sức chứa không thể thấp hơn số chỗ đã sử dụng (bao gồm chỗ đang được giữ).'}</p>
  </aside>
}
