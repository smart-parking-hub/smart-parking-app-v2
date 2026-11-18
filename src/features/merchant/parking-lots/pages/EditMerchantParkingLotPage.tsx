import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Star, Trash2, Loader2, X } from 'lucide-react'
import { ApiImage } from '@/shared/components/ApiImage'
import { Workspace, Panel, Notice, Field, Badge, Dialog, control, button, secondary } from '@/shared/components/Workspace'
import { errorMessage } from '@/shared/api/resources'
import { CreateParkingLotMapPicker } from '../components/CreateParkingLotMapPicker'
import {
  fetchMerchantParkingLotDetail,
  updateMerchantParkingLot,
  uploadAdditionalLotImages,
  deleteMerchantParkingLotImage,
  setCoverMerchantParkingLotImage,
  type MerchantLotRecord,
} from '../api/merchantParkingLotApi'
import {
  compressImageFile,
  formatBytes,
  isSupportedImageFile,
} from '@/shared/utils/imageCompressionUtil'

const formSchema = z.object({
  name: z.string().trim().min(1, 'Nhập tên bãi đỗ.').max(150, 'Tên bãi tối đa 150 ký tự.'),
  address: z.string().trim().min(1, 'Nhập địa chỉ bãi đỗ.').max(255, 'Địa chỉ tối đa 255 ký tự.'),
  latitude: z.number({ invalid_type_error: 'Nhập vĩ độ hợp lệ.' }).min(-90).max(90),
  longitude: z.number({ invalid_type_error: 'Nhập kinh độ hợp lệ.' }).min(-180).max(180),
})
type FormValues = z.infer<typeof formSchema>
const draftSchema = z.object({ version: z.literal(2), lotId: z.number(), values: formSchema })

function readDraft(id: number) {
  try {
    const parsed = draftSchema.safeParse(JSON.parse(localStorage.getItem(`merchant_lot_edit_draft_${id}`) || 'null'))
    return parsed.success && parsed.data.lotId === id ? parsed.data.values : null
  } catch { return null }
}

const safeCreateObjectURL = (file: Blob | File) =>
  typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function'
    ? URL.createObjectURL(file)
    : ''

const safeRevokeObjectURL = (url: string) => {
  if (url && typeof URL !== 'undefined' && typeof URL.revokeObjectURL === 'function') {
    URL.revokeObjectURL(url)
  }
}

export function EditMerchantParkingLotPage() {
  const { parkingLotId } = useParams()
  const id = Number(parkingLotId)
  const validId = Number.isSafeInteger(id) && id > 0
  const query = useQuery({
    queryKey: ['merchant-lot-edit', id],
    queryFn: ({ signal }) => fetchMerchantParkingLotDetail(id, signal),
    enabled: validId,
    retry: false,
  })
  if (!validId) return <Notice error>Mã bãi đỗ không hợp lệ. <Link to="/merchant/parking-lots">Quay lại danh sách bãi</Link></Notice>
  if (query.isPending) return <Notice>Đang tải hồ sơ bãi đỗ…</Notice>
  if (query.isError || !query.data) return (
    <Notice error>Không tải được hồ sơ bãi đỗ. {errorMessage(query.error)}
      <button className={secondary} onClick={() => void query.refetch()}>Thử lại</button>
      <Link className={secondary} to="/merchant/parking-lots">Quay lại danh sách bãi</Link>
    </Notice>
  )
  const lot = query.data
  if (lot.status !== 'REJECTED' && lot.status !== 'CHANGES_REQUESTED') return <Navigate to={`/merchant/parking-lots/${lot.id}`} replace />
  return <EditLotForm key={lot.id} lot={lot} />
}

interface NewFilePreview {
  file: File
  previewUrl: string
  sizeBytes: number
}

function EditLotForm({ lot }: { lot: MerchantLotRecord }) {
  const navigate = useNavigate()
  const cache = useQueryClient()
  const [draft, setDraft] = useState(() => readDraft(lot.id))
  const [notice, setNotice] = useState('')
  const [photoError, setPhotoError] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [newPreviews, setNewPreviews] = useState<NewFilePreview[]>([])
  const [compressing, setCompressing] = useState(false)
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null)
  const [settingCoverImageId, setSettingCoverImageId] = useState<number | null>(null)
  const [locating, setLocating] = useState(false)
  const [gpsError, setGpsError] = useState('')
  const submitting = useRef(false)
  const photoInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    return () => {
      newPreviews.forEach(p => safeRevokeObjectURL(p.previewUrl))
    }
  }, [newPreviews])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: lot.name, address: lot.address ?? '', latitude: lot.latitude ?? NaN, longitude: lot.longitude ?? NaN },
  })
  const latitude = form.watch('latitude')
  const longitude = form.watch('longitude')
  const images = lot.images ?? []

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      if (files.length) {
        const uploaded = await uploadAdditionalLotImages(lot.id, files)
        cache.setQueryData<MerchantLotRecord>(['merchant-lot-edit', lot.id], current => current ? {
          ...current,
          images: [...(current.images ?? []), ...uploaded.map(image => ({
            id: image.id, originalFileName: image.title, contentUrl: image.url, cover: image.isCover,
          }))],
        } : current)
        setFiles([])
        newPreviews.forEach(p => safeRevokeObjectURL(p.previewUrl))
        setNewPreviews([])
        if (photoInput.current) photoInput.current.value = ''
        setNotice('Ảnh bổ sung đã được tải lên.')
      }
      return updateMerchantParkingLot(lot.id, values)
    },
    onSuccess: () => {
      localStorage.removeItem(`merchant_lot_edit_draft_${lot.id}`)
      setDraft(null)
      void cache.invalidateQueries({ queryKey: ['merchant-owned-parking-lots'] })
      void cache.invalidateQueries({ queryKey: ['merchant-owned-parking-lot-counts'] })
      void cache.invalidateQueries({ queryKey: ['merchant-lot-detail', String(lot.id)] })
    },
    onSettled: () => { submitting.current = false },
  })

  const handleDeleteImage = async (imageId: number) => {
    if (deletingImageId || mutation.isPending) return
    setDeletingImageId(imageId)
    setPhotoError('')
    try {
      await deleteMerchantParkingLotImage(lot.id, imageId)
      cache.setQueryData<MerchantLotRecord>(['merchant-lot-edit', lot.id], current => current ? {
        ...current,
        images: (current.images ?? []).filter(img => img.id !== imageId),
      } : current)
      setNotice('Đã xóa ảnh thành công.')
    } catch {
      setPhotoError('Không thể xóa ảnh. Vui lòng thử lại sau.')
    } finally {
      setDeletingImageId(null)
    }
  }

  const handleSetCoverImage = async (imageId: number) => {
    if (settingCoverImageId || mutation.isPending) return
    setSettingCoverImageId(imageId)
    setPhotoError('')
    try {
      await setCoverMerchantParkingLotImage(lot.id, imageId)
      cache.setQueryData<MerchantLotRecord>(['merchant-lot-edit', lot.id], current => current ? {
        ...current,
        images: (current.images ?? []).map(img => ({
          ...img,
          cover: img.id === imageId,
        })),
      } : current)
      setNotice('Đã đặt làm ảnh đại diện bãi đỗ.')
    } catch {
      setPhotoError('Không thể đặt ảnh đại diện. Vui lòng thử lại.')
    } finally {
      setSettingCoverImageId(null)
    }
  }

  const handleAddFiles = async (selected: File[]) => {
    const invalid = selected.some(
      file => !isSupportedImageFile(file) || file.size > 10 * 1024 * 1024
    )
    if (invalid || selected.length + images.length > 5) {
      setPhotoError('Chọn ảnh JPG, PNG hoặc WebP, tối đa 5 MB/ảnh và 5 ảnh/bãi.')
      if (photoInput.current) photoInput.current.value = ''
      setFiles([])
      setNewPreviews([])
      return
    }

    setPhotoError('')
    // Gán files và previews ngay tức thì đồng bộ
    const initialPreviews: NewFilePreview[] = selected.map(file => ({
      file,
      previewUrl: safeCreateObjectURL(file),
      sizeBytes: file.size,
    }))
    setFiles(selected)
    setNewPreviews(initialPreviews)

    // Tối ưu nén ngầm bằng Web Worker
    setCompressing(true)
    try {
      const compressedList: File[] = []
      const updatedPreviews: NewFilePreview[] = []

      for (const item of initialPreviews) {
        const compressed = await compressImageFile(item.file)
        compressedList.push(compressed.file)
        updatedPreviews.push({
          file: compressed.file,
          previewUrl: item.previewUrl,
          sizeBytes: compressed.compressedSize,
        })
      }
      setFiles(compressedList)
      setNewPreviews(updatedPreviews)
    } catch {
      // Giữ nguyên files gốc nếu nén lỗi
    } finally {
      setCompressing(false)
    }
  }

  const removeNewFile = (index: number) => {
    const target = newPreviews[index]
    if (target?.previewUrl) {
      safeRevokeObjectURL(target.previewUrl)
    }
    const filteredFiles = files.filter((_, i) => i !== index)
    const filteredPreviews = newPreviews.filter((_, i) => i !== index)
    setFiles(filteredFiles)
    setNewPreviews(filteredPreviews)
    if (photoInput.current && filteredFiles.length === 0) {
      photoInput.current.value = ''
    }
  }

  const setCoordinates = (lat: number, lng: number) => {
    if (mutation.isPending || locating) return
    form.setValue('latitude', lat, { shouldDirty: true, shouldValidate: true })
    form.setValue('longitude', lng, { shouldDirty: true, shouldValidate: true })
  }

  const getDeviceLocation = () => {
    setGpsError('')
    if (!navigator.geolocation) { setGpsError('Trình duyệt không hỗ trợ định vị. Hãy nhập tọa độ hoặc chọn trên bản đồ.'); return }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(position => {
      form.setValue('latitude', position.coords.latitude, { shouldDirty: true, shouldValidate: true })
      form.setValue('longitude', position.coords.longitude, { shouldDirty: true, shouldValidate: true })
      setLocating(false)
    }, () => {
      setLocating(false)
      setGpsError('Không lấy được vị trí thiết bị. Tọa độ bãi được giữ nguyên; hãy nhập hoặc chọn trên bản đồ.')
    }, { enableHighAccuracy: true, timeout: 10000 })
  }

  const showDetail = () => navigate(`/merchant/parking-lots/${lot.id}`, { replace: true })

  return (
    <Workspace title="Chỉnh sửa hồ sơ bãi đỗ" description={`${lot.name} · Mã bãi #${lot.id}`} actions={<Link className={secondary} to={`/merchant/parking-lots/${lot.id}`}>Quay lại chi tiết bãi</Link>}>
      <Badge value={lot.status === 'CHANGES_REQUESTED' ? 'Yêu cầu bổ sung' : lot.status} />
      {lot.reviewReason?.trim() && <Panel title="Phản hồi từ quản trị viên"><p className="whitespace-pre-wrap text-sm">{lot.reviewReason}</p></Panel>}
      {draft && <Notice>Có bản nháp của bãi này trên trình duyệt.
        <button type="button" className={secondary} disabled={mutation.isPending} onClick={() => { form.reset(draft); setDraft(null); setNotice('Đã khôi phục bản nháp. Vui lòng kiểm tra trước khi gửi.'); }}>Khôi phục bản nháp</button>
        <button type="button" className={secondary} disabled={mutation.isPending} onClick={() => { localStorage.removeItem(`merchant_lot_edit_draft_${lot.id}`); setDraft(null); }}>Bỏ bản nháp</button>
      </Notice>}
      {notice && <Notice>{notice}</Notice>}
      <form className="space-y-6" onSubmit={form.handleSubmit(values => {
        if (submitting.current || locating) return
        submitting.current = true
        mutation.mutate(values)
      })}>
        <Panel title="Thông tin bãi đỗ">
          <fieldset disabled={mutation.isPending || locating} className="grid gap-5">
            <Field label="Tên bãi đỗ"><input className={control} {...form.register('name')} />
              {form.formState.errors.name && <span role="alert">{form.formState.errors.name.message}</span>}
            </Field>
            <Field label="Địa chỉ"><textarea rows={3} className={control} {...form.register('address')} />
              {form.formState.errors.address && <span role="alert">{form.formState.errors.address.message}</span>}
            </Field>
          </fieldset>
        </Panel>
        <Panel title="Vị trí bãi đỗ">
          <fieldset disabled={mutation.isPending || locating} className="grid gap-5 sm:grid-cols-2">
            <Field label="Vĩ độ"><input type="number" step="any" className={control} {...form.register('latitude', { valueAsNumber: true })} />
              {form.formState.errors.latitude && <span role="alert">Vĩ độ phải từ -90 đến 90.</span>}
            </Field>
            <Field label="Kinh độ"><input type="number" step="any" className={control} {...form.register('longitude', { valueAsNumber: true })} />
              {form.formState.errors.longitude && <span role="alert">Kinh độ phải từ -180 đến 180.</span>}
            </Field>
          </fieldset>
          <div className="my-4 flex flex-wrap gap-3">
            <button type="button" className={secondary} disabled={mutation.isPending || locating} onClick={getDeviceLocation}>{locating ? 'Đang lấy vị trí…' : 'Lấy vị trí thiết bị'}</button>
            <button type="button" className={secondary} disabled={mutation.isPending || locating} onClick={() => setCoordinates(lot.latitude ?? NaN, lot.longitude ?? NaN)}>Khôi phục tọa độ đã lưu</button>
            {Number.isFinite(latitude) && Number.isFinite(longitude) && <a className={secondary} href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`} target="_blank" rel="noreferrer">Xem vị trí trên Google Maps</a>}
          </div>
          {gpsError && <Notice error>{gpsError}</Notice>}
          <CreateParkingLotMapPicker latitude={latitude} longitude={longitude} onCoordinatesChange={setCoordinates} />
        </Panel>
        <Panel title="Ảnh của bãi">
          {images.length ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {images.map(image => (
                <figure key={image.id} className="relative group border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <div className="relative aspect-video w-full overflow-hidden">
                    <ApiImage path={image.contentUrl} alt={image.originalFileName} />
                    {image.cover ? (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#d95f00] text-white font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs">
                        <Star size={11} fill="currentColor" /> Ảnh đại diện
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={mutation.isPending || Boolean(settingCoverImageId)}
                        onClick={() => handleSetCoverImage(image.id)}
                        className="absolute top-2 left-2 px-2 py-1 bg-black/70 hover:bg-[#d95f00] text-white rounded text-[10px] font-medium transition-colors cursor-pointer"
                        title="Đặt làm ảnh đại diện bìa"
                      >
                        {settingCoverImageId === image.id ? 'Đang đặt…' : 'Đặt làm ảnh bìa'}
                      </button>
                    )}
                    <button
                      type="button"
                      disabled={mutation.isPending || Boolean(deletingImageId)}
                      onClick={() => handleDeleteImage(image.id)}
                      className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-rose-500 hover:text-white text-rose-600 rounded-lg shadow-sm transition-all cursor-pointer"
                      title="Xóa ảnh này"
                      aria-label={`Xóa ảnh ${image.originalFileName}`}
                    >
                      {deletingImageId === image.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                    </button>
                  </div>
                  <figcaption className="p-2 break-words text-xs text-slate-700 bg-white">
                    <span className="truncate block font-medium">{image.originalFileName}</span>
                    {image.cover && <span className="text-[11px] text-[#d95f00] font-semibold">Ảnh đại diện chính</span>}
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <p className="text-sm text-brand-muted">Bãi chưa có ảnh.</p>
          )}

          {/* New Supplementary Photos Preview Grid */}
          {newPreviews.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-700">Ảnh mới chuẩn bị tải lên ({newPreviews.length}):</span>
                {compressing && (
                  <span className="text-xs text-blue-600 flex items-center gap-1">
                    <Loader2 size={13} className="animate-spin" /> Đang tối ưu dung lượng Web Worker...
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {newPreviews.map((item, idx) => (
                  <div key={item.previewUrl || idx} className="relative aspect-video rounded-lg overflow-hidden border border-blue-300 bg-slate-100 group">
                    {item.previewUrl ? (
                      <img src={item.previewUrl} alt={item.file.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 p-2 text-center">{item.file.name}</div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeNewFile(idx)}
                      className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-rose-600 text-white rounded cursor-pointer transition-colors"
                      title="Bỏ ảnh này"
                    >
                      <X size={14} />
                    </button>
                    <div className="absolute bottom-0 inset-x-0 bg-black/70 px-1.5 py-0.5 text-white text-[10px] font-mono truncate">
                      {formatBytes(item.sizeBytes)} · Mới
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <label className="mt-5 grid gap-2 text-sm font-medium">Thêm ảnh bổ sung
            <input
              ref={photoInput}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
              disabled={mutation.isPending || images.length >= 5}
              onChange={event => {
                const selected = Array.from(event.target.files ?? [])
                void handleAddFiles(selected)
              }}
            />
          </label>
          <p className="mt-2 text-xs text-brand-muted">JPG, PNG, WebP · tối đa 5 MB/ảnh · tối đa 5 ảnh/bãi. Ảnh mới sẽ được tải lên khi gửi hồ sơ.</p>
          {files.length > 0 && <p className="mt-2 break-words text-sm">Đã chọn: {files.map(file => file.name).join(', ')}</p>}
          {photoError && <Notice error>{photoError}</Notice>}
        </Panel>
        {mutation.isError && <Notice error>{errorMessage(mutation.error)}</Notice>}
        <div className="flex flex-wrap justify-end gap-3">
          <button type="button" className={secondary} disabled={mutation.isPending} onClick={showDetail}>Hủy thay đổi</button>
          <button type="button" className={secondary} disabled={mutation.isPending || locating} onClick={form.handleSubmit(values => {
            try {
              localStorage.setItem(`merchant_lot_edit_draft_${lot.id}`, JSON.stringify({ version: 2, lotId: lot.id, values }))
              setNotice('Đã lưu bản nháp trên trình duyệt. Ảnh mới cần được chọn lại khi mở lại trang.')
            } catch { setNotice('Không lưu được bản nháp trên trình duyệt.') }
          })}>Lưu bản nháp</button>
          <button type="submit" className={button} disabled={mutation.isPending || locating} aria-busy={mutation.isPending}>{mutation.isPending ? 'Đang gửi hồ sơ…' : 'Gửi lại hồ sơ'}</button>
        </div>
      </form>
      {mutation.isSuccess && <Dialog title="Đã lưu hồ sơ bãi" onClose={showDetail}>
        <p className="mb-4">Hồ sơ đã được lưu thành công. Trạng thái hiện tại: <Badge value={mutation.data.status} /></p>
        <button type="button" className={button} onClick={showDetail}>Xem chi tiết bãi</button>
      </Dialog>}
    </Workspace>
  )
}
