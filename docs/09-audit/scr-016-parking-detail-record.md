# Screen Implementation Record: SCR-016 Parking Details & Reservation

- Screen: `SCR-016 Parking Details & Instant Physical Reservation (Chi tiết bãi đỗ xe & Đặt giữ chỗ thông minh ALPR)`
- Screen Code: `SCR-016 (SP-S2-FE-016)`
- Story Points: `8 STP (Sprint 02, P0 - Critical)`
- Route: `/dashboard/parking/:id` (alias: `/parking/:id`, `/driver/parking/:id`)
- Owning feature: `features/parking-detail` & `features/driver` (Kiến trúc 4 lớp)
- Stitch source supplied: Yes (`SmartTruckHub Driver Ops - Parking Facility Dossier & Physical Reservation` HTML/CSS)
- Source complete: Yes
- Target viewports: Desktop (1280px+), Tablet (768px-1024px), Mobile (375px-767px)
- Roles (verified only): `ROLE_DRIVER`
- Layout: `DriverLayout` (Bảo toàn RBAC Guard `RequireRole role="DRIVER"`)
- Git branch: `feat/scr-016-driver-parking-detail`
- Status: **READY_FOR_REVIEW**

## Visual specification
| Area | Stitch observation | Implementation location | Status |
|---|---|---|---|
| Layout | Asymmetric grid 12 cols (65% Facility Dossier / 35% Sticky Reservation Desk) | `ParkingDetailPage.tsx` | Verified |
| Top Nav | Quay lại bản đồ tìm bãi `/dashboard/search` (SCR-015) + Realtime pulse status chip | `ParkingDetailPage.tsx` | Verified |
| Facility Header | Verified yard badge, code VN-SGN-CLG2-09, title, address, 4.9 rating, hotline, 4.8m 60T clearance | `FacilityHeaderSection.tsx` | Verified |
| Inspection Gallery | 3 ảnh kiến trúc hạ tầng (ALPR 0.2s, Bê tông 60T, Trạm Reefer 380V) kèm gradient overlays | `PhotoGallerySection.tsx` | Verified |
| Capacity Matrix | Live slot capacity matrix 5 loại xe (Container 40/45FT 85% mật độ, xe tải nặng, trung, nhỏ, xe con) | `SlotCapacityMatrixSection.tsx` | Verified |
| Transparent Pricing | Bảng biểu phí 5 dòng, highlight Container, ghi chú cọc giữ chỗ 20% hoàn 100% | `PricingRulesTableSection.tsx` | Verified |
| Amenities Checklist | 8 thẻ tiện ích bến bãi (Bảo vệ 24/7, Camera AI, ALPR, Phòng tắm nóng, Phòng nghỉ máy lạnh, Reefer, Cân 100T, Quán cơm) | `AmenitiesChecklistSection.tsx` | Verified |
| Community Reviews | 3 review bác tài thực tế kèm avatar chữ cái, tuyến đường, biển số đã kiểm định và 5 sao | `DriverReviewsSection.tsx` | Verified |
| Sticky Desk | Countdown timer 10:00 đếm lùi, chọn thời gian đỗ, ledger tài chính minh bạch cọc 20%, CTA đặt chỗ, link hàng đợi ảo | `StickyReservationDesk.tsx` | Verified |
| GAP-05 Booking Modal | Modal 2 bước `BookingFlowModal (SCR-MOD-07)`: Bước 1 cấu hình & Hold TTL 10p, Bước 2 VietQR PayOS cọc 20%, mở barie ALPR | `BookingPaymentModal.tsx` | Verified |
| UI States | Loading Skeleton, Empty State (`ParkingDetailEmptyState`), Error Alert (`ParkingDetailErrorState`), Validation Error | `components/` | Verified |
| State & Schema | Zod form validation `reservationSchema.ts`, Zustand/SyncExternalStore `parkingDetailStore.ts` | `schemas/`, `store/` | Verified |

## Verification
- [x] Typecheck: `npm run typecheck` (`tsc --noEmit`) -> 0 Errors
- [x] Lint: `npm run lint` (`eslint .`) -> 0 Errors, 0 Warnings
- [x] Unit/component tests: `npm run test` (`vitest run src/features/parking-detail`) -> 18/18 Tests Passed (100% across 2 suites)
- [x] Build: `npm run build` (`tsc -b && vite build`) -> Built successfully in 17.34s
- [x] Layout integrity: Kế thừa `DriverLayout` chuẩn mực, đồng bộ header/footer
- [x] Git branch: Cô lập hoàn toàn trên nhánh độc lập `feat/scr-016-driver-parking-detail`
