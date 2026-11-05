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
| `SCR-025` | Driver Notifications Center (Trung tâm thông báo & Nhật ký tác vụ) | `/notifications` | `features/notifications` | Stitch HTML/CSS (`web_standard`) | **IMPLEMENTED** | Sẵn sàng nghiệm thu |
| `SCR-026` | Merchant Executive Dashboard (Bảng điều khiển tổng quan vận hành & Doanh thu chủ bãi) | `/merchant`, `/merchant/dashboard` | `features/merchant/dashboard` | Stitch HTML/CSS (`web_dashboard`) | **IMPLEMENTED** | Sẵn sàng nghiệm thu |
| `SCR-027` | Merchant Legal & Banking Profile (Hồ sơ pháp lý & Tài khoản nhận tiền chủ bãi) | `/merchant/profile` | `features/merchant/profile` | Stitch HTML/CSS (`web_dashboard`) | **IMPLEMENTED** | Sẵn sàng nghiệm thu |
| `SCR-028` | Merchant Parking Lots Directory (Danh mục bãi đỗ xe sở hữu) | `/merchant/parking-lots` | `features/merchant/parking-lots` | Stitch HTML/CSS (`web_dashboard`) | **IMPLEMENTED** | Sẵn sàng nghiệm thu |
| `SCR-029` | Merchant Create Parking Lot Wizard (Đăng ký bãi đỗ xe & depot mới) | `/merchant/parking-lots/new` | `features/merchant/parking-lots` | Stitch HTML/CSS (`web_dashboard`) | **IMPLEMENTED** | Sẵn sàng nghiệm thu |
| `SCR-030` | Merchant Parking Lot Details & Telemetry (Chi tiết bãi đỗ xe & Hồ sơ kỹ thuật) | `/merchant/parking-lots/:parkingLotId` | `features/merchant/parking-lots` | Stitch HTML/CSS (`web_dashboard`) | **IMPLEMENTED** | Sẵn sàng nghiệm thu |
| `SCR-031` | Edit Merchant Parking Lot (Chỉnh sửa & Cập nhật hồ sơ bãi đỗ) | `/merchant/parking-lots/:parkingLotId/edit` | `features/merchant/parking-lots` | Stitch HTML/CSS (`web_dashboard`) | **IMPLEMENTED** | Sẵn sàng nghiệm thu |

SCR-010 (2026-11-05): /login dùng LoginPage + AuthLayout riêng; Redux session sync, guest guard, role redirect, toast; 217 unit/component tests và 7 E2E PASS. Live backend acceptance pending. Xem [báo cáo](./scr-010-login-record.md).


## SCR-021 profile simplification — 2026-11-05

User-approved API-only redesign. Personal profile, one emergency contact and password operations preserved using verified users/me endpoints; unsupported demo fields removed. Readonly login phone matches backend behavior. See [current SCR-021 record](scr-021-driver-profile-record.md) for parity, tests and limitations.
