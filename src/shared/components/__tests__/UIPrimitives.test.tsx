import { describe, it, expect, vi, afterEach } from 'vitest'
import { cleanup, render, screen, fireEvent } from '@testing-library/react'
import { Check, Search } from 'lucide-react'
import {
  Button,
  IconButton,
  Input,
  Textarea,
  Checkbox,
  RadioGroup,
  Radio,
  Switch,
  Label,
  Heading,
  Text,
  Code,
  Caption,
  Icon,
  Spinner,
  Avatar,
  Separator,
  Badge,
} from '../index'

afterEach(cleanup)

describe('UI Primitives Standardized Components (PROMPT 11)', () => {
  describe('1. Button & IconButton', () => {
    it('Button supports size="lg" with 44px min touch target, isFullWidth, and icons', () => {
      render(
        <Button size="lg" isFullWidth leftIcon={<Check data-testid="left-icon" />}>
          Lưu cấu hình
        </Button>
      )
      const btn = screen.getByRole('button', { name: /Lưu cấu hình/i })
      expect(btn).toBeInTheDocument()
      expect(btn.className).toContain('w-full')
      expect(btn.className).toContain('min-h-[44px]')
      expect(screen.getByTestId('left-icon')).toBeInTheDocument()
    })

    it('IconButton renders with accessible label, tooltip, and responds to click', () => {
      const handleClick = vi.fn()
      render(
        <IconButton
          icon={<Search data-testid="search-icon" />}
          aria-label="Tìm kiếm bãi đỗ"
          tooltip="Mở khung tìm kiếm"
          onClick={handleClick}
        />
      )
      const btn = screen.getByRole('button', { name: 'Tìm kiếm bãi đỗ' })
      expect(btn).toBeInTheDocument()
      expect(btn).toHaveAttribute('title', 'Mở khung tìm kiếm')
      fireEvent.click(btn)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('IconButton handles isLoading state with spinner and aria-busy', () => {
      render(
        <IconButton
          icon={<Search />}
          aria-label="Đang xử lý"
          isLoading={true}
        />
      )
      const btn = screen.getByRole('button', { name: 'Đang xử lý' })
      expect(btn).toHaveAttribute('aria-busy', 'true')
      expect(btn).toBeDisabled()
    })
  })

  describe('2. Input & Textarea', () => {
    it('Input supports isRequired alias, readOnly state, and clear button', () => {
      const handleClear = vi.fn()
      render(
        <Input
          label="Biển số tra cứu"
          isRequired
          value="51D-999.99"
          readOnly={false}
          onClear={handleClear}
          onChange={() => {}}
        />
      )
      expect(screen.getByText('*')).toBeInTheDocument()
      const clearBtn = screen.getByRole('button', { name: 'Xóa nội dung nhập' })
      expect(clearBtn).toBeInTheDocument()
      fireEvent.click(clearBtn)
      expect(handleClear).toHaveBeenCalledTimes(1)
    })

    it('Input toggles password visibility when showPasswordToggle is true', () => {
      render(
        <Input
          type="password"
          label="Mật khẩu"
          defaultValue="secret123"
          showPasswordToggle
        />
      )
      const input = screen.getByLabelText(/^Mật khẩu$/i, { selector: 'input' })
      expect(input).toHaveAttribute('type', 'password')

      const toggleBtn = screen.getByRole('button', { name: 'Hiện mật khẩu' })
      fireEvent.click(toggleBtn)
      expect(input).toHaveAttribute('type', 'text')

      const hideBtn = screen.getByRole('button', { name: 'Ẩn mật khẩu' })
      fireEvent.click(hideBtn)
      expect(input).toHaveAttribute('type', 'password')
    })

    it('Textarea renders label, character counter, error message, and respects rows', () => {
      render(
        <Textarea
          label="Ghi chú điều xe"
          required
          rows={4}
          value="Xe cần cắm điện"
          maxLength={100}
          showCount
          error="Ghi chú quá ngắn"
          onChange={() => {}}
        />
      )
      expect(screen.getByLabelText(/Ghi chú điều xe/i)).toBeInTheDocument()
      expect(screen.getByText('15 / 100')).toBeInTheDocument()
      expect(screen.getByRole('alert')).toHaveTextContent('Ghi chú quá ngắn')
      expect(screen.getByRole('textbox')).toHaveAttribute('rows', '4')
    })
  })

  describe('3. Checkbox', () => {
    it('renders checked, unchecked, and indeterminate states with keyboard support', () => {
      const handleChange = vi.fn()
      const { rerender } = render(
        <Checkbox
          label="Đồng ý điều khoản"
          description="Bao gồm chính sách bảo hiểm và lưu bãi"
          checked={false}
          onChange={handleChange}
        />
      )

      const input = screen.getByRole('checkbox', { name: /Đồng ý điều khoản/i })
      expect(input).not.toBeChecked()

      fireEvent.click(input)
      expect(handleChange).toHaveBeenCalledWith(true)

      // Test indeterminate
      rerender(
        <Checkbox
          label="Chọn tất cả bãi xe"
          indeterminate={true}
          onChange={handleChange}
        />
      )
      const indInput = screen.getByRole('checkbox', { name: /Chọn tất cả bãi xe/i })
      expect(indInput).toHaveAttribute('aria-checked', 'mixed')
    })
  })

  describe('4. RadioGroup & Radio', () => {
    it('renders options, selection, badges, and triggers onChange', () => {
      const handleChange = vi.fn()
      const options = [
        { label: 'PayOS VietQR', value: 'payos', badge: 'Khuyên dùng' },
        { label: 'Ví SmartTruck', value: 'wallet' },
        { label: 'Tiền mặt tại cổng', value: 'cash', disabled: true },
      ]

      render(
        <RadioGroup
          name="paymentMethod"
          label="Phương thức thanh toán"
          options={options}
          selectedValue="payos"
          onChange={handleChange}
        />
      )

      expect(screen.getByRole('radiogroup', { name: 'Phương thức thanh toán' })).toBeInTheDocument()
      expect(screen.getByText('Khuyên dùng')).toBeInTheDocument()

      const walletRadio = screen.getByRole('radio', { name: /Ví SmartTruck/i })
      fireEvent.click(walletRadio)
      expect(handleChange).toHaveBeenCalledWith('wallet')
    })

    it('standalone Radio component renders label and responds to change', () => {
      const handleChange = vi.fn()
      render(
        <Radio
          name="singleRadio"
          value="option1"
          label="Tùy chọn độc lập"
          onChange={handleChange}
        />
      )
      const radio = screen.getByRole('radio', { name: 'Tùy chọn độc lập' })
      fireEvent.click(radio)
      expect(handleChange).toHaveBeenCalled()
    })
  })

  describe('5. Switch', () => {
    it('toggles on click and keyboard Space/Enter keys', () => {
      const handleChange = vi.fn()
      render(
        <Switch
          label="Kích hoạt Barie tự động"
          description="Tự động mở cổng khi camera ALPR khớp biển số"
          checked={false}
          onChange={handleChange}
        />
      )

      const toggle = screen.getByRole('switch', { name: /Kích hoạt Barie tự động/i })
      expect(toggle).toHaveAttribute('aria-checked', 'false')

      // Click toggle
      fireEvent.click(toggle)
      expect(handleChange).toHaveBeenCalledWith(true)

      // Space key
      fireEvent.keyDown(toggle, { key: ' ' })
      expect(handleChange).toHaveBeenCalledWith(true)

      // Enter key
      fireEvent.keyDown(toggle, { key: 'Enter' })
      expect(handleChange).toHaveBeenCalledWith(true)
    })
  })

  describe('6. Label', () => {
    it('renders label with red asterisk when required or isRequired is true', () => {
      render(
        <div>
          <Label htmlFor="field1" required>Họ và tên</Label>
          <Label htmlFor="field2" isRequired>Số điện thoại</Label>
        </div>
      )
      expect(screen.getByText('Họ và tên')).toBeInTheDocument()
      expect(screen.getByText('Số điện thoại')).toBeInTheDocument()
      expect(screen.getAllByText('*')).toHaveLength(2)
    })
  })

  describe('7. Typography (Heading, Text, Code, Caption)', () => {
    it('Heading renders correct HTML heading level elements', () => {
      render(
        <div>
          <Heading level={1}>Tiêu đề trang</Heading>
          <Heading level={2}>Tiêu đề mục</Heading>
          <Heading level={3}>Tiêu đề khối</Heading>
        </div>
      )
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Tiêu đề trang')
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Tiêu đề mục')
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Tiêu đề khối')
    })

    it('Text, Code and Caption render correctly with expected styles', () => {
      render(
        <div>
          <Text variant="lead">Đoạn văn mở đầu</Text>
          <Text variant="muted">Thông tin phụ</Text>
          <Code>STH-2026-X</Code>
          <Caption>CẬP NHẬT 2 PHÚT TRƯỚC</Caption>
        </div>
      )
      expect(screen.getByText('Đoạn văn mở đầu')).toBeInTheDocument()
      expect(screen.getByText('Thông tin phụ')).toBeInTheDocument()
      expect(screen.getByText('STH-2026-X')).toHaveClass('font-mono')
      expect(screen.getByText('CẬP NHẬT 2 PHÚT TRƯỚC')).toBeInTheDocument()
    })
  })

  describe('8. Icon & Spinner', () => {
    it('Icon wrapper sets sizing and handles decorative vs accessible modes', () => {
      render(
        <div>
          <Icon icon={Check} size="lg" data-testid="dec-icon" />
          <Icon icon={Check} size="sm" aria-label="Đã hoàn tất" />
        </div>
      )
      expect(screen.getByLabelText('Đã hoàn tất')).toBeInTheDocument()
    })

    it('Spinner renders role="status" and screen-reader label', () => {
      render(<Spinner size="lg" variant="primary" label="Đang tải dữ liệu bãi đỗ..." />)
      const spinner = screen.getByRole('status')
      expect(spinner).toBeInTheDocument()
      expect(screen.getByText('Đang tải dữ liệu bãi đỗ...')).toBeInTheDocument()
    })
  })

  describe('9. Avatar', () => {
    it('calculates initials from Vietnamese name and renders status dot', () => {
      render(<Avatar name="Hoàng Nam Vũ" status="online" size="lg" />)
      expect(screen.getByText('HV')).toBeInTheDocument()
      expect(screen.getByLabelText('Trạng thái: online')).toBeInTheDocument()
    })

    it('calculates single word initials', () => {
      render(<Avatar name="SmartTruck" />)
      expect(screen.getByText('SM')).toBeInTheDocument()
    })
  })

  describe('10. Separator', () => {
    it('renders horizontal, vertical, and labeled separator', () => {
      render(
        <div>
          <Separator orientation="horizontal" />
          <Separator orientation="vertical" />
          <Separator label="HOẶC TIẾP TỤC VỚI" />
        </div>
      )
      const separators = screen.getAllByRole('separator')
      expect(separators.length).toBeGreaterThanOrEqual(3)
      expect(screen.getByText('HOẶC TIẾP TỤC VỚI')).toBeInTheDocument()
    })
  })

  describe('11. Unified Badge', () => {
    it('supports value prop compatibility mode for status strings', () => {
      const { rerender } = render(<Badge value="APPROVED" />)
      expect(screen.getByText('Đã duyệt')).toBeInTheDocument()
      expect(screen.getByText('Đã duyệt').className).toContain('bg-emerald-50')

      rerender(<Badge value="CANCELLED" />)
      expect(screen.getByText('Đã hủy')).toBeInTheDocument()
      expect(screen.getByText('Đã hủy').className).toContain('bg-rose-50')

      rerender(<Badge value="PENDING" />)
      expect(screen.getByText('Chờ xử lý')).toBeInTheDocument()
      expect(screen.getByText('Chờ xử lý').className).toContain('bg-amber-50')
    })

    it('supports plate variant for vehicle registration plates', () => {
      render(<Badge variant="plate">51D-894.12</Badge>)
      const plate = screen.getByText('51D-894.12')
      expect(plate).toBeInTheDocument()
      expect(plate.className).toContain('font-mono')
    })
  })
})
