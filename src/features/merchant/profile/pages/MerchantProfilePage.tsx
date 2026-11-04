import { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle2, AlertCircle, RefreshCw, Zap } from 'lucide-react'

import {
  fetchMerchantProfile,
  updateMerchantProfileApi,
  uploadMerchantDocumentApi,
  saveNotificationSettings,
  requestFastWithdrawalApi,
} from '../api/merchantProfileApi'
import type {
  MerchantNotificationSettings,
  StoredDocument,
} from '../types/merchantProfileTypes'

import { MerchantProfileHeaderRibbon } from '../components/MerchantProfileHeaderRibbon'
import { MerchantIdentitySummaryCard } from '../components/MerchantIdentitySummaryCard'
import { MerchantWalletSummaryCard } from '../components/MerchantWalletSummaryCard'
import { MerchantPolicyCard } from '../components/MerchantPolicyCard'
import { LegalInfoFormCard } from '../components/LegalInfoFormCard'
import { BankingProfileCard } from '../components/BankingProfileCard'
import { NotificationChannelsConfigCard } from '../components/NotificationChannelsConfigCard'
import { ProfileActionsFooter } from '../components/ProfileActionsFooter'
import { FastWithdrawModal } from '../components/FastWithdrawModal'
import { DocumentPreviewModal } from '../components/DocumentPreviewModal'
import { MerchantProfileSkeleton } from '../components/MerchantProfileSkeleton'

const profileFormSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Vui lòng nhập tên người đại diện pháp luật')
    .max(100, 'Tối đa 100 ký tự'),
  email: z.string().email('Địa chỉ email không đúng định dạng').max(100, 'Tối đa 100 ký tự'),
  emergencyContact: z.string().max(20, 'Hotline khẩn cấp tối đa 20 ký tự').optional(),
  address: z.string().max(255, 'Địa chỉ tối đa 255 ký tự').optional(),
})

type ProfileFormData = z.infer<typeof profileFormSchema>

export function MerchantProfilePage() {
  const queryClient = useQueryClient()

  const {
    data: profile,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['merchant-profile-summary'],
    queryFn: fetchMerchantProfile,
    staleTime: 30000,
  })

  const [notificationSettings, setNotificationSettings] = useState<MerchantNotificationSettings>({
    webPushHorn: true,
    smsCriticalAlert: true,
    zaloOaStatement: false,
  })

  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingDoc, setIsUploadingDoc] = useState(false)
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [previewDoc, setPreviewDoc] = useState<StoredDocument | null>(null)

  // Floating Toast State
  const [toast, setToast] = useState<{
    show: boolean
    message: string
    icon: 'check' | 'payments' | 'refresh' | 'error'
  }>({
    show: false,
    message: '',
    icon: 'check',
  })

  const showToast = (
    message: string,
    icon: 'check' | 'payments' | 'refresh' | 'error' = 'check',
  ) => {
    setToast({ show: true, message, icon })
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }))
    }, 3200)
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      emergencyContact: '',
      address: '',
    },
  })

  // Synchronize form values whenever profile data is retrieved
  useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.fullName || '',
        email: profile.email || '',
        emergencyContact: profile.emergencyContact || '',
        address: profile.address || '',
      })
      if (profile.notificationSettings) {
        setNotificationSettings(profile.notificationSettings)
      }
    }
  }, [profile, reset])

  // Save profile changes handler
  const onSaveProfile = handleSubmit(async (data) => {
    setIsSaving(true)
    try {
      const updated = await updateMerchantProfileApi({
        fullName: data.fullName,
        email: data.email,
        emergencyContact: data.emergencyContact,
        address: data.address,
      })
      queryClient.setQueryData(['merchant-profile-summary'], updated)
      showToast('Đã lưu cập nhật hồ sơ doanh nghiệp thành công!', 'check')
    } catch {
      showToast('Có lỗi xảy ra khi lưu hồ sơ. Vui lòng thử lại!', 'error')
    } finally {
      setIsSaving(false)
    }
  })

  // Reset form handler
  const handleResetForm = () => {
    if (profile) {
      reset({
        fullName: profile.fullName || '',
        email: profile.email || '',
        emergencyContact: profile.emergencyContact || '',
        address: profile.address || '',
      })
      const defaultNotifs: MerchantNotificationSettings = {
        webPushHorn: true,
        smsCriticalAlert: true,
        zaloOaStatement: false,
      }
      setNotificationSettings(defaultNotifs)
      saveNotificationSettings(defaultNotifs)
      showToast('Đã đặt lại cấu hình thông báo và dữ liệu gốc.', 'refresh')
    }
  }

  // Notification toggle handler
  const handleNotificationChange = (
    key: keyof MerchantNotificationSettings,
    value: boolean,
  ) => {
    const nextSettings = {
      ...notificationSettings,
      [key]: value,
    }
    setNotificationSettings(nextSettings)
    saveNotificationSettings(nextSettings)
    showToast('Cấu hình kênh thông báo & hồ sơ doanh nghiệp đã được lưu.', 'check')
  }

  // Document upload handler
  const handleUploadDocument = async (businessLicense: string, file: File | null) => {
    setIsUploadingDoc(true)
    try {
      const { updatedProfile } = await uploadMerchantDocumentApi({
        businessLicense,
        file,
      })
      queryClient.setQueryData(['merchant-profile-summary'], updatedProfile)
      showToast('Đã cập nhật giấy tờ pháp lý thành công!', 'check')
    } catch {
      showToast('Tải lên tệp thất bại, vui lòng kiểm tra lại định dạng tệp.', 'error')
    } finally {
      setIsUploadingDoc(false)
    }
  }

  // Fast withdrawal confirm handler
  const handleConfirmWithdraw = async (amount: number) => {
    if (!profile) return
    setIsWithdrawing(true)
    try {
      await requestFastWithdrawalApi({
        amount,
        bankName: profile.bankName,
        bankAccountNum: profile.bankAccountNum,
        accountHolder: profile.bankAccountHolder,
      })
      setIsWithdrawModalOpen(false)
      const formatted = new Intl.NumberFormat('vi-VN').format(amount)
      showToast(`Lệnh rút ${formatted} ₫ đang được Napas247 xử lý tới MB Bank.`, 'payments')
    } catch {
      showToast('Không thể tạo yêu cầu rút tiền lúc này.', 'error')
    } finally {
      setIsWithdrawing(false)
    }
  }

  if (isLoading) {
    return <MerchantProfileSkeleton />
  }

  if (error || !profile) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-10">
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center space-y-3">
          <AlertCircle className="w-12 h-12 text-rose-600 mx-auto" />
          <h3 className="font-sora text-lg font-bold text-rose-900">
            Không thể tải hồ sơ chủ bãi
          </h3>
          <p className="text-xs lg:text-sm text-rose-700 max-w-lg mx-auto">
            Hệ thống quản lý định danh Merchant đang gián đoạn kết nối. Vui lòng tải lại hoặc liên hệ
            bộ phận hỗ trợ vận hành.
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            disabled={isRefetching}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#d95f00] text-white text-xs font-bold hover:bg-[#b85000] transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
            <span>{isRefetching ? 'Đang thử lại...' : 'Tải lại trang'}</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full pb-16">
      <div className="w-full max-w-[1280px] mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* Top Identity / Page Header Ribbon */}
        <MerchantProfileHeaderRibbon
          profile={profile}
          onShowCertificate={() =>
            alert(
              'Chứng chỉ An toàn thông tin ISO 27001:2022 & Thẩm định Cục ĐKVN số #VN-2024-88219 (Hiệu lực: 31/12/2026)',
            )
          }
        />

        {/* Two-Column Master Layout (40% Left : 60% Right on Desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Thẻ Tóm Tắt Pháp Nhân & Tài Khoản Ví (40% ~ 5 Cols) */}
          <aside className="lg:col-span-5 flex flex-col gap-6">
            <MerchantIdentitySummaryCard profile={profile} />
            <MerchantWalletSummaryCard
              profile={profile}
              onOpenWithdrawModal={() => setIsWithdrawModalOpen(true)}
            />
            <MerchantPolicyCard profile={profile} />
          </aside>

          {/* RIGHT COLUMN: Form Cấu Hình Chi Tiết - 3 Khối (60% ~ 7 Cols) */}
          <main className="lg:col-span-7 flex flex-col gap-6">
            <LegalInfoFormCard
              profile={profile}
              register={register}
              errors={errors}
              onUploadDocument={handleUploadDocument}
              isUploadingDoc={isUploadingDoc}
              onPreviewDocument={(doc) => setPreviewDoc(doc)}
            />

            <BankingProfileCard profile={profile} />

            <NotificationChannelsConfigCard
              settings={notificationSettings}
              onChange={handleNotificationChange}
            />

            <ProfileActionsFooter
              lastUpdated={profile.lastUpdated}
              isSaving={isSaving}
              onReset={handleResetForm}
              onSave={onSaveProfile}
            />
          </main>
        </div>
      </div>

      {/* Interactive Modal for Fast Withdrawal Simulation */}
      <FastWithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        profile={profile}
        onConfirm={handleConfirmWithdraw}
        isSubmitting={isWithdrawing}
      />

      {/* Document Preview Modal */}
      <DocumentPreviewModal document={previewDoc} onClose={() => setPreviewDoc(null)} />

      {/* Notification Toast Container */}
      <div
        id="toast-notification"
        className={`fixed bottom-6 right-6 z-50 transform transition-all duration-300 pointer-events-none ${
          toast.show ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'
        }`}
      >
        <div className="flex items-center gap-3 px-4 py-3 bg-[#131b2e] text-white rounded-xl shadow-2xl border border-slate-700">
          {toast.icon === 'payments' ? (
            <Zap className="w-5 h-5 text-[#d95f00]" id="toast-icon" />
          ) : toast.icon === 'refresh' ? (
            <RefreshCw className="w-5 h-5 text-[#d95f00]" id="toast-icon" />
          ) : toast.icon === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-500" id="toast-icon" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-[#d95f00]" id="toast-icon" />
          )}
          <span className="font-medium text-xs lg:text-sm" id="toast-message">
            {toast.message}
          </span>
        </div>
      </div>
    </div>
  )
}
