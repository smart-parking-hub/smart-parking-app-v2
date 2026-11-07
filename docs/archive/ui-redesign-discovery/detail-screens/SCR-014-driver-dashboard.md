# Screen Specification: SCR-014 DashboardHomePage (Tổng quan Tài xế)

---

## 1. SCREEN IDENTIFIER & CLASSIFICATION

- **Screen ID:** `SCR-014`
- **Screen Name:** Bảng điều khiển tổng quan tài xế (Driver Dashboard Home)
- **Module:** `MOD-03: Driver Operations Portal`
- **Route URL:** `/dashboard` (Định nghĩa tại [`AppRoutes.tsx:143`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L143) bọc bởi `DashboardLayout`)
- **Primary Component:** `smart-parking-app/src/features/dashboard/pages/DashboardHomePage.tsx` (Component con `DriverDashboard`)
- **Sub-components:**
  - `DriverStat`: Thẻ thống kê chỉ số nhanh kèm icon đổi màu theo tone
  - `Shortcut`: Thẻ lối tắt nhanh tới các chức năng chính
  - Ant Design `Skeleton`, `Alert`, `Empty`
- **Access Role:** `ROLE_DRIVER` (Tài xế xe tải/container/ô tô đã xác thực)
- **Discovery Status:** `VERIFIED` (Mã nguồn Frontend & Backend đã được đối chiếu 100%)

---

## 2. BUSINESS PURPOSE & CONTEXT

### A. Business Objective
Cung cấp màn hình trung tâm chỉ huy (Command Center) cho tài xế ngay sau khi đăng nhập thành công:
1. Hiển thị thông tin chào mừng cá nhân hóa theo số điện thoại hoặc họ tên tài xế.
2. Thống kê nhanh 3 chỉ số quan trọng nhất: Số lượng phương tiện đã đăng ký, Tổng số lượt đặt chỗ trong lịch sử, và Số chuyến đang hoạt động (`activeCount`).
3. Trực quan hóa chi tiết chuyến đỗ xe gần nhất (`recent`), giúp tài xế theo dõi ngay trạng thái check-in, giờ bắt đầu và địa chỉ bãi đỗ mà không cần tìm kiếm trong danh sách.
4. Cung cấp 4 lối tắt điều hướng 1 chạm tới các nghiệp vụ cốt lõi: Tìm bãi đỗ, Quản lý xe, Đặt chỗ của tôi, Thông tin cá nhân.

### B. Target Users
- Tài xế xe tải hạng nặng, xe container, xe giao hàng liên tỉnh hoặc nội đô.

### C. Entry Points
- Tự động điều hướng sau khi đăng nhập thành công tại `/login` (`role === 'DRIVER'`).
- Click "Trang chủ" hoặc logo trên thanh điều hướng.
- Truy cập trực tiếp qua URL: `/dashboard`.

### D. Exit Points
- Nút "Tìm bãi đỗ" trên banner và shortcut: Điều hướng sang `/parking` (`SCR-015`).
- Thẻ "Phương tiện": Điều hướng sang `/vehicles` (`SCR-020`).
- Thẻ "Tổng lượt đặt chỗ" & "Chuyến đang hoạt động": Điều hướng sang `/bookings` (`SCR-017`).
- Thẻ "Chuyến gần nhất": Điều hướng sang `/bookings` (`SCR-017`).
- Thẻ "Thông tin cá nhân": Điều hướng sang `/profile` (`SCR-021`).

---

## 3. UI STRUCTURE & LAYOUT

### A. Bố Cục Tổng Thể (`DashboardLayout`)
- Khung giao diện chính với lớp nền xám nhạt (`bg-slate-50 min-h-screen`).
- Cấu trúc các khối xếp chồng theo chiều dọc: Banner chào mừng -> Hàng 3 thẻ chỉ số -> Lưới 2 cột nội dung (Chuyến gần nhất + Lối tắt nhanh).

### B. Chi Tiết Các Phân Đoạn Giao Diện

#### 1. Banner Chào Mừng (`section.driver-welcome`)
- Nhãn phụ: `TỔNG QUAN TÀI XẾ`.
- Tiêu đề H1: `Xin chào, {session?.phone}`.
- Mô tả: *"Quản lý hành trình và tìm chỗ đỗ phù hợp cho phương tiện của bạn."*
- Nút hành động CTA: `<Link to="/parking"><Search /> Tìm bãi đỗ <ArrowRight /></Link>` (Nút bấm màu Teal chủ đạo).

#### 2. Khối Thẻ Chỉ Số Nhanh (`section.driver-stats`)
Lưới 3 thẻ tóm tắt (`.driver-stat`):
1. **Thẻ Phương tiện (Tone Blue):**
   - Icon: `<CarFront />` màu xanh dương.
   - Giá trị: Số nguyên `vehicleTotal` (lấy từ API xe).
   - Nhãn: `Phương tiện`.
   - Link: Trỏ về `/vehicles`.
2. **Thẻ Tổng lượt đặt chỗ (Tone Orange):**
   - Icon: `<CalendarCheck />` màu cam.
   - Giá trị: Số nguyên `bookingTotal` (tổng số booking trong DB).
   - Nhãn: `Tổng lượt đặt chỗ`.
   - Link: Trỏ về `/bookings`.
3. **Thẻ Chuyến đang hoạt động (Tone Green):**
   - Icon: `<Clock3 />` màu xanh lá.
   - Giá trị: Số nguyên `activeCount` (lọc các booking có trạng thái `PENDING_PAYMENT`, `PENDING_CHECKIN`, `PARKING`, `OVERTIME`, `AWAITING_FINAL_PAYMENT`).
   - Nhãn: `Chuyến đang hoạt động`.
   - Link: Trỏ về `/bookings`.

#### 3. Khối Chuyến Đỗ Gần Nhất (`article.driver-recent`)
- Header: Nhãn phụ `HOẠT ĐỘNG GẦN ĐÂY`, Tiêu đề H2 `Chuyến gần nhất`, Link `Xem tất cả <ArrowRight />` dẫn tới `/bookings`.
- **Nếu có booking:**
  - Icon bãi đỗ: `<CircleParking />`.
  - Huy hiệu trạng thái (`.driver-status`): Hiển thị nhãn tiếng Việt tương ứng theo mã màu (ví dụ: "Đang đỗ", "Chờ check-in", "Chờ thanh toán").
  - Tên bãi đỗ xe: H3 `recent.parkingLotName`.
  - Địa chỉ bãi xe: Icon `<MapPin />` kèm chuỗi `recent.parkingLotAddress`.
  - Siêu dữ liệu phụ:
    - Biển số xe: Nhãn "PHƯƠNG TIỆN" - `recent.vehicleLicensePlate`.
    - Thời gian dự kiến: Nhãn "THỜI GIAN DỰ KIẾN" - `formatDateTime(recent.expectedCheckInTime)`.
- **Nếu chưa có booking:** Hiển thị component Ant Design `Empty` với mô tả: *"Bạn chưa có chuyến nào. Tìm bãi đỗ ngay"* (Link tới `/parking`).

#### 4. Khối Truy Cập Nhanh (`article.driver-shortcuts`)
- Header: Nhãn phụ `TRUY CẬP NHANH`, Tiêu đề H2 `Bạn muốn làm gì?`.
- Danh sách 4 thẻ lối tắt (`.driver-shortcut`):
  1. **Tìm bãi đỗ:** Icon `<Search />`, Mô tả *"Xem chỗ trống và bảng giá"*, link tới `/parking`.
  2. **Quản lý phương tiện:** Icon `<CarFront />`, Mô tả *"Thêm hoặc cập nhật xe"*, link tới `/vehicles`.
  3. **Đặt chỗ của tôi:** Icon `<CalendarCheck />`, Mô tả *"Theo dõi booking và QR"*, link tới `/bookings`.
  4. **Thông tin cá nhân:** Icon `<UserRound />`, Mô tả *"Xem tài khoản và bảo mật"*, link tới `/profile`.

---

## 4. INTERACTION SPECIFICATION

| Phần Tử Giao Diện | Loại UI | Hành Động | Điều Kiện | Phản Hồi Hệ Thống | API Được Gọi | Kết Quả / Chuyển Hướng |
|---|---|---|---|---|---|---|
| Toàn màn hình | Page View | Mở trang | Đã đăng nhập vai trò DRIVER | Bật skeleton loading, gọi song song 2 API | `GET /api/v1/vehicles?page=0&size=1`<br>`GET /api/v1/bookings?page=0&size=20` | Điền dữ liệu vào 3 thẻ thống kê và thẻ chuyến gần nhất |
| Nút "Tìm bãi đỗ" | Link / CTA | Click | Không có | Chuyển trang | Không gọi API | Mở `/parking` (`SCR-015`) |
| Thẻ "Phương tiện" | Card Link | Click | Không có | Chuyển trang | Không gọi API | Mở `/vehicles` (`SCR-020`) |
| Thẻ "Tổng đặt chỗ" | Card Link | Click | Không có | Chuyển trang | Không gọi API | Mở `/bookings` (`SCR-017`) |
| Thẻ "Chuyến hoạt động"| Card Link | Click | Không có | Chuyển trang | Không gọi API | Mở `/bookings` (`SCR-017`) |
| Nút "Xem tất cả" | Link | Click | Không có | Chuyển trang | Không gọi API | Mở `/bookings` (`SCR-017`) |
| Lối tắt cá nhân | Card Link | Click | Không có | Chuyển trang | Không gọi API | Mở `/profile` (`SCR-021`) |
| Nút "Tải lại" (Lỗi)| Button | Click | Có lỗi tải dữ liệu | Xóa thông báo lỗi, gọi lại `load()` | Gọi lại 2 API | Cập nhật lại dữ liệu giao diện |

---

## 5. DATA SPECIFICATION

| Tên Biến State | Kiểu Dữ Liệu | Mục Đích Sử Dụng | Nguồn Dữ Liệu |
|---|---|---|---|
| `vehicleTotal` | Number | Hiển thị tổng số xe tài xế sở hữu | `GET /api/v1/vehicles` -> `response.totalElements` |
| `bookingTotal` | Number | Hiển thị tổng số booking lịch sử | `GET /api/v1/bookings` -> `response.totalElements` |
| `bookings` | `BookingDto[]` | Danh sách 20 booking gần nhất | `GET /api/v1/bookings` -> `response.content` |
| `activeCount` | Number | Đếm số booking đang trong trạng thái hoạt động | Tính toán từ mảng `bookings.filter(status in activeStatuses)` |
| `recent` | `BookingDto \| undefined` | Booking mới nhất theo ngày giờ check-in dự kiến | `[...bookings].sort((a,b) => b.expectedCheckInTime - a.expectedCheckInTime)[0]` |

---

## 6. UI STATES & EDGE CASES

- **Initial Loading State:** Hiển thị Ant Design `Skeleton active paragraph={{ rows: 8 }}` che phủ toàn bộ khu vực thống kê và thẻ chuyến đi.
- **Error State:** Nếu 1 trong 2 API gặp sự cố (ví dụ mạng chập chờn hoặc hết hạn token), hiển thị component `Alert type="error" showIcon` với thông điệp: *"Không thể tải dữ liệu tổng quan"* kèm nút *"Tải lại"*.
- **Empty State (Chưa có chuyến nào):** Thẻ `driver-recent` hiển thị hình minh họa `Empty` với thông điệp: *"Bạn chưa có chuyến nào. Tìm bãi đỗ ngay"*.
- **Role Routing Gatekeeper:** Nếu người dùng gõ URL `/dashboard` nhưng phiên làm việc là `ROLE_MERCHANT`, component `DashboardEntry` tự động điều hướng sang `/merchant/dashboard`; nếu là `ROLE_ADMIN`, tự động điều hướng sang `/admin/dashboard` ([`AppRoutes.tsx:174-179`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L174-L179)).

---

## 7. BACKEND MAPPING & EVIDENCE

### A. Controller & Endpoints
1. **API Lấy Danh Sách Xe Của Tài Xế:**
   - Endpoint: `GET /api/v1/vehicles`
   - Controller: [`VehicleController.java:27`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/VehicleController.java#L27) (`getMyVehicles`)
   - Quyền hạn: `@PreAuthorize("hasRole('DRIVER')")`
2. **API Lấy Danh Sách Booking Của Tài Xế:**
   - Endpoint: `GET /api/v1/bookings`
   - Controller: [`BookingController.java:37`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/BookingController.java#L37) (`getMyBookings`)
   - Quyền hạn: `@PreAuthorize("hasRole('DRIVER')")`

### B. Business Logic & DTOs
- `BookingController`: Đọc `CustomUserDetails` từ Spring SecurityContext để lấy `userId` tài xế, gọi `bookingService.getMyBookings(driverUserId, pageable, status, keyword)`.
- `BookingDto`: Trả về đầy đủ các trường `id`, `bookingCode`, `parkingLotName`, `parkingLotAddress`, `vehicleLicensePlate`, `expectedCheckInTime`, `status`.

---

## 8. DISCREPANCIES & REDESIGN RECOMMENDATIONS

| Vấn đề hiện tại | Đánh giá Kỹ thuật / UX | Khuyến nghị thiết kế lại |
|---|---|---|
| **Lấy 20 booking chỉ để lấy 1 chuyến gần nhất** | Client gọi `getMyBookings(0, 20)` sau đó tự sắp xếp và lấy phần tử đầu tiên để hiển thị `recent`. Gây lãng phí băng thông và tải dữ liệu thừa. | Backend nên cung cấp API chuyên biệt hoặc tham số `GET /api/v1/bookings/active-or-latest` chỉ trả về chuyến đang cần tài xế chú ý nhất (đang đỗ, chờ check-in hoặc chờ thanh toán). |
| **Không hiển thị vị trí hàng đợi ảo (Queue Status)** | Nếu tài xế đang xếp hàng đợi ảo ở một bãi đỗ nào đó, Dashboard hoàn toàn không hiển thị trạng thái hàng đợi, tài xế phải tự bấm vào menu Hàng đợi mới biết. | Bổ sung thẻ thống kê thứ 4: "Hàng đợi đang chờ" hoặc hiển thị widget Banner cảnh báo nếu tài xế nhận được slot (`status === 'NOTIFIED'`). |
