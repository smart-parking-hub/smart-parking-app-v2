import { useState } from 'react'
import { Landmark } from 'lucide-react'
import type { Bank } from '../api/banks'

export function BankLogo({ bank, compact = false, prominent = false }: { bank?: Bank; compact?: boolean; prominent?: boolean }) {
  const [failed, setFailed] = useState(false)
  const validLogo = bank?.logo != null && /^https:\/\/(?:api|cdn)\.vietqr\.io\//.test(bank.logo)

  return (
    <span aria-hidden="true" className={`flex shrink-0 items-center justify-center overflow-hidden rounded-md bg-white text-xs font-semibold text-brand-muted ${compact ? 'h-8 w-10' : prominent ? 'h-12 w-16 border border-brand-border' : 'h-9 w-12 border border-brand-border'}`}>
      {validLogo && !failed ? (
        <img src={bank.logo} alt="" loading="lazy" referrerPolicy="no-referrer" className={prominent ? 'max-h-10 max-w-14 object-contain' : 'max-h-7 max-w-10 object-contain'} onError={() => setFailed(true)} />
      ) : bank && !prominent ? bank.shortName.slice(0, 2) : <Landmark className="h-6 w-6" />}
    </span>
  )
}
