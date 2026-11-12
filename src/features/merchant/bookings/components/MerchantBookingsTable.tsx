import { Eye } from 'lucide-react'
import type { Booking } from '@/entities/operations'
import { Badge } from '@/shared/components/Badge'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/Table'
import {
  formatBookingDateTime,
  formatBookingMoney,
  resolveBookingPlate,
  resolveVehicleTypeLabel,
} from '../api/merchantBookingsApi'

interface MerchantBookingsTableProps {
  rows: Booking[]
  selectedBookingId: number | null
  onViewDetail: (booking: Booking) => void
  isFetching?: boolean
}

export function MerchantBookingsTable({
  rows,
  selectedBookingId,
  onViewDetail,
  isFetching = false,
}: MerchantBookingsTableProps) {
  return (
    <TableContainer className="border-0 rounded-none shadow-none">
      <Table aria-label="Bảng danh sách đơn đặt chỗ" className="min-w-[780px]">
        <TableHeader>
          <tr className="border-b border-slate-200 bg-slate-50/90 text-xs font-semibold tracking-wider text-slate-600 uppercase">
            <TableHead scope="col" className="py-2.5 whitespace-nowrap">
              Mã đặt chỗ
            </TableHead>
            <TableHead scope="col" className="py-2.5 whitespace-nowrap">
              Phương tiện
            </TableHead>
            <TableHead scope="col" className="py-2.5 whitespace-nowrap">
              Bãi đỗ
            </TableHead>
            <TableHead scope="col" className="py-2.5 whitespace-nowrap">
              Giờ đến dự kiến
            </TableHead>
            <TableHead scope="col" align="right" className="py-2.5 whitespace-nowrap">
              Tiền cọc
            </TableHead>
            <TableHead scope="col" className="py-2.5 whitespace-nowrap">
              Trạng thái
            </TableHead>
            <TableHead scope="col" align="right" className="py-2.5 whitespace-nowrap">
              Thao tác
            </TableHead>
          </tr>
        </TableHeader>

        <TableBody className={isFetching ? 'opacity-70 transition-opacity' : undefined}>
          {rows.map((row) => {
            const isSelected = selectedBookingId === row.id
            const plate = resolveBookingPlate(row)
            const hasVehicleType = Boolean(row.vehicleType)

            return (
              <TableRow
                key={row.id}
                data-booking-row-id={row.id}
                className={
                  isSelected
                    ? 'bg-orange-50/50 hover:bg-orange-50/70'
                    : 'hover:bg-slate-50/90'
                }
              >
                <TableCell className="py-2.5 whitespace-nowrap">
                  <span className="font-mono font-semibold text-slate-900">
                    {row.bookingCode}
                  </span>
                </TableCell>

                <TableCell className="py-2.5 whitespace-nowrap">
                  <div className="min-w-0 leading-tight">
                    <p className="font-semibold text-slate-900">{plate}</p>
                    {hasVehicleType && (
                      <p className="mt-0.5 text-xs text-slate-500">
                        {resolveVehicleTypeLabel(row.vehicleType)}
                      </p>
                    )}
                  </div>
                </TableCell>

                <TableCell className="py-2.5">
                  <span className="line-clamp-1 font-medium text-slate-700">
                    {row.parkingLotName || '—'}
                  </span>
                </TableCell>

                <TableCell className="py-2.5 whitespace-nowrap">
                  <time
                    dateTime={
                      typeof row.expectedCheckInTime === 'string'
                        ? row.expectedCheckInTime
                        : undefined
                    }
                    className="font-sans tabular-nums text-slate-700"
                  >
                    {formatBookingDateTime(row.expectedCheckInTime)}
                  </time>
                </TableCell>

                <TableCell align="right" className="py-2.5 whitespace-nowrap">
                  <span className="font-mono font-semibold tabular-nums text-slate-900">
                    {formatBookingMoney(row.advanceDeposit)}
                  </span>
                </TableCell>

                <TableCell className="py-2.5 whitespace-nowrap">
                  <Badge value={row.status} dot size="sm" />
                </TableCell>

                <TableCell align="right" className="py-2.5 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => onViewDetail(row)}
                    aria-label={`Xem chi tiết đơn ${row.bookingCode}`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-800 hover:border-[#d95f00]/50 hover:bg-orange-50/70 hover:text-[#9e4300] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d95f00] focus-visible:ring-offset-1 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>Chi tiết</span>
                  </button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

