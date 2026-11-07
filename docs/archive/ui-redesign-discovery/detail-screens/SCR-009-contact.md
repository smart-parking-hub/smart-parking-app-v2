# Screen Specification: SCR-009 ContactPage (Liên hệ)

---

## 1. SCREEN IDENTIFIER & CLASSIFICATION

- **Screen ID:** `SCR-009`
- **Screen Name:** Tiếp nhận thông tin liên hệ & Hỗ trợ khách hàng (Contact Us)
- **Module:** `MOD-01: Public Landing & Marketing Website`
- **Route URL:** `/company/contact` (Định nghĩa tại [`AppRoutes.tsx:85`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L85))
- **Layout Type:** `LandingLayout` ([`LandingLayout.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/landing/components/LandingLayout.tsx))
- **Primary Component:** `smart-parking-app/src/features/landing/pages/ContactPage.tsx`
- **Sub-components:** `LandingNavbar`, `LandingFooter`, Form liên hệ, Khối thông tin văn phòng
- **Access Role:** Public (Khách truy cập, Đối tác bãi đỗ, Khách hàng cần hỗ trợ kỹ thuật)
- **Discovery Status:** `VERIFIED` (Mã nguồn đã kiểm tra đối chiếu)

---

## 2. BUSINESS PURPOSE & CONTEXT

### A. Business Objective
Cung cấp kênh tiếp nhận thông tin hai chiều giữa khách hàng/đối tác và ban điều hành SmartTruck:
1. Tiếp nhận yêu cầu báo giá gói Doanh nghiệp (`/pricing` -> chuyển sang đây).
2. Tiếp nhận đề xuất hợp tác bãi đỗ xe từ các đơn vị sở hữu mặt bằng.
3. Hỗ trợ kỹ thuật, khiếu nại dịch vụ 24/7 cho tài xế và chủ bãi.
4. Cung cấp thông tin địa chỉ văn phòng thực tế, số điện thoại tổng đài và email hỗ trợ để tăng tính xác thực cho nền tảng.

### B. Target Users
- Doanh nghiệp vận tải cần báo giá gói B2B.
- Chủ bãi đỗ muốn được khảo sát mặt bằng và kết nối bãi đỗ.
- Khách hàng gặp khó khăn trong quá trình sử dụng hệ thống.

### C. Entry Points
- Liên kết "Liên hệ" từ `LandingFooter` (`<Link to="/company/contact">Liên hệ</Link>`).
- Nút "Nhận báo giá" từ gói Đội xe trên trang `PricingPage` (`SCR-004`).
- Truy cập trực tiếp qua URL: `/company/contact`.

### D. Exit Points
- Gửi tin nhắn thành công.
- Các liên kết trên `LandingNavbar` và `LandingFooter`.

---

## 3. UI STRUCTURE & LAYOUT

### A. Bố Cục Tổng Thể
- Container căn giữa (`max-w-max-width-driver mx-auto px-container-padding py-24`).
- Header tiêu đề trung tâm: Tiêu đề H1 `Liên hệ với chúng tôi` + Phụ đề giới thiệu đội ngũ hỗ trợ 24/7.
- Lưới 2 cột nội dung chính (`grid md:grid-cols-2 gap-12`).

### B. Cột Trái: Khung Biểu Mẫu Gửi Tin Nhắn (`.bg-surface.border.rounded-3xl.p-8`)
- Tiêu đề khối: `Gửi tin nhắn`.
- Cấu trúc Form (`<form className="space-y-4">`):
  1. Trường Họ và tên: Input text, placeholder `"Nguyễn Văn A"`.
  2. Trường Email: Input email, placeholder `"email@example.com"`.
  3. Trường Nội dung: Textarea (chiều cao h-32, không cho resize `resize-none`), placeholder `"Bạn cần hỗ trợ gì?"`.
  4. Nút bấm Submit: `Gửi yêu cầu` (`button.w-full.bg-primary.text-white`).

### C. Cột Phải: Khối Thông Tin Liên Hệ & Bản Đồ
1. **Thẻ Thông Tin Trụ Sở (`.bg-surface-container.rounded-3xl.p-8`):**
   - Tiêu đề: `Thông tin liên hệ`.
   - Địa chỉ: Icon `location_on` - `123 Đường Nguyễn Hữu Cảnh, Bình Thạnh, TP.HCM`.
   - Tổng đài: Icon `phone` - `1900 1234 (Tổng đài 24/7)`.
   - Email: Icon `mail` - `support@smarttruck.vn`.
2. **Khung Bản Đồ Văn Phòng Placeholder:**
   - Khung viền bo tròn tối giản với icon `map` và nhãn `"Bản đồ Văn phòng"`.

---

## 4. INTERACTION SPECIFICATION

| Tên Phần Tử | Loại UI | Hành Động | Trạng Thái Code Hiện Tại | Phản Hồi Hệ Thống Thực Tế | Đánh Giá Kỹ Thuật |
|---|---|---|---|---|---|
| **Input Họ và tên** | Text Input | Nhập liệu | Chưa gắn `value` / `onChange` | Trình duyệt ghi nhận ký tự tự do | Chưa bind React state |
| **Input Email** | Email Input | Nhập liệu | Chưa gắn `value` / `onChange` | Trình duyệt ghi nhận ký tự tự do | Chưa bind React state |
| **Textarea Nội dung**| Textarea | Nhập liệu | Chưa gắn `value` / `onChange` | Trình duyệt ghi nhận ký tự tự do | Chưa bind React state |
| **Nút "Gửi yêu cầu"**| Submit Button | Click | `<form>` không có thuộc tính `onSubmit` | Form submit reload lại trang (hành vi mặc định HTML) | **Form chưa hoạt động (Chưa kết nối API/EmailJS)** |

---

## 5. DATA SPECIFICATION

| Tên Field | Nhãn UI | Kiểu Dữ Liệu | Bắt Buộc | Validation Hiện Tại | Dữ Liệu Lưu Trữ |
|---|---|---|:---:|---|---|
| `fullName` | Họ và tên | String | Chưa bắt buộc | Chưa kiểm tra | Chưa lưu trữ |
| `email` | Email | String | Chưa bắt buộc | Kiểm tra email mặc định của trình duyệt HTML5 | Chưa lưu trữ |
| `message` | Nội dung | String | Chưa bắt buộc | Chưa kiểm tra | Chưa lưu trữ |

---

## 6. BACKEND MAPPING & EVIDENCE

- **Backend API:** `NONE`.
  - Trong Backend `smart-parking-service`, không có Controller tiếp nhận phản hồi liên hệ hoặc contact form.
- **Tài Liệu Cũ vs Thực Tế (Critical Finding):**
  - Tài liệu sơ bộ trước đây (`03_SCREEN_INVENTORY.md:19` và `module-public-landing.md:47`) ghi chú rằng `ContactPage` kết nối tới thư viện EmailJS (`emailJsApi.ts`) để gửi mail trực tiếp.
  - **Bằng chứng mã nguồn thực tế:** File `ContactPage.tsx` **hoàn toàn không import và không sử dụng `emailJsApi.ts`**. Hàm `sendOtpEmail` trong `emailJsApi.ts` chỉ được dùng tại `ForgotPasswordPage.tsx`. Biểu mẫu tại `ContactPage.tsx` hiện tại là một form HTML tĩnh chưa được kết nối logic xử lý.

---

## 7. DISCREPANCIES & REDESIGN RECOMMENDATIONS

| Vấn đề hiện tại | Đánh giá Kỹ thuật / UX | Khuyến nghị thiết kế lại |
|---|---|---|
| **Biểu mẫu liên hệ chưa có sự kiện xử lý (Unconnected Form)** | Người dùng điền thông tin và bấm "Gửi yêu cầu" thì trang bị tải lại mà tin nhắn không được gửi đi đâu. | Bổ sung hàm xử lý `onSubmit` kết nối tới API lưu liên hệ vào cơ sở dữ liệu `POST /api/v1/public/contact` (hoặc gửi qua EmailJS/SendGrid), hiển thị thông báo thành công `message.success('Cảm ơn bạn! Chúng tôi đã nhận được thông tin.')` và xóa sạch dữ liệu form. |
| **Thiếu Trường Số Điện Thoại & Chủ Đề Liên Hệ** | Người gửi chỉ có Email, thiếu Số điện thoại khiến bộ phận CSKH khó gọi lại hỗ trợ ngay. Thiếu phân loại chủ đề khiến việc phân luồng xử lý bị chậm. | Bổ sung trường "Số điện thoại" (bắt buộc) và Dropdown chọn "Chủ đề": Hợp tác bãi đỗ / Báo giá doanh nghiệp / Hỗ trợ kỹ thuật / Khác. |
| **Khung Bản Đồ Văn Phòng Chỉ Là Placeholder** | Chỉ có icon `map` và chữ "Bản đồ Văn phòng", không hiển thị bản đồ số thực tế. | Tích hợp bản đồ Leaflet hoặc nhúng Google Maps iframe định vị chính xác địa chỉ văn phòng công ty. |
