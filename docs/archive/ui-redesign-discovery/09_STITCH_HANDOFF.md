# Hướng Dẫn Bàn Giao Thiết Kế Stitch (Stitch Design Handoff)

Tài liệu này là **tài liệu then chốt nhất**, được biên soạn đặc biệt để chuyển giao trực tiếp cho công cụ thiết kế giao diện **Stitch** (hoặc đội ngũ UI/UX Designer). Mọi thông số, cấu trúc bố cục, nhãn hiển thị và luồng tương tác dưới đây đều được chuẩn hóa để AI Stitch có thể sinh ra giao diện chính xác 100%, không bị bịa đặt nghiệp vụ hoặc thiếu sót tính năng.

---

## 1. Bản Sắc Thiết Kế (Design System DNA & Design Tokens)

### 1.1. Bảng Màu Chuẩn (Color Palette Tokens)
Để tạo cảm giác chuyên nghiệp, hiện đại, tin cậy và gắn liền với ngành vận tải thông minh (Smart Logistics):

- **Primary Brand Color (Màu thương hiệu chính):** `#0f766e` (Deep Teal / Emerald - Đại diện cho công nghệ xanh, bền vững, an tâm).
- **Primary Hover / Active:** `#115e59` / `#134e4a`.
- **Secondary Accent:** `#0284c7` (Sky Blue - Đại diện cho tính kết nối thời gian thực, GPS bản đồ).
- **Backgrounds:**
  - Light Mode App Background: `#f8fafc` (Slate 50).
  - Light Mode Card / Surface: `#ffffff` (Pure White).
  - Dark Mode Shell (Admin & Night Driving): `#0f172a` (Slate 900) kết hợp card `#1e293b` (Slate 800).
- **Semantic Status Colors (Màu trạng thái nghiệp vụ):**
  - **Success / Active (`PARKING`, `COMPLETED`, `APPROVED`):** `#10b981` (Emerald Green).
  - **Warning / Pending (`PENDING_PAYMENT`, `WAITING`, `PENDING_APPROVAL`):** `#f59e0b` (Amber Orange).
  - **Danger / Critical (`OVERTIME`, `CANCELLED`, `REJECTED`, `BANNED`):** `#ef4444` (Coral Red).
  - **Info (`PENDING_CHECKIN`, `NOTIFIED`):** `#3b82f6` (Royal Blue).

### 1.2. Kiểu Chữ (Typography Scale)
- **Font Family:** `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.
- **Heading 1 (Page Title):** 28px - 32px | Font weight: 700 (Bold) | Line height: 1.2.
- **Heading 2 (Card / Section Title):** 20px - 22px | Font weight: 600 (Semi-bold) | Line height: 1.3.
- **Heading 3 (Sub-header / Modal Title):** 16px - 18px | Font weight: 600 | Line height: 1.4.
- **Body Text:** 14px | Font weight: 400 (Regular) | Line height: 1.5.
- **Data Labels & Badges:** 12px | Font weight: 600 (Semi-bold) | Text transform: Uppercase / Tracking wide.
- **Display Numbers (Số tiền, Slot đếm):** 24px - 36px | Font weight: 700 | Font-variant-numeric: tabular-nums.

### 1.3. Quy Chuẩn Viền & Bo Góc (Borders & Elevation)
- **Bo góc chuẩn (Border Radius):**
  - Buttons, Inputs, Badges: `8px`.
  - Cards, Tables, Summary Panels: `12px` - `16px`.
  - Modals, Drawers: `16px` - `20px`.
- **Độ bóng đổ (Elevation Shadow):**
  - Card Shadow: `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`.
  - Floating / Dropdown: `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`.

---

## 2. Các Khung Bố Cục Chuẩn (Standard Application Shells)

### Shell 1: Public / Marketing Shell (`LandingLayout`)
- **Header:** Sticky Navbar cao 64px, Logo SmartTruck góc trái, các liên kết giải pháp ở giữa, nút Đăng nhập / Đăng ký ở góc phải.
- **Content:** Container rộng tối đa 1280px (`max-w-7xl mx-auto px-4`), bố cục thoáng đạt, xen kẽ các khối hero visual, grid tính năng và biểu đồ so sánh.
- **Footer:** Đa cột (Giải pháp, Công ty, Pháp lý, Kết nối mạng xã hội), màu nền `#0f172a`.

### Shell 2: Driver Mobile-First Portal Shell
- **Desktop View:** Top Navigation tối giản kèm chuông thông báo (có badge đỏ khi có tin mới) và User Avatar Menu (Hồ sơ, Đổi mật khẩu, Đăng xuất).
- **Mobile View (< 768px):**
  - **Top Bar:** Hiển thị Logo, nút tìm kiếm nhanh và chuông thông báo.
  - **Bottom Navigation Bar (Cố định đáy):** 4 nút bấm to dễ thao tác bằng ngón tay:
    1. `[Bản đồ]` (Trỏ về `/parking`)
    2. `[Vé của tôi]` (Trỏ về `/bookings`)
    3. `[Hàng đợi]` (Trỏ về `/queues`)
    4. `[Xe & Ví]` (Trỏ về `/vehicles`)
- **Vị trí Trợ lý AI:** Nút nổi tròn `AiChatWidget` đính tại góc dưới bên phải (trên thanh bottom bar 16px).

### Shell 3: Merchant Operations Shell (`MerchantLayout`)
- **Sidebar bên trái:** Rộng 260px (thu gọn 72px), logo SmartTruck Merchant Portal trên cùng, danh sách 9 menu chính (Tổng quan, Bãi đỗ, Booking, Quét QR, Doanh thu, Rút tiền, Hồ sơ, Tranh chấp, Thông báo kèm số lượng badge).
- **Top Header:** Nút thu/mở Sidebar, Breadcrumb dẫn đường tự động, chuông thông báo, menu tài khoản chủ bãi.
- **Main Workspace:** Nền xám nhạt `#f8fafc`, các panel thông số KPI nổi bật trên đầu trang.

### Shell 4: Admin Command Shell (`AdminLayout`)
- **Sidebar & Header:** Phong cách Dark Mode / Deep Slate, thể hiện thẩm quyền kiểm soát cao.
- **Footer:** Dòng trạng thái kiểm toán có icon `ShieldCheck` ("Kết nối bảo mật • Hệ thống ghi nhận Audit Logs").

---

## 3. Mười Nguyên Tắc Bất Di Bất Dịch Khi Thiết Kế Lại (Inviolable Rules)

1. **BẢO TOÀN DANH MỤC 5 LOẠI XE:** Bắt buộc mọi dropdown chọn xe và bảng giá phải hiển thị đủ 5 loại:
   - `SEDAN_SUV`: Ô tô con 4-7 chỗ.
   - `BUS_COACH`: Xe khách 16-45 chỗ.
   - `LIGHT_TRUCK`: Xe tải nhẹ (< 3.5 tấn).
   - `HEAVY_TRUCK`: Xe tải nặng (3.5 - 15 tấn).
   - `CONTAINER`: Xe đầu kéo & Container.
   *(Tuyệt đối không thêm xe máy, xe đạp 2 bánh).*
2. **LUÔN CÓ BƯỚC GIỮ CHỖ 10 PHÚT (HOLD TTL):** Khi bấm đặt chỗ từ chi tiết bãi đỗ, màn hình booking phải thể hiện trạng thái `PENDING_PAYMENT` kèm đồng hồ đếm ngược 10 phút để thanh toán cọc. Không được thiết kế chuyển thẳng sang thành công khi chưa thanh toán cọc.
3. **MÃ QR PHẢI CÓ TÍNH NĂNG TẢI ẢNH (DOWNLOAD QR):** Tài xế xe tải thường di chuyển vào vùng sóng yếu, do đó màn hình `SCR-017` bắt buộc phải có nút "Tải ảnh vé QR về máy" để xuất file ảnh PNG lưu vào thư viện điện thoại.
4. **CAMERA QUÉT QR CỦA CHỦ BÃI PHẢI HỖ TRỢ CẢ 2 CHIỀU:** Màn hình `SCR-036` bắt buộc phải có công tắc chọn giữa **CHECK-IN (Xe vào)** và **CHECK-OUT (Xe ra)**.
5. **NÚT XÁC NHẬN THU TIỀN MẶT TẠI CỔNG:** Trong modal quyết toán Check-out của Merchant, bắt buộc phải có nút bấm xác nhận tài xế đã nộp tiền mặt tại cổng để hoàn tất lượt đỗ tức thời khi tài xế không dùng chuyển khoản.
6. **HÀNG ĐỢI ẢO PHẢI CÓ 2 NÚT HÀNH ĐỘNG RÕ RÀNG:** Khi tài xế được thông báo có slot (`NOTIFIED`), màn hình `SCR-018` phải có nút màu xanh **"Nhận slot ngay"** và nút màu xám **"Từ chối nhường lượt"**.
7. **BẢNG GIÁ PHẢI ĐA CHIỀU (4 THÔNG SỐ GIÁ):** Khi cấu hình giá tại `SCR-033`, mỗi loại xe phải có đủ 4 ô nhập: Giá giờ (`hourlyRate`), Giá qua đêm (`overnightRate`), Phí quá giờ (`overtimeHourlyRate`) và Tiền cọc (`depositAmount`).
8. **RÚT TIỀN PHẢI CÓ QUY TRÌNH PHÊ DUYỆT:** Màn hình rút tiền Merchant (`SCR-038`) chỉ tạo yêu cầu ở trạng thái `PENDING` (bị trừ ví trước). Phải có màn hình Admin (`SCR-048`) hiển thị nút "Duyệt chi" hoặc "Từ chối".
9. **TRẠNG THÁI KIỂM DUYỆT BÃI ĐỖ:** Danh sách bãi đỗ của Merchant (`SCR-028`) và Admin (`SCR-043`) phải phân biệt rõ bằng tag màu: `APPROVED` (Đã duyệt), `PENDING_APPROVAL` (Chờ duyệt), `REJECTED` (Bị từ chối), `SUSPENDED` (Tạm dừng). Chỉ bãi `APPROVED` mới có nút Đặt chỗ phía Tài xế.
10. **KHÔNG ĐƯỢC BỎ WIDGET TRỢ LÝ AI COPILOT:** Widget AI Chat là tính năng hiện đại cốt lõi đã được kiểm chứng bằng mã nguồn, bắt buộc phải có mặt trên giao diện portal của Tài xế.

---

## 4. Hướng Dẫn Prompting Chi Tiết Cho Từng Màn Hình Cốt Lõi Trên Stitch

Dưới đây là đặc tả mẫu chuẩn hóa để đưa vào Stitch prompt cho các màn hình quan trọng nhất:

### Prompt SCR-015: SearchParkingPage (Bản đồ tìm kiếm bãi đỗ)
```text
Design an ultra-modern, high-productivity Truck & Fleet Parking Search Interface for professional logistics drivers.
Layout: Split screen. Left panel (45% width on desktop, bottom sheet on mobile) contains the Search & Filter Toolbar and scrollable Parking Lot Cards. Right panel (55% width) contains an interactive Leaflet/OpenStreetMap view with custom vehicle-friendly map pins and polyline route guidance.
Color Scheme: Emerald Teal (#0f766e) as primary brand accent, Slate Dark (#0f172a) for text/cards, pure white background with subtle gray dividers.
Key Components:
1. Top Filter Bar: Vehicle Selector dropdown (5 types: Sedan/SUV, Bus/Coach, Light Truck, Heavy Truck, Container), Distance Slider (1km to 50km, default 10km), Sort By (Distance, Lowest Price, Highest Rating), Toggle 'Include Full Lots'.
2. Smart Search Box: Input with pin icon, geolocation auto-detect button ('Locate Me'), and dropdown autocomplete suggestions.
3. Parking Lot Cards: High-density card showing lot name, distance badge (e.g., '3.2 km • 8 mins ETA'), live available slot counter (e.g., '14/20 slots available' in green tag), starting hourly price ('from 25,000 VND/h'), star rating ('★ 4.8 (124)'), and two action buttons: 'Quick Book' (primary teal) and 'Directions' (outline).
4. Inline Quick Book Drawer: Slides up when clicking 'Quick Book', allowing 1-click slot reservation without leaving the map.
```

### Prompt SCR-017: MyBookingsPage (Quản lý đặt chỗ & Vé QR)
```text
Design a professional Logistics Driver Booking Management & Digital QR Ticket Portal.
Layout: Two-column master-detail layout on desktop, responsive tabbed list with expandable drawer on mobile.
Color Scheme: Modern logistics theme with Emerald Teal (#0f766e) primary, status badges (Green for PARKING, Amber for PENDING_PAYMENT, Blue for PENDING_CHECKIN, Red for CANCELLED, Slate for COMPLETED).
Key Components:
1. Search & Filter Bar: Input searching booking code/license plate/lot name, segmented status tabs (All, Pending Check-in, Active Parking, Completed, Cancelled).
2. Booking Cards List: Displays Booking Code in bold mono font (e.g., BK-2026-8941), Parking Lot Name, Vehicle License Plate with truck category badge, scheduled arrival time, and deposit payment status.
3. Active Ticket Detail Panel:
   - High-contrast central dynamic QR Code (SVG) with a prominent 'Download QR PNG' button for offline presentation at parking gates.
   - 4-step Visual Stepper: [Reserved 10m] -> [Deposit Paid & QR Ready] -> [Vehicle In Lot (Parking)] -> [Settled & Completed].
   - Timing info: Reserved time vs Actual Check-in time.
   - Financial breakdown: Deposit amount paid (VND), Remaining balance due, Overtime penalty if applicable.
   - Action Button Row: 'Pay Deposit via PayOS' (if pending), 'Pay Final Balance' (if awaiting settlement), 'Cancel Booking' (red outline, enabled before deadline), 'Review Lot' (star icon, enabled when completed).
4. Cancel Modal: Modal explaining the 100% deposit refund policy if cancelled >1 hour prior to arrival, with reason selector and confirm button.
```

### Prompt SCR-036: MerchantQrScannerPage (Quét QR Kiểm Soát Ra/Vào)
```text
Design an ergonomic, high-throughput Parking Gate Barcode/QR Scanner Interface for parking lot attendants and merchants.
Layout: Mobile-optimized, single-column viewport designed for tablet or smartphone mounted at gate barrier.
Color Scheme: High-contrast Dark Slate background (#0f172a) with vivid Emerald (#10b981) for Check-in and Amber/Teal for Check-out to ensure readability under direct sunlight or nighttime conditions.
Key Components:
1. Top Selector: Parking lot selector dropdown (for multi-lot operators).
2. Operational Mode Segmented Switch: Big, high-visibility toggle between 'CHECK-IN (Entry)' and 'CHECK-OUT (Exit)'.
3. Live Camera Viewfinder: Centered video camera feed with animated neon scanning line, corner target brackets, and flashlight toggle button.
4. Fallback Manual Input: An input field below the camera for typing or pasting booking codes (e.g. 'BK-2026-8941') with a submit button.
5. Instant Checkout Settlement Dialog:
   - Appears immediately upon scanning a vehicle leaving the lot.
   - Displays Vehicle Plate, Total Parking Duration (e.g., '4 hours 15 mins -> Billed as 5 hours'), Total Cost, Deposit Deducted, and Remaining Cash to Collect ('AMOUNT DUE: 85,000 VND' in large 32px display font).
   - Prominent Green Button: 'Confirm Cash Received & Open Gate'.
```

### Prompt SCR-037: MerchantRevenuePage (Báo cáo Doanh thu & Ví tiền)
```text
Design an Executive Financial & Revenue Analytics Dashboard for parking lot merchants.
Layout: Dashboard grid with KPI summary cards on top, primary interactive chart in the middle, and breakdown table below.
Color Scheme: Emerald Teal (#0f766e) and Deep Navy (#0f172a) with crisp data visualizations.
Key Components:
1. Top KPI Metric Cards:
   - Total Net Revenue (formatted in VND with +12% growth badge).
   - Current Available Wallet Balance with a direct 'Request Withdrawal' CTA button.
   - Completed Bookings Counter.
   - Platform Service Fee summary.
2. Period Filter Bar: Segmented control for Granularity ('Daily', 'Monthly', 'Yearly') and Range DatePicker.
3. Interactive Composed Chart (Recharts): Bar chart showing total revenue per period combined with a line chart showing booking volume, with rich tooltip on hover.
4. Withdrawal Status Widget: Card showing recent withdrawal requests with statuses: PENDING (amber tag), PAID (green tag with bank transaction reference), REJECTED (with reason note).
```

### Prompt SCR-044: AdminParkingLotDetailPage (Thẩm định duyệt bãi đỗ xe)
```text
Design a Mission-Critical Verification & Moderation Workbench for System Administrators auditing newly submitted truck parking lots.
Layout: 2-column audit layout. Left panel contains lot credentials, interactive GPS verification map, and image inspection gallery. Right panel contains Slot Capacity & Pricing matrix with moderation action controls.
Color Scheme: Dark Command Center theme with Slate-900 background, crisp white text, and clear decision buttons (Emerald for Approve, Red for Reject, Amber for Request Changes).
Key Components:
1. Header Bar: Lot Title, Merchant Name & Verified Phone Number, Submission Timestamp, and current Status Badge ('PENDING_APPROVAL').
2. Facility Credentials Card: Full Address, GPS Coordinates with pin on Leaflet mini-map, contact phone, and detailed amenity checklist (Night lighting, Security Guard, CCTV, Restroom).
3. Ground Photo Inspection Gallery: Thumbnail grid with modal lightbox preview showing gate entrance, surface pavement, and slot layout.
4. Capacity & Pricing Audit Table: Structured 5-row table showing configured slots and hourly/overnight rates for all 5 vehicle types (Sedan, Bus, Light Truck, Heavy Truck, Container).
5. Moderation Action Footer:
   - Textarea for 'Audit Decision Reason / Feedback to Merchant'.
   - Three high-visibility buttons: 'Approve & Publish Lot' (Solid Green), 'Request Changes' (Amber Outline), 'Reject Submission' (Red Solid).
```
