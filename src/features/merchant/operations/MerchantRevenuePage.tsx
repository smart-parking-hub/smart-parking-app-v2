import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { QueryState } from '@/shared/components/QueryState'
import { Workspace, Metrics, Panel, Field, Notice, money, control, button } from '@/shared/components/Workspace'
import { MerchantRevenueChart } from '../components/MerchantRevenueChart'
import { MerchantWalletLedger } from '../components/MerchantWalletLedger'
import { getMerchantRevenue, groupRevenueSeries, revenueFiltersSchema, type RevenueFilters } from './merchantFinanceApi'

export function MerchantRevenuePage() {
  const filters = useForm<RevenueFilters>({
    resolver: zodResolver(revenueFiltersSchema),
    defaultValues: { startDate: '', endDate: '', granularity: 'DAY' },
  })
  const [range, setRange] = useState(filters.getValues())
  const query = useQuery({
    queryKey: ['merchant-revenue', { startDate: range.startDate, endDate: range.endDate }],
    queryFn: () => getMerchantRevenue(range),
    retry: false,
  })
  return (
    <Workspace title="Hiệu quả kinh doanh" eyebrow="FINANCE / REVENUE"
      description="Theo dõi doanh thu, phí nền tảng và dòng tiền thực nhận."
      actions={<Link className={button} to="/merchant/withdrawals">Ví & Rút tiền →</Link>}>
      <Panel>
        <form className="flex flex-wrap items-end gap-4" onSubmit={filters.handleSubmit(setRange)}>
          <Field label="Từ ngày"><input type="date" className={control} {...filters.register('startDate')} /></Field>
          <Field label="Đến ngày"><input type="date" className={control} aria-invalid={Boolean(filters.formState.errors.endDate)} aria-describedby={filters.formState.errors.endDate ? 'revenue-date-error' : undefined} {...filters.register('endDate')} /></Field>
          <Field label="Nhóm thời gian"><select className={control} {...filters.register('granularity')}>
            <option value="DAY">Theo ngày</option><option value="MONTH">Theo tháng</option><option value="YEAR">Theo năm</option>
          </select></Field>
          <button type="submit" className={button}>Áp dụng</button>
          {filters.formState.errors.endDate && <div id="revenue-date-error"><Notice error>{filters.formState.errors.endDate.message}</Notice></div>}
        </form>
        <p className="mt-3 text-sm text-brand-muted">Khoảng ngày áp dụng cho biểu đồ. Để trống để xem kỳ mặc định của hệ thống.</p>
      </Panel>
      <QueryState query={query}>{data => {
        const points = groupRevenueSeries(data.series ?? [], range.granularity)
        const periodRevenue = points.reduce((sum, point) => sum + point.revenue, 0)
        return <>
          <Metrics items={[
            { label: 'Doanh thu gộp', value: money(data.totalGrossRevenue), note: 'Tích lũy từ thanh toán thành công' },
            { label: 'Biến động ví tích lũy', value: money(data.totalNetRevenue), note: 'Gồm cộng doanh thu, giữ tiền rút, hoàn và điều chỉnh' },
            { label: 'Phí nền tảng', value: money(data.totalPlatformFee), note: 'Tích lũy theo sổ cái' },
            { label: 'Số dư khả dụng', value: money(data.currentWalletBalance), note: 'Số dư ví hiện tại' },
          ]} />
          <Panel title="Nhịp doanh thu">
            <p className="mb-4 text-sm">Doanh thu sau phí trong kỳ: <strong>{money(periodRevenue)}</strong></p>
            {points.length > 0 && <p className="mb-4 text-xs text-brand-muted">Kỳ hiển thị: {points[0].period} → {points[points.length - 1].period}</p>}
            <MerchantRevenueChart points={points} />
          </Panel>
          <Panel title="Đối soát"><p className="text-sm leading-7 text-brand-muted">Các chỉ số tích lũy và số dư ví không thay đổi theo bộ lọc ngày. Biểu đồ phản ánh thanh toán thành công sau phí; sổ cái phản ánh các khoản thực tế đã ghi vào ví. Lượt ghi nhận được cộng từ dữ liệu từng ngày, có thể gồm nhiều khoản thanh toán cho cùng một đặt chỗ.</p></Panel>
        </>
      }}</QueryState>
      <MerchantWalletLedger />
    </Workspace>
  )
}
