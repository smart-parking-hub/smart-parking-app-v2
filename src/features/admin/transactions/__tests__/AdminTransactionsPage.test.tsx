import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, within, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AdminTransactionsPage } from '../pages/AdminTransactionsPage'
import { getData, sendData } from '@/shared/api/resources'
import type { AdminTransaction } from '../api/adminTransactionsApi'

vi.mock('@/shared/api/resources', () => ({
  getData: vi.fn(), sendData: vi.fn(),
  errorMessage: (error: unknown) => error instanceof Error ? error.message : 'Lỗi máy chủ',
}))

const record: AdminTransaction = {
  id: 51, transactionCode: 'TX-51', bookingId: 12, bookingCode: 'BK-12',
  payerUserId: 3, payerPhone: 'USER#3', merchantId: 4, merchantName: 'Merchant #4',
  gateway: 'PAYOS', amount: 120000, type: 'DEPOSIT', status: 'PENDING',
  createdAt: '2026-11-14T08:00:00', updatedAt: null,
}
const page = { content: [record], currentPage: 0, totalPages: 2, totalElements: 21 }

function mount() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } })
  render(<QueryClientProvider client={client}><AdminTransactionsPage /></QueryClientProvider>)
  return userEvent.setup()
}
async function openDetail(user: ReturnType<typeof userEvent.setup>) {
  await screen.findByRole('table')
  await user.click(within(screen.getByRole('table')).getByRole('button', { name: /Xem chi tiết giao dịch TX-51/ }))
  return screen.getByRole('dialog')
}

afterEach(() => { cleanup(); vi.resetAllMocks() })

describe('PAY-05 admin transaction monitoring', () => {
  it('uses server pagination, repeated stable sort, resets page on sort and refreshes', async () => {
    vi.mocked(getData).mockResolvedValue(page)
    const user = mount()
    await screen.findByRole('table')
    const params = vi.mocked(getData).mock.calls[0][1] as URLSearchParams
    expect(params.get('page')).toBe('0')
    expect(params.get('size')).toBe('20')
    expect(params.getAll('sort')).toEqual(['createdAt,desc', 'id,desc'])
    expect(within(screen.getByRole('table')).getByRole('cell', { name: /120\.000\s₫/ })).toHaveClass('text-right')
    expect(screen.getByText('21')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Trước' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'Sau' }))
    await waitFor(() => expect((vi.mocked(getData).mock.lastCall?.[1] as URLSearchParams).get('page')).toBe('1'))
    await screen.findByText('Trang 2 / 2')
    expect(screen.getByRole('button', { name: 'Sau' })).toBeDisabled()
    await user.selectOptions(screen.getByLabelText('Sắp xếp giao dịch'), 'amount,asc')
    await screen.findByText('Trang 1 / 2')
    const sorted = vi.mocked(getData).mock.lastCall?.[1] as URLSearchParams
    expect(sorted.get('page')).toBe('0')
    expect(sorted.getAll('sort')).toEqual(['amount,asc', 'id,desc'])
    const count = vi.mocked(getData).mock.calls.length
    await user.click(screen.getByRole('button', { name: 'Làm mới danh sách' }))
    await waitFor(() => expect(getData).toHaveBeenCalledTimes(count + 1))
    expect(sendData).not.toHaveBeenCalled()
  })

  it('loads authoritative detail and fetches again when reopening', async () => {
    vi.mocked(getData).mockImplementation(async path => path.endsWith('/51')
      ? { ...record, status: 'SUCCESS', amount: 125000, updatedAt: '2026-11-14T09:00:00' }
      : page)
    const user = mount()
    const dialog = await openDetail(user)
    expect(await within(dialog).findByText('125.000 ₫')).toBeInTheDocument()
    expect(within(dialog).getByText('Thành công')).toBeInTheDocument()
    expect(within(dialog).getByText('#3')).toBeInTheDocument()
    expect(within(dialog).queryByText('USER#3')).not.toBeInTheDocument()
    expect(getData).toHaveBeenCalledWith('/api/v1/admin/transactions/51', undefined, { signal: expect.any(AbortSignal) })
    await user.click(within(dialog).getByRole('button', { name: 'Đóng' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await openDetail(user)
    await waitFor(() => expect(vi.mocked(getData).mock.calls.filter(([path]) => path.endsWith('/51'))).toHaveLength(2))
    expect(sendData).not.toHaveBeenCalled()
  })

  it('shows list loading and disables refresh during the request', () => {
    vi.mocked(getData).mockReturnValue(new Promise(() => {}))
    mount()
    expect(screen.getByRole('status')).toHaveTextContent('Đang tải dữ liệu')
    expect(screen.getByRole('button', { name: 'Làm mới danh sách' })).toBeDisabled()
  })

  it('handles an empty successful page', async () => {
    vi.mocked(getData).mockResolvedValue({ ...page, content: [], totalPages: 0, totalElements: 0 })
    mount()
    expect(await screen.findByText('Chưa có giao dịch thanh toán.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sau' })).toBeDisabled()
  })

  it.each(['Không kết nối được máy chủ.', 'Bạn không có quyền truy cập (403).'])(
    'keeps list error visible and supports retry: %s', async message => {
      vi.mocked(getData).mockRejectedValueOnce(new Error(message)).mockResolvedValue(page)
      const user = mount()
      expect(await screen.findByText(message)).toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: 'Thử lại' }))
      await screen.findByRole('table')
    },
  )

  it('does not show list snapshot while detail is loading; closing aborts its request', async () => {
    vi.mocked(getData).mockImplementation(async path => path.endsWith('/51') ? new Promise(() => {}) : page)
    const user = mount()
    const dialog = await openDetail(user)
    expect(within(dialog).getByRole('status')).toHaveTextContent('Đang tải chi tiết')
    expect(within(dialog).queryByText('120.000 ₫')).not.toBeInTheDocument()
    const signal = vi.mocked(getData).mock.lastCall?.[2]?.signal
    await user.click(within(dialog).getByRole('button', { name: 'Đóng' }))
    expect(signal?.aborted).toBe(true)
  })

  it('handles detail 404, retries and refreshes detail without losing list', async () => {
    let detailCalls = 0
    vi.mocked(getData).mockImplementation(async path => {
      if (!path.endsWith('/51')) return page
      if (++detailCalls === 1) throw new Error('Giao dịch không tồn tại (404)')
      return { ...record, merchantName: null, updatedAt: null }
    })
    const user = mount()
    const dialog = await openDetail(user)
    expect(await within(dialog).findByText('Giao dịch không tồn tại (404)')).toBeInTheDocument()
    await user.click(within(dialog).getByRole('button', { name: 'Thử lại' }))
    expect(await within(dialog).findByText('120.000 ₫')).toBeInTheDocument()
    expect(within(dialog).getAllByText('—').length).toBeGreaterThanOrEqual(2)
    await user.click(within(dialog).getByRole('button', { name: 'Làm mới chi tiết' }))
    await waitFor(() => expect(detailCalls).toBe(3))
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it.each([
    ['REQUIRES_REVIEW', 'Cần đối soát'], ['PENDING', 'Chờ thanh toán'], ['SUCCESS', 'Thành công'],
    ['FAILED', 'Thất bại'], ['REFUNDED', 'Đã hoàn tiền'],
  ] as const)(
    'can monitor backend status %s without exposing write actions', async (status, label) => {
      vi.mocked(getData).mockResolvedValue({ ...page, content: [{ ...record, status, type: 'REFUND' }] })
      mount()
      await screen.findByRole('table')
      expect(within(screen.getByRole('table')).getByText(label)).toBeInTheDocument()
      expect(within(screen.getByRole('table')).getByText('Hoàn tiền')).toBeInTheDocument()
      expect(sendData).not.toHaveBeenCalled()
    },
  )
})
