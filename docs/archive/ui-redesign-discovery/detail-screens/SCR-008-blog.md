# Screen Specification: SCR-008 BlogPage (Tin tức & Blog)

---

## 1. SCREEN IDENTIFIER & CLASSIFICATION

- **Screen ID:** `SCR-008`
- **Screen Name:** Blog chuyên ngành, Cẩm nang & Tin tức (Industry Blog & News)
- **Module:** `MOD-01: Public Landing & Marketing Website`
- **Route URL:** `/company/blog` (Định nghĩa tại [`AppRoutes.tsx:84`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L84))
- **Layout Type:** `LandingLayout` ([`LandingLayout.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/landing/components/LandingLayout.tsx))
- **Primary Component:** `smart-parking-app/src/features/landing/pages/BlogPage.tsx`
- **Sub-components:** `LandingNavbar`, `LandingFooter`
- **Access Role:** Public (Bạn đọc, Tài xế, Chủ bãi đỗ, Chuyên viên logistics)
- **Discovery Status:** `VERIFIED` (Mã nguồn đã kiểm tra đối chiếu)

---

## 2. BUSINESS PURPOSE & CONTEXT

### A. Business Objective
Kênh truyền thông nội dung chuyên sâu (Content Marketing & SEO) phục vụ mục đích:
1. Thu hút lưu lượng truy cập tự nhiên (Organic Search Traffic) từ Google thông qua các bài viết cẩm nang giải quyết vấn đề thực tế: Tiết kiệm nhiên liệu khi chạy xe đường dài, mẹo tăng doanh thu bãi đỗ xe, quy định cấm tải nội đô các thành phố lớn.
2. Nâng cao uy tín thương hiệu SmartTruck như một chuyên gia đầu ngành trong lĩnh vực giải pháp công nghệ bãi đỗ xe tải.
3. Thông báo các bản cập nhật tính năng mới của sản phẩm.

### B. Target Users
- Tài xế tìm kiếm thông tin về luật giao thông đường bộ và kinh nghiệm vận hành xe.
- Chủ bãi đỗ tìm kiếm giải pháp tối ưu doanh thu.

---

## 3. UI STRUCTURE & LAYOUT

- **Container:** `max-w-max-width-driver mx-auto px-container-padding py-24`.
- **Header:** Tiêu đề H1 `Blog & Tin Tức` + Đoạn giới thiệu mục đích trang.
- **Lưới Bài Viết 3 Cột (`grid md:grid-cols-3 gap-8`):**
  - **Bài 1:**
    - Ảnh đại diện xe tải (Unsplash photo).
    - Danh mục: `Giải pháp Tài xế` (Màu primary teal).
    - Ngày đăng: `28/07/2026`.
    - Tiêu đề H3: `Tối ưu hóa nhiên liệu với phần mềm tìm bãi đỗ`.
  - **Bài 2:**
    - Ảnh đại diện bãi đỗ xe.
    - Danh mục: `Chủ bãi đỗ`.
    - Ngày đăng: `25/07/2026`.
    - Tiêu đề H3: `Kinh nghiệm tăng 30% doanh thu bãi đỗ xe tải`.
  - **Bài 3:**
    - Ảnh đại diện công nghệ logistics.
    - Danh mục: `Sản phẩm`.
    - Ngày đăng: `20/07/2026`.
    - Tiêu đề H3: `SmartTruck ra mắt tính năng đặt chỗ qua API`.

---

## 4. INTERACTION SPECIFICATION

| Tên Phần Tử | Loại UI | Hành Động | Trạng Thái Hiện Tại | Đánh Giá Kỹ Thuật |
|---|---|---|---|---|
| **Thẻ bài viết (Blog Card)** | Div Card | Hover chuột | Phóng to nhẹ, đổi màu tiêu đề sang Teal | Có hiệu ứng hover CSS |
| **Thẻ bài viết (Blog Card)** | Div Card | Click | **Không có liên kết** (Không dẫn tới `/company/blog/:id`) | `PARTIALLY_IMPLEMENTED` / Chưa có trang chi tiết bài viết |

---

## 5. BACKEND MAPPING & EVIDENCE

- **Backend API:** `NONE`.
- Danh sách 3 bài viết được khai báo cứng trong component `BlogPage.tsx:5-9`.
- Cơ sở dữ liệu hiện tại không có bảng `posts` hay `articles`.

---

## 6. DISCREPANCIES & REDESIGN RECOMMENDATIONS

| Vấn đề hiện tại | Đánh giá Kỹ thuật | Khuyến nghị thiết kế lại |
|---|---|---|
| **Các bài viết không thể click mở bài đọc chi tiết** | Người dùng bấm vào bài viết không đọc được nội dung đầy đủ. | Bổ sung route chi tiết bài viết `/company/blog/:slug` và màn hình `BlogDetailPage` hiển thị bài viết hoàn chỉnh (kèm chia sẻ mạng xã hội, mục lục, bài viết liên quan). |
| **Nội dung bị ghim cứng (Hardcoded)** | Không có CMS hoặc API để đội ngũ Marketing đăng tải bài viết mới. | Xây dựng API quản lý bài viết công khai hoặc tích hợp Headless CMS (Strapi/WordPress/Notion API) để xuất bản bài viết động. |
