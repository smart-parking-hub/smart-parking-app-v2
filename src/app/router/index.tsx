import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/layouts/RootLayout'
import { BaselineOverviewPage } from '@/app/pages/BaselineOverviewPage'
import {
  LandingPage,
  DriverSolutionsPage,
  OwnerSolutionsPage,
  PricingPage,
  ApiDocsPage,
  AboutUsPage,
  CareersPage,
  InsightsPage,
  ContactPage,
} from '@/features/landing'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
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
    path: '/bai-viet',
    element: <InsightsPage />,
  },
  {
    path: '/contact',
    element: <ContactPage />,
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
])
