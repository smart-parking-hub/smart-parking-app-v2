# 02. SHARED COMPONENT INVENTORY — SMART PARKING HUB CRM V2

> **Giai đoạn:** DISCOVERY & INVENTORY AUDIT  
> **Thời gian khảo sát:** 06/11/2026 · **Trạng thái:** HOÀN THÀNH PHÂN LOẠI & ĐỐI SOÁT TOÀN DIỆN  
> **Nguồn bằng chứng:** `src/shared/components/`, `src/layouts/`, các component nội bộ trong `src/features/`.

---

## 1. BẢNG TỔNG QUAN PHÂN LOẠI COMPONENT TOÀN HỆ THỐNG

| Nhóm Component | Triển Khai Trong `shared/` | Triển Khai Riêng Trong `features/` & `layouts/` | Đánh Giá Tái Sử Dụng & Hiện Trạng |
| :--- | :--- | :--- | :--- |
| **Global Header** | Không có | `DriverHeader`, `MerchantHeader`, `AdminLayout` Header, `LandingNavbar` | **4 implementation riêng biệt**; không đồng bộ về cơ chế mở mobile menu và chiều cao. |
| **Sidebar Navigation** | Không có | `MerchantSidebar`, `AdminLayout` Aside, `ProfileSidebarNav`, `RootLayout` Sidebar | **3 sidebar chính + 1 mini nav**; lệch độ rộng (260px vs 256px), lệch bảng màu (`#131b2e` vs `bg-brand-navy`). |
| **Footer** | Không có | `DriverFooter`, `LandingFooter` | 2 footer dành riêng cho phân hệ Driver và Landing. Các phân hệ Dashboard không dùng footer (đúng chuẩn app screen). |
| **Page Container** | `Workspace` (`max-w-[1440px]`) | `DriverDashboard` (`1280px`), `SearchParking` (`1800px`), `Profile` (`1120px`) | **Không đồng bộ độ rộng max-width** giữa các trang cùng phân hệ. |
| **Button** | `<Button>` (Variant-based) & `button` class (`Workspace.tsx`) | Nhiều nút hardcode `bg-[#d95f00]` hoặc `bg-slate-900` | **Tồn tại song song 2 implementation shared** + nhiều nút hardcode. Vấn đề tương phản màu chữ trắng trên nền cam. |
| **Input & Select** | `control` class (`Workspace.tsx`), `<Select>` combobox | Input hardcode trong `DriverDashboardPage`, `VehiclesPage` | Đa số dùng `control`. `<Select>` có độ hoàn thiện a11y cao nhưng ít được gọi ngoài shared. |
| **Date / Time Picker** | Native `<input type="date">` / `<time>` | Không dùng thư viện ngoài | Tuân thủ ADR-0001, nhẹ và native. |
| **Data Table** | `DataTable` (`Workspace.tsx`) | `RecentBookingsTable`, `RecentCheckinManifestTable`, `VehicleMasterTable`, `PaymentMasterTable`, `QueueHistoryTable` | **Bị trùng lặp nặng**: 5 table tùy biến trong features thay vì tái sử dụng `DataTable`. Cột tiền tệ chưa căn phải. |
| **Pagination** | Nút Trước/Sau trong `DataTable` | Phân trang tự viết trong `PaymentMasterTable`, `AdminAuditLogsPage` | `DataTable` có phân trang chuẩn nhưng chỉ phục vụ client-side slice hoặc page-based. |
| **Card & Panel** | `Panel` (`Workspace.tsx`) | Bento Cards trong Driver, Merchant, Vehicles, Payments | `Panel` rất phẳng và chuẩn TasteSkill; Bento cards ở features lạm dụng icon trong vòng tròn màu. |
| **Dialog / Modal** | `<Dialog>` (HTML5 `<dialog>`) & `<Modal>` (Custom fixed overlay) | Hơn 10 modals tự dựng trong `bookings`, `vehicles`, `queues`, `profile` | **Trùng lặp 2 modal shared** + nhiều modal tính năng tự tạo overlay riêng. |
| **Drawer / Slide-over** | Không có | `InlineQuickBookPanel` (`parking-search`) | Drawer hoạt động mượt, có backdrop và animation trượt từ phải sang. |
| **Badge** | `<Badge>` (Variant) & `Badge` (`Workspace.tsx` regex) | Nhiều thẻ `<span>` tự style inline trong features | **Trùng lặp 2 component cùng tên `Badge`**. Phiên bản `Workspace` tiện dụng cho backend status. |
| **Toast & Notice** | `Notice` inline banner | Toasts riêng lẻ trong `AuthSession`, `DriverDashboard`, `MyBookings` | Thiếu hệ thống Toast Provider toàn cục thống nhất; mỗi trang tự quản lý toast bằng local state hoặc event. |
| **Skeleton Loader** | `<Skeleton>` | `DashboardSkeleton`, `SearchParkingSkeleton`, `BookingsSkeleton`, `MerchantDashboardSkeleton`... | Rất tốt! Đầy đủ skeleton mô phỏng đúng wireframe từng trang. |
| **Empty State** | `<EmptyState>` | `DashboardEmptyState`, `BookingsEmptyState`, inline empty table | Đã có component shared nhưng các trang lớn tự viết empty state riêng để gắn hình minh họa. |
| **Error & Retry** | `Notice error` | Khối `bg-rose-50 border-rose-200` + nút `RefreshCw` | Mô thức xử lý lỗi trực quan và nút bấm thử lại (Retry) rất đồng bộ và chuẩn UX. |

---

## 2. PHÂN TÍCH CHI TIẾT CÁC COMPONENT BỊ TRÙNG LẶP HOẶC LỆCH KIẾN TRÚC

### 2.1. Nút Bấm (`Button` vs `button` class)
- **Triển khai 1 (`src/shared/components/Button.tsx`):**
  - Nhận props: `variant` (`primary`, `secondary`, `outline`, `ghost`, `danger`), `size`, `isLoading`.
  - Màu primary: `bg-[#F97316] text-white hover:bg-[#EA580C]`.
  - Vấn đề: Chữ trắng trên nền cam `#F97316` có tỷ lệ tương phản ~2.9:1, vi phạm tiêu chuẩn tiếp cận WCAG AA.
- **Triển khai 2 (`src/shared/components/Workspace.tsx`):**
  - Xuất class string: `export const button = 'inline-flex ... bg-brand-orange px-4 py-3 text-sm font-semibold text-brand-navy hover:bg-brand-orange-hover...'`.
  - Ưu điểm: Chữ `text-brand-navy` trên nền cam `bg-brand-orange` đạt tỷ lệ tương phản ~11:1 cực kỳ rõ nét.
- **Triển khai 3 (Tại các features):**
  - Các nút hardcode mã hex `#d95f00` với chữ trắng `text-white`.

### 2.2. Huy Hiệu Trạng Thái (`Badge` vs `Badge`)
- **Triển khai 1 (`src/shared/components/Badge.tsx`):**
  - Nhận `variant` (`default`, `primary`, `success`, `warning`, `danger`, `outline`, `orange`) và `children`. Phù hợp cho UI tĩnh.
- **Triển khai 2 (`src/shared/components/Workspace.tsx`):**
  - Nhận `value: unknown`. Tự động regex các chuỗi backend (`APPROVED`, `ACTIVE`, `PENDING_CHECKIN`, `BANNED`...) sang nhãn tiếng Việt và màu sắc tương ứng.
  - Được sử dụng rộng rãi trong các bảng điều phối bến bãi và quản trị.

### 2.3. Hộp Thoại (`Dialog` vs `Modal`)
- **Triển khai 1 (`src/shared/components/Workspace.tsx` - `Dialog`):**
  - Sử dụng thẻ HTML5 chuẩn `<dialog>` với `ref.current.showModal()`.
  - Tự động bẫy tiêu điểm (focus trap), phục hồi focus trước đó khi đóng, lắng nghe sự kiện hủy phím Escape. Cực kỳ tối ưu cho Accessibility.
- **Triển khai 2 (`src/shared/components/Modal.tsx` - `Modal`):**
  - Sử dụng `fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm`.
  - Quản lý cuộn trang qua `document.body.style.overflow = 'hidden'`.

### 2.4. Bảng Dữ Liệu (`DataTable` vs Custom Tables)
- **Shared `DataTable` (`Workspace.tsx`):**
  - Hỗ trợ tìm kiếm nhanh client-side trong mảng `rows`.
  - Phân trang đơn giản `Trước` / `Sau`.
  - Chưa hỗ trợ thuộc tính căn lề (`align?: 'left' | 'right' | 'center'`), dẫn đến các cột tiền tệ VND và thời gian bị canh trái toàn bộ.
- **Custom Tables trong features:**
  - `PaymentMasterTable` có thanh phân loại tag riêng và ô chọn checkbox.
  - `VehicleMasterTable` có cột hình ảnh kiểm định và menu hành động riêng.
  - `RecentCheckinManifestTable` có phong cách bảng điều khiển thời gian thực.

---

## 3. DANH SÁCH COMPONENT ĐƯỢC TÁI SỬ DỤNG TỐT & CẦN BẢO TỒN

1. **`Workspace.tsx`:** Là khung xương cốt lõi cho toàn bộ hơn 30 màn hình nghiệp vụ quản trị, giao dịch và vận hành bến bãi. Cần bảo tồn nguyên vẹn API giao tiếp, chỉ tinh chỉnh styling để hòa hợp với TasteSkill.
2. **`Select.tsx`:** Headless custom select với khả năng điều hướng bàn phím hoàn hảo.
3. **`QueryState.tsx`:** Component bọc TanStack Query tự động phân nhánh 3 trạng thái Loading / Error / Data cực kỳ mạch lạc.
4. **`ApiImage.tsx`:** Xử lý ảnh tải từ backend với fallback thông minh và ngăn chặn vỡ layout ảnh.
5. **Bộ Skeletons chuyên biệt:** `DashboardSkeleton`, `SearchParkingSkeleton`, `BookingsSkeleton`, `ChangePasswordSkeleton`... được thiết kế tỉ mỉ, giúp giảm tối đa Cumulative Layout Shift (CLS) khi nạp dữ liệu.
