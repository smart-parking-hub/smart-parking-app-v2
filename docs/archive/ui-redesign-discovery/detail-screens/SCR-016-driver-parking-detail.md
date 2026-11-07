# Screen Specification: SCR-016 ParkingDetailPage (Chi tiết bãi đỗ & Đặt chỗ)

---

## 1. SCREEN IDENTIFIER & CLASSIFICATION

- **Screen ID:** `SCR-016`
- **Screen Name:** Chi tiết bãi đỗ xe, bảng giá & đặt chỗ (Parking Lot Detail & Reservation)
- **Module:** `MOD-03: Driver Operations Portal`
- **Route URL:** `/dashboard/parking/:id` (Định nghĩa tại [`AppRoutes.tsx:161`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L161) bọc bởi `DashboardLayout`)
- **Primary Component:** `smart-parking-app/src/features/parking-search/pages/ParkingDetailPage.tsx`
- **Sub-components:**
  - `BookingFlowModal`: `smart-parking-app/src/features/bookings/components/BookingFlowModal.tsx`
  - Ant Design `Progress`, `Skeleton`, `Empty`, `Select`
- **Access Role:** `ROLE_DRIVER` (Yêu cầu tài xế đăng nhập)
- **Discovery Status:** `VERIFIED` (Mã nguồn Frontend & Backend đã được đối chiếu 100%)

---

## 2. BUSINESS PURPOSE & CONTEXT

### A. Business Objective
Cung cấp góc nhìn toàn diện và minh bạch về cơ sở vật chất, sức chứa và biểu phí của một bãi đỗ xe trước khi tài xế quyết định giao dịch:
1. Thẩm định hình ảnh thực tế (Mặt bằng, cổng bãi, trạm cân, camera an ninh).
2. Tra cứu sức chứa theo thời gian thực đối với loại phương tiện tài xế đang điều khiển.
3. Tham khảo bảng biểu phí niêm yết: Giá giờ tiêu chuẩn, giá giờ cao điểm (Peak window), phí đỗ qua đêm và phí phạt quá giờ.
4. Đọc đánh giá và nhận xét chân thực từ các tài xế đã đỗ trước đó.
5. Kích hoạt quy trình Đặt giữ chỗ 10 phút (Lock Slot) hoặc Tham gia hàng đợi ảo (Join Queue) khi bãi xe đã hết chỗ.

### B. Target Users
- Tài xế đã chọn được bãi xe ưng ý từ bản đồ `SCR-015` và muốn xem xét kỹ lưỡng trước khi đặt cọc.

### C. Entry Points
- Click nút "Xem chi tiết" trên thẻ bãi đỗ từ `SearchParkingPage` (`SCR-015`).
- Click từ kết quả tìm kiếm hoặc thông báo hệ thống.
- Truy cập trực tiếp qua URL: `/dashboard/parking/:id`.

### D. Exit Points
- Nút "Quay lại kết quả": Trở về `/parking` (`SCR-015`).
- Đặt chỗ & Thanh toán cọc thành công qua `BookingFlowModal`: Điều hướng sang `/bookings` (`SCR-017`).
- Bấm "Tham gia hàng đợi ảo" thành công: Điều hướng sang `/queues` (`SCR-018`).

---

## 3. UI STRUCTURE & LAYOUT

### A. Bố Cục Tổng Thể
- Header thanh điều hướng: Nút "Quay lại kết quả" (`<ArrowLeft />`).
- Bố cục 2 cột chính:
  - **Cột trái (Nội dung chi tiết - 65% width):** Thư viện ảnh -> Tiêu đề & Thông tin cơ bản -> Bảng sức chứa -> Bảng giá -> Nhận xét đánh giá.
  - **Cột phải (Thẻ đặt chỗ cố định Sticky Panel - 35% width):** Bộ chọn xe -> Trạng thái slot -> Nút đặt chỗ hoặc Tham gia hàng đợi.

### B. Chi Tiết Các Khối Nội Dung

#### 1. Thư Viện Hình Ảnh Thực Tế (`.lot-gallery`)
- Lưới 3 ảnh ngang hiển thị tối đa 3 hình ảnh chụp thực tế của bãi đỗ tải về từ CDN (`lot.images[]`).
- Nếu bãi chưa có ảnh: Hiển thị 3 khối placeholder xám kèm icon `<Truck />`, `<Camera />`, `<ShieldCheck />`.

#### 2. Thông Tin Chung & Tiện Ích Bãi Xe
- Tên bãi đỗ xe lớn + Tag `<ShieldCheck /> Đã phê duyệt`.
- Địa chỉ bãi xe kèm icon `<MapPin />` + Số điện thoại đường dây nóng.
- Điểm đánh giá sao trung bình (`lot.ratingAverage` / 5.0) và số lượt đánh giá.
- Tiện ích cơ sở vật chất: Bảo vệ 24/7, Chiếu sáng ban đêm, Camera an ninh AI, Phòng vệ sinh, Trạm sạc xe điện,...

#### 3. Bảng Sức Chứa Theo Loại Phương Tiện (`.slots-breakdown`)
Hiển thị danh sách các phân vùng slot của bãi cho 5 loại xe:
- Tên loại xe (`SEDAN_SUV`, `BUS_COACH`, `LIGHT_TRUCK`, `HEAVY_TRUCK`, `CONTAINER`).
- Số chỗ khả dụng / Tổng sức chứa (ví dụ: `5 / 20 chỗ`).
- Thanh tiến trình Ant Design `Progress` hiển thị tỷ lệ lấp đầy trực quan.

#### 4. Bảng Biểu Phí Niêm Yết (`.pricing-table`)
- Bảng giá giờ cơ bản cho từng loại xe.
- Cảnh báo giờ cao điểm (nếu có cấu hình khung giờ cao điểm kèm hệ số giá tăng thêm).
- Phí phụ trội quá giờ (`overtimePenaltyPerHour`).

#### 5. Đánh Giá Từ Cộng Đồng Tài Xế (`.reviews-section`)
- Danh sách 10 đánh giá gần nhất: Tên tài xế, Điểm sao (1-5 sao), Ngày đánh giá, Nội dung nhận xét chi tiết.

#### 6. Thẻ Đặt Chỗ Cố Định (Sticky Action Card)
- Dropdown chọn phương tiện của tài xế (`Select` xe sở hữu).
- Thẻ trạng thái slot của phương tiện đã chọn:
  - Nếu còn chỗ (`physicalFree > 0`): Tag màu xanh lá *"Còn X chỗ khả dụng"*. Nút bấm chính: **"Đặt chỗ ngay"** (Mở `BookingFlowModal`).
  - Nếu hết chỗ (`physicalFree === 0`): Tag màu cam *"Hết chỗ trống"*. Nút bấm chính: **"Tham gia hàng đợi ảo"** (Kích hoạt `joinQueue`).

---

## 4. INTERACTION SPECIFICATION

| Phần Tử Giao Diện | Loại UI | Hành Động | Xử Lý Frontend | API Được Gọi | Kết Quả / UI State |
|---|---|---|---|---|---|
| Toàn màn hình | Page View | Mở trang | Gọi song song 3 API | `GET /api/v1/parking-lots/{id}`<br>`GET /api/v1/vehicles`<br>`GET /api/v1/reviews/parking-lot/{id}` | Hiển thị toàn bộ thông tin chi tiết bãi đỗ |
| **Dropdown Chọn Xe** | Select | Đổi xe | Cập nhật `vehicleId`, tự động tính toán lại `physicalFree` tương ứng với loại xe của phương tiện đó | Không gọi API | Cập nhật trạng thái nút bấm "Đặt chỗ" hoặc "Vào hàng đợi" |
| **Nút "Đặt chỗ ngay"** | Button | Click (khi còn chỗ) | Mở modal quy trình đặt chỗ `BookingFlowModal` | Không gọi API | Mở `BookingFlowModal` |
| **Nút "Vào hàng đợi"** | Button | Click (khi hết chỗ) | Kiểm tra `vehicleId`, gọi API xếp hàng ảo | `POST /api/v1/queues`<br>`Body: { parkingLotId, vehicleId, vehicleType }` | Thông báo thành công, điều hướng sang `/queues` (`SCR-018`) |
| **Quy trình trong `BookingFlowModal`** | Multi-step Modal | Chọn giờ & Xác nhận | Tính giá dự kiến -> Tạo booking giữ chỗ 10 phút | `POST /api/v1/bookings`<br>`Body: { parkingLotId, vehicleId, startTime, endTime }` | Tạo booking trạng thái `PENDING_PAYMENT`, mở thanh toán PayOS |

---

## 5. BACKEND MAPPING & EVIDENCE

### A. Controller Endpoints
1. **Chi tiết bãi đỗ:** `GET /api/v1/parking-lots/{id}` -> [`ParkingLotController.java`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/ParkingLotController.java)
2. **Đánh giá bãi đỗ:** `GET /api/v1/reviews/parking-lot/{parkingLotId}` -> [`ReviewController.java:27`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/ReviewController.java#L27)
3. **Tạo đặt chỗ:** `POST /api/v1/bookings` -> [`BookingController.java:29`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/BookingController.java#L29)
4. **Vào hàng đợi ảo:** `POST /api/v1/queues` -> [`QueueController.java:27`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/QueueController.java#L27)

### B. Business Rules & Logic
- **Khóa giữ chỗ 10 phút:** Khi gọi `POST /api/v1/bookings`, hệ thống kiểm tra còn slot trống, trừ tạm thời 1 slot khả dụng, gán thời hạn thanh toán `holdExpiresAt = now + 10 minutes`, đặt trạng thái `PENDING_PAYMENT`.
- **Hàng đợi ảo:** Nếu slot khả dụng = 0, tài xế gọi `POST /api/v1/queues`. Backend gán vị trí số thứ tự `position`, trạng thái ban đầu là `WAITING`.

---

## 6. DISCREPANCIES & REDESIGN RECOMMENDATIONS

| Vấn đề hiện tại | Đánh giá Kỹ thuật / UX | Khuyến nghị thiết kế lại |
|---|---|---|
| **Giới hạn hiển thị tối đa 3 ảnh bãi xe** | Code hiện tại cắt `(lot.images ?? []).slice(0, 3)`, nếu bãi có 10 ảnh thì tài xế không xem được các ảnh còn lại. | Bổ sung Photo Lightbox Carousel cho phép click vào ảnh để phóng to và duyệt toàn bộ album ảnh thực tế của bãi xe. |
| **Chưa hỗ trợ ước tính tổng chi phí trực tiếp trên trang** | Tài xế phải bấm mở `BookingFlowModal` mới thấy bảng tính tiền theo giờ đến và giờ về dự kiến. | Đưa bộ chọn giờ đến/giờ về lên trực tiếp thẻ Sticky Panel bên phải để tài xế thấy ngay số tiền cọc và tổng tiền dự kiến trước khi bấm xác nhận. |
