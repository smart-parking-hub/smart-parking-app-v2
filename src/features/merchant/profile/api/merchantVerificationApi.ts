import { apiClient } from '@/shared/api/client'
import type {
  DocumentType,
  MerchantVerificationDetail,
  SubmitVerificationPayload,
  UpdateVerificationDetailsPayload,
} from '../types/merchantVerificationTypes'

const BASE_URL = '/api/v1/merchant/profile/verification'

export async function fetchMerchantVerification(signal?: AbortSignal): Promise<MerchantVerificationDetail> {
  const response = await apiClient.get<{ data: MerchantVerificationDetail }>(BASE_URL, { signal })
  const dossier = response.data?.data
  if (!dossier || !Number.isSafeInteger(dossier.draftRevision) || dossier.draftRevision < 1
    || !Array.isArray(dossier.editableItems) || !Array.isArray(dossier.documents)
    || !Array.isArray(dossier.requestedItems) || !dossier.assessment) {
    throw new Error('Dữ liệu hồ sơ xác minh không đúng định dạng.')
  }
  return dossier
}

export async function updateVerificationDetailsApi(
  payload: UpdateVerificationDetailsPayload,
): Promise<MerchantVerificationDetail> {
  const response = await apiClient.put<{ data: MerchantVerificationDetail }>(
    `${BASE_URL}/details`,
    payload,
  )
  return response.data.data
}

export async function uploadVerificationDocumentApi(
  documentType: DocumentType,
  draftRevision: number,
  files: File[],
): Promise<MerchantVerificationDetail> {
  const formData = new FormData()
  formData.append('draftRevision', String(draftRevision))
  for (const file of files) {
    formData.append('files', file)
  }
  const response = await apiClient.put<{ data: MerchantVerificationDetail }>(
    `${BASE_URL}/documents/${documentType}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )
  return response.data.data
}

export async function deleteVerificationDocumentApi(
  documentType: DocumentType,
  draftRevision: number,
): Promise<MerchantVerificationDetail> {
  const response = await apiClient.delete<{ data: MerchantVerificationDetail }>(
    `${BASE_URL}/documents/${documentType}`,
    {
      params: { draftRevision },
    },
  )
  return response.data.data
}

export async function submitVerificationApi(
  payload: SubmitVerificationPayload,
): Promise<MerchantVerificationDetail> {
  const response = await apiClient.post<{ data: MerchantVerificationDetail }>(
    `${BASE_URL}/submit`,
    payload,
  )
  return response.data.data
}

export function getMerchantDocumentContentUrl(documentId: string): string {
  return `${BASE_URL}/documents/${documentId}/content`
}

export async function downloadMerchantDocument(
  documentId: string,
  originalName: string,
): Promise<void> {
  const response = await apiClient.get(getMerchantDocumentContentUrl(documentId), {
    responseType: 'blob',
  })
  const blob = new Blob([response.data], {
    type: String(response.headers['content-type'] || 'application/octet-stream'),
  })
  const blobUrl = window.URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = blobUrl
  anchor.download = originalName
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  window.URL.revokeObjectURL(blobUrl)
}

export async function fetchMerchantDocumentBlob(documentId: string): Promise<{ blobUrl: string; contentType: string }> {
  const response = await apiClient.get(getMerchantDocumentContentUrl(documentId), {
    responseType: 'blob',
  })
  const contentType = String(response.headers['content-type'] || 'application/octet-stream')
  const blob = new Blob([response.data], { type: contentType })
  const blobUrl = window.URL.createObjectURL(blob)
  return { blobUrl, contentType }
}
