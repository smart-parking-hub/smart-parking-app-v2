import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, ArrowUpRight, Check, CheckCircle2, Circle, ClipboardList, Image, Info, MapPin, Warehouse, X } from 'lucide-react'
import './CreateMerchantParkingLotPage.css'
import type {
  AiContentSegments,
  ParkingLotImageItem,
  CreateParkingLotDraft,
} from '../types/merchantParkingLotTypes'
import {
  createMerchantParkingLot,
  uploadMerchantParkingLotImages,
} from '../api/merchantParkingLotApi'
import { CreateParkingLotStepper } from '../components/CreateParkingLotStepper'
import { CreateParkingLotBasicInfoCard } from '../components/CreateParkingLotBasicInfoCard'
import { CreateParkingLotGeoCard } from '../components/CreateParkingLotGeoCard'
import { CreateParkingLotPhotosCard } from '../components/CreateParkingLotPhotosCard'
import { CreateParkingLotConfirmStep } from '../components/CreateParkingLotConfirmStep'
import { CreateParkingLotActionFooter } from '../components/CreateParkingLotActionFooter'

const DRAFT_STORAGE_KEY = 'merchant_lot_registration_draft'

// Zod Validation Schema matching Backend CreateParkingLotRequest
const createLotFormSchema = z.object({
  name: z
  .string()
  .trim()
  .min(1, 'Tên bãi đỗ không được để trống')
  .max(150, 'Tên bãi đỗ không được vượt quá 150 ký tự'),
  address: z
  .string()
  .trim()
  .min(1, 'Địa chỉ bãi đỗ không được để trống')
  .max(255, 'Địa chỉ không được vượt quá 255 ký tự'),
  latitude: z
  .number({ invalid_type_error: 'Vui lòng nhập vĩ độ hợp lệ' })
  .min(-90, 'Vĩ độ phải từ -90 đến 90')
  .max(90, 'Vĩ độ phải từ -90 đến 90'),
  longitude: z
  .number({ invalid_type_error: 'Vui lòng nhập kinh độ hợp lệ' })
  .min(-180, 'Kinh độ phải từ -180 đến 180')
  .max(180, 'Kinh độ phải từ -180 đến 180'),
})

type CreateLotFormData = z.infer<typeof createLotFormSchema>

export function CreateMerchantParkingLotPage() {
  const navigate = useNavigate()

  // Steps: basic information and photos, map location, confirmation.
  const [currentStep, setCurrentStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [createdParkingLotId, setCreatedParkingLotId] = useState<number>()
  const [uploadError, setUploadError] = useState<string>()
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [draftSaved, setDraftSaved] = useState(false)

  // AI Assistant State
  const [appliedAiContent, setAppliedAiContent] = useState<AiContentSegments | null>(null)

  const [images, setImages] = useState<ParkingLotImageItem[]>([])

  // React Hook Form Configuration
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<CreateLotFormData>({
    resolver: zodResolver(createLotFormSchema),
    defaultValues: {
      name: '',
      address: '',
    },
  })

  const formValues = watch()
  const imageUrls = useRef<ParkingLotImageItem[]>([])
  useEffect(() => { imageUrls.current = images }, [images])
  useEffect(() => () => {
    imageUrls.current.forEach((image) => URL.revokeObjectURL(image.previewUrl))
  }, [])

  // Load Draft from LocalStorage on mount if exists
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as CreateParkingLotDraft
        if (parsed.name) setValue('name', parsed.name)
        if (parsed.address) setValue('address', parsed.address)
        if (typeof parsed.latitude === 'number') setValue('latitude', parsed.latitude)
        if (typeof parsed.longitude === 'number') setValue('longitude', parsed.longitude)
        if (parsed.aiContent) setAppliedAiContent(parsed.aiContent)
      }
    } catch {
      // Ignore localStorage parse error
    }
  }, [setValue])

  // Save Draft Handler
  const handleSaveDraft = () => {
    const draft: CreateParkingLotDraft = {
      name: formValues.name,
      address: formValues.address,
      latitude: formValues.latitude,
      longitude: formValues.longitude,
      aiContent: appliedAiContent || undefined,
      updatedAt: new Date().toISOString(),
    }
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft))
    } catch {
      setToastMessage('Không thể lưu bản nháp. Vui lòng kiểm tra dung lượng hoặc quyền lưu trữ của trình duyệt.')
      return
    }
    setDraftSaved(true)
    setToastMessage('Đã lưu bản nháp hồ sơ đăng ký vào trình duyệt.')
    setTimeout(() => {
      setDraftSaved(false)
      setToastMessage(null)
    }, 3000)
  }

  // Step Navigation Handlers
  const handleNextStep = async () => {
    if (currentStep === 0) {
      const isValid = await trigger(['name', 'address'], { shouldFocus: true })
      if (isValid) {
        setCurrentStep(1)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } else if (currentStep === 1) {
      const isValid = await trigger(['latitude', 'longitude'], { shouldFocus: true })
      if (isValid) {
        setCurrentStep(2)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  }

  const handleBackStep = () => {
    if (currentStep === 0) {
      navigate('/merchant/parking-lots')
    } else {
      setCurrentStep((prev) => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Two-Phase Final Submission Handler
  const onSubmitFinal = async (data: CreateLotFormData) => {
    if (submitting) return
    setSubmitting(true)
    setUploadError(undefined)

    let lotId = createdParkingLotId

    try {
      // Phase 1: Create Parking Lot Record if not already created
      if (!lotId) {
        const created = await createMerchantParkingLot({
          name: data.name,
          address: data.address,
          latitude: data.latitude,
          longitude: data.longitude,
        })
        lotId = created.id
        setCreatedParkingLotId(created.id)
      }

      // Phase 2: Upload Images if files present
      const filesToUpload = images.filter((img) => img.file).map((img) => img.file as File)
      if (filesToUpload.length > 0 && lotId) {
        await uploadMerchantParkingLotImages(lotId, filesToUpload)
      }

      // Clear draft on successful creation
      localStorage.removeItem(DRAFT_STORAGE_KEY)

      setToastMessage(
        `Đã tạo thành công bãi đỗ #${lotId}. Hồ sơ đang được chuyển sang Hội đồng Admin thẩm định.`,
      )

      setTimeout(() => {
        navigate('/merchant/parking-lots')
      }, 2000)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi gửi hồ sơ đăng ký lên máy chủ.'
      if (lotId) {
        setUploadError(`Bãi đỗ đã được tạo (Mã #${lotId}), nhưng upload ảnh thất bại: ${msg}`)
      } else {
        setToastMessage(`Lỗi tạo bãi: ${msg}`)
      }
    } finally {
      setSubmitting(false)
    }
  }

  // Retry Upload Handler in case of Phase 2 failure
  const handleRetryUpload = async () => {
    if (!createdParkingLotId || submitting) return
    setSubmitting(true)
    setUploadError(undefined)

    try {
      const filesToUpload = images.filter((img) => img.file).map((img) => img.file as File)
      if (filesToUpload.length > 0) {
        await uploadMerchantParkingLotImages(createdParkingLotId, filesToUpload)
      }
      localStorage.removeItem(DRAFT_STORAGE_KEY)
      setToastMessage(`Đã upload bổ sung ${filesToUpload.length} ảnh kiểm định thành công.`)
      setTimeout(() => {
        navigate('/merchant/parking-lots')
      }, 1500)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi upload lại ảnh'
      setUploadError(`Thử upload lại thất bại: ${msg}`)
    } finally {
      setSubmitting(false)
    }
  }

  const checklist = [
    { title: 'Tên và địa chỉ bãi đỗ', detail: 'Thông tin cơ bản để nhận diện bãi', complete: Boolean(formValues.name?.trim() && formValues.address?.trim()), icon: Warehouse },
    { title: 'Hình ảnh thực tế', detail: images.length ? `${images.length} ảnh đã chọn` : 'Nên có ảnh toàn cảnh và cổng vào', complete: images.length > 0, icon: Image },
    { title: 'Vị trí trên bản đồ', detail: 'Đặt ghim tại lối vào bãi đỗ', complete: Number.isFinite(formValues.latitude) && Number.isFinite(formValues.longitude), icon: MapPin },
  ]
  const stepDescriptions = ['Bắt đầu với thông tin cơ bản và hình ảnh thực tế của bãi đỗ.', 'Chọn vị trí chính xác để tài xế dễ dàng tìm đường đến bãi.', 'Kiểm tra lại thông tin trước khi gửi hồ sơ đến quản trị viên.']

  return (
    <div className="lot-registration">
      {toastMessage && (
        <div className="registration-toast" role="status">
          <Info size={20} aria-hidden="true" />
          <span>{toastMessage}</span>
          <button type="button" onClick={() => setToastMessage(null)} aria-label="Đóng thông báo"><X size={18} /></button>
        </div>
      )}
      <div className="registration-container">
        <Link className="registration-back-link" to="/merchant/parking-lots"><ArrowLeft size={16} />Bãi đỗ của tôi</Link>
        <header className="registration-header">
          <div>
            <p className="registration-eyebrow"><span /> MỞ RỘNG MẠNG LƯỚI BÃI ĐỖ</p>
            <h1>Đăng ký bãi đỗ mới<span aria-hidden="true">.</span></h1>
            <p>Đưa bãi đỗ của bạn lên hệ thống, kết nối với nhiều tài xế hơn.</p>
          </div>
          <div className="registration-header-note"><ClipboardList size={19} /><span>Hoàn thiện hồ sơ<br /><strong>trong 3 bước đơn giản</strong></span></div>
        </header>
        <CreateParkingLotStepper currentStep={currentStep} onStepClick={setCurrentStep} disabled={submitting} />
        <div className="registration-workspace">
          <form noValidate onSubmit={(event) => {
            if (currentStep < 2) { event.preventDefault(); void handleNextStep() }
            else { void handleSubmit(onSubmitFinal)(event) }
          }}>
            <div className="registration-step-heading">
              <div><span className="registration-eyebrow">BƯỚC {currentStep + 1} TRÊN 3</span><h2>{['Giới thiệu bãi đỗ của bạn', 'Định vị bãi đỗ', 'Hồ sơ đã sẵn sàng?'][currentStep]}</h2></div>
              <p>{stepDescriptions[currentStep]}</p>
            </div>
            <fieldset disabled={submitting} className="registration-form-fields">
              <legend className="sr-only">{['Thông tin bãi đỗ', 'Vị trí bãi đỗ', 'Kiểm tra hồ sơ'][currentStep]}</legend>
              {currentStep === 0 && <>
                <CreateParkingLotBasicInfoCard register={register} errors={errors} aiContent={appliedAiContent} onClearAiContent={() => setAppliedAiContent(null)} />
                <CreateParkingLotPhotosCard images={images} onImagesChange={setImages} />
              </>}
              {currentStep === 1 && <CreateParkingLotGeoCard latitude={formValues.latitude} longitude={formValues.longitude} setValue={setValue} errors={errors} />}
              {currentStep === 2 && <CreateParkingLotConfirmStep values={formValues} images={images} aiContent={appliedAiContent} uploadError={uploadError} createdParkingLotId={createdParkingLotId} onRetryUpload={handleRetryUpload} submitting={submitting} />}
            </fieldset>
            <CreateParkingLotActionFooter currentStep={currentStep} submitting={submitting} onBack={handleBackStep} onNext={handleNextStep} onSubmit={handleSubmit(onSubmitFinal)} onSaveDraft={handleSaveDraft} draftSaved={draftSaved} />
            <p className="registration-draft-hint">Bạn có thể lưu bản nháp và quay lại hoàn thiện sau. Ảnh cần được chọn lại khi mở lại trang.</p>
          </form>
          <aside className="registration-sidebar" aria-label="Hướng dẫn đăng ký">
            <section className="registration-checklist">
              <div className="registration-sidebar-title"><ClipboardList size={20} /><h2>Hồ sơ cần chuẩn bị</h2></div>
              <p>Một vài thông tin để bắt đầu thuận lợi.</p>
              <ul>{checklist.map((item) => <li key={item.title} data-complete={item.complete}>
                <span className="registration-checklist-icon"><item.icon size={18} aria-hidden="true" /></span>
                <div><strong>{item.title}</strong><span>{item.detail}</span></div>
                {item.complete ? <CheckCircle2 size={18} className="registration-check-status" aria-label="Đã có thông tin" /> : <Circle size={17} className="registration-check-status" aria-label="Chưa có thông tin" />}
              </li>)}</ul>
              <div className="registration-checklist-bottom"><Check size={16} />Cập nhật theo thông tin bạn nhập</div>
            </section>
            <section className="registration-guide">
              <span className="registration-guide-label">MỘT CHÚT CHUẨN BỊ,</span>
              <h2>Một khởi đầu<br />thuận lợi<span>.</span></h2>
              <div className="registration-yard-mark" aria-hidden="true"><span /><span /><span /><span /><ArrowUpRight size={28} /></div>
              <p>Thông tin rõ ràng và hình ảnh thực tế giúp quản trị viên có đủ cơ sở để xem xét hồ sơ của bạn.</p>
              <div className="registration-guide-note"><Info size={17} /><span>Hồ sơ sẽ được gửi xét duyệt sau khi bạn xác nhận ở bước cuối.</span></div>
            </section>
            <div className="registration-tip"><Info size={18} /><p><strong>Chưa sẵn sàng gửi?</strong><br />Chọn “Lưu bản nháp” để lưu thông tin trên trình duyệt này.</p></div>
          </aside>
        </div>
      </div>
    </div>
  )
}
