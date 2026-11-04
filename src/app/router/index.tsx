import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
const DesignPreviewPage = import.meta.env.DEV
  ? lazy(() => import('@/app/pages/DesignPreviewPage'))
  : null
import { RootLayout } from '@/layouts/RootLayout'
import { DriverLayout as DriverShell } from '@/layouts/DriverLayout'
import { MerchantLayout } from '@/layouts/MerchantLayout'
import { AdminLayout } from '@/layouts/AdminLayout'
import { AuthPage, AccessPage, RequireRole } from '@/features/auth'
import { ContactPage } from '@/features/landing/pages/ContactPage'
import {
  MerchantBookingsPage,
  MerchantBookingDetailPage,
  MerchantScannerPage,
  MerchantLotPage,
  MerchantRevenuePage,
  MerchantWithdrawalsPage,
} from '@/features/merchant/operations'
import { DisputesPage } from '@/features/disputes'
import {
  PortalNotificationsPage,
  AdminProfilePage,
} from '@/features/portal/AccountPages'
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
import { BaselineOverviewPage } from '@/app/pages/BaselineOverviewPage'
import { DriverDashboardPage as DashboardHomePage } from '@/features/driver'
import { SearchParkingPage } from '@/features/parking-search'
import { ParkingDetailPage } from '@/features/parking-detail'
const MyBookingsPage = lazy(() =>
  import('@/features/bookings').then((module) => ({
    default: module.MyBookingsPage,
  })),
)
const VirtualQueuesPage = lazy(() =>
  import('@/features/queues').then((module) => ({
    default: module.VirtualQueuesPage,
  })),
)
const DriverPaymentsPage = lazy(() =>
  import('@/features/payments').then((module) => ({
    default: module.DriverPaymentsPage,
  })),
)
const VehiclesPage = lazy(() =>
  import('@/features/vehicles').then((module) => ({
    default: module.VehiclesPage,
  })),
)
const ProfilePage = lazy(() =>
  import('@/features/profile').then((module) => ({
    default: module.ProfilePage,
  })),
)
const ChangePasswordPage = lazy(() =>
  import('@/features/change-password').then((module) => ({
    default: module.ChangePasswordPage,
  })),
)
const PaymentReturnPage = lazy(() =>
  import('@/features/payment-return').then((module) => ({
    default: module.PaymentReturnPage,
  })),
)
const PaymentCancelPage = lazy(() =>
  import('@/features/payment-cancel').then((module) => ({
    default: module.PaymentCancelPage,
  })),
)
const NotificationsPage = lazy(() =>
  import('@/features/notifications').then((module) => ({
    default: module.NotificationsPage,
  })),
)
import { MerchantDashboardPage } from '@/features/merchant/dashboard'
import { MerchantParkingLotsPage } from '@/features/merchant/parking-lots/pages/MerchantParkingLotsPage'
import { CreateMerchantParkingLotPage } from '@/features/merchant/parking-lots/pages/CreateMerchantParkingLotPage'
const MerchantParkingLotDetailPage = lazy(() =>
  import('@/features/merchant/parking-lots/pages/MerchantParkingLotDetailPage').then(
    (module) => ({ default: module.MerchantParkingLotDetailPage }),
  ),
)
const EditMerchantParkingLotPage = lazy(() =>
  import('@/features/merchant/parking-lots/pages/EditMerchantParkingLotPage').then(
    (module) => ({ default: module.EditMerchantParkingLotPage }),
  ),
)
const MerchantSlotsPage = lazy(() =>
  import('@/features/merchant/slots/pages/MerchantSlotsPage').then(
    (module) => ({ default: module.MerchantSlotsPage }),
  ),
)
import { MerchantProfilePage } from '@/features/merchant/profile'
import { LandingPage } from '@/features/landing/pages/LandingPage'
const DriverSolutionsPage = lazy(() =>
  import('@/features/landing/pages/DriverSolutionsPage').then((module) => ({
    default: module.DriverSolutionsPage,
  })),
)
const OwnerSolutionsPage = lazy(() =>
  import('@/features/landing/pages/OwnerSolutionsPage').then((module) => ({
    default: module.OwnerSolutionsPage,
  })),
)
const PricingPage = lazy(() =>
  import('@/features/landing/pages/PricingPage').then((module) => ({
    default: module.PricingPage,
  })),
)
const ApiDocsPage = lazy(() =>
  import('@/features/landing/pages/ApiDocsPage').then((module) => ({
    default: module.ApiDocsPage,
  })),
)
const AboutUsPage = lazy(() =>
  import('@/features/landing/pages/AboutUsPage').then((module) => ({
    default: module.AboutUsPage,
  })),
)
const CareersPage = lazy(() =>
  import('@/features/landing/pages/CareersPage').then((module) => ({
    default: module.CareersPage,
  })),
)
const InsightsPage = lazy(() =>
  import('@/features/landing/pages/InsightsPage').then((module) => ({
    default: module.InsightsPage,
  })),
)

function DriverLayout() {
  return (
    <RequireRole role="DRIVER">
      <DriverShell />
    </RequireRole>
  )
}

export const router = createBrowserRouter([
  ...(import.meta.env.DEV && DesignPreviewPage
    ? [
        {
          path: '/design-preview/*',
          element: (
            <Suspense fallback={<p>Đang tải bản xem trước…</p>}>
              <DesignPreviewPage />
            </Suspense>
          ),
        },
      ]
    : []),
  { path: '/login', element: <AuthPage key="login" mode="login" /> },
  { path: '/register', element: <AuthPage key="register" mode="register" /> },
  {
    path: '/forgot-password',
    element: <AuthPage key="forgot" mode="forgot" />,
  },
  { path: '/403', element: <AccessPage /> },
  { path: '/contact', element: <ContactPage /> },
  { path: '/company/contact', element: <ContactPage /> },
  { path: '/solutions/drivers', element: <DriverSolutionsPage /> },
  { path: '/solutions/owners', element: <OwnerSolutionsPage /> },
  { path: '/solutions/api', element: <ApiDocsPage /> },
  { path: '/company/about', element: <AboutUsPage /> },
  { path: '/company/careers', element: <CareersPage /> },
  { path: '/company/blog', element: <InsightsPage /> },
  {
    path: '/disputes',
    element: (
      <RequireRole role="DRIVER">
        <DriverLayout />
      </RequireRole>
    ),
    children: [
      { index: true, element: <DisputesPage role="driver" /> },
      { path: ':id', element: <DisputesPage role="driver" detail /> },
    ],
  },
  {
    path: '/admin',
    element: (
      <RequireRole role="ADMIN">
        <AdminLayout />
      </RequireRole>
    ),
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'dashboard', element: <AdminDashboardPage /> },
      { path: 'parking-lots', element: <AdminParkingLotsPage /> },
      { path: 'parking-lots/:id', element: <AdminLotDetailPage /> },
      { path: 'users', element: <AdminUsersPage /> },
      { path: 'users/:id', element: <AdminUserDetailPage /> },
      { path: 'transactions', element: <AdminTransactionsPage /> },
      { path: 'withdrawals', element: <AdminWithdrawalsPage /> },
      { path: 'disputes', element: <DisputesPage role="admin" /> },
      { path: 'disputes/:id', element: <DisputesPage role="admin" detail /> },
      { path: 'audit-logs', element: <AdminAuditLogsPage /> },
      { path: 'notifications', element: <PortalNotificationsPage /> },
      { path: 'profile', element: <AdminProfilePage /> },
    ],
  },
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/dashboard',
    element: <DriverLayout />,
    children: [
      {
        index: true,
        element: <DashboardHomePage />,
      },
      {
        path: 'search',
        element: <SearchParkingPage />,
      },
      {
        path: 'parking',
        element: <SearchParkingPage />,
      },
      {
        path: 'parking/:id',
        element: <ParkingDetailPage />,
      },
      {
        path: 'bookings',
        element: <MyBookingsPage />,
      },
      {
        path: 'queues',
        element: <VirtualQueuesPage />,
      },
      {
        path: 'payments',
        element: <DriverPaymentsPage />,
      },
      {
        path: 'vehicles',
        element: <VehiclesPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'change-password',
        element: <ChangePasswordPage />,
      },
      {
        path: 'payment/success',
        element: <PaymentReturnPage mode="success" />,
      },
      {
        path: 'payment/cancel',
        element: <PaymentCancelPage />,
      },
      {
        path: 'notifications',
        element: <NotificationsPage />,
      },
    ],
  },
  {
    path: '/driver',
    element: <DriverLayout />,
    children: [
      {
        index: true,
        element: <DashboardHomePage />,
      },
      {
        path: 'dashboard',
        element: <DashboardHomePage />,
      },
      {
        path: 'search',
        element: <SearchParkingPage />,
      },
      {
        path: 'parking/:id',
        element: <ParkingDetailPage />,
      },
      {
        path: 'bookings',
        element: <MyBookingsPage />,
      },
      {
        path: 'queues',
        element: <VirtualQueuesPage />,
      },
      {
        path: 'payments',
        element: <DriverPaymentsPage />,
      },
      {
        path: 'vehicles',
        element: <VehiclesPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'change-password',
        element: <ChangePasswordPage />,
      },
      {
        path: 'payment/success',
        element: <PaymentReturnPage mode="success" />,
      },
      {
        path: 'payment/cancel',
        element: <PaymentCancelPage />,
      },
      {
        path: 'notifications',
        element: <NotificationsPage />,
      },
    ],
  },
  {
    path: '/bookings',
    element: <DriverLayout />,
    children: [
      {
        index: true,
        element: <MyBookingsPage />,
      },
    ],
  },
  {
    path: '/queues',
    element: <DriverLayout />,
    children: [
      {
        index: true,
        element: <VirtualQueuesPage />,
      },
    ],
  },
  {
    path: '/payments',
    element: <DriverLayout />,
    children: [
      {
        index: true,
        element: <DriverPaymentsPage />,
      },
    ],
  },
  {
    path: '/vehicles',
    element: <DriverLayout />,
    children: [
      {
        index: true,
        element: <VehiclesPage />,
      },
    ],
  },
  {
    path: '/profile',
    element: <DriverLayout />,
    children: [
      {
        index: true,
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: '/change-password',
    element: <DriverLayout />,
    children: [
      {
        index: true,
        element: <ChangePasswordPage />,
      },
    ],
  },
  {
    path: '/payment/success',
    element: <DriverLayout />,
    children: [
      {
        index: true,
        element: <PaymentReturnPage mode="success" />,
      },
    ],
  },
  {
    path: '/payment/cancel',
    element: <DriverLayout />,
    children: [
      {
        index: true,
        element: <PaymentCancelPage />,
      },
    ],
  },
  {
    path: '/payment/return',
    element: <DriverLayout />,
    children: [
      {
        index: true,
        element: <PaymentReturnPage mode="success" />,
      },
    ],
  },
  {
    path: '/notifications',
    element: <DriverLayout />,
    children: [
      {
        index: true,
        element: <NotificationsPage />,
      },
    ],
  },
  {
    path: '/parking',
    element: <DriverLayout />,
    children: [
      {
        index: true,
        element: <SearchParkingPage />,
      },
      {
        path: ':id',
        element: <ParkingDetailPage />,
      },
    ],
  },
  {
    path: '/driver-solutions',
    element: <DriverSolutionsPage />,
  },
  {
    path: '/giai-phap-tai-xe',
    element: <DriverSolutionsPage />,
  },
  {
    path: '/owner-solutions',
    element: <OwnerSolutionsPage />,
  },
  {
    path: '/giai-phap-chu-bai',
    element: <OwnerSolutionsPage />,
  },
  {
    path: '/pricing',
    element: <PricingPage />,
  },
  {
    path: '/bang-gia',
    element: <PricingPage />,
  },
  {
    path: '/api-docs',
    element: <ApiDocsPage />,
  },
  {
    path: '/ket-noi-api',
    element: <ApiDocsPage />,
  },
  {
    path: '/about',
    element: <AboutUsPage />,
  },
  {
    path: '/ve-chung-toi',
    element: <AboutUsPage />,
  },
  {
    path: '/careers',
    element: <CareersPage />,
  },
  {
    path: '/tuyen-dung',
    element: <CareersPage />,
  },
  {
    path: '/insights',
    element: <InsightsPage />,
  },
  {
    path: '/tin-tuc',
    element: <InsightsPage />,
  },
  {
    path: '/merchant',
    element: (
      <RequireRole role="MERCHANT">
        <MerchantLayout />
      </RequireRole>
    ),
    children: [
      {
        index: true,
        element: <MerchantDashboardPage />,
      },
      {
        path: 'dashboard',
        element: <MerchantDashboardPage />,
      },
      {
        path: 'parking-lots',
        element: <MerchantParkingLotsPage />,
      },
      {
        path: 'parking-lots/new',
        element: <CreateMerchantParkingLotPage />,
      },
      {
        path: 'parking-lots/:parkingLotId',
        element: <MerchantParkingLotDetailPage />,
      },
      {
        path: 'parking-lots/:parkingLotId/edit',
        element: <EditMerchantParkingLotPage />,
      },
      {
        path: 'parking-lots/:parkingLotId/slots',
        element: <MerchantSlotsPage />,
      },
      {
        path: 'bookings',
        element: <MerchantBookingsPage />,
      },
      {
        path: 'qr-scanner',
        element: <MerchantScannerPage />,
      },
      {
        path: 'revenue',
        element: <MerchantRevenuePage />,
      },
      {
        path: 'withdrawals',
        element: <MerchantWithdrawalsPage />,
      },
      {
        path: 'disputes',
        element: <DisputesPage role="merchant" />,
      },
      { path: 'bookings/:id', element: <MerchantBookingDetailPage /> },
      {
        path: 'parking-lots/:id/pricing',
        element: <MerchantLotPage mode="pricing" />,
      },
      {
        path: 'disputes/:id',
        element: <DisputesPage role="merchant" detail />,
      },
      { path: 'notifications', element: <PortalNotificationsPage /> },
      {
        path: 'profile',
        element: <MerchantProfilePage />,
      },
    ],
  },
  {
    path: '/lien-he',
    element: <ContactPage />,
  },
  {
    path: '/ho-tro',
    element: <ContactPage />,
  },
  {
    path: '/crm',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <BaselineOverviewPage />,
      },
    ],
  },
  { path: '*', element: <AccessPage notFound /> },
])
