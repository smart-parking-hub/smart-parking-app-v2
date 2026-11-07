# Screen Specification: SCR-006 AboutUsPage (Về chúng tôi)

---

## 1. SCREEN IDENTIFIER & CLASSIFICATION

- **Screen ID:** `SCR-006`
- **Screen Name:** Giới thiệu công ty & Sứ mệnh nền tảng (About Us / Corporate Story)
- **Module:** `MOD-01: Public Landing & Marketing Website`
- **Route URL:** `/company/about` (Định nghĩa tại [`AppRoutes.tsx:82`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L82))
- **Layout Type:** `LandingLayout` ([`LandingLayout.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/landing/components/LandingLayout.tsx))
- **Primary Component:** `smart-parking-app/src/features/landing/pages/AboutUsPage.tsx`
- **Sub-components:** `LandingNavbar`, `LandingFooter`
- **Access Role:** Public (Khách truy cập, Đối tác, Ứng viên tuyển dụng)
- **Discovery Status:** `VERIFIED` (Mã nguồn đã kiểm tra đối chiếu)

---

## 2. BUSINESS PURPOSE & CONTEXT

### A. Business Objective
Xây dựng niềm tin thương hiệu và giới thiệu tầm nhìn, giá trị cốt lõi của SmartTruck:
1. Trình bày hoàn cảnh thành lập dự án (năm 2024) từ vấn đề nhức nhối thực tế: Tài xế xe tải mất hàng giờ mỗi ngày tìm bãi đỗ an toàn, dẫn đến lãng phí nhiên liệu, chậm tiến độ giao hàng và rủi ro trộm cắp hàng hóa/rút trộm dầu trên xe.
2. Khẳng định sứ mệnh: Số hóa ngành hậu cần bãi đỗ xe tải tại Việt Nam và kết nối trực tiếp tài xế với chủ bãi để tối ưu hóa mặt bằng trống.
3. Là trang đích cho các liên kết pháp lý (Chính sách bảo mật, Điều khoản dịch vụ từ Footer).

### B. Target Users
- Khách hàng doanh nghiệp, Chủ bãi đỗ đang tìm hiểu về tính pháp lý và độ tin cậy của nền tảng.
- Báo chí truyền thông và các đối tác tài chính / công nghệ.

---

## 3. UI STRUCTURE & LAYOUT

- **Container:** `max-w-max-width-driver mx-auto px-container-padding py-24`.
- **Phần Header:** Tiêu đề H1 `Về SmartTruck` + Sứ mệnh ngắn.
- **Phần Câu chuyện (2 Cột):**
  - **Cột trái:** Tiêu đề H2 `Câu chuyện của chúng tôi` + 2 đoạn văn chi tiết về bối cảnh ra đời và giải pháp kết nối tài xế với chủ bãi.
  - **Cột phải:** Khối hình ảnh bãi đỗ xe tải và container (Ảnh Unsplash bo góc tròn `rounded-3xl shadow-lg`).

---

## 4. INTERACTION, DATA & BACKEND MAPPING

- **Tương tác:** Nội dung tĩnh, cuộn trang thông thường.
- **Dữ liệu:** Marketing Copy tĩnh trên Frontend.
- **Backend API:** `NONE`.

---

## 5. DISCREPANCIES & REDESIGN RECOMMENDATIONS

| Vấn đề hiện tại | Đánh giá UX | Khuyến nghị thiết kế lại |
|---|---|---|
| **Footer trỏ link "Chính sách bảo mật" và "Điều khoản dịch vụ" về `/company/about`** | Người dùng tìm đọc điều khoản pháp lý nhưng bị đưa về trang giới thiệu chung chung, không có nội dung điều khoản cụ thể. | Tách riêng 2 trang hoặc 2 tab nội dung pháp lý chuyên biệt: `/terms` (Điều khoản sử dụng) và `/privacy` (Chính sách bảo mật dữ liệu). |
| **Thiếu thông tin Đội ngũ sáng lập (Team) & Cột mốc phát triển (Timeline)** | Trang giới thiệu còn đơn sơ, chưa thể hiện được năng lực tổ chức của doanh nghiệp vận hành. | Bổ sung hình ảnh đội ngũ lãnh đạo, cố vấn ngành logistics, và sơ đồ các cột mốc phát triển của dự án. |
