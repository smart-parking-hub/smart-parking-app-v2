import { useState, useEffect } from 'react'
import {
  fetchSecurityAuditStatus,
  changePasswordApi,
  fallbackSecurityAudit,
} from '../api/changePasswordApi'
import type {
  SecurityAuditStatus,
  ChangePasswordRequestPayload,
} from '../types/changePasswordTypes'
import { ChangePasswordCommandHeader } from '../components/ChangePasswordCommandHeader'
import { SecurityPolicySidebar } from '../components/SecurityPolicySidebar'
import { ChangePasswordForm } from '../components/ChangePasswordForm'
import { TerminalQrSyncBanner } from '../components/TerminalQrSyncBanner'
import { SmsRecoveryModal } from '../components/SmsRecoveryModal'
import { ChangePasswordSkeleton } from '../components/ChangePasswordSkeleton'
import { NotificationSettingsModal } from '../../profile/components/NotificationSettingsModal'

export function ChangePasswordPage() {
  const [loading, setLoading] = useState(true)
  const [audit, setAudit] = useState<SecurityAuditStatus>(fallbackSecurityAudit)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSmsRecoveryOpen, setIsSmsRecoveryOpen] = useState(false)
  const [isNotificationSettingsOpen, setIsNotificationSettingsOpen] = useState(false)

  useEffect(() => {
    let isMounted = true
    const loadAudit = async () => {
      try {
        setLoading(true)
        const data = await fetchSecurityAuditStatus()
        if (isMounted) {
          setAudit(data)
        }
      } catch {
        // Fallback ok
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadAudit()
    return () => {
      isMounted = false
    }
  }, [])

  const handleSubmitPassword = async (payload: ChangePasswordRequestPayload) => {
    setIsSubmitting(true)
    try {
      await changePasswordApi(payload)
      // Update local audit timestamp
      setAudit((prev) => ({
        ...prev,
        lastChangedDate: 'Hôm nay',
        daysAgo: 0,
        isOverdue: false,
      }))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1280px] mx-auto">
          <ChangePasswordSkeleton />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-6">
        {/* Command Header */}
        <ChangePasswordCommandHeader audit={audit} />

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (4 cols): Sidebar Nav & Security Standards */}
          <div className="lg:col-span-4">
            <SecurityPolicySidebar
              audit={audit}
              onOpenNotificationSettings={() => setIsNotificationSettingsOpen(true)}
              onOpenTwoFactorModal={() => setIsSmsRecoveryOpen(true)}
              onOpenDevicesModal={() => {}}
            />
          </div>

          {/* Right Column (8 cols): Change Password Form & QR Sync Banner */}
          <div className="lg:col-span-8 flex flex-col">
            <ChangePasswordForm
              onSubmit={handleSubmitPassword}
              onOpenForgotModal={() => setIsSmsRecoveryOpen(true)}
              isSubmitting={isSubmitting}
            />

            <TerminalQrSyncBanner />
          </div>
        </div>
      </div>

      {/* SMS Recovery Modal */}
      <SmsRecoveryModal
        isOpen={isSmsRecoveryOpen}
        onClose={() => setIsSmsRecoveryOpen(false)}
      />

      {/* Notification Settings Modal */}
      <NotificationSettingsModal
        isOpen={isNotificationSettingsOpen}
        onClose={() => setIsNotificationSettingsOpen(false)}
      />
    </main>
  )
}
