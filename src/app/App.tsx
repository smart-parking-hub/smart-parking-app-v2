import { RouterProvider } from 'react-router-dom'
import { Suspense } from 'react'
import { AppProviders } from './providers'
import { router } from './router'

export function App() {
  return (
    <AppProviders>
      <Suspense
        fallback={
          <p role="status" className="p-8 text-brand-muted">
            Đang tải giao diện…
          </p>
        }
      >
        <RouterProvider router={router} />
      </Suspense>
    </AppProviders>
  )
}

export default App
