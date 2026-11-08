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

  it('renders correctly with header, segments, preset tags, and custom highlights input', () => {
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

    // Preset tags
    expect(screen.getByRole('button', { name: /\+ Bảo vệ 24\/7/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /\+ Mái che toàn bãi/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /\+ Trạm sạc xe điện/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /\+ Camera ALPR/i })).toBeInTheDocument()

    // 3 Segments
    expect(screen.getByText(`"${dummyContent.logisticsCapacity}"`)).toBeInTheDocument()
    expect(screen.getByText(`"${dummyContent.safetyRegulations}"`)).toBeInTheDocument()
    expect(screen.getByText(`"${dummyContent.circulationGuide}"`)).toBeInTheDocument()
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

  it('calls onGenerateNewAiContent with custom highlights when generate button is clicked', async () => {
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

    expect(onGenerate).toHaveBeenCalledWith('Gần trạm thu phí Long Phước')
  })

  it('applies content and shows confirmation state', async () => {
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

    const applyBtn = screen.getByRole('button', { name: /Áp Dụng Nội Dung AI Vào Hồ Sơ/i })
    await user.click(applyBtn)

    expect(onApply).toHaveBeenCalledWith(dummyContent)
    expect(screen.getByText(/Đã Áp Dụng Vào Hồ Sơ Bãi Đỗ!/i)).toBeInTheDocument()
  })
})

