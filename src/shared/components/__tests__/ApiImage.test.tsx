import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { afterEach, expect, it, vi } from 'vitest'
import { apiClient } from '@/shared/api/client'
import { ApiImage } from '../ApiImage'

vi.mock('@/shared/api/client', () => ({ apiClient: { get: vi.fn() } }))

afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals() })

function mount(path: string) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } })
  return render(<QueryClientProvider client={client}><ApiImage path={path} alt="Ảnh bãi đỗ" /></QueryClientProvider>)
}

it('renders Cloudinary content directly without sending application API requests or headers', () => {
  const get = vi.mocked(apiClient.get).mockReset()
  const path = 'https://res.cloudinary.com/parking/image/upload/lot-37.jpg'
  mount(path)
  expect(screen.getByRole('img', { name: 'Ảnh bãi đỗ' })).toHaveAttribute('src', path)
  expect(get).not.toHaveBeenCalled()
})

it('retains authenticated blob loading and releases the object URL for local image content', async () => {
  const blob = new Blob(['local image'], { type: 'image/jpeg' })
  const get = vi.mocked(apiClient.get).mockReset().mockResolvedValue({ data: blob })
  const create = vi.fn(() => 'blob:local-photo')
  const revoke = vi.fn()
  vi.stubGlobal('URL', Object.assign(class extends URL {}, { createObjectURL: create, revokeObjectURL: revoke }))
  const path = '/api/v1/parking-lots/37/images/17/content'
  const view = mount(path)
  expect(await screen.findByRole('img', { name: 'Ảnh bãi đỗ' })).toHaveAttribute('src', 'blob:local-photo')
  expect(get).toHaveBeenCalledWith(path, { responseType: 'blob' })
  expect(create).toHaveBeenCalledWith(blob)
  view.unmount()
  expect(revoke).toHaveBeenCalledWith('blob:local-photo')
})

it('shows a readable fallback when local content is unavailable', async () => {
  vi.mocked(apiClient.get).mockReset().mockRejectedValue(new Error('Image unavailable'))
  mount('/api/v1/parking-lots/37/images/404/content')
  await waitFor(() => expect(screen.getByText('Không tải được ảnh')).toBeInTheDocument())
  expect(screen.queryByRole('img')).not.toBeInTheDocument()
})
