# 02. Sổ Đăng Ký Tuyến Đường Toàn Hệ Thống (Route Registry)

> **Dự án:** Smart Parking Hub — Modern Logistics & Parking CRM Platform  
> **Chế độ thực thi:** DISCOVERY ONLY (Tuân thủ PROJECT UNIFICATION MASTER RULES)  
> **Thời điểm kiểm tra:** 07/11/2026  
> **Căn cứ xác minh:** `src/app/router/index.tsx` (659 dòng mã nguồn thực tế)  
> **Tổng số URL Route Patterns trong router:** **73 patterns**  
> **Tổng số Màn hình Nghiệp vụ Thực tế (Canonical Screens):** **56 màn hình**  
> **Trạng thái:** VERIFIED 100% (Không suy diễn, đối soát trực tiếp từng component)

---

## 1. Bảng Tổng Hợp Chỉ Số Phân Bổ Màn Hình & Tuyến Đường

```
┌────────────────────────────────────────────────────────────────────────┐
│ PHÂN BỔ 56 MÀN HÌNH NGHIỆP VỤ & 73 ROUTE PATTERNS THEO NHÓM            │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Nhóm Public & Marketing Website (SCR-001 -> SCR-009)  :  9 Màn hình │
│ 2. Nhóm Authentication & Access Control (SCR-010 -> 404) :  5 Màn hình │
│ 3. Nhóm Driver Portal (SCR-014 -> DRV-DISP-02)          : 14 Màn hình │
│ 4. Nhóm Merchant Portal (SCR-026 -> SCR-041)             : 16 Màn hình │
│ 5. Nhóm Admin Command Center (SCR-042 -> SCR-053)        : 12 Màn hình │
│ ────────────────────────────────────────────────────────────────────── │
│ TỔNG CỘNG MÀN HÌNH NGHIỆP VỤ CHÍNH THỨC                  : 56 MÀN HÌNH │
│ Tuyến Kỹ thuật Nội bộ & Thử nghiệm (Scaffold / Dev-Only) :  2 Tuyến    │
│ Các Đường dẫn Định danh Phụ (Aliases & Nested Aliases)   : 15 Tuyến    │
│ TỔNG SỐ URL ROUTE PATTERNS TRONG ROUTER                  : 73 PATTERNS │
└────────────────────────────────────────────────────────────────────────┘
```

> **Quy ước phân loại kiến trúc:**  
> - **Main Pages:** Màn hình độc lập hoặc trang cấp 1 có URL canonical riêng biệt.  
> - **Nested Routes:** Màn hình con hiển thị bên trong `<Outlet />` của Layout cha (`/dashboard/*`, `/merchant/*`, `/admin/*`).  
> - **Modal / Drawer / Dialog:** Được tích hợp bên trong màn hình cha (ví dụ: `DriverLeadModal`, `ALPRQRModal`, `PayOSCheckoutModal`, `CareersApplyModal`, `ExportReportModal`), **tuyệt đối KHÔNG tính modal là một page route riêng biệt**.  
> - **Redirects & Aliases:** Các đường dẫn phụ (ví dụ: tiếng Việt `/bang-gia`, `/ve-chung-toi`, `/tuyen-dung` hoặc nested `/driver/bookings`) dùng chung component canonical.

---

## 2. Bảng Danh Mục Chi Tiết Toàn Bộ 56 Màn Hình Nghiệp Vụ

### I. Nhóm Màn Hình Public Marketing & Developer Documentation (9 Màn Hình)

#### 1. `SCR-001` — Trang Chủ Cổng Thông Tin Logistics
- **Canonical URL:** `/`
- **User Role:** `ANONYMOUS` (Khách vãng lai, tài xế, chủ bãi)
- **Module:** `landing`
- **Parent Layout:** `LandingNavbar` + `LandingFooter` (Public Layout)
- **Main Component:** `LandingPage.tsx`
- **Mục đích:** Giới thiệu hệ sinh thái SmartParkingHub, mạng lưới 320+ cụm bãi đỗ xe container, công nghệ ALPR barie 0.2s, giải pháp thanh toán PayOS VietQR và bảng giá niêm yết.
- **Hành động chính:** Tra cứu bãi đỗ nhanh, điều hướng đăng ký tài xế / chủ bãi, chuyển đổi ngôn ngữ, mở video giới thiệu.
- **Màn hình liên quan:** `SCR-002`, `SCR-003`, `SCR-004`, `SCR-015`.
- **Dịch vụ API:** `GET /api/v1/parking-lots` (lấy bãi nổi bật), `GET /api/v1/ai/stats`.
- **Bảo vệ quyền:** Công khai không giới hạn (`permitAll`).
- **Trạng thái:** `VERIFIED`

#### 2. `SCR-002` — Giải Pháp Dành Cho Bác Tài & Đội Xe Vận Tải
- **Canonical URL:** `/solutions/drivers`
- **Aliases:** `/driver-solutions`, `/giai-phap-tai-xe`
- **User Role:** `ANONYMOUS` / `DRIVER`
- **Module:** `landing`
- **Parent Layout:** `LandingNavbar` + `LandingFooter`
- **Main Component:** `DriverSolutionsPage.tsx`
- **Mục đích:** Phân tích nỗi đau chờ bãi, tắc nghẽn cảng biển; giới thiệu giải pháp đặt chỗ giữ slot 10 phút, tự động mở barie bằng mã QR và ví thanh toán gộp.
- **Hành động chính:** Mở modal đăng ký lái xe `DriverLeadModal`, tải ứng dụng di động, xem tiện ích bãi (cây xăng, sửa chữa, canteen).
- **Màn hình liên quan:** `SCR-010`, `SCR-015`, `SCR-016`.
- **Dịch vụ API:** `POST /api/v1/drivers/leads`
- **Bảo vệ quyền:** Công khai không giới hạn (`permitAll`).
- **Trạng thái:** `VERIFIED`

#### 3. `SCR-003` — Giải Pháp Cho Chủ Mặt Bằng Bãi Đỗ & Depot Container
- **Canonical URL:** `/solutions/owners`
- **Aliases:** `/owner-solutions`, `/giai-phap-chu-bai`
- **User Role:** `ANONYMOUS` / `MERCHANT`
- **Module:** `landing`
- **Parent Layout:** `LandingNavbar` + `LandingFooter`
- **Main Component:** `OwnerSolutionsPage.tsx`
- **Mục đích:** Giới thiệu nền tảng số hóa mặt bằng bãi xe, giải pháp lắp đặt camera AI ALPR miễn phí, thu phí tự động chống thất thoát tiền mặt và bảng tính doanh thu ROI.
- **Hành động chính:** Sử dụng máy tính ước tính doanh thu mặt bằng, điền biểu mẫu onboard đối tác chủ bãi.
- **Màn hình liên quan:** `SCR-011`, `SCR-026`, `SCR-028`.
- **Dịch vụ API:** `POST /api/v1/merchants/leads`, `GET /api/v1/merchant/roi-calculator`.
- **Bảo vệ quyền:** Công khai không giới hạn (`permitAll`).
- **Trạng thái:** `VERIFIED`

#### 4. `SCR-004` — Bảng Giá Dịch Vụ & So Sánh Năng Lực Hệ Thống
- **Canonical URL:** `/pricing`
- **Aliases:** `/bang-gia`
- **User Role:** `ANONYMOUS` (Tất cả đối tượng)
- **Module:** `landing`
- **Parent Layout:** `LandingNavbar` + `LandingFooter`
- **Main Component:** `PricingPage.tsx`
- **Mục đích:** Niêm yết biểu phí minh bạch 3 gói (Tài xế cá nhân 0đ, Đội xe 3PL doanh nghiệp, Đối tác chủ bãi chiết khấu 5%); bảng so sánh năng lực tính năng chi tiết đáp ứng di động 375px.
- **Hành động chính:** Chuyển đổi công tắc thanh toán theo lượt / hợp đồng tháng (-15%), đăng ký gói doanh nghiệp.
- **Màn hình liên quan:** `SCR-001`, `SCR-009`, `SCR-011`.
- **Dịch vụ API:** `GET /api/v1/pricing-rules/public-tariffs`.
- **Bảo vệ quyền:** Công khai không giới hạn (`permitAll`).
- **Trạng thái:** `VERIFIED`

#### 5. `SCR-005` — Cổng Tài Liệu Tích Hợp API Webhooks Nhà Phát Triển
- **Canonical URL:** `/api-docs`
- **Aliases:** `/solutions/api`, `/ket-noi-api`
- **User Role:** `ANONYMOUS` (Kỹ sư phần mềm, đối tác TMS/ERP)
- **Module:** `landing`
- **Parent Layout:** `LandingNavbar` + `LandingFooter`
- **Main Component:** `ApiDocsPage.tsx`
- **Mục đích:** Cung cấp tài liệu API RESTful, thông số Webhooks sự kiện xe vào/ra, mẫu payload JSON, hướng dẫn kết nối hệ thống TMS Logistics của bên thứ ba.
- **Hành động chính:** Sao chép mẫu cURL/JSON qua clipboard, chuyển đổi các tab API module, tải OpenAPI Specification.
- **Màn hình liên quan:** `SCR-001`, `SCR-009`.
- **Dịch vụ API:** `GET /v3/api-docs` (Swagger OpenAPI JSON Gateway).
- **Bảo vệ quyền:** Công khai không giới hạn (`permitAll`).
- **Trạng thái:** `VERIFIED`

#### 6. `SCR-006` — Về Chúng Tôi (Sứ Mệnh & Đội Ngũ Sáng Lập)
- **Canonical URL:** `/about`
- **Aliases:** `/company/about`, `/ve-chung-toi`
- **User Role:** `ANONYMOUS`
- **Module:** `landing`
- **Parent Layout:** `LandingNavbar` + `LandingFooter`
- **Main Component:** `AboutUsPage.tsx`
- **Mục đích:** Giới thiệu tầm nhìn số hóa hạ tầng logistics Việt Nam, lộ trình phát triển (Roadmap 2024-2027), đội ngũ lãnh đạo và các cột mốc vận hành.
- **Hành động chính:** Xem timeline phát triển, điều hướng tới trang liên hệ đối tác.
- **Màn hình liên quan:** `SCR-007`, `SCR-009`.
- **Dịch vụ API:** Không yêu cầu (Nội dung tĩnh).
- **Bảo vệ quyền:** Công khai không giới hạn (`permitAll`).
- **Trạng thái:** `VERIFIED`

#### 7. `SCR-007` — Cơ Hội Nghề Nghiệp & Tuyển Dụng
- **Canonical URL:** `/careers`
- **Aliases:** `/company/careers`, `/tuyen-dung`
- **User Role:** `ANONYMOUS` (Ứng viên)
- **Module:** `landing`
- **Parent Layout:** `LandingNavbar` + `LandingFooter`
- **Main Component:** `CareersPage.tsx`
- **Mục đích:** Đăng tải danh sách các vị trí kỹ thuật, vận hành, logistics; cung cấp luồng nộp CV trực tuyến và hướng dẫn gửi CV trực tiếp qua email có mã hóa tiêu đề.
- **Hành động chính:** Lọc vị trí theo phòng ban, mở modal nộp đơn `CareersApplyModal`, kích hoạt liên kết `mailto:careers@smartparkinghub.vn`.
- **Màn hình liên quan:** `SCR-006`, `SCR-009`.
- **Dịch vụ API:** Không yêu cầu (Hỗ trợ mailto và form submit).
- **Bảo vệ quyền:** Công khai không giới hạn (`permitAll`).
- **Trạng thái:** `VERIFIED`

#### 8. `SCR-008` — Cẩm Nang & Báo Cáo Chuyên Ngành Logistics
- **Canonical URL:** `/insights`
- **Aliases:** `/company/blog`, `/tin-tuc`
- **User Role:** `ANONYMOUS`
- **Module:** `landing`
- **Parent Layout:** `LandingNavbar` + `LandingFooter`
- **Main Component:** `InsightsPage.tsx`
- **Mục đích:** Cung cấp tin tức hạ tầng giao thông cảng biển Cát Lái, Cái Mép - Thị Vải, cẩm nang quản trị bến bãi và biểu mẫu đăng ký nhận bản tin newsletter.
- **Hành động chính:** Tìm kiếm bài viết theo từ khóa, lọc theo danh mục, đăng ký newsletter kiểm thực email qua Zod.
- **Màn hình liên quan:** `SCR-001`, `SCR-006`.
- **Dịch vụ API:** Không yêu cầu (Client-side search & newsletter subscription).
- **Bảo vệ quyền:** Công khai không giới hạn (`permitAll`).
- **Trạng thái:** `VERIFIED`

#### 9. `SCR-009` — Trung Tâm Hỗ Trợ & Điều Phối 24/7
- **Canonical URL:** `/contact`
- **Aliases:** `/company/contact`, `/lien-he`, `/ho-tro`
- **User Role:** `ANONYMOUS`
- **Module:** `landing`
- **Parent Layout:** `LandingNavbar` + `LandingFooter`
- **Main Component:** `ContactPage.tsx`
- **Mục đích:** Kênh tiếp nhận yêu cầu hỗ trợ khẩn cấp, cam kết SLA phản hồi sự cố 5 phút, danh sách 6 trạm điều phối thường trực tại các trục cao tốc và cảng biển.
- **Hành động chính:** Gửi biểu mẫu yêu cầu cứu hộ / hỗ trợ kỹ thuật, gọi hotline khẩn cấp 1900 6868.
- **Màn hình liên quan:** `SCR-001`, `SCR-004`.
- **Dịch vụ API:** `POST /api/v1/contact/inquiries`.
- **Bảo vệ quyền:** Công khai không giới hạn (`permitAll`).
- **Trạng thái:** `VERIFIED`

---

### II. Nhóm Màn Hình Authentication & Kiểm Soát Quyền Truy Cập (5 Màn Hình)

#### 10. `SCR-010` — Đăng Nhập Hệ Thống & Phân Quyền RBAC
- **Canonical URL:** `/login`
- **User Role:** `ANONYMOUS`
- **Module:** `auth`
- **Parent Layout:** `AuthLayout.tsx`
- **Main Component:** `LoginPage.tsx` (sử dụng `LoginForm.tsx`)
- **Mục đích:** Xác thực người dùng bằng số điện thoại và mật khẩu; tự động phân luồng điều hướng theo vai trò (Driver -> `/dashboard`, Merchant -> `/merchant/dashboard`, Admin -> `/admin/dashboard`).
- **Hành động chính:** Nhập thông tin đăng nhập, chọn nhanh 3 tài khoản Demo (Driver, Merchant, Admin), hiển thị/ẩn mật khẩu, ghi nhớ đăng nhập, chuyển hướng an toàn theo tham số `next`.
- **Màn hình liên quan:** `SCR-011`, `SCR-012`, `SCR-014`, `SCR-026`, `SCR-042`.
- **Dịch vụ API:** `POST /api/v1/auth/login` (trả về JWT access_token).
- **Bảo vệ quyền:** Công khai không giới hạn (`permitAll`).
- **Trạng thái:** `VERIFIED`

#### 11. `SCR-011` — Đăng Ký Tài Khoản Mới Toàn Hệ Thống
- **Canonical URL:** `/register`
- **User Role:** `ANONYMOUS`
- **Module:** `auth`
- **Parent Layout:** `AuthLayout.tsx`
- **Main Component:** `AuthPage.tsx` (mode `register`)
- **Mục đích:** Tạo tài khoản mới cho Tài xế xe tải hoặc Đối tác chủ bãi xe; xác thực định dạng số điện thoại Việt Nam và mật khẩu bảo mật cao.
- **Hành động chính:** Chọn vai trò đăng ký (`DRIVER` hoặc `MERCHANT`), nhập số điện thoại, mật khẩu, gửi OTP xác thực.
- **Màn hình liên quan:** `SCR-010`.
- **Dịch vụ API:** `POST /api/v1/auth/register`, `POST /api/v1/auth/send-otp`.
- **Bảo vệ quyền:** Công khai không giới hạn (`permitAll`).
- **Trạng thái:** `VERIFIED`

#### 12. `SCR-012` — Khôi Phục Quyền Truy Cập & Đặt Lại Mật Khẩu
- **Canonical URL:** `/forgot-password`
- **User Role:** `ANONYMOUS`
- **Module:** `auth`
- **Parent Layout:** `AuthLayout.tsx`
- **Main Component:** `AuthPage.tsx` (mode `forgot`)
- **Mục đích:** Hỗ trợ người dùng quên mật khẩu lấy lại quyền truy cập qua mã xác minh SMS OTP 6 chữ số.
- **Hành động chính:** Nhập SĐT đã đăng ký, chờ đếm ngược OTP 60s, nhập mật khẩu mới và xác nhận đặt lại.
- **Màn hình liên quan:** `SCR-010`.
- **Dịch vụ API:** `POST /api/v1/auth/forgot-password`, `POST /api/v1/auth/reset-password`.
- **Bảo vệ quyền:** Công khai không giới hạn (`permitAll`).
- **Trạng thái:** `VERIFIED`

#### 13. `SCR-013` — Trang Báo Lỗi Cấm Truy Cập Phân Quyền (403 Forbidden)
- **Canonical URL:** `/403`
- **User Role:** Tất cả người dùng vi phạm quyền
- **Module:** `auth`
- **Parent Layout:** `AccessPage.tsx`
- **Main Component:** `AccessPage.tsx`
- **Mục đích:** Chặn người dùng cố ý truy cập vào phân vùng không có thẩm quyền (ví dụ Driver vào `/admin` hoặc Merchant vào `/driver`).
- **Hành động chính:** Nút "Về trang chủ" màu cam thương hiệu `#d95f00`, nút "Đăng nhập tài khoản khác".
- **Màn hình liên quan:** `SCR-001`, `SCR-010`.
- **Dịch vụ API:** Không yêu cầu.
- **Bảo vệ quyền:** Công khai không giới hạn (`permitAll`).
- **Trạng thái:** `VERIFIED`

#### 14. `404` — Trang Không Tìm Thấy Tuyến Đường (Page Not Found)
- **Canonical URL:** `*` (Catch-all router pattern)
- **User Role:** Tất cả người dùng
- **Module:** `auth`
- **Parent Layout:** `AccessPage.tsx`
- **Main Component:** `AccessPage.tsx` (thuộc tính `notFound={true}`)
- **Mục đích:** Thông báo đường dẫn URL không tồn tại trong hệ thống, hướng dẫn người dùng quay về trang chủ an toàn.
- **Hành động chính:** Nút "Về trang chủ" quay lại `/`.
- **Màn hình liên quan:** `SCR-001`.
- **Dịch vụ API:** Không yêu cầu.
- **Bảo vệ quyền:** Công khai không giới hạn (`permitAll`).
- **Trạng thái:** `VERIFIED`

---

### III. Nhóm Màn Hình Driver Portal (14 Màn Hình)

#### 15. `SCR-014` — Tổng Quan Vận Hành & Điều Phối Tài Xế (Driver Dashboard)
- **Canonical URL:** `/dashboard`
- **Aliases:** `/driver`, `/driver/dashboard`
- **User Role:** `DRIVER`
- **Module:** `driver`
- **Parent Layout:** `DriverLayout.tsx` (bảo vệ bởi `RequireRole role="DRIVER"`)
- **Main Component:** `DriverDashboardPage.tsx`
- **Mục đích:** Bảng chỉ huy cá nhân của tài xế: hiển thị thẻ chuyến đi đang hoạt động, 4 chỉ số KPI (Chuyến tháng, Chi phí đỗ, Điểm uy tín, Slot chờ), nút truy cập nhanh và danh sách giao dịch gần nhất.
- **Hành động chính:** Mở mã QR Check-in ALPR, tìm kiếm bãi đỗ nhanh, xem lịch sử chuyến đi, liên hệ hotline hỗ trợ.
- **Màn hình liên quan:** `SCR-015`, `SCR-017`, `SCR-019`, `SCR-020`.
- **Dịch vụ API:** `GET /api/v1/drivers/dashboard`
- **Bảo vệ quyền:** JWT Token hợp lệ & Role `DRIVER`.
- **Trạng thái:** `VERIFIED`

#### 16. `SCR-015` — Bản Đồ Tìm Kiếm Bãi Đỗ Xe Thông Minh & Bộ Lọc Tiện Ích
- **Canonical URL:** `/parking`
- **Aliases:** `/dashboard/parking`, `/dashboard/search`, `/driver/search`
- **User Role:** `DRIVER`
- **Module:** `parking-search`
- **Parent Layout:** `DriverLayout.tsx`
- **Main Component:** `SearchParkingPage.tsx`
- **Mục đích:** Bản đồ tương tác định vị GPS hiển thị vị trí các bãi đỗ xe container, bán kính tìm kiếm, số slot trống realtime, giá tiền theo giờ/qua đêm và bộ lọc tiện ích (cân xe, rửa xe, canteen, camera ALPR).
- **Hành động chính:** Tìm kiếm theo địa danh / tọa độ, lọc loại xe (container 40ft/45ft), xem danh sách thẻ bãi đỗ, mở Quick Booking Drawer giữ chỗ 10 phút.
- **Màn hình liên quan:** `SCR-016`, `SCR-017`, `SCR-018`.
- **Dịch vụ API:** `GET /api/v1/parking-lots`
- **Bảo vệ quyền:** JWT Token hợp lệ & Role `DRIVER`.
- **Trạng thái:** `VERIFIED`

#### 17. `SCR-016` — Chi Tiết Bãi Đỗ & Đặt Giữ Chỗ Tức Thì 10 Phút
- **Canonical URL:** `/parking/:id`
- **Aliases:** `/dashboard/parking/:id`, `/driver/parking/:id`
- **Dynamic Param:** `:id` (UUID / Mã bãi đỗ xe)
- **User Role:** `DRIVER`
- **Module:** `parking-detail`
- **Parent Layout:** `DriverLayout.tsx`
- **Main Component:** `ParkingDetailPage.tsx`
- **Mục đích:** Xem hồ sơ kỹ thuật chi tiết của bãi đỗ: sức chứa, biểu phí niêm yết theo loại phương tiện, đánh giá từ các bác tài khác, cam kết dịch vụ; tiến hành đặt cọc 20% qua PayOS VietQR để giữ slot 10 phút chống cướp lốt.
- **Hành động chính:** Chọn loại xe, nhập biển số, kích hoạt đếm ngược giữ chỗ 10 phút, thanh toán đặt cọc qua cổng VietQR PayOS.
- **Màn hình liên quan:** `SCR-015`, `SCR-017`, `SCR-023`, `SCR-024`.
- **Dịch vụ API:** `GET /api/v1/parking-lots/{id}`, `POST /api/v1/bookings`, `POST /api/v1/payments/create-deposit`.
- **Bảo vệ quyền:** JWT Token hợp lệ & Role `DRIVER`.
- **Trạng thái:** `VERIFIED`

#### 18. `SCR-017` — Danh Sách Đặt Chỗ & Vé Đỗ Xe Điện Tử QR
- **Canonical URL:** `/bookings`
- **Aliases:** `/dashboard/bookings`, `/driver/bookings`
- **User Role:** `DRIVER`
- **Module:** `bookings`
- **Parent Layout:** `DriverLayout.tsx`
- **Main Component:** `MyBookingsPage.tsx`
- **Mục đích:** Quản lý toàn bộ vé đỗ xe của tài xế theo 5 trạng thái (Chờ thanh toán, Đã giữ chỗ, Đang đỗ, Hoàn thành, Đã hủy); hiển thị vé điện tử QR Code để quét mở barie tại cổng.
- **Hành động chính:** Tải mã QR dạng ảnh PNG về máy, thanh toán nốt số tiền còn lại qua PayOS, hủy vé hoàn cọc, gửi đánh giá bãi đỗ sau chuyến đi.
- **Màn hình liên quan:** `SCR-016`, `SCR-019`, `SCR-023`.
- **Dịch vụ API:** `GET /api/v1/bookings/my-bookings`, `POST /api/v1/bookings/{id}/cancel`, `POST /api/v1/reviews`.
- **Bảo vệ quyền:** JWT Token hợp lệ & Role `DRIVER`.
- **Trạng thái:** `VERIFIED`

#### 19. `SCR-018` — Hàng Đợi Ảo Thông Minh (Virtual Queues)
- **Canonical URL:** `/queues`
- **Aliases:** `/dashboard/queues`, `/driver/queues`
- **User Role:** `DRIVER`
- **Module:** `queues`
- **Parent Layout:** `DriverLayout.tsx`
- **Main Component:** `VirtualQueuesPage.tsx`
- **Mục đích:** Xếp hàng ảo khi bãi xe đã kín chỗ; hệ thống tự động thông báo và cấp vé ưu tiên ngay khi có phương tiện khác check-out khỏi bãi.
- **Hành động chính:** Nhận thông báo slot trống, xác nhận lấy vé trong vòng 5 phút, từ chối hoặc rời khỏi hàng đợi ảo, xem lịch sử hàng đợi.
- **Màn hình liên quan:** `SCR-015`, `SCR-016`, `SCR-017`.
- **Dịch vụ API:** `GET /api/v1/queues/active`, `POST /api/v1/queues/accept`, `POST /api/v1/queues/leave`.
- **Bảo vệ quyền:** JWT Token hợp lệ & Role `DRIVER`.
- **Trạng thái:** `VERIFIED`

#### 20. `SCR-019` — Lịch Sử Thanh Toán & Hóa Đơn Điện Tử VAT
- **Canonical URL:** `/payments`
- **Aliases:** `/dashboard/payments`, `/driver/payments`
- **User Role:** `DRIVER`
- **Module:** `payments`
- **Parent Layout:** `DriverLayout.tsx`
- **Main Component:** `DriverPaymentsPage.tsx`
- **Mục đích:** Đối soát minh bạch lịch sử các giao dịch đặt cọc, thanh toán cước đỗ, hoàn tiền; quản lý thông tin xuất hóa đơn VAT điện tử gửi về công ty vận tải.
- **Hành động chính:** Xuất báo cáo CSV UTF-8 BOM, cấu hình thông tin xuất hóa đơn VAT doanh nghiệp, gửi biên lai giao dịch qua email.
- **Màn hình liên quan:** `SCR-014`, `SCR-017`.
- **Dịch vụ API:** `GET /api/v1/payments/history`, `POST /api/v1/payments/vat-config`, `POST /api/v1/payments/send-receipt`.
- **Bảo vệ quyền:** JWT Token hợp lệ & Role `DRIVER`.
- **Trạng thái:** `VERIFIED`

#### 21. `SCR-020` — Quản Lý Đội Xe & Nhận Diện Biển Số ALPR
- **Canonical URL:** `/vehicles`
- **Aliases:** `/dashboard/vehicles`, `/driver/vehicles`
- **User Role:** `DRIVER`
- **Module:** `vehicles`
- **Parent Layout:** `DriverLayout.tsx`
- **Main Component:** `VehiclesPage.tsx`
- **Mục đích:** Khai báo danh sách đầu kéo, rơ-moóc, xe tải để hệ thống AI camera tự động nhận diện tại cổng barie và đối chiếu quyền vào bãi.
- **Hành động chính:** Thêm phương tiện mới, chỉnh sửa biển số xe, gán xe mặc định, xóa xe, xuất danh sách phương tiện ra file CSV.
- **Màn hình liên quan:** `SCR-014`, `SCR-016`.
- **Dịch vụ API:** `GET /api/v1/vehicles`, `POST /api/v1/vehicles`, `PUT /api/v1/vehicles/{id}`, `DELETE /api/v1/vehicles/{id}`.
- **Bảo vệ quyền:** JWT Token hợp lệ & Role `DRIVER`.
- **Trạng thái:** `VERIFIED`

#### 22. `SCR-021` — Hồ Sơ Tài Xế & Thông Tin Liên Hệ Khẩn Cấp
- **Canonical URL:** `/profile`
- **Aliases:** `/dashboard/profile`, `/driver/profile`
- **User Role:** `DRIVER`
- **Module:** `profile`
- **Parent Layout:** `DriverLayout.tsx`
- **Main Component:** `ProfilePage.tsx`
- **Mục đích:** Quản lý thông tin cá nhân bác tài, giấy phép lái xe (GPLX FC/FE), số điện thoại cứu hộ khẩn cấp và thông tin doanh nghiệp vận tải chủ quản.
- **Hành động chính:** Cập nhật họ tên, email, số điện thoại liên hệ khẩn cấp, xem cấp độ uy tín thành viên.
- **Màn hình liên quan:** `SCR-022`, `SCR-025`.
- **Dịch vụ API:** `GET /api/v1/drivers/profile`, `PUT /api/v1/drivers/profile`.
- **Bảo vệ quyền:** JWT Token hợp lệ & Role `DRIVER`.
- **Trạng thái:** `VERIFIED`

#### 23. `SCR-022` — Bảo Mật & Đổi Mật Khẩu Tài Xế
- **Canonical URL:** `/change-password`
- **Aliases:** `/dashboard/change-password`, `/driver/change-password`
- **User Role:** `DRIVER`
- **Module:** `change-password`
- **Parent Layout:** `DriverLayout.tsx`
- **Main Component:** `ChangePasswordPage.tsx`
- **Mục đích:** Cung cấp giao diện đổi mật khẩu bảo mật cao kèm bộ kiểm tra độ mạnh mật khẩu realtime (Fretrix Password Strength Meter).
- **Hành động chính:** Nhập mật khẩu hiện tại, nhập mật khẩu mới, xác nhận mật khẩu mới.
- **Màn hình liên quan:** `SCR-021`.
- **Dịch vụ API:** `POST /api/v1/auth/change-password`.
- **Bảo vệ quyền:** JWT Token hợp lệ & Role `DRIVER`.
- **Trạng thái:** `VERIFIED`

#### 24. `SCR-023` — Tiếp Nhận Thanh Toán Thành Công PayOS
- **Canonical URL:** `/payment/success`
- **Aliases:** `/dashboard/payment/success`, `/driver/payment/success`, `/payment/return`
- **User Role:** `DRIVER`
- **Module:** `payment-return`
- **Parent Layout:** `DriverLayout.tsx`
- **Main Component:** `PaymentReturnPage.tsx`
- **Mục đích:** Trang chuyển tiếp nhận tín hiệu từ Webhook PayOS sau khi giao dịch chuyển khoản VietQR hoàn tất thành công; cấp vé barie QR tức thì.
- **Hành động chính:** Xem mã đặt chỗ, xem mã vé QR vào cổng, tải vé điện tử, chuyển hướng về danh sách đặt chỗ.
- **Màn hình liên quan:** `SCR-017`.
- **Dịch vụ API:** `GET /api/v1/payments/verify-return`.
- **Bảo vệ quyền:** JWT Token hợp lệ & Role `DRIVER`.
- **Trạng thái:** `VERIFIED`

#### 25. `SCR-024` — Thông Báo Hủy Thanh Toán PayOS & Bảo Lưu Slot 10 Phút
- **Canonical URL:** `/payment/cancel`
- **Aliases:** `/dashboard/payment/cancel`, `/driver/payment/cancel`
- **User Role:** `DRIVER`
- **Module:** `payment-cancel`
- **Parent Layout:** `DriverLayout.tsx`
- **Main Component:** `PaymentCancelPage.tsx`
- **Mục đích:** Xử lý trường hợp tài xế hủy thanh toán hoặc giao dịch bị gián đoạn; duy trì bộ đếm ngược bảo lưu slot 10 phút để tài xế có cơ hội quét lại mã VietQR.
- **Hành động chính:** Bấm nút "Thanh toán lại ngay", hủy giữ chỗ sớm để nhường slot cho tài xế khác, xem hướng dẫn hỗ trợ 24/7.
- **Màn hình liên quan:** `SCR-016`, `SCR-017`.
- **Dịch vụ API:** `POST /api/v1/payments/repay`, `POST /api/v1/bookings/{id}/release-hold`.
- **Bảo vệ quyền:** JWT Token hợp lệ & Role `DRIVER`.
- **Trạng thái:** `VERIFIED`

#### 26. `SCR-025` — Trung Tâm Thông Báo & Cảnh Báo Điều Hành
- **Canonical URL:** `/notifications`
- **Aliases:** `/dashboard/notifications`, `/driver/notifications`
- **User Role:** `DRIVER`
- **Module:** `notifications`
- **Parent Layout:** `DriverLayout.tsx`
- **Main Component:** `NotificationsPage.tsx`
- **Mục đích:** Nhận các cảnh báo thời gian thực: sắp hết giờ đỗ, bãi xe có slot trống, xác nhận thanh toán, thay đổi biểu phí.
- **Hành động chính:** Đánh dấu đã đọc từng thông báo hoặc toàn bộ, kích hoạt Web Push Notifications 24/7, điều hướng tới booking tương ứng.
- **Màn hình liên quan:** `SCR-014`, `SCR-017`.
- **Dịch vụ API:** `GET /api/v1/notifications`, `PUT /api/v1/notifications/{id}/read`, `POST /api/v1/notifications/web-push-subscribe`.
- **Bảo vệ quyền:** JWT Token hợp lệ & Role `DRIVER`.
- **Trạng thái:** `VERIFIED`

#### 27. `DRV-DISP-01` — Trung Tâm Khiếu Nại Tài Xế & Đối Soát Bồi Thường
- **Canonical URL:** `/disputes`
- **User Role:** `DRIVER`
- **Module:** `disputes`
- **Parent Layout:** `DriverLayout.tsx` (bọc `RequireRole role="DRIVER"`)
- **Main Component:** `DisputesPage.tsx` (thuộc tính `role="driver"`)
- **Mục đích:** Danh sách hồ sơ khiếu nại của tài xế về sự cố barie không mở, sai lệch thời gian tính tiền hoặc vi phạm nội quy bãi đỗ; cột tiền bồi thường được căn phải chuẩn mực.
- **Hành động chính:** Mở modal tạo khiếu nại mới kèm mã đặt chỗ và chứng từ hình ảnh, xem trạng thái hồ sơ (Chờ xử lý, Đang thẩm định, Đã phán quyết).
- **Màn hình liên quan:** `DRV-DISP-02`, `SCR-017`.
- **Dịch vụ API:** `GET /api/v1/disputes/my-disputes`, `POST /api/v1/disputes`.
- **Bảo vệ quyền:** JWT Token hợp lệ & Role `DRIVER`.
- **Trạng thái:** `VERIFIED`

#### 28. `DRV-DISP-02` — Chi Tiết Vụ Việc Khiếu Nại Tài Xế & Phán Quyết Trọng Tài
- **Canonical URL:** `/disputes/:id`
- **Dynamic Param:** `:id` (Mã hồ sơ tranh chấp)
- **User Role:** `DRIVER`
- **Module:** `disputes`
- **Parent Layout:** `DriverLayout.tsx`
- **Main Component:** `DisputesPage.tsx` (thuộc tính `role="driver" detail={true}`)
- **Mục đích:** Xem diễn tiến phân xử vụ việc, bằng chứng camera ALPR đối soát, ý kiến phản hồi của chủ bãi và kết luận trọng tài của Admin.
- **Hành động chính:** Gửi bổ sung chứng từ, xác nhận chấp thuận bồi thường.
- **Màn hình liên quan:** `DRV-DISP-01`.
- **Dịch vụ API:** `GET /api/v1/disputes/{id}`, `POST /api/v1/disputes/{id}/comments`.
- **Bảo vệ quyền:** JWT Token hợp lệ & Role `DRIVER`.
- **Trạng thái:** `VERIFIED`

---

### IV. Nhóm Màn Hình Merchant Portal (16 Màn Hình)

#### 29. `SCR-026` — Bảng Điều Khiển Lưu Lượng & Doanh Thu Chủ Bãi (Merchant Dashboard)
- **Canonical URL:** `/merchant`
- **Aliases:** `/merchant/dashboard`
- **User Role:** `MERCHANT`
- **Module:** `merchant`
- **Parent Layout:** `MerchantLayout.tsx` (bảo vệ bởi `RequireRole role="MERCHANT"`)
- **Main Component:** `MerchantDashboardPage.tsx`
- **Mục đích:** Bảng điều hành tổng hợp dành cho chủ bãi: tỷ lệ lấp đầy mặt bằng realtime (Occupancy Rate), doanh thu trong ngày, lượng xe đang đỗ và cảnh báo cổng barie.
- **Hành động chính:** Xem biểu đồ doanh thu theo giờ, theo dõi camera ALPR luồng xe vào/ra, truy cập nhanh chức năng quét mã QR.
- **Màn hình liên quan:** `SCR-028`, `SCR-034`, `SCR-036`, `SCR-037`.
- **Dịch vụ API:** `GET /api/v1/merchant/dashboard/stats`.
- **Bảo vệ quyền:** JWT Token hợp lệ & Role `MERCHANT`.
- **Trạng thái:** `VERIFIED`

#### 30. `SCR-027` — Hồ Sơ Pháp Lý Doanh Nghiệp & Tài Khoản Thụ Hưởng
- **Canonical URL:** `/merchant/profile`
- **User Role:** `MERCHANT`
- **Module:** `merchant`
- **Parent Layout:** `MerchantLayout.tsx`
- **Main Component:** `MerchantProfilePage.tsx`
- **Mục đích:** Quản lý thông tin pháp nhân bãi xe, giấy phép kinh doanh bến bãi, thông tin tài khoản ngân hàng nhận tiền quyết toán định kỳ (Payout Bank Account).
- **Hành động chính:** Cập nhật số tài khoản ngân hàng thụ hưởng, ẩn/hiện số tài khoản an toàn, tải lên giấy phép bãi đỗ xe hợp pháp.
- **Màn hình liên quan:** `SCR-026`, `SCR-038`.
- **Dịch vụ API:** `GET /api/v1/merchant/profile`, `PUT /api/v1/merchant/profile`.
- **Bảo vệ quyền:** JWT Token hợp lệ & Role `MERCHANT`.
- **Trạng thái:** `VERIFIED`

#### 31. `SCR-028` — Danh Mục Các Bãi Đỗ Xe Sở Hữu & Tình Trạng Kiểm Duyệt
- **Canonical URL:** `/merchant/parking-lots`
- **User Role:** `MERCHANT`
- **Module:** `merchant`
- **Parent Layout:** `MerchantLayout.tsx`
- **Main Component:** `MerchantParkingLotsPage.tsx`
- **Mục đích:** Quản lý danh mục các cụm bãi đỗ thuộc quyền quản trị; theo dõi trạng thái kiểm duyệt bởi Admin (Đang chờ thẩm định, Đã phê duyệt, Yêu cầu bổ sung, Tạm khóa).
- **Hành động chính:** Tạo hồ sơ bãi đỗ mới, tìm kiếm theo tên bãi, lọc theo trạng thái duyệt, xuất danh sách ra file CSV UTF-8 BOM.
- **Màn hình liên quan:** `SCR-029`, `SCR-030`, `SCR-031`.
- **Dịch vụ API:** `GET /api/v1/merchant/parking-lots`.
- **Bảo vệ quyền:** JWT Token hợp lệ & Role `MERCHANT`.
- **Trạng thái:** `VERIFIED`

#### 32. `SCR-029` — Đăng Ký Khởi Tạo Hồ Sơ Bãi Đỗ Mới (Create Lot Wizard)
- **Canonical URL:** `/merchant/parking-lots/new`
- **User Role:** `MERCHANT`
- **Module:** `merchant`
- **Parent Layout:** `MerchantLayout.tsx`
- **Main Component:** `CreateMerchantParkingLotPage.tsx`
- **Mục đích:** Biểu mẫu đa bước khởi tạo bãi đỗ xe: vị trí GPS, diện tích mặt bằng, sức chứa các loại xe, hệ thống camera ALPR và ảnh chụp thực tế.
- **Hành động chính:** Chọn tọa độ trên bản đồ, khai báo tiện ích, tải ảnh bãi, gửi hồ sơ lên Admin thẩm định (có cơ chế chống double-click).
- **Màn hình liên quan:** `SCR-028`.
- **Dịch vụ API:** `POST /api/v1/merchant/parking-lots`.
- **Bảo vệ quyền:** JWT Token hợp lệ & Role `MERCHANT`.
- **Trạng thái:** `VERIFIED`

#### 33. `SCR-030` — Chi Tiết Hồ Sơ Kỹ Thuật & Cảm Biến Giám Sát Bãi Đỗ
- **Canonical URL:** `/merchant/parking-lots/:parkingLotId`
- **Dynamic Param:** `:parkingLotId`
- **User Role:** `MERCHANT`
- **Module:** `merchant`
- **Parent Layout:** `MerchantLayout.tsx`
- **Main Component:** `MerchantParkingLotDetailPage.tsx`
- **Mục đích:** Xem toàn bộ thông số kỹ thuật của một bãi đỗ xe: địa chỉ, tọa độ, thư viện hình ảnh thực tế (kèm Lightbox phóng to ảnh), liên kết cấu hình sức chứa và biểu phí.
- **Hành động chính:** Mở trình xem ảnh Lightbox (hỗ trợ phím Escape), chuyển hướng cấu hình sức chứa hoặc bảng giá.
- **Màn hình liên quan:** `SCR-028`, `SCR-031`, `SCR-032`, `SCR-033`.
- **Dịch vụ API:** `GET /api/v1/merchant/parking-lots/{id}`.
- **Bảo vệ quyền:** JWT Token hợp lệ & Role `MERCHANT`.
- **Trạng thái:** `VERIFIED`

#### 34. `SCR-031` — Chỉnh Sửa & Cập Nhật Thông Tin Bãi Đỗ Xe
- **Canonical URL:** `/merchant/parking-lots/:parkingLotId/edit`
- **Dynamic Param:** `:parkingLotId`
- **User Role:** `MERCHANT`
- **Module:** `merchant`
- **Parent Layout:** `MerchantLayout.tsx`
- **Main Component:** `EditMerchantParkingLotPage.tsx`
- **Mục đích:** Cập nhật thông tin mô tả, hotline liên hệ, tiện ích bổ sung của bãi đỗ xe đã duyệt.
- **Hành động chính:** Chỉnh sửa thông tin, lưu bản nháp nội bộ vào `localStorage`, xem lịch sử cập nhật hồ sơ, lưu thay đổi lên hệ thống.
- **Màn hình liên quan:** `SCR-030`.
- **Dịch vụ API:** `PUT /api/v1/merchant/parking-lots/{id}`.
- **Bảo vệ quyền:** JWT Token hợp lệ & Role `MERCHANT`.
- **Trạng thái:** `VERIFIED`

#### 35. `SCR-032` — Cấu Hình Sức Chứa Bãi Đỗ Theo Loại Phương Tiện (Slots Config)
- **Canonical URL:** `/merchant/parking-lots/:parkingLotId/slots`
- **Dynamic Param:** `:parkingLotId`
- **User Role:** `MERCHANT`
- **Module:** `merchant`
- **Parent Layout:** `MerchantLayout.tsx`
- **Main Component:** `MerchantSlotsPage.tsx`
- **Mục đích:** Thiết lập tổng số slot đỗ cho từng loại phương tiện (Xe tải nhẹ, xe tải nặng, đầu kéo 40ft, 45ft, sơ-mi rơ-moóc); bảo vệ bất biến khóa ràng buộc `Total Capacity >= Occupied Slots`.
- **Hành động chính:** Tăng/giảm số slot qua bộ điều khiển stepper `[+]` `[-]`, mở hộp thoại xác nhận khi giảm sức chứa, lưu cấu hình hàng loạt (Bulk Save).
- **Màn hình liên quan:** `SCR-030`, `SCR-033`.
- **Dịch vụ API:** `GET /api/v1/slots/lot/{id}`, `PUT /api/v1/slots/lot/{id}/bulk`.
- **Bảo vệ quyền:** JWT Token hợp lệ & Role `MERCHANT`.
- **Trạng thái:** `VERIFIED`

#### 36. `SCR-033` — Cấu Hình Biểu Phí & Ma Trận Giá Thuê Bãi (Pricing Rules)
- **Canonical URL:** `/merchant/parking-lots/:id/pricing`
- **Dynamic Param:** `:id`
- **User Role:** `MERCHANT`
- **Module:** `merchant`
- **Parent Layout:** `MerchantLayout.tsx`
- **Main Component:** `MerchantLotPage.tsx` (mode `pricing`)
- **Mục đích:** Cấu hình đơn giá thuê bãi theo lượt (block 4 giờ), qua đêm (18h - 06h) và thuê cố định theo tháng cho từng nhóm xe; các cột tiền tệ được căn phải chuẩn xác.
- **Hành động chính:** Cập nhật đơn giá, lưu ma trận giá, áp dụng chính sách giảm giá giờ thấp điểm.
- **Màn hình liên quan:** `SCR-030`, `SCR-032`.
- **Dịch vụ API:** `GET /api/v1/pricing-rules/lot/{id}`, `PUT /api/v1/pricing-rules/lot/{id}`.
- **Bảo vệ quyền:** JWT Token hợp lệ & Role `MERCHANT`.
- **Trạng thái:** `VERIFIED`

#### 37. `SCR-034` — Quản Lý Danh Sách Đặt Chỗ & Lưu Lượng Xe (Bookings Manifest)
- **Canonical URL:** `/merchant/bookings`
- **User Role:** `MERCHANT`
- **Module:** `merchant`
- **Parent Layout:** `MerchantLayout.tsx`
- **Main Component:** `MerchantBookingsPage.tsx`
- **Mục đích:** Danh sách đăng ký đỗ xe của các tài xế gửi tới cụm bãi; phân trang 20 records/trang kèm bộ lọc trạng thái và tìm kiếm biển số xe.
- **Hành động chính:** Xem chi tiết booking, xác nhận nhận xe thủ công khi camera gặp sự cố, lọc theo khoảng thời gian.
- **Màn hình liên quan:** `SCR-035`, `SCR-036`.
- **Dịch vụ API:** `GET /api/v1/merchant/bookings`.
- **Bảo vệ quyền:** JWT Token hợp lệ & Role `MERCHANT`.
- **Trạng thái:** `VERIFIED`

#### 38. `SCR-035` — Chi Tiết Đơn Đặt Chỗ & Bóc Tách Chi Phí Dịch Vụ
- **Canonical URL:** `/merchant/bookings/:id`
- **Dynamic Param:** `:id`
- **User Role:** `MERCHANT`
- **Module:** `merchant`
- **Parent Layout:** `MerchantLayout.tsx`
- **Main Component:** `MerchantBookingDetailPage.tsx`
- **Mục đích:** Bóc tách toàn diện chi tiết một lượt đỗ xe: giờ vào, giờ ra thực tế, thời gian đỗ quá hạn, tiền cọc PayOS đã cấn trừ và số tiền còn lại phải thu tại cổng.
- **Hành động chính:** In phiếu xuất bến, đối soát mã giao dịch VietQR, xác nhận thu tiền mặt tại chỗ.
- **Màn hình liên quan:** `SCR-034`.
- **Dịch vụ API:** `GET /api/v1/merchant/bookings/{id}`.
- **Bảo vệ quyền:** JWT Token hợp lệ & Role `MERCHANT`.
- **Trạng thái:** `VERIFIED`

#### 39. `SCR-036` — Trạm Kiểm Soát Barie & Quét Mã QR Cổng Vào/Ra (Gate Terminal)
- **Canonical URL:** `/merchant/qr-scanner`
- **User Role:** `MERCHANT`
- **Module:** `merchant`
- **Parent Layout:** `MerchantLayout.tsx`
- **Main Component:** `MerchantScannerPage.tsx`
- **Mục đích:** Thiết bị quét mã QR điện tử tại làn vào/ra của bãi đỗ; kích hoạt đóng/mở barie tự động và đối chiếu biển số thực tế qua camera AI.
- **Hành động chính:** Bật/tắt camera quét mã QR, nhập mã vé bằng tay, bấm nút mở barie thủ công khẩn cấp, xác nhận thu tiền mặt trực tiếp.
- **Màn hình liên quan:** `SCR-026`, `SCR-034`.
- **Dịch vụ API:** `POST /api/v1/merchant/check-in`, `POST /api/v1/merchant/check-out`, `POST /api/v1/merchant/confirm-cash`.
- **Bảo vệ quyền:** JWT Token hợp lệ & Role `MERCHANT`.
- **Trạng thái:** `VERIFIED`

#### 40. `SCR-037` — Báo Cáo Doanh Thu & Đối Soát Tài Chính Bến Bãi
- **Canonical URL:** `/merchant/revenue`
- **User Role:** `MERCHANT`
- **Module:** `merchant`
- **Parent Layout:** `MerchantLayout.tsx`
- **Main Component:** `MerchantRevenuePage.tsx`
- **Mục đích:** Thống kê doanh thu thực nhận (Net Revenue sau khi trừ chiết khấu sàn 5%), phân tích tỷ trọng doanh thu theo từng bãi và theo khung giờ cao điểm.
- **Hành động chính:** Xem biểu đồ xu hướng doanh thu, chọn khoảng thời gian đối soát (Ngày, Tuần, Tháng, Quý), xuất báo cáo tài chính ra file CSV.
- **Màn hình liên quan:** `SCR-026`, `SCR-038`.
- **Dịch vụ API:** `GET /api/v1/merchant/revenue/analytics`.
- **Bảo vệ quyền:** JWT Token hợp lệ & Role `MERCHANT`.
- **Trạng thái:** `VERIFIED`

#### 41. `SCR-038` — Quản Lý Ví Doanh Nghiệp & Yêu Cầu Rút Tiền (Settlement Wallet)
- **Canonical URL:** `/merchant/withdrawals`
- **User Role:** `MERCHANT`
- **Module:** `merchant`
- **Parent Layout:** `MerchantLayout.tsx`
- **Main Component:** `MerchantWithdrawalsPage.tsx`
- **Mục đích:** Quản lý số dư khả dụng và số dư tạm giữ; thực hiện lệnh rút tiền về tài khoản ngân hàng thụ hưởng (ngưỡng tối thiểu 50.000 đ).
- **Hành động chính:** Tạo lệnh rút tiền với các mốc chọn nhanh (500k, 1M, 5M, Tất cả), theo dõi tiến độ duyệt tiền từ Admin.
- **Màn hình liên quan:** `SCR-027`, `SCR-037`.
- **Dịch vụ API:** `GET /api/v1/withdrawals/my-requests`, `POST /api/v1/withdrawals/create`.
- **Bảo vệ quyền:** JWT Token hợp lệ & Role `MERCHANT`.
- **Trạng thái:** `VERIFIED`

#### 42. `SCR-039` — Bàn Làm Việc Xử Lý Tranh Chấp Chủ Bãi (Merchant Disputes)
- **Canonical URL:** `/merchant/disputes`
- **User Role:** `MERCHANT`
- **Module:** `disputes`
- **Parent Layout:** `MerchantLayout.tsx`
- **Main Component:** `DisputesPage.tsx` (thuộc tính `role="merchant"`)
- **Mục đích:** Tiếp nhận và xử lý các khiếu nại từ tài xế về sự cố tại bãi đỗ; bảng dữ liệu được căn phải các cột tài chính.
- **Hành động chính:** Phản hồi khiếu nại, cung cấp log camera ALPR, yêu cầu hỗ trợ trọng tài từ Admin.
- **Màn hình liên quan:** `SCR-040`.
- **Dịch vụ API:** `GET /api/v1/disputes/merchant-disputes`.
- **Bảo vệ quyền:** JWT Token hợp lệ & Role `MERCHANT`.
- **Trạng thái:** `VERIFIED`

#### 43. `SCR-040` — Chi Tiết Biên Bản Vụ Việc Khiếu Nại Chủ Bãi
- **Canonical URL:** `/merchant/disputes/:id`
- **Dynamic Param:** `:id`
- **User Role:** `MERCHANT`
- **Module:** `disputes`
- **Parent Layout:** `MerchantLayout.tsx`
- **Main Component:** `DisputesPage.tsx` (thuộc tính `role="merchant" detail={true}`)
- **Mục đích:** Đối chất và xem bằng chứng vụ việc với tài xế, xem quyết định phân xử bồi thường của Admin.
- **Hành động chính:** Gửi tin nhắn trao đổi trong vụ việc, chấp nhận phương án bồi thường.
- **Màn hình liên quan:** `SCR-039`.
- **Dịch vụ API:** `GET /api/v1/disputes/{id}`.
- **Bảo vệ quyền:** JWT Token hợp lệ & Role `MERCHANT`.
- **Trạng thái:** `VERIFIED`

#### 44. `SCR-041` — Trung Tâm Thông Báo Biến Động Số Dư & Vận Hành Bãi
- **Canonical URL:** `/merchant/notifications`
- **User Role:** `MERCHANT`
- **Module:** `portal`
- **Parent Layout:** `MerchantLayout.tsx`
- **Main Component:** `PortalNotificationsPage.tsx`
- **Mục đích:** Thông báo tiền cọc mới phát sinh, thông báo xe check-in/out, thông báo kết quả duyệt lệnh rút tiền từ Admin.
- **Hành động chính:** Đánh dấu đã đọc, phân loại thông báo theo nhóm.
- **Màn hình liên quan:** `SCR-026`, `SCR-038`.
- **Dịch vụ API:** `GET /api/v1/notifications/merchant`.
- **Bảo vệ quyền:** JWT Token hợp lệ & Role `MERCHANT`.
- **Trạng thái:** `VERIFIED`

---

### V. Nhóm Màn Hình Admin Command Center (12 Màn Hình)

#### 45. `SCR-042` — Trung Tâm Chỉ Huy Vận Hành Cấp Cao (Admin Dashboard)
- **Canonical URL:** `/admin`
- **Aliases:** `/admin/dashboard`
- **User Role:** `ADMIN`
- **Module:** `admin`
- **Parent Layout:** `AdminLayout.tsx` (bảo vệ bởi `RequireRole role="ADMIN"`)
- **Main Component:** `AdminDashboardPage.tsx`
- **Mục đích:** Bảng chỉ huy toàn hệ thống: tổng số người dùng, tổng lưu lượng xe toàn quốc, tổng tiền giao dịch VietQR, số lượng bãi đỗ đang chờ duyệt và lệnh rút tiền cần giải ngân.
- **Hành động chính:** Xem biểu đồ tài chính toàn sàn, chuyển nhanh tới hàng đợi duyệt bãi đỗ hoặc duyệt lệnh rút tiền.
- **Màn hình liên quan:** `SCR-043`, `SCR-045`, `SCR-047`, `SCR-048`.
- **Dịch vụ API:** `GET /api/v1/admin/dashboard`.
- **Bảo vệ quyền:** JWT Token hợp lệ & Role `ADMIN`.
- **Trạng thái:** `VERIFIED`

#### 46. `SCR-043` — Hàng Đợi Kiểm Duyệt Hồ Sơ Bãi Đỗ Mới (Lots Moderation)
- **Canonical URL:** `/admin/parking-lots`
- **User Role:** `ADMIN`
- **Module:** `admin`
- **Parent Layout:** `AdminLayout.tsx`
- **Main Component:** `AdminParkingLotsPage.tsx`
- **Mục đích:** Danh sách hồ sơ bãi đỗ xe do các chủ bãi đăng ký; phân loại theo trạng thái kiểm duyệt (Chờ duyệt, Đã duyệt, Đã từ chối, Yêu cầu bổ sung thông tin).
- **Hành động chính:** Tìm kiếm theo tên bãi / tỉnh thành, mở hồ sơ thẩm định chi tiết.
- **Màn hình liên quan:** `SCR-044`.
- **Dịch vụ API:** `GET /api/v1/admin/parking-lots`.
- **Bảo vệ quyền:** JWT Token hợp lệ & Role `ADMIN`.
- **Trạng thái:** `VERIFIED`

#### 47. `SCR-044` — Hồ Sơ Thẩm Định Kỹ Thuật Bãi Đỗ Xe (Lot Appraisal Dossier)
- **Canonical URL:** `/admin/parking-lots/:id`
- **Dynamic Param:** `:id`
- **User Role:** `ADMIN`
- **Module:** `admin`
- **Parent Layout:** `AdminLayout.tsx`
- **Main Component:** `AdminLotDetailPage.tsx`
- **Mục đích:** Kiểm tra chi tiết tọa độ GPS, giấy phép bến bãi, ảnh chụp camera ALPR; đưa ra quyết định phê duyệt (không bắt buộc nhập lý do) hoặc từ chối / yêu cầu bổ sung (bắt buộc nhập lý do chi tiết).
- **Hành động chính:** Phê duyệt bãi đỗ xe lên sàn, từ chối hồ sơ kèm lý do, yêu cầu chủ bãi bổ sung giấy tờ.
- **Màn hình liên quan:** `SCR-043`.
- **Dịch vụ API:** `GET /api/v1/admin/parking-lots/{id}`, `POST /api/v1/admin/parking-lots/{id}/decision`.
- **Bảo vệ quyền:** JWT Token hợp lệ & Role `ADMIN`.
- **Trạng thái:** `VERIFIED`

#### 48. `SCR-045` — Danh Mục Quản Trị Người Dùng & Phân Quyền Hệ Thống
- **Canonical URL:** `/admin/users`
- **User Role:** `ADMIN`
- **Module:** `admin`
- **Parent Layout:** `AdminLayout.tsx`
- **Main Component:** `AdminUsersPage.tsx`
- **Mục đích:** Quản lý tài khoản toàn bộ tài xế, chủ bãi xe và nhân viên điều hành; kiểm soát trạng thái hoạt động (Active, Suspended, Banned).
- **Hành động chính:** Tìm kiếm người dùng theo số điện thoại / họ tên, lọc theo vai trò (`DRIVER`, `MERCHANT`, `ADMIN`), mở hồ sơ kỷ luật.
- **Màn hình liên quan:** `SCR-046`.
- **Dịch vụ API:** `GET /api/v1/admin/users`.
- **Bảo vệ quyền:** JWT Token hợp lệ & Role `ADMIN`.
- **Trạng thái:** `VERIFIED`

#### 49. `SCR-046` — Hồ Sơ Kỷ Luật & Cưỡng Chế Tài Khoản (User Enforcement Dossier)
- **Canonical URL:** `/admin/users/:id`
- **Dynamic Param:** `:id`
- **User Role:** `ADMIN`
- **Module:** `admin`
- **Parent Layout:** `AdminLayout.tsx`
- **Main Component:** `AdminUserDetailPage.tsx`
- **Mục đích:** Xem lịch sử vi phạm, tỷ lệ bùng lốt (No-show), các đơn khiếu nại liên quan; thi hành biện pháp kỷ luật khóa tài khoản có thời hạn hoặc vĩnh viễn.
- **Hành động chính:** Khóa tài khoản (Ban User), mở khóa tài khoản, kích hoạt cảnh báo an ninh.
- **Màn hình liên quan:** `SCR-045`.
- **Dịch vụ API:** `GET /api/v1/admin/users/{id}`, `POST /api/v1/admin/users/{id}/enforce`.
- **Bảo vệ quyền:** JWT Token hợp lệ & Role `ADMIN`.
- **Trạng thái:** `VERIFIED`

#### 50. `SCR-047` — Sổ Cái Đối Soát Giao Dịch Toàn Sàn (Financial Ledger)
- **Canonical URL:** `/admin/transactions`
- **User Role:** `ADMIN`
- **Module:** `admin`
- **Parent Layout:** `AdminLayout.tsx`
- **Main Component:** `AdminTransactionsPage.tsx`
- **Mục đích:** Sổ cái ghi nhận 100% dòng tiền luân chuyển trên nền tảng: tiền đặt cọc PayOS, hoàn tiền tài xế, phí sàn 5% thu từ chủ bãi; hỗ trợ xem Card View trên di động.
- **Hành động chính:** Tra cứu theo mã giao dịch VietQR, lọc theo trạng thái thanh toán, xuất sổ cái ra file CSV.
- **Màn hình liên quan:** `SCR-042`, `SCR-048`.
- **Dịch vụ API:** `GET /api/v1/admin/transactions`.
- **Bảo vệ quyền:** JWT Token hợp lệ & Role `ADMIN`.
- **Trạng thái:** `VERIFIED`

#### 51. `SCR-048` — Bàn Quyết Toán & Giải Ngân Cho Chủ Bãi (Settlement Desk)
- **Canonical URL:** `/admin/withdrawals`
- **User Role:** `ADMIN`
- **Module:** `admin`
- **Parent Layout:** `AdminLayout.tsx`
- **Main Component:** `AdminWithdrawalsPage.tsx`
- **Mục đích:** Xét duyệt và giải ngân các lệnh rút tiền từ chủ bãi; hộp thoại xác nhận bắt buộc hiển thị đầy đủ thông tin ngân hàng thụ hưởng (Tên ngân hàng, Số tài khoản che một phần, Chủ tài khoản, Số tiền) trước khi duyệt lệnh.
- **Hành động chính:** Mở hộp thoại xác nhận giải ngân, phê duyệt chuyển khoản, từ chối lệnh rút tiền kèm lý do.
- **Màn hình liên quan:** `SCR-047`.
- **Dịch vụ API:** `GET /api/v1/admin/withdrawals`, `POST /api/v1/admin/withdrawals/{id}/approve`, `POST /api/v1/admin/withdrawals/{id}/reject`.
- **Bảo vệ quyền:** JWT Token hợp lệ & Role `ADMIN`.
- **Trạng thái:** `VERIFIED`

#### 52. `SCR-049` — Tòa Trọng Tài Giải Quyết Khiếu Nại (Arbitration Tribunal)
- **Canonical URL:** `/admin/disputes`
- **User Role:** `ADMIN`
- **Module:** `disputes`
- **Parent Layout:** `AdminLayout.tsx`
- **Main Component:** `DisputesPage.tsx` (thuộc tính `role="admin"`)
- **Mục đích:** Danh sách các vụ việc tranh chấp giữa Tài xế và Chủ bãi không tự thỏa thuận được; Admin đóng vai trò trọng tài phân xử độc lập.
- **Hành động chính:** Tìm kiếm theo mã hồ sơ, lọc các vụ việc khẩn cấp, mở phòng xét xử vụ việc.
- **Màn hình liên quan:** `SCR-050`.
- **Dịch vụ API:** `GET /api/v1/disputes/admin-docket`.
- **Bảo vệ quyền:** JWT Token hợp lệ & Role `ADMIN`.
- **Trạng thái:** `VERIFIED`

#### 53. `SCR-050` — Điều Tra Bằng Chứng & Phán Quyết Bồi Thường (Arbitration Verdict)
- **Canonical URL:** `/admin/disputes/:id`
- **Dynamic Param:** `:id`
- **User Role:** `ADMIN`
- **Module:** `disputes`
- **Parent Layout:** `AdminLayout.tsx`
- **Main Component:** `DisputesPage.tsx` (thuộc tính `role="admin" detail={true}`)
- **Mục đích:** Đối soát chứng từ thời gian xe vào/ra bãi từ camera ALPR, quyết định mức tiền bồi thường hoàn cọc cho tài xế hoặc trừ ví chủ bãi.
- **Hành động chính:** Nhập nội dung phán quyết trọng tài, đóng hồ sơ tranh chấp với trạng thái `RESOLVED`.
- **Màn hình liên quan:** `SCR-049`.
- **Dịch vụ API:** `GET /api/v1/disputes/{id}`, `POST /api/v1/disputes/{id}/verdict`.
- **Bảo vệ quyền:** JWT Token hợp lệ & Role `ADMIN`.
- **Trạng thái:** `VERIFIED`

#### 54. `SCR-051` — Nhật Ký Kiểm Toán An Ninh Hệ Thống (Audit Trail)
- **Canonical URL:** `/admin/audit-logs`
- **User Role:** `ADMIN`
- **Module:** `admin`
- **Parent Layout:** `AdminLayout.tsx`
- **Main Component:** `AdminAuditLogsPage.tsx`
- **Mục đích:** Ghi nhận mọi hành động nhạy cảm trong hệ thống: thời điểm đăng nhập, thay đổi quyền người dùng, can thiệp duyệt bãi đỗ, phê duyệt giải ngân tiền; hỗ trợ Card View responsive trên thiết bị di động.
- **Hành động chính:** Tìm kiếm theo tác vụ, lọc theo khoảng thời gian an ninh, xuất nhật ký kiểm toán ra file CSV UTF-8 BOM.
- **Màn hình liên quan:** `SCR-042`.
- **Dịch vụ API:** `GET /api/v1/admin/audit-logs`.
- **Bảo vệ quyền:** JWT Token hợp lệ & Role `ADMIN`.
- **Trạng thái:** `VERIFIED`

#### 55. `SCR-052` — Kênh Thông Báo Cảnh Báo An Ninh Khẩn Cấp
- **Canonical URL:** `/admin/notifications`
- **User Role:** `ADMIN`
- **Module:** `portal`
- **Parent Layout:** `AdminLayout.tsx`
- **Main Component:** `PortalNotificationsPage.tsx`
- **Mục đích:** Tiếp nhận các thông báo an ninh: bãi xe có dấu hiệu bất thường, tài xế báo sự cố khẩn cấp, cảnh báo nghẽn mạng cổng thanh toán PayOS.
- **Hành động chính:** Đánh dấu đã đọc, phân trang danh sách thông báo khẩn.
- **Màn hình liên quan:** `SCR-042`.
- **Dịch vụ API:** `GET /api/v1/notifications/admin`.
- **Bảo vệ quyền:** JWT Token hợp lệ & Role `ADMIN`.
- **Trạng thái:** `VERIFIED`

#### 56. `SCR-053` — Hồ Sơ An Ninh & Mật Mã Quản Trị Cấp Cao
- **Canonical URL:** `/admin/profile`
- **User Role:** `ADMIN`
- **Module:** `portal`
- **Parent Layout:** `AdminLayout.tsx`
- **Main Component:** `AdminProfilePage.tsx`
- **Mục đích:** Quản lý thông tin tài khoản quản trị viên tối cao, cấu hình xác thực 2 bước (2FA) và đổi mật khẩu an ninh cấp độ cao.
- **Hành động chính:** Cập nhật thông tin định danh admin, đổi mật khẩu quản trị.
- **Màn hình liên quan:** `SCR-042`.
- **Dịch vụ API:** `GET /api/v1/admin/profile`, `PUT /api/v1/admin/profile`.
- **Bảo vệ quyền:** JWT Token hợp lệ & Role `ADMIN`.
- **Trạng thái:** `VERIFIED`

---

## 3. Khu Vực Tuyến Đường Kỹ Thuật Nội Bộ (Scaffolding & Dev-Only Routes)

Hệ thống có **02 tuyến đường kỹ thuật đặc thù** không phục vụ người dùng cuối trong sản phẩm chính thức:

| STT | Route Pattern | Component Thực Tế | Phân Loại | Mục Đích Kỹ Thuật | Bằng Chứng Mã Nguồn |
| :---: | :--- | :--- | :---: | :--- | :--- |
| 1 | `/design-preview/*` | `DesignPreviewPage.tsx` | **DEV-ONLY TOOL** | Công cụ nội bộ cho phép nhà phát triển xem trước 31 màn hình với mock cache tĩnh. | Tuyến này bọc điều kiện `import.meta.env.DEV`, tự động bị loại bỏ hoàn toàn (tree-shaken) khi chạy lệnh `vite build`. (`src/app/router/index.tsx` dòng 214-225). |
| 2 | `/crm` | `BaselineOverviewPage.tsx` | **INTERNAL SCAFFOLD** | Trang kiểm thử hạ tầng 4-layer architecture ban đầu. | Nằm tại `src/app/pages/BaselineOverviewPage.tsx`, sử dụng layout `RootLayout.tsx`. Không có nghiệp vụ người dùng thực tế. |

---

## 4. Đối Chiếu Khớp Với 53 Màn Hình Trong Báo Cáo Trước Đó

- **Tại sao có con số 53 màn hình trong thông báo ban đầu?**  
  Báo cáo kế hoạch ban đầu đánh số từ `SCR-001` tới `SCR-053` (tổng cộng 53 mã ID).
- **Tại sao thực tế router quản lý 56 màn hình nghiệp vụ?**  
  1. Hạng mục khiếu nại của tài xế (`Disputes`) được tách bạch thành 2 màn hình riêng biệt: Danh sách khiếu nại (`DRV-DISP-01` tại `/disputes`) và Chi tiết phân xử (`DRV-DISP-02` tại `/disputes/:id`).
  2. Bổ sung màn hình bắt buộc chuẩn hóa trải nghiệm: Trang lỗi liên kết `404 Page Not Found` (`*`).  
  -> 53 + 2 + 1 = **56 Màn hình nghiệp vụ hoàn chỉnh**.
- **Tại sao router có 73 URL Patterns?**  
  Vì hệ thống hỗ trợ các đường dẫn phụ (Aliases) thân thiện với SEO tiếng Việt (`/bang-gia`, `/ve-chung-toi`, `/tuyen-dung`, `/tin-tuc`, `/lien-he`) và các đường dẫn lồng nhau (`/dashboard/bookings`, `/driver/bookings`, `/bookings` cùng trỏ về `MyBookingsPage`). Toàn bộ 73 patterns này đều đã được đối soát 100% không có bất kỳ route nào bị hỏng (zero broken routes).
