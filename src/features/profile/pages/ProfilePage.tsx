import { useState, useEffect } from 'react'
import {
  fetchMyProfile,
  updateMyProfile,
  changeMyPasswordApi,
  fallbackDriverProfile,
} from '../api/profileApi'
import type { DriverProfile } from '../types/profileTypes'
import { ProfileCommandHeader } from '../components/ProfileCommandHeader'
import { DriverIdentityCard } from '../components/DriverIdentityCard'
import { ProfileSidebarNav } from '../components/ProfileSidebarNav'
import { DispatchHelpNote } from '../components/DispatchHelpNote'
import { PersonalInfoSection } from '../components/PersonalInfoSection'
import { EmergencyContactsSection } from '../components/EmergencyContactsSection'
import { EnterpriseInvoiceSection } from '../components/EnterpriseInvoiceSection'
import { ProfileActionsBar } from '../components/ProfileActionsBar'
import { ChangePasswordModal } from '../components/ChangePasswordModal'
import { NotificationSettingsModal } from '../components/NotificationSettingsModal'
import { AvatarUploadModal } from '../components/AvatarUploadModal'
import { ProfileSkeleton } from '../components/ProfileSkeleton'
import { CheckCircle2, X } from 'lucide-react'

export function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<DriverProfile>(fallbackDriverProfile)
  const [isSaving, setIsSaving] = useState(false)
  const [showToast, setShowToast] = useState(false)

  // Modals state
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
  const [isNotificationSettingsOpen, setIsNotificationSettingsOpen] = useState(false)
  const [isAvatarUploadOpen, setIsAvatarUploadOpen] = useState(false)

  // Form Fields State
  const [fullName, setFullName] = useState(fallbackDriverProfile.fullName)
  const [phone, setPhone] = useState(fallbackDriverProfile.phone)
  const [address, setAddress] = useState(fallbackDriverProfile.address)
  const [contact1Name, setContact1Name] = useState(fallbackDriverProfile.emergencyContact1.name)
  const [contact1Phone, setContact1Phone] = useState(fallbackDriverProfile.emergencyContact1.phone)
  const [contact2Name, setContact2Name] = useState(fallbackDriverProfile.emergencyContact2.name)
  const [contact2Phone, setContact2Phone] = useState(fallbackDriverProfile.emergencyContact2.phone)
  const [companyName, setCompanyName] = useState(fallbackDriverProfile.invoiceConfig.companyName)
  const [taxCode, setTaxCode] = useState(fallbackDriverProfile.invoiceConfig.taxCode)
  const [accountingEmail, setAccountingEmail] = useState(fallbackDriverProfile.invoiceConfig.accountingEmail)

  useEffect(() => {
    let isMounted = true
    const loadData = async () => {
      try {
        setLoading(true)
        const data = await fetchMyProfile()
        if (isMounted) {
          setProfile(data)
          setFullName(data.fullName)
          setPhone(data.phone)
          setAddress(data.address)
          setContact1Name(data.emergencyContact1.name)
          setContact1Phone(data.emergencyContact1.phone)
          setContact2Name(data.emergencyContact2.name)
          setContact2Phone(data.emergencyContact2.phone)
          setCompanyName(data.invoiceConfig.companyName)
          setTaxCode(data.invoiceConfig.taxCode)
          setAccountingEmail(data.invoiceConfig.accountingEmail)
        }
      } catch {
        // Fallback ok
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadData()
    return () => {
      isMounted = false
    }
  }, [])

  const handleReset = () => {
    setFullName(profile.fullName)
    setPhone(profile.phone)
    setAddress(profile.address)
    setContact1Name(profile.emergencyContact1.name)
    setContact1Phone(profile.emergencyContact1.phone)
    setContact2Name(profile.emergencyContact2.name)
    setContact2Phone(profile.emergencyContact2.phone)
    setCompanyName(profile.invoiceConfig.companyName)
    setTaxCode(profile.invoiceConfig.taxCode)
    setAccountingEmail(profile.invoiceConfig.accountingEmail)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const updated = await updateMyProfile({
        fullName,
        phone,
        email: profile.email,
        address,
        emergencyContact1Name: contact1Name,
        emergencyContact1Phone: contact1Phone,
        emergencyContact2Name: contact2Name,
        emergencyContact2Phone: contact2Phone,
        companyName,
        taxCode,
        accountingEmail,
      })

      setProfile(updated)
      setShowToast(true)
      setTimeout(() => setShowToast(false), 4000)
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async (currentPass: string, newPass: string) => {
    await changeMyPasswordApi(currentPass, newPass)
  }

  const handleSaveAvatar = (newUrl: string) => {
    setProfile((prev) => ({
      ...prev,
      avatarUrl: newUrl,
    }))
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1280px] mx-auto">
          <ProfileSkeleton />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-6">
        {/* Command Header */}
        <ProfileCommandHeader station={profile.station} />

        {/* Master Layout: 4 Cols Left + 8 Cols Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Identity & Navigation */}
          <aside className="lg:col-span-4 flex flex-col gap-5">
            <DriverIdentityCard
              profile={profile}
              onOpenAvatarUpload={() => setIsAvatarUploadOpen(true)}
            />

            <ProfileSidebarNav
              activeTab="profile"
              onOpenNotificationSettings={() => setIsNotificationSettingsOpen(true)}
            />

            <DispatchHelpNote />
          </aside>

          {/* Right Column: Detailed Forms */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <PersonalInfoSection
              profile={profile}
              address={address}
              onAddressChange={setAddress}
              fullName={fullName}
              onFullNameChange={setFullName}
              phone={phone}
              onPhoneChange={setPhone}
            />

            <EmergencyContactsSection
              contact1Name={contact1Name}
              onContact1NameChange={setContact1Name}
              contact1Phone={contact1Phone}
              onContact1PhoneChange={setContact1Phone}
              contact2Name={contact2Name}
              onContact2NameChange={setContact2Name}
              contact2Phone={contact2Phone}
              onContact2PhoneChange={setContact2Phone}
            />

            <EnterpriseInvoiceSection
              invoiceConfig={profile.invoiceConfig}
              companyName={companyName}
              onCompanyNameChange={setCompanyName}
              taxCode={taxCode}
              onTaxCodeChange={setTaxCode}
              accountingEmail={accountingEmail}
              onAccountingEmailChange={setAccountingEmail}
            />

            <ProfileActionsBar
              lastUpdated={profile.lastUpdated}
              onReset={handleReset}
              onSave={handleSave}
              isSaving={isSaving}
            />
          </div>
        </div>
      </div>

      {/* Floating Success Toast */}
      {showToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 border-l-4 border-orange-600 max-w-md animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          <CheckCircle2 className="w-6 h-6 text-orange-500 shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-sm text-white">Cập nhật hồ sơ thành công!</span>
            <span className="text-xs text-slate-300">
              Hệ thống đã đồng bộ dữ liệu tới trạm trực bến bãi Cát Lái &amp; Đội điều phối VTP.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowToast(false)}
            className="text-slate-400 hover:text-white ml-2 p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Modals */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        onSave={handleChangePassword}
      />

      <NotificationSettingsModal
        isOpen={isNotificationSettingsOpen}
        onClose={() => setIsNotificationSettingsOpen(false)}
      />

      <AvatarUploadModal
        currentAvatar={profile.avatarUrl}
        fullName={profile.fullName}
        isOpen={isAvatarUploadOpen}
        onClose={() => setIsAvatarUploadOpen(false)}
        onSaveAvatar={handleSaveAvatar}
      />
    </main>
  )
}
