import { useId, useState } from 'react'
import { useController, type Control } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import { Autocomplete } from '@/shared/components/Autocomplete'
import { Notice, secondary } from '@/shared/components/Workspace'
import { errorMessage } from '@/shared/api/resources'
import { fetchBanks, type Bank } from '../api/banks'
import type { AuthFields } from '../model/authFields'

function BankLogo({ bank, compact = false }: { bank: Bank; compact?: boolean }) {
  const [failed, setFailed] = useState(false)
  const validLogo = bank.logo != null && /^https:\/\/(?:api|cdn)\.vietqr\.io\//.test(bank.logo)
  return <span aria-hidden="true" className={`flex shrink-0 items-center justify-center overflow-hidden rounded-md bg-white text-xs font-semibold text-brand-muted ${compact ? 'h-8 w-10' : 'h-9 w-12 border border-brand-border'}`}>
    {validLogo && !failed ? <img src={bank.logo} alt="" loading="lazy" referrerPolicy="no-referrer" className="max-h-7 max-w-10 object-contain" onError={() => setFailed(true)} /> : bank.shortName.slice(0, 2)}
  </span>
}
export function BankField({ control, disabled = false }: { control: Control<AuthFields>; disabled?: boolean }) {
  const id = useId()
  const query = useQuery({ queryKey: ['vietqr-banks'], queryFn: ({ signal }) => fetchBanks(signal), staleTime: 86400000, gcTime: 86400000, retry: false })
  const { field, fieldState } = useController({ control, name: 'bankName', defaultValue: '', rules: {
    validate: value => query.data?.some(bank => bank.shortName === value) || 'Chọn ngân hàng từ danh sách.',
  } })
  const banks = new Map(query.data?.map(bank => [bank.shortName, bank]))
  const selected = banks.get(field.value)
  const search = field.value.trim().toLocaleLowerCase('vi')
  const rank = (bank: Bank) => {
    const names = [bank.shortName, bank.code, bank.bin].map(value => value.toLocaleLowerCase('vi'))
    if (names.some(value => value === search)) return 0
    return names.some(value => value.startsWith(search)) ? 1 : 2
  }
  const options = [...(query.data ?? [])].sort((a, b) => rank(a) - rank(b)).map(bank => bank.shortName)
  return <div className="space-y-2">
    <label htmlFor={id} className="block text-base font-medium">Tên ngân hàng</label>
    <Autocomplete id={id} ref={field.ref} name={field.name} value={field.value} onValueChange={field.onChange} onBlur={field.onBlur}
      disabled={disabled || !query.data || query.isError} aria-required="true" aria-invalid={Boolean(fieldState.error)}
      aria-describedby={[selected ? `${id}-name` : '', fieldState.error ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined} maxLength={100}
      leadingIcon={selected ? <BankLogo key={selected.bin} bank={selected} compact /> : undefined}
      className={selected ? '!pl-16' : ''}
      options={options}
      suggestionHint="Chọn ngân hàng từ danh sách" emptyMessage="Không tìm thấy ngân hàng. Thử tên đầy đủ hoặc tên viết tắt." placeholder={query.isPending ? 'Đang tải ngân hàng…' : 'Tìm tên ngân hàng, mã hoặc tên viết tắt…'}
      optionSearchText={name => { const bank = banks.get(name); return bank ? `${bank.shortName} ${bank.name} ${bank.code} ${bank.bin}` : name }}
      renderOption={name => {
        const bank = banks.get(name)
        return bank ? <span className="flex min-w-0 items-center gap-3 py-1"><BankLogo bank={bank} /><span className="min-w-0"><span className="block font-semibold">{bank.shortName}</span><span className="block truncate text-xs font-normal text-brand-muted">{bank.name}</span></span></span> : name
      }} />
    {query.isPending && <p role="status" className="text-sm text-brand-muted">Đang tải danh sách từ VietQR…</p>}
    {query.isError && <Notice error><div>{errorMessage(query.error)}<button type="button" disabled={query.isFetching || disabled} className={`${secondary} mt-2`} onClick={() => void query.refetch()}>Tải lại ngân hàng</button></div></Notice>}
    {selected && <p id={`${id}-name`} className="text-sm text-brand-muted">{selected.name}</p>}
    {fieldState.error && <p id={`${id}-error`} role="alert" className="text-sm text-red-700">{fieldState.error.message}</p>}
  </div>
}
