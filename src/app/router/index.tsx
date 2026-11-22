import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
const DesignPreviewPage = import.meta.env.DEV
  ? lazy(() => import('@/app/pages/DesignPreviewPage'))
  : null
const RootLayout = lazy(() =>
  import('@/layouts/RootLayout').then((module) => ({ default: module.RootLayout })),
)
const DriverShell = lazy(() =>
  import('@/layouts/DriverLayout').then((module) => ({ default: module.DriverLayout })),
)
const MerchantLayout = lazy(() =>
  import('@/layouts/MerchantLayout').then((module) => ({ default: module.MerchantLayout })),
)
const AdminLayout = lazy(() =>
  import('@/layouts/AdminLayout').then((module) => ({ default: module.AdminLayout })),
)
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage').then((module) => ({ default: module.LoginPage })))
const AuthPage = lazy(() =>
  import('@/features/auth').then((module) => ({ default: module.AuthPage })),
)
const AccessPage = lazy(() =>
  import('@/features/auth').then((module) => ({ default: module.AccessPage })),
)
const RequireRole = lazy(() =>
  import('@/features/auth').then((module) => ({ default: module.RequireRole })),
)
const ContactPage = lazy(() =>
  import('@/features/landing/pages/ContactPage').then((module) => ({ default: module.ContactPage })),
)
const TermsPage = lazy(() =>
  import('@/features/landing/pages/TermsPage').then((module) => ({ default: module.TermsPage })),
)
const PrivacyPage = lazy(() =>
  import('@/features/landing/pages/PrivacyPage').then((module) => ({ default: module.PrivacyPage })),
)
const MerchantBookingsPage = lazy(() =>
  import('@/features/merchant/operations').then((module) => ({ default: module.MerchantBookingsPage })),
)
const MerchantBookingDetailPage = lazy(() =>
  import('@/features/merchant/operations').then((module) => ({ default: module.MerchantBookingDetailPage })),
)
const MerchantScannerPage = lazy(() =>
  import('@/features/merchant/operations').then((module) => ({ default: module.MerchantScannerPage })),
)
const MerchantLotPage = lazy(() =>
  import('@/features/merchant/operations').then((module) => ({ default: module.MerchantLotPage })),
)
const MerchantRevenuePage = lazy(() =>
  import('@/features/merchant/operations').then((module) => ({ default: module.MerchantRevenuePage })),
)
const MerchantWithdrawalsPage = lazy(() =>
  import('@/features/merchant/operations').then((module) => ({ default: module.MerchantWithdrawalsPage })),
)
const DisputesPage = lazy(() =>
  import('@/features/disputes').then((module) => ({ default: module.DisputesPage })),
)
const PortalNotificationsPage = lazy(() =>
  import('@/features/notifications').then((module) => ({ default: module.PortalNotificationsPage })),
)
const AdminProfilePage = lazy(() =>
  import('@/features/admin/pages/AdminProfilePage').then((module) => ({ default: module.AdminProfilePage })),
)
const AdminDashboardPage = lazy(() =>
  import('@/features/admin').then((module) => ({ default: module.AdminDashboardPage })),
)
const AdminNotificationsPage = lazy(() =>
  import('@/features/admin/pages/AdminNotificationsPage').then((module) => ({ default: module.AdminNotificationsPage })),
)
const AdminParkingLotsPage = lazy(() =>
  import('@/features/admin').then((module) => ({ default: module.AdminParkingLotsPage })),
)
const AdminLotDetailPage = lazy(() =>
  import('@/features/admin').then((module) => ({ default: module.AdminLotDetailPage })),
)
const AdminMerchantVerificationsPage = lazy(() =>
  import('@/features/admin/merchant-verifications').then((module) => ({
    default: module.AdminMerchantVerificationsPage,
  })),
)
const AdminMerchantVerificationDetailPage = lazy(() =>
  import('@/features/admin/merchant-verifications').then((module) => ({
    default: module.AdminMerchantVerificationDetailPage,
  })),
)
const AdminUsersPage = lazy(() =>
  import('@/features/admin').then((module) => ({ default: module.AdminUsersPage })),
)
const AdminUserDetailPage = lazy(() =>
  import('@/features/admin').then((module) => ({ default: module.AdminUserDetailPage })),
)
const AdminTransactionsPage = lazy(() =>
  import('@/features/admin').then((module) => ({ default: module.AdminTransactionsPage })),
)
const AdminWithdrawalsPage = lazy(() =>
  import('@/features/admin').then((module) => ({ default: module.AdminWithdrawalsPage })),
)
const AdminAuditLogsPage = lazy(() =>
  import('@/features/admin').then((module) => ({ default: module.AdminAuditLogsPage })),
)
const BaselineOverviewPage = lazy(() =>
  import('@/app/pages/BaselineOverviewPage').then((module) => ({ default: module.BaselineOverviewPage })),
)
const DashboardHomePage = lazy(() =>
  import('@/features/driver/pages/DriverDashboardPage').then((module) => ({ default: module.DriverDashboardPage })),
)
const SearchParkingPage = lazy(() =>
  import('@/features/parking-search').then((module) => ({ default: module.SearchParkingPage })),
)
const ParkingDetailPage = lazy(() =>
  import('@/features/parking-detail').then((module) => ({ default: module.ParkingDetailPage })),
)
const MyBookingsPage = lazy(() =>
  import('@/features/bookings').then((module) => ({
    default: module.MyBookingsPage,
  })),
)
function VirtualQueuesPage() {
  return (
    <section
      aria-label="Tính năng hàng đợi đang tạm khóa"
      className="mx-auto my-10 max-w-xl rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-xs sm:p-8"
    >
      <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
        Tạm khóa truy cập
      </span>
      <h1 className="mt-4 font-sora text-xl font-bold text-slate-900">
        Tính năng Chờ vào bãi (Hàng đợi ảo) đang tạm khóa
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        Trang hàng đợi ảo hiện không mở sử dụng. Bạn vui lòng đặt chỗ trực tiếp tại các bãi đỗ còn chỗ trống hoặc kiểm tra vé hiện có.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <a
          href="/parking"
          className="inline-flex h-10 items-center justify-center rounded-xl bg-brand-primary px-4 text-xs font-semibold text-white hover:bg-brand-primary-hover"
        >
          Tìm bãi đỗ xe
        </a>
        <a
          href="/dashboard"
          className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          Về trang Tổng quan
        </a>
      </div>
    </section>
  )
}
const DriverWalletPage = lazy(() => import('@/features/driver-wallet').then(module => ({ default: module.DriverWalletPage })))
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
const PaymentReturnPage = lazy(() =>
  import('@/features/payment-return').then((module) => ({
    default: module.PaymentReturnPage,
  })),
)
const NotificationsPage = lazy(() =>
  import('@/features/notifications').then((module) => ({
    default: module.NotificationsPage,
  })),
)
const MerchantDashboardPage = lazy(() =>
  import('@/features/merchant/dashboard').then((module) => ({ default: module.MerchantDashboardPage })),
)
const MerchantParkingLotsPage = lazy(() =>
  import('@/features/merchant/parking-lots/pages/MerchantParkingLotsPage').then((module) => ({ default: module.MerchantParkingLotsPage })),
)
const CreateMerchantParkingLotPage = lazy(() =>
  import('@/features/merchant/parking-lots/pages/CreateMerchantParkingLotPage').then((module) => ({ default: module.CreateMerchantParkingLotPage })),
)
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
const MerchantProfilePage = lazy(() =>
  import('@/features/merchant/profile').then((module) => ({ default: module.MerchantProfilePage })),
)
const LandingPage = lazy(() =>
  import('@/features/landing/pages/LandingPage').then((module) => ({ default: module.LandingPage })),
)
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
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <AuthPage key="register" mode="register" /> },
  {
    path: '/forgot-password',
    element: <AuthPage key="forgot" mode="forgot" />,
  },
  { path: '/403', element: <AccessPage /> },
  { path: '/contact', element: <ContactPage /> },
  { path: '/company/contact', element: <ContactPage /> },
  { path: '/solutions/api', element: <ApiDocsPage /> },
  { path: '/company/about', element: <AboutUsPage /> },
  { path: '/company/careers', element: <CareersPage /> },
  { path: '/company/blog', element: <InsightsPage /> },
  { path: '/terms', element: <TermsPage /> },
  { path: '/company/terms', element: <TermsPage /> },
  { path: '/dieu-khoan', element: <TermsPage /> },
  { path: '/privacy', element: <PrivacyPage /> },
  { path: '/company/privacy', element: <PrivacyPage /> },
  { path: '/chinh-sach-bao-mat', element: <PrivacyPage /> },
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
      { path: 'merchant-verifications', element: <AdminMerchantVerificationsPage /> },
      { path: 'merchant-verifications/:id', element: <AdminMerchantVerificationDetailPage /> },
      { path: 'users', element: <AdminUsersPage /> },
      { path: 'users/:id', element: <AdminUserDetailPage /> },
      { path: 'transactions', element: <AdminTransactionsPage /> },
      { path: 'withdrawals', element: <AdminWithdrawalsPage /> },
      { path: 'disputes', element: <DisputesPage role="admin" /> },
      { path: 'disputes/:id', element: <DisputesPage role="admin" detail /> },
      { path: 'audit-logs', element: <AdminAuditLogsPage /> },
      { path: 'notifications', element: <AdminNotificationsPage /> },
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
        element: <Navigate to="/profile#bao-mat" replace />,
      },
      {
        path: 'payment/success',
        element: <PaymentReturnPage mode="success" />,
      },
      {
        path: 'payment/cancel',
        element: <PaymentReturnPage mode="cancel" />,
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
        element: <Navigate to="/profile#bao-mat" replace />,
      },
      {
        path: 'payment/success',
        element: <PaymentReturnPage mode="success" />,
      },
      {
        path: 'payment/cancel',
        element: <PaymentReturnPage mode="cancel" />,
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
    path: '/wallet',
    element: <DriverLayout />,
    children: [{ index: true, element: <DriverWalletPage /> }],
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
        element: <Navigate to="/profile#bao-mat" replace />,
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
        element: <PaymentReturnPage mode="cancel" />,
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
    path: '/solutions/drivers',
    element: <DriverSolutionsPage />,
  },
  {
    path: '/giai-phap-tai-xe',
    element: <DriverSolutionsPage />,
  },
  {
    path: '/solutions/owners',
    element: <OwnerSolutionsPage withLayout={true} />,
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

// Global router-level scroll restoration: resets scroll position to the top on every route transition
if (typeof window !== 'undefined') {
  router.subscribe((state) => {
    if (state.historyAction === 'PUSH' || state.historyAction === 'REPLACE') {
      try {
        if (typeof window.scrollTo === 'function') {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
        }
      } catch {
        window.scrollTo(0, 0)
      }
      if (typeof document !== 'undefined') {
        if (document.documentElement) {
          document.documentElement.scrollTop = 0
          document.documentElement.scrollLeft = 0
        }
        if (document.body) {
          document.body.scrollTop = 0
          document.body.scrollLeft = 0
        }
        const mainEl = document.getElementById('main-content') || document.querySelector('main')
        if (mainEl) {
          mainEl.scrollTop = 0
          mainEl.scrollLeft = 0
        }
      }
    }
  })
}
