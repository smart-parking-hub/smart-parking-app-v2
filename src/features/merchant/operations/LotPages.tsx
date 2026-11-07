import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, useFieldArray } from 'react-hook-form'
import { Link, useParams } from 'react-router-dom'
import { MerchantLotNavigation } from '@/entities/parking-lot/components/MerchantLotNavigation'
import { MapPin, Warehouse, Loader2, CheckCircle2, X } from 'lucide-react'
import {
  type Lot,
  type Pricing,
  vehicleTypes,
  vehicleLabels,
} from '@/entities/operations'
import { getData, sendData, errorMessage } from '@/shared/api/resources'
import { QueryState } from '@/shared/components/QueryState'
import { ApiImage } from '@/shared/components/ApiImage'
import {
  Workspace,
  Panel,
  Metrics,
  Field,
  Notice,
  Badge,
  control,
  button,
  secondary,
  money,
} from '@/shared/components/Workspace'

export function MerchantLotPage({
  mode = 'detail',
}: {
  mode?: 'detail' | 'edit' | 'slots' | 'pricing'
}) {
  const { id } = useParams()
  const query = useQuery({
    queryKey: ['merchant-lot', id],
    queryFn: () => getData<Lot>(`/api/v1/merchant/parking-lots/${id}`),
    retry: false,
  })
  return (
    <Workspace
      title={
        {
          detail: 'Hồ sơ bãi đỗ',
          edit: 'Chỉnh sửa bãi đỗ',
          slots: 'Cấu hình sức chứa',
          pricing: 'Ma trận biểu phí',
        }[mode]
      }
      actions={
        <Link className={secondary} to="/merchant/parking-lots">
          ← Danh mục bãi
        </Link>
      }
    >
      <QueryState query={query}>
        {(lot) => <>
          <MerchantLotNavigation lotId={lot.id} status={lot.status} />
          <p className="text-sm text-brand-muted"><strong className="text-brand-navy">{lot.name}</strong> · Bãi #{lot.id}</p>
          {mode === 'detail' ? (
            <LotOverview lot={lot} />
          ) : mode === 'edit' ? (
            <LotEdit key={lot.id} lot={lot} />
          ) : mode === 'slots' ? (
            <SlotEditor key={lot.id} lot={lot} />
          ) : (
            <PricingEditor key={lot.id} lot={lot} />
          )}
        </>}
      </QueryState>
    </Workspace>
  )
}
export function LotOverview({ lot, showMap = false }: { lot: Lot; showMap?: boolean }) {
  const slots = lot.slots || []
  return (
    <>
      <Metrics
        items={[
          {
            label: 'Sức chứa',
            value: slots.reduce((n, r) => n + r.totalCapacity, 0),
            note: 'Tổng chỗ đã cấu hình',
          },
          {
            label: 'Còn trống',
            value: slots.reduce((n, r) => n + r.availableCapacity, 0),
          },
          { label: 'Nhóm phương tiện', value: slots.length },
          { label: 'Kiểm duyệt', value: <Badge value={lot.status} /> },
        ]}
      />
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Panel title={lot.name}>
          <p className="mb-5 flex items-start gap-2 text-sm text-brand-muted">
            <MapPin size={18} className="shrink-0" />
            {lot.address}
          </p>
          {lot.images?.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {lot.images.map((image) => (
                <ApiImage
                  key={image.id}
                  path={image.contentUrl}
                  alt={`Ảnh bãi đỗ ${lot.name}`}
                />
              ))}
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-xl bg-brand-surface text-brand-muted">
              <Warehouse size={40} />
              <span className="ml-3">Chưa có ảnh bãi</span>
            </div>
          )}
          {lot.reviewReason && (
            <div className="mt-5">
              <Notice>{lot.reviewReason}</Notice>
            </div>
          )}
        </Panel>
        <Panel title="Sức chứa theo phương tiện">
          <div className="space-y-5">
            {vehicleTypes.map((type) => {
              const slot = slots.find((row) => row.vehicleType === type)
              return (
                <div key={type}>
                  <div className="flex justify-between text-sm">
                    <span>{vehicleLabels[type]}</span>
                    <span className="font-mono">
                      {slot?.availableCapacity ?? 0} /{' '}
                      {slot?.totalCapacity ?? 0} trống
                    </span>
                  </div>
                  <progress
                    className="mt-2 h-2 w-full accent-brand-orange"
                    max={slot?.totalCapacity || 1}
                    value={slot?.availableCapacity || 0}
                  />
                </div>
              )
            })}
          </div>
          <a
            className={`${secondary} mt-6`}
            target="_blank"
            rel="noreferrer"
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lot.latitude},${lot.longitude}`)}`}
          >
            Xem vị trí trên bản đồ ↗
          </a>
        </Panel>
      </div>
      {showMap && <Panel title="Vị trí bãi đỗ">
        <p className="mb-4 text-sm text-brand-muted">{lot.address}</p>
        {Number.isFinite(lot.latitude) && Number.isFinite(lot.longitude) && Math.abs(lot.latitude) <= 90 && Math.abs(lot.longitude) <= 180 ? (
          <iframe
            title={`Bản đồ vị trí ${lot.name}`}
            className="h-80 w-full rounded-xl border-0 sm:h-96"
            src={`https://www.google.com/maps?q=${encodeURIComponent(`${lot.latitude},${lot.longitude}`)}&z=16&output=embed`}
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : <Notice>Chưa có tọa độ hợp lệ để hiển thị vị trí bãi trên bản đồ.</Notice>}
      </Panel>}
      <Panel title="Biểu phí hiện hành">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border">
                <th scope="col" className="p-3 text-left text-brand-muted">
                  Loại xe
                </th>
                <th scope="col" className="p-3 text-right text-brand-muted">
                  Giá giờ
                </th>
                <th scope="col" className="p-3 text-right text-brand-muted">
                  Hệ số cao điểm
                </th>
                <th scope="col" className="p-3 text-center text-brand-muted">
                  Khung cao điểm
                </th>
                <th scope="col" className="p-3 text-right text-brand-muted">
                  Hệ số quá giờ
                </th>
              </tr>
            </thead>
            <tbody>
              {vehicleTypes.map((type) => {
                const price = lot.pricingRules?.find(
                  (p) => p.vehicleType === type,
                )
                return (
                  <tr className="border-t border-brand-border hover:bg-white/5 transition-colors" key={type}>
                    <td className="p-3 font-medium text-left">{vehicleLabels[type]}</td>
                    <td className="p-3 text-right font-mono tabular-nums font-semibold">
                      {price ? money(price.basePricePerHour) : 'Chưa cấu hình'}
                    </td>
                    <td className="p-3 text-right font-mono tabular-nums">
                      {price?.surgeMultiplier != null ? `${price.surgeMultiplier}x` : '—'}
                    </td>
                    <td className="p-3 text-center font-mono">
                      {price?.surgeStartTime || '—'} –{' '}
                      {price?.surgeEndTime || '—'}
                    </td>
                    <td className="p-3 text-right font-mono tabular-nums">
                      {price?.overtimePenaltyMultiplier != null ? `${price.overtimePenaltyMultiplier}x` : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  )
}

function LotEdit({ lot }: { lot: Lot }) {
  const cache = useQueryClient()
  const form = useForm<{
    name: string
    address: string
    latitude: number
    longitude: number
  }>({ defaultValues: lot })
  const mutation = useMutation({
    mutationFn: (data: {
      name: string
      address: string
      latitude: number
      longitude: number
    }) => sendData('put', `/api/v1/merchant/parking-lots/${lot.id}`, data),
    onSuccess: () => {
      void cache.invalidateQueries({ queryKey: ['merchant-lot'] })
      void cache.invalidateQueries({ queryKey: ['merchant-parking-lots'] })
    },
  })
  return (
    <Panel title="Thông tin cơ sở">
      <form
        onSubmit={form.handleSubmit((data) => {
          if (mutation.isPending) return
          mutation.mutate({
            name: data.name,
            address: data.address,
            latitude: data.latitude,
            longitude: data.longitude,
          })
        })}
        className="grid gap-5 md:grid-cols-2"
      >
        {(['name', 'address', 'latitude', 'longitude'] as const).map((key) => (
          <Field
            key={key}
            label={
              {
                name: 'Tên bãi',
                address: 'Địa chỉ',
                latitude: 'Vĩ độ',
                longitude: 'Kinh độ',
              }[key]
            }
          >
            <input
              className={control}
              type={
                key === 'latitude' || key === 'longitude' ? 'number' : 'text'
              }
              step="any"
              {...form.register(key, {
                required: true,
                ...(key === 'latitude' || key === 'longitude'
                  ? {
                      valueAsNumber: true,
                      min: key === 'latitude' ? -90 : -180,
                      max: key === 'latitude' ? 90 : 180,
                    }
                  : { maxLength: key === 'name' ? 150 : 255 }),
              })}
            />
          </Field>
        ))}
        <SaveState
          pending={mutation.isPending}
          success={mutation.isSuccess}
          submittedAt={mutation.submittedAt}
          error={mutation.error}
          invalid={Object.keys(form.formState.errors).length > 0}
        />
      </form>
    </Panel>
  )
}

function SlotEditor({ lot }: { lot: Lot }) {
  const cache = useQueryClient()
  const form = useForm<{
    slots: {
      vehicleType: (typeof vehicleTypes)[number]
      totalCapacity: number
    }[]
  }>({
    defaultValues: {
      slots: vehicleTypes.map((vehicleType) => ({
        vehicleType,
        totalCapacity:
          lot.slots?.find((row) => row.vehicleType === vehicleType)
            ?.totalCapacity ?? 0,
      })),
    },
  })
  const mutation = useMutation({
    mutationFn: (data: {
      slots: {
        vehicleType: (typeof vehicleTypes)[number]
        totalCapacity: number
      }[]
    }) =>
      sendData(
        'put',
        `/api/v1/merchant/parking-lots/${lot.id}/slots/bulk`,
        data,
      ),
    onSuccess: () =>
      void cache.invalidateQueries({ queryKey: ['merchant-lot'] }),
  })
  return (
    <Panel title="Phân bổ chỗ đỗ">
      <form
        className="space-y-5"
        onSubmit={form.handleSubmit((data) => {
          if (mutation.isPending) return
          mutation.mutate(data)
        })}
      >
        {vehicleTypes.map((type, i) => {
          const currentSlot = lot.slots?.find((row) => row.vehicleType === type)
          const occupied = currentSlot
            ? Math.max(0, currentSlot.totalCapacity - currentSlot.availableCapacity)
            : 0

          return (
            <div
              key={type}
              className="grid items-center gap-4 border-b border-brand-border pb-5 sm:grid-cols-[1fr_220px]"
            >
              <div>
                <span className="font-medium">{vehicleLabels[type]}</span>
                {occupied > 0 && (
                  <p className="text-xs text-brand-muted mt-0.5">
                    Đang đỗ thực tế: <strong className="text-brand-orange">{occupied}</strong> xe (Khóa tối thiểu: {occupied})
                  </p>
                )}
              </div>
              <Field
                label={`Tổng sức chứa (${occupied > 0 ? `min: ${occupied}` : 'chỗ'})`}
              >
                <input
                  className={`${control} text-right font-mono tabular-nums`}
                  type="number"
                  min={occupied}
                  step="1"
                  {...form.register(`slots.${i}.totalCapacity`, {
                    required: true,
                    min: {
                      value: occupied,
                      message: `Không thể nhỏ hơn ${occupied} xe đang đỗ thực tế!`,
                    },
                    valueAsNumber: true,
                    validate: Number.isInteger,
                  })}
                />
              </Field>
            </div>
          )
        })}
        <SaveState
          pending={mutation.isPending}
          success={mutation.isSuccess}
          submittedAt={mutation.submittedAt}
          error={mutation.error}
          invalid={Object.keys(form.formState.errors).length > 0}
        />
      </form>
    </Panel>
  )
}

function PricingEditor({ lot }: { lot: Lot }) {
  const cache = useQueryClient()
  const form = useForm<{ pricingRules: Pricing[] }>({
    defaultValues: {
      pricingRules: vehicleTypes.map(
        (vehicleType) =>
          lot.pricingRules?.find((p) => p.vehicleType === vehicleType) || {
            vehicleType,
            basePricePerHour: 10000,
            surgeMultiplier: 1,
            surgeStartTime: null,
            surgeEndTime: null,
            overtimePenaltyMultiplier: 1,
          },
      ),
    },
  })
  const { fields } = useFieldArray({
    control: form.control,
    name: 'pricingRules',
  })
  const mutation = useMutation({
    mutationFn: (data: { pricingRules: Pricing[] }) =>
      sendData('put', `/api/v1/merchant/parking-lots/${lot.id}/pricing/bulk`, {
        pricingRules: data.pricingRules.map((p) => ({
          ...p,
          surgeStartTime: p.surgeStartTime || null,
          surgeEndTime: p.surgeEndTime || null,
        })),
      }),
    onSuccess: () =>
      void cache.invalidateQueries({ queryKey: ['merchant-lot'] }),
  })
  return (
    <Panel title="Biểu phí cho 5 loại phương tiện">
      <form
        className="space-y-6"
        onSubmit={form.handleSubmit((data) => {
          if (mutation.isPending) return
          mutation.mutate(data)
        })}
      >
        {fields.map((field, i) => (
          <fieldset
            key={field.id}
            className="rounded-xl border border-brand-border p-4 bg-white/2"
          >
            <legend className="px-2 font-sora font-semibold">
              {vehicleLabels[field.vehicleType]}
            </legend>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {(
                [
                  'basePricePerHour',
                  'surgeMultiplier',
                  'surgeStartTime',
                  'surgeEndTime',
                  'overtimePenaltyMultiplier',
                ] as const
              ).map((key) => {
                const time = key.endsWith('Time')
                return (
                  <Field
                    key={key}
                    label={
                      {
                        basePricePerHour: 'Giá giờ (VND)',
                        surgeMultiplier: 'Hệ số cao điểm',
                        surgeStartTime: 'Bắt đầu cao điểm',
                        surgeEndTime: 'Kết thúc cao điểm',
                        overtimePenaltyMultiplier: 'Hệ số quá giờ',
                      }[key]
                    }
                  >
                    <input
                      type={time ? 'time' : 'number'}
                      className={`${control} ${time ? 'text-center font-mono' : 'text-right font-mono tabular-nums'}`}
                      step={time ? undefined : '.01'}
                      {...form.register(
                        `pricingRules.${i}.${key}`,
                        time
                          ? {}
                          : {
                              required: true,
                              valueAsNumber: true,
                              min: key === 'basePricePerHour' ? 0.01 : 1,
                              max:
                                key === 'basePricePerHour' ? 99999999.99 : 9.99,
                            },
                      )}
                    />
                  </Field>
                )
              })}
            </div>
          </fieldset>
        ))}
        <SaveState
          pending={mutation.isPending}
          success={mutation.isSuccess}
          submittedAt={mutation.submittedAt}
          error={mutation.error}
          invalid={Object.keys(form.formState.errors).length > 0}
        />
      </form>
    </Panel>
  )
}

function SaveState({
  pending,
  success,
  submittedAt,
  error,
  invalid,
}: {
  pending: boolean
  success: boolean
  submittedAt: number
  error: unknown
  invalid: boolean
}) {
  const [showSuccess, setShowSuccess] = useState(false)
  useEffect(() => {
    setShowSuccess(success && !pending)
    if (!success || pending) return
    const timeout = window.setTimeout(() => setShowSuccess(false), 4000)
    return () => window.clearTimeout(timeout)
  }, [success, pending, submittedAt])

  return (
    <div className="space-y-4 md:col-span-2">
      {invalid && <Notice error>Vui lòng kiểm tra các giá trị đã nhập.</Notice>}
      {Boolean(error) && <Notice error>{errorMessage(error)}</Notice>}
      {showSuccess && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-20 right-4 left-4 sm:left-auto z-50 flex items-center gap-3 rounded-xl border border-status-success-border bg-surface-card px-4 py-3 text-text-primary shadow-lg sm:max-w-sm font-inter text-sm"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0 text-status-success" aria-hidden="true" />
          <span>Đã lưu cấu hình thành công.</span>
          <button
            type="button"
            aria-label="Đóng thông báo thành công"
            onClick={() => setShowSuccess(false)}
            className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-muted hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
      <button
        className={`${button} flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:pointer-events-none`}
        disabled={pending}
        aria-busy={pending}
      >
        {pending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span>Đang lưu…</span>
          </>
        ) : (
          'Lưu thay đổi'
        )}
      </button>
    </div>
  )
}
