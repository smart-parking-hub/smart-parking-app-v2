import { useState, type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import { MerchantLayout } from '@/layouts/MerchantLayout'
import { AdminLayout } from '@/layouts/AdminLayout'
import { DriverLayout } from '@/layouts/DriverLayout'
import { SearchParkingPage } from '@/features/parking-search'
import { fallbackParkingLots } from '@/features/parking-search/api/parkingSearchApi'
import { AuthSuccess } from '@/features/auth'
import {
  MerchantBookingsPage,
  MerchantBookingDetailPage,
  MerchantScannerPage,
  MerchantLotPage,
  MerchantRevenuePage,
  MerchantWithdrawalsPage,
} from '@/features/merchant/operations'
import {
  AdminDashboardPage,
  AdminParkingLotsPage,
  AdminLotDetailPage,
  AdminUsersPage,
  AdminUserDetailPage,
  AdminTransactionsPage,
  AdminWithdrawalsPage,
  AdminAuditLogsPage,
} from '@/features/admin'
import { DisputesPage } from '@/features/disputes'
import { PortalNotificationsPage } from '@/features/notifications'
import { AdminProfilePage } from '@/features/admin/pages/AdminProfilePage'
import { vehicleTypes } from '@/entities/operations'
import { control } from '@/shared/components/Workspace'
import { AuthPage, AccessPage } from '@/features/auth'
import { ContactPage } from '@/features/landing/pages/ContactPage'

// Development-only, inert visual review. No authentication shortcuts, API writes,
// real customer data or production routes are involved.
function previewCache() {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  })
  const now = '2026-11-04T09:00:00'
  client.setQueryData(
    [
      'parking-lots-search',
      {
        selectedVehicleId: 'cont40',
        vehicleType: 'CONTAINER',
        radiusKm: 15,
        sortBy: 'distance',
        includeFull: true,
        keyword: '',
      },
    ],
    fallbackParkingLots,
  )
  const paging = (content: object[]) => ({
    content,
    totalElements: content.length,
    totalPages: 1,
    currentPage: 0,
  })
  const lot = {
    id: 12,
    merchantId: 2,
    merchantName: 'Đối tác minh họa',
    merchantPhone: 'Số điện thoại minh họa',
    name: 'Depot Cát Lái · Khu A',
    address: 'Khu logistics Cát Lái, TP. Hồ Chí Minh',
    latitude: 10.77,
    longitude: 106.79,
    status: 'PENDING_APPROVAL',
    slots: vehicleTypes.map((vehicleType, i) => ({
      id: i + 1,
      vehicleType,
      totalCapacity: 20,
      availableCapacity: 4 + i * 2,
    })),
    pricingRules: vehicleTypes.map((vehicleType) => ({
      vehicleType,
      basePricePerHour: 25000,
      surgeMultiplier: 1.5,
      surgeStartTime: '18:00',
      surgeEndTime: '22:00',
      overtimePenaltyMultiplier: 1.5,
    })),
    images: [],
  }
  const bookings = Array.from({ length: 5 }, (_, i) => ({
    id: 12 + i,
    bookingCode: `BK-DEMO-${1200 + i}`,
    vehicleId: 30 + i,
    driverId: 500 + i,
    merchantId: 2,
    vehicleLicensePlate: `XE MẪU 0${i + 1}`,
    vehicleType: 'CONTAINER',
    parkingLotId: 12,
    parkingLotName: lot.name,
    parkingLotAddress: lot.address,
    status: [
      'PARKING',
      'PENDING_CHECKIN',
      'PENDING_PAYMENT',
      'COMPLETED',
      'OVERTIME',
    ][i],
    hourlyRate: 25000,
    surgeMultiplier: 1.5,
    surgeStartTime: '18:00',
    surgeEndTime: '22:00',
    overtimePenaltyMultiplier: 1.5,
    advanceDeposit: 100000,
    totalAmount: 275000,
    expiresAt: '2026-11-04T09:15:00',
    expectedCheckInTime: now,
    expectedCheckOutTime: '2026-11-04T17:00:00',
    checkInTime: i === 1 || i === 2 ? null : now,
    checkOutTime: i === 3 ? '2026-11-04T16:40:00' : null,
    createdAt: now,
  }))
  const revenue = {
    totalGrossRevenue: 84500000,
    totalPlatformFee: 4225000,
    totalNetRevenue: 80275000,
    currentWalletBalance: 32450000,
    completedBookings: 246,
    minWithdrawalAmount: 50000,
    series: [3, 5, 4, 7, 6, 9, 8].map((v, i) => ({
      period: `0${i + 1}/11`,
      revenue: v * 1500000,
      bookingCount: v * 4,
    })),
  }
  const withdrawals = [1, 2, 3].map((id, i) => ({
    id,
    merchantName: 'Đối tác minh họa',
    amount: (i + 1) * 5000000,
    bankName: 'Ngân hàng minh họa',
    maskedBankAccount: '•••• 1234',
    accountHolderName: 'CHỦ TÀI KHOẢN MẪU',
    status: ['PENDING', 'PAID', 'REJECTED'][i],
    requestedAt: now,
    decisionReason: i === 2 ? 'Cần đối chiếu lại thông tin ngân hàng' : '',
  }))
  const disputes = [12, 13, 14].map((id, i) => ({
    id,
    bookingId: 12,
    driverId: 3,
    merchantId: 2,
    reason: [
      'Yêu cầu đối chiếu phí quá giờ',
      'Kiểm tra thời gian check-in',
      'Phản ánh chất lượng dịch vụ',
    ][i],
    description:
      'Nội dung minh họa cho hồ sơ khiếu nại. Tài xế đề nghị kiểm tra thời điểm vào bãi và số tiền được ghi nhận.',
    status: i === 2 ? 'RESOLVED' : 'OPEN',
    resolution: i === 2 ? 'Đã đối chiếu và thông báo kết quả cho hai bên.' : '',
    createdAt: now,
  }))
  const notifications = [1, 2, 3].map((id) => ({
    id,
    title: [
      'Hồ sơ bãi đỗ cần bổ sung',
      'Yêu cầu rút tiền đang chờ duyệt',
      'Có cập nhật khiếu nại mới',
    ][id - 1],
    content:
      'Thông báo minh họa để kiểm tra bố cục và khả năng đọc của giao diện.',
    createdAt: now,
    readAt: id === 1 ? null : now,
  }))
  const users = [12, 13, 14].map((id, i) => ({
    id,
    phone: 'Số điện thoại mẫu',
    email: `demo-${id}@example.invalid`,
    fullName: 'Người dùng minh họa',
    role: ['DRIVER', 'MERCHANT', 'DRIVER'][i],
    status: i === 2 ? 'BANNED' : 'ACTIVE',
    createdAt: now,
    bookingCount: 24,
    disputeCount: 1,
  }))
  client.setQueryData(['scanner-lots'], paging([lot]))
  client.setQueryData(['merchant-bookings', { page: 0, size: 5, parkingLotId: null }], paging(bookings))
  client.setQueryData(['merchant-bookings-summary', { parkingLotId: null }], {
    items: bookings,
    totalElements: bookings.length,
  })
  client.setQueryData(['merchant-bookings-lots-filter'], [{ id: lot.id, name: lot.name }])
  for (const item of bookings) {
    client.setQueryData(['merchant-booking', String(item.id)], item)
  }
  client.setQueryData(['merchant-lot', '12'], lot)
  client.setQueryData(
    ['merchant-revenue', { startDate: '', endDate: '', granularity: 'DAY' }],
    revenue,
  )
  client.setQueryData(['merchant-revenue', 'wallet'], revenue)
  client.setQueryData(['merchant-withdrawals', 0], paging(withdrawals))
  for (const role of ['driver', 'merchant', 'admin']) {
    client.setQueryData(['disputes', role, undefined, 0], paging(disputes))
    client.setQueryData(['disputes', role, '12', 0], disputes[0])
  }
  client.setQueryData(['portal-notifications', 0], paging(notifications))
  client.setQueryData(['admin-dashboard'], {
    totalUsers: 12480,
    totalDrivers: 12000,
    totalMerchants: 480,
    totalParkingLots: 320,
    pendingParkingLots: 12,
    totalBookings: 45260,
    pendingWithdrawals: 8,
    openDisputes: 5,
    platformRevenue: 248500000,
  })
  for (const [path, rows] of [
    ['parking-lots', [lot]],
    ['users', users],
    ['withdrawals', withdrawals],
    [
      'transactions',
      [1, 2, 3].map((id) => ({
        id,
        transactionCode: `TX-DEMO-${id}`,
        bookingCode: `BK-DEMO-${id}`,
        amount: 150000,
        type: 'DEPOSIT',
        gateway: 'PAYOS',
        status: 'SUCCESS',
        createdAt: now,
      })),
    ],
    [
      'audit-logs',
      [1, 2, 3].map((id) => ({
        id,
        actorUserId: 1,
        action: 'APPROVE_PARKING_LOT',
        targetType: 'PARKING_LOT',
        targetId: 12,
        detail: 'Đối chiếu hồ sơ minh họa',
        result: 'SUCCESS',
        createdAt: now,
      })),
    ],
  ] as const)
    client.setQueryData(
      ['admin-list', `/api/v1/admin/${path}`, 0],
      paging([...rows]),
    )
  client.setQueryData(['admin-detail', 'lot', '12'], lot)
  client.setQueryData(['admin-detail', 'user', '12'], users[0])
  client.setQueryData(['admin-profile'], {
    fullName: 'Quản trị viên minh họa',
    phone: '',
    email: 'demo@example.invalid',
    address: '',
    emergencyContact: '',
  })
  return client
}
const screens: { path: string; title: string; element: ReactNode }[] = [
  {
    path: 'auth/success',
    title: 'Thiết kế mới · Đăng ký thành công',
    element: (
      <main className="flex min-h-screen items-center justify-center bg-brand-surface px-6 py-16 font-inter">
        <div className="w-full max-w-2xl">
          <AuthSuccess />
        </div>
      </main>
    ),
  },
  {
    path: 'driver/search',
    title: 'Thiết kế mới · Driver & bản đồ OpenStreetMap',
    element: <SearchParkingPage />,
  },
  {
    path: 'auth/login',
    title: 'SCR-010 · Đăng nhập',
    element: <AuthPage key="login" mode="login" />,
  },
  {
    path: 'auth/register',
    title: 'SCR-011 · Đăng ký',
    element: <AuthPage key="register" mode="register" />,
  },
  {
    path: 'auth/forgot',
    title: 'SCR-012 · Quên mật khẩu',
    element: <AuthPage key="forgot" mode="forgot" />,
  },
  {
    path: 'auth/forbidden',
    title: 'SCR-013 · Không có quyền',
    element: <AccessPage />,
  },
  {
    path: 'public/contact',
    title: 'SCR-009 · Liên hệ',
    element: <ContactPage />,
  },
  {
    path: 'merchant/bookings',
    title: 'SCR-034 · Merchant Bookings',
    element: <MerchantBookingsPage />,
  },
  {
    path: 'merchant/bookings/:id',
    title: 'SCR-035 · Chi tiết Booking',
    element: <MerchantBookingDetailPage />,
  },
  {
    path: 'merchant/qr-scanner',
    title: 'SCR-036 · Trạm QR',
    element: <MerchantScannerPage />,
  },
  {
    path: 'merchant/parking-lots/:id',
    title: 'SCR-030 · Chi tiết bãi',
    element: <MerchantLotPage />,
  },
  {
    path: 'merchant/parking-lots/:id/edit',
    title: 'SCR-031 · Chỉnh sửa bãi',
    element: <MerchantLotPage mode="edit" />,
  },
  {
    path: 'merchant/parking-lots/:id/slots',
    title: 'SCR-032 · Sức chứa',
    element: <MerchantLotPage mode="slots" />,
  },
  {
    path: 'merchant/parking-lots/:id/pricing',
    title: 'SCR-033 · Biểu phí',
    element: <MerchantLotPage mode="pricing" />,
  },
  {
    path: 'merchant/revenue',
    title: 'SCR-037 · Doanh thu',
    element: <MerchantRevenuePage />,
  },
  {
    path: 'merchant/withdrawals',
    title: 'SCR-038 · Rút tiền',
    element: <MerchantWithdrawalsPage />,
  },
  {
    path: 'merchant/disputes',
    title: 'SCR-039 · Khiếu nại Merchant',
    element: <DisputesPage role="merchant" />,
  },
  {
    path: 'merchant/disputes/:id',
    title: 'SCR-040 · Chi tiết khiếu nại',
    element: <DisputesPage role="merchant" detail />,
  },
  {
    path: 'merchant/notifications',
    title: 'SCR-041 · Thông báo Merchant',
    element: <PortalNotificationsPage />,
  },
  {
    path: 'admin/dashboard',
    title: 'SCR-042 · Admin Dashboard',
    element: <AdminDashboardPage />,
  },
  {
    path: 'admin/parking-lots',
    title: 'SCR-043 · Kiểm duyệt bãi',
    element: <AdminParkingLotsPage />,
  },
  {
    path: 'admin/parking-lots/:id',
    title: 'SCR-044 · Thẩm định bãi',
    element: <AdminLotDetailPage />,
  },
  {
    path: 'admin/users',
    title: 'SCR-045 · Người dùng',
    element: <AdminUsersPage />,
  },
  {
    path: 'admin/users/:id',
    title: 'SCR-046 · Hồ sơ người dùng',
    element: <AdminUserDetailPage />,
  },
  {
    path: 'admin/transactions',
    title: 'SCR-047 · Giao dịch',
    element: <AdminTransactionsPage />,
  },
  {
    path: 'admin/withdrawals',
    title: 'SCR-048 · Duyệt rút tiền',
    element: <AdminWithdrawalsPage />,
  },
  {
    path: 'admin/disputes',
    title: 'SCR-049 · Tranh chấp',
    element: <DisputesPage role="admin" />,
  },
  {
    path: 'admin/disputes/:id',
    title: 'SCR-050 · Điều tra tranh chấp',
    element: <DisputesPage role="admin" detail />,
  },
  {
    path: 'admin/audit-logs',
    title: 'SCR-051 · Audit Logs',
    element: <AdminAuditLogsPage />,
  },
  {
    path: 'admin/notifications',
    title: 'SCR-052 · Thông báo Admin',
    element: <PortalNotificationsPage />,
  },
  {
    path: 'admin/profile',
    title: 'SCR-053 · Hồ sơ Admin',
    element: <AdminProfilePage />,
  },
  {
    path: 'driver/disputes',
    title: 'Bổ sung · Khiếu nại Driver',
    element: <DisputesPage role="driver" />,
  },
  {
    path: 'driver/disputes/:id',
    title: 'Bổ sung · Chi tiết khiếu nại Driver',
    element: <DisputesPage role="driver" detail />,
  },
]
export default function DesignPreviewPage() {
  const [client] = useState(previewCache)
  const location = useLocation()
  const navigate = useNavigate()
  return (
    <QueryClientProvider client={client}>
      <div className="pb-24" inert>
        <Routes>
          <Route
            index
            element={<Navigate replace to="merchant/qr-scanner" />}
          />
          {['merchant', 'admin', 'driver', 'auth', 'public'].map((role) => (
            <Route
              key={role}
              element={
                role === 'merchant' ? (
                  <MerchantLayout />
                ) : role === 'admin' ? (
                  <AdminLayout />
                ) : role === 'driver' ? (
                  <DriverLayout />
                ) : undefined
              }
            >
              {screens
                .filter((screen) => screen.path.startsWith(role))
                .map((screen) => (
                  <Route
                    key={screen.path}
                    path={screen.path}
                    element={screen.element}
                  />
                ))}
            </Route>
          ))}
        </Routes>
      </div>
      <div className="fixed bottom-3 left-3 right-3 z-[100] flex flex-wrap items-center gap-3 rounded-xl border border-brand-border bg-white p-3 shadow-xl">
        <p className="text-xs font-semibold text-brand-navy">
          XEM THIẾT KẾ · DỮ LIỆU MẪU · CHỈ ĐỌC
        </p>
        <select
          aria-label="Chọn màn hình xem trước"
          className={`${control} max-w-md`}
          value={location.pathname.replace('/design-preview/', '')}
          onChange={(event) =>
            navigate(`/design-preview/${event.target.value}`)
          }
        >
          {screens.map((screen) => (
            <option key={screen.path} value={screen.path.replace(':id', '12')}>
              {screen.title}
            </option>
          ))}
        </select>
        <a className="text-xs underline" href="/login">
          Đến đăng nhập thật
        </a>
      </div>
    </QueryClientProvider>
  )
}
