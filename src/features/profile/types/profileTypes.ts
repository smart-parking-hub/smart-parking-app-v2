export interface DriverKpiMetrics {
  completedTrips: number
  completedTripsRoute: string
  overtimeViolations: number
  overtimeViolationsDesc: string
  onTimeCheckinRate: string
  onTimeCheckinDesc: string
  complaintIncidents: number
  complaintIncidentsDesc: string
}

export interface EmergencyContact {
  name: string
  phone: string
  relationship: string
}

export interface EnterpriseInvoiceConfig {
  companyName: string
  taxCode: string
  accountingEmail: string
  invoiceTemplate: string
  digitalSignature: string
}

export interface DriverProfile {
  id: number
  fullName: string
  phone: string
  email: string
  driverCode: string
  avatarUrl: string
  dutyStatus: 'READY' | 'ON_DUTY' | 'RESTING'
  dutyStatusText: string
  station: string
  licenseClass: string
  licenseNumber: string
  licenseExpiry: string
  issuingAuthority: string
  rating: number
  experienceYears: number
  cccdNumber: string
  maskedCccd: string
  address: string
  emergencyContact1: EmergencyContact
  emergencyContact2: EmergencyContact
  invoiceConfig: EnterpriseInvoiceConfig
  kpis: DriverKpiMetrics
  lastUpdated: string
}

export interface UpdateProfileFormData {
  fullName: string
  phone: string
  email: string
  address: string
  emergencyContact1Name: string
  emergencyContact1Phone: string
  emergencyContact2Name: string
  emergencyContact2Phone: string
  companyName: string
  taxCode: string
  accountingEmail: string
}
