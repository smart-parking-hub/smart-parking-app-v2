import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import {
  SearchField,
  DatePicker,
  DateRangePicker,
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Breadcrumb,
  Toast,
  ToastContainer,
  Dialog,
  Drawer,
  ErrorState,
  DataTable,
  TableActionBar,
  SearchToolbar,
  FilterBar,
  FilterDrawer,
  FormSection,
  FormLayout,
  ConfirmationDialog,
  DestructiveActionDialog,
  LoadingPanel,
  EmptyDataPanel,
  ErrorRecoveryPanel,
  StatisticPanel,
  PageHeader,
} from '../index'

describe('Shared Compounds and UI Patterns Suite', () => {
  describe('SearchField', () => {
    it('renders with placeholder and triggers onChange, onSearch and onClear', () => {
      const handleChange = vi.fn()
      const handleSearch = vi.fn()
      const handleClear = vi.fn()

      render(
        <SearchField
          placeholder="Tìm bãi đỗ xe..."
          onChange={handleChange}
          onSearch={handleSearch}
          onClear={handleClear}
          defaultValue="Quận 1"
        />
      )

      const input = screen.getByPlaceholderText('Tìm bãi đỗ xe...') as HTMLInputElement
      expect(input.value).toBe('Quận 1')

      fireEvent.change(input, { target: { value: 'Quận 7' } })
      expect(handleChange).toHaveBeenCalledWith('Quận 7')

      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
      expect(handleSearch).toHaveBeenCalledWith('Quận 7')

      const clearBtn = screen.getByLabelText('Xóa từ khóa tìm kiếm')
      fireEvent.click(clearBtn)
      expect(handleClear).toHaveBeenCalled()
      expect(input.value).toBe('')
    })
  })

  describe('DatePicker & DateRangePicker', () => {
    it('renders DatePicker with label and responds to change', () => {
      const handleChange = vi.fn()
      render(
        <DatePicker
          label="Ngày đặt chỗ"
          value="2026-11-08"
          onChange={handleChange}
          required
        />
      )

      expect(screen.getByText('Ngày đặt chỗ')).toBeInTheDocument()
      const input = screen.getByLabelText(/^Ngày đặt chỗ/i)
      fireEvent.change(input, { target: { value: '2026-11-09' } })
      expect(handleChange).toHaveBeenCalledWith('2026-11-09')
    })

    it('renders DateRangePicker with start and end dates', () => {
      const handleStart = vi.fn()
      const handleEnd = vi.fn()
      render(
        <DateRangePicker
          startDate="2026-11-08"
          endDate="2026-11-10"
          onStartDateChange={handleStart}
          onEndDateChange={handleEnd}
        />
      )

      const startInput = screen.getByPlaceholderText('Từ ngày')
      const endInput = screen.getByPlaceholderText('Đến ngày')

      fireEvent.change(startInput, { target: { value: '2026-11-07' } })
      expect(handleStart).toHaveBeenCalledWith('2026-11-07')

      fireEvent.change(endInput, { target: { value: '2026-11-12' } })
      expect(handleEnd).toHaveBeenCalledWith('2026-11-12')
    })
  })

  describe('Dropdown', () => {
    it('toggles dropdown and handles item selection', () => {
      const handleItemClick = vi.fn()
      render(
        <Dropdown>
          <DropdownTrigger>
            <span>Tùy chọn</span>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownItem onClick={handleItemClick}>Chỉnh sửa</DropdownItem>
            <DropdownItem variant="danger">Xóa</DropdownItem>
          </DropdownContent>
        </Dropdown>
      )

      const trigger = screen.getByText('Tùy chọn')
      expect(screen.queryByText('Chỉnh sửa')).not.toBeInTheDocument()

      fireEvent.click(trigger)
      expect(screen.getByText('Chỉnh sửa')).toBeInTheDocument()

      fireEvent.click(screen.getByText('Chỉnh sửa'))
      expect(handleItemClick).toHaveBeenCalled()
      expect(screen.queryByText('Chỉnh sửa')).not.toBeInTheDocument()
    })
  })

  describe('Tooltip', () => {
    it('shows tooltip content on mouse enter and hides on mouse leave', () => {
      render(
        <Tooltip content="Mẹo: Click để làm mới">
          <button>Hover me</button>
        </Tooltip>
      )

      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()

      const button = screen.getByText('Hover me')
      fireEvent.mouseEnter(button)
      expect(screen.getByRole('tooltip')).toHaveTextContent('Mẹo: Click để làm mới')

      fireEvent.mouseLeave(button)
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
    })
  })

  describe('Popover', () => {
    it('opens and closes popover content', () => {
      render(
        <Popover>
          <PopoverTrigger>Mở Popover</PopoverTrigger>
          <PopoverContent>Nội dung chi tiết popover</PopoverContent>
        </Popover>
      )

      const trigger = screen.getByText('Mở Popover')
      expect(screen.queryByText('Nội dung chi tiết popover')).not.toBeInTheDocument()

      fireEvent.click(trigger)
      expect(screen.getByText('Nội dung chi tiết popover')).toBeInTheDocument()

      fireEvent.keyDown(document, { key: 'Escape' })
      expect(screen.queryByText('Nội dung chi tiết popover')).not.toBeInTheDocument()
    })
  })

  describe('Breadcrumb', () => {
    it('renders hierarchy with aria-current on the last item', () => {
      const items = [
        { label: 'Bãi đỗ xe', href: '/parking' },
        { label: 'Chi tiết bãi xe #123' },
      ]

      render(
        <MemoryRouter>
          <Breadcrumb items={items} showHomeIcon homeHref="/" />
        </MemoryRouter>
      )

      expect(screen.getByText('Trang chủ')).toBeInTheDocument()
      expect(screen.getByText('Bãi đỗ xe')).toBeInTheDocument()
      const current = screen.getByText('Chi tiết bãi xe #123')
      expect(current).toHaveAttribute('aria-current', 'page')
    })
  })

  describe('Toast', () => {
    it('renders variant and handles close callback', () => {
      const handleClose = vi.fn()
      render(
        <Toast
          title="Thành công"
          message="Đã lưu thay đổi hồ sơ"
          variant="success"
          onClose={handleClose}
        />
      )

      expect(screen.getByText('Thành công')).toBeInTheDocument()
      expect(screen.getByText('Đã lưu thay đổi hồ sơ')).toBeInTheDocument()

      const closeBtn = screen.getByLabelText('Đóng thông báo')
      fireEvent.click(closeBtn)
      expect(handleClose).toHaveBeenCalled()
    })

    it('renders ToastContainer with top-right position and accessibility attributes', () => {
      render(
        <ToastContainer>
          <Toast title="Thông báo hệ thống" message="Đang đồng bộ..." />
        </ToastContainer>
      )

      const container = screen.getByText('Thông báo hệ thống').closest('[aria-live="polite"]')
      expect(container).toBeInTheDocument()
      expect(container).toHaveClass('fixed', 'top-20', 'right-4', 'z-[100]')
    })
  })

  describe('Dialog & Drawer', () => {
    it('renders Dialog with title and close button', () => {
      const handleClose = vi.fn()
      render(
        <Dialog title="Cập nhật mật khẩu" onClose={handleClose}>
          <p>Nội dung biểu mẫu</p>
        </Dialog>
      )

      expect(screen.getByText('Cập nhật mật khẩu')).toBeInTheDocument()
      expect(screen.getByText('Nội dung biểu mẫu')).toBeInTheDocument()

      const closeBtn = screen.getByLabelText('Đóng')
      fireEvent.click(closeBtn)
      expect(handleClose).toHaveBeenCalled()
    })

    it('renders Drawer when open and executes close', () => {
      const handleClose = vi.fn()
      render(
        <Drawer
          isOpen
          title="Bộ lọc bãi đỗ"
          description="Lọc theo quận và loại xe"
          onClose={handleClose}
        >
          <div>Nội dung drawer</div>
        </Drawer>
      )

      expect(screen.getByText('Bộ lọc bãi đỗ')).toBeInTheDocument()
      expect(screen.getByText('Lọc theo quận và loại xe')).toBeInTheDocument()
      expect(screen.getByText('Nội dung drawer')).toBeInTheDocument()

      const closeBtn = screen.getByLabelText('Đóng bảng')
      fireEvent.click(closeBtn)
      expect(handleClose).toHaveBeenCalled()
    })
  })

  describe('ErrorState', () => {
    it('renders error title, description, and triggers retry', () => {
      const handleRetry = vi.fn()
      render(
        <ErrorState
          title="Lỗi kết nối máy chủ"
          description="Không thể đồng bộ dữ liệu lúc này"
          onRetry={handleRetry}
          retryText="Thử lại ngay"
        />
      )

      expect(screen.getByText('Lỗi kết nối máy chủ')).toBeInTheDocument()
      expect(screen.getByText('Không thể đồng bộ dữ liệu lúc này')).toBeInTheDocument()

      const retryBtn = screen.getByText('Thử lại ngay')
      fireEvent.click(retryBtn)
      expect(handleRetry).toHaveBeenCalled()
    })
  })

  describe('DataTable & TableActionBar', () => {
    interface TestItem {
      id: number
      code: string
      name: string
      amount: number
    }

    const testRows: TestItem[] = [
      { id: 1, code: 'BK-001', name: 'Nguyễn Văn A', amount: 50000 },
      { id: 2, code: 'BK-002', name: 'Trần Thị B', amount: 120000 },
      { id: 3, code: 'BK-003', name: 'Lê Văn C', amount: 80000 },
    ]

    const columns = [
      { key: 'code', label: 'Mã đặt chỗ', render: (row: TestItem) => row.code, sortable: true },
      { key: 'name', label: 'Khách hàng', render: (row: TestItem) => row.name },
      {
        key: 'amount',
        label: 'Số tiền',
        render: (row: TestItem) => `${row.amount.toLocaleString('vi-VN')} đ`,
        align: 'right' as const,
      },
    ]

    it('renders table headers, rows, and supports searching', () => {
      render(
        <MemoryRouter>
          <DataTable
            rows={testRows}
            columns={columns}
            searchText={(row) => `${row.code} ${row.name}`}
            searchPlaceholder="Tìm kiếm..."
          />
        </MemoryRouter>
      )

      expect(screen.getByText('BK-001')).toBeInTheDocument()
      expect(screen.getByText('Trần Thị B')).toBeInTheDocument()

      const searchInput = screen.getByPlaceholderText('Tìm kiếm...')
      fireEvent.change(searchInput, { target: { value: 'BK-002' } })

      expect(screen.queryByText('BK-001')).not.toBeInTheDocument()
      expect(screen.getByText('BK-002')).toBeInTheDocument()
    })

    it('supports row selection and TableActionBar display', () => {
      const handleSelectRow = vi.fn()
      const handleSelectAll = vi.fn()
      const handleClear = vi.fn()

      render(
        <MemoryRouter>
          <TableActionBar
            selectedCount={2}
            totalCount={3}
            onClearSelection={handleClear}
            actions={<button>Xóa hàng loạt</button>}
          />
          <DataTable
            rows={testRows}
            columns={columns}
            selectable
            selectedIds={[1, 2]}
            onSelectRow={handleSelectRow}
            onSelectAll={handleSelectAll}
          />
        </MemoryRouter>
      )

      expect(screen.getByText('Xóa hàng loạt')).toBeInTheDocument()
      const clearBtn = screen.getByText('Bỏ chọn')
      fireEvent.click(clearBtn)
      expect(handleClear).toHaveBeenCalled()

      const selectAll = screen.getByLabelText('Chọn tất cả')
      fireEvent.click(selectAll)
      expect(handleSelectAll).toHaveBeenCalled()
    })
  })

  describe('SearchToolbar & FilterBar & FilterDrawer', () => {
    it('renders SearchToolbar with filters and actions', () => {
      const handleSearch = vi.fn()
      render(
        <SearchToolbar
          searchValue="Bãi xe"
          onSearchChange={handleSearch}
          filters={<button>Lọc nâng cao</button>}
          actions={<button>Tạo mới</button>}
        />
      )

      expect(screen.getByText('Lọc nâng cao')).toBeInTheDocument()
      expect(screen.getByText('Tạo mới')).toBeInTheDocument()
    })

    it('renders FilterBar with chips and handles chip removal', () => {
      const handleRemove = vi.fn()
      const handleClear = vi.fn()
      const chips = [
        { id: 'district', label: 'Quận', value: 'Quận 1' },
        { id: 'status', label: 'Trạng thái', value: 'Còn chỗ' },
      ]

      render(
        <FilterBar
          chips={chips}
          onRemoveChip={handleRemove}
          onClearAll={handleClear}
          resultCount={15}
        />
      )

      expect(screen.getByText('15')).toBeInTheDocument()
      expect(screen.getByText('Quận 1')).toBeInTheDocument()

      const removeDistrictBtn = screen.getByLabelText('Xóa bộ lọc Quận')
      fireEvent.click(removeDistrictBtn)
      expect(handleRemove).toHaveBeenCalledWith('district')

      const clearAllBtn = screen.getByText('Xóa tất cả')
      fireEvent.click(clearAllBtn)
      expect(handleClear).toHaveBeenCalled()
    })

    it('renders FilterDrawer with apply and reset callbacks', () => {
      const handleApply = vi.fn()
      const handleReset = vi.fn()
      const handleClose = vi.fn()

      render(
        <FilterDrawer
          isOpen
          onClose={handleClose}
          onApply={handleApply}
          onReset={handleReset}
          title="Lọc đơn hàng"
        >
          <div>Tùy chọn bộ lọc</div>
        </FilterDrawer>
      )

      expect(screen.getByText('Lọc đơn hàng')).toBeInTheDocument()
      expect(screen.getByText('Tùy chọn bộ lọc')).toBeInTheDocument()

      const resetBtn = screen.getByText('Đặt lại')
      fireEvent.click(resetBtn)
      expect(handleReset).toHaveBeenCalled()

      const applyBtn = screen.getByText('Áp dụng bộ lọc')
      fireEvent.click(applyBtn)
      expect(handleApply).toHaveBeenCalled()
    })
  })

  describe('FormSection & FormLayout', () => {
    it('renders FormLayout and FormSection properly', () => {
      render(
        <FormLayout
          columns={2}
          footer={<button type="submit">Lưu thông tin</button>}
        >
          <FormSection title="Thông tin cơ bản" description="Nhập tên và số điện thoại">
            <div>Các trường form</div>
          </FormSection>
        </FormLayout>
      )

      expect(screen.getByText('Thông tin cơ bản')).toBeInTheDocument()
      expect(screen.getByText('Nhập tên và số điện thoại')).toBeInTheDocument()
      expect(screen.getByText('Lưu thông tin')).toBeInTheDocument()
    })
  })

  describe('ConfirmationDialog & DestructiveActionDialog', () => {
    it('triggers onConfirm and onCancel callbacks', () => {
      const handleConfirm = vi.fn()
      const handleCancel = vi.fn()

      render(
        <ConfirmationDialog
          isOpen
          title="Xác nhận hủy đặt chỗ"
          message="Bạn có chắc chắn muốn hủy đặt chỗ này không?"
          onConfirm={handleConfirm}
          onClose={handleCancel}
          confirmText="Đồng ý hủy"
          cancelText="Giữ lại"
        />
      )

      expect(screen.getByText('Xác nhận hủy đặt chỗ')).toBeInTheDocument()
      expect(screen.getByText('Bạn có chắc chắn muốn hủy đặt chỗ này không?')).toBeInTheDocument()

      fireEvent.click(screen.getByText('Đồng ý hủy'))
      expect(handleConfirm).toHaveBeenCalled()

      fireEvent.click(screen.getByText('Giữ lại'))
      expect(handleCancel).toHaveBeenCalled()
    })

    it('renders DestructiveActionDialog with destructive styling', () => {
      const handleConfirm = vi.fn()
      render(
        <DestructiveActionDialog
          isOpen
          title="Xóa bãi xe"
          message="Hành động này không thể hoàn tác."
          onConfirm={handleConfirm}
          onClose={vi.fn()}
        />
      )

      expect(screen.getByText('Xóa bãi xe')).toBeInTheDocument()
      expect(screen.getByText('Xóa bỏ')).toBeInTheDocument()
    })
  })

  describe('FeedbackPanels (LoadingPanel, EmptyDataPanel, ErrorRecoveryPanel)', () => {
    it('renders LoadingPanel with status role', () => {
      render(<LoadingPanel message="Đang tải danh sách xe..." />)
      expect(screen.getAllByRole('status').length).toBeGreaterThan(0)
      expect(screen.getByText('Đang tải danh sách xe...')).toBeInTheDocument()
    })

    it('renders EmptyDataPanel with title and action', () => {
      render(
        <EmptyDataPanel
          title="Chưa có lượt đặt chỗ"
          description="Lượt đặt mới sẽ hiển thị tại đây"
          action={<button>Đặt ngay</button>}
        />
      )

      expect(screen.getByText('Chưa có lượt đặt chỗ')).toBeInTheDocument()
      expect(screen.getByText('Đặt ngay')).toBeInTheDocument()
    })

    it('renders ErrorRecoveryPanel with retry callback', () => {
      const handleRetry = vi.fn()
      render(
        <ErrorRecoveryPanel
          title="Lỗi tải biểu đồ"
          onRetry={handleRetry}
          retryText="Tải lại biểu đồ"
        />
      )

      expect(screen.getByText('Lỗi tải biểu đồ')).toBeInTheDocument()
      fireEvent.click(screen.getByText('Tải lại biểu đồ'))
      expect(handleRetry).toHaveBeenCalled()
    })
  })

  describe('StatisticPanel & PageHeader', () => {
    it('renders StatisticPanel with trend and note', () => {
      render(
        <StatisticPanel
          label="Tổng doanh thu"
          value="45.000.000 đ"
          trend={{ value: 18.5, isPositive: true, label: 'so với tháng trước' }}
        />
      )

      expect(screen.getByText('Tổng doanh thu')).toBeInTheDocument()
      expect(screen.getByText('45.000.000 đ')).toBeInTheDocument()
      expect(screen.getByText('+18.5%')).toBeInTheDocument()
      expect(screen.getByText('so với tháng trước')).toBeInTheDocument()
    })

    it('renders PageHeader with eyebrow, title, description and breadcrumbs', () => {
      render(
        <MemoryRouter>
          <PageHeader
            eyebrow="QUẢN TRỊ / VẬN HÀNH"
            title="Quản lý Bãi đỗ xe"
            description="Theo dõi trạng thái và doanh thu các điểm gửi xe toàn hệ thống"
            breadcrumbs={[
              { label: 'Tổng quan', href: '/admin' },
              { label: 'Bãi đỗ xe' },
            ]}
            actions={<button>Thêm bãi xe</button>}
          />
        </MemoryRouter>
      )

      expect(screen.getByText('QUẢN TRỊ / VẬN HÀNH')).toBeInTheDocument()
      expect(screen.getByText('Quản lý Bãi đỗ xe')).toBeInTheDocument()
      expect(screen.getByText(/Theo dõi trạng thái và doanh thu/)).toBeInTheDocument()
      expect(screen.getByText('Thêm bãi xe')).toBeInTheDocument()
      expect(screen.getByText('Tổng quan')).toBeInTheDocument()
    })
  })
})
