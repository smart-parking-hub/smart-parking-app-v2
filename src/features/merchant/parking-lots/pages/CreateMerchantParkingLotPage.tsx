import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle2, X } from 'lucide-react'
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

  // Wizard Step State: 0 (Info), 1 (Geo/Photos), 2 (Confirm)
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
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft))
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
      const isValid = await trigger(['name', 'address'])
      if (isValid) {
        setCurrentStep(1)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } else if (currentStep === 1) {
      const isValid = await trigger(['latitude', 'longitude'])
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
    if (!createdParkingLotId) return
    setSubmitting(true)
    setUploadError(undefined)

    try {
      const filesToUpload = images.filter((img) => img.file).map((img) => img.file as File)
      if (filesToUpload.length > 0) {
        await uploadMerchantParkingLotImages(createdParkingLotId, filesToUpload)
      }
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

  return (
    <div className="w-full bg-[#f8f9ff] min-h-screen pb-16 font-inter text-[#0d1c2e]">
      {/* Toast Notification Notification Pill */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#0d1c2e] text-white rounded-xl shadow-xl border border-[#d95f00] animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-[#ffb690] shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-2 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="w-full max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 flex flex-col gap-8">
        {/* Top Header Segment: Eyebrow + H1 + Stepper Progress */}
        <header className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mt-1">
              <div>
                <h1 className="font-sora text-2xl sm:text-3xl lg:text-4xl text-[#0d1c2e] tracking-tight font-bold">
                  Đăng Ký Bãi Đỗ Xe &amp; Depot Mới
                </h1>
                <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-3xl leading-relaxed">
                  Nhập thông tin bãi đỗ, chọn vị trí và tải ảnh thực tế của bạn. Kiểm tra hồ sơ trước khi gửi.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="px-3 py-1 bg-[#dce9ff] text-[#0d1c2e] text-xs font-mono font-bold rounded-lg border border-slate-200">
                  BƯỚC {currentStep + 1} TRÊN 3
                </span>

              </div>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <CreateParkingLotStepper
            currentStep={currentStep}
            onStepClick={(step) => setCurrentStep(step)}
          />
        </header>

        {/* Main 2-Column Split Workspace */}
        <form onSubmit={handleSubmit(onSubmitFinal)} className="w-full">
          <div className="flex flex-col gap-6">
            {/* Left Column: 65% (8/12) */}
            <section className="w-full flex flex-col gap-6">
              {/* STEP 0: Thông tin cơ bản */}
              {currentStep === 0 && (
                <>
                  <CreateParkingLotBasicInfoCard
                    register={register}
                    errors={errors}
                    aiContent={appliedAiContent}
                    onClearAiContent={() => setAppliedAiContent(null)}
                  />
                  <CreateParkingLotPhotosCard
                    images={images}
                    onImagesChange={(newImgs) => setImages(newImgs)}
                  />
                </>
              )}

              {/* STEP 1: Vị trí GPS & Bản đồ */}
              {currentStep === 1 && (
                <CreateParkingLotGeoCard
                  latitude={formValues.latitude}
                  longitude={formValues.longitude}
                  setValue={setValue}
                  errors={errors}
                />
              )}

              {/* STEP 2: Xác nhận hồ sơ & Gửi duyệt */}
              {currentStep === 2 && (
                <CreateParkingLotConfirmStep
                  values={formValues}
                  images={images}
                  aiContent={appliedAiContent}
                  uploadError={uploadError}
                  createdParkingLotId={createdParkingLotId}
                  onRetryUpload={handleRetryUpload}
                  submitting={submitting}
                />
              )}

              {/* Wizard Action Footer Bar */}
              <CreateParkingLotActionFooter
                currentStep={currentStep}
                submitting={submitting}
                onBack={handleBackStep}
                onNext={handleNextStep}
                onSubmit={handleSubmit(onSubmitFinal)}
                onSaveDraft={handleSaveDraft}
                draftSaved={draftSaved}
              />
            </section>


          </div>
        </form>
      </div>
    </div>
  )
}
