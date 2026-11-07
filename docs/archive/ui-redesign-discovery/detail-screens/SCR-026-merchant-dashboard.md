# Screen Specification: SCR-026 MerchantDashboardPage (Tổng quan vận hành bãi đỗ)

---

## 1. SCREEN IDENTIFIER & CLASSIFICATION

- **Screen ID:** `SCR-026`
- **Screen Name:** Bảng điều khiển tổng quan vận hành chủ bãi (Merchant Executive Dashboard)
- **Module:** `MOD-04: Merchant Operations Portal`
- **Route URL:** `/merchant/dashboard` (Định nghĩa tại [`AppRoutes.tsx:119`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L119) bọc bởi `MerchantLayout`)
- **Primary Component:** [`MerchantDashboardPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/merchant/dashboard/pages/MerchantDashboardPage.tsx)
- **Sub-components:**
  - `MerchantLayout`: Sidebar menu, header, breadcrumb, chuông thông báo, menu tài khoản
  - `Recharts`: `ResponsiveContainer`, `BarChart`, `Bar`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`
  - Ant Design: `Alert`, `Empty`, `Skeleton`, `Tag`
- **Access Role:** `ROLE_MERCHANT` (Chặn tại router bằng `ProtectedRoute allowedRoles={['MERCHANT']}`)
- **Discovery Status:** `VERIFIED` (Mã nguồn Frontend & Backend đã được đối chiếu 100%)

---

## 2. BUSINESS PURPOSE & CONTEXT

### A. Business Objective
1. Cung cấp góc nhìn tổng quan tức thì (Real-time Glance) về hiệu quả kinh doanh của toàn bộ mạng lưới bãi đỗ xe thuộc quyền sở hữu của Merchant.
2. Theo dõi tổng doanh thu tích lũy, số dư ví khả dụng (`walletBalance`) và tổng lượng đơn đặt chỗ đã hoàn thành (`COMPLETED`).
3. Trực quan hóa xu hướng doanh thu trong 7 ngày gần nhất qua biểu đồ cột để Merchant đánh giá chu kỳ xe vào/ra bãi.
4. Cung cấp lối tắt truy cập nhanh vào 5 đơn đặt chỗ mới nhất và nút tạo bãi xe mới.

### B. Target Users
- Chủ bãi đỗ xe thương mại, quản lý trạm dừng logistics điều hành kinh doanh hàng ngày.

### C. Entry Points
- Đăng nhập thành công với tài khoản vai trò `MERCHANT` -> Tự động chuyển hướng về `/merchant/dashboard`.
- Click logo "SmartTruck Merchant Portal" hoặc mục "Tổng quan" trên Sidebar.

### D. Exit Points
- Click nút `+ Thêm bãi đỗ`: Điều hướng tới `/merchant/parking-lots/new` (`SCR-029`).
- Click "Xem theo ngày/tháng/năm": Điều hướng tới Phân tích doanh thu `/merchant/revenue` (`SCR-037`).
- Click "Xem tất cả" booking: Điều hướng tới Danh sách đặt chỗ `/merchant/bookings` (`SCR-034`).
- Click vào 1 đơn đặt chỗ gần đây: Điều hướng tới Chi tiết booking `/merchant/bookings/:id` (`SCR-035`).

---

## 3. UI STRUCTURE & LAYOUT

### A. Bố Cục Trang
- Nằm trong `MerchantLayout`:
  - Khung Sidebar bên trái rộng 260px (có thể thu gọn xuống 72px).
  - Khung nội dung chính `.merchant-dashboard`.

### B. Header Trang (.merchant-title)
- Nhãn phân hệ: `TỔNG QUAN VẬN HÀNH`.
- Tiêu đề H1: `Chào mừng trở lại`.
- Mô tả phụ: `Theo dõi hiệu quả kinh doanh bãi đỗ trong một màn hình.`
- Nút hành động: `+ Thêm bãi đỗ` (Primary button).

### C. Lưới Chỉ Số Đo Lường (.merchant-metrics)
Hiển thị 4 thẻ chỉ số KPI:
1. **Tổng doanh thu:** Icon `CircleDollarSign` (tone xanh lá), hiển thị `{formatMoney(totalRevenue)}`, ghi chú `Số dư ví: {formatMoney(walletBalance)}`, icon `TrendingUp`.
2. **Tỷ lệ lấp đầy:** Icon `CircleParking` (tone cam), giá trị `—`, ghi chú `Chưa có thống kê occupancy từ Backend` (được ghi chú rõ Backend gap).
3. **Đơn hoàn thành:** Icon `CalendarCheck` (tone xanh dương), hiển thị số lượng `{completedBookings}`, ghi chú `Tổng booking đã hoàn tất`.
4. **Thông báo mới:** Icon `MessageSquare` (tone tím), hiển thị số lượng `{unreadCount}`, ghi chú `Chưa đọc`.

### D. Lưới Nội Dung Trung Tâm (.merchant-dashboard-grid)
1. **Biểu đồ Xu Hướng Doanh Thu (.merchant-chart-card):**
   - Tiêu đề H2 `Xu hướng doanh thu`, mô tả `7 ngày gần nhất · dữ liệu payment SUCCESS`.
   - Link `Xem theo ngày/tháng/năm` (`/merchant/revenue`).
   - Biểu đồ Recharts BarChart: Trục X (ngày/tháng dd/MM), Trục Y (doanh thu VND rút gọn), Cột vàng cam `#e08a00` bo góc 6px, Tooltip định dạng VND đầy đủ.
   - Nếu không có doanh thu: Hiển thị Ant Design `Empty description="Chưa có doanh thu 7 ngày gần nhất"`.
2. **Danh Sách Booking Gần Đây (.merchant-booking-card):**
   - Tiêu đề H2 `Đơn đặt chỗ gần đây`.
   - Link `Xem tất cả` (`/merchant/bookings`).
   - Danh sách tối đa 5 thẻ booking: Tên bãi đỗ, biển số xe, tên tài xế, và Tag trạng thái (`statusLabels`).

---

## 4. FUNCTIONAL CATALOG & USER ACTIONS

| STT | Tên chức năng | Nút / Thao tác UI | Dữ liệu đầu vào | Điều kiện tiên quyết | Kết quả mong đợi |
|---|---|---|---|---|---|
| **FN-026-01** | Tải chỉ số vận hành tổng quan | Tự động khi vào trang | Token Merchant | Đã đăng nhập vai trò MERCHANT | Hiển thị doanh thu, số dư ví, đơn hoàn thành và thông báo chưa đọc |
| **FN-026-02** | Xem biểu đồ 7 ngày | Tương tác rê chuột (hover) | Điểm dữ liệu ngày | Có dữ liệu doanh thu trong 7 ngày | Tooltip hiển thị số tiền chính xác theo từng ngày |
| **FN-026-03** | Mở form tạo bãi mới | Click `+ Thêm bãi đỗ` | Không | Không | Chuyển trang sang `/merchant/parking-lots/new` (`SCR-029`) |
| **FN-026-04** | Xem chi tiết đơn gần đây | Click vào hàng booking | Booking ID | Danh sách đã tải | Chuyển trang sang `/merchant/bookings/:id` (`SCR-035`) |
| **FN-026-05** | Tải lại dữ liệu khi lỗi | Click nút `Tải lại` trên Alert | Không | Bị lỗi mạng hoặc lỗi API | Tải lại toàn bộ dữ liệu trang |

---

## 5. TECHNICAL TRACEABILITY & BACKEND MAPPING

### A. API Endpoints
1. `GET /api/v1/merchant/revenue?granularity=DAY`: Lấy doanh thu tổng, số dư ví và chuỗi dữ liệu doanh thu theo ngày.
2. `GET /api/v1/merchant/bookings?page=0&size=5`: Lấy 5 booking gần nhất.
3. `GET /api/v1/notifications/unread-count`: Đếm thông báo chưa đọc.

### B. Controller & Method
- [`MerchantController.java:50-59`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/MerchantController.java#L50-L59):
  - `getRevenue(@AuthenticationPrincipal CustomUserDetails u, ..., @RequestParam(defaultValue = "DAY") RevenueGranularityEnum granularity)` -> `@PreAuthorize("hasRole('MERCHANT')")`
- [`MerchantController.java:27-35`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/MerchantController.java#L27-L35):
  - `getMerchantBookings(@AuthenticationPrincipal CustomUserDetails u, ..., Pageable pageable)` -> `@PreAuthorize("hasRole('MERCHANT')")`
- [`NotificationController.java:31-36`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/NotificationController.java#L31-L36):
  - `getUnreadCount(@AuthenticationPrincipal CustomUserDetails userDetails)` -> `@PreAuthorize("isAuthenticated()")`

### C. Service Implementation
- [`ParkingLotServiceImpl.getTotalRevenue()`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/service/impl/ParkingLotServiceImpl.java): Quét bảng `Payment` với `status = SUCCESS` thuộc các bãi xe của Merchant, tính tổng và gom nhóm theo kỳ.
- [`BookingServiceImpl.getMerchantBookings()`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/service/impl/BookingServiceImpl.java): Truy vấn booking phân trang theo `merchantId`.

---

## 6. UI STATES & ERROR HANDLING

- **Loading State:** Hiển thị component Ant Design `Skeleton active paragraph={{ rows: 8 }}`.
- **Error State:** Hiển thị `Alert type="error"` kèm nút `Tải lại` (`extractApiError(error)`).
- **Empty Chart State:** Nếu doanh thu 7 ngày đều bằng 0, hiển thị icon `BarChart3` kèm `Empty description="Chưa có doanh thu 7 ngày gần nhất"`.
- **Empty Bookings State:** Nếu chưa có đơn đặt chỗ nào, hiển thị `Empty description="Chưa có booking"`.

---

## 7. REDESIGN CONSIDERATIONS & INVARIANTS

### A. Yếu Tố Bắt Buộc Giữ Lại (Invariants)
1. **Phân tách Doanh thu tổng & Số dư ví:** Cực kỳ quan trọng để chủ bãi nắm rõ dòng tiền: Doanh thu tổng là số tiền từ booking thành công, trong khi Số dư ví là tiền khả dụng có thể rút (sau khi đã trừ phí nền tảng 5% và tiền chưa tất toán).
2. **Khả năng tương thích Responsive:** Sidebar tự động collapse trên màn hình tablet/mobile để tối ưu không gian hiển thị biểu đồ.

### B. Khoảng Trống Nghiệp Vụ Cần Bổ Sung (Backend Gap)
1. **Thiếu API Thống kê Tỷ lệ lấp đầy (Occupancy Rate):** Metric "Tỷ lệ lấp đầy" hiện tại phải hiển thị gạch ngang `—` vì Backend chưa cung cấp endpoint tính tỷ lệ % chỗ đang đỗ trên tổng dung lượng bãi. Thiết kế mới cần yêu cầu Backend bổ sung trường này.
