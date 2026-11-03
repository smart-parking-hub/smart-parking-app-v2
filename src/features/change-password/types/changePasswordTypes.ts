export interface PasswordCriteriaStatus {
  hasLen: boolean
  hasUpper: boolean
  hasNum: boolean
  hasSpecial: boolean
  score: number
  label: 'Chưa nhập' | 'Yếu' | 'Trung bình' | 'Khá' | 'Mạnh (Chuẩn Fretrix)'
}

export interface SecurityDeviceItem {
  id: string
  name: string
  deviceType: 'smartphone' | 'tablet' | 'desktop'
  location: string
  lastActive: string
  statusText: string
}

export interface SecurityAuditStatus {
  driverId: string
  protocolVersion: string
  lastChangedDate: string
  daysAgo: number
  isOverdue: boolean
  warningText: string
  activeDevicesCount: number
  activeDevices: SecurityDeviceItem[]
}

export interface ChangePasswordRequestPayload {
  currentPassword: string
  newPassword: string
  logoutOthers?: boolean
}
