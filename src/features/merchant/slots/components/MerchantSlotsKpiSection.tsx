import type { SlotKpiMetrics } from '../types/merchantSlotsTypes'
export function MerchantSlotsKpiSection({ metrics }: { metrics: SlotKpiMetrics }) {
  return <section className="slots-overview" aria-label="Tổng quan sức chứa">
    <div className="slots-utilization"><div><span>Tỷ lệ sử dụng</span><strong>{metrics.occupancyPercent.toFixed(1)}<small>%</small></strong></div><div className="slots-meter" role="progressbar" aria-label="Tỷ lệ sử dụng toàn bãi" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.min(100, metrics.occupancyPercent)}><span style={{ width: `${Math.min(100, metrics.occupancyPercent)}%` }} /></div><p>{metrics.totalCapacity === 0 ? 'Chưa có sức chứa' : metrics.alertStatus === 'FULL' ? 'Đã hết chỗ trống' : metrics.alertStatus === 'NEAR_FULL' ? 'Bãi sắp đầy' : 'Còn chỗ tiếp nhận xe'}</p></div>
    <div className="slots-stat"><span>Tổng sức chứa</span><strong data-testid="kpi-total-cap">{metrics.totalCapacity}</strong><small>chỗ đỗ</small></div>
    <div className="slots-stat"><span>Đã sử dụng</span><strong data-testid="kpi-occupied-cap">{metrics.totalOccupied}</strong><small>chỗ đỗ và chỗ đang giữ</small></div>
    <div className="slots-stat slots-stat-available"><span>Chỗ còn trống</span><strong data-testid="kpi-available-cap">{metrics.totalAvailable}</strong><small>có thể tiếp nhận</small></div>
  </section>
}
