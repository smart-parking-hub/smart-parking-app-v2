import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/layouts/RootLayout'
import { BaselineOverviewPage } from '@/app/pages/BaselineOverviewPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <BaselineOverviewPage />,
      },
    ],
  },
])
