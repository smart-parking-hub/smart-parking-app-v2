# Screen Implementation Record: SCR-016 Parking Details & Reservation

- Screen: `SCR-016 Parking Details & Instant Physical Reservation (Chi tiết bãi đỗ xe & Đặt giữ chỗ thông minh ALPR)`
- Route: `/parking/:id`, `/dashboard/parking/:id`
- Owning feature: `features/parking-detail`
- Stitch source supplied: Yes (`SmartTruckHub Driver Ops - Parking Facility Dossier & Physical Reservation` HTML/CSS)
- Source complete: Yes
- Target viewports: Desktop (1280px+), Tablet (768px-1024px), Mobile (375px-767px)
- Roles (verified only): `ROLE_DRIVER`
- Layout: `DriverLayout` (Đã chuẩn hóa: không hotline điều phối, không badge "TRỰC TUYẾN")
- Git branch: `feat/scr-16-parking-detail`
- Status: **READY_FOR_REVIEW**

## Visual specification
| Area | Stitch observation | Implementation location | Status |
|---|---|---|---|
| Layout | Asymmetric grid 12 cols (65% Facility Dossier / 35% Sticky Reservation Desk) | `ParkingDetailPage.tsx` | Verified |
| Top Nav | Quay lại bản đồ tìm bãi `/parking` + Realtime pulse status chip | `ParkingDetailPage.tsx` | Verified |
| Facility Header | Verified yard badge, code VN-SGN-CLG2-09, title, address, 4.9 rating, hotline, 4.8m 60T clearance | `FacilityHeaderSection.tsx` | Verified |
| Inspection Gallery | 3 ảnh kiến trúc hạ tầng (ALPR 0.2s, Bê tông 60T, Trạm Reefer 380V) kèm gradient overlays | `PhotoGallerySection.tsx` | Verified |
| Capacity Matrix | Live slot capacity matrix 5 loại xe (Container 40/45FT 85% mật độ, xe tải nặng, trung, nhỏ, xe con) | `SlotCapacityMatrixSection.tsx` | Verified |
| Transparent Pricing | Bảng biểu phí 5 dòng, highlight Container, ghi chú cọc giữ chỗ 100k hoàn 100% | `PricingRulesTableSection.tsx` | Verified |
| Amenities Checklist | 8 thẻ tiện ích bến bãi (Bảo vệ 24/7, Camera AI, ALPR, Phòng tắm nóng, Phòng nghỉ máy lạnh, Reefer, Cân 100T, Quán cơm) | `AmenitiesChecklistSection.tsx` | Verified |
| Community Reviews | 3 review bác tài thực tế kèm avatar chữ cái, tuyến đường, biển số đã kiểm định và 5 sao | `DriverReviewsSection.tsx` | Verified |
| Sticky Desk | Countdown timer 10:00 đếm lùi, chọn xe 51D-894.12, giờ vào, ledger tài chính minh bạch, CTA đặt chỗ, link hàng đợi ảo | `StickyReservationDesk.tsx` | Verified |
| Booking Modal | Modal xác nhận cọc slot 10p, trừ ví SmartTruck Pay / Doanh nghiệp Post-Paid, loading spinner và thông báo mở barie | `BookingPaymentModal.tsx` | Verified |

## Verification
- [x] Typecheck: `npm run typecheck` (`tsc --noEmit`) -> 0 Errors
- [x] Lint: `npm run lint` (`eslint .`) -> 0 Errors, 0 Warnings
- [x] Unit/component tests: `npm run test` (`vitest run`) -> 23/23 Tests Passed (100% across all 4 test suites)
- [x] Build: `npm run build` (`tsc -b && vite build`) -> Built successfully
- [x] Layout integrity: Kế thừa `DriverLayout` chuẩn mực, đồng bộ header/footer
- [x] Git branch: Cô lập hoàn toàn trên nhánh độc lập `feat/scr-16-parking-detail`
