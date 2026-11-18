import { useEffect, useRef, useState } from 'react'
import { isAxiosError } from 'axios'
import { useForm, useWatch } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { MerchantProfile } from '../types/merchantProfileTypes'
import type {
  DocumentType,
  MerchantVerificationDetail,
  SubmitVerificationPayload,
  UpdateVerificationDetailsPayload,
  VerificationDocument,
} from '../types/merchantVerificationTypes'
import {
  fetchMerchantVerification,
  updateVerificationDetailsApi,
  uploadVerificationDocumentApi,
  deleteVerificationDocumentApi,
  submitVerificationApi,
  downloadMerchantDocument,
} from '../api/merchantVerificationApi'
import { errorMessage } from '@/shared/api/resources'
import { Notice } from '@/shared/components/Workspace'
import { Button } from '@/shared/components/Button'
import { Dialog } from '@/shared/components/Dialog'
import { NotificationDialog } from '@/shared/components/NotificationDialog'
import { ProfileSection, ProfileField, profileInput, profileButton } from './ProfileSection'
import { VerificationStatusBadge } from './VerificationStatusBadge'
import { VerificationAssessmentSummary } from './VerificationAssessmentSummary'
import { VerificationHistoryTimeline } from './VerificationHistoryTimeline'
import { getVerificationItemLabel, verificationItemLabels, verificationDocumentTypes } from '../merchantVerificationLabels'
import {
  FileText,
  Upload,
  Trash2,
  Download,
  AlertCircle,
  Send,
  Save,
  RotateCw,
} from 'lucide-react'

export const verificationDossierQueryKey = ['merchant-verification-dossier'] as const

interface ProfileDocumentsProps {
  profile: MerchantProfile
  onUpdated: (profile: MerchantProfile) => void
}

const DOCUMENT_TYPE_DESCRIPTIONS: Record<DocumentType, string> = {
  BUSINESS_REGISTRATION: 'Bắt buộc. Tải lên 1-3 tệp (PDF, JPEG, PNG, WebP), tối đa 5MB mỗi tệp.',
  AUTHORIZATION_LETTER: 'Tùy chọn hoặc khi Admin yêu cầu bổ sung.',
  SUPPORTING_DOCUMENT: 'Tùy chọn. Các văn bản chứng minh quyền đại diện hoặc giấy phép liên quan.',
}

function formValues(verification?: MerchantVerificationDetail) {
  return {
    license: verification?.businessRegistrationNumber ?? '',
    legalName: verification?.legalName ?? '',
    resubmissionNote: verification?.resubmissionNote ?? '',
  }
}

export function ProfileDocuments({ profile, onUpdated }: ProfileDocumentsProps) {
  const queryClient = useQueryClient()

  // 1. Query current verification dossier
  const verificationQuery = useQuery({
    queryKey: verificationDossierQueryKey,
    queryFn: ({ signal }) => fetchMerchantVerification(signal),
    refetchInterval: ({ state }) => {
      if (state.data?.assessment.status === 'PENDING') return 3000
      return state.data?.status === 'PENDING_REVIEW' ? 15000 : false
    },
    staleTime: 10_000,
    retry: false,
    refetchOnWindowFocus: true,
  })

  const verification = verificationQuery.data

  const { register, reset, control, formState: { dirtyFields, isDirty } } = useForm({
    defaultValues: formValues(verification),
  })
  const [license, legalName, resubmissionNote] = useWatch({
    control,
    name: ['license', 'legalName', 'resubmissionNote'],
  })
  const hasDirtyFields = Object.keys(dirtyFields).length > 0
  const formVersion = useRef(verification?.submissionVersion)
  const formStatus = useRef(verification?.status)
  const reviewInfoButton = useRef<HTMLButtonElement>(null)
  const [pendingSubmission, setPendingSubmission] = useState<SubmitVerificationPayload | null>(null)
  const [ocrSelection, setOcrSelection] = useState<{ id: string; version: number | null } | null>(null)
  const [activeDialog, setActiveDialog] = useState<{ title: string; message: string } | null>(null)
  const [validationError, setValidationError] = useState('')
  const [conflictNotice, setConflictNotice] = useState('')
  const [downloadError, setDownloadError] = useState('')
  const [isReloadingConflict, setIsReloadingConflict] = useState(false)

  useEffect(() => {
    if (!verification) return
    reset(formValues(verification), {
      keepDirtyValues: formVersion.current === verification.submissionVersion
        && formStatus.current === verification.status
        && verification.editableItems.includes('BUSINESS_INFO'),
    })
    formVersion.current = verification.submissionVersion
    formStatus.current = verification.status
  }, [verification, reset])

  const updateCachedDossier = (data: MerchantVerificationDetail) => {
    // Cancel older reads before applying the revision returned by the write.
    void queryClient.cancelQueries({ queryKey: verificationDossierQueryKey })
    queryClient.setQueryData(verificationDossierQueryKey, data)
    setConflictNotice('')
    setValidationError('')
  }

  const handleWriteError = async (error: unknown) => {
    if (!isAxiosError(error) || error.response?.status !== 409) {
      setValidationError(errorMessage(error))
      return
    }

    setIsReloadingConflict(true)
    setValidationError('')
    setConflictNotice('Hồ sơ đã thay đổi. Đang tải dữ liệu mới nhất…')
    const fresh = await verificationQuery.refetch()
    setConflictNotice(fresh.isSuccess
      ? 'Dữ liệu mới nhất đã được tải lại. Kiểm tra nội dung trước khi tiếp tục.'
      : 'Hồ sơ đã thay đổi và chưa thể tải lại. Vui lòng thử lại.')
    setIsReloadingConflict(false)
  }

  const retryDossier = async () => {
    const result = await verificationQuery.refetch()
    if (result.isSuccess) setConflictNotice('')
  }

  const saveDetailsMutation = useMutation({
    mutationFn: (payload: UpdateVerificationDetailsPayload) => updateVerificationDetailsApi(payload),
    onSuccess: (data) => {
      updateCachedDossier(data)
      reset(formValues(data))
      onUpdated({ ...profile, businessLicense: data.businessRegistrationNumber })
      setActiveDialog({
        title: 'Đã lưu thông tin doanh nghiệp',
        message: 'Thông tin bản nháp đã được lưu thành công vào hồ sơ xác minh.',
      })
    },
    onError: handleWriteError,
  })

  const submitMutation = useMutation({
    mutationFn: submitVerificationApi,
    onSuccess: (data) => {
      updateCachedDossier(data)
      onUpdated({
        ...profile,
        verificationStatus: 'PENDING_REVIEW',
        verificationLabel: 'Chờ duyệt',
        businessLicense: data.businessRegistrationNumber,
      })
      setActiveDialog({
        title: 'Gửi hồ sơ thành công',
        message: `Phiên bản nộp #${data.submissionVersion} đang chờ Quản trị viên xét duyệt.`,
      })
    },
    onError: handleWriteError,
  })

  const uploadDocMutation = useMutation({
    mutationFn: ({ type, draftRevision, files }: { type: DocumentType; draftRevision: number; files: File[] }) =>
      uploadVerificationDocumentApi(type, draftRevision, files),
    onSuccess: (data) => {
      updateCachedDossier(data)
      setActiveDialog({
        title: 'Đã tải lên tài liệu',
        message: 'Tài liệu đã được tải lên và lưu vào bản nháp thành công.',
      })
    },
    onError: handleWriteError,
  })

  const deleteDocMutation = useMutation({
    mutationFn: ({ type, draftRevision }: { type: DocumentType; draftRevision: number }) =>
      deleteVerificationDocumentApi(type, draftRevision),
    onSuccess: (data) => {
      updateCachedDossier(data)
      setActiveDialog({
        title: 'Đã xóa tài liệu',
        message: 'Đã xóa toàn bộ tệp thuộc loại tài liệu này khỏi bản nháp.',
      })
    },
    onError: handleWriteError,
  })

  const handleDownload = async (file: VerificationDocument) => {
    setDownloadError('')
    try {
      await downloadMerchantDocument(file.id, file.originalName)
    } catch {
      setDownloadError('Không thể tải tệp ' + file.originalName + '. Vui lòng thử lại.')
    }
  }

  // Validate file before upload
  const validateFiles = (files: File[]): string | null => {
    if (files.length === 0) return 'Vui lòng chọn ít nhất 1 tệp.'
    if (files.length > 3) return 'Chỉ được tải lên tối đa 3 tệp cho mỗi loại tài liệu.'
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
    let totalSize = 0
    for (const f of files) {
      if (!allowedTypes.includes(f.type)) {
        return 'Chọn PDF, JPEG, PNG hoặc WEBP có dung lượng từ 1 byte đến 5 MB.'
      }
      if (f.size > 5 * 1024 * 1024 || f.size === 0) {
        return 'Chọn PDF, JPEG, PNG hoặc WEBP có dung lượng từ 1 byte đến 5 MB.'
      }
      totalSize += f.size
    }
    if (totalSize > 16 * 1024 * 1024) {
      return 'Tổng dung lượng các tệp tải lên không được vượt quá 16 MB.'
    }
    return null
  }

  // Handle document file upload per type
  const handleFileUpload = (type: DocumentType, draftRevision: number, fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return
    const files = Array.from(fileList)
    const error = validateFiles(files)
    if (error) {
      setValidationError(error)
      return
    }
    setValidationError('')
    uploadDocMutation.mutate({ type, draftRevision, files })
  }

  const sectionTitle = 'Giấy tờ pháp lý & Định danh doanh nghiệp'
  const sectionDescription = 'Xem thông tin định danh và gửi hồ sơ pháp lý để xét duyệt.'
  if (!verification) {
    return (
      <ProfileSection id="giay-to" title={sectionTitle} description={sectionDescription}>
        {verificationQuery.isError ? (
          <>
            <Notice>Không thể tải hồ sơ xác minh. {errorMessage(verificationQuery.error)}</Notice>
            <button type="button" className={profileButton} onClick={() => void retryDossier()}>
              Thử tải lại
            </button>
          </>
        ) : <p role="status">Đang tải hồ sơ xác minh…</p>}
      </ProfileSection>
    )
  }

  const { status, draftRevision, editableItems } = verification
  const canEditBusinessInfo = editableItems.includes('BUSINESS_INFO')
  const isVerified = status === 'VERIFIED'
  const isPendingReview = status === 'PENDING_REVIEW'
  const isChangesRequested = status === 'CHANGES_REQUESTED'
  const nextSubmissionVersion = (verification.submissionVersion ?? 0) + 1
  const displayedDocumentTypes = isChangesRequested
    ? [
        ...verificationDocumentTypes.filter((type) => editableItems.includes(type)),
        ...verificationDocumentTypes.filter((type) => !editableItems.includes(type)),
      ]
    : verificationDocumentTypes
  const registrationDocuments = verification.documents.filter((doc) => doc.type === 'BUSINESS_REGISTRATION')
  const ocrDocument = registrationDocuments.length === 1
    ? registrationDocuments[0]
    : registrationDocuments.find((doc) => ocrSelection?.version === verification.submissionVersion
        && doc.id === ocrSelection.id)
  const ocrDocumentId = registrationDocuments.length > 1 ? ocrDocument?.id : undefined
  const outstandingItem = isChangesRequested
    ? verification.requestedItems.find((item) => item.addressed === false)
    : undefined

  let missingReason = ''
  if (!license.trim()) {
    missingReason = 'Vui lòng nhập Mã số doanh nghiệp/GPKD.'
  } else if (!legalName.trim()) {
    missingReason = 'Vui lòng nhập Tên pháp lý doanh nghiệp.'
  } else if (isDirty || hasDirtyFields) {
    missingReason = 'Vui lòng lưu thông tin đã chỉnh sửa trước khi gửi hồ sơ.'
  } else if (registrationDocuments.length === 0) {
    missingReason = 'Bắt buộc phải tải lên Giấy chứng nhận đăng ký kinh doanh/doanh nghiệp.'
  } else if (!ocrDocument) {
    missingReason = 'Vui lòng chọn tệp giấy đăng ký kinh doanh dùng để đối chiếu.'
  } else if (outstandingItem) {
    missingReason = outstandingItem.key === 'BUSINESS_INFO'
      ? 'Vui lòng cập nhật hoặc xác nhận lại thông tin doanh nghiệp kèm giải trình.'
      : `Vui lòng tải lên tài liệu mới cho mục “${getVerificationItemLabel(outstandingItem.key)}”.`
  }
  const canSubmit = !missingReason && (status === 'DRAFT' || isChangesRequested)

  const isAnyPending =
    saveDetailsMutation.isPending ||
    submitMutation.isPending ||
    uploadDocMutation.isPending ||
    deleteDocMutation.isPending ||
    isReloadingConflict ||
    verificationQuery.isError
  const canConfirmSubmission = canSubmit && !isAnyPending && pendingSubmission?.draftRevision === draftRevision
    && pendingSubmission.ocrDocumentId === ocrDocumentId

  return (
    <ProfileSection id="giay-to" title={sectionTitle} description={sectionDescription}>
      {verificationQuery.isError && (
        <div className="mb-6">
          <Notice error>Chưa thể cập nhật hồ sơ. {errorMessage(verificationQuery.error)}</Notice>
          <button type="button" className={profileButton} onClick={() => void retryDossier()}>
            Thử tải lại
          </button>
        </div>
      )}
      {/* Status Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand-border bg-brand-surface/30 p-4">
        <div>
          <span className="text-xs text-brand-muted uppercase tracking-wider font-semibold">
            Trạng thái xác minh
          </span>
          <div className="mt-1 flex items-center gap-2.5">
            <VerificationStatusBadge status={status} />
            {verification?.submissionVersion && (
              <span className="text-xs text-brand-muted font-medium">
                (Phiên bản nộp #{verification.submissionVersion})
              </span>
            )}
          </div>
        </div>

        {verificationQuery.isFetching && (
          <span className="inline-flex items-center gap-1.5 text-xs text-brand-muted">
            <RotateCw className="h-3.5 w-3.5 animate-spin" /> Đang cập nhật…
          </span>
        )}
      </div>

      {isPendingReview && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          <h4 className="font-semibold">Gửi nhầm giấy tờ?</h4>
          <p className="mt-1 text-xs leading-relaxed">
            Bản đã nộp đang khóa chỉnh sửa. Hãy liên hệ Quản trị viên để yêu cầu bổ sung đúng mục cần sửa.
            Khi hồ sơ chuyển sang “Yêu cầu bổ sung”, bạn có thể sửa các mục được mở và nộp phiên bản mới.
          </p>
        </div>
      )}

      {/* Changes requested banner */}
      {isChangesRequested && verification?.requestedItems && verification.requestedItems.length > 0 && (
        <div className="mb-6 rounded-xl border-l-4 border-rose-500 bg-rose-50/70 p-4">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-rose-900 text-sm">
                Quản trị viên yêu cầu bổ sung/chỉnh sửa hồ sơ
              </h4>
              <p className="mt-1 text-xs text-rose-700">
                Chỉnh sửa các mục dưới đây rồi gửi lại hồ sơ. Hệ thống sẽ tạo phiên bản nộp #{nextSubmissionVersion}; bản cũ được lưu trong lịch sử.
              </p>
              <ul className="mt-2 list-disc pl-4 text-xs text-rose-800 space-y-1">
                {verification.requestedItems.map((item, idx) => (
                  <li key={idx}>
                    <strong className="font-semibold">{getVerificationItemLabel(item.key)}:</strong> {item.reason}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Conflict notice if any */}
      {conflictNotice && (
        <div className="mb-6">
          <Notice error>{conflictNotice}</Notice>
        </div>
      )}

      {downloadError && <Notice error>{downloadError}</Notice>}

      {/* General validation error */}
      {validationError && (
        <div className="mb-6">
          <Notice error>{validationError}</Notice>
        </div>
      )}

      {/* Section 1: Business Details Form */}
      <div className="mb-8 space-y-5 border-b border-brand-border pb-8">
        <h3 className="font-sora text-base font-semibold text-brand-navy flex items-center gap-2">
          <FileText className="h-4 w-4 text-brand-orange-ink" /> Thông tin doanh nghiệp
        </h3>

        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-brand-muted">CCCD / CMND chủ sở hữu</dt>
            <dd className="mt-1 font-semibold text-brand-navy">
              {profile.maskedCitizenId ||
                (profile.citizenId
                  ? '•'.repeat(Math.max(0, profile.citizenId.length - 4)) + profile.citizenId.slice(-4)
                  : 'Chưa cập nhật')}
            </dd>
          </div>
        </dl>

        <fieldset disabled={!canEditBusinessInfo || isAnyPending} className="grid gap-5 sm:grid-cols-2">
          <ProfileField id="profile-license" label="Mã số doanh nghiệp / Giấy phép kinh doanh">
            <input
              id="profile-license"
              className={profileInput}
              maxLength={50}
              placeholder="VD: 0101234567 hoặc GPKD-12345"
              {...register('license', { onChange: () => setValidationError('') })}
            />
          </ProfileField>

          <ProfileField id="profile-legal-name" label="Tên pháp lý công ty / doanh nghiệp">
            <input
              id="profile-legal-name"
              aria-describedby={canEditBusinessInfo ? "profile-legal-name-hint" : undefined}
              className={profileInput}
              maxLength={200}
              placeholder="VD: CÔNG TY TNHH VẬN TẢI SMART"
              {...register('legalName', { onChange: () => setValidationError('') })}
            />
            {canEditBusinessInfo && (
              <p id="profile-legal-name-hint" className="mt-1 text-xs text-brand-muted">
                Nhập tên pháp lý như trên giấy chứng nhận đăng ký kinh doanh.
              </p>
            )}
          </ProfileField>
        </fieldset>

        {isChangesRequested && editableItems.includes('BUSINESS_INFO') && (
          <ProfileField
            id="profile-resubmission-note"
            label="Ghi chú giải trình khi cập nhật lại thông tin doanh nghiệp"
          >
            <textarea
              id="profile-resubmission-note"
              rows={2}
              disabled={isAnyPending}
              className={`${profileInput} resize-none`}
              placeholder="Giải trình lý do hoặc thông tin cập nhật gửi tới Quản trị viên…"
              {...register('resubmissionNote', { onChange: () => setValidationError('') })}
            />
          </ProfileField>
        )}

        {canEditBusinessInfo && (
          <div className="flex items-center justify-end">
            <button
              type="button"
              disabled={isAnyPending || !license.trim() || !legalName.trim()}
              className={`${profileButton} bg-slate-800 text-sm`}
              onClick={() => saveDetailsMutation.mutate({
                draftRevision,
                businessRegistrationNumber: license.trim(),
                legalName: legalName.trim(),
                resubmissionNote: isChangesRequested ? resubmissionNote.trim() || null : null,
              })}
            >
              <Save className="h-4 w-4" />
              {saveDetailsMutation.isPending ? 'Đang lưu…' : 'Lưu nháp thông tin'}
            </button>
          </div>
        )}
      </div>

      {/* Section 2: Document Categories Management */}
      <div className="mb-8 space-y-6 border-b border-brand-border pb-8">
        <h3 className="font-sora text-base font-semibold text-brand-navy flex items-center gap-2">
          <Upload className="h-4 w-4 text-brand-orange-ink" /> Tài liệu & Giấy tờ đính kèm
        </h3>

        {isChangesRequested && (
          <p className="text-xs text-brand-muted">
            Bản chỉnh sửa cho phiên #{nextSubmissionVersion}. Các nhóm ngoài yêu cầu bổ sung giữ nguyên tệp từ bản đã nộp.
          </p>
        )}

        <div className="space-y-6">
          {displayedDocumentTypes.map(
            (docType) => {
              const title = verificationItemLabels[docType]
              const req = (verification?.requirements ?? []).find((r) => r.type === docType)
              const isRequired = req ? req.required : docType === 'BUSINESS_REGISTRATION'
              const docs = (verification?.documents ?? []).filter((d) => d.type === docType)
              const canEditThisDoc = editableItems.includes(docType)
              const inputId = 'profile-verification-' + docType
              const labelId = inputId + '-title'
              const requestedItem = verification.requestedItems.find((item) => item.key === docType)

              return (
                <section
                  key={docType}
                  aria-labelledby={labelId}
                  className="rounded-xl border border-brand-border p-4 bg-white space-y-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 id={labelId} className="font-semibold text-sm text-brand-navy">{title}</h4>
                        {isRequired && (
                          <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                            Bắt buộc
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-brand-muted">{DOCUMENT_TYPE_DESCRIPTIONS[docType]}</p>
                      {isChangesRequested && canEditThisDoc && (
                        <p className="mt-2 text-xs font-medium text-brand-navy">
                          {requestedItem?.addressed === true ? 'Đã cập nhật trong bản chỉnh sửa' : 'Được mở để bổ sung'}
                        </p>
                      )}
                      {isChangesRequested && !canEditThisDoc && (
                        <p className="mt-2 text-xs font-medium text-brand-muted">
                          {docs.length > 0
                            ? `Giữ nguyên tệp từ phiên #${verification.submissionVersion}. Chỉ xem và tải về.`
                            : 'Chỉ mở khi Admin yêu cầu bổ sung nhóm này.'}
                        </p>
                      )}
                    </div>

                    {docs.length > 0 && canEditThisDoc && (
                      <button
                        type="button"
                        disabled={isAnyPending}
                        className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 hover:text-rose-700 disabled:opacity-50"
                        onClick={() => deleteDocMutation.mutate({ type: docType, draftRevision })}
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Xóa tất cả tệp ({docs.length})
                      </button>
                    )}
                  </div>

                  {/* List of uploaded files */}
                  {docs.length > 0 ? (
                    <ul className="divide-y divide-brand-border/60 rounded-lg border border-brand-border/60 bg-brand-surface/30">
                      {docs.map((file) => (
                        <li
                          key={file.id}
                          className="flex items-center justify-between p-3 text-xs gap-3"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <FileText className="h-4 w-4 text-brand-navy shrink-0" />
                            <div className="min-w-0">
                              <p className="font-semibold text-brand-navy truncate">
                                {file.originalName}
                              </p>
                              <p className="text-brand-muted text-[11px]">
                                {(file.sizeBytes / 1024).toFixed(1)} KB · {file.contentType}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 text-brand-orange-ink hover:underline font-semibold shrink-0"
                            onClick={() => void handleDownload(file)}
                          >
                            <Download className="h-3.5 w-3.5" /> Tải về
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-brand-muted italic">Chưa có tệp nào được tải lên.</p>
                  )}

                  {/* File Upload Input if editable */}
                  {canEditThisDoc && (
                    <div className="pt-2 border-t border-brand-border/60">
                      <label htmlFor={inputId} className="block text-xs font-medium text-brand-navy mb-1.5">
                        {docs.length > 0 ? 'Tải tệp mới để thay thế toàn bộ:' : 'Tải lên tệp (1–3 tệp):'}
                      </label>
                      <input
                        id={inputId}
                        type="file"
                        multiple
                        aria-label={'Tải tệp: ' + title}
                        accept=".pdf,.jpg,.jpeg,.png,.webp"
                        disabled={isAnyPending}
                        className="block w-full min-w-0 text-xs text-brand-muted file:mr-3 file:rounded-lg file:border-0 file:bg-brand-surface file:px-3 file:py-2 file:text-xs file:font-semibold file:text-brand-navy hover:file:bg-brand-border/60 focus-visible:outline-2 focus-visible:outline-brand-orange"
                        onChange={(e) => {
                          handleFileUpload(docType, draftRevision, e.target.files)
                          e.target.value = ''
                        }}
                      />
                    </div>
                  )}
                </section>
              )
            },
          )}
        </div>
      </div>

      {/* Section 3: Automatic Assessment Checklist (Visible if pending review, changes requested or verified) */}
      {verification?.assessment && verification.assessment.status !== 'NOT_STARTED' && (
        <div className="mb-8">
          <VerificationAssessmentSummary assessment={verification.assessment} />
        </div>
      )}

      {/* Section 4: Submission / Action Section */}
      {!isVerified && !isPendingReview && (
        <div className="mb-8 rounded-xl border border-brand-border bg-brand-surface/40 p-5">
          {registrationDocuments.length > 1 ? (
            <div className="mb-4 max-w-lg">
              <ProfileField id="profile-ocr-document" label="Tệp dùng để đối chiếu">
                <select
                  id="profile-ocr-document"
                  className={profileInput}
                  disabled={isAnyPending}
                  value={ocrDocumentId ?? ''}
                  onChange={(event) => {
                    setValidationError('')
                    setOcrSelection({ id: event.target.value, version: verification.submissionVersion })
                  }}
                >
                  <option value="" disabled>Chọn giấy đăng ký kinh doanh</option>
                  {registrationDocuments.map((doc) => (
                    <option key={doc.id} value={doc.id}>{doc.originalName}</option>
                  ))}
                </select>
              </ProfileField>
            </div>
          ) : ocrDocument && (
            <p className="mb-4 break-words text-sm text-brand-navy">
              <strong>Tệp dùng để đối chiếu</strong> · {ocrDocument.originalName}
            </p>
          )}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="min-w-0">
              <h4 className="font-semibold text-sm text-brand-navy">
                {isChangesRequested ? 'Gửi phiên bản mới để xét duyệt' : 'Gửi hồ sơ xét duyệt'}
              </h4>
              <p className="mt-1 text-xs text-brand-muted">
                {canSubmit
                  ? 'Kiểm tra lại thông tin và tệp đính kèm trước khi gửi.'
                  : missingReason}
              </p>
            </div>
            <div>
              <button
                type="button"
                disabled={!canSubmit || isAnyPending}
                className={`${profileButton} bg-brand-orange-ink hover:bg-brand-orange text-sm`}
                onClick={() => setPendingSubmission({
                  draftRevision,
                  ...(ocrDocumentId ? { ocrDocumentId } : {}),
                })}
              >
                <Send className="h-4 w-4" />
                {submitMutation.isPending
                  ? 'Đang gửi…'
                  : isChangesRequested
                    ? `Gửi phiên bản #${nextSubmissionVersion}`
                    : 'Gửi duyệt hồ sơ'}
              </button>
            </div>
          </div>
        </div>
      )}

      {pendingSubmission && (
        <Dialog
          title={`Xác nhận gửi phiên bản #${nextSubmissionVersion}`}
          description={canConfirmSubmission
            ? 'Hồ sơ sẽ khóa chỉnh sửa sau khi gửi. Nếu cần sửa, Quản trị viên phải mở lại các mục bằng yêu cầu bổ sung.'
            : 'Hồ sơ đã thay đổi. Vui lòng quay lại và kiểm tra trước khi gửi.'}
          maxWidth="sm"
          onClose={() => setPendingSubmission(null)}
          initialFocusRef={reviewInfoButton}
        >
          {canConfirmSubmission && ocrDocument && (
            <p className="mb-4 break-words text-sm text-brand-navy">
              <strong>Tệp dùng để đối chiếu</strong> · {ocrDocument.originalName}
            </p>
          )}
          <div className="flex flex-wrap justify-end gap-2">
            <Button ref={reviewInfoButton} type="button" variant="secondary" onClick={() => setPendingSubmission(null)}>
              Kiểm tra lại
            </Button>
            <Button
              type="button"
              disabled={!canConfirmSubmission}
              onClick={() => {
                if (!canConfirmSubmission) return
                setPendingSubmission(null)
                submitMutation.mutate(pendingSubmission)
              }}
            >
              Xác nhận gửi
            </Button>
          </div>
        </Dialog>
      )}

      {/* Section 5: Verification History Timeline */}
      {verification?.history && verification.history.length > 0 && (
        <div className="mb-8">
          <VerificationHistoryTimeline history={verification.history} />
        </div>
      )}

      {activeDialog && (
        <NotificationDialog
          title={activeDialog.title}
          message={activeDialog.message}
          onClose={() => setActiveDialog(null)}
        />
      )}
    </ProfileSection>
  )
}
