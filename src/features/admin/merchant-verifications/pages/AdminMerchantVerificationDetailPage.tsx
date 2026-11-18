import { useEffect, useState } from 'react'
import { isAxiosError } from 'axios'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchAdminMerchantVerificationDetail,
  approveMerchantVerificationApi,
  requestMerchantVerificationChangesApi,
  downloadAdminDocument,
} from '../api/adminMerchantVerificationApi'
import type {
  ApproveVerificationPayload,
  RequestChangesPayload,
} from '../types/adminMerchantVerificationTypes'
import { AssessmentChecklist } from '../components/AssessmentChecklist'
import { BusinessTaxLookup } from '../components/BusinessTaxLookup'
import { DocumentViewerModal } from '../components/DocumentViewerModal'
import { ApproveVerificationModal } from '../components/ApproveVerificationModal'
import { RequestChangesModal } from '../components/RequestChangesModal'
import {
  VerificationStatusBadge,
  VerificationHistoryTimeline,
  getVerificationItemLabel,
  verificationDocumentTypes,
  type VerificationDocument,
} from '@/features/merchant/profile'
import { Button } from '@/shared/components/Button'
import { Notice } from '@/shared/components/Workspace'
import { errorMessage } from '@/shared/api/resources'
import {
  ArrowLeft,
  FileText,
  Eye,
  Download,
  CheckCircle2,
  AlertTriangle,
  Building2,
  FileX,
} from 'lucide-react'

export const adminVerificationDetailQueryKey = (id: number) =>
  ['admin-merchant-verification-detail', id] as const

type VerificationAction = { version: number; dossierId: number } & (
  | { kind: 'approve' }
  | {
      kind: 'requestChanges'
      document?: VerificationDocument
      nameMismatch?: { declaredName: string; extractedName: string }
    }
)

export function AdminMerchantVerificationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const dossierId = Number(id)
  const queryClient = useQueryClient()

  // Modal states
  const [activeDoc, setActiveDoc] = useState<{ document: VerificationDocument; version: number; dossierId: number } | null>(null)
  const [action, setAction] = useState<VerificationAction | null>(null)
  const [actionError, setActionError] = useState('')
  const [downloadError, setDownloadError] = useState('')
  const [isReloadingConflict, setIsReloadingConflict] = useState(false)
  const [conflictMessage, setConflictMessage] = useState<string | null>(null)
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null)

  // Query dossier details
  const query = useQuery({
    queryKey: adminVerificationDetailQueryKey(dossierId),
    queryFn: ({ signal }) => fetchAdminMerchantVerificationDetail(dossierId, signal),
    refetchInterval: ({ state }) => {
      if (action) return false
      const dossier = state.data
      if (dossier?.assessment.status === 'PENDING') return 3000
      return dossier?.status === 'PENDING_REVIEW' || dossier?.status === 'CHANGES_REQUESTED'
        ? 15000
        : false
    },
    enabled: Boolean(dossierId),
    staleTime: 10_000,
    retry: false,
  })

  const { data: dossier, isLoading, isError, error, refetch, isFetching } = query

  const currentAction = !isError && action?.dossierId === dossierId && action.version === dossier?.submissionVersion
    && dossier.status === 'PENDING_REVIEW' ? action : null

  useEffect(() => {
    if (action && !currentAction) {
      setAction(null)
      setActionError('')
    }
  }, [action, currentAction])

  const closeAction = () => {
    setAction(null)
    setActionError('')
  }

  const handleActionError = async (error: unknown) => {
    if (!isAxiosError(error) || error.response?.status !== 409) {
      setActionError(errorMessage(error))
      return
    }

    closeAction()
    setIsReloadingConflict(true)
    setConflictMessage('Hồ sơ đã thay đổi. Đang tải dữ liệu mới nhất…')
    const fresh = await refetch()
    setConflictMessage(fresh.isSuccess
      ? 'Dữ liệu mới nhất đã được tải lại. Vui lòng kiểm tra và xác nhận lại.'
      : 'Hồ sơ đã thay đổi và chưa thể tải lại. Vui lòng thử lại.')
    setIsReloadingConflict(false)
  }

  const retryDossier = async () => {
    const result = await refetch()
    if (result.isSuccess) setConflictMessage(null)
  }

  const applyDecision = (
    data: Awaited<ReturnType<typeof fetchAdminMerchantVerificationDetail>>,
    message: string,
  ) => {
    const queryKey = adminVerificationDetailQueryKey(data.id)
    void queryClient.cancelQueries({ queryKey })
    queryClient.setQueryData(queryKey, data)
    void queryClient.invalidateQueries({ queryKey: ['admin-merchant-verifications'] })
    setConflictMessage(null)
    closeAction()
    setActionSuccessMessage(message)
  }

  const approveMutation = useMutation({
    mutationFn: (payload: ApproveVerificationPayload) =>
      approveMerchantVerificationApi(dossierId, payload),
    onSuccess: (data) => applyDecision(data, 'Đã phê duyệt hồ sơ doanh nghiệp chủ bãi thành công!'),
    onError: handleActionError,
  })

  const requestChangesMutation = useMutation({
    mutationFn: (payload: RequestChangesPayload) =>
      requestMerchantVerificationChangesApi(dossierId, payload),
    onSuccess: (data) => applyDecision(data, 'Đã gửi yêu cầu bổ sung/sửa đổi hồ sơ tới chủ bãi xe!'),
    onError: handleActionError,
  })

  const handleDownload = async (document: VerificationDocument, version: number) => {
    setDownloadError('')
    try {
      await downloadAdminDocument(dossierId, version, document.id, document.originalName)
    } catch {
      setDownloadError('Không thể tải tệp ' + document.originalName + '. Vui lòng thử lại.')
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 rounded" />
        <div className="h-32 bg-slate-100 rounded-xl" />
        <div className="h-64 bg-slate-100 rounded-xl" />
      </div>
    )
  }

  if (isError || !dossier) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-4">
        <Link
          to="/admin/merchant-verifications"
          className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" /> Quay lại danh sách
        </Link>
        <Notice error>{conflictMessage || errorMessage(error) || 'Không tìm thấy hồ sơ xác minh.'}</Notice>
        <Button type="button" variant="secondary" onClick={() => void retryDossier()} disabled={isFetching}>
          Thử tải lại
        </Button>
      </div>
    )
  }

  const isPendingReview = dossier.status === 'PENDING_REVIEW'
  const documentTypes = new Set([...verificationDocumentTypes, ...dossier.documents.map((doc) => doc.type)])
  const documentGroups = Array.from(documentTypes, (type) => ({
    type,
    documents: dossier.documents.filter((doc) => doc.type === type),
  })).filter(({ documents }) => documents.length > 0)

  const canApprove = isPendingReview && dossier.assessment.status !== 'PENDING'
  const actionPending = approveMutation.isPending || requestChangesMutation.isPending || isReloadingConflict

  const source = dossier.assessment.source
  const sourceDocument = source?.submissionVersion === dossier.submissionVersion
    ? dossier.documents.find((doc) => doc.id === source.documentId)
    : undefined

  const openRequestChanges = (document?: VerificationDocument) => {
    setActiveDoc(null)
    setAction({
      kind: 'requestChanges',
      version: dossier.submissionVersion,
      dossierId,
      document,
    })
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Back button and breadcrumb */}
      <div>
        <Link
          to="/admin/merchant-verifications"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Quay lại danh sách hồ sơ
        </Link>
      </div>

      {/* Conflict notice */}
      {conflictMessage && (
        <Notice error>
          <div>
            <p>{conflictMessage}</p>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="mt-2"
              onClick={() => setConflictMessage(null)}
            >
              Đã hiểu
            </Button>
          </div>
        </Notice>
      )}

      {/* Success notice */}
      {actionSuccessMessage && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 flex items-center justify-between text-xs text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{actionSuccessMessage}</span>
          </div>
          <button
            type="button"
            className="text-emerald-700 hover:underline font-semibold"
            onClick={() => setActionSuccessMessage(null)}
          >
            Đóng
          </button>
        </div>
      )}

      {downloadError && <Notice error>{downloadError}</Notice>}

      {/* Main Dossier Summary Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl font-bold text-slate-900">
                Hồ sơ #{dossier.id} · {dossier.legalName || 'Doanh nghiệp chưa đặt tên'}
              </h1>
              <VerificationStatusBadge status={dossier.status} />
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Chủ bãi ID: <strong className="text-slate-800 font-mono">#{dossier.merchantId}</strong> · Phiên bản nộp:{' '}
              <strong className="text-slate-800">v{dossier.submissionVersion}</strong> · Cập nhật:{' '}
              {dossier.updatedAt ? new Date(dossier.updatedAt).toLocaleString('vi-VN') : '—'}
            </p>
          </div>

          {isPendingReview && (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={actionPending}
                onClick={() => openRequestChanges()}
                leftIcon={<AlertTriangle className="h-4 w-4 text-amber-600" />}
                className="border-amber-300 hover:bg-amber-50 text-amber-800 font-semibold"
              >
                Yêu cầu bổ sung
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                disabled={!canApprove || actionPending}
                onClick={() => setAction({ kind: 'approve', version: dossier.submissionVersion, dossierId })}
                leftIcon={<CheckCircle2 className="h-4 w-4" />}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              >
                Duyệt hồ sơ
              </Button>
            </div>
          )}
        </div>

        {/* Declared Details Section */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 space-y-3">
            <h3 className="text-xs uppercase font-semibold text-slate-500 flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-slate-600" /> Thông tin tự khai báo
            </h3>
            <dl className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <dt className="text-slate-500">Mã số thuế / GPKD:</dt>
                <dd className="font-mono font-bold text-slate-900 mt-0.5">
                  {dossier.businessRegistrationNumber || '—'}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Tên pháp lý công ty:</dt>
                <dd className="font-semibold text-slate-900 mt-0.5">
                  {dossier.legalName || '—'}
                </dd>
              </div>
            </dl>
            {isPendingReview && (
              <BusinessTaxLookup
                key={`${dossier.id}:${dossier.submissionVersion}`}
                dossier={dossier}
                disabled={isReloadingConflict}
                onConflict={handleActionError}
              />
            )}
            {dossier.resubmissionNote && (
              <div className="mt-3 border-t border-slate-200/60 pt-2.5">
                <span className="text-[11px] text-slate-500 font-semibold">
                  Ghi chú giải trình khi nộp lại:
                </span>
                <p className="mt-1 text-xs text-slate-800 bg-white p-2.5 rounded border border-slate-200">
                  {dossier.resubmissionNote}
                </p>
              </div>
            )}
          </div>

          {/* Submitted Documents List */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 space-y-3">
            <h3 className="text-xs uppercase font-semibold text-slate-500 flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-slate-600" /> Tài liệu đính kèm ({dossier.documents.length})
            </h3>
            {documentGroups.length > 0 ? (
              <div className="space-y-3">
                {documentGroups.map(({ type, documents }) => (
                  <section key={type} aria-labelledby={`document-group-${type}`} className="min-w-0 rounded-lg border border-slate-200 bg-white">
                    <h4
                      id={`document-group-${type}`}
                      className="flex items-start justify-between gap-2 rounded-t-lg border-b border-slate-200 bg-slate-100 px-2.5 py-2 text-xs font-semibold text-slate-800"
                    >
                      <span>{getVerificationItemLabel(type)}</span>
                      <span className="shrink-0 text-slate-600">{documents.length} tệp</span>
                    </h4>
                    <ul className="divide-y divide-slate-200/60">
                      {documents.map((doc) => (
                        <li
                          key={doc.id}
                          className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 p-2.5 text-xs hover:bg-slate-50"
                        >
                          <div className="min-w-0 basis-40 grow">
                            <p className="font-semibold text-slate-900 truncate">{doc.originalName}</p>
                            <p className="text-[11px] text-slate-500">
                              {(doc.sizeBytes / 1024).toFixed(1)} KB · {doc.contentType}
                            </p>
                          </div>
                          <div className="flex max-w-full flex-wrap items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setActiveDoc({ document: doc, version: dossier.submissionVersion, dossierId })}
                              className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-200"
                            >
                              <Eye className="h-3 w-3" /> Xem
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleDownload(doc, dossier.submissionVersion)}
                              className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-200"
                            >
                              <Download className="h-3 w-3" /> Tải về
                            </button>
                            {isPendingReview && (
                              <button
                                type="button"
                                disabled={actionPending}
                                aria-label={'Không đúng yêu cầu – ' + doc.originalName + ' (' + getVerificationItemLabel(doc.type) + ')'}
                                onClick={() => openRequestChanges(doc)}
                                className="inline-flex items-center gap-1 rounded bg-rose-50 px-2 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-50"
                              >
                                <FileX className="h-3 w-3" aria-hidden="true" /> Không đúng yêu cầu
                              </button>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Không có tệp đính kèm nào.</p>
            )}
          </div>
        </div>
      </div>

      {/* Preliminary Assessment Checklist */}
      <AssessmentChecklist
        assessment={dossier.assessment}
        onOpenSource={source && sourceDocument
          ? () => setActiveDoc({ document: sourceDocument, version: source.submissionVersion, dossierId })
          : undefined}
        onRequestLegalNameCorrection={canApprove && !actionPending
          ? (declaredName, extractedName) => {
              setAction({
                kind: 'requestChanges',
                version: dossier.submissionVersion,
                dossierId,
                nameMismatch: { declaredName, extractedName },
              })
            }
          : undefined}
      />

      {/* History Timeline */}
      <VerificationHistoryTimeline history={dossier.history} />

      {activeDoc?.dossierId === dossierId && (
        <DocumentViewerModal
          key={activeDoc.version + ':' + activeDoc.document.id}
          isOpen
          onClose={() => setActiveDoc(null)}
          dossierId={dossierId}
          submissionVersion={activeDoc.version}
          documentId={activeDoc.document.id}
          originalName={activeDoc.document.originalName}
          documentTypeLabel={getVerificationItemLabel(activeDoc.document.type)}
          contentType={activeDoc.document.contentType}
          onRequestChanges={isPendingReview && !actionPending && activeDoc.version === dossier.submissionVersion
            ? () => openRequestChanges(activeDoc.document)
            : undefined}
        />
      )}

      {currentAction?.kind === 'approve' && canApprove && (
        <ApproveVerificationModal
          isOpen
          onClose={closeAction}
          submissionVersion={currentAction.version}
          assessment={dossier.assessment}
          isPending={approveMutation.isPending}
          error={actionError}
          onConfirm={(payload) => {
            setActionError('')
            approveMutation.mutate(payload)
          }}
        />
      )}

      {currentAction?.kind === 'requestChanges' && (
        <RequestChangesModal
          isOpen
          onClose={closeAction}
          submissionVersion={currentAction.version}
          isPending={requestChangesMutation.isPending}
          document={currentAction.document}
          nameMismatch={currentAction.nameMismatch}
          error={actionError}
          onConfirm={(payload) => {
            setActionError('')
            requestChangesMutation.mutate(payload)
          }}
        />
      )}
    </div>
  )
}
