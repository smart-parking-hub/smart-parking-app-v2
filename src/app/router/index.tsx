import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/layouts/RootLayout'
import { DriverLayout } from '@/layouts/DriverLayout'
import { BaselineOverviewPage } from '@/app/pages/BaselineOverviewPage'
import { DashboardHomePage } from '@/features/dashboard'
import { SearchParkingPage } from '@/features/parking-search'
import { ParkingDetailPage } from '@/features/parking-detail'
import { MyBookingsPage } from '@/features/bookings'
import {
  LandingPage,
  DriverSolutionsPage,
  OwnerSolutionsPage,
  PricingPage,
  ApiDocsPage,
  AboutUsPage,
  CareersPage,
  InsightsPage,
} from '@/features/landing'

export const router = createBrowserRouter([
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
    path: '/crm',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <BaselineOverviewPage />,
      },
    ],
  },
])
