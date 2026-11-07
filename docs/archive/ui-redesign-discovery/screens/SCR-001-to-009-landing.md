# Chỉ Mục & Tổng Hợp Nhóm Màn Hình Public Landing & Marketing (SCR-001 đến SCR-009)

---

## 1. TỔNG QUAN NHÓM MÀN HÌNH

Nhóm màn hình Public Landing & Marketing Website thuộc **Module 01: Public Landing & Marketing Website**, chịu trách nhiệm truyền thông giá trị sản phẩm, công bố biểu phí minh bạch, tiếp nhận đăng ký người dùng mới và cung cấp tài liệu kỹ thuật cho đối tác bên thứ ba.

Toàn bộ 9 màn hình trong nhóm kế thừa chung bố cục [`LandingLayout`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/landing/components/LandingLayout.tsx), bao gồm thanh điều hướng trên cùng [`LandingNavbar`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/landing/components/LandingNavbar.tsx) và chân trang [`LandingFooter`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/landing/components/LandingFooter.tsx).

---

## 2. DANH SÁCH ĐẶC TẢ CHI TIẾT TỪNG MÀN HÌNH

| Screen ID | Tên Màn Hình | Route URL | File Component Frontend | Vai Trò Tiếp Cận | Trạng Thái Discovery | Tài Liệu Đặc Tả Chi Tiết |
|---|---|---|---|---|:---:|---|
| **SCR-001** | Trang Chủ Giới Thiệu (Landing Page) | `/` | [LandingPage.tsx](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/landing/pages/LandingPage.tsx) | GUEST / Mọi vai trò | `VERIFIED` | [SCR-001-landing-home.md](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/docs/ui-redesign-discovery/detail-screens/SCR-001-landing-home.md) |
| **SCR-002** | Giải Pháp Dành Cho Tài Xế | `/solutions/drivers` | [DriverSolutionsPage.tsx](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/landing/pages/DriverSolutionsPage.tsx) | GUEST / Tài xế | `VERIFIED` | [SCR-002-driver-solutions.md](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/docs/ui-redesign-discovery/detail-screens/SCR-002-driver-solutions.md) |
| **SCR-003** | Giải Pháp Dành Cho Chủ Bãi | `/solutions/owners` | [OwnerSolutionsPage.tsx](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/landing/pages/OwnerSolutionsPage.tsx) | GUEST / Chủ bãi | `VERIFIED` | [SCR-003-owner-solutions.md](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/docs/ui-redesign-discovery/detail-screens/SCR-003-owner-solutions.md) |
| **SCR-004** | Bảng Giá Minh Bạch (Pricing) | `/pricing` | [PricingPage.tsx](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/landing/pages/PricingPage.tsx) | GUEST / Doanh nghiệp | `VERIFIED` | [SCR-004-pricing.md](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/docs/ui-redesign-discovery/detail-screens/SCR-004-pricing.md) |
| **SCR-005** | Tích Hợp API & Webhooks | `/solutions/api` | [ApiIntegrationPage.tsx](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/landing/pages/ApiIntegrationPage.tsx) | GUEST / Lập trình viên | `VERIFIED` | [SCR-005-api-integration.md](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/docs/ui-redesign-discovery/detail-screens/SCR-005-api-integration.md) |
| **SCR-006** | Về SmartTruck (About Us) | `/company/about` | [AboutUsPage.tsx](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/landing/pages/AboutUsPage.tsx) | GUEST / Đối tác | `VERIFIED` | [SCR-006-about-us.md](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/docs/ui-redesign-discovery/detail-screens/SCR-006-about-us.md) |
| **SCR-007** | Cơ Hội Nghề Nghiệp (Careers) | `/company/careers` | [CareersPage.tsx](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/landing/pages/CareersPage.tsx) | GUEST / Ứng viên | `VERIFIED` | [SCR-007-careers.md](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/docs/ui-redesign-discovery/detail-screens/SCR-007-careers.md) |
| **SCR-008** | Tin Tức & Blog (Blog Page) | `/company/blog` | [BlogPage.tsx](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/landing/pages/BlogPage.tsx) | GUEST / Bạn đọc | `VERIFIED` | [SCR-008-blog.md](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/docs/ui-redesign-discovery/detail-screens/SCR-008-blog.md) |
| **SCR-009** | Liên Hệ Với Chúng Tôi (Contact) | `/company/contact` | [ContactPage.tsx](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/landing/pages/ContactPage.tsx) | GUEST / Hỗ trợ | `VERIFIED` | [SCR-009-contact.md](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/docs/ui-redesign-discovery/detail-screens/SCR-009-contact.md) |

---

## 3. SƠ ĐỒ ĐIỀU HƯỚNG LIÊN MÀN HÌNH (NAVIGATION FLOW)

```mermaid
graph TD
    Navbar[LandingNavbar: Thanh điều hướng chung] -->|Click Logo / Trang chủ| SCR001[SCR-001: LandingPage]
    Navbar -->|Tìm bãi đỗ| CheckAuth1{Đã đăng nhập?}
    CheckAuth1 -- Có --> SCR015[/parking: Tìm bãi đỗ]
    CheckAuth1 -- Chưa --> Login[/login: Đăng nhập]

    Navbar -->|Đăng nhập| Login
    Navbar -->|Đăng ký| Register[/register: Đăng ký]

    SCR001 -->|Nút 'Tìm bãi đỗ' / Click Map| CheckAuth1
    SCR001 -->|Nút 'Đăng ký chủ bãi'| CheckAuth2{Đã đăng nhập?}
    CheckAuth2 -- Có --> Dashboard[/dashboard]
    CheckAuth2 -- Chưa --> Register

    Footer[LandingFooter: Chân trang chung] -->|Hướng dẫn tài xế| SCR002[SCR-002: DriverSolutionsPage]
    Footer -->|Ưu đãi / Bảng giá| SCR004[SCR-004: PricingPage]
    Footer -->|Chính sách / Điều khoản| SCR006[SCR-006: AboutUsPage]
    Footer -->|Liên hệ| SCR009[SCR-009: ContactPage]

    SCR004 -->|Gói Tài xế: Đăng ký ngay| Register
    SCR004 -->|Gói Doanh nghiệp: Nhận báo giá| SCR009
    SCR004 -->|Gói Chủ bãi: Đăng ký bãi đỗ| Register

    SCR005[SCR-005: ApiIntegrationPage]
    SCR007[SCR-007: CareersPage]
    SCR008[SCR-008: BlogPage]
```

---

## 4. TỔNG HỢP CÁC PHÁT HIỆN KỸ THUẬT QUAN TRỌNG

1. **Toàn bộ nội dung là Marketing Presenter UI:**
   - 9 màn hình đều chạy ở tầng Frontend dưới dạng component tĩnh hoặc hardcoded state.
   - Không có Controller Backend nào trong `smart-parking-service` phục vụ các API công cộng `/api/v1/public/**` (dù Spring Security có cấu hình `permitAll()`).
2. **Đính chính tài liệu cũ về `ContactPage` (`SCR-009`):**
   - Tài liệu sơ bộ trước đây ghi rằng `ContactPage` tích hợp thư viện `emailJsApi.ts`.
   - Rà soát mã nguồn thực tế: `ContactPage.tsx` là một form HTML tĩnh (`<form className="space-y-4">`), **chưa có hàm xử lý `onSubmit` và không import bất kỳ API nào**.
3. **Các nút tương tác chưa hoàn thiện (Dead Clicks):**
   - `SCR-005`: Nút "Xem Tài Liệu API" chưa gắn hành động click hoặc liên kết Swagger.
   - `SCR-007`: Nút "Ứng tuyển" tại 3 vị trí công việc chưa gắn handler hoặc `mailto:`.
   - `SCR-008`: Các thẻ bài viết Blog có hiệu ứng hover CSS nhưng không có route chi tiết `/company/blog/:id`.
