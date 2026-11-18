export type VerificationStatus =
  | 'NOT_SUBMITTED'
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'CHANGES_REQUESTED'
  | 'VERIFIED'

export type DocumentType =
  | 'BUSINESS_REGISTRATION'
  | 'AUTHORIZATION_LETTER'
  | 'SUPPORTING_DOCUMENT'

export type AssessmentStatus =
  | 'NOT_STARTED'
  | 'PENDING'
  | 'COMPLETED'
  | 'UNAVAILABLE'

export type CheckCode =
  | 'REQUIRED_DOCUMENT'
  | 'READABILITY'
  | 'REGISTRATION_NUMBER_MATCH'
  | 'LEGAL_NAME_MATCH'

export type CheckResult = 'PASS' | 'WARN' | 'NOT_CHECKED'

export interface VerificationDocument {
  id: string
  type: DocumentType
  originalName: string
  contentType: string
  sizeBytes: number
  uploadedAt: string
}

export interface AssessmentCheck {
  code: CheckCode
  result: CheckResult
  documentType: DocumentType | null
  field: string | null
  declaredValue: string | null
  extractedValue: string | null
  message: string | null
}

export interface AssessmentSource {
  documentId: string
  originalName: string
  method: 'PDF_TEXT' | 'SCANNED_PDF_OCR' | 'IMAGE_OCR'
  submissionVersion: number
}

export interface AssessmentSummary {
  source?: AssessmentSource | null
  status: AssessmentStatus
  checkedAt: string | null
  checks: AssessmentCheck[]
}

export interface RequestedItem {
  key: string
  reason: string
  addressed?: boolean | null
}

export interface DocumentRequirement {
  type: DocumentType
  required: boolean
  maxFiles: number
}

export interface VerificationHistory {
  submissionVersion: number
  action: 'SUBMITTED' | 'CHANGES_REQUESTED' | 'APPROVED' | string
  occurredAt: string
  actor?: string | null
  note?: string | null
  items?: RequestedItem[] | null
}

export interface MerchantVerificationDetail {
  id: number | null
  merchantId: number
  status: VerificationStatus
  draftRevision: number
  submissionVersion: number | null
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

export interface UpdateVerificationDetailsPayload {
  draftRevision: number
  businessRegistrationNumber?: string | null
  legalName?: string | null
  resubmissionNote?: string | null
}

export interface SubmitVerificationPayload {
  draftRevision: number
  ocrDocumentId?: string
}
