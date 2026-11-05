# Screen Implementation Record: SCR-017 Driver Bookings & QR Ticket

- Screen: `SCR-017 Driver Bookings & QR Ticket (Quản lý danh sách đặt chỗ & Vé đỗ xe điện tử QR)`
- Screen Code: `SCR-017 (SP-S2-FE-017)`
- Story Points: `5 STP (Sprint 02, P0 - Critical)`
- Route: `/bookings` (Aliases: `/dashboard/bookings`, `/driver/bookings`)
- Owning feature: `features/bookings` & `features/driver` (Kiến trúc 4 lớp)
- Stitch source supplied: Yes (`SmartTruckHub Driver Ops - Driver Bookings & QR Ticket` HTML/CSS)
- Source complete: Yes
- Target viewports: Desktop (1280px+), Tablet (768px-1024px), Mobile (375px-767px)
- Roles (verified only): `ROLE_DRIVER`
- Layout: `DriverLayout` (Kế thừa header điều hướng, footer và AI Copilot, RBAC Guard `RequireRole role="DRIVER"`)
- Git branch: `feat/scr-017-driver-bookings`
- Status: **READY_FOR_REVIEW**

## Visual specification
| Area | Stitch observation | Implementation location | Status |
|---|---|---|---|
| Layout | Master-Detail 2-Column Workspace (38% Master List / 62% Detail View) | `MyBookingsPage.tsx` | Verified |
| Top Command Toolbar | Eyebrow, Title, 2 Telemetry Chips (ALPR 100% ONLINE, Biển số 51D-894.12), 5 Segmented tabs, Search input | `BookingsCommandToolbar.tsx` | Verified |
| Master List | Thẻ booking với tag trạng thái, mã BK, bãi xe, biển số, thời gian, cọc, countdown 10p, nút Quét Cọc | `BookingCardItem.tsx`, `BookingMasterList.tsx` | Verified |
| Detail Header Card | Mã BK lớn, badge VÉ ĐANG ĐỖ HỢP LỆ, metadata check-in ALPR, nút tải vé QR PNG & xuất hóa đơn VAT | `BookingDetailHeader.tsx` | Verified |
| Operational Stepper | 4-step bento stepper (Khóa slot 10p -> Cọc PayOS & QR -> Đang đỗ thực tế -> Tất toán xuất bãi) | `BookingBentoStepper.tsx` | Verified |
| Central QR Terminal | Mã QR vector SVG 180x180 kèm logo STH, token code STH-9081, ghi nhận biển số ALPR, chỉ định làn barie | `BookingQrTerminalPanel.tsx` | Verified |
| Tariff Audit Table | Bảng kê đối soát chi tiết: giá cơ bản, thời gian đỗ, phụ phí Reefer 380V, khấu trừ cọc 100k, tổng tiền thanh toán | `TariffAuditTable.tsx` | Verified |
| Terminal Commands | CTA PayOS VietQR, trả tiền mặt tại cổng, chỉ đường Maps tới cổng, gọi trực ban bãi 24/7, link ví SCR-019 | `BookingActionCommands.tsx` | Verified |
| Cancel Modal | Modal hủy đặt chỗ kiểm tra hoàn cọc trước 60p (SCR-MOD-03) với Zod validation | `CancelBookingModal.tsx` | Verified |
| Review Modal | Modal đánh giá 1-5 sao chất lượng bãi đỗ xe (SCR-MOD-02) với Zod validation | `ReviewBookingModal.tsx` | Verified |
| PayOS Checkout Modal | Hộp thoại thanh toán cọc & quyết toán cuối PayOS VietQR kèm loading và xác nhận giao dịch | `PayOsCheckoutModal.tsx` | Verified |
| QR Image Export | Xuất mã QR SVG sang file PNG tải về máy không dùng thư viện ngoài | `qrExportUtil.ts` | Verified |
| UI States | Loading Skeleton (`BookingsSkeleton`), Empty State (`BookingsEmptyState`), Error Alert (`BookingsErrorState`), Success Toast | `components/` | Verified |
| State & Schema | Zod form validation `bookingSchemas.ts`, Zustand reactive UI state store `bookingStore.ts` | `schemas/`, `store/` | Verified |

## Verification
- [x] Typecheck: `npm run typecheck` (`tsc --noEmit`) -> 0 Errors
- [x] Lint: `npm run lint` (`eslint .`) -> 0 Errors, 0 Warnings
- [x] Unit/component tests: `npm run test` (`vitest run src/features/bookings`) -> 25/25 Tests Passed (100% across 2 suites)
- [x] Build: `npm run build` (`tsc -b && vite build`) -> Built successfully
- [x] Layout integrity: Kế thừa `DriverLayout` chuẩn mực, đồng bộ header/footer
- [x] Git branch: Cô lập hoàn toàn trên nhánh độc lập `feat/scr-017-driver-bookings`
