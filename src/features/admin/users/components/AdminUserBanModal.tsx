import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AlertTriangle, ShieldCheck, Loader2 } from 'lucide-react'
import { Dialog } from '@/shared/components/Dialog'
import { Badge } from '@/shared/components/Badge'
import {
  banReasonSchema,
  type BanReasonFormValues,
} from '../types/adminUsersSchemas'
import {
  banAdminUser,
  unbanAdminUser,
  ADMIN_USERS_QUERY_KEY,
} from '../api/adminUsersApi'
import { useAdminUsersStore } from '../store/adminUsersStore'

export function AdminUserBanModal() {
  const queryClient = useQueryClient()
  const target = useAdminUsersStore((s) => s.banModalTarget)
  const closeBanModal = useAdminUsersStore((s) => s.closeBanModal)
  const showToast = useAdminUsersStore((s) => s.showToast)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<BanReasonFormValues>({
    resolver: zodResolver(banReasonSchema),
    defaultValues: { reason: '' },
  })

  const reasonValue = watch('reason') || ''

  const mutation = useMutation({
    mutationFn: async (values: BanReasonFormValues) => {
      if (!target) return
      if (target.action === 'ban') {
        await banAdminUser(target.user.id, values.reason)
      } else {
        await unbanAdminUser(target.user.id, values.reason)
      }
    },
    onSuccess: () => {
      if (!target) return
      const actionText = target.action === 'ban' ? 'Khóa' : 'Mở khóa'
      showToast(
        `Đã ${actionText.toLowerCase()} tài khoản #${target.user.id} thành công!`,
        'success',
      )
      void queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY })
      void queryClient.invalidateQueries({ queryKey: ['admin-list'] })
      void queryClient.invalidateQueries({ queryKey: ['admin-detail'] })
      reset()
      closeBanModal()
    },
    onError: (err: unknown) => {
      const msg =
        err instanceof Error ? err.message : 'Có lỗi xảy ra khi thực hiện thao tác'
      showToast(msg, 'error')
    },
  })

  if (!target) return null

  const isBan = target.action === 'ban'
  const isTargetAdmin =
    target.user.role === 'ROLE_ADMIN' || target.user.role === 'ADMIN'

  const title = isBan
    ? 'Xác nhận khóa tài khoản'
    : 'Xác nhận mở khóa tài khoản'

  const handleClose = () => {
    if (mutation.isPending) return
    reset()
    closeBanModal()
  }

  const onSubmit = (values: BanReasonFormValues) => {
    if (isBan && isTargetAdmin) return
    mutation.mutate(values)
  }

  return (
    <Dialog
      isOpen={true}
      title={title}
      onClose={handleClose}
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* User Card Summary */}
        <div className="rounded-xl border border-slate-200/90 bg-slate-50/70 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-brand-navy">
                #{target.user.id} · {target.user.fullName || 'Người dùng'}
              </p>
              <p className="mt-0.5 font-mono text-xs text-slate-500">
                {target.user.phone || '—'} · {target.user.email || '—'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge value={target.user.role} />
              <Badge value={target.user.status} />
            </div>
          </div>
        </div>

        {/* Admin Protection Warning */}
        {isBan && isTargetAdmin && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900"
          >
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <p className="font-semibold">Không thể khóa tài khoản này</p>
              <p className="mt-0.5 leading-relaxed text-amber-800">
                Theo quy tắc an toàn hệ thống, tài khoản có vai trò Quản trị viên
                (ADMIN) không thể bị khóa trực tiếp để đảm bảo tính toàn vẹn vận hành.
              </p>
            </div>
          </div>
        )}

        {/* Audit Instructions */}
        <div className="flex items-start gap-2.5 text-xs text-slate-600">
          <ShieldCheck className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" />
          <p>
            Nhập lý do để lưu vết kiểm toán và hỗ trợ đối soát vi phạm (bắt buộc tối
            thiểu 5 ký tự).
          </p>
        </div>

        {/* Reason Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="ban-reason-input"
                className="text-xs font-semibold text-slate-700"
              >
                Lý do giải trình <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400 tabular-nums">
                {reasonValue.length} / 500 ký tự
              </span>
            </div>
            <textarea
              id="ban-reason-input"
              {...register('reason')}
              rows={4}
              maxLength={500}
              placeholder={
                isBan
                  ? 'Ví dụ: Phát hiện vi phạm chính sách hủy chuyến bất thường nhiều lần...'
                  : 'Ví dụ: Đã đối soát xác minh thông tin giải trình của tài khoản...'
              }
              disabled={isBan && isTargetAdmin}
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-brand-navy placeholder:text-slate-400 focus:border-brand-primary focus:outline-hidden focus:ring-2 focus:ring-brand-primary/20 transition-all resize-none disabled:bg-slate-100 disabled:opacity-60"
            />
            {errors.reason && (
              <p className="mt-1 text-xs text-red-600 font-medium">
                {errors.reason.message}
              </p>
            )}
          </div>

          {/* Dialog Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClose}
              disabled={mutation.isPending}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={(isBan && isTargetAdmin) || mutation.isPending}
              className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                isBan
                  ? 'bg-red-600 hover:bg-red-700 active:bg-red-800'
                  : 'bg-brand-primary hover:bg-brand-primary-hover active:bg-brand-primary-active'
              }`}
            >
              {mutation.isPending && (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              )}
              <span>{isBan ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}</span>
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  )
}
