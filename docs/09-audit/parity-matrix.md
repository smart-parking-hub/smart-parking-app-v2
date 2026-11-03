# Capability Parity Matrix — Tri-Landing Suite: Trang Chủ, Giải Pháp Tài Xế & Giải Pháp Chủ Bãi

> Phiên bản thiết kế: Stitch HTML `web_standard`  
> Module: `src/features/landing`  
> Subfolders: `components/home/`, `components/driver-solutions/`, `components/owner-solutions/`, `components/common/`  
> Routes: `/` (Trang Chủ), `/driver-solutions` (Tài Xế), `/owner-solutions` (Chủ Bãi)  
> Kiểm thử: Typecheck (0 error), Lint (0 warning, 0 error), Vitest (3/3 pass 100%), Build (Pass)

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
| Sticky Navbar (Đồng bộ điều hướng 3 trang) | [`LandingNavbar.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/landing/components/common/LandingNavbar.tsx) | Public | **Preserved (Full Match)** |
| 1. Hero Thực Địa ("Lộ Trình Chủ Động. Không Còn Cảnh Đậu Tràn Lề Đường Chờ Lốt") | [`DriverHeroSection.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/landing/components/driver-solutions/DriverHeroSection.tsx) | Public | **Preserved (Full Match)** |
| 2. 4 Nỗi Lo vs Giải Pháp (Bị phạt dừng đỗ, Rút trộm dầu/hàng, Nghỉ ngơi tạm bợ, Chặt chém vé) | [`LandingPainPointsSection.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/landing/components/driver-solutions/LandingPainPointsSection.tsx) | Public | **Preserved (Full Match)** |
| 3. Quy Trình Vận Hành Thực Tế (Nhịp 01-02-03-04 tinh gọn từ đường cao tốc tới mở barie 0.2s) | [`DriverWorkflowSection.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/landing/components/driver-solutions/DriverWorkflowSection.tsx) | Public | **Preserved (Full Match)** |
| 4. Bộ Lọc Tiện Ích Xe Nặng (Interactive Tab 5 tiện ích + Live Card Cát Lái Gate 2) | [`LandingAmenityFilterSection.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/landing/components/driver-solutions/LandingAmenityFilterSection.tsx) | Public | **Preserved (Interactive)** |
| 5. Tiếng Nói Từ Cộng Đồng Bác Tài (3 Review Bác tài Bắc - Nam, Container lạnh, Hàng nặng) | [`DriverTestimonialsSection.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/landing/components/driver-solutions/DriverTestimonialsSection.tsx) | Public | **Preserved (Full Match)** |
| 6. Final Driver CTA Banner ("Lái Xe An Tâm Hơn Trên Mọi Chặng Đường. Bắt Đầu Ngay Hôm Nay.") | [`DriverConversionCta.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/landing/components/driver-solutions/DriverConversionCta.tsx) | Public | **Preserved (Full Match)** |
| 4-Column Footer & Pháp Lý | [`LandingFooter.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/src/features/landing/components/common/LandingFooter.tsx) | Public | **Preserved (Full Match)** |

---

## 3. Màn Hình SCR-001C: Trang Giải Pháp Chủ Bãi (Owner Solutions Page — Route `/owner-solutions` & `/giai-phap-chu-bai`)

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
