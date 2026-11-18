import { useEffect, useState } from 'react'
import { Dialog } from '@/shared/components/Dialog'
import { Button } from '@/shared/components/Button'
import { fetchAdminDocumentBlob, downloadAdminDocument } from '../api/adminMerchantVerificationApi'
import { Download, AlertCircle, RefreshCw, FileText, FileX } from 'lucide-react'

interface DocumentViewerModalProps {
  isOpen: boolean
  onClose: () => void
  dossierId: number
  submissionVersion: number
  documentId: string
  originalName: string
  documentTypeLabel: string
  contentType: string
  onRequestChanges?: () => void
}

export function DocumentViewerModal({
  isOpen,
  onClose,
  dossierId,
  submissionVersion,
  documentId,
  originalName,
  documentTypeLabel,
  contentType,
  onRequestChanges,
}: DocumentViewerModalProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [downloadError, setDownloadError] = useState('')
  const [isDownloading, setIsDownloading] = useState(false)
  const [previewAttempt, setPreviewAttempt] = useState(0)

  const isImage = contentType.startsWith('image/')
  const isPdf = contentType === 'application/pdf'

  useEffect(() => {
    if (!isOpen || !isImage) return

    const request = new AbortController()
    let activeUrl: string | null = null
    setBlobUrl(null)
    setIsLoading(true)
    setError(null)
    fetchAdminDocumentBlob(dossierId, submissionVersion, documentId, request.signal)
      .then((res) => {
        if (request.signal.aborted) {
          window.URL.revokeObjectURL(res.blobUrl)
          return
        }
        activeUrl = res.blobUrl
        setBlobUrl(res.blobUrl)
        setIsLoading(false)
      })
      .catch(() => {
        if (request.signal.aborted) return
        setError('Không thể tải tệp tài liệu. Vui lòng kiểm tra quyền truy cập hoặc kết nối mạng.')
        setIsLoading(false)
      })

    return () => {
      request.abort()
      if (activeUrl) window.URL.revokeObjectURL(activeUrl)
    }
  }, [isOpen, isImage, dossierId, submissionVersion, documentId, previewAttempt])

  const handleDownload = async () => {
    setDownloadError('')
    setIsDownloading(true)
    try {
      await downloadAdminDocument(dossierId, submissionVersion, documentId, originalName)
    } catch {
      setDownloadError('Không thể tải tệp về máy. Vui lòng thử lại.')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={`Tài liệu: ${originalName}`}
      description={documentTypeLabel}
      maxWidth="xl"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3 text-xs text-slate-500">
          <span>Định dạng: {contentType}</span>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => void handleDownload()}
              isLoading={isDownloading}
              leftIcon={<Download className="h-3.5 w-3.5" />}
            >
              Tải tệp về máy
            </Button>
            {onRequestChanges && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={onRequestChanges}
                leftIcon={<FileX className="h-3.5 w-3.5" aria-hidden="true" />}
                className="border-rose-200 text-rose-700 hover:bg-rose-50"
              >
                Không đúng yêu cầu
              </Button>
            )}
          </div>
        </div>

        {downloadError && <p role="alert" className="text-sm text-rose-800">{downloadError}</p>}

        {isLoading && (
          <div className="flex flex-col items-center justify-center p-12 text-slate-500">
            <RefreshCw className="h-8 w-8 animate-spin text-slate-400 mb-3" />
            <p className="text-sm">Đang tải nội dung tệp an toàn…</p>
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-rose-50 border border-rose-200 p-6 text-center">
            <AlertCircle className="h-8 w-8 text-rose-500 mx-auto mb-2" />
            <p role="alert" className="text-sm font-semibold text-rose-800">{error}</p>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="mt-4"
              onClick={() => setPreviewAttempt((attempt) => attempt + 1)}
            >
              Thử xem lại
            </Button>
          </div>
        )}

        {!isLoading && !error && blobUrl && (
          <div className="flex items-center justify-center bg-slate-100 rounded-xl p-4 overflow-auto max-h-[70vh]">
            <img
              src={blobUrl}
              alt={originalName}
              className="max-h-[65vh] max-w-full object-contain rounded shadow-xs"
            />
          </div>
        )}

        {isPdf && (
          <div className="rounded-xl bg-slate-100 px-4 py-8 text-center">
            <FileText className="mx-auto mb-3 h-10 w-10 text-slate-500" aria-hidden="true" />
            <p className="text-sm text-slate-700">Tải tệp PDF về máy để xem nội dung.</p>
          </div>
        )}
      </div>
    </Dialog>
  )
}
