import type {
  VerificationStatus,
  AssessmentStatus,
  DocumentType,
  VerificationDocument,
  AssessmentSummary,
  RequestedItem,
  DocumentRequirement,
  VerificationHistory,
} from '@/features/merchant/profile'

export interface AdminVerificationSummary {
  id: number
  merchantId: number
  legalName: string | null
  businessRegistrationNumber: string | null
  status: VerificationStatus
  assessmentStatus: AssessmentStatus
  submissionVersion: number
  submittedAt: string
}

export interface AdminMerchantVerificationDetail {
  id: number
  merchantId: number
  status: VerificationStatus
  draftRevision?: number | null
  submissionVersion: number
  businessRegistrationNumber: string | null
  legalName: string | null
  resubmissionNote: string | null
  documents: VerificationDocument[]
  assessment: AssessmentSummary
  requestedItems: RequestedItem[]
  requirements: DocumentRequirement[]
  editableItems: string[]
  history: VerificationHistory[]
  updatedAt: string | null
}

export interface AdminVerificationFilter {
  page?: number
  size?: number
  status?: VerificationStatus
}

export type AdminTaxLookupResult = {
  dossierId: number
  submissionVersion: number
  checkedAt: string
  retryAt: string | null
} & (
  | {
      outcome: 'FOUND'
      business: { taxCode: string; name: string; status: string | null; source: string | null; trial: boolean }
    }
  | { outcome: 'NOT_FOUND' | 'UNAVAILABLE'; business: null }
)

export interface ApproveVerificationPayload {
  submissionVersion: number
  documentsReviewed: boolean
  note?: string | null
}

export interface RequestChangesPayload {
  submissionVersion: number
  resetLegalName?: boolean
  items: Array<{
    key: 'BUSINESS_INFO' | DocumentType | string
    reason: string
  }>
}
