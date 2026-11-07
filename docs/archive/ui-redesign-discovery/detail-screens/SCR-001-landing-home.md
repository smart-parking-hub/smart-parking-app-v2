# Screen Specification: SCR-001 LandingPage (Trang chủ Marketing)

---

## 1. SCREEN IDENTIFIER & CLASSIFICATION

- **Screen ID:** `SCR-001`
- **Screen Name:** Trang chủ giới thiệu & tìm bãi nhanh (Public Landing Home)
- **Module:** `MOD-01: Public Landing & Marketing Website`
- **Route URL:** `/` (Định nghĩa tại [`AppRoutes.tsx:69`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L69))
- **Layout Type:** `LandingLayout` ([`LandingLayout.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/landing/components/LandingLayout.tsx)) với `LandingNavbar` và `LandingFooter`
- **Primary Component:** `smart-parking-app/src/features/landing/pages/LandingPage.tsx`
- **Sub-components:**
  - `LandingNavbar`: `smart-parking-app/src/features/landing/components/LandingNavbar.tsx`
  - `LandingFooter`: `smart-parking-app/src/features/landing/components/LandingFooter.tsx`
  - `LandingHeroMap`: `smart-parking-app/src/features/landing/components/LandingHeroMap.tsx`
  - `Benefit`: Component con hiển thị thẻ giá trị cốt lõi
  - `CheckLine`: Component con hiển thị dòng tính năng kèm icon check
- **Access Role:** Public (Khách vãng lai, Tài xế, Chủ bãi, Quản trị viên)
- **Discovery Status:** `VERIFIED` (Toàn bộ component và tương tác đã được kiểm tra thực tế)

---

## 2. BUSINESS PURPOSE & CONTEXT

### A. Business Objective
Trang chủ là bộ mặt thương hiệu và phễu chuyển đổi (Conversion Funnel) đầu tiên của nền tảng SmartTruck Parking. Mục tiêu:
1. Giới thiệu giá trị sản phẩm số hóa bãi đỗ xe tải cho 2 nhóm đối tượng khách hàng mục tiêu: **Tài xế/Chủ xe tải** và **Chủ bãi đỗ (Merchant)**.
2. Trực quan hóa năng lực tìm bãi thông qua bản đồ thu nhỏ tương tác trực tiếp (`LandingHeroMap`), kích thích người dùng trải nghiệm tính năng tìm bãi thời gian thực.
3. Điều hướng người dùng mới tới luồng Đăng ký (`SCR-011`) hoặc luồng Tìm bãi đỗ xe (`SCR-015`), tự động ghi nhớ trang chuyển hướng nếu chưa đăng nhập.

### B. Target Users
- Khách vãng lai truy cập website qua công cụ tìm kiếm, mạng xã hội hoặc chiến dịch marketing.
- Tài xế xe tải cần tìm bãi đỗ khẩn cấp hoặc kiểm tra giá.
- Chủ bãi đỗ đang tìm kiếm phần mềm quản lý và kênh tăng trưởng doanh thu.

### C. Entry Points
- Truy cập trực tiếp tên miền gốc: `/`.
- Click logo "SmartTruck" trên Header `LandingNavbar` từ bất kỳ trang công cộng nào.

### D. Exit Points
- Nút "Tìm bãi đỗ" / "Tìm bãi ngay" / Click marker trên Hero Map:
  - Nếu đã đăng nhập: Chuyển hướng tới `/parking` (`SCR-015`).
  - Nếu chưa đăng nhập: Chuyển hướng tới `/login` (`SCR-010`) kèm router state `{ state: { from: '/parking' } }`.
- Nút "Đăng ký chủ bãi" / "Mở cổng quản lý":
  - Nếu đã đăng nhập: Chuyển hướng tới `/dashboard`.
  - Nếu chưa đăng nhập: Chuyển hướng tới `/register` (`SCR-011`).
- Các liên kết trên thanh điều hướng (`LandingNavbar`) và chân trang (`LandingFooter`).

---

## 3. UI STRUCTURE & LAYOUT

### A. Layout Structure (`LandingLayout`)
- Bố cục cuộn dọc toàn màn hình (Vertical Scrolling Single Page Layout):
  - **Top Navigation Bar (`LandingNavbar`):** Ghim trên đầu trang (sticky top), nền trong suốt/mờ, logo SmartTruck, 6 liên kết điều hướng, chuông thông báo và cụm CTA Đăng nhập/Đăng ký hoặc Avatar người dùng.
  - **Main Content (`main.flex-1`):** Khung chứa nội dung chính của `LandingPage`.
  - **Footer (`LandingFooter`):** Chân trang với thông tin công ty, liên kết điều hướng phân nhóm (Tài Xế, Pháp Lý, Hỗ Trợ), và bản quyền.

### B. Các Phân Đoạn Nội Dung Chính (Sections)

#### 1. Hero Section (`section.logistics-hero`)
- **Cột trái (Hero Copy):**
  - Kicker: `NỀN TẢNG BÃI ĐỖ THÔNG MINH`.
  - Tiêu đề chính H1: `Đặt chỗ xe tải chỉ trong vài giây.`
  - Đoạn mô tả: *"Kết nối tài xế với mạng lưới bãi đỗ an toàn. Theo dõi chỗ trống theo thời gian thực, đặt chỗ tức thì và quản lý hành trình dễ dàng."*
  - Khối hành động kép (Dual CTA):
    - Button chính: `Tìm bãi đỗ` (Icon `<ArrowRight />`, nền Teal chủ đạo).
    - Button phụ: `Đăng ký chủ bãi` (`className="ghost"`, viền mờ).
  - Social Proof / Trust Banner: `500+` tài xế tin dùng, `120+` bãi đỗ toàn quốc.
- **Cột phải (Product Preview & Live Hero Map):**
  - Khung giả lập giao diện trình duyệt web (Browser Chrome Mockup với 3 chấm tròn).
  - Bản đồ tương tác mini Leaflet `LandingHeroMap` hiển thị 3 bãi mẫu tại TP.HCM:
    - Bãi `An Phát – Cát Lái` (lat 10.7706, lng 106.7882, 5 chỗ, giá 35K).
    - Bãi `Tân Cảng` (lat 10.7632, lng 106.7708, 3 chỗ, giá 33K).
    - Bãi `Miền Đông mới` (lat 10.8781, lng 106.8142, 12 chỗ, giá 32K).
    - Marker tài xế, tuyến đường đứt đoạn màu vàng cam nối tới bãi gần nhất.
    - Nhãn chú thích: *"3 bãi gần bạn - Cập nhật chỗ trống trực tiếp"*.
    - Button *"Mở bản đồ tìm bãi"* tích hợp ngay trên bản đồ.
  - Hai thẻ chỉ số nhanh nổi phía dưới:
    - Thẻ 1: Icon `<CircleParking />`, số `128` chỗ trống.
    - Thẻ 2: Icon `<QrCode />`, số `42` check-in hôm nay.

#### 2. Benefits Section (`section.logistics-benefits`)
- Header: `Thiết kế riêng cho logistics` - *"Một nền tảng vận hành rõ ràng, ổn định cho ngành vận tải hạng nặng."*
- Lưới 3 thẻ lợi ích (`.benefit-grid`):
  1. **Chỗ trống thời gian thực** (Icon `<Search />`): Dữ liệu sức chứa được cập nhật liên tục để tài xế chủ động chọn điểm dừng.
  2. **Check-in an toàn** (Icon `<ShieldCheck />`): Xác thực bằng QR giúp giảm thời gian chờ và hạn chế sai lệch tại cổng bãi.
  3. **Thanh toán linh hoạt** (Icon `<CreditCard />`): Đặt cọc, thanh toán và lưu lịch sử giao dịch trên cùng một hệ thống.

#### 3. Audience Section - Split Driver vs Owner (`section.logistics-audience`)
- **Khối Tài xế:**
  - Ảnh bãi đỗ xe thực tế có huy hiệu *"Đã xác nhận chỗ đỗ"*.
  - Nhãn phụ: `DÀNH CHO TÀI XẾ`.
  - Tiêu đề H2: `Lộ trình chủ động, không còn phỏng đoán.`
  - 3 dòng tính năng:
    - Lọc bãi theo loại phương tiện và tình trạng còn chỗ.
    - Đặt chỗ, thanh toán và nhận mã QR trong một luồng.
    - Theo dõi lịch sử đặt chỗ và hóa đơn rõ ràng.
  - CTA Button: `Tìm bãi ngay` (Icon `<ArrowRight />`).
- **Khối Chủ bãi:**
  - Nhãn phụ: `DÀNH CHO CHỦ BÃI`.
  - Tiêu đề H2: `Tối ưu doanh thu trên từng vị trí đỗ.`
  - 3 dòng tính năng:
    - Cấu hình slot và bảng giá theo loại xe.
    - Theo dõi doanh thu và booking hoàn thành.
    - Check-in/check-out nhanh bằng mã QR.
  - CTA Button: `Mở cổng quản lý` (Icon `<ArrowRight />`).
  - Widget biểu đồ cột doanh thu giả lập (`.revenue-preview`):
    - Chỉ số tăng trưởng: `Doanh thu +14%`.
    - Biểu đồ 7 cột thể hiện xu hướng doanh thu theo tuần/tháng.
    - Chú thích: Icon `<BarChart3 />` *"Báo cáo vận hành theo thời gian thực"*.

---

## 4. INTERACTION SPECIFICATION

| Tên Phần Tử | Loại UI | Hành Động | Điều Kiện | Phản Hồi Giao Diện | Điều Hướng / Kết Quả | Mã Nguồn / Bằng Chứng |
|---|---|---|---|---|---|---|
| **Nút "Tìm bãi đỗ"** (Hero) | Button | Click | Không có | Kích hoạt hàm `openDriver()` | Nếu đã có session: `/parking`<br>Nếu chưa có session: `/login` (kèm `state: { from: '/parking' }`) | [LandingPage.tsx:11](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/landing/pages/LandingPage.tsx#L11) |
| **Nút "Đăng ký chủ bãi"** (Hero) | Button | Click | Không có | Kích hoạt hàm `openOwner()` | Nếu đã có session: `/dashboard`<br>Nếu chưa có session: `/register` | [LandingPage.tsx:12](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/landing/pages/LandingPage.tsx#L12) |
| **Bản đồ Hero Leaflet** | Map Canvas | Click marker bãi đỗ | Không có | Tooltip mở ra, click marker kích hoạt `onOpenSearch` | Kích hoạt `openDriver()` tương tự nút tìm bãi | [LandingHeroMap.tsx:22](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/landing/components/LandingHeroMap.tsx#L22) |
| **Nút "Mở bản đồ tìm bãi"** | Button (trong map) | Click | Không có | Kích hoạt `onOpenSearch` | Kích hoạt `openDriver()` | [LandingHeroMap.tsx:29](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/landing/components/LandingHeroMap.tsx#L29) |
| **Nút "Tìm bãi ngay"** (Audience) | Button | Click | Không có | Kích hoạt `openDriver()` | Kích hoạt `openDriver()` | [LandingPage.tsx:39](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/landing/pages/LandingPage.tsx#L39) |
| **Nút "Mở cổng quản lý"** (Audience) | Button | Click | Không có | Kích hoạt `openOwner()` | Kích hoạt `openOwner()` | [LandingPage.tsx:40](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/landing/pages/LandingPage.tsx#L40) |
| **Menu Burger Mobile** | Button Icon | Click | Màn hình mobile `< md` | Đổi icon Menu <-> X | Toggle class `open` trên `.nav-links` | [LandingNavbar.tsx:48](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/landing/components/LandingNavbar.tsx#L48) |
| **Avatar Menu Dropdown** | Dropdown | Click | Người dùng đã đăng nhập | Mở menu xổ xuống có SĐT, vai trò, Hồ sơ, Đăng xuất | Xem thông tin hoặc Đăng xuất | [LandingNavbar.tsx:24-39](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/landing/components/LandingNavbar.tsx#L24-L39) |

---

## 5. DATA SPECIFICATION

Toàn bộ dữ liệu hiển thị trên `SCR-001: LandingPage` hiện tại là **Hardcoded Mock Data (Client-side DTO)**, chưa có API kết nối động:

| Tên Dữ Liệu | Kiểu Dữ Liệu | Giá Trị Hiện Tại | Mục Đích Hiển Thị | Nguồn Dữ Liệu Thực Tế |
|---|---|---|---|---|
| `yards` | Array of Objects | 3 bãi: An Phát (10.7706, 106.7882, 5 chỗ, 35K), Tân Cảng (10.7632, 106.7708, 3 chỗ, 33K), Miền Đông mới (10.8781, 106.8142, 12 chỗ, 32K) | Render marker và giá bãi xe trên bản đồ mini Leaflet | [LandingHeroMap.tsx:5-9](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/landing/components/LandingHeroMap.tsx#L5-L9) (Hardcoded) |
| `statDrivers` | String | `"500+" tài xế tin dùng` | Social proof uy tín | [LandingPage.tsx:22](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/landing/pages/LandingPage.tsx#L22) (Hardcoded) |
| `statYards` | String | `"120+" bãi đỗ toàn quốc` | Quy mô mạng lưới | [LandingPage.tsx:22](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/landing/pages/LandingPage.tsx#L22) (Hardcoded) |
| `statEmptySpots` | Number | `128` | Số chỗ trống tổng quan | [LandingPage.tsx:27](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/landing/pages/LandingPage.tsx#L27) (Hardcoded) |
| `statTodayCheckins`| Number | `42` | Số xe check-in hôm nay | [LandingPage.tsx:27](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/landing/pages/LandingPage.tsx#L27) (Hardcoded) |
| `revenueGrowth` | String | `"+14%"` | Tăng trưởng doanh thu cho Merchant | [LandingPage.tsx:41](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/landing/pages/LandingPage.tsx#L41) (Hardcoded) |
| `revenueBars` | Array of Numbers | `[36, 55, 27, 68, 86, 100, 52]` | Chiều cao (%) của 7 cột biểu đồ | [LandingPage.tsx:41](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/landing/pages/LandingPage.tsx#L41) (Hardcoded) |

---

## 6. UI STATES & EDGE CASES

- **Trạng thái Khách vãng lai (GUEST / Unauthenticated):**
  - Navbar hiển thị 2 nút: "Đăng nhập" (`/login`) và "Đăng ký" (`/register`).
  - Khi bấm bất kỳ nút "Tìm bãi đỗ" nào, hệ thống điều hướng sang `/login` kèm `state: { from: '/parking' }` để sau khi đăng nhập thành công sẽ tự động đưa người dùng đến bản đồ tìm bãi.
  - Khi bấm nút "Đăng ký chủ bãi", hệ thống chuyển hướng sang `/register`.
- **Trạng thái Người dùng Đã Đăng Nhập (Authenticated):**
  - Navbar hiển thị Icon chuông thông báo (link tới `/notifications`) và Nút tròn User Avatar có dropdown menu hiển thị: Tên vai trò (`Tài xế` / `Chủ bãi` / `Quản trị viên`), Số điện thoại, Link tới Hồ sơ và Nút Đăng xuất.
  - Khi bấm nút "Tìm bãi đỗ", hệ thống đưa thẳng vào `/parking`.
  - Khi bấm nút "Đăng ký chủ bãi", hệ thống chuyển sang `/dashboard`.
- **Trạng thái Bản đồ Hero Map:**
  - Nếu Leaflet tile layer OpenStreetMap chậm tải do mạng, bản đồ vẫn hiển thị nền xám cùng các marker và nhãn chú thích đã được tạo sẵn.

---

## 7. BACKEND MAPPING & EVIDENCE

- **Backend API phục vụ Landing Page:** `UNKNOWN` / `NONE`.
  - Trong `SecurityConfig.java:61` và `JwtAuthenticationFilter.java:31`, Backend Spring Security có cấu hình `.requestMatchers("/api/v1/public/**").permitAll()`.
  - Tuy nhiên, qua rà soát toàn bộ Controller phía Backend, **hoàn toàn không có Controller nào map tiền tố `/api/v1/public/**`**. Mọi số liệu thống kê và bãi đỗ trên Landing Page đều đang chạy bằng dữ liệu tĩnh ở Frontend.
- **Tài nguyên hình ảnh:** Sử dụng URL ảnh tĩnh lưu trữ trên CDN Google và Unsplash:
  - Ảnh bãi đỗ xe tải: `lh3.googleusercontent.com/aida-public/...` ([LandingPage.tsx:7](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/landing/pages/LandingPage.tsx#L7)).
  - Bản đồ nền: OpenStreetMap Tile Server (`tile.openstreetmap.org`).

---

## 8. DISCREPANCIES & REDESIGN RECOMMENDATIONS

| Vấn đề hiện tại | Đánh giá UX / Kỹ thuật | Khuyến nghị thiết kế lại |
|---|---|---|
| **Toàn bộ số liệu và danh sách bãi là dữ liệu tĩnh (Hardcoded)** | Số liệu chỗ trống (`128`), lượt check-in (`42`), bãi gần bạn không phản ánh tình trạng thực tế của cơ sở dữ liệu. Bãi đỗ trên Hero map chỉ hiển thị 3 bãi cố định ở Cát Lái/Tân Cảng. | Backend cần cung cấp endpoint công khai `GET /api/v1/public/stats` (trả về tổng số bãi đã duyệt, tổng slot trống thời gian thực) và `GET /api/v1/public/featured-parking-lots` để bản đồ hiển thị dữ liệu thật theo tọa độ GPS của khách truy cập. |
| **Thiếu Ô Nhập Tìm Kiếm Trực Tiếp Tại Hero Banner** | Hero banner chỉ có nút bấm "Tìm bãi đỗ" chung chung, chưa có ô input cho phép tài xế gõ trực tiếp địa điểm cần tìm (ví dụ: "Cảng Cát Lái", "KCN Sóng Thần") ngay tại trang chủ. | Bổ sung thanh tìm kiếm nhanh (Quick Search Bar) tích hợp Autocomplete gợi ý địa điểm ngay giữa Hero Section; khi gõ và Enter sẽ chuyển sang `/parking` kèm từ khóa tìm kiếm đã chọn. |
| **Bản Đồ Hero Map Bị Vô Hiệu Hóa Tương Tác Cuộn (ScrollWheelZoom = false)** | Để tránh xung đột khi cuộn trang, bản đồ bị khóa zoom bằng chuột, nhưng chưa có nút điều khiển zoom (+/-) rõ ràng trên giao diện. | Thêm bộ nút điều khiển Zoom trực quan hoặc hiển thị nút phóng to toàn màn hình chuyển sang `/parking`. |
