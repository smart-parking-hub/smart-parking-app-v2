import { useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiImage } from '@/shared/components/ApiImage'
import { Workspace, Panel, Notice, Field, Badge, Dialog, control, button, secondary } from '@/shared/components/Workspace'
import { errorMessage } from '@/shared/api/resources'
import { CreateParkingLotMapPicker } from '../components/CreateParkingLotMapPicker'
import { fetchMerchantParkingLotDetail, updateMerchantParkingLot, uploadAdditionalLotImages, type MerchantLotRecord } from '../api/merchantParkingLotApi'

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

function EditLotForm({ lot }: { lot: MerchantLotRecord }) {
  const navigate = useNavigate()
  const cache = useQueryClient()
  const [draft, setDraft] = useState(() => readDraft(lot.id))
  const [notice, setNotice] = useState('')
  const [photoError, setPhotoError] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [locating, setLocating] = useState(false)
  const [gpsError, setGpsError] = useState('')
  const submitting = useRef(false)
  const photoInput = useRef<HTMLInputElement>(null)
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
          {images.length ? <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">{images.map(image => <figure key={image.id}>
            <ApiImage path={image.contentUrl} alt={image.originalFileName} />
            <figcaption className="mt-2 break-words text-xs">{image.originalFileName}{image.cover ? ' · Ảnh đại diện' : ''}</figcaption>
          </figure>)}</div> : <p className="text-sm text-brand-muted">Bãi chưa có ảnh.</p>}
          <label className="mt-5 grid gap-2 text-sm font-medium">Thêm ảnh bổ sung
            <input ref={photoInput} type="file" multiple accept="image/jpeg,image/png,image/webp" disabled={mutation.isPending || images.length >= 5} onChange={event => {
              const selected = Array.from(event.target.files ?? [])
              const invalid = selected.some(file => !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024)
              if (invalid || selected.length + images.length > 5) {
                setPhotoError('Chọn ảnh JPG, PNG hoặc WebP, tối đa 5 MB/ảnh và 5 ảnh/bãi.')
                event.target.value = ''
                setFiles([])
              } else { setPhotoError(''); setFiles(selected) }
            }} />
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
