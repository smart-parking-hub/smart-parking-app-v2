import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  Button,
  Badge,
  Modal,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  TableContainer,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Pagination,
  Tabs,
  TabList,
  TabTrigger,
  TabContent,
  Alert,
  EmptyState,
  Skeleton,
} from '../index'

describe('Shared Design System Components', () => {
  describe('Button Component', () => {
    it('renders with primary variant, custom text, and responds to click events', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Xác nhận cọc</Button>)

      const btn = screen.getByRole('button', { name: /Xác nhận cọc/i })
      expect(btn).toBeInTheDocument()
      expect(btn.className).toContain('bg-[#d95f00]')
      fireEvent.click(btn)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('renders loading spinner and sets aria-busy when isLoading is true', () => {
      render(<Button isLoading>Đang xử lý</Button>)

      const btn = screen.getByRole('button', { name: /Đang xử lý/i })
      expect(btn).toHaveAttribute('aria-busy', 'true')
      expect(btn).toBeDisabled()
    })

    it('renders different variants and sizes cleanly', () => {
      const { rerender } = render(<Button variant="secondary" size="sm">Nút phụ</Button>)
      expect(screen.getByRole('button').className).toContain('bg-slate-100')

      rerender(<Button variant="danger" size="lg">Hủy vé</Button>)
      expect(screen.getByRole('button').className).toContain('bg-rose-600')

      rerender(<Button variant="outline">Đường viền</Button>)
      expect(screen.getByRole('button').className).toContain('border-slate-300')
    })
  })

  describe('Badge Component', () => {
    it('renders status variants and dot indicators', () => {
      const { rerender } = render(<Badge variant="success" dot>Đã thanh toán</Badge>)
      expect(screen.getByText(/Đã thanh toán/i)).toBeInTheDocument()
      expect(screen.getByText(/Đã thanh toán/i).className).toContain('bg-emerald-50')

      rerender(<Badge variant="orange">Đang giữ slot</Badge>)
      expect(screen.getByText(/Đang giữ slot/i).className).toContain('text-[#d95f00]')

      rerender(<Badge variant="danger">Vi phạm</Badge>)
      expect(screen.getByText(/Vi phạm/i).className).toContain('text-rose-700')
    })
  })

  describe('Modal Component', () => {
    it('renders modal dialog when isOpen is true and locks body scroll', () => {
      const handleClose = vi.fn()
      const { unmount } = render(
        <Modal isOpen={true} onClose={handleClose} title="Hộp thoại kiểm tra" description="Mô tả hộp thoại">
          <div>Nội dung bên trong modal</div>
        </Modal>
      )

      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText('Hộp thoại kiểm tra')).toBeInTheDocument()
      expect(screen.getByText('Mô tả hộp thoại')).toBeInTheDocument()
      expect(screen.getByText('Nội dung bên trong modal')).toBeInTheDocument()
      expect(document.body.style.overflow).toBe('hidden')

      // Close button
      const closeBtn = screen.getByLabelText(/Đóng cửa sổ/i)
      fireEvent.click(closeBtn)
      expect(handleClose).toHaveBeenCalled()

      unmount()
      expect(document.body.style.overflow).toBe('unset')
    })

    it('closes on Escape key press', () => {
      const handleClose = vi.fn()
      render(
        <Modal isOpen={true} onClose={handleClose} title="Thoát bằng ESC">
          <div>Nội dung</div>
        </Modal>
      )

      fireEvent.keyDown(window, { key: 'Escape' })
      expect(handleClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('Input Component', () => {
    it('renders label, input, helper text and manages value change', () => {
      const handleChange = vi.fn()
      render(
        <Input
          label="Biển số xe"
          required
          placeholder="51D-123.45"
          helperText="Nhập đầy đủ biển kiểm soát"
          onChange={handleChange}
        />
      )

      expect(screen.getByLabelText(/Biển số xe/i)).toBeInTheDocument()
      expect(screen.getByText('*')).toBeInTheDocument()
      expect(screen.getByText('Nhập đầy đủ biển kiểm soát')).toBeInTheDocument()

      const input = screen.getByPlaceholderText('51D-123.45')
      fireEvent.change(input, { target: { value: '51D-999.99' } })
      expect(handleChange).toHaveBeenCalled()
    })

    it('renders error message with alert role and invalid state', () => {
      render(
        <Input
          label="Email"
          error="Định dạng email không hợp lệ"
        />
      )

      expect(screen.getByRole('alert')).toHaveTextContent('Định dạng email không hợp lệ')
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })
  })

  describe('Card Component', () => {
    it('renders card anatomy with header, title, description, content and footer', () => {
      render(
        <Card variant="interactive">
          <CardHeader>
            <CardTitle>Bến bãi Tân Cảng</CardTitle>
            <CardDescription>Cụm Gate 2, Quận 2</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Sức chứa: 175 slot</p>
          </CardContent>
          <CardFooter>
            <button>Xem chi tiết</button>
          </CardFooter>
        </Card>
      )

      expect(screen.getByText('Bến bãi Tân Cảng')).toBeInTheDocument()
      expect(screen.getByText('Cụm Gate 2, Quận 2')).toBeInTheDocument()
      expect(screen.getByText('Sức chứa: 175 slot')).toBeInTheDocument()
      expect(screen.getByText('Xem chi tiết')).toBeInTheDocument()
    })
  })

  describe('Table Component', () => {
    it('renders tabular data with column alignment support', () => {
      render(
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead align="left">Mã đặt chỗ</TableHead>
                <TableHead align="center">Trạng thái</TableHead>
                <TableHead align="right">Tổng tiền</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell align="left">BK-2026-001</TableCell>
                <TableCell align="center">Đang đỗ</TableCell>
                <TableCell align="right">180.000 ₫</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )

      expect(screen.getByText('Mã đặt chỗ')).toHaveClass('text-left')
      expect(screen.getByText('Trạng thái')).toHaveClass('text-center')
      expect(screen.getByText('Tổng tiền')).toHaveClass('text-right')
      expect(screen.getByText('180.000 ₫')).toHaveClass('text-right')
    })
  })

  describe('Pagination Component', () => {
    it('renders page info, navigation buttons and handles page switching', () => {
      const handlePage = vi.fn()
      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          onPageChange={handlePage}
          totalItems={50}
          pageSize={10}
        />
      )

      expect(screen.getByText(/Trang 2 \/ 5/i)).toBeInTheDocument()
      expect(screen.getByText(/Hiển thị/i)).toBeInTheDocument()

      const prevBtn = screen.getByLabelText(/Trang trước/i)
      const nextBtn = screen.getByLabelText(/Trang sau/i)

      fireEvent.click(nextBtn)
      expect(handlePage).toHaveBeenCalledWith(3)

      fireEvent.click(prevBtn)
      expect(handlePage).toHaveBeenCalledWith(1)
    })
  })

  describe('Tabs Component', () => {
    it('switches between tab panels on tab click', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabList>
            <TabTrigger value="tab1">Tất cả</TabTrigger>
            <TabTrigger value="tab2">Đang hoạt động</TabTrigger>
          </TabList>
          <TabContent value="tab1">Nội dung tab 1</TabContent>
          <TabContent value="tab2">Nội dung tab 2</TabContent>
        </Tabs>
      )

      expect(screen.getByText('Nội dung tab 1')).toBeInTheDocument()
      expect(screen.queryByText('Nội dung tab 2')).not.toBeInTheDocument()

      const tab2Trigger = screen.getByRole('tab', { name: /Đang hoạt động/i })
      fireEvent.click(tab2Trigger)

      expect(screen.queryByText('Nội dung tab 1')).not.toBeInTheDocument()
      expect(screen.getByText('Nội dung tab 2')).toBeInTheDocument()
    })
  })

  describe('Alert Component', () => {
    it('renders alert message with icon, title, and handles close callback', () => {
      const handleClose = vi.fn()
      render(
        <Alert variant="warning" title="Cảnh báo tải trọng" onClose={handleClose}>
          Xe vượt quá tĩnh không 4.8m
        </Alert>
      )

      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('Cảnh báo tải trọng')).toBeInTheDocument()
      expect(screen.getByText(/Xe vượt quá tĩnh không 4.8m/i)).toBeInTheDocument()

      const closeBtn = screen.getByLabelText(/Đóng thông báo/i)
      fireEvent.click(closeBtn)
      expect(handleClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('EmptyState Component', () => {
    it('renders empty state title, description and action', () => {
      render(
        <EmptyState
          title="Chưa có dữ liệu giao dịch"
          description="Các giao dịch phát sinh sẽ hiển thị tại đây"
          action={<button>Tạo giao dịch</button>}
        />
      )

      expect(screen.getByText('Chưa có dữ liệu giao dịch')).toBeInTheDocument()
      expect(screen.getByText('Các giao dịch phát sinh sẽ hiển thị tại đây')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Tạo giao dịch/i })).toBeInTheDocument()
    })
  })

  describe('Skeleton Component', () => {
    it('renders presets: default, text, circular, card, table', () => {
      const { container } = render(
        <div>
          <Skeleton className="h-6 w-24" />
          <Skeleton variant="text" />
          <Skeleton variant="circular" className="w-10 h-10" />
          <Skeleton variant="card" />
          <Skeleton variant="table" rows={2} />
        </div>
      )

      const pulses = container.querySelectorAll('.animate-pulse')
      expect(pulses.length).toBeGreaterThanOrEqual(5)
    })
  })
})
