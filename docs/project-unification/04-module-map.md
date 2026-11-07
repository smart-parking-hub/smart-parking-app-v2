# 04. Bản Đồ Phân Rã Module Chức Năng (Module Map)

> **Dự án:** Smart Parking Hub — Modern Logistics & Parking CRM Platform  
> **Chế độ thực thi:** DISCOVERY ONLY (Tuân thủ PROJECT UNIFICATION MASTER RULES)  
> **Thời điểm kiểm tra:** 07/11/2026  
> **Căn cứ xác minh:** Cấu trúc module thực tế tại `src/features/*`  
> **Trạng thái:** VERIFIED 100%

---

## 1. Tổng Quan Kiến Trúc Mô-đun Hệ Thống

Hệ thống Frontend Smart Parking Hub được module hóa theo 5 miền chức năng độc lập (Domain Boundaries), kết nối thông qua shared primitives và Redux/Query data pipelines:

```
┌────────────────────────────────────────────────────────────────────────┐
│ BẢN ĐỒ 5 MIỀN MODULE CHỨC NĂNG (FEATURE DOMAINS)                       │
├────────────────────────────────────────────────────────────────────────┤
│ 1. DOMAIN LANDING   ──> src/features/landing/     (9 Màn hình công khai)│
│ 2. DOMAIN AUTH      ──> src/features/auth/        (5 Màn hình định danh)│
│ 3. DOMAIN DRIVER    ──> src/features/driver/,     (14 Màn hình tài xế)  │
│                         bookings, parking-*,                            │
│                         queues, payments, vehicles...                   │
│ 4. DOMAIN MERCHANT  ──> src/features/merchant/    (16 Màn hình chủ bãi) │
│ 5. DOMAIN ADMIN     ──> src/features/admin/       (12 Màn hình quản trị)│
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Chi Tiết Từng Miền Module Chức Năng

### 2.1. Miền Module: `landing` (Public Marketing & Developer Documentation)
- **Vị trí thư mục:** `src/features/landing/`
- **Phạm vi trách nhiệm:** Cổng thông tin công khai, giới thiệu giải pháp theo đối tượng, truyền thông sản phẩm, niêm yết bảng giá, hướng dẫn tích hợp API và kênh tuyển dụng/hỗ trợ 24/7.
- **Danh sách màn hình phụ trách:**
  - `SCR-001` (`/` — LandingPage)
  - `SCR-002` (`/solutions/drivers` — DriverSolutionsPage)
  - `SCR-003` (`/solutions/owners` — OwnerSolutionsPage)
  - `SCR-004` (`/pricing` — PricingPage)
  - `SCR-005` (`/api-docs` — ApiDocsPage)
  - `SCR-006` (`/about` — AboutUsPage)
  - `SCR-007` (`/careers` — CareersPage)
  - `SCR-008` (`/insights` — InsightsPage)
  - `SCR-009` (`/contact` — ContactPage)
- **Thành phần cốt lõi:**
  - `LandingNavbar.tsx`, `LandingFooter.tsx`: Header cố định và footer đồng bộ thương hiệu.
  - `PricingComparisonTableSection.tsx`: Ma trận so sánh bảng giá hỗ trợ Card view di động (`md:hidden`) và table desktop (`hidden md:block`).
  - `CareersApplyModal.tsx` & `CareersFastApplySection.tsx`: Luồng ứng tuyển trực tiếp qua email có mã hóa tiêu đề và nộp đơn trực tuyến.
- **Phụ thuộc bên ngoài:** `lucide-react`, `globals.css` (tokens cam `#d95f00`, navy `#0F172A`).
- **Quy tắc bất biến:** Phải co giãn mượt mà trên iPhone SE (375px), không có thanh cuộn ngang toàn trang.

---

### 2.2. Miền Module: `auth` (Authentication & Access Control)
- **Vị trí thư mục:** `src/features/auth/`
- **Phạm vi trách nhiệm:** Xác thực người dùng, phân quyền RBAC, duy trì session token JWT, điều hướng đích sau đăng nhập và xử lý chặn lỗi 403/404.
- **Danh sách màn hình phụ trách:**
  - `SCR-010` (`/login` — LoginPage)
  - `SCR-011` (`/register` — AuthPage mode register)
  - `SCR-012` (`/forgot-password` — AuthPage mode forgot)
  - `SCR-013` (`/403` — AccessPage)
  - `404` (`*` — AccessPage mode notFound)
- **Thành phần cốt lõi:**
  - `LoginForm.tsx`: Form đăng nhập với Zod schema, bộ nút chọn nhanh Demo Accounts, focus-visible ring cam sắc nét và thuộc tính trợ năng `role="alert"`.
  - `RequireRole.tsx`: Guard router kiểm soát vai trò và token hết hạn.
  - `session.ts`: Trình phân tích JWT claims, tính toán `roleHome(role)`, quản lý sự kiện `smartparking:session`.
  - `authSlice.ts`: Redux slice lưu trữ trạng thái người dùng hiện tại.
- **Hợp đồng API Backend:** `POST /api/v1/auth/login`, `POST /api/v1/auth/register`, `POST /api/v1/auth/forgot-password`.
- **Quy tắc bất biến:** Không để lọt người dùng trái vai trò vào các tuyến nội bộ; khi 401 tự động dọn dẹp localStorage và điều hướng an toàn.

---

### 2.3. Miền Module: `driver` (Driver Operations & Booking Core)
- **Vị trí thư mục:** Phân rã theo các tính năng chuyên biệt:
  - `src/features/driver/` (Dashboard, KPI)
  - `src/features/parking-search/` (Tìm kiếm bãi đỗ GPS)
  - `src/features/parking-detail/` (Chi tiết bãi đỗ, giữ chỗ 10p)
  - `src/features/bookings/` (Danh sách vé đỗ QR)
  - `src/features/queues/` (Hàng đợi ảo)
  - `src/features/payments/` (Lịch sử thanh toán & hóa đơn VAT)
  - `src/features/vehicles/` (Quản lý đội xe)
  - `src/features/profile/` & `change-password/` (Hồ sơ & an ninh)
  - `src/features/payment-return/` & `payment-cancel/` (PayOS Hub)
  - `src/features/notifications/` (Thông báo & Web Push 24/7)
  - `src/features/disputes/` (Khiếu nại tài xế)
- **Danh sách màn hình phụ trách:**
  - `SCR-014` tới `SCR-025`, `DRV-DISP-01`, `DRV-DISP-02` (Tổng cộng 14 màn hình).
- **Thành phần cốt lõi:**
  - `SearchParkingPage.tsx`: Bản đồ Leaflet GPS định vị các bãi đỗ, tính toán khoảng cách và hiển thị slot trống realtime.
  - `ParkingDetailPage.tsx`: Bộ đếm ngược 10 phút giữ chỗ, liên kết PayOS cọc 20%.
  - `MyBookingsPage.tsx`: Hiển thị vé đỗ xe QR SVG/Canvas, hỗ trợ tải ảnh PNG và thanh toán nốt tiền cước.
  - `VirtualQueuesPage.tsx`: Cơ chế nhận slot trống tự động với modal xác nhận 5 phút.
  - `DriverPaymentsPage.tsx`: Xuất file CSV UTF-8 BOM, cấu hình hóa đơn VAT doanh nghiệp.
- **Hợp đồng API Backend:**
  - Booking Service: `/api/v1/bookings/**`, `/api/v1/queues/**`
  - Parking Lot Service: `/api/v1/parking-lots/**`
  - Payment Service: `/api/v1/payments/**`
  - Identity Service: `/api/v1/drivers/**`, `/api/v1/vehicles/**`
- **Quy tắc bất biến:** Mọi thao tác hủy vé, đặt chỗ phải kiểm soát trạng thái mạng; bảo vệ chống double-click khi thanh toán.

---

### 2.4. Miền Module: `merchant` (Merchant Facilities, Operations & Finance)
- **Vị trí thư mục:** `src/features/merchant/` (chia thành các thư mục con: `dashboard/`, `parking-lots/`, `slots/`, `operations/`, `profile/`)
- **Phạm vi trách nhiệm:** Quản lý cơ sở vật chất bến bãi, cấu hình sức chứa theo loại xe, ma trận đơn giá, vận hành cổng barie quét mã QR, đối soát doanh thu thực nhận và rút tiền về tài khoản ngân hàng.
- **Danh sách màn hình phụ trách:**
  - `SCR-026` tới `SCR-041` (Tổng cộng 16 màn hình).
- **Thành phần cốt lõi:**
  - `MerchantDashboardPage.tsx`: Biểu đồ doanh thu 65:35, camera giám sát ALPR trực tiếp.
  - `MerchantSlotsPage.tsx`: Khóa ràng buộc bất biến `Total Capacity >= Occupied Slots`, bộ điều khiển stepper `[+]` `[-]`, modal cảnh báo giảm slot.
  - `MerchantLotPage.tsx`: Cấu hình bảng giá theo lượt, qua đêm, theo tháng; cột số tiền được căn phải chuẩn xác.
  - `MerchantScannerPage.tsx`: Giao diện quét mã QR camera, nút mở barie thủ công và xác nhận thu tiền mặt.
  - `MerchantWithdrawalsPage.tsx`: Bẫy rút tiền ngăn chặn lệnh dưới 50.000 đ, các mốc chọn nhanh số tiền rút.
- **Hợp đồng API Backend:**
  - Parking Lot Service: `/api/v1/merchant/parking-lots/**`, `/api/v1/slots/**`, `/api/v1/pricing-rules/**`
  - Booking Service: `/api/v1/merchant/check-in/**`, `/api/v1/merchant/check-out/**`, `/api/v1/merchant/confirm-cash/**`
  - Payment Service: `/api/v1/merchant/revenue/**`, `/api/v1/withdrawals/**`
  - Identity Service: `/api/v1/merchant/profile/**`
- **Quy tắc bất biến:** Không cho phép giảm sức chứa bãi xe xuống thấp hơn số lượng xe đang thực tế đỗ trong bãi.

---

### 2.5. Miền Module: `admin` (Executive Command Center & System Governance)
- **Vị trí thư mục:** `src/features/admin/` kết hợp `src/features/portal/` và `src/features/disputes/`
- **Phạm vi trách nhiệm:** Giám sát vận hành toàn sàn, kiểm duyệt hồ sơ bãi đỗ xe mới, quản trị tài khoản người dùng và thi hành kỷ luật, quản lý sổ cái tài chính, bàn giải ngân cho chủ bãi, tòa trọng tài giải quyết khiếu nại và theo dõi nhật ký kiểm toán.
- **Danh sách màn hình phụ trách:**
  - `SCR-042` tới `SCR-053` (Tổng cộng 12 màn hình).
- **Thành phần cốt lõi:**
  - `AdminDashboardPage.tsx`: Thống kê tài chính toàn sàn, cảnh báo hồ sơ chờ duyệt.
  - `AdminLotDetailPage.tsx`: Thẩm định hồ sơ bãi đỗ: phê duyệt không cần nhập lý do (`TSK-P0-02`), từ chối hoặc yêu cầu bổ sung bắt buộc nhập lý do chi tiết.
  - `AdminUsersPage.tsx` & `AdminUserDetailPage.tsx`: Khóa tài khoản vi phạm (Ban User).
  - `AdminWithdrawalsPage.tsx`: Dialog xác nhận giải ngân hiển thị đầy đủ thông tin ngân hàng thụ hưởng (Tên ngân hàng, Số tài khoản che một phần, Chủ tài khoản, Số tiền) trước khi duyệt.
  - `DisputesPage.tsx` (`role="admin"`): Tòa trọng tài điều tra chứng từ và ban hành phán quyết bồi thường.
  - `AdminAuditLogsPage.tsx` & `AdminTransactionsPage.tsx`: Sổ cái và nhật ký kiểm toán có chế độ Card view cho di động.
- **Hợp đồng API Backend:**
  - Parking Lot Service: `/api/v1/admin/parking-lots/**`
  - Identity Service: `/api/v1/admin/users/**`, `/api/v1/admin/audit-logs/**`
  - Payment Service: `/api/v1/admin/dashboard/**`, `/api/v1/admin/transactions/**`, `/api/v1/admin/withdrawals/**`
  - Booking & Dispute Service: `/api/v1/disputes/**`
- **Quy tắc bất biến:** Mọi thao tác phê duyệt tài chính và kỷ luật người dùng đều phải ghi nhật ký kiểm toán và có hộp thoại xác nhận thứ cấp.
