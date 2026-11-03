# Capability Parity Matrix — 4 Landing Screens: Trang Chủ, Tài Xế, Chủ Bãi & Bảng Giá

> Phiên bản thiết kế: Stitch HTML `web_standard`  
> Module: `src/features/landing`  
> Subfolders: `components/home/`, `components/driver-solutions/`, `components/owner-solutions/`, `components/pricing/`, `components/common/`  
> Routes: `/` (Trang Chủ), `/driver-solutions` (Tài Xế), `/owner-solutions` (Chủ Bãi), `/pricing` (Bảng Giá)  
> Kiểm thử: Typecheck (0 error), Lint (0 warning, 0 error), Vitest (4/4 pass 100%), Build (Pass)

---

## 1. Màn Hình SCR-001: Trang Chủ (Home Landing Page — Route `/`)

| Khối Giao Diện Stitch | Thành Phần React 19 (`smart-parking-app-v2`) | API / Quyền hạn | Trạng thái Parity |
|---|---|---|---|
| Sticky Navbar | [`LandingNavbar.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/landing/components/common/LandingNavbar.tsx) | Public | **Preserved (Full Match)** |
| 1. Hero Section ("Sự Kết Tinh Giữa Công Nghệ Và Bãi Đỗ Xe Tải") | [`HomeHeroSection.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/landing/components/home/HomeHeroSection.tsx) | Public | **Preserved (Full Match)** |
| 2. Metrics Banner (4 cột số liệu 20K+, 320+ bãi, 99.8% SLA, 24/7 điều phối) | [`LandingMetricsBanner.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/landing/components/home/LandingMetricsBanner.tsx) | Public | **Preserved (Full Match)** |
| 3. Danh Mục Dịch Vụ Chuyên Dụng (4 nhóm bãi container, xe tải nặng, trạm nghỉ, AI gate) | [`LandingServicesGrid.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/landing/components/home/LandingServicesGrid.tsx) | Public | **Preserved (Full Match)** |
| 4. Why Us Bento ("Được Thiết Kế Cho Doanh Nghiệp Không Thể Chấp Nhận Rủi Ro") | [`LandingWhyUsBento.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/landing/components/home/LandingWhyUsBento.tsx) | Public | **Preserved (Full Match)** |
| 5. Quy Trình 4 Bước Đơn Giản (Tìm bãi, Quét QR, Lưu bãi, Xuất bãi) | [`LandingHowItWorks.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/landing/components/home/LandingHowItWorks.tsx) | Public | **Preserved (Full Match)** |
| 6. Biểu Phí Niêm Yết Minh Bạch (Bảng so sánh 4 phân khúc phương tiện) | [`LandingPricingMatrix.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/landing/components/home/LandingPricingMatrix.tsx) | Public | **Preserved (Full Match)** |
| 7. Bảo Chứng Khách Hàng (3 Review Đông Đô, Cường Phát, Lê Minh Hùng) | [`HomeTestimonials.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/landing/components/home/HomeTestimonials.tsx) | Public | **Preserved (Full Match)** |
| 8. Final Conversion Banner ("Sẵn Sàng Số Hóa Điểm Đỗ Xe Tải") | [`HomeConversionCta.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/landing/components/home/HomeConversionCta.tsx) | Public | **Preserved (Full Match)** |
| 4-Column Footer & Pháp Lý | [`LandingFooter.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/landing/components/common/LandingFooter.tsx) | Public | **Preserved (Full Match)** |

---

## 2. Màn Hình SCR-001B: Trang Giải Pháp Tài Xế (Driver Solutions Page — Route `/driver-solutions`)

| Khối Giao Diện Stitch | Thành Phần React 19 (`smart-parking-app-v2`) | API / Quyền hạn | Trạng thái Parity |
|---|---|---|---|
| Sticky Navbar (Đồng bộ điều hướng 4 trang) | [`LandingNavbar.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/landing/components/common/LandingNavbar.tsx) | Public | **Preserved (Full Match)** |
| 1. Hero Thực Địa ("Lộ Trình Chủ Động. Không Còn Cảnh Đậu Tràn Lề Đường Chờ Lốt") | [`DriverHeroSection.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/landing/components/driver-solutions/DriverHeroSection.tsx) | Public | **Preserved (Full Match)** |
| 2. 4 Nỗi Lo vs Giải Pháp (Bị phạt dừng đỗ, Rút trộm dầu/hàng, Nghỉ ngơi tạm bợ, Chặt chém vé) | [`LandingPainPointsSection.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/landing/components/driver-solutions/LandingPainPointsSection.tsx) | Public | **Preserved (Full Match)** |
| 3. Quy Trình Vận Hành Thực Tế (Nhịp 01-02-03-04 tinh gọn từ đường cao tốc tới mở barie 0.2s) | [`DriverWorkflowSection.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/landing/components/driver-solutions/DriverWorkflowSection.tsx) | Public | **Preserved (Full Match)** |
| 4. Bộ Lọc Tiện Ích Xe Nặng (Interactive Tab 5 tiện ích + Live Card Cát Lái Gate 2) | [`LandingAmenityFilterSection.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/landing/components/driver-solutions/LandingAmenityFilterSection.tsx) | Public | **Preserved (Interactive)** |
| 5. Tiếng Nói Từ Cộng Đồng Bác Tài (3 Review Bác tài Bắc - Nam, Container lạnh, Hàng nặng) | [`DriverTestimonialsSection.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/landing/components/driver-solutions/DriverTestimonialsSection.tsx) | Public | **Preserved (Full Match)** |
| 6. Final Driver CTA Banner ("Lái Xe An Tâm Hơn Trên Mọi Chặng Đường. Bắt Đầu Ngay Hôm Nay.") | [`DriverConversionCta.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/landing/components/driver-solutions/DriverConversionCta.tsx) | Public | **Preserved (Full Match)** |
| 4-Column Footer & Pháp Lý | [`LandingFooter.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/landing/components/common/LandingFooter.tsx) | Public | **Preserved (Full Match)** |

---

## 3. Màn Hình SCR-001C: Trang Giải Pháp Chủ Bãi (Owner Solutions Page — Route `/owner-solutions`)

| Khối Giao Diện Stitch | Thành Phần React 19 (`smart-parking-app-v2`) | API / Quyền hạn | Trạng thái Parity |
|---|---|---|---|
| Sticky Navbar (Đồng bộ nhãn & nút Hợp tác bãi đỗ) | [`LandingNavbar.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/landing/components/common/LandingNavbar.tsx) | Public | **Preserved (Full Match)** |
| 1. Hero Cảng Biển & ICD ("Chuyển Đổi Số Bến Bãi. Tối Đa Lợi Nhuận Từng Mét Vuông Mặt Bằng.") | [`OwnerHeroSection.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/landing/components/owner-solutions/OwnerHeroSection.tsx) | Public | **Preserved (Full Match)** |
| 2. 4 Lỗ Hổng Chủ Bãi Truyền Thống vs Khắc Phục (Thất thoát ca trực, Kẹt xe bãi, Giá cứng nhắc, Tranh chấp va quẹt) | [`OwnerPainPointsSection.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/landing/components/owner-solutions/OwnerPainPointsSection.tsx) | Public | **Preserved (Full Match)** |
| 3. Công Cụ Mô Phỏng Hiệu Quả Đầu Tư (ROI Estimator: 3 Sliders Slot, Giá cước, Tỷ lệ lấp đầy + Tính doanh thu tức thì) | [`OwnerRoiCalculator.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/landing/components/owner-solutions/OwnerRoiCalculator.tsx) | Public | **Preserved (Interactive)** |
| 4. 5 Công Cụ Quản Trị Trọng Yếu Merchant Suite (Phân luồng 5 loại xe, Biểu phí đa tầng, Trạm barie ALPR 360°, Ví Merchant, Đồng bộ hóa đơn VAT) | [`OwnerMerchantFeaturesSection.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/landing/components/owner-solutions/OwnerMerchantFeaturesSection.tsx) | Public | **Preserved (Full Match)** |
| 5. Quy Trình Triển Khai Thực Địa (4 bước: 01 Đăng ký hồ sơ, 02 Khảo sát & lắp barie, 03 Cấu hình sơ đồ, 04 Mở bãi nhận tiền T+1) | [`OwnerWorkflowSection.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/landing/components/owner-solutions/OwnerWorkflowSection.tsx) | Public | **Preserved (Full Match)** |
| 6. Ý Kiến Đối Tác Khai Thác Thực Tế (3 Review Chủ bãi Đình Vũ Hải Phòng, ICD Sóng Thần, Trạm dừng QL1A Long An) | [`OwnerTestimonialsSection.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/landing/components/owner-solutions/OwnerTestimonialsSection.tsx) | Public | **Preserved (Full Match)** |
| 7. Câu Hỏi Thường Gặp Của Chủ Mặt Bằng (5 FAQ Accordion chiết khấu 5%, offline-first, quyết toán T+1, tài trợ thiết bị, đất nện/đá dăm) | [`OwnerFaqSection.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/landing/components/owner-solutions/OwnerFaqSection.tsx) | Public | **Preserved (Accessible)** |
| 8. Đăng Ký Khảo Sát & Mở Bãi Hợp Tác (Form thông tin mặt bằng, diện tích, hiện trạng + phản hồi tức thì) | [`OwnerOnboardingFormSection.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/landing/components/owner-solutions/OwnerOnboardingFormSection.tsx) | Public | **Preserved (Interactive)** |
| 4-Column Footer & Pháp Lý | [`LandingFooter.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/landing/components/common/LandingFooter.tsx) | Public | **Preserved (Full Match)** |

---

## 4. Màn Hình SCR-001D: Trang Bảng Giá (Pricing Page — Route `/pricing` & `/bang-gia`)

| Khối Giao Diện Stitch | Thành Phần React 19 (`smart-parking-app-v2`) | API / Quyền hạn | Trạng thái Parity |
|---|---|---|---|
| Sticky Navbar (Đồng bộ nhãn active Bảng giá) | [`LandingNavbar.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/landing/components/common/LandingNavbar.tsx) | Public | **Preserved (Full Match)** |
| 1. Hero & Billing Switch ("Định Phí Rõ Ràng. Tối Ưu Chi Phí Đỗ Cho Từng Chuyến Hàng." + Toggle Lượt / Tháng -15%) | [`PricingHeroSection.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/landing/components/pricing/PricingHeroSection.tsx) | Public | **Preserved (Interactive)** |
| 2. 3 Khối Gói Dịch Vụ (Tài xế & Chủ xe 0đ, Đội xe & 3PL 990k/841.5k, Chủ bãi 5%) | [`PricingCardsSection.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/landing/components/pricing/PricingCardsSection.tsx) | Public | **Preserved (Interactive)** |
| 3. Bảng Đối Chiếu Năng Lực Chi Tiết (7 dòng tính năng, phân tách rõ 3 phân khúc) | [`PricingComparisonTableSection.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/landing/components/pricing/PricingComparisonTableSection.tsx) | Public | **Preserved (Full Match)** |
| 4. Hỗ Trợ & Giải Đáp Biểu Phí (5 FAQ Accordion phí tài xế, hoàn cọc 100%, công nợ VAT, phần cứng 0đ, rút tiền 24/7) | [`PricingFaqSection.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/landing/components/pricing/PricingFaqSection.tsx) | Public | **Preserved (Accessible)** |
| 5. Bottom CTA Banner ("Sẵn Sàng Tối Ưu Chi Phí Dừng Đỗ & Quản Lý Đội Xe?") | [`PricingCtaBanner.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/landing/components/pricing/PricingCtaBanner.tsx) | Public | **Preserved (Full Match)** |
| 4-Column Footer & Pháp Lý | [`LandingFooter.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/landing/components/common/LandingFooter.tsx) | Public | **Preserved (Full Match)** |


---

## 5. Màn Hình SCR-018: Hàng Đợi Ảo Thông Minh (Virtual Queues — Route `/queues` & `/dashboard/queues`)

| Khối Giao Diện Cũ / Stitch | Thành Phần React 19 (`smart-parking-app-v2`) | API / Quyền hạn | Trạng thái Parity |
|---|---|---|---|
| Command Toolbar & Telemetry | [`QueueCommandToolbar.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/queues/components/QueueCommandToolbar.tsx) | `ROLE_DRIVER` | **Preserved (Full Match)** |
| Thẻ Hàng Đợi Hoạt Động (NOTIFIED / WAITING) | [`ActiveQueueCard.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/queues/components/ActiveQueueCard.tsx) | `ROLE_DRIVER` | **Enhanced (Interactive Countdown & Radar)** |
| Tiến trình điều phối ALPR Timeline | [`QueueTimelineFlow.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/queues/components/QueueTimelineFlow.tsx) | `ROLE_DRIVER` | **Enhanced (Full Visual Pipeline)** |
| Nhận Slot & Tạo Booking | [`AcceptQueueSuccessModal.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/queues/components/AcceptQueueSuccessModal.tsx) | `POST /api/v1/queues/{id}/accept` | **Preserved (Seamless Flow)** |
| Từ chối nhận slot & Rời hàng đợi | [`LeaveQueueConfirmModal.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/queues/components/LeaveQueueConfirmModal.tsx) | `POST /api/v1/queues/{id}/cancel` | **Preserved (With Confirmation Guard)** |
| Bảng Lịch Sử Lượt Xếp Hàng & Bộ lọc | [`QueueHistoryTable.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/queues/components/QueueHistoryTable.tsx) | `GET /api/v1/queues` | **Preserved (Search & Status Filter)** |
| Quy định Vận Hành Hàng Đợi 4 Bento Cards | [`QueueRegulationsSection.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/queues/components/QueueRegulationsSection.tsx) | Public / Driver | **Enhanced (Bento Regulations)** |
| Shimmer Loading Placeholder | [`QueueSkeleton.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/queues/components/QueueSkeleton.tsx) | — | **Preserved (Smooth UX)** |


---

## 6. Màn Hình SCR-019: Lịch Sử Thanh Toán & Hóa Đơn Điện Tử VAT (Driver Payments & VAT Invoices — Route `/payments` & `/dashboard/payments`)

| Khối Giao Diện Cũ / Stitch | Thành Phần React 19 (`smart-parking-app-v2`) | API / Quyền hạn | Trạng thái Parity |
|---|---|---|---|
| Top Scrim Ticker CQT TT78 | [`PaymentsCommandHeader.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/payments/components/PaymentsCommandHeader.tsx) | `ROLE_DRIVER` | **Enhanced (Realtime TT78 Ticker)** |
| 4 Thẻ Bento Chỉ Số Tài Chính | [`FinancialMetricsBento.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/payments/components/FinancialMetricsBento.tsx) | `ROLE_DRIVER` | **Enhanced (Zero-Green Bento Metrics)** |
| Bộ Lọc Tra Cứu & Segmented Tags | [`TransactionFilterToolbar.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/payments/components/TransactionFilterToolbar.tsx) | `ROLE_DRIVER` | **Enhanced (5 Categories + 2 Statuses)** |
| Bảng Kê Giao Dịch 8 Cột PayOS & Tiền Bãi | [`MasterTransactionTable.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/payments/components/MasterTransactionTable.tsx) | `GET /api/v1/payments` | **Full Match (Interactive Row Selector & Pagination)** |
| Thanh Tra Biên Lai Chi Tiết (7 Cột) | [`ReceiptInspectorPanel.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/payments/components/ReceiptInspectorPanel.tsx) | `ROLE_DRIVER` | **Enhanced (Breakdown Điện Lạnh 380V & HĐĐT)** |
| Đồng Bộ Kế Toán Doanh Nghiệp (MISA/FAST) | [`EnterpriseAccountingPanel.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/payments/components/EnterpriseAccountingPanel.tsx) | Local / User Settings | **New Feature (TT78 Direct Dispatch)** |
| Modal Cấu Hình Hóa Đơn Công Ty | [`CompanyInvoiceConfigModal.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/payments/components/CompanyInvoiceConfigModal.tsx) | Local / User Profile | **New Feature (MST, Email, ERP)** |
| Modal Xuất Báo Cáo Excel / PDF | [`ExportReportModal.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/payments/components/ExportReportModal.tsx) | Client / Report API | **New Feature (Audit Ledger Export)** |
| Modal Gửi Biên Lai Điện Tử Qua Email | [`SendReceiptEmailModal.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/payments/components/SendReceiptEmailModal.tsx) | Notification API | **New Feature (Instant Accountant Dispatch)** |
| Shimmer Loading Placeholder | [`PaymentsSkeleton.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/payments/components/PaymentsSkeleton.tsx) | — | **Preserved (Smooth UX)** |

---

## 8. SCR-020 Driver Vehicles Management & Fleet Operations (Quản lý phương tiện & Đồng bộ ALPR)
| Thành phần giao diện / Khối chức năng | File triển khai v2 | Tương ứng Backend Microservice | Trạng thái Parity / Cải tiến |
|---|---|---|---|
| Command Header & ALPR Ticker Strip | [`VehiclesCommandHeader.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/vehicles/components/VehiclesCommandHeader.tsx) | ALPR Gateway Protocol (v3.8-TLS) | **New Feature (Cục Đăng Kiểm & Cổng Cảng)** |
| 4 Thẻ Bento KPI Đội Xe | [`VehiclesKpiBento.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/vehicles/components/VehiclesKpiBento.tsx) | `GET /api/v1/vehicles` | **New Feature (Tải trọng, Xe mặc định, ALPR rate)** |
| Bộ Lọc & Tìm Kiếm Phương Tiện | [`VehicleFilterToolbar.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/vehicles/components/VehicleFilterToolbar.tsx) | Client Search + Filter Params | **New Feature (Tìm biển số, phân loại, trạng thái)** |
| Bảng Quản Lý Danh Mục Phương Tiện (6 Cột) | [`VehicleMasterTable.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/vehicles/components/VehicleMasterTable.tsx) | `GET /api/v1/vehicles` | **Preserved & Enhanced (Tải trọng trục, hạn KĐ, ALPR)** |
| Banner Đồng Bộ ALPR Barie & Cân Tải | [`AlprGateSyncBanner.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/vehicles/components/AlprGateSyncBanner.tsx) | ALPR Service / Gate Subsystem | **New Feature (Cam kết mở gate ≤ 0.2s)** |
| Panel Khai Báo Hồ Sơ Vận Hành (4 Cols) | [`RegisterVehicleFormPanel.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/vehicles/components/RegisterVehicleFormPanel.tsx) | `POST /api/v1/vehicles` | **Preserved & Enhanced (OCR đăng kiểm, tải trọng)** |
| Modal Cập Nhật Thông Tin Xe | [`EditVehicleModal.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/vehicles/components/EditVehicleModal.tsx) | `PUT /api/v1/vehicles/{id}` | **New Feature (SCR-MOD-04 Dialog Cập nhật xe)** |
| Modal Xem Hồ Sơ Kỹ Thuật & Đăng Kiểm | [`ViewInspectionDossierModal.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/vehicles/components/ViewInspectionDossierModal.tsx) | National Registry Dossier API | **New Feature (Số khung, số máy, BH TNDS, in phiếu)** |
| Modal Xác Nhận Hủy Phương Tiện | [`DeleteVehicleConfirmModal.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/vehicles/components/DeleteVehicleConfirmModal.tsx) | `DELETE /api/v1/vehicles/{id}` | **Preserved (Soft delete an toàn, chặn xóa xe mặc định)** |
| Modal Xuất Báo Cáo Đội Xe Excel / PDF | [`ExportFleetModal.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/vehicles/components/ExportFleetModal.tsx) | Client / Report API | **New Feature (Xuất sổ tay đối soát cảng)** |
| Shimmer Loading Placeholder | [`VehiclesSkeleton.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/vehicles/components/VehiclesSkeleton.tsx) | — | **Preserved (Zero-layout-shift placeholder)** |


---

## 9. SCR-021 Driver Profile & eKYC Operations Workbench (Hồ sơ bác tài & Thông tin trực ban)
| Thành phần giao diện / Khối chức năng | File triển khai v2 | Tương ứng Backend Microservice | Trạng thái Parity / Cải tiến |
|---|---|---|---|
| Command Header & Live Station Status | [`ProfileCommandHeader.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/profile/components/ProfileCommandHeader.tsx) | Live Station Dispatch Hub | **New Feature (Cảng Cát Lái SP-PSA Live Status)** |
| Thẻ Định Danh Bác Tài & 4 Bento KPIs | [`DriverIdentityCard.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/profile/components/DriverIdentityCard.tsx) | `GET /api/v1/users/me` | **Preserved & Enhanced (48 Chuyến, 4.95 Rating, FC Chuyên Nghiệp)** |
| Thanh Điều Hướng Hồ Sơ Sidebar (5 Mục) | [`ProfileSidebarNav.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/profile/components/ProfileSidebarNav.tsx) | App Routing & Modals | **Preserved (Profile, 3 Xe, 18 HĐ, Đổi MK, Thông Báo)** |
| Cảnh Báo Quy Chuẩn eKYC 20 Phút | [`DispatchHelpNote.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/profile/components/DispatchHelpNote.tsx) | Central Dispatch Policy | **New Feature (Quy định đối soát Cục Đường Bộ)** |
| Khối 1: Thông Tin Cá Nhân & GPLX FC | [`PersonalInfoSection.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/profile/components/PersonalInfoSection.tsx) | `PUT /api/v1/users/me` | **Preserved & Enhanced (Ẩn/hiện CCCD, OTP phone, GPLX Cục GTVT)** |
| Khối 2: Liên Hệ Khẩn Cấp Trực Ban 24/7 | [`EmergencyContactsSection.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/profile/components/EmergencyContactsSection.tsx) | User Emergency Profile | **Preserved (02 Kênh Điều phối + Gia đình)** |
| Khối 3: Cấu Hình Hóa Đơn Doanh Nghiệp VAT | [`EnterpriseInvoiceSection.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/profile/components/EnterpriseInvoiceSection.tsx) | VAT Invoice Dispatch | **Preserved (Tên DN, MST, Email kế toán, XML+PDF)** |
| Thanh Thao Tác Hồ Sơ (Actions Bar) | [`ProfileActionsBar.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/profile/components/ProfileActionsBar.tsx) | User Form Handlers | **Preserved (Khôi phục dữ liệu gốc, Lưu thay đổi hồ sơ)** |
| Modal Đổi Mật Khẩu Vận Hành | [`ChangePasswordModal.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/profile/components/ChangePasswordModal.tsx) | `POST /api/v1/users/me/password` | **New Feature (Xác thực 3 lớp mật khẩu)** |
| Modal Thiết Lập Thông Báo Hệ Thống | [`NotificationSettingsModal.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/profile/components/NotificationSettingsModal.tsx) | Notification Settings API | **New Feature (SMS slot, Push App, Email XML+PDF)** |
| Modal Cập Nhật Ảnh Định Danh eKYC | [`AvatarUploadModal.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/profile/components/AvatarUploadModal.tsx) | Avatar Storage API | **New Feature (Preview trực quan, AI OCR scanner)** |
| Shimmer Loading Placeholder | [`ProfileSkeleton.tsx`](file:///d:/SmartParkingHub/smart-parking-app-v2/src/features/profile/components/ProfileSkeleton.tsx) | — | **Preserved (Zero-layout-shift placeholder)** |
