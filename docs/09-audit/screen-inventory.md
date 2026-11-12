# Screen Inventory — Smart Parking CRM Hub v2

> Cập nhật 2026-11-04: 29 màn hình SCR còn thiếu (SCR-009–013 và SCR-030–053), 2 màn hình khiếu nại Driver, AI Copilot và trang 404 đã được bổ sung. Danh mục route, trạng thái tích hợp và giới hạn xác minh: [FE completion report](./fe-completion-report.md). Trạng thái mới là UI_IMPLEMENTED / API_WIRED / LIVE_BACKEND_ACCEPTANCE_PENDING; chưa thay thế nghiệm thu backend production.

| Screen ID | Tên Màn Hình                                        | Route                                     | Module                   | Nguồn Giao Diện                  | Trạng Thái      | Review Gate         |
| --------- | --------------------------------------------------- | ----------------------------------------- | ------------------------ | -------------------------------- | --------------- | ------------------- |
| `SCR-001` | Public Landing Page (Trang Chủ SmartTruckHub)       | `/`                                       | `features/landing`       | Stitch HTML/CSS (`web_standard`) | **IMPLEMENTED** | Đã nghiệm thu       |
| `SCR-002` | Driver Solutions Page (Trang Giải Pháp Tài Xế)      | `/solutions/drivers` · `/driver-solutions` · `/giai-phap-tai-xe` | `features/landing`       | Stitch HTML/CSS (`web_standard`) | **IMPLEMENTED** | Đã nghiệm thu       |
| `SCR-003` | Owner Solutions Page (Trang Giải Pháp Chủ Bãi)      | `/solutions/owners` · `/owner-solutions` · `/giai-phap-chu-bai` | `features/landing`       | Stitch HTML/CSS (`web_standard`) | **IMPLEMENTED** | Đã nghiệm thu       |
| `SCR-004` | Pricing Page (Trang Bảng Giá Niêm Yết)              | `/pricing` (`/bang-gia`)                  | `features/landing`       | Stitch HTML/CSS (`web_standard`) | **IMPLEMENTED** | Đã nghiệm thu       |
| `SCR-005` | API & Developer Docs (Trang Kết Nối API & Webhooks) | `/api-docs` (`/ket-noi-api`)              | `features/landing`       | Stitch HTML/CSS (`web_standard`) | **IMPLEMENTED** | Đã nghiệm thu       |
| `SCR-006` | About Us (Trang Về Chúng Tôi & Sứ Mệnh)             | `/about` (`/ve-chung-toi`)                | `features/landing`       | Stitch HTML/CSS (`web_standard`) | **IMPLEMENTED** | Đã nghiệm thu       |
| `SCR-007` | Careers & Recruitment (Trang Tuyển Dụng Nhân Tài)   | `/careers` (`/tuyen-dung`)                | `features/landing`       | Stitch HTML/CSS (`web_standard`) | **IMPLEMENTED** | Sẵn sàng nghiệm thu |
| `SCR-008` | Logistics Insights (Trang Tin Tức & Báo Cáo Chuyên Ngành) | `/insights` (`/tin-tuc`)            | `features/landing`       | Stitch HTML/CSS (`web_standard`) | **IMPLEMENTED** | Sẵn sàng nghiệm thu |
| `SCR-009` | Contact & Support 24/7 (Trang Liên Hệ & Điều Phối Bến Bãi) | `/contact` (`/lien-he`)            | `features/landing`       | Stitch HTML/CSS (`web_standard`) | **IMPLEMENTED** | Sẵn sàng nghiệm thu |
| `SCR-014` | Driver Dashboard Home (Tổng quan Tài xế)            | `/dashboard` (`/driver/dashboard`)        | `features/dashboard`     | Stitch HTML/CSS (`web_standard`) | **IMPLEMENTED** | Sẵn sàng nghiệm thu |
| `SCR-015` | Interactive Parking Search & Map (Bản đồ tìm bãi)   | `/parking` (`/dashboard/search`)          | `features/parking-search`| Stitch HTML/CSS (`web_standard`) | **IMPLEMENTED** | Sẵn sàng nghiệm thu |
| `SCR-016` | Parking Details & Reservation (Chi tiết bãi & Đặt chỗ) | `/parking/:id` (`/dashboard/parking/:id`) | `features/parking-detail`| Stitch HTML/CSS (`web_standard`) | **IMPLEMENTED** | Sẵn sàng nghiệm thu |
| `SCR-017` | Driver Bookings & QR Ticket (Quản lý đặt chỗ & Vé QR) | `/bookings` (`/dashboard/bookings`)       | `features/bookings`      | Stitch HTML/CSS (`web_standard`) | **IMPLEMENTED** | Sẵn sàng nghiệm thu |
| `SCR-018` | Virtual Queues (Hàng đợi ảo thông minh & Phân bổ slot) | `/queues` (`/dashboard/queues`)           | `features/queues`        | Stitch HTML/CSS (`web_standard`) | **IMPLEMENTED** | Sẵn sàng nghiệm thu |
| `SCR-019` | Driver Payment History & VAT Invoices (Lịch sử thanh toán & HĐĐT VAT) | `/payments` (`/dashboard/payments`) | `features/payments`      | Stitch HTML/CSS (`web_standard`) | **IMPLEMENTED** | Sẵn sàng nghiệm thu |
| `SCR-020` | Driver Vehicles Management & Fleet Operations (Quản lý phương tiện & Đồng bộ ALPR) | `/vehicles` (`/dashboard/vehicles`) | `features/vehicles`      | Stitch HTML/CSS (`web_standard`) | **IMPLEMENTED** | Sẵn sàng nghiệm thu |
| `SCR-021` | Driver Profile & eKYC Operations Workbench (Hồ sơ bác tài & Thông tin trực ban) | `/profile` (`/dashboard/profile`, `/driver/profile`) | `features/profile`       | Stitch HTML/CSS (`web_standard`) | **IMPLEMENTED** | Sẵn sàng nghiệm thu |
| `SCR-022` | Driver Change Password & Security Hub (Đổi mật khẩu bảo mật tài khoản) | `/change-password` (`/dashboard/change-password`) | `features/change-password` | Stitch HTML/CSS (`web_standard`) | **IMPLEMENTED** | Sẵn sàng nghiệm thu |
| `SCR-023` | PayOS Payment Success Callback Hub (Xác nhận & Đồng bộ kết quả thanh toán) | `/payment/success` | `features/payment-return` | Stitch HTML/CSS (`web_standard`) | **IMPLEMENTED** | Sẵn sàng nghiệm thu |
| `SCR-024` | PayOS Payment Cancel & Berth Preservation Hub (Thông báo hủy thanh toán & Bảo lưu slot) | `/payment/cancel` | `features/payment-cancel` | Stitch HTML/CSS (`web_standard`) | **IMPLEMENTED** | Sẵn sàng nghiệm thu |
| `SCR-025` | Driver Notifications Center (Trung tâm thông báo vận hành tài xế) | `/notifications` (`/dashboard/notifications`, `/driver/notifications`) | `features/notifications` (`re-exported as DriverNotificationsPage`) | Stitch UI + Real API Sprint 3 (`web_standard`) | **IMPLEMENTED** | Chuẩn hóa API-only, TanStack Query, RHF/Zod, 5 UI states; chờ nghiệm thu backend thực tế |
| `SCR-026` | Merchant Executive Dashboard (Bảng điều khiển tổng quan vận hành & Doanh thu chủ bãi) | `/merchant`, `/merchant/dashboard` | `features/merchant/dashboard` | Stitch HTML/CSS (`web_dashboard`) | **IMPLEMENTED** | Sẵn sàng nghiệm thu |
| `SCR-027` | Merchant Legal & Banking Profile (Hồ sơ pháp lý & Tài khoản nhận tiền chủ bãi) | `/merchant/profile` | `features/merchant/profile` | Stitch HTML/CSS (`web_dashboard`) | **IMPLEMENTED** | Sẵn sàng nghiệm thu |
| `SCR-028` | Merchant Parking Lots Directory (Danh mục bãi đỗ xe sở hữu) | `/merchant/parking-lots` | `features/merchant/parking-lots` | Stitch HTML/CSS (`web_dashboard`) | **IMPLEMENTED** | Sẵn sàng nghiệm thu |
| `SCR-029` | Merchant Create Parking Lot Wizard (Đăng ký bãi đỗ xe & depot mới) | `/merchant/parking-lots/new` | `features/merchant/parking-lots` | User-requested redesign 2026-11-07 | **IMPLEMENTED** | [Redesign verification](./scr-029-redesign-report.md): 10 component tests + 3 E2E pass; full-suite limitation recorded |
| `SCR-030` | Merchant Parking Lot Details & Telemetry (Chi tiết bãi đỗ xe & Hồ sơ kỹ thuật) | `/merchant/parking-lots/:parkingLotId` | `features/merchant/parking-lots` | Stitch HTML/CSS (`web_dashboard`) | **IMPLEMENTED** | Sẵn sàng nghiệm thu |
| `SCR-031` | Edit Merchant Parking Lot (Chỉnh sửa & Cập nhật hồ sơ bãi đỗ) | `/merchant/parking-lots/:parkingLotId/edit` | `features/merchant/parking-lots` | API bãi thực tế; yêu cầu bỏ dữ liệu mẫu (2026-11-07) | **IMPLEMENTED** | 16 component tests + 3 Edge E2E passed; chưa kiểm chứng lưu backend thật |

SCR-010 (2026-11-05): /login dùng LoginPage + AuthLayout riêng; Redux session sync, guest guard, role redirect, toast; 217 unit/component tests và 7 E2E PASS. Live backend acceptance pending. Xem [báo cáo](./scr-010-login-record.md).

SCR-012 (2026-11-08): `/forgot-password` dùng `ForgotPasswordPage` + `AuthLayout` (`variant="recovery"`) theo Stitch bản 1; quy trình 2 bước (gửi OTP qua `POST /api/v1/auth/forgot-password/otp` và đặt lại mật khẩu qua `POST /api/v1/auth/forgot-password/reset`), tách biệt TTL (`expiresInSeconds`) và cooldown (`resendAfterSeconds`), chống race condition và không lưu dữ liệu nhạy cảm. Chi tiết tại [tài liệu module auth](../05-modules/auth/scr-012-forgot-password.md).


## SCR-021 profile simplification — 2026-11-05

User-approved API-only redesign. Personal profile, one emergency contact and password operations preserved using verified users/me endpoints; unsupported demo fields removed. Readonly login phone matches backend behavior. See [current SCR-021 record](scr-021-driver-profile-record.md) for parity, tests and limitations.


### SCR-032 capacity correction — 2026-11-07

Selected-lot API data only; removed sample vehicle rows/telemetry/specifications, corrected held-capacity meaning, preserved capacity editing/save/confirmation/navigation. See [screen report](scr-032-capacity-data-redesign.md) for contract, parity and verification evidence.


### SCR-030 detail visual redesign — 2026-11-08

Real-data capacity summary/category bars, Vietnamese pricing cards, read-only location map and neutral gallery copy. Existing page actions/states preserved. See [screen report](scr-030-detail-redesign.md).

## Lot profile navigation — 2026-11-08
- Owner: frontend maintainers. Last verified: 2026-11-08.
- VERIFIED: SCR-030/032 and the pricing editor share `MerchantLotNavigation` in the parking-lot entity layer. It composes existing routes; no API or router definitions changed.
- Tổng quan shows the profile, images, capacity/location and current price summary. Cấu hình chỗ đỗ and Bảng giá open the existing editors; only the selected route's content renders. The active link uses aria-current and supports keyboard activation.
- Status-based configuration/edit visibility and the lot-specific QR scanner link are preserved. Narrow screens scroll the navigation horizontally without widening the page.
- Validation: typecheck, lint and build passed; complete Vitest suite: 48 files / 344 tests passed (existing tests emitted network stderr). Browser evidence and outcomes: see `lot-navigation-report.md`.

> 2026-11-08 — SCR-045: user-requested Admin navigation and responsive user-card redesign. [Implementation and verification](./admin-users-navigation-redesign.md). Scoped Admin/layout: 57 tests pass; responsive browser: 3 pass. Repository-wide acceptance remains open.


> 2026-11-08: Driver/merchant map presentation updated with depot markers and outlined routes. Capability parity and verification: [map presentation report](./map-presentation-2026-11-08.md).

## SCR-025 — Driver Operational Notifications Center (`SP-S3-UI-06`) — 2026-11-11

- **Routes & Layout:** `/notifications`, `/dashboard/notifications`, `/driver/notifications` wrapped in `DriverLayout` (`RequireRole role="DRIVER"`). `DriverHeader` Bell links to `/notifications` with live badge from `GET /api/v1/notifications/unread-count`.
- **Architecture (4-Layer FSD & Workspace Inbox Redesign):**
  - Layer 1 (`src/shared/components/`): Reused `Workspace`, `Modal`, `Badge`, `Button`, `Skeleton`, `EmptyState`, `ErrorState`, `Alert`, `Toast`, `Pagination`, `SearchField`.
  - Layer 2 (`src/entities/notification/`): Extracted `BackendNotificationDto`, `NotificationViewModel`, `normalizeNotificationType`, `parseNotificationDate` (ISO + Jackson arrays), `formatNotificationTime`, strict conditional `resolveNotificationAction`, and `NotificationTypeBadge`.
  - Layer 3 (`src/features/notifications/` + re-export `DriverNotificationsPage` in `src/features/driver/`): Uses `Workspace` flat header + light segmented filter bar matching Disputes/Queues (`NotificationsFilterBar` + RHF/Zod + `useNotificationStore`), Gmail-style compact rows (`NotificationRowItem`) inside single-column inbox, and click-to-open `NotificationDetailModal` with auto mark-read and conditional entity CTA; removed Profile/QuickNav sidebars, hero card wrapper, `ProfileSidebarNav` notifications tab, `NotificationSettingsModal`, and dummy Web Push/VAT/KPI widgets.
- **Verification Scope & Limitation:** Verified against `NotificationController` & `NotificationDto` contracts via TypeScript (`tsc --noEmit`), strict ESLint on touched files, Vitest unit/integration suites, and Vite production build; live end-to-end verification against running backend services remains pending.

## SCR-034 / SCR-035 — Quản lý Lịch sử & Đơn Đặt chỗ Khách hàng (`SP-S3-UI-13`) — 2026-11-12

- **Routes & RBAC Guard:** `/merchant/bookings` (`SCR-034`) and `/merchant/bookings/:id` (`SCR-035`) inside `MerchantLayout` protected by `RequireRole role="MERCHANT"`; inbound/outbound links connect to `/merchant/qr-scanner` (`SCR-036`) and support `?parkingLotId=` query parameter filtering.
- **Architecture (4-Layer Feature Structure + Compact Table + Full-Detail Modal):**
  - Layer 1 (`src/shared/components/`): Extended `Badge.tsx` dictionary/styles with `AWAITING_FINAL_PAYMENT`, `EXPIRED`, `REVIEWED`; reused `Workspace`, `Table`, `Modal`, `Pagination`, `SearchField`, `Skeleton`, `EmptyState`, `ErrorState`, `Alert`, `Toast`, `Metrics`.
  - Layer 2 (`src/entities/operations.ts`): Expanded `Booking` interface to cover all verified `BookingDto.java` fields (`hourlyRate`, `surgeMultiplier`, `surgeStartTime`, `surgeEndTime`, `overtimePenaltyMultiplier`, cancellation/refund fields, ISO/array `ApiDateTimeValue`, `vehicleLicensePlate`/`vehiclePlate`, optional driver contact fields).
  - Layer 3 (`src/features/merchant/bookings/` + re-exports in `src/features/merchant/operations/BookingsPages.tsx`):
    - UI Store (`useSyncExternalStore` selector store `useMerchantBookingsStore` — `zustand` is not installed in `package.json`, `DEFAULT_MERCHANT_BOOKINGS_PAGE_SIZE = 5`), React Hook Form + Zod (`merchantBookingsFilterSchema`, max 100 chars), TanStack Query (`useMerchantBookingsListQuery`, `useMerchantBookingsSummaryQuery`, `useMerchantBookingDetailQuery`, `useMerchantBookingLotsFilterQuery`).
    - Compact layout, Custom `<Select>` & Cross-Lot Counts: `MerchantBookingsMetrics` matches `/merchant/dashboard` card styling (4 uniform clean white bordered cards); `MerchantBookingsFilterBar` places `SearchField` + 2 shared custom `<Select>` dropdowns (`@/shared/components/Select`) above the status tabs, while tab badges count across all records matching the active lot/search filter (`totalElements` / `summaryQuery`) instead of the 5-row page limit; `MerchantBookingsFilterBar`, `MerchantBookingsTable` (7 core columns, max 5 rows per page), `EmptyState`, and `MerchantBookingsPagination` reside inside a unified `<div>` container (`merchant-bookings-panel` inside `merchant-bookings-container`); full details live in `MerchantBookingDetailModal`.
- **Verification Scope & Limitation:** Verified against `MerchantCheckInOutController.java`, `BookingServiceImpl.java`, and `BookingDto.java` via `tsc --noEmit`, ESLint (`--max-warnings=0`), Vitest suites (`MerchantBookingsPage.test.tsx`, `operations.test.tsx`, `Batch14EMerchantGateFinanceIntegration.test.tsx`), and Vite build; live E2E against running Spring Boot services remains pending.
