import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BANKS_QUERY_KEY } from '@/entities/bank'
import { WithdrawalSummary, type WithdrawalInfo } from '../components/WithdrawalSummary'

const bank = { name: 'Ngân hàng TMCP Ngoại thương Việt Nam', shortName: 'Vietcombank', code: 'VCB', bin: '970436', logo: 'https://api.vietqr.io/img/VCB.png' }
const withdrawal = { id: 30, amount: 100000, bankName: 'Vietcombank', bankAccountNumber: '00001234567', maskedBankAccount: '****4567', accountHolderName: 'LE VAN TEST', merchantName: 'Lê Văn Test' }

function show(value: WithdrawalInfo, banks = [bank]) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  client.setQueryData(BANKS_QUERY_KEY, banks)
  const result = render(<QueryClientProvider client={client}><WithdrawalSummary withdrawal={value} /></QueryClientProvider>)
  return result
}

afterEach(() => { cleanup(); vi.unstubAllGlobals() })

describe('Withdrawal transfer summary', () => {
  it('shows the full string account including leading zeroes with a matching bank logo', () => {
    const { container } = show(withdrawal)
    expect(screen.getByText('00001234567')).toBeInTheDocument()
    expect(screen.queryByText('****4567')).not.toBeInTheDocument()
    expect(screen.getByText('100.000 ₫')).toBeInTheDocument()
    expect(container.querySelector('img')).toHaveAttribute('src', bank.logo)
  })

  it('matches bank codes and branch names while retaining the original bank label', () => {
    const { container } = show({ ...withdrawal, bankName: 'VCB Chi nhánh Sài Gòn' })
    expect(screen.getByText('VCB Chi nhánh Sài Gòn')).toBeInTheDocument()
    expect(container.querySelector('img')).toHaveAttribute('src', bank.logo)
  })

  it('keeps bank details visible when the logo fails or the bank is unknown', () => {
    const { container } = show(withdrawal)
    fireEvent.error(container.querySelector('img')!)
    expect(container.querySelector('img')).toBeNull()
    expect(screen.getByText('Vietcombank')).toBeInTheDocument()
    expect(screen.getByText('00001234567')).toBeInTheDocument()
  })

  it('labels masked-only data honestly and never invents a full account or bank logo', () => {
    const { container } = show({ ...withdrawal, bankAccountNumber: null, bankName: 'Ngân hàng khác' })
    expect(screen.getByText('****4567')).toBeInTheDocument()
    expect(screen.getByText('Chưa có số tài khoản đầy đủ.')).toBeInTheDocument()
    expect(container.querySelector('img')).toBeNull()
  })

  it('keeps transfer details readable if the public bank directory is unavailable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')))
    const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } })
    render(<QueryClientProvider client={client}><WithdrawalSummary withdrawal={withdrawal} /></QueryClientProvider>)
    expect(await screen.findByText('00001234567')).toBeInTheDocument()
    expect(screen.getByText('Vietcombank')).toBeInTheDocument()
    client.clear()
  })
})
