import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { Camera, Loader2, ScanLine, ShieldCheck, SwitchCamera, Zap } from 'lucide-react'
import type { Lot, Settlement } from '@/entities/operations'
import {
  getData,
  sendData,
  errorMessage,
  type Page,
} from '@/shared/api/resources'
import {
  Badge,
  Dialog,
  Field,
  Notice,
  Panel,
  Workspace,
  button,
  control,
  money,
  secondary,
} from '@/shared/components/Workspace'

interface ZXingReader {
  decodeFromConstraints(
    constraints: MediaStreamConstraints,
    videoElement: HTMLVideoElement,
    callback: (result: { getText(): string } | null, error: unknown) => void,
  ): Promise<unknown>
  reset(): void
}

function playBeepSound() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AudioContextClass) return
    const ctx = new AudioContextClass()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(880, ctx.currentTime) // 880Hz crisp terminal beep
    gain.gain.setValueAtTime(0.2, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.12)
  } catch {
    // Ignore audio errors on unsupported environments
  }
}

export function MerchantScannerPage() {
  const [params] = useSearchParams()
  const [mode, setMode] = useState<'check-in' | 'check-out'>('check-in')
  const [camera, setCamera] = useState(false)
  const [cameraError, setCameraError] = useState('')
  const [success, setSuccess] = useState('')
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment')
  const [autoSubmit, setAutoSubmit] = useState(true)
  const video = useRef<HTMLVideoElement>(null)
  const readerRef = useRef<ZXingReader | null>(null)
  const cache = useQueryClient()
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
    onSuccess: () => {
      setCamera(false)
      setSuccess(
        mode === 'check-in'
          ? 'Xe đã được ghi nhận vào bãi.'
          : 'Đã ghi nhận xe ra. Kiểm tra số tiền còn phải thu.',
      )
      void cache.invalidateQueries({ queryKey: ['merchant-bookings'] })
    },
  })

  const cash = useMutation({
    mutationFn: () =>
      sendData('post', '/api/v1/merchant/confirm-cash', scan.variables),
    onSuccess: () => {
      scan.reset()
      setSuccess('Đã xác nhận thu tiền mặt và trả chỗ thành công.')
      void cache.invalidateQueries({ queryKey: ['merchant-bookings'] })
    },
  })

  useEffect(() => {
    if (!camera) return
    let stopped = false
    let currentReader: ZXingReader | null = null

    const start = async () => {
      try {
        setCameraError('')
        const ZXing = (await import(
          'html5-qrcode/third_party/zxing-js.umd.js'
        )) as unknown as { BrowserQRCodeReader: new () => ZXingReader }
        if (stopped) return

        const reader: ZXingReader = new ZXing.BrowserQRCodeReader()
        readerRef.current = reader
        currentReader = reader

        if (!video.current) return

        await reader.decodeFromConstraints(
          {
            audio: false,
            video: {
              facingMode: { ideal: facingMode },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
          },
          video.current,
          (result) => {
            if (stopped) return
            const raw = result?.getText()?.trim()
            if (raw) {
              playBeepSound()
              if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate([40, 50, 40])
              }
              form.setValue('bookingCode', raw, {
                shouldValidate: true,
              })
              setCamera(false)

              // Instant Auto-Confirm (Quét phát ăn ngay)
              const lotId = form.getValues('parkingLotId')
              if (autoSubmit && lotId) {
                scan.mutate({ bookingCode: raw, parkingLotId: lotId })
              }
            }
          },
        )

        if (stopped) {
          reader.reset()
          if (video.current?.srcObject) {
            const stream = video.current.srcObject as MediaStream
            stream.getTracks().forEach((t) => t.stop())
            video.current.srcObject = null
          }
        }
      } catch {
        if (stopped) return
        setCameraError(
          'Không thể khởi động camera. Hãy kiểm tra quyền camera hoặc dùng kết nối HTTPS / localhost.',
        )
        setCamera(false)
      }
    }

    void start()
    return () => {
      stopped = true
      if (currentReader) {
        try {
          currentReader.reset()
        } catch {
          // ignore reset error
        }
      }
      if (video.current?.srcObject) {
        const stream = video.current.srcObject as MediaStream
        stream.getTracks().forEach((t) => t.stop())
        video.current.srcObject = null
      }
      readerRef.current = null
    }
  }, [camera, facingMode, autoSubmit, form, scan])

  function changeMode(next: typeof mode) {
    setMode(next)
    scan.reset()
    cash.reset()
    setSuccess('')
  }

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

          {/* Video Container with Clean Symmetrical Square Tracking Box */}
          <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-slate-700 bg-black shadow-inner">
            <video
              ref={video}
              muted
              playsInline
              autoPlay
              className={`absolute inset-0 h-full w-full object-cover ${camera ? '' : 'hidden'}`}
            />
            {camera && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute w-[min(230px,65%)] aspect-square rounded-2xl border-2 border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.35)] animate-pulse z-10"
              />
            )}
            {!camera && <Camera size={48} className="text-slate-600" />}
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {/* Auto-Confirm Switch */}
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
                {camera && (
                  <button
                    type="button"
                    className="text-xs px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 flex items-center gap-1.5 cursor-pointer transition-colors"
                    onClick={() => {
                      setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))
                    }}
                    title="Đổi camera trước / sau"
                  >
                    <SwitchCamera className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Đổi camera</span>
                  </button>
                )}
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
            onSubmit={form.handleSubmit((data) => {
              if (scan.isPending) return
              setSuccess('')
              cash.reset()
              scan.mutate(data)
            })}
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
              disabled={scan.isPending || !lots.data}
              aria-busy={scan.isPending}
              className={`${button} w-full flex items-center justify-center gap-2`}
            >
              {scan.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                  <span>Đang xác nhận…</span>
                </>
              ) : mode === 'check-in' ? (
                'Xác nhận xe vào bãi'
              ) : (
                'Kiểm tra & quyết toán xe ra'
              )}
            </button>
          </form>
          <div className="mt-6 flex gap-2 border-t border-brand-border pt-5 text-xs leading-relaxed text-brand-muted">
            <ShieldCheck size={18} className="shrink-0" />
            Mỗi lượt xác nhận được máy chủ kiểm tra quyền sở hữu và trạng thái
            vé.
          </div>
        </Panel>
      </div>

      {cameraError && <Notice error>{cameraError}</Notice>}
      {scan.isError && <Notice error>{errorMessage(scan.error)}</Notice>}
      {success && <Notice>{success}</Notice>}

      {scan.data && mode === 'check-out' && (
        <Dialog
          title="Quyết toán lượt đỗ"
          onClose={() => {
            if (!cash.isPending) scan.reset()
          }}
        >
          <div className="space-y-4">
            <p className="font-mono">{scan.data.bookingCode}</p>
            <Badge value={scan.data.bookingStatus} />
            <dl className="space-y-3">
              {[
                ['Thời gian đỗ', `${scan.data.parkingMinutes} phút`],
                ['Tổng phí', money(scan.data.totalAmount)],
                ['Cọc đã khấu trừ', money(scan.data.advanceDeposit)],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-sm">
                  <dt className="text-brand-muted">{label}</dt>
                  <dd className="font-semibold font-mono tabular-nums text-slate-900">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="rounded-xl bg-[#0a1120] p-6 text-white border border-slate-800 shadow-md">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">CÒN PHẢI THU</p>
              <p className="mt-2 font-sora text-3xl font-extrabold text-amber-400 tabular-nums">
                {money(scan.data.amountDue)}
              </p>
            </div>
            {cash.isError && <Notice error>{errorMessage(cash.error)}</Notice>}
            {scan.data.amountDue > 0 && (
              <button
                disabled={cash.isPending || cash.isSuccess}
                aria-busy={cash.isPending}
                className={`${button} w-full flex items-center justify-center gap-2`}
                onClick={() => {
                  if (cash.isPending || cash.isSuccess) return
                  cash.mutate()
                }}
              >
                {cash.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                    <span>Đang xác nhận…</span>
                  </>
                ) : (
                  'Đã nhận đủ tiền mặt · Hoàn tất lượt đỗ'
                )}
              </button>
            )}
            <p className="text-xs text-brand-muted">
              Chỉ xác nhận sau khi đã nhận đủ tiền. Việc điều khiển barie vật lý
              cần hệ thống cổng tích hợp riêng.
            </p>
          </div>
        </Dialog>
      )}
    </Workspace>
  )
}
