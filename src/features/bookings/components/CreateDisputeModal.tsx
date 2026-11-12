import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  Eye,
  FileImage,
  Info,
  Loader2,
  Receipt,
  ShieldAlert,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import type { Dispute } from '@/entities/operations'
import { errorMessage, getData, type Page } from '@/shared/api/resources'
import { Dialog } from '@/shared/components/Dialog'
import { Select } from '@/shared/components/Select'
import { Notice, control, secondary } from '@/shared/components/Workspace'
import { formatMoney, statusLabels, type Booking } from '@/features/booking-flow'
import {
  submitDriverDispute,
  uploadDisputeEvidence,
} from '@/features/disputes/api/driverDisputesApi'
import {
  DISPUTE_ACCEPTED_IMAGE_TYPES,
  DISPUTE_DESCRIPTION_MAX_LENGTH,
  DISPUTE_MAX_ATTACHMENTS,
  DISPUTE_MAX_FILE_SIZE_BYTES,
  DISPUTE_REASON_MAX_LENGTH,
  DISPUTE_REASON_PRESETS,
  createDisputeSchema,
  isBookingEligibleForDispute,
  type CreateDisputeFormValues,
  type DisputeBookingSummary,
} from '../schemas/disputeSchemas'

interface AttachmentPreviewItem {
  id: string
  file: File
  name: string
  sizeBytes: number
  previewUrl: string
}

export interface CreateDisputeModalProps {
  isOpen?: boolean
  onClose: () => void
  initialBooking?: DisputeBookingSummary | null
  initialBookingId?: string | number | null
  bookings?: DisputeBookingSummary[]
  onSuccess?: (dispute: Dispute) => void
}

function formatBytes(sizeBytes: number): string {
  if (sizeBytes < 1024) return `${sizeBytes} B`
  if (sizeBytes < 1024 * 1024) return `${Math.round(sizeBytes / 1024)} KB`
  return `${(sizeBytes / (1024 * 1024)).toFixed(2)} MB`
}

function safeCreateObjectUrl(file: File): string {
  if (typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
    try {
      return URL.createObjectURL(file)
    } catch {
      return ''
    }
  }
  return ''
}

function safeRevokeObjectUrl(url: string) {
  if (url && typeof URL !== 'undefined' && typeof URL.revokeObjectURL === 'function') {
    try {
      URL.revokeObjectURL(url)
    } catch {
      // Ignore cleanup errors in non-browser environments
    }
  }
}

async function fetchBookingsForDisputeSafe(): Promise<DisputeBookingSummary[]> {
  try {
    const raw = await getData<unknown>('/api/v1/bookings', { size: 100 })
    if (
      raw &&
      typeof raw === 'object' &&
      'content' in raw &&
      Array.isArray((raw as { content?: unknown }).content)
    ) {
      return (raw as { content: unknown[] }).content.filter(
        (item): item is DisputeBookingSummary =>
          item !== null &&
          typeof item === 'object' &&
          'id' in item &&
          'bookingCode' in item &&
          typeof (item as { id?: unknown }).id === 'number',
      )
    }
  } catch {
    // Graceful degradation: user can still enter numeric ID Booking manually
  }
  return []
}

function bookingStatusText(status: string): string {
  return statusLabels[status as Booking['status']] ?? status
}

export function CreateDisputeModal({
  isOpen = true,
  onClose,
  initialBooking = null,
  initialBookingId = null,
  bookings: providedBookings,
  onSuccess,
}: CreateDisputeModalProps) {
  const queryClient = useQueryClient()
  const bookingFieldId = useId()
  const reasonFieldId = useId()
  const presetGroupLabelId = useId()
  const descriptionFieldId = useId()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const attachmentUrlsRef = useRef<AttachmentPreviewItem[]>([])

  const parsedInitialBookingId = useMemo(() => {
    if (initialBooking?.id) return initialBooking.id
    if (initialBookingId !== null && initialBookingId !== undefined && initialBookingId !== '') {
      const numeric = Number(initialBookingId)
      return Number.isInteger(numeric) && numeric > 0 ? numeric : undefined
    }
    return undefined
  }, [initialBooking?.id, initialBookingId])

  const shouldFetchBookings = Boolean(isOpen && !initialBooking && !providedBookings)
  const bookingsQuery = useQuery({
    queryKey: ['driver-bookings-for-dispute'],
    queryFn: fetchBookingsForDisputeSafe,
    enabled: shouldFetchBookings,
    retry: false,
    staleTime: 30_000,
  })

  const availableBookings = useMemo(() => {
    const source = providedBookings ?? bookingsQuery.data ?? []
    return source.filter((item) => isBookingEligibleForDispute(item.status) || item.id === parsedInitialBookingId)
  }, [providedBookings, bookingsQuery.data, parsedInitialBookingId])

  const [manualBookingEntry, setManualBookingEntry] = useState(false)
  const [selectedPresetId, setSelectedPresetId] = useState<string>('')
  const [attachments, setAttachments] = useState<AttachmentPreviewItem[]>([])
  const [attachmentError, setAttachmentError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [zoomedAttachment, setZoomedAttachment] = useState<AttachmentPreviewItem | null>(null)

  const matchedPreselectedBooking = useMemo(() => {
    if (initialBooking) return initialBooking
    if (!parsedInitialBookingId) return null
    return availableBookings.find((b) => b.id === parsedInitialBookingId) ?? null
  }, [initialBooking, availableBookings, parsedInitialBookingId])

  const showBookingDropdown = !initialBooking && availableBookings.length > 0 && !manualBookingEntry

  const form = useForm<CreateDisputeFormValues>({
    resolver: zodResolver(createDisputeSchema),
    defaultValues: {
      bookingId: parsedInitialBookingId as number,
      merchantId: matchedPreselectedBooking?.merchantId ?? undefined,
      reason: '',
      description: '',
    },
  })

  const watchedBookingId = form.watch('bookingId')
  const watchedReason = form.watch('reason') ?? ''
  const watchedDescription = form.watch('description') ?? ''

  // Sync booking & merchantId when initialBooking or availableBookings load
  useEffect(() => {
    if (initialBooking) {
      form.setValue('bookingId', initialBooking.id, { shouldValidate: false })
      form.setValue('merchantId', initialBooking.merchantId ?? undefined)
      return
    }
    if (parsedInitialBookingId) {
      form.setValue('bookingId', parsedInitialBookingId, { shouldValidate: false })
      const matched = availableBookings.find((item) => item.id === parsedInitialBookingId)
      if (matched) {
        form.setValue('merchantId', matched.merchantId ?? undefined)
      }
    }
  }, [initialBooking, parsedInitialBookingId, availableBookings, form])

  // Keep ref in sync for cleanup on unmount
  useEffect(() => {
    attachmentUrlsRef.current = attachments
  }, [attachments])

  useEffect(() => {
    return () => {
      for (const item of attachmentUrlsRef.current) {
        safeRevokeObjectUrl(item.previewUrl)
      }
    }
  }, [])

  const selectedBookingContext = useMemo(() => {
    if (initialBooking) return initialBooking
    if (!watchedBookingId) return null
    return availableBookings.find((item) => item.id === Number(watchedBookingId)) ?? null
  }, [initialBooking, watchedBookingId, availableBookings])

  const activePreset = useMemo(
    () => DISPUTE_REASON_PRESETS.find((preset) => preset.id === selectedPresetId),
    [selectedPresetId],
  )

  const bookingSelectOptions = useMemo(
    () =>
      availableBookings.map((item) => ({
        value: String(item.id),
        label: `#${item.id} · ${item.bookingCode} · ${item.parkingLotName || `Bãi #${item.parkingLotId ?? ''}`}`,
        description: item.vehiclePlate ? `Biển số: ${item.vehiclePlate}` : undefined,
        badge: bookingStatusText(item.status),
      })),
    [availableBookings],
  )

  const handleSelectPreset = (presetId: string, label: string) => {
    setSelectedPresetId(presetId)
    form.setValue('reason', label, { shouldValidate: true, shouldDirty: true })
  }

  const handleFilesSelected = (files: File[]) => {
    setAttachmentError(null)
    if (!files.length) return

    const nextItems: AttachmentPreviewItem[] = []
    for (const file of files) {
      if (attachments.length + nextItems.length >= DISPUTE_MAX_ATTACHMENTS) {
        setAttachmentError(`Chỉ có thể đính kèm tối đa ${DISPUTE_MAX_ATTACHMENTS} ảnh cho mỗi hồ sơ.`)
        break
      }
      if (!DISPUTE_ACCEPTED_IMAGE_TYPES.includes(file.type as (typeof DISPUTE_ACCEPTED_IMAGE_TYPES)[number])) {
        setAttachmentError(`Tệp "${file.name}" không đúng định dạng. Chỉ hỗ trợ ảnh JPG, PNG hoặc WebP.`)
        continue
      }
      if (file.size > DISPUTE_MAX_FILE_SIZE_BYTES) {
        setAttachmentError(`Ảnh "${file.name}" vượt quá giới hạn 5 MB. Vui lòng chọn ảnh dung lượng nhỏ hơn.`)
        continue
      }
      nextItems.push({
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        file,
        name: file.name,
        sizeBytes: file.size,
        previewUrl: safeCreateObjectUrl(file),
      })
    }

    if (nextItems.length > 0) {
      setAttachments((prev) => [...prev, ...nextItems])
    }
  }

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => {
      const target = prev.find((item) => item.id === id)
      if (target) {
        safeRevokeObjectUrl(target.previewUrl)
      }
      return prev.filter((item) => item.id !== id)
    })
    if (zoomedAttachment?.id === id) {
      setZoomedAttachment(null)
    }
    setAttachmentError(null)
  }

  const mutation = useMutation({
    mutationFn: async (values: CreateDisputeFormValues) => {
      const resolvedMerchantId =
        values.merchantId ?? selectedBookingContext?.merchantId ?? undefined
      const resolvedParkingLotId =
        selectedBookingContext?.parkingLotId ?? initialBooking?.parkingLotId ?? undefined

      const cleanDescription = values.description.trim()
      let evidenceUrls: string[] = []
      if (attachments.length > 0) {
        const uploaded = await uploadDisputeEvidence(
          attachments.map((item) => item.file),
        )
        evidenceUrls = uploaded.map((item) => {
          if (item.url && /^https?:\/\//i.test(item.url)) {
            return item.url
          }
          const origin =
            typeof window !== 'undefined' && window.location?.origin
              ? window.location.origin
              : 'http://localhost:8088'
          return new URL(item.contentUrl, origin).toString()
        })
      }

      return submitDriverDispute({
        bookingId: values.bookingId,
        ...(typeof resolvedMerchantId === 'number' && resolvedMerchantId > 0
          ? { merchantId: resolvedMerchantId }
          : {}),
        ...(typeof resolvedParkingLotId === 'number' && resolvedParkingLotId > 0
          ? { parkingLotId: resolvedParkingLotId }
          : {}),
        reason: values.reason.trim(),
        description: cleanDescription,
        ...(evidenceUrls.length > 0 ? { evidenceUrls } : {}),
      })
    },
    onSuccess: (created) => {
      queryClient.setQueryData<Page<Dispute>>(
        ['disputes', 'driver', undefined, 0],
        (prev) => {
          if (!prev || !Array.isArray(prev.content)) return prev
          const exists = prev.content.some((item) => item.id === created.id)
          if (exists) {
            return {
              ...prev,
              content: prev.content.map((item) =>
                item.id === created.id ? created : item,
              ),
            }
          }
          return {
            ...prev,
            content: [created, ...prev.content],
            totalElements:
              typeof prev.totalElements === 'number'
                ? prev.totalElements + 1
                : prev.content.length + 1,
          }
        },
      )
      if (created?.id) {
        queryClient.setQueryData(
          ['disputes', 'driver', String(created.id), 0],
          created,
        )
      }
      void queryClient.invalidateQueries({ queryKey: ['disputes'] })
      void queryClient.invalidateQueries({ queryKey: ['driver-disputes-lookup'] })
      void queryClient.invalidateQueries({ queryKey: ['real-bookings'] })
      onSuccess?.(created)
      onClose()
    },
  })

  if (!isOpen) return null

  const serverError = mutation.isError ? errorMessage(mutation.error) : null
  const isConflictError =
    Boolean(serverError?.toLowerCase().includes('đã có khiếu nại')) ||
    (typeof mutation.error === 'object' &&
      mutation.error !== null &&
      'response' in mutation.error &&
      (mutation.error as { response?: { status?: number } }).response?.status === 409)

  return (
    <Dialog
      isOpen={isOpen}
      onClose={() => {
        if (!mutation.isPending) onClose()
      }}
      title="Gửi phản ánh về lượt đỗ"
      description="Gửi yêu cầu đối soát tới quản trị viên và chủ bãi khi bị thu phụ phí, sai cước hoặc sự cố bãi đỗ."
      maxWidth="lg"
      closeOnBackdrop={!mutation.isPending}
    >
      <form
        className="space-y-5"
        noValidate
        onSubmit={form.handleSubmit((values) => {
          if (mutation.isPending) return
          mutation.mutate(values)
        })}
      >
        {/* 1. Ngữ cảnh Booking / Chọn Booking */}
        {initialBooking ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-brand-primary">
                  Đơn đỗ xe đang khiếu nại
                </p>
                <h3 className="mt-1 font-sora text-base font-bold text-slate-900">
                  {initialBooking.parkingLotName || `Bãi đỗ #${initialBooking.parkingLotId ?? initialBooking.id}`}
                </h3>
                {initialBooking.parkingLotAddress && (
                  <p className="mt-0.5 text-xs text-slate-500">{initialBooking.parkingLotAddress}</p>
                )}
              </div>
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 font-mono text-xs font-semibold text-slate-800">
                {initialBooking.bookingCode} · #{initialBooking.id}
              </span>
            </div>

            <dl className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-200/80 pt-3 text-xs sm:grid-cols-4">
              <div>
                <dt className="text-slate-500">Biển số</dt>
                <dd className="mt-0.5 font-mono font-semibold text-slate-900">
                  {initialBooking.vehiclePlate || '—'}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Trạng thái</dt>
                <dd className="mt-0.5 font-semibold text-slate-900">
                  {bookingStatusText(initialBooking.status)}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Tiền cọc</dt>
                <dd className="mt-0.5 font-mono font-semibold text-slate-900">
                  {typeof initialBooking.advanceDeposit === 'number'
                    ? formatMoney(initialBooking.advanceDeposit)
                    : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Tổng phí</dt>
                <dd className="mt-0.5 font-mono font-semibold text-slate-900">
                  {typeof initialBooking.totalAmount === 'number'
                    ? formatMoney(initialBooking.totalAmount)
                    : 'Chưa quyết toán'}
                </dd>
              </div>
            </dl>

            {initialBooking.status === 'PENDING_CHECKIN' && (
              <p className="mt-3 flex items-start gap-1.5 rounded-lg border border-amber-200 bg-amber-50/80 px-3 py-2 text-xs text-amber-900">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-700" aria-hidden="true" />
                <span>
                  Đơn này đã thanh toán giữ chỗ nhưng chưa check-in. Bạn có thể gửi khiếu nại ngay nếu bãi đóng cửa, hết chỗ hoặc từ chối tiếp nhận.
                </span>
              </p>
            )}
          </div>
        ) : showBookingDropdown ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor={bookingFieldId} className="text-sm font-semibold text-slate-900">
                Chọn lượt đỗ xe (ID Booking) <span className="text-rose-600">*</span>
              </label>
              <button
                type="button"
                onClick={() => setManualBookingEntry(true)}
                className="text-xs font-semibold text-brand-primary hover:underline cursor-pointer"
              >
                Nhập ID Booking thủ công
              </button>
            </div>
            <Select
              id={bookingFieldId}
              value={watchedBookingId ? String(watchedBookingId) : ''}
              onChange={(val) => {
                const numeric = Number(val)
                if (Number.isInteger(numeric) && numeric > 0) {
                  const found = availableBookings.find((b) => b.id === numeric)
                  form.setValue('bookingId', numeric, { shouldValidate: true, shouldDirty: true })
                  form.setValue('merchantId', found?.merchantId ?? undefined)
                } else {
                  form.setValue('bookingId', undefined as unknown as number, { shouldValidate: true })
                  form.setValue('merchantId', undefined)
                }
              }}
              options={bookingSelectOptions}
              placeholder="— Chọn đơn đỗ xe cần khiếu nại —"
              ariaLabel="Mở danh sách đơn đỗ xe"
              variant="default"
              size="lg"
              triggerClassName="border-brand-border text-sm font-medium focus:border-brand-primary focus:ring-brand-primary/20"
              dropdownClassName="w-full max-w-full"
            />
            {selectedBookingContext && (
              <p className="text-xs text-slate-500">
                Chủ bãi liên kết: <span className="font-mono font-semibold text-slate-700">#{selectedBookingContext.merchantId ?? 'Chưa xác định'}</span> · Tiền cọc:{' '}
                <span className="font-mono font-semibold text-slate-700">
                  {typeof selectedBookingContext.advanceDeposit === 'number'
                    ? formatMoney(selectedBookingContext.advanceDeposit)
                    : '—'}
                </span>
              </p>
            )}
            {form.formState.errors.bookingId && (
              <p role="alert" className="flex items-center gap-1.5 text-xs font-medium text-rose-600">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{form.formState.errors.bookingId.message}</span>
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor={bookingFieldId} className="text-sm font-semibold text-slate-900">
                ID Booking <span className="text-rose-600">*</span>
              </label>
              {availableBookings.length > 0 && (
                <button
                  type="button"
                  onClick={() => setManualBookingEntry(false)}
                  className="text-xs font-semibold text-brand-primary hover:underline cursor-pointer"
                >
                  Chọn từ danh sách đơn đỗ
                </button>
              )}
            </div>
            <input
              id={bookingFieldId}
              type="number"
              min={1}
              placeholder="Ví dụ: 9081"
              className={control}
              {...form.register('bookingId', { valueAsNumber: true })}
            />
            {form.formState.errors.bookingId && (
              <p role="alert" className="flex items-center gap-1.5 text-xs font-medium text-rose-600">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{form.formState.errors.bookingId.message}</span>
              </p>
            )}
          </div>
        )}

        {/* 2. Nhóm lý do chọn nhanh + Ô nhập lý do */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <span id={presetGroupLabelId} className="text-sm font-semibold text-slate-900">
              Chọn nhanh nhóm sự cố
            </span>
            <span className="text-xs text-slate-500">Chạm để điền nhanh</span>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-labelledby={presetGroupLabelId}>
            {DISPUTE_REASON_PRESETS.map((preset) => {
              const isSelected = selectedPresetId === preset.id || watchedReason === preset.label
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset.id, preset.label)}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer text-left ${
                    isSelected
                      ? 'border-brand-primary bg-brand-primary-subtle text-brand-primary-active shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {isSelected && <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-brand-primary" aria-hidden="true" />}
                  <span>{preset.label}</span>
                </button>
              )
            })}
            <button
              type="button"
              onClick={() => {
                setSelectedPresetId('OTHER')
                if (DISPUTE_REASON_PRESETS.some((p) => p.label === watchedReason)) {
                  form.setValue('reason', '', { shouldValidate: false })
                }
              }}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                selectedPresetId === 'OTHER'
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>Lý do khác</span>
            </button>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor={reasonFieldId} className="text-sm font-semibold text-slate-900">
                Lý do khiếu nại <span className="text-rose-600">*</span>
              </label>
              <span className="font-mono text-xs text-slate-400">
                {watchedReason.length}/{DISPUTE_REASON_MAX_LENGTH}
              </span>
            </div>
            <input
              id={reasonFieldId}
              type="text"
              maxLength={DISPUTE_REASON_MAX_LENGTH}
              placeholder="Chọn gợi ý phía trên hoặc nhập lý do ngắn gọn..."
              className={control}
              {...form.register('reason')}
            />
            {activePreset && (
              <p className="text-xs text-slate-500">{activePreset.hint}</p>
            )}
            {form.formState.errors.reason && (
              <p role="alert" className="flex items-center gap-1.5 text-xs font-medium text-rose-600">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{form.formState.errors.reason.message}</span>
              </p>
            )}
          </div>
        </div>

        {/* 3. Mô tả chi tiết sự việc */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <label htmlFor={descriptionFieldId} className="text-sm font-semibold text-slate-900">
              Mô tả chi tiết sự việc
            </label>
            <span className="font-mono text-xs text-slate-400">
              {watchedDescription.length}/{DISPUTE_DESCRIPTION_MAX_LENGTH}
            </span>
          </div>
          <textarea
            id={descriptionFieldId}
            rows={4}
            maxLength={DISPUTE_DESCRIPTION_MAX_LENGTH}
            placeholder="Nêu rõ thời điểm xảy ra sự cố, số tiền bị thu thêm tại cổng (nếu có), vị trí làn xe và yêu cầu xử lý..."
            className={control}
            {...form.register('description')}
          />
          <p className="flex items-center gap-1.5 text-xs text-slate-500">
            <Receipt className="h-3.5 w-3.5 shrink-0 text-brand-primary" aria-hidden="true" />
            <span>Mẹo: Ghi rõ số tiền chênh lệch và thời gian phát sinh để Admin đối soát nhanh với lịch sử cổng.</span>
          </p>
          {form.formState.errors.description && (
            <p role="alert" className="flex items-center gap-1.5 text-xs font-medium text-rose-600">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{form.formState.errors.description.message}</span>
            </p>
          )}
        </div>

        {/* 4. Đính kèm hình ảnh bằng chứng / biên lai */}
        <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Camera className="h-4 w-4 text-brand-primary" aria-hidden="true" />
              <span className="text-sm font-semibold text-slate-900">
                Hình ảnh biên lai / hiện trường
              </span>
            </div>
            <span className="rounded-full bg-white px-2.5 py-0.5 font-mono text-xs font-semibold text-slate-700 border border-slate-200">
              {attachments.length}/{DISPUTE_MAX_ATTACHMENTS} ảnh
            </span>
          </div>

          {attachmentError && (
            <div role="alert" className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-800">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" aria-hidden="true" />
              <span>{attachmentError}</span>
            </div>
          )}

          {attachments.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {attachments.map((item) => (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-2xs transition-all duration-200 hover:border-[#d95f00]/60 hover:shadow-md"
                >
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-slate-100">
                    {item.previewUrl ? (
                      <img
                        src={item.previewUrl}
                        alt={`Ảnh bằng chứng ${item.name}`}
                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-400">
                        <FileImage className="h-7 w-7" aria-hidden="true" />
                      </div>
                    )}
                    <div className="absolute right-1.5 top-1.5 flex items-center gap-1">
                      {item.previewUrl && (
                        <button
                          type="button"
                          onClick={() => setZoomedAttachment(item)}
                          aria-label={`Phóng to ảnh ${item.name}`}
                          className="rounded-lg bg-slate-900/75 p-1.5 text-white hover:bg-slate-900 transition-colors cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(item.id)}
                        aria-label={`Xóa ảnh ${item.name}`}
                        className="rounded-lg bg-rose-600/90 p-1.5 text-white hover:bg-rose-700 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-1.5 px-1">
                    <p className="truncate text-xs font-semibold text-slate-800" title={item.name}>
                      {item.name}
                    </p>
                    <p className="font-mono text-[11px] text-slate-500">{formatBytes(item.sizeBytes)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {attachments.length < DISPUTE_MAX_ATTACHMENTS && (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(event) => {
                event.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  setIsDragging(false)
                }
              }}
              onDrop={(event) => {
                event.preventDefault()
                setIsDragging(false)
                handleFilesSelected(Array.from(event.dataTransfer.files))
              }}
              className={`group/dropzone flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-4 py-6 text-center transition-all duration-200 ${
                isDragging
                  ? 'border-[#d95f00] bg-orange-50/70 ring-2 ring-[#d95f00]/20'
                  : 'border-slate-300 bg-white hover:border-[#d95f00] hover:bg-orange-50/40 hover:shadow-xs'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                aria-label="Đính kèm hình ảnh bằng chứng"
                className="sr-only"
                tabIndex={-1}
                onChange={(event) => {
                  handleFilesSelected(Array.from(event.target.files ?? []))
                  event.target.value = ''
                }}
              />
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  fileInputRef.current?.click()
                }}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-brand-border bg-white px-4 py-2.5 text-sm font-semibold text-brand-navy shadow-2xs transition-all duration-200 group-hover/dropzone:border-[#d95f00]/60 group-hover/dropzone:bg-[#fff7ed] group-hover/dropzone:text-[#b84e00] hover:border-[#d95f00] hover:bg-[#fff7ed] hover:text-[#b84e00] hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-2 active:scale-[0.99]"
              >
                <Upload
                  className="h-4 w-4 text-brand-primary transition-transform duration-200 group-hover/dropzone:-translate-y-0.5"
                  aria-hidden="true"
                />
                <span>Chọn ảnh biên lai / hiện trường</span>
              </button>
              <p className="mt-2.5 text-xs text-slate-500 transition-colors group-hover/dropzone:text-slate-700">
                Kéo thả hoặc nhấn vào khung này để chọn ảnh JPG, PNG, WebP · Tối đa 5 MB/ảnh · Tối đa {DISPUTE_MAX_ATTACHMENTS} ảnh
              </p>
            </div>
          )}

          <p className="flex items-start gap-2 rounded-lg border border-sky-200/80 bg-sky-50/70 px-3 py-2 text-xs text-sky-900">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-700" aria-hidden="true" />
            <span>
              Ảnh chứng từ hợp lệ (JPG, PNG, WebP · tối đa 5 MB/ảnh) sẽ được tải lên máy chủ cùng hồ sơ để Admin, Chủ bãi và bạn xem lại trực tiếp trong chi tiết khiếu nại.
            </span>
          </p>
        </div>

        {/* Lightbox nhanh cho ảnh preview trong modal */}
        {zoomedAttachment && zoomedAttachment.previewUrl && (
          <div className="relative rounded-xl border border-slate-300 bg-slate-950 p-3 text-white">
            <div className="mb-2 flex items-center justify-between gap-2 text-xs">
              <span className="truncate font-semibold">{zoomedAttachment.name}</span>
              <button
                type="button"
                onClick={() => setZoomedAttachment(null)}
                aria-label="Đóng xem ảnh phóng to"
                className="rounded-lg bg-white/15 p-1 hover:bg-white/25 cursor-pointer"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <img
              src={zoomedAttachment.previewUrl}
              alt={zoomedAttachment.name}
              className="mx-auto max-h-64 rounded-lg object-contain"
            />
          </div>
        )}

        {/* Lỗi từ Server / Conflict 409 */}
        {serverError && (
          <Notice error>
            <div className="flex flex-col gap-2">
              <span>{serverError}</span>
              {isConflictError && (
                <Link
                  to="/disputes"
                  onClick={onClose}
                  className="inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-red-900 underline"
                >
                  <ShieldAlert className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Đi tới Trung tâm khiếu nại để xem hồ sơ đang mở</span>
                </Link>
              )}
            </div>
          </Notice>
        )}

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-4">
          <button
            type="button"
            className={secondary}
            disabled={mutation.isPending}
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            aria-busy={mutation.isPending}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#d95f00] px-5 py-3 text-sm font-semibold text-white hover:bg-[#b84e00] active:bg-[#9e4300] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-2 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            <span>{mutation.isPending ? 'Đang gửi…' : 'Gửi khiếu nại'}</span>
          </button>
        </div>
      </form>
    </Dialog>
  )
}
