import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { Camera, Loader2, ScanLine, ShieldCheck, Zap } from 'lucide-react'
import { GateSettlementDialog } from './GateSettlementDialog'
import { NotificationDialog } from '@/shared/components/NotificationDialog'
import { scannerErrorFeedback } from './scannerErrorFeedback'
import type { Lot, Settlement } from '@/entities/operations'
import {
  getData,
  sendData,
  errorMessage,
  type Page,
} from '@/shared/api/resources'
import {
  Badge,
  Field,
  Notice,
  Panel,
  Workspace,
  button,
  control,
  money,
  secondary,
} from '@/shared/components/Workspace'
import {
  BarieCameraScanner,
  CameraSecurityNotice,
  CameraPermissionModal,
  checkCameraSecurityStatus,
} from '@/features/merchant/qr'

export function MerchantScannerPage() {
  const [params] = useSearchParams()
  const [mode, setMode] = useState<'check-in' | 'check-out'>('check-in')
  const [camera, setCamera] = useState(false)
  const [cameraError, setCameraError] = useState('')
  const [isPermModalOpen, setIsPermModalOpen] = useState(false)
  const [success, setSuccess] = useState('')
  const [confirmedCheckIn, setConfirmedCheckIn] = useState<string | null>(null)
  const [completedSettlement, setCompletedSettlement] = useState<Settlement | null>(null)
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment')
  const [autoSubmit, setAutoSubmit] = useState(true)
  const scanPending = useRef(false)
  const checkedIn = useRef(new Set<string>())
  const cache = useQueryClient()
  const securityStatus = checkCameraSecurityStatus()
  const form = useForm<{ bookingCode: string; parkingLotId: number }>({
    defaultValues: {
      bookingCode: params.get('code') || '',
      parkingLotId: Number(params.get('lot')) || undefined,
    },
  })
  const lots = useQuery({
    queryKey: ['scanner-lots'],
    queryFn: () =>
      getData<Page<Lot>>('/api/v1/merchant/parking-lots', { size: 100 }),
    retry: false,
  })
  useEffect(() => {
    const lotId = Number(params.get('lot'))
    if (
      lots.data?.content.some((lot) => lot.id === lotId) &&
      !form.formState.dirtyFields.parkingLotId
    ) {
      form.setValue('parkingLotId', lotId)
    }
  }, [lots.data, params, form])

  const scan = useMutation({
    mutationFn: (data: { bookingCode: string; parkingLotId: number }) =>
      sendData<Settlement | null>('post', `/api/v1/merchant/${mode}`, data),
    onSuccess: (_result, data) => {
      if (mode === 'check-out' && _result?.bookingStatus === 'COMPLETED') {
        setCompletedSettlement(_result)
      }
      if (mode === 'check-in') {
        checkedIn.current.add(`${data.parkingLotId}:${data.bookingCode}`)
        setConfirmedCheckIn(data.bookingCode)
      }
      setCamera(false)
      setSuccess('')
      void cache.invalidateQueries({ queryKey: ['merchant-bookings'] })
      void cache.invalidateQueries({ queryKey: ['merchant-booking'] })
      void cache.invalidateQueries({ queryKey: ['real-bookings'] })
      void cache.invalidateQueries({ queryKey: ['booking'] })
    },
    onError: () => setCamera(false),
    onSettled: () => { scanPending.current = false },
  })

  const submitScan = (data: { bookingCode: string; parkingLotId: number }) => {
    if (scanPending.current) return
    if (mode === 'check-in' && checkedIn.current.has(`${data.parkingLotId}:${data.bookingCode}`)) {
      return
    }
    scanPending.current = true
    setConfirmedCheckIn(null)
    setSuccess('')
    scan.mutate(data)
  }
  const submitScanRef = useRef(submitScan)
  useLayoutEffect(() => {
    submitScanRef.current = submitScan
  })

  const handleCameraScanSuccess = (raw: string) => {
    form.setValue('bookingCode', raw, { shouldValidate: true })
    setCamera(false)
    const lotId = form.getValues('parkingLotId')
    if (autoSubmit && lotId) {
      submitScanRef.current({ bookingCode: raw, parkingLotId: lotId })
    }
  }

  const handleCameraError = (errInfo: { type: string; message: string; canRetry?: boolean }) => {
    if (errInfo.type === 'PERMISSION_DENIED') {
      setIsPermModalOpen(true)
      setCamera(false)
    } else if (errInfo.canRetry) {
      // Keep BarieCameraScanner mounted so the operator can view inline error and click "Thử lại với Camera khác"
    } else {
      setCameraError(errInfo.message)
      setCamera(false)
    }
  }

  function changeMode(next: typeof mode) {
    setMode(next)
    setConfirmedCheckIn(null)
    scan.reset()
    setSuccess('')
  }

  const alreadyCheckedIn = mode === 'check-in' && checkedIn.current.has(
    `${form.watch('parkingLotId')}:${form.watch('bookingCode').trim()}`,
  )

  return (
    <Workspace
      title="Trạm kiểm soát QR"
      eyebrow="GATE CONTROL / MERCHANT"
      description="Quét vé, đối chiếu bãi đỗ, xác nhận lượt vào và quyết toán lượt ra."
    >
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Panel className="!bg-[#0a1120] !text-white border-slate-700/80 shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ScanLine className="text-emerald-400" />
              <h2 className="font-sora text-lg font-semibold tracking-tight">Camera tại cổng</h2>
            </div>
            <Badge value={camera ? 'CAMERA ĐANG BẬT' : 'CAMERA TẮT'} />
          </div>

          {/* Security Notice for Insecure Context (Mobile HTTP) */}
          {!securityStatus.isSupported && (
            <div className="mb-4">
              <CameraSecurityNotice
                onFocusManualInput={() => form.setFocus('bookingCode')}
              />
            </div>
          )}

          {/* Video Container with Clean Unified Aspect Ratio for both Camera ON & OFF */}
          <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-slate-700 bg-black shadow-inner">
            {camera ? (
              <BarieCameraScanner
                initialFacingMode={facingMode}
                onFacingModeChange={setFacingMode}
                autoSubmit={autoSubmit}
                onScan={handleCameraScanSuccess}
                onClose={() => setCamera(false)}
                onError={handleCameraError}
                onFocusManualInput={() => form.setFocus('bookingCode')}
              />
            ) : (
              <Camera size={48} className="text-slate-600" />
            )}
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {/* Auto-Confirm Switch (Consistent in both ON & OFF states) */}
            <div className="flex items-center justify-between bg-slate-900/90 px-3.5 py-2.5 rounded-xl border border-slate-700/70">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-200 hover:text-white select-none">
                <input
                  type="checkbox"
                  checked={autoSubmit}
                  onChange={(e) => setAutoSubmit(e.target.checked)}
                  className="w-4 h-4 rounded text-[#d95f00] focus:ring-[#d95f00] border-slate-600 bg-slate-800 cursor-pointer"
                />
                <span className="flex items-center gap-1.5 font-medium">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Tự động xác nhận khi quét trúng
                </span>
              </label>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-slate-300">
                {autoSubmit
                  ? 'Mã QR quét được sẽ tự động gửi lệnh xử lý cổng.'
                  : 'Mã nhận diện sẽ điền vào ô vé để bạn kiểm tra.'}
              </p>
              <div className="flex items-center gap-2">
                <button
                  className={button}
                  onClick={() => {
                    setCameraError('')
                    setCamera(!camera)
                  }}
                >
                  {camera ? 'Tắt camera' : 'Bật camera'}
                </button>
              </div>
            </div>
          </div>
        </Panel>

        <Panel title="Điều phối lượt xe">
          <div
            className="mb-6 grid grid-cols-2 gap-2"
            aria-label="Chế độ kiểm soát"
          >
            {(['check-in', 'check-out'] as const).map((value) => (
              <button
                disabled={scan.isPending}
                key={value}
                aria-pressed={mode === value}
                onClick={() => changeMode(value)}
                className={mode === value ? button : secondary}
              >
                {value === 'check-in' ? 'XE VÀO' : 'XE RA'}
              </button>
            ))}
          </div>
          <form
            className="space-y-5"
            onSubmit={form.handleSubmit(submitScan)}
          >
            <Field label="Bãi kiểm soát">
              <select
                className={control}
                value={form.watch('parkingLotId') || ''}
                {...form.register('parkingLotId', {
                  required: true,
                  valueAsNumber: true,
                  min: 1,
                })}
              >
                <option value="">Chọn bãi đỗ</option>
                {lots.data?.content.map((lot) => (
                  <option key={lot.id} value={lot.id}>
                    {lot.name}
                  </option>
                ))}
              </select>
            </Field>
            {lots.isError && <Notice error>{errorMessage(lots.error)}</Notice>}
            <Field label="Mã đặt chỗ / Nội dung QR">
              <input
                className={`${control} font-mono uppercase tracking-wider font-semibold text-base`}
                placeholder="VD: BK-2026-X89..."
                autoComplete="off"
                {...form.register('bookingCode', {
                  required: true,
                  setValueAs: (value: string) => value.trim(),
                })}
              />
            </Field>
            {Object.keys(form.formState.errors).length > 0 && (
              <Notice error>Chọn bãi và nhập mã vé hợp lệ.</Notice>
            )}
            <button
              type="submit"
              disabled={scan.isPending || !lots.data || alreadyCheckedIn}
              aria-busy={scan.isPending}
              className={`${button} w-full flex items-center justify-center gap-2`}
            >
              {scan.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                  <span>Đang xác nhận…</span>
                </>
              ) : alreadyCheckedIn ? (
                'Xe đã check-in'
              ) : mode === 'check-in' ? (
                'Xác nhận xe vào bãi'
              ) : (
                'Kiểm tra & quyết toán xe ra'
              )}
            </button>
            {alreadyCheckedIn && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">Vé này đã được ghi nhận vào bãi. Chọn XE RA để quyết toán hoặc nhập mã vé khác.</p>}
          </form>
          <div className="mt-6 flex gap-2 border-t border-brand-border pt-5 text-xs leading-relaxed text-brand-muted">
            <ShieldCheck size={18} className="shrink-0" />
            Mỗi lượt xác nhận được máy chủ kiểm tra quyền sở hữu và trạng thái
            vé.
          </div>
        </Panel>
      </div>

      {cameraError && <NotificationDialog title="Không thể bật camera" message={cameraError} variant="error" onClose={() => setCameraError('')} actionLabel="Đã hiểu" />}
      {scan.isError && <NotificationDialog {...scannerErrorFeedback(scan.error, mode)} variant="warning" onClose={() => scan.reset()} onAfterClose={() => form.setFocus('bookingCode')} actionLabel="Đã hiểu" />}
      {success && !completedSettlement && !scan.data && <NotificationDialog title="Đã cập nhật lượt xe" message={success} onClose={() => setSuccess('')} />}

      {confirmedCheckIn && (
        <NotificationDialog
          title="Xác nhận xe vào thành công"
          message="Xe đã được ghi nhận vào bãi."
          onClose={() => setConfirmedCheckIn(null)}
          actionLabel="Đã hiểu"
        >
          <div className="space-y-5 text-center">
            <div className="rounded-xl bg-brand-surface p-4">
              <p className="text-sm text-brand-muted">Mã đặt chỗ</p>
              <p className="mt-2 break-all font-mono font-semibold text-brand-navy">
                {confirmedCheckIn}
              </p>
            </div>
            <p className="text-sm text-brand-muted">Chọn XE RA khi cần check-out.</p>
          </div>
        </NotificationDialog>
      )}

      {completedSettlement && (
        <NotificationDialog title="Hoàn tất giao dịch" message="Đã hoàn tất checkout và trả chỗ." onClose={() => {
          setCompletedSettlement(null)
          setSuccess('')
          scan.reset()
        }}>
          <div className="space-y-5 text-center">
            <dl className="space-y-3 text-left">
              {[
                ['Mã đặt chỗ', completedSettlement.bookingCode],
                ['Tổng phí', money(completedSettlement.totalAmount)],
                ['Tiền cọc đã khấu trừ', money(completedSettlement.advanceDeposit)],
                ['Phương thức thanh toán phần còn lại', completedSettlement.finalPaymentMethod === 'CASH' ? 'Tiền mặt' : completedSettlement.finalPaymentMethod === 'PAYOS' ? 'PayOS' : 'Máy chủ đã xác nhận'],
                ['Còn phải thanh toán', money(0)],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <dt className="text-brand-muted">{label}</dt>
                  <dd className="break-all text-right font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
            <button type="button" className={`${button} w-full`} onClick={() => {
              setCompletedSettlement(null)
              setSuccess('')
              scan.reset()
              form.setValue('bookingCode', '')
            }}>Hoàn tất</button>
          </div>
        </NotificationDialog>
      )}

      {scan.data && mode === 'check-out' && !completedSettlement && (
        <GateSettlementDialog
          key={`${scan.variables?.parkingLotId}:${scan.data.bookingCode}`}
          settlement={scan.data}
          parkingLotId={scan.variables!.parkingLotId}
          onClose={() => { setSuccess(''); scan.reset() }}
          onComplete={result => {
            setCompletedSettlement(result)
            for (const queryKey of [
              ['merchant-bookings'],
              ['merchant-booking'],
              ['real-bookings'],
              ['booking'],
              ['merchant-revenue'],
              ['merchant-dashboard-summary'],
              ['merchant-revenue-stats'],
            ])
              void cache.invalidateQueries({ queryKey })
          }}
        />
      )}

      <CameraPermissionModal
        isOpen={isPermModalOpen}
        onClose={() => setIsPermModalOpen(false)}
        onRetry={() => {
          setIsPermModalOpen(false)
          setCamera(true)
        }}
      />
    </Workspace>
  )
}
