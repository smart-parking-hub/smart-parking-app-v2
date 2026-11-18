import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CreateParkingLotAiWidget } from './CreateParkingLotAiWidget'
import type { AiContentSegments } from '../types/merchantParkingLotTypes'

describe('CreateParkingLotAiWidget', () => {
  const dummyContent: AiContentSegments = {
    logisticsCapacity: 'Depot quy mô 80 xe đầu kéo container tải trọng 60T.',
    safetyRegulations: 'Nội quy PCCC cấp 1 với 08 họng cứu hỏa D65.',
    circulationGuide: 'Tốc độ < 10km/h qua barie ALPR tự động.',
  }

  it('renders correctly with header, archetypes, editable segments, preset tags, and custom highlights input', () => {
    const onGenerate = vi.fn().mockResolvedValue(undefined)
    const onApply = vi.fn()

    render(
      <CreateParkingLotAiWidget
        currentAiContent={dummyContent}
        onGenerateNewAiContent={onGenerate}
        onApplyAiContent={onApply}
        isApplied={false}
      />,
    )

    expect(screen.getByText(/Trợ Lý AI Hỗ Trợ Khai Báo/i)).toBeInTheDocument()
    expect(screen.getByText(/ENGINE: FRETRIX-DISPATCH-V3/i)).toBeInTheDocument()
    expect(screen.getByText(/AI READY/i)).toBeInTheDocument()

    // 3 Archetypes
    expect(screen.getByText('Đô thị & Tòa nhà')).toBeInTheDocument()
    expect(screen.getByText('TTTM & Dịch vụ')).toBeInTheDocument()
    expect(screen.getByText('Depot & Tiếp vận')).toBeInTheDocument()

    // Preset tags (Default URBAN)
    expect(screen.getByRole('button', { name: /\+ Bảo vệ 24\/7/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /\+ Mái che toàn bãi/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /\+ Trạm sạc xe điện/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /\+ Camera ALPR/i })).toBeInTheDocument()

    // 3 Editable Segments
    expect(screen.getByDisplayValue(dummyContent.logisticsCapacity)).toBeInTheDocument()
    expect(screen.getByDisplayValue(dummyContent.safetyRegulations)).toBeInTheDocument()
    expect(screen.getByDisplayValue(dummyContent.circulationGuide)).toBeInTheDocument()
  })

  it('switches archetype and updates preset tags', async () => {
    const user = userEvent.setup()
    const onGenerate = vi.fn().mockResolvedValue(undefined)
    const onApply = vi.fn()
    const onArchetypeChange = vi.fn()

    render(
      <CreateParkingLotAiWidget
        currentAiContent={dummyContent}
        onGenerateNewAiContent={onGenerate}
        onApplyAiContent={onApply}
        onArchetypeChange={onArchetypeChange}
        isApplied={false}
      />,
    )

    // Switch to TTTM & Dịch vụ
    const mallButton = screen.getByRole('button', { name: /TTTM & Dịch vụ/i })
    await user.click(mallButton)

    expect(onArchetypeChange).toHaveBeenCalledWith('MALL')
    expect(screen.getByRole('button', { name: /\+ Miễn phí 30p đầu/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /\+ Thang máy kết nối TTTM/i })).toBeInTheDocument()
  })

  it('toggles preset tags into custom highlights input', async () => {
    const user = userEvent.setup()
    const onGenerate = vi.fn().mockResolvedValue(undefined)
    const onApply = vi.fn()

    render(
      <CreateParkingLotAiWidget
        currentAiContent={dummyContent}
        onGenerateNewAiContent={onGenerate}
        onApplyAiContent={onApply}
        isApplied={false}
      />,
    )

    const tag1 = screen.getByRole('button', { name: /\+ Bảo vệ 24\/7/i })
    await user.click(tag1)

    const textarea = screen.getByPlaceholderText(/Nhập thêm điểm nhấn đặc thù/i) as HTMLTextAreaElement
    expect(textarea.value).toContain('Bảo vệ 24/7')

    // Clicking tag again toggles it off
    const activeTag1 = screen.getByRole('button', { name: /✓ Bảo vệ 24\/7/i })
    await user.click(activeTag1)
    expect(textarea.value).not.toContain('Bảo vệ 24/7')
  })

  it('calls onGenerateNewAiContent with custom highlights and archetype when generate button is clicked', async () => {
    const user = userEvent.setup()
    const onGenerate = vi.fn().mockResolvedValue(undefined)
    const onApply = vi.fn()

    render(
      <CreateParkingLotAiWidget
        currentAiContent={dummyContent}
        onGenerateNewAiContent={onGenerate}
        onApplyAiContent={onApply}
        isApplied={false}
      />,
    )

    const textarea = screen.getByPlaceholderText(/Nhập thêm điểm nhấn đặc thù/i)
    await user.type(textarea, 'Gần trạm thu phí Long Phước')

    const generateBtn = screen.getByRole('button', { name: /Sinh Lại Nội Dung Bằng AI/i })
    await user.click(generateBtn)

    expect(onGenerate).toHaveBeenCalledWith('Gần trạm thu phí Long Phước', 'URBAN')
  })

  it('supports inline editing of segments and applies the edited text', async () => {
    const user = userEvent.setup()
    const onGenerate = vi.fn().mockResolvedValue(undefined)
    const onApply = vi.fn()

    render(
      <CreateParkingLotAiWidget
        currentAiContent={dummyContent}
        onGenerateNewAiContent={onGenerate}
        onApplyAiContent={onApply}
        isApplied={false}
      />,
    )

    // Edit segment 1
    const capacityTextarea = screen.getByLabelText('Khả Năng Tiếp Vận')
    await user.clear(capacityTextarea)
    await user.type(capacityTextarea, 'Mặt bằng bãi đỗ sức chứa 150 ô tô Sedan SUV.')

    const applyBtn = screen.getByRole('button', { name: /Áp Dụng Nội Dung/i })
    await user.click(applyBtn)

    expect(onApply).toHaveBeenCalledWith({
      ...dummyContent,
      logisticsCapacity: 'Mặt bằng bãi đỗ sức chứa 150 ô tô Sedan SUV.',
    })
    expect(screen.getByText(/Đã Áp Dụng Vào Hồ Sơ Bãi Đỗ!/i)).toBeInTheDocument()
  })

  it('toggles collapse and expand when header is clicked', async () => {
    const user = userEvent.setup()
    const onGenerate = vi.fn().mockResolvedValue(undefined)
    const onApply = vi.fn()

    render(
      <CreateParkingLotAiWidget
        currentAiContent={dummyContent}
        onGenerateNewAiContent={onGenerate}
        onApplyAiContent={onApply}
        isApplied={false}
      />,
    )

    // Initially expanded
    expect(screen.getByPlaceholderText(/Nhập thêm điểm nhấn đặc thù/i)).toBeInTheDocument()

    // Click header to collapse
    const headerToggle = screen.getByRole('button', { name: /Trợ Lý AI Hỗ Trợ Khai Báo/i })
    await user.click(headerToggle)

    // Body is hidden
    expect(screen.queryByPlaceholderText(/Nhập thêm điểm nhấn đặc thù/i)).not.toBeInTheDocument()

    // Click again to expand
    await user.click(headerToggle)
    expect(screen.getByPlaceholderText(/Nhập thêm điểm nhấn đặc thù/i)).toBeInTheDocument()
  })
})
