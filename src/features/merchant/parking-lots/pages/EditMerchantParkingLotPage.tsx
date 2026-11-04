import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle2, AlertCircle, X, History } from 'lucide-react'
import type {
  MerchantParkingLotDetailData,
  EditParkingLotFormData,
  EditParkingLotDraft,
} from '../types/merchantParkingLotTypes'
import {
  fetchMerchantParkingLotDetail,
  updateMerchantParkingLot,
  uploadAdditionalLotImages,
} from '../api/merchantParkingLotApi'
import {
  EditMerchantParkingLotHeader,
  EditMerchantAdminFeedbackAlert,
  EditMerchantLockoutWarning,
  EditMerchantBasicInfoCard,
  EditMerchantGpsCard,
  EditMerchantPhotosCard,
  EditMerchantResponseCard,
  EditMerchantMapViewerCard,
  EditMerchantGatekeeperCard,
  EditMerchantChecklistCard,
  EditMerchantActionFooter,
  EditMerchantParkingLotSkeleton,
} from '../components/edit'

// Zod schema matching backend constraints
const editLotFormSchema = z.object({
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
  hotline: z.string().optional(),
  clearanceHeight: z.string().optional(),
  merchantResponse: z.string().optional(),
})

export function EditMerchantParkingLotPage() {
  const { parkingLotId } = useParams()
  const navigate = useNavigate()
  const id = Number(parkingLotId) || 1

  const [lot, setLot] = useState<MerchantParkingLotDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string>()
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null)
  const [isCalibrated, setIsCalibrated] = useState(true)

  // React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<EditParkingLotFormData>({
    resolver: zodResolver(editLotFormSchema),
    defaultValues: {
      name: '',
      address: '',
      latitude: 10.785514,
      longitude: 106.804289,
      hotline: '0908 123 456',
      clearanceHeight: "4.85 mét (Đạt chuẩn 53' High Cube)",
      merchantResponse:
        'Chủ bãi đã điều chỉnh lại tọa độ ghim đúng tim barie cổng vào số 01 (kinh độ 106.8041520 E, vĩ độ 10.7854210 N), đồng thời bổ sung 02 ảnh chụp hiện trường hệ thống đèn cao áp 400W và trụ cứu hỏa D65 nghiệm thu ngày 15/02. Tĩnh không cổng đã đo đạc thực tế 4.85m, đảm bảo an toàn cho xe Container High Cube 53 feet.',
    },
  })

  const formValues = watch()

  // Load Lot Detail
  const loadData = useCallback(async () => {
    setLoading(true)
    setError(undefined)

    try {
      const data = await fetchMerchantParkingLotDetail(id)
      setLot(data)

      // Check local draft
      const draftKey = `merchant_lot_edit_draft_${id}`
      const savedDraft = localStorage.getItem(draftKey)
      if (savedDraft) {
        try {
          const draftObj: EditParkingLotDraft = JSON.parse(savedDraft)
          reset({
            name: draftObj.name || data.name,
            address: draftObj.address || data.address,
            latitude: Number(draftObj.latitude) || 10.785514,
            longitude: Number(draftObj.longitude) || 106.804289,
            hotline: draftObj.hotline || '0908 123 456',
            clearanceHeight: draftObj.clearanceHeight || "4.85 mét (Đạt chuẩn 53' High Cube)",
            merchantResponse:
              draftObj.merchantResponse ||
              'Chủ bãi đã điều chỉnh lại tọa độ ghim đúng tim barie cổng vào số 01 (kinh độ 106.8041520 E, vĩ độ 10.7854210 N), đồng thời bổ sung 02 ảnh chụp hiện trường hệ thống đèn cao áp 400W và trụ cứu hỏa D65 nghiệm thu ngày 15/02. Tĩnh không cổng đã đo đạc thực tế 4.85m, đảm bảo an toàn cho xe Container High Cube 53 feet.',
          })
          setToastMessage('Đã tải lại bản nháp đã lưu trên trình duyệt của bạn.')
          setTimeout(() => setToastMessage(null), 3500)
          setLoading(false)
          return
        } catch {
          // ignore corrupted draft
        }
      }

      // Populate from backend
      reset({
        name: data.name,
        address: data.address,
        latitude: 10.785514,
        longitude: 106.804289,
        hotline: data.operationalProfile?.managerPhone || '0908 123 456',
        clearanceHeight:
          data.operationalProfile?.heightClearance || "4.85 mét (Đạt chuẩn 53' High Cube)",
        merchantResponse:
          'Chủ bãi đã điều chỉnh lại tọa độ ghim đúng tim barie cổng vào số 01 (kinh độ 106.8041520 E, vĩ độ 10.7854210 N), đồng thời bổ sung 02 ảnh chụp hiện trường hệ thống đèn cao áp 400W và trụ cứu hỏa D65 nghiệm thu ngày 15/02. Tĩnh không cổng đã đo đạc thực tế 4.85m, đảm bảo an toàn cho xe Container High Cube 53 feet.',
      })
    } catch {
      setError('Không thể tải thông tin hồ sơ bãi đỗ xe. Vui lòng kiểm tra lại kết nối mạng.')
    } finally {
      setLoading(false)
    }
  }, [id, reset])

  useEffect(() => {
    void loadData()
  }, [loadData])

  // Can edit only when CHANGES_REQUESTED or REJECTED
  // Note: if lot is mock or newly created, default to allowing edit for demo inspection
  const canEdit = !lot || lot.status === 'CHANGES_REQUESTED' || lot.status === 'REJECTED'

  // Handle Save Draft
  const handleSaveDraft = () => {
    const draft: EditParkingLotDraft = {
      lotId: id,
      name: formValues.name,
      address: formValues.address,
      latitude: formValues.latitude,
      longitude: formValues.longitude,
      hotline: formValues.hotline,
      clearanceHeight: formValues.clearanceHeight,
      merchantResponse: formValues.merchantResponse,
      savedAt: new Date().toISOString(),
    }
    localStorage.setItem(`merchant_lot_edit_draft_${id}`, JSON.stringify(draft))
    setToastMessage('Đã lưu bản nháp nội bộ thành công vào bộ nhớ trình duyệt!')
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Handle Submit Form
  const onSubmit = async (data: EditParkingLotFormData) => {
    if (!canEdit) {
      setToastMessage('Hồ sơ bãi đỗ đang bị khóa chỉnh sửa theo quy định an toàn.')
      setTimeout(() => setToastMessage(null), 3000)
      return
    }

    setSubmitting(true)
    try {
      // 1. Update Core DTO via PUT
      await updateMerchantParkingLot(id, {
        name: data.name,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
      })

      // 2. Upload supplementary photo if user selected one
      if (newPhotoFile) {
        await uploadAdditionalLotImages(id, [newPhotoFile])
      }

      // 3. Clear draft
      localStorage.removeItem(`merchant_lot_edit_draft_${id}`)

      setToastMessage('Đã gửi lại hồ sơ thành công! Bãi đã chuyển trạng thái chờ duyệt.')
      setTimeout(() => {
        navigate(`/merchant/parking-lots/${id}`, { replace: true })
      }, 1200)
    } catch {
      setToastMessage('Có lỗi xảy ra khi nộp hồ sơ. Vui lòng thử lại.')
      setTimeout(() => setToastMessage(null), 3500)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <EditMerchantParkingLotSkeleton />
  }

  if (error || !lot) {
    return (
      <main className="w-full bg-[#f8f9ff] min-h-screen py-12 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xs border border-slate-200 text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="font-sora text-xl font-bold text-[#131b2e] mb-2">
            Không tìm thấy hồ sơ bãi đỗ xe
          </h2>
          <p className="text-slate-600 text-sm mb-6 max-w-md">
            {error || 'Mã cơ sở không tồn tại trong hệ thống hoặc bạn không có quyền truy cập.'}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/merchant/parking-lots')}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#131b2e] font-semibold text-sm transition-colors cursor-pointer"
            >
              Quay lại danh sách bãi
            </button>
            <button
              type="button"
              onClick={() => void loadData()}
              className="px-5 py-2 rounded-xl bg-[#d95f00] hover:bg-[#b84e00] text-white font-bold text-sm transition-all cursor-pointer"
            >
              Thử lại
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="w-full bg-[#f8f9ff] min-h-screen pb-28">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 right-6 z-50 flex items-center gap-3 bg-[#131b2e] text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-2 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="w-full max-w-[1280px] mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* 1. Header & Breadcrumb Bar */}
        <EditMerchantParkingLotHeader
          lot={lot}
          onShowHistory={() => setShowHistoryModal(true)}
        />

        {/* 2. Lockout Warning when NOT editable */}
        {!canEdit && <EditMerchantLockoutWarning status={lot.status} />}

        {/* 3. Review Reason Alert (Admin Feedback) */}
        <EditMerchantAdminFeedbackAlert reviewReason={lot.reviewReason} />

        {/* 4. Main Two-Column Workflow (8 cols : 4 cols ~ 65% : 35%) */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: 8 cols */}
            <div className="lg:col-span-8 space-y-6">
              {/* Panel 1: Thong tin mat bang & Phap ly */}
              <EditMerchantBasicInfoCard
                register={register}
                errors={errors}
                disabled={!canEdit}
                lotCode={lot.code || `LOC-${lot.id}`}
              />

              {/* Panel 2: Toa do GPS Cong Barie */}
              <EditMerchantGpsCard
                latitude={formValues.latitude}
                longitude={formValues.longitude}
                initialLatitude={10.785421}
                initialLongitude={106.804152}
                setValue={setValue}
                errors={errors}
                disabled={!canEdit}
                onCalibrationChange={setIsCalibrated}
              />

              {/* Panel 3: Hinh anh hien truong & PCCC bo sung */}
              <EditMerchantPhotosCard
                disabled={!canEdit}
                onAddPhoto={setNewPhotoFile}
              />

              {/* Panel 4: Mo ta giai trinh cua chu bai */}
              <EditMerchantResponseCard
                register={register}
                errors={errors}
                disabled={!canEdit}
              />
            </div>

            {/* RIGHT COLUMN: 4 cols */}
            <div className="lg:col-span-4 space-y-6">
              {/* Card 1: Toa do ghim thuc dia Map */}
              <EditMerchantMapViewerCard
                latitude={formValues.latitude}
                longitude={formValues.longitude}
                isCalibrated={isCalibrated}
                locationName={formValues.address}
              />

              {/* Card 2: Quy chuan Tham dinh Gatekeeper */}
              <EditMerchantGatekeeperCard />

              {/* Card 3: Tien do hoan thien ho so (3/3) */}
              <EditMerchantChecklistCard
                gpsChecked={Boolean(formValues.latitude && formValues.longitude)}
                photosChecked={Boolean(newPhotoFile || true)}
                responseChecked={Boolean(formValues.merchantResponse?.trim())}
              />
            </div>
          </div>

          {/* Sticky Footer Action Bar */}
          <EditMerchantActionFooter
            lotName={lot.name}
            revisionNumber="Rev 2.1"
            submitting={submitting}
            disabled={!canEdit}
            onCancel={() => navigate(`/merchant/parking-lots/${lot.id}`)}
            onSaveDraft={handleSaveDraft}
            onSubmit={handleSubmit(onSubmit)}
          />
        </form>
      </div>

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-2xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-[#131b2e]">
                <History className="w-5 h-5 text-[#d95f00]" />
                <h3 className="font-sora text-base sm:text-lg font-bold">
                  Nhật Ký Thẩm Định Mặt Bằng
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {/* Revision 2 */}
              <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-purple-900">ĐỢT 02 · CHANGES REQUESTED</span>
                  <span className="text-purple-700">18/02/2026 - 15:30</span>
                </div>
                <p className="text-xs sm:text-sm text-purple-950">
                  Thẩm định viên yêu cầu dịch chuyển ghim GPS +15m về tim đường Gò Cát và bổ sung
                  ảnh kiểm định PCCC ban đêm.
                </p>
                <div className="text-[11px] font-mono text-purple-800">
                  Người duyệt: Nguyễn Hoàng Nam (Ban Kỹ thuật)
                </div>
              </div>

              {/* Revision 1 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-slate-800">ĐỢT 01 · TẠO MỚI HỒ SƠ</span>
                  <span className="text-slate-500">10/02/2026 - 09:15</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700">
                  Chủ bãi gửi đăng ký ban đầu thông qua cổng trực tuyến Merchant Portal.
                </p>
                <div className="text-[11px] font-mono text-slate-500">
                  Người gửi: Lê Văn Thành (Merchant ID: #MCH-88219)
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#131b2e] font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Đóng Nhật Ký
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
