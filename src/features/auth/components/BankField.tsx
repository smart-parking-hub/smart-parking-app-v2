import type { Control } from 'react-hook-form'
import { BankField as BankAccountField } from '@/entities/bank'
import type { AuthFields } from '../model/authFields'

export function BankField({ control, disabled = false }: {
  control: Control<AuthFields>
  disabled?: boolean
}) {
  return <BankAccountField control={control} name="bankName" disabled={disabled} />
}
