export type CameraFacingMode = 'environment' | 'user'

export type CameraStatus = 'IDLE' | 'STARTING' | 'SCANNING' | 'STOPPED' | 'ERROR'

export type CameraSecurityReason =
  | 'OK'
  | 'INSECURE_CONTEXT'
  | 'UNSUPPORTED_BROWSER'
  | 'NO_MEDIA_DEVICES'

export interface CameraSecurityStatus {
  isSecureContext: boolean
  hasMediaDevices: boolean
  isSupported: boolean
  reason: CameraSecurityReason
}

export type CameraErrorType =
  | 'PERMISSION_DENIED'
  | 'NOT_FOUND'
  | 'INSECURE_CONTEXT'
  | 'STREAM_ERROR'
  | 'OVERCONSTRAINED'
  | 'UNKNOWN'

export interface CameraErrorInfo {
  type: CameraErrorType
  title: string
  message: string
  canRetry: boolean
}

export interface BarieScanResult {
  bookingCode: string
  timestamp: number
  format?: string
}
