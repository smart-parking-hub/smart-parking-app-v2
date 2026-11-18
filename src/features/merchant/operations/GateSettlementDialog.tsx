import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Booking, Settlement } from '@/entities/operations'
import { getData, sendData, errorMessage } from '@/shared/api/resources'
import { Badge, Dialog, Notice, button, money, secondary } from '@/shared/components/Workspace'
import { PayOsCheckoutFrame } from '@/features/booking-flow/PayOsCheckoutFrame'

interface Props {
  settlement: Settlement
  parkingLotId: number
  onClose: () => void
  onComplete: (settlement: Settlement) => void
}

/** The gate presents PayOS QR or accepts cash settlement; server confirms completion. */
export function GateSettlementDialog({ settlement, parkingLotId, onClose, onComplete }: Props) {
  const cache = useQueryClient()
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)

  const status = useQuery({
    queryKey: ['gate-settlement', parkingLotId, settlement.bookingId, settlement.bookingCode],
    enabled: typeof settlement.bookingId === 'number',
    queryFn: async ({ signal }) => {
      const booking = await getData<Booking>(`/api/v1/merchant/bookings/${settlement.bookingId}`, undefined, { signal })
      if (booking.id !== settlement.bookingId || booking.bookingCode !== settlement.bookingCode || booking.parkingLotId !== parkingLotId)
        throw new Error('Kết quả không khớp lượt đỗ đang kiểm tra. Vui lòng quét lại vé.')
      return booking
    },
    refetchInterval: query => query.state.data?.status === 'COMPLETED' ? false : 3000,
    retry: false,
  })

  const payos = useMutation({
    mutationFn: () => sendData<string>('post', '/api/v1/payments/gate/final-link', {
      bookingId: settlement.bookingId,
    }),
    onSuccess: (url) => setCheckoutUrl(url),
    retry: false,
  })

  const cash = useMutation({
    mutationFn: () => sendData('post', '/api/v1/merchant/confirm-cash', {
      bookingCode: settlement.bookingCode, parkingLotId, amount: settlement.amountDue,
    }),
    retry: false,
  })

  useEffect(() => {
    if (status.data?.status === 'COMPLETED') {
      onComplete({ ...settlement, amountDue: 0, bookingStatus: 'COMPLETED', finalPaymentMethod: status.data.finalPaymentMethod ?? undefined })
    }
  }, [status.data, settlement, onComplete])

  const invalidate = () => {
    for (const queryKey of [
      ['merchant-bookings'],
      ['merchant-booking'],
      ['real-bookings'],
      ['booking'],
      ['merchant-revenue'],
      ['merchant-dashboard-summary'],
      ['merchant-revenue-stats'],
    ])
      void cache.invalidateQueries({ queryKey })
  }

  const payosAccepted = (status.data?.finalPaymentMethod ?? settlement.finalPaymentMethod) === 'PAYOS'

  return <Dialog title="Quyết toán lượt đỗ" onClose={() => { if (!cash.isPending) onClose() }}>
    <div className="space-y-4">
      <p className="font-mono">{settlement.bookingCode}</p>
      <Badge value={status.data?.status ?? settlement.bookingStatus} />
      <dl className="space-y-3">
        {[
          ['Thời gian đỗ', `${settlement.parkingMinutes} phút`],
          ['Tổng phí', money(settlement.totalAmount)],
          ['Cọc đã khấu trừ', money(settlement.advanceDeposit)],
        ].map(([label, value]) => <div key={label} className="flex justify-between text-sm">
          <dt className="text-brand-muted">{label}</dt><dd className="font-semibold font-mono tabular-nums text-slate-900">{value}</dd>
        </div>)}
      </dl>
      <div className="rounded-xl bg-[#0a1120] p-6 text-white border border-slate-800 shadow-md">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">CÒN PHẢI THU</p>
        <p className="mt-2 font-sora text-3xl font-extrabold text-amber-400 tabular-nums">{money(settlement.amountDue)}</p>
      </div>

      {!checkoutUrl && (
        <Notice>Tài xế mở lượt đặt chỗ này trong ứng dụng hoặc chọn “Thanh toán bằng QR” để quét mã tại quầy. Trạm sẽ cập nhật sau khi máy chủ xác nhận.</Notice>
      )}
      {payosAccepted && <Notice>Máy chủ đã nhận thanh toán PayOS, đang hoàn tất lượt đỗ. Không thu thêm tiền mặt.</Notice>}
      {status.isError && <Notice error>{errorMessage(status.error)}</Notice>}
      {payos.isError && <Notice error>{errorMessage(payos.error)}</Notice>}
      {cash.isError && <Notice error>{errorMessage(cash.error)} Chưa xác nhận thì không thu lại tiền; hãy kiểm tra trạng thái hoặc thử lại cùng yêu cầu.</Notice>}

      {checkoutUrl && settlement.bookingId != null ? (
        <div className="space-y-3">
          <PayOsCheckoutFrame
            bookingId={settlement.bookingId}
            checkoutUrl={checkoutUrl}
            onVerify={() => void status.refetch()}
            onCancel={() => setCheckoutUrl(null)}
            onExit={() => setCheckoutUrl(null)}
          />
          <button
            type="button"
            className={`${secondary} w-full`}
            onClick={() => setCheckoutUrl(null)}
          >
            Đóng mã QR
          </button>
        </div>
      ) : (
        settlement.bookingId != null && settlement.amountDue > 0 && (
          <button
            type="button"
            className={`${button} w-full`}
            disabled={payos.isPending || cash.isPending || payosAccepted}
            onClick={() => payos.mutate()}
          >
            {payos.isPending ? 'Đang mở mã QR…' : 'Thanh toán bằng QR'}
          </button>
        )
      )}

      {settlement.amountDue > 0 && (
        <button
          type="button"
          className={`${secondary} w-full`}
          aria-busy={cash.isPending}
          disabled={cash.isPending || cash.isSuccess || payosAccepted}
          onClick={() => {
            if (cash.isPending || cash.isSuccess) return
            cash.mutate(undefined, {
              onSuccess: () => {
                invalidate()
                onComplete({
                  ...settlement,
                  amountDue: 0,
                  bookingStatus: 'COMPLETED',
                  finalPaymentMethod: 'CASH',
                })
              },
            })
          }}
        >
          {cash.isPending ? 'Đang xác nhận…' : 'Đã nhận đủ tiền mặt · Hoàn tất lượt đỗ'}
        </button>
      )}
      <p className="text-xs text-brand-muted">Chỉ xác nhận sau khi nhận đủ tiền mặt. Nếu đã mở PayOS, cần hủy phiên chưa trả tiền trước khi chuyển sang tiền mặt. Việc điều khiển barie vật lý cần hệ thống cổng tích hợp riêng.</p>
    </div>
  </Dialog>
}
