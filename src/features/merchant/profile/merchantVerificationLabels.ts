import type { DocumentType } from './types/merchantVerificationTypes'

export const verificationDocumentTypes = [
  'BUSINESS_REGISTRATION',
  'AUTHORIZATION_LETTER',
  'SUPPORTING_DOCUMENT',
] as const satisfies readonly DocumentType[]

type VerificationItemKey = DocumentType | 'BUSINESS_INFO'

export const verificationItemLabels: Record<VerificationItemKey, string> = {
  BUSINESS_INFO: 'Thông tin doanh nghiệp',
  BUSINESS_REGISTRATION: 'Giấy chứng nhận đăng ký doanh nghiệp / kinh doanh',
  AUTHORIZATION_LETTER: 'Giấy ủy quyền đại diện pháp luật',
  SUPPORTING_DOCUMENT: 'Tài liệu / Giấy tờ bổ sung',
}

export function getVerificationItemLabel(key: string) {
  return Object.hasOwn(verificationItemLabels, key)
    ? verificationItemLabels[key as VerificationItemKey]
    : 'Mục bổ sung khác'
}
