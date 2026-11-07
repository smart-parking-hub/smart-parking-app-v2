# Screen Specification: SCR-034 MerchantBookingsPage (Quản lý đơn đặt chỗ)

---

## 1. SCREEN IDENTIFIER & CLASSIFICATION

- **Screen ID:** `SCR-034`
- **Screen Name:** Quản lý toàn bộ danh sách đơn đặt chỗ (Merchant Bookings Master View)
- **Module:** `MOD-04: Merchant Operations Portal`
- **Route URL:** `/merchant/bookings` (Định nghĩa tại [`AppRoutes.tsx:127`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L127) bọc bởi `MerchantLayout`)
- **Primary Component:** [`MerchantBookingsPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/merchant/bookings/pages/MerchantBookingsPage.tsx)
- **Sub-components:** Ant Design `Table`, `Select`, `Input`, `Tag`, `Button`, `Alert`, `Empty`
- **Access Role:** `ROLE_MERCHANT` (Chặn tại router bằng `ProtectedRoute allowedRoles={['MERCHANT']}`)
- **Discovery Status:** `VERIFIED` (Mã nguồn Frontend & Backend đã được đối chiếu 100%)

---

## 2. BUSINESS PURPOSE & CONTEXT

### A. Business Objective
1. Cung cấp sổ cái theo dõi tập trung toàn bộ các đơn đặt chỗ (Bookings) của khách hàng vãng lai và tài xế thường xuyên tại tất cả các bãi đỗ của Merchant.
2. Giám sát trạng thái hoạt động của xe: Khách đã cọc đang trên đường tới (`PENDING_CHECKIN`), xe đang đỗ thực tế trong sân (`PARKING`), và xe có dấu hiệu quá giờ (`OVERTIME`).
3. Cung cấp thông tin liên hệ trực tiếp (Số điện thoại tài xế, Biển số xe) để nhân viên gác cổng hoặc chủ bãi chủ động gọi điện điều phối khi bãi sắp hết chỗ hoặc xảy ra sự cố khẩn cấp.
4. Cho phép lọc theo từng cơ sở bãi xe và tìm kiếm tức thì theo mã vé hoặc biển kiểm soát.

### B. Target Users
- Chủ bãi đỗ, quản lý trạm dừng hoặc nhân viên lễ tân/bảo vệ cổng bãi.

### C. Entry Points
- Click mục "Booking" trên Sidebar menu của `MerchantLayout`.
- Click liên kết "Xem tất cả" từ thẻ Đơn đặt chỗ gần đây trên Dashboard (`SCR-026`).

### D. Exit Points
- Click nút `Chi tiết`: Điều hướng sang Chi tiết đơn đặt chỗ `/merchant/bookings/:id` (`SCR-035`).
- Click "Quét QR": Chuyển sang công cụ quét mã check-in/out (`SCR-036`).

---

## 3. UI STRUCTURE & LAYOUT

### A. Header Trang
- Tiêu đề H1: `Booking`.
- Mô tả phụ: `Theo dõi đơn đặt chỗ tại các bãi đỗ của bạn.`
- Nút hành động: `Tải lại` (icon `ReloadOutlined`).

### B. Thanh Công Cụ Bộ Lọc (.merchant-filter-bar)
1. **Dropdown Chọn bãi đỗ:** Danh sách tất cả các bãi xe thuộc sở hữu của Merchant (lấy từ `getMerchantParkingLots`), kèm tùy chọn `Tất cả bãi đỗ`.
2. **Dropdown Chọn trạng thái đơn:**
   - `PENDING_PAYMENT`: Chờ thanh toán (Tag màu vàng `gold`).
   - `PENDING_CHECKIN`: Chờ check-in (Tag màu xanh dương `blue`).
   - `PARKING`: Đang đỗ (Tag màu xanh đang chạy `processing`).
   - `OVERTIME`: Quá giờ (Tag màu cam `orange`).
   - `AWAITING_FINAL_PAYMENT`: Chờ thanh toán cuối (Tag màu tím `purple`).
   - `COMPLETED`: Hoàn tất (Tag màu xanh lá `green`).
   - `CANCELLED`: Đã hủy (Tag màu xám `default`).
   - `EXPIRED`: Hết hạn (Tag màu đỏ `red`).
   - `REVIEWED`: Đã đánh giá (Tag màu xanh lơ `cyan`).
3. **Ô tìm kiếm nhanh:** Input prefix `SearchOutlined`, placeholder `Tìm mã booking, tài xế, SĐT, biển số…`.

### C. Bảng Dữ Liệu Đơn Đặt Chỗ (Table)
Bảng Ant Design `Table` cuộn ngang:
- Cột 1: **Mã booking** - Hiển thị 8 ký tự đầu kèm dấu ba chấm (ví dụ: `BK-89A12…`).
- Cột 2: **Bãi đỗ** - Tên bãi xe tương ứng.
- Cột 3: **Tài xế** - Họ tên tài xế (ẩn trên mobile).
- Cột 4: **SĐT** - Số điện thoại tài xế để bấm gọi ngay.
- Cột 5: **Xe** - Biển số xe in đậm và phân loại xe bên dưới.
- Cột 6: **Check-in dự kiến** - Ngày giờ hẹn đến bãi (`dd/MM/yyyy HH:mm`).
- Cột 7: **Trạng thái** - Tag màu sắc chỉ thị trạng thái vé.
- Cột 8: **Cọc** - Số tiền cọc đã thanh toán (VND).
- Cột 9: **Thao tác** - Nút Link `Chi tiết` (icon `EyeOutlined`).

---

## 4. FUNCTIONAL CATALOG & USER ACTIONS

| STT | Tên chức năng | Nút / Thao tác UI | Dữ liệu đầu vào | Điều kiện tiên quyết | Kết quả mong đợi |
|---|---|---|---|---|---|
| **FN-034-01** | Tải danh sách đơn đặt chỗ | Mở trang `/merchant/bookings` | Token Merchant, page, size | Đã đăng nhập vai trò MERCHANT | Hiển thị bảng danh sách booking của các bãi |
| **FN-034-02** | Lọc booking theo bãi xe | Chọn bãi trong dropdown | `parkingLotId` | Danh sách bãi đã tải | Gửi API tải lại booking của riêng bãi đỗ đó |
| **FN-034-03** | Lọc theo trạng thái vé | Chọn trạng thái | Giá trị enum `BookingStatus` | Không | Lọc hiển thị các đơn có trạng thái tương ứng |
| **FN-034-04** | Tìm kiếm đa năng | Gõ từ khóa vào ô tìm kiếm | Biển số, tên, SĐT, mã booking | Không | Lọc tức thì (client-side filter) trên danh sách đã tải |
| **FN-034-05** | Xem chi tiết đơn | Click nút `Chi tiết` | Booking ID | Hàng dữ liệu tồn tại | Điều hướng sang `/merchant/bookings/:id` (`SCR-035`) |

---

## 5. TECHNICAL TRACEABILITY & BACKEND MAPPING

### A. API Endpoints
- `GET /api/v1/merchant/bookings`: Lấy danh sách booking phân trang của Merchant.
  - Query params: `page`, `size`, `parkingLotId` (tùy chọn).

### B. Controller & Method
- [`MerchantController.java:27-35`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/MerchantController.java#L27-L35):
  - `getMerchantBookings(@AuthenticationPrincipal CustomUserDetails u, @RequestParam(required = false) Long parkingLotId, Pageable pageable)`
  - Quyền hạn: `@PreAuthorize("hasRole('MERCHANT')")`

### C. Service Implementation
- [`BookingServiceImpl.getMerchantBookings()`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/service/impl/BookingServiceImpl.java): Truy vấn qua `BookingRepository` tìm các đơn có `parkingLot.merchant.user.id = merchantUserId`. Nếu có truyền `parkingLotId`, lọc chính xác theo bãi đó.

---

## 6. UI STATES & ERROR HANDLING

- **Loading State:** Component Ant Design `Table loading={true}`.
- **Empty State:** Hiển thị `Empty description="Không có đơn đặt chỗ nào phù hợp"`.
- **Error State:** Hiển thị `Alert type="error"` khi không thể kết nối tới máy chủ.

---

## 7. REDESIGN CONSIDERATIONS & INVARIANTS

### A. Yếu Tố Bắt Buộc Giữ Lại (Invariants)
1. **Thông tin liên lạc của tài xế:** Luôn phải hiển thị số điện thoại tài xế để nhân viên bến bãi có thể gọi điện trực tiếp xử lý tình huống xe đến trễ hoặc đỗ sai vị trí.
2. **Cột phân loại xe rõ ràng:** Giúp bảo vệ phân luồng xe tải nặng vào đúng làn đường bãi đỗ.

### B. Đề Xuất Cải Thiện
1. **Bộ lọc thời gian (Date Range Filter):** Bổ sung bộ lọc theo ngày check-in để Merchant tra cứu danh sách khách đặt chỗ cho ngày hôm nay hoặc ngày mai.
2. **Xuất báo cáo Excel / CSV:** Cho phép tải file danh sách đặt chỗ để phục vụ kế toán ca trực bãi xe.
