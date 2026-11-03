# Capability Parity Matrix — SCR-001: Public Landing Page

| Chức năng cũ (`smart-parking-app`) | Thể hiện trên Stitch HTML | Triển khai mới (`smart-parking-app-v2`) | API / Quyền hạn | Trạng thái Parity |
|---|---|---|---|---|
| Navbar & Hotline | Sticky Navbar với Logo SMARTTRUCK HUB, Hotline 1900 6868 | `LandingNavbar.tsx` | Public | **Preserved (Enhanced)** |
| Hero Headline & CTA | Hero Dark Navy (`#060D1A`), Dual Buttons Đặt chỗ & Điều phối | `LandingHeroSection.tsx` | Public | **Preserved (Full Redesign)** |
| Thống kê chỗ trống & lượt xe | Floating Terminal Card + Live Metric Bar (99.4% mở tự động, 320+ cụm bãi) | `LandingHeroSection.tsx` | Public | **Preserved (Enhanced)** |
| Chỉ số vận hành (4 columns) | Metrics Banner 20K+ lượt, 320+ bãi, 99.8% SLA, 24/7 điều phối | `LandingMetricsBanner.tsx` | Public | **Preserved** |
| Danh mục dịch vụ (Benefit grid) | 4 Service Cards (Container depot, Xe tải nặng, Trạm nghỉ, Hàng đợi ảo) | `LandingServicesGrid.tsx` | Public | **Preserved (Enhanced)** |
| Dành cho chủ bãi & SLA | Bento Grid (SLA 99.8%, Cảm biến 0ms, PayOS T+1, Bảo hiểm 2 tỷ) | `LandingWhyUsBento.tsx` | Public | **Preserved (Enhanced)** |
| Quy trình lưu bãi | 4 bước tuyến tính (Tìm bãi -> Quét QR -> Đỗ xe -> Xuất bãi) | `LandingHowItWorks.tsx` | Public | **Preserved** |
| Bảng giá xe (Pricing Matrix) | Matrix 4 loại xe (Nhẹ, Nặng, Container 40ft, 45ft) + nút Đặt chỗ | `LandingPricingMatrix.tsx` | Link to `/search` | **Preserved (Enhanced)** |
| Đánh giá khách hàng (Social Proof) | 3 Testimonials (Đông Đô Logistics, Bãi Cường Phát, Bác tài Bắc Nam) | `LandingTestimonials.tsx` | Public | **Preserved** |
| CTA chuyển đổi cuối trang | Dark Navy Banner + Dual CTA + 3 Trust check badges | `LandingConversionCta.tsx` | Public | **Preserved** |
| Footer liên hệ & pháp lý | 4-column footer, hotline, email, ISO 27001, PayOS | `LandingFooter.tsx` | Public | **Preserved** |
