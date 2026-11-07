# Báo Cáo Kiểm Toán UI/UX Hiện Trạng (Current UI/UX Audit)

Tài liệu này đánh giá khách quan toàn bộ hệ thống giao diện người dùng hiện tại của **SmartParkingHub**, phân tách rõ ràng thành 4 khía cạnh: **Những gì hệ thống đang có (What exists)**, **Những gì đang hoạt động tốt (What works)**, **Những điểm bất cập / chưa hợp lý (What is problematic)** và **Các đề xuất cải tiến khi thiết kế lại bằng Stitch (What should improve)**.

---

## 1. PHẦN A: NHỮNG GÌ HỆ THỐNG ĐANG CÓ (WHAT EXISTS)

### 1.1. Hệ thống Layout & Điều hướng
- **3 Layouts chính thức:**
  1. `LandingLayout`: Bao gồm `LandingNavbar` (Logo, menu liên kết, chuông thông báo, Avatar menu) và `LandingFooter` (4 cột liên kết). Được dùng cho cả trang Landing công cộng và các màn hình chính của Tài xế (`/parking`, `/bookings`, `/queues`, `/payments`, `/vehicles`, `/profile`).
  2. `AuthLayout`: Bố cục chia đôi màn hình (Split-screen) - bên trái là banner giới thiệu thương hiệu và hình vẽ xe tải, bên phải là form đăng nhập / đăng ký.
  3. `MerchantLayout` & `AdminLayout`: Bố cục Sider truyền thống (Sidebar cố định bên trái, Header phía trên có Breadcrumbs và nút thu/mở menu, vùng Content hiển thị nội dung).
- **Trợ lý AI Copilot:** Component `AiChatWidget` được nhúng ở cấp độ Layout, hiển thị dưới dạng nút tròn nổi cố định góc dưới bên phải màn hình tài xế.

### 1.2. Thư viện Component & Design Tokens
- **UI Toolkit:** Sử dụng kết hợp **Ant Design v6.5** và **Tailwind CSS v4**.
- **Màu sắc chủ đạo đã cấu hình:** `colorPrimary = #0f766e` (Teal Emerald), bo góc `borderRadius = 8px`.
- **Hệ thống Icon:** Kết hợp cả `@ant-design/icons` và `lucide-react`.
- **Bản đồ:** Thư viện `leaflet` với các tile OpenStreetMap.
- **Biểu đồ:** Thư viện `recharts` (ComposedChart, Bar, Line).
- **Phần cứng:** Thư viện `html5-qrcode` tích hợp truy cập camera thiết bị để quét mã vạch/QR.

---

## 2. PHẦN B: NHỮNG GÌ ĐANG HOẠT ĐỘNG TỐT (WHAT WORKS)

1. **Trải nghiệm Tìm kiếm Bản đồ Tương tác (`SCR-015`):**
   - Sự phối hợp giữa bản đồ Leaflet, ghim marker bãi đỗ, tính toán khoảng cách GPS và vẽ đường dẫn (Polyline) mang lại tính trực quan cao cho tài xế đang chạy xe.
   - Panel xem nhanh bãi đỗ (Quick View) và panel đặt nhanh (Inline Quick Book) giúp rút ngắn đáng kể số lần chuyển trang.
2. **Quy trình Quét mã QR tại cổng (`SCR-036`):**
   - Camera quét mã QR chạy mượt mà ngay trên trình duyệt web di động của Merchant mà không yêu cầu cài ứng dụng native.
   - Cơ chế toggle nhanh giữa **CHECK-IN** và **CHECK-OUT** kèm nút bấm khẩn cấp **"Xác nhận đã thu tiền mặt tại cổng"** giải quyết đúng bài toán tắc nghẽn barie thực tế.
3. **Biểu đồ Doanh thu linh hoạt (`SCR-037`):**
   - Chuyển đổi mượt mà giữa các độ mịn thời gian (Theo ngày `DAY`, Theo tháng `MONTH`, Theo năm `YEAR`) kết hợp biểu đồ cột và đường xu hướng giúp Merchant nắm bắt doanh số rõ ràng.
4. **Cơ chế Giữ chỗ 10 phút rõ ràng:**
   - Hiển thị đồng hồ đếm ngược và thông báo thời hạn giữ cọc giúp tài xế chủ động thanh toán hoặc hủy đơn mà không bị trừ tiền oan.

---

## 3. PHẦN C: NHỮNG ĐIỂM CHƯA HỢP LÝ & BẤT CẬP (WHAT IS PROBLEMATIC)

### 3.1. Phân mảnh phong cách giao diện (Visual & Layout Divergence)
- **Vấn đề đã xác minh:** Cổng Tài xế (`DRIVER`) sử dụng `LandingNavbar` (phong cách website thông tin với thanh menu ngang ở trên), trong khi Cổng Chủ bãi (`MERCHANT`) và Quản trị (`ADMIN`) lại dùng Sidebar phong cách Dashboard chuyên nghiệp. Điều này tạo cảm giác như 2 sản phẩm phần mềm hoàn toàn khác nhau.
- **Hệ quả:** Tài xế khi dùng trên desktop cảm thấy thanh menu quá dàn trải, khó truy cập nhanh các chức năng quản lý cá nhân.

### 3.2. Xung đột hệ thống Token & CSS Class (Style Fragmentation)
- **Vấn đề đã xác minh:** Trong mã nguồn tồn tại song song 3 hệ thống định dạng:
  1. Ant Design tokens (`colorPrimary: #0f766e`).
  2. Tailwind CSS classes (`bg-background`, `text-on-background`).
  3. Hơn 3000 dòng CSS tùy biến thủ công với tiền tố `.stitch-*` nằm trong file `src/index.css`.
- **Hệ quả:** Nhiều component bị ghi đè màu sắc không đồng nhất; xuất hiện tình trạng một số nút có màu xanh Teal, một số nút lại có màu xanh dương Ant Design mặc định hoặc màu xám đậm.

### 3.3. Trải nghiệm Bảng dữ liệu trên Di động (Mobile Table Usability)
- **Vấn đề đã xác minh:** Các bảng dữ liệu phức tạp tại `SCR-017: MyBookingsPage`, `SCR-019: DriverPaymentsPage` và `SCR-034: MerchantBookingsPage` sử dụng `Table` nguyên bản của Ant Design.
- **Hệ quả:** Khi xem trên màn hình smartphone (chiều rộng < 480px), bảng bị tràn ngang (horizontal scroll), các cột bị ép nhỏ khiến tài xế rất khó bấm nút "Thanh toán", "Xem QR" hoặc "Hủy đặt chỗ".

### 3.4. Trùng lặp đường dẫn định tuyến (Route Redundancy)
- **Vấn đề đã xác minh:** Trong `AppRoutes.tsx`, tồn tại các route trùng lặp phục vụ cùng một giao diện:
  - `/parking` và `/dashboard/search` đều trỏ về `SearchParkingPage`.
  - `/vehicles` và `/dashboard/vehicles` đều trỏ về `VehiclesPage`.
- **Hệ quả:** Gây bối rối cho người dùng khi lưu bookmark và làm phức tạp hóa trạng thái Active của menu điều hướng.

### 3.5. Phản hồi lỗi chưa nhất quán (Error Feedback Inconsistency)
- **Vấn đề đã xác minh:** Một số form sử dụng thông báo lỗi inline dưới từng ô nhập liệu (Ant Design Form validation), trong khi một số thao tác khác lại chỉ hiển thị popup toast `message.error(...)` biến mất sau 3 giây.
- **Hệ quả:** Khi gặp lỗi nghiệp vụ dài (ví dụ: bãi xe chưa duyệt, thẻ ngân hàng sai định dạng), tài xế không kịp đọc nội dung lỗi trên toast message.

---

## 4. PHẦN D: ĐỀ XUẤT CẢI TIẾN CHO DỰ ÁN THIẾT KẾ STITCH (WHAT SHOULD IMPROVE)

Khi tiến hành thiết kế lại toàn bộ giao diện bằng Stitch, cần tuân thủ các nguyên tắc cải tiến sau:

1. **Chuẩn hóa Ngôn ngữ Thiết kế Nhất quán (Unified Design System):**
   - **Bảng màu chủ đạo (Color Palette):**
     - Primary: Emerald Teal (`#0f766e` - Màu xanh ngọc logistics bền vững, tin cậy).
     - Surface / Background: Sáng sang trọng (`#f8fafc` / `#ffffff`) và Tối hiện đại (`#0f172a` Slate Dark).
     - Accent: Hổ phách Amber (`#f59e0b` cho cảnh báo, trạng thái chờ thanh toán) và Xanh lá Emerald (`#10b981` cho thành công, xe đang đỗ).
     - Danger: Đỏ san hô (`#ef4444` cho hủy đơn, phạt quá giờ).
   - **Typography:** Đồng bộ toàn hệ thống sang font chữ **Inter** với phân cấp rõ ràng (Heading 1: 28px/32px Bold, Body text: 14px/20px Regular, Data label: 12px Medium Uppercase).
2. **Thiết kế Mobile-First cho Cổng Tài Xế:**
   - Thay thế menu ngang trên di động bằng **Bottom Navigation Bar (Thanh điều hướng đáy màn hình)** gồm 4 tab chính: `[Khám phá bãi]` • `[Đặt chỗ]` • `[Hàng đợi]` • `[Tài khoản]`.
   - Chuyển đổi toàn bộ Bảng (`Table`) trên di động thành **Thẻ thông tin xếp chồng (Card-based Layout)**, giúp tài xế bấm nút "Quét QR" hoặc "Thanh toán" dễ dàng chỉ bằng một ngón tay cái.
3. **Nâng cấp Giao diện Camera Quét QR của Merchant:**
   - Tạo khung ngắm quét QR (Target Viewfinder) có hiệu ứng laser quét động.
   - Thêm nút bật đèn Flash điện thoại hỗ trợ quét ban đêm.
   - Modal hiển thị kết quả quyết toán to rõ, tách biệt số tiền cọc đã trả và số tiền mặt cần thu bằng font chữ kích thước lớn (Display numbers).
4. **Trực quan hóa Luồng Đặt chỗ 2 Giai đoạn:**
   - Thiết kế Stepper (thanh tiến trình 4 bước) trên đầu chi tiết booking:
     `[1. Giữ chỗ] ──► [2. Đã cọc & Có QR] ──► [3. Đang đỗ tại bãi] ──► [4. Quyết toán ra bãi]`.
   - Giúp cả tài xế và chủ bãi luôn biết chính xác chiếc xe đang ở giai đoạn nào của hành trình đỗ xe.
