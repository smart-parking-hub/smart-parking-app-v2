export interface AdminUser {
  id: number
  phone: string
  email: string
  fullName?: string
  role: string
  status: string
  warningCount?: number
  createdAt: string
  statusReason?: string
  bookingCount?: number
  disputeCount?: number
}

export type RoleFilter =
  | 'ALL'
  | 'ROLE_DRIVER'
  | 'ROLE_MERCHANT'
  | 'ROLE_ADMIN'
  | 'DRIVER'
  | 'MERCHANT'
  | 'ADMIN'

export type StatusFilter =
  | 'ALL'
  | 'ACTIVE'
  | 'BANNED'
  | 'LOCKED'
  | 'INACTIVE'

export interface AdminUserFilters {
  keyword: string
  role: RoleFilter
  status: StatusFilter
  page: number
  size: number
}

export interface BanDecisionPayload {
  userId: number
  action: 'ban' | 'unban'
  reason: string
}

