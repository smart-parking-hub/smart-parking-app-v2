export interface DriverProfile {
  fullName: string | null
  phone: string | null
  email: string | null
  address: string | null
  emergencyContact: string | null
}
export interface UpdateProfileFormData {
  fullName: string
  email: string
  address: string
  emergencyContact: string
}
