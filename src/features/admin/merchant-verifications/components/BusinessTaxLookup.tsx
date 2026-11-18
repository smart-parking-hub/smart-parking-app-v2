import { useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { Button } from '@/shared/components/Button'
import { lookupMerchantTaxCode } from '../api/adminMerchantVerificationApi'
import type { AdminMerchantVerificationDetail } from '../types/adminMerchantVerificationTypes'

const businessTaxCode = /^[0-9]{10}(?:-[0-9]{3})?$/
const householdTaxCode = /^[0-9]{12}$/

function normalizeName(name: string) {
  return name.normalize('NFC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('vi-VN')
}

export function BusinessTaxLookup({ dossier, disabled, onConflict }: {
  dossier: AdminMerchantVerificationDetail
  disabled: boolean
  onConflict: (error: unknown) => Promise<void>
}) {
  const [confirming, setConfirming] = useState(false)
  const [releasedRetryAt, setReleasedRetryAt] = useState<string | null>(null)
  const request = useRef<AbortController | null>(null)
  const { id, submissionVersion, legalName } = dossier
  const code = dossier.businessRegistrationNumber?.trim() ?? ''
  const household = householdTaxCode.test(code)

  const lookup = useMutation({
    mutationFn: async (controller: AbortController) => {
      try {
        return await lookupMerchantTaxCode(id, submissionVersion, household, controller.signal)
      } finally {
        if (request.current === controller) request.current = null
      }
    },
    retry: false,
    gcTime: 0,
  })

  useEffect(() => () => request.current?.abort(), [])

  const result = lookup.data?.dossierId === id && lookup.data.submissionVersion === submissionVersion
    ? lookup.data : undefined
  const retryAt = result?.retryAt
  const retryTimestamp = retryAt ? Date.parse(retryAt) : 0
  const waiting = Boolean(retryAt && retryAt !== releasedRetryAt && retryTimestamp > Date.now())

  useEffect(() => {
    if (!waiting || !retryAt) return
    let timer: number
    const releaseWhenReady = () => {
      const remaining = retryTimestamp - Date.now()
      if (remaining <= 0) {
        setReleasedRetryAt(retryAt)
      } else {
        timer = window.setTimeout(releaseWhenReady, Math.min(remaining, 2_147_483_647))
      }
    }
    releaseWhenReady()
    return () => window.clearTimeout(timer)
  }, [waiting, retryAt, retryTimestamp])

  if (!household && !businessTaxCode.test(code)) {
    return <p className="text-xs text-slate-600">Đối chiếu mã này trực tiếp trên giấy tờ.</p>
  }

  const submit = () => {
    if (disabled || waiting || lookup.isPending || (request.current && !request.current.signal.aborted)) return
    const controller = new AbortController()
    request.current = controller
    setConfirming(false)
    lookup.mutate(controller, {
      onError: (error) => {
        if (isAxiosError(error) && error.response?.status === 409) {
          lookup.reset()
          void onConflict(error)
        }
      },
    })
  }

  const business = result?.outcome === 'FOUND' ? result.business : null
  const unavailable = lookup.isError || (lookup.isSuccess && (!result || result.outcome === 'UNAVAILABLE'))
  const ocrName = dossier.assessment.checks.find((check) => check.code === 'LEGAL_NAME_MATCH')?.extractedValue
  const ocrCode = dossier.assessment.checks.find((check) => check.code === 'REGISTRATION_NUMBER_MATCH')?.extractedValue

  return (
    <section aria-label="Tra cứu mã số thuế" className="space-y-3 border-t border-slate-200/60 pt-3 text-xs">
      {confirming ? (
        <div className="space-y-2">
          <p>
            Xác nhận <strong>{code}</strong> là {household ? 'MST hộ kinh doanh' : 'MST doanh nghiệp hoặc chi nhánh'} trên giấy tờ.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={submit} disabled={disabled}>Xác nhận và tra cứu</Button>
            <Button size="sm" variant="ghost" onClick={() => setConfirming(false)}>Hủy</Button>
          </div>
        </div>
      ) : !unavailable && (
        <Button size="sm" variant="outline" onClick={() => setConfirming(true)} disabled={disabled}
          isLoading={lookup.isPending}>
          {lookup.isPending ? 'Đang tra cứu…' : 'Tra cứu mã số thuế'}
        </Button>
      )}

      <div role="status" className="space-y-2">
        {business && result && (
          <>
            <p className="font-semibold text-slate-900">Kết quả Casso IDKit</p>
            {business.trial && (
              <p className="font-medium text-amber-800">Dữ liệu Casso dùng thử. Chỉ dùng để kiểm thử tích hợp.</p>
            )}
            <dl className="grid gap-2 sm:grid-cols-2">
              <div><dt className="text-slate-500">MST đăng ký</dt><dd>{business.taxCode}</dd></div>
              <div><dt className="text-slate-500">{business.trial ? 'Tên trong dữ liệu thử' : 'Tên đăng ký'}</dt><dd>{business.name}</dd></div>
              <div><dt className="text-slate-500">Mã trên OCR</dt><dd>{ocrCode || 'Chưa có dữ liệu'}</dd></div>
              <div><dt className="text-slate-500">Tên trên OCR</dt><dd>{ocrName || 'Chưa có dữ liệu'}</dd></div>
              <div><dt className="text-slate-500">Trạng thái hoạt động</dt><dd>{business.status || 'Chưa có dữ liệu'}</dd></div>
              <div><dt className="text-slate-500">{business.trial ? 'Nguồn theo phản hồi thử' : 'Nguồn dữ liệu'}</dt><dd className="break-all">{business.source || 'Chưa có dữ liệu'}</dd></div>
              <div>
                <dt className="text-slate-500">Thời điểm tra cứu</dt>
                <dd><time dateTime={result.checkedAt}>{new Date(result.checkedAt).toLocaleString('vi-VN')}</time></dd>
              </div>
            </dl>
            {!business.trial && legalName && normalizeName(legalName) !== normalizeName(business.name) && (
              <p className="font-medium text-amber-800">Tên đăng ký khác tên đã khai. Vui lòng đối chiếu giấy tờ.</p>
            )}
          </>
        )}
        {result?.outcome === 'NOT_FOUND' && (
          <p className="text-amber-800">Không tìm thấy MST trên nguồn tra cứu. Vui lòng đối chiếu giấy tờ.</p>
        )}
        {unavailable && (
          <div className="space-y-2">
            <p className="text-amber-800">Chưa tra cứu được. Có thể kiểm tra trực tiếp trên giấy tờ.</p>
            {waiting && <p>Có thể thử lại sau {new Date(retryTimestamp).toLocaleString('vi-VN')}.</p>}
            <Button size="sm" variant="outline" onClick={submit} disabled={disabled || waiting}>Thử lại</Button>
          </div>
        )}
      </div>
    </section>
  )
}
