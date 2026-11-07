# Screen Implementation Record: SCR-018 Virtual Queues

- Screen: `SCR-018 Virtual Queues (Hàng Đợi Ảo Thông Minh & Phân Bổ Slot Tự Động)`
- Route: `/queues`, `/dashboard/queues`, `/driver/queues`
- Owning feature: `features/queues`
- Stitch source supplied: Yes (`SmartTruckHub Driver Ops - Virtual Queues` HTML/CSS)
- Source complete: Yes
- Target viewports: Desktop (1280px+), Tablet (768px-1024px), Mobile (375px-767px)
- Roles (verified only): `ROLE_DRIVER`
- Layout: `DriverLayout` (Chuẩn hóa: đồng bộ header điều hướng, liên kết Hàng đợi ảo)
- Git branch: `feat/scr-18-virtual-queues`
- Status: **READY_FOR_REVIEW**

## Visual specification
| Area | Stitch observation | Implementation location | Status |
|---|---|---|---|
| Command Toolbar | Eyebrow "Hệ thống điều phối hàng đợi thông minh", Title, 2 Segmented Tabs (Active/History) có count badges, Radar chip, Quick CTA | `QueueCommandToolbar.tsx` | Verified |
| Active Queue Card | Card động hỗ trợ 2 trạng thái: `NOTIFIED` (banner gradient xanh ngọc, đồng hồ đếm ngược 15p giữ slot, progress bar, slot & berth assignment) và `WAITING` (banner xanh navy, số thứ tự, số xe phía trước) | `ActiveQueueCard.tsx` | Verified |
| ALPR Timeline Flow | Quy trình 3 bước trực quan biểu diễn xe xuất bãi trước, xe vào cổng tiếp theo và vị trí xe của tài xế | `QueueTimelineFlow.tsx` | Verified |
| Facility & Vehicle Dossier | Tên bãi, địa chỉ, làn barie kiểm soát, ô đỗ chỉ định (Berth), nhãn ưu tiên Reefer 380V, biển số xe, khoảng cách GPS & ETA, radar geofence 5km | `ActiveQueueCard.tsx` | Verified |
| Queue History Table | Bảng lịch sử các lượt xếp hàng: mã VQ, bãi xe, biển số, vị trí ban đầu, thời gian chờ, badge trạng thái (CONVERTED xanh, CANCELLED xám, EXPIRED đỏ), liên kết vé QR | `QueueHistoryTable.tsx` | Verified |
| Operational Regulations | 4 Bento cards giải thích điều khoản vận hành: FIFO ALPR, Cửa sổ giữ slot 15p, Geofence Radar 5km, Giới hạn 1 hàng đợi hoạt động | `QueueRegulationsSection.tsx` | Verified |
| Leave Queue Modal | Hộp thoại cảnh báo rủi ro mất thứ tự trước khi hủy lượt xếp hàng | `LeaveQueueConfirmModal.tsx` | Verified |
| Accept Slot Success Modal | Hộp thoại thông báo nhận slot thành công, cấp mã Booking BK-2026-9081 và nút chuyển hướng sang vé QR | `AcceptQueueSuccessModal.tsx` | Verified |
| Loading Skeleton | Shimmer animation đồng bộ cấu trúc trang | `QueueSkeleton.tsx` | Verified |

## Component Reusability & Placement Assessment
| Component | Classification | Destination Directory | Rationale |
|---|---|---|---|
| `QueueCommandToolbar` | Feature-specific | `src/features/queues/components/` | Điều khiển phân đoạn tab và telemetry riêng cho hàng đợi ảo |
| `ActiveQueueCard` | Feature-specific | `src/features/queues/components/` | Hiển thị chi tiết phiên xếp hàng hoạt động, đếm ngược 15p và thao tác nhận/từ chối |
| `QueueTimelineFlow` | Feature-specific | `src/features/queues/components/` | Trực quan hóa dòng xe ALPR trong hàng đợi |
| `QueueHistoryTable` | Feature-specific | `src/features/queues/components/` | Bảng quản lý và tra cứu lịch sử hàng đợi |
| `QueueRegulationsSection` | Feature-specific | `src/features/queues/components/` | 4 điều khoản vận hành hàng đợi dạng bento grid |
| `LeaveQueueConfirmModal` | Feature-specific | `src/features/queues/components/` | Modal xác nhận hủy lượt xếp hàng |
| `AcceptQueueSuccessModal` | Feature-specific | `src/features/queues/components/` | Modal xác nhận nhận slot và điều hướng sang đặt chỗ |
| `QueueSkeleton` | Feature-specific | `src/features/queues/components/` | Loading placeholder cho module queues |

## Verification Gate (100% Zero-Error & Zero-Warning)
- [x] Typecheck: `npm run typecheck` (`tsc --noEmit`) -> **0 Errors**
- [x] Lint: `npm run lint` (`eslint .`) -> **0 Errors, 0 Warnings**
- [x] Unit/component tests: `npm run test` (`vitest run`) -> **42/42 Tests Passed (100% across all 6 test suites)**
- [x] Build: `npm run build` (`tsc -b && vite build`) -> **Built successfully in 7.28s**
- [x] Layout integrity: Kế thừa `DriverLayout`, hiển thị active state trên header tại `/queues`
- [x] Git branch: Cô lập hoàn toàn trên nhánh `feat/scr-18-virtual-queues`
