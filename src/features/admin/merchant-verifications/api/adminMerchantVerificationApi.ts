import { apiClient } from '@/shared/api/client'
import {
  adaptSpringPage,
  toSpringPageParams,
  type ClientPage,
  type SpringPage,
} from '@/shared/api/adapters'
import type {
  AdminMerchantVerificationDetail,
  AdminTaxLookupResult,
  AdminVerificationFilter,
  AdminVerificationSummary,
  ApproveVerificationPayload,
  RequestChangesPayload,
} from '../types/adminMerchantVerificationTypes'

const BASE_URL = '/api/v1/admin/merchant-verifications'

export async function fetchAdminMerchantVerifications(
  filter?: AdminVerificationFilter,
): Promise<ClientPage<AdminVerificationSummary>> {
  const page = filter?.page ?? 1
  const size = filter?.size ?? 10
  const springParams = toSpringPageParams(page, size)
  const params: Record<string, unknown> = {
    ...springParams,
  }
  if (filter?.status) {
    params.status = filter.status
  }

  const response = await apiClient.get<{ data: SpringPage<AdminVerificationSummary> }>(BASE_URL, {
    params,
  })

  return adaptSpringPage<AdminVerificationSummary>(response.data.data, size)
}

export async function fetchAdminMerchantVerificationDetail(
  dossierId: number,
  signal?: AbortSignal,
): Promise<AdminMerchantVerificationDetail> {
  const response = await apiClient.get<{ data: AdminMerchantVerificationDetail }>(
    `${BASE_URL}/${dossierId}`,
    { signal },
  )
  return response.data.data
}

export async function approveMerchantVerificationApi(
  dossierId: number,
  payload: ApproveVerificationPayload,
): Promise<AdminMerchantVerificationDetail> {
  const response = await apiClient.post<{ data: AdminMerchantVerificationDetail }>(
    `${BASE_URL}/${dossierId}/approve`,
    payload,
  )
  return response.data.data
}

export async function lookupMerchantTaxCode(
  dossierId: number,
  submissionVersion: number,
  household: boolean,
  signal: AbortSignal,
) {
  const response = await apiClient.post<{ data: AdminTaxLookupResult }>(
    `${BASE_URL}/${dossierId}/submissions/${submissionVersion}/tax-lookup`,
    household ? { confirmedHouseholdTaxCode: true } : { confirmedBusinessTaxCode: true },
    { signal },
  )
  return response.data.data
}

export async function requestMerchantVerificationChangesApi(
  dossierId: number,
  payload: RequestChangesPayload,
): Promise<AdminMerchantVerificationDetail> {
  const response = await apiClient.post<{ data: AdminMerchantVerificationDetail }>(
    `${BASE_URL}/${dossierId}/request-changes`,
    payload,
  )
  return response.data.data
}

export function getAdminDocumentContentUrl(
  dossierId: number,
  submissionVersion: number,
  documentId: string,
): string {
  return `${BASE_URL}/${dossierId}/submissions/${submissionVersion}/documents/${documentId}/content`
}

export async function downloadAdminDocument(
  dossierId: number,
  submissionVersion: number,
  documentId: string,
  originalName: string,
): Promise<void> {
  const url = getAdminDocumentContentUrl(dossierId, submissionVersion, documentId)
  const response = await apiClient.get(url, { responseType: 'blob' })
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

export async function fetchAdminDocumentBlob(
  dossierId: number,
  submissionVersion: number,
  documentId: string,
  signal?: AbortSignal,
): Promise<{ blobUrl: string; contentType: string }> {
  const url = getAdminDocumentContentUrl(dossierId, submissionVersion, documentId)
  const response = await apiClient.get(url, { responseType: 'blob', signal })
  const contentType = String(response.headers['content-type'] || 'application/octet-stream')
  const blob = new Blob([response.data], { type: contentType })
  const blobUrl = window.URL.createObjectURL(blob)
  return { blobUrl, contentType }
}
