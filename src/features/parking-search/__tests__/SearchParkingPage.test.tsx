import { afterEach, describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import { SearchParkingPage } from '../pages/SearchParkingPage'
import { clearGeocoderCacheForTests } from '../api/mapProvider'
import { fallbackParkingLots } from '../api/parkingSearchApi'
import { parkingSearchStore } from '../store/parkingSearchStore'

vi.mock('@/shared/api/client', () => ({
  apiClient: {
    get: vi.fn(),
    request: vi.fn(),
  },
}))
vi.mock('../components/InteractiveMapCanvas', () => ({
  InteractiveMapCanvas: ({ selectedLot }: { selectedLot?: { id: number } }) => (
    <section aria-label="Bản đồ bãi đỗ OpenFreeMap" data-selected-id={selectedLot?.id ?? ''} />
  ),
}))

function renderWithProviders(
  ui: React.ReactElement,
  initialEntries = ['/parking'],
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('SCR-015: Interactive Parking Search & Map (Bản đồ tìm kiếm bãi đỗ)', () => {
  beforeEach(() => {
    HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', '') };
    HTMLDialogElement.prototype.close = function () { this.removeAttribute('open') };
    clearGeocoderCacheForTests()
    parkingSearchStore.closeQuickBook()
    parkingSearchStore.resetFilters()
    vi.clearAllMocks()
    vi.mocked(apiClient.get).mockImplementation(async url => String(url).match(/parking-lots\/\d+$/) ? { data: { data: { id: 1, name: 'Bãi API', address: 'Địa chỉ', status: 'APPROVED', slots: [], pricingRules: [] } } } : String(url).includes('/vehicles') ? { data: { data: { content: [{ id: 3, licensePlate: '51C-TEST', vehicleType: 'CONTAINER', status: 'ACTIVE' }] } } } : {
      data: {
        content: fallbackParkingLots,
        totalElements: fallbackParkingLots.length,
        totalPages: 1,
        size: 20,
        number: 0,
      },
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('starts with no targeted lot, targets the clicked lot, and resets on re-entry', async () => {
    parkingSearchStore.setSelectedLotId(fallbackParkingLots[0].id)
    const view = renderWithProviders(<SearchParkingPage />)
    const cards = await screen.findAllByRole('button', { name: /^Chọn bãi xe / }, { timeout: 10000 })
    const map = screen.getByRole('region', { name: 'Bản đồ bãi đỗ OpenFreeMap' })
    expect(map).toHaveAttribute('data-selected-id', '')
    expect(cards.every(card => card.getAttribute('aria-pressed') === 'false')).toBe(true)
    fireEvent.click(cards[1])
    expect(cards[1]).toHaveAttribute('aria-pressed', 'true')
    expect(map).toHaveAttribute('data-selected-id', String(parkingSearchStore.getState().selectedLotId))
    view.unmount()
    renderWithProviders(<SearchParkingPage />)
    expect(screen.getByRole('region', { name: 'Bản đồ bãi đỗ OpenFreeMap' })).toHaveAttribute('data-selected-id', '')
  })

  it('renders top filter bar with vehicle selector, 5 classifications and radius slider', async () => {
    renderWithProviders(<SearchParkingPage />)

    // 1. Vehicle selector & classifications
    expect(screen.getByText(/Phương tiện điều hành/i)).toBeInTheDocument()
    expect(
      screen.getAllByText(/Container 40\/45FT/i).length,
    ).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/Tải nặng \(>10T\)/i)).toBeInTheDocument()
    expect(screen.getByText(/Xe khách \(16–45 chỗ\)/i)).toBeInTheDocument()
    expect(screen.getByText(/Tải nhỏ \(<3.5T\)/i)).toBeInTheDocument()
    expect(screen.getByText(/Khách \/ Sedan/i)).toBeInTheDocument()

    // 2. Radius slider, positioned milestones & circular full-lot toggle
    expect(screen.getByText(/Bán kính quét:/i)).toBeInTheDocument()
    const slider = screen.getByRole('slider', { name: /Bán kính quét/i })
    expect(slider).toHaveValue('15')
    fireEvent.click(screen.getByRole('button', { name: '30km' }))
    expect(slider).toHaveValue('30')
    expect(screen.getAllByText(/30 km/i).length).toBeGreaterThanOrEqual(1)

    const includeFullCheckbox = screen.getByRole('checkbox', {
      name: /Hiện bãi đã đầy/i,
    })
    expect(includeFullCheckbox).toBeChecked()
    fireEvent.click(includeFullCheckbox)
    expect(includeFullCheckbox).not.toBeChecked()
    expect(screen.getByText(/Sắp xếp theo/i)).toBeInTheDocument()
  })

  it('renders location search, actual lot values and the interactive map region', async () => {
    renderWithProviders(<SearchParkingPage />)

    await waitFor(
      () => {
        expect(
          screen.getAllByText(/Trạm Dừng & Bãi Container Tân Cảng - Phú Hữu/i)
            .length,
        ).toBeGreaterThanOrEqual(1)
      },
      { timeout: 10000 },
    )

    // Search bar & count
    expect(
      screen.getByPlaceholderText(/Nhập địa chỉ cảng, KCN hoặc bến bãi.../i),
    ).toBeInTheDocument()
    expect(screen.getByText(/Vị trí của tôi/i)).toBeInTheDocument()

    // Yard cards
    expect(screen.getByText(/Gợi ý phù hợp/i)).toBeInTheDocument()
    expect(
      screen.getByText(/Bãi Đỗ Xe Vận Tải ICD Sóng Thần 2/i),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Depot Container Cát Lái Gate 2/i),
    ).toBeInTheDocument()

    // Map canvas
    expect(
      screen.getByRole('region', { name: 'Bản đồ bãi đỗ OpenFreeMap' }),
    ).toBeInTheDocument()
    expect(screen.queryByText(/Lưu lượng xe 85%/i)).not.toBeInTheDocument()

    // Filter section sits above the enclosing parking lots card container
    const filterSection = screen.getByRole('region', { name: 'Bộ lọc tìm bãi đỗ' })
    const lotsContainer = screen.getByTestId('parking-lots-container')
    expect(filterSection).toBeInTheDocument()
    expect(lotsContainer).toContainElement(
      screen.getByText(/Bãi Đỗ Xe Vận Tải ICD Sóng Thần 2/i),
    )
    expect(
      filterSection.compareDocumentPosition(lotsContainer) &
      Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })

  it('shows real-time parking lot and Photon suggestions below input while typing without clicking submit', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          features: [
            {
              geometry: { coordinates: [106.789, 10.771] },
              properties: {
                osm_id: 501,
                osm_type: 'N',
                name: 'Cảng Tân Cảng Cát Lái',
                city: 'TP. Thủ Đức',
                countrycode: 'VN',
              },
            },
          ],
        }),
      }),
    )

    renderWithProviders(<SearchParkingPage />)

    await screen.findByText(/Depot Container Cát Lái Gate 2/i)

    const input = screen.getByRole('combobox', { name: /Địa chỉ tìm kiếm/i })
    fireEvent.change(input, { target: { value: 'cat lai' } })

    // Local system parking lot suggestions appear immediately without pressing Tìm địa điểm
    const listbox = screen.getByRole('listbox', { name: /Kết quả tìm địa điểm/i })
    expect(listbox).toBeInTheDocument()
    const depotOption = screen.getByRole('option', {
      name: /Depot Container Cát Lái Gate 2/i,
    })
    expect(depotOption).toBeInTheDocument()

    // Debounced Photon suggestions arrive automatically without clicking submit
    const photonOption = await screen.findByRole(
      'option',
      { name: /Cảng Tân Cảng Cát Lái, TP\. Thủ Đức/i },
      { timeout: 2500 },
    )
    expect(photonOption).toBeInTheDocument()

    // Selecting the matching yard updates selection & closes dropdown
    fireEvent.click(depotOption)
    expect(
      screen.queryByRole('listbox', { name: /Kết quả tìm địa điểm/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Chọn bãi xe Depot Container Cát Lái Gate 2/i }),
    ).toHaveAttribute('aria-pressed', 'true')
  })

  it('restores initial unfiltered parking lot scope when clearing the selected address', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          features: [
            {
              geometry: { coordinates: [105.8542, 21.0285] },
              properties: {
                osm_id: 909,
                osm_type: 'N',
                name: 'Hồ Hoàn Kiếm',
                city: 'Hà Nội',
                countrycode: 'VN',
              },
            },
          ],
        }),
      }),
    )

    vi.mocked(apiClient.get).mockImplementation(async (url, config) => {
      if (String(url).includes('/vehicles')) {
        return {
          data: {
            data: {
              content: [{ id: 3, licensePlate: '51C-TEST', vehicleType: 'CONTAINER', status: 'ACTIVE' }],
            },
          },
        }
      }
      const params = config?.params as { latitude?: number } | undefined
      if (params?.latitude !== undefined) {
        return {
          data: {
            content: [],
            totalElements: 0,
            totalPages: 0,
            size: 100,
            number: 0,
          },
        }
      }
      return {
        data: {
          content: fallbackParkingLots,
          totalElements: fallbackParkingLots.length,
          totalPages: 1,
          size: 100,
          number: 0,
        },
      }
    })

    renderWithProviders(<SearchParkingPage />)

    await screen.findByText(/Depot Container Cát Lái Gate 2/i)

    const input = screen.getByRole('combobox', { name: /Địa chỉ tìm kiếm/i })
    fireEvent.change(input, { target: { value: 'Hoan Kiem' } })

    const remotePlace = await screen.findByRole(
      'option',
      { name: /Hồ Hoàn Kiếm, Hà Nội/i },
      { timeout: 2000 },
    )
    fireEvent.click(remotePlace)

    await waitFor(() => {
      expect(
        screen.getByText(/Không Tìm Thấy Bãi Đỗ Xe Nào Phù Hợp/i),
      ).toBeInTheDocument()
    })
    expect(parkingSearchStore.getState().origin).toMatchObject({
      latitude: 21.0285,
      longitude: 105.8542,
    })

    // Clicking clear (×) resets origin, coordinates, and restores initial parking lots
    fireEvent.click(screen.getByRole('button', { name: /Xóa tìm kiếm/i }))

    expect(input).toHaveValue('')
    expect(parkingSearchStore.getState().origin).toBeUndefined()
    expect(parkingSearchStore.getState().filters.latitude).toBeUndefined()
    expect(parkingSearchStore.getState().filters.longitude).toBeUndefined()

    await waitFor(() => {
      expect(
        screen.getByText(/Depot Container Cát Lái Gate 2/i),
      ).toBeInTheDocument()
    })
  })

  it('opens the server-backed booking flow without claiming a hold before submission', async () => {
    renderWithProviders(<SearchParkingPage />)
    const buttons = await screen.findAllByText(/ĐẶT GIỮ CHỖ|ĐẶT CHỖ/i)
    fireEvent.click(buttons[0])
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Đặt giữ chỗ/i })).toBeInTheDocument()
    expect(screen.queryByText('Giữ Chỗ Thành Công!')).not.toBeInTheDocument()
    expect(apiClient.request).not.toHaveBeenCalled()
  })

  it('displays empty state when no parking lots match criteria and allows expanding radius', async () => {
    vi.mocked(apiClient.get).mockImplementation(async url => {
      if (String(url).includes('/vehicles')) return { data: { data: { content: [] } } }
      if (String(url).match(/\/parking-lots\/\d+/)) {
        return { data: { data: { id: 1, name: 'Bãi Test', address: 'Địa chỉ', status: 'APPROVED', slots: [], pricingRules: [] } } }
      }
      return {
        data: {
          content: [],
          totalElements: 0,
          totalPages: 0,
          size: 20,
          number: 0,
        },
      }
    })

    renderWithProviders(<SearchParkingPage />)

    await waitFor(() => {
      expect(
        screen.getByText(/Không Tìm Thấy Bãi Đỗ Xe Nào Phù Hợp/i),
      ).toBeInTheDocument()
    })

    expect(
      screen.getByText(/Mở rộng bán kính \(35km\)/i),
    ).toBeInTheDocument()
    expect(screen.getByText(/Đặt lại bộ lọc/i)).toBeInTheDocument()

    // Click expand radius
    const expandBtn = screen.getByText(/Mở rộng bán kính \(35km\)/i)
    fireEvent.click(expandBtn)
  })

  it('displays accurate error alert without hardcoded ERR_GEO_DISPATCH_TIMEOUT when server request fails', async () => {
    vi.mocked(apiClient.get).mockImplementation(async url => { if (String(url).includes('/vehicles')) return { data: { data: { content: [] } } }; throw new Error('Network connection timeout') })

    renderWithProviders(<SearchParkingPage />)

    await waitFor(() => {
      expect(
        screen.getByText(/Không thể tải danh sách bãi đỗ từ hệ thống/i),
      ).toBeInTheDocument()
    })

    expect(screen.queryByText(/ERR_GEO_DISPATCH_TIMEOUT/i)).not.toBeInTheDocument()
    expect(screen.getByText(/Tải lại bãi xe/i)).toBeInTheDocument()
  })

  it('provides real-time database-backed parking lot suggestions in TopFilterBar without mock data', async () => {
    const dbOnlyLot = {
      id: 901,
      name: 'Bãi Container Hiệp Phước Real DB',
      address: 'KCN Hiệp Phước, Nhà Bè, TP.HCM',
      availableCapacity: 7,
      totalSlots: 30,
      basePricePerHour: 42000,
      latitude: 10.6421,
      longitude: 106.7512,
      averageRating: 4.9,
    }

    vi.mocked(apiClient.get).mockImplementation(async (url, config) => {
      if (String(url).includes('/vehicles')) {
        return {
          data: {
            data: {
              content: [
                {
                  id: 3,
                  licensePlate: '51C-TEST',
                  vehicleType: 'CONTAINER',
                  status: 'ACTIVE',
                },
              ],
            },
          },
        }
      }
      const params = config?.params as { latitude?: number } | undefined
      return {
        data: {
          data: {
            content: params?.latitude === undefined ? [dbOnlyLot] : [],
          },
        },
      }
    })

    renderWithProviders(<SearchParkingPage />)

    const lotSearchInput = screen.getByRole('combobox', {
      name: /Tìm nhanh bãi đỗ đang hoạt động/i,
    })
    fireEvent.focus(lotSearchInput)
    fireEvent.change(lotSearchInput, { target: { value: 'hiep phuoc' } })

    const suggestionListbox = await screen.findByRole('listbox', {
      name: /Gợi ý bãi đỗ đang hoạt động/i,
    })
    expect(suggestionListbox).toBeInTheDocument()

    const option = await screen.findByRole('option', {
      name: /Bãi Container Hiệp Phước Real DB/i,
    })
    expect(option).toBeInTheDocument()
    expect(option).toHaveTextContent('Còn 7 chỗ')
    expect(option).toHaveTextContent('42.000 đ/h')

    fireEvent.click(option)

    expect(
      screen.queryByRole('listbox', { name: /Gợi ý bãi đỗ đang hoạt động/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('region', { name: 'Bản đồ bãi đỗ OpenFreeMap' }),
    ).toHaveAttribute('data-selected-id', '901')

    // Clearing the keyword restores empty input
    fireEvent.click(
      screen.getByRole('button', { name: /Xóa từ khóa bãi đỗ/i }),
    )
    expect(lotSearchInput).toHaveValue('')
  })

  it('shows honest empty message in TopFilterBar search when database has no matching active lots', async () => {
    vi.mocked(apiClient.get).mockImplementation(async (url) => {
      if (String(url).includes('/vehicles')) {
        return { data: { data: { content: [] } } }
      }
      return { data: { data: { content: [] } } }
    })

    renderWithProviders(<SearchParkingPage />)

    const lotSearchInput = screen.getByRole('combobox', {
      name: /Tìm nhanh bãi đỗ đang hoạt động/i,
    })
    fireEvent.focus(lotSearchInput)
    fireEvent.change(lotSearchInput, { target: { value: 'khong ton tai' } })

    expect(
      await screen.findByText(
        /Không tìm thấy bãi đỗ đang hoạt động phù hợp với “khong ton tai”/i,
      ),
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/Trạm Dừng & Bãi Container Tân Cảng - Phú Hữu/i),
    ).not.toBeInTheDocument()
  })
})
