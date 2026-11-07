# Screen Specification: SCR-020 VehiclesPage (Quản lý phương tiện của tôi)

---

## 1. SCREEN IDENTIFIER & CLASSIFICATION

- **Screen ID:** `SCR-020`
- **Screen Name:** Quản lý phương tiện vận tải tài xế (Driver Vehicles Management)
- **Module:** `MOD-03: Driver Operations Portal`
- **Route URL:** 
  - `/vehicles` (Định nghĩa tại [`AppRoutes.tsx:75`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L75) bọc bởi `LandingLayout`)
  - `/dashboard/vehicles` (Định nghĩa tại [`AppRoutes.tsx:88`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L88) bọc bởi `DashboardLayout`)
- **Primary Component:** [`VehiclesPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/vehicles/pages/VehiclesPage.tsx)
- **Sub-components:**
  - [`ProfileSidebar.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/profile/components/ProfileSidebar.tsx) (Thanh điều hướng tài khoản: Hồ sơ, Xe, Thanh toán, Mật khẩu)
  - `Modal` Ant Design: Dialog thêm mới / Cập nhật xe (`SCR-MOD-04`)
  - `Popconfirm` Ant Design: Hộp thoại xác nhận xóa phương tiện
  - `Skeleton`, `Empty`, `Form`, `Input`, `Select`, `InputNumber`
- **Access Role:** `ROLE_DRIVER` (Yêu cầu tài xế đăng nhập)
- **Discovery Status:** `VERIFIED` (Mã nguồn Frontend & Backend đã được đối chiếu 100%)

---

## 2. BUSINESS PURPOSE & CONTEXT

### A. Business Objective
1. Cho phép tài xế đăng ký và quản lý danh sách xe tải/xe container thuộc quyền sở hữu hoặc quyền vận hành của mình.
2. Dữ liệu phương tiện (biển số, loại xe, tải trọng) là điều kiện tiên quyết bắt buộc để thực hiện quy trình Đặt chỗ giữ chỗ (`SCR-016`) và Xếp hàng ảo (`SCR-018`).
3. Đảm bảo tính hợp lệ của biển số xe, loại xe phù hợp với phân khu bãi đỗ và quy định giới hạn tải trọng của từng bãi xe.

### B. Target Users
- Tài xế cá nhân hoặc lái xe đội xe logistics cần đăng ký xe trước khi đi đỗ.

### C. Entry Points
- Click mục "Phương tiện của tôi" trên `ProfileSidebar` (từ `/profile` hoặc `/change-password`).
- Click "Quản lý xe" từ thanh công cụ trên `DashboardHomePage` (`SCR-014`).
- Điều hướng trực tiếp qua đường dẫn `/vehicles` hoặc `/dashboard/vehicles`.

### D. Exit Points
- Điều hướng sang `/profile` (`SCR-021`), `/payments` (`SCR-019`), hoặc `/change-password` (`SCR-022`) qua Sidebar.
- Điều hướng sang Đặt chỗ hoặc Tìm bãi xe.

---

## 3. UI STRUCTURE & LAYOUT

### A. Layout Chung
- Giao diện dạng 2 cột:
  - Cột trái: [`ProfileSidebar.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/profile/components/ProfileSidebar.tsx) gồm 4 liên kết: `Thông tin cá nhân`, `Phương tiện của tôi` (active), `Thanh toán & hóa đơn`, `Đổi mật khẩu`.
  - Cột phải: Khối nội dung chính `.vehicles-stitch-content`.

### B. Header Danh Sách Xe
- Tiêu đề H1: `Phương tiện của tôi`.
- Nút hành động: `+ Thêm phương tiện` (mở Modal thêm xe).

### C. Danh Sách Phương Tiện (.vehicles-stitch-table)
- Header cột: `BIỂN SỐ`, `LOẠI XE`, `TRẠNG THÁI`, `THAO TÁC`.
- Dòng xe (`.vehicle-stitch-row`):
  - Biển số: In đậm (ví dụ: `51C-123.45`), kèm nhãn phụ thương hiệu/model (ví dụ: `Hino 300`).
  - Loại xe: Tên tiếng Việt kèm tải trọng (ví dụ: `Xe tải trung (8.5 tấn)`).
  - Trạng thái: Tag badge (`Đang hoạt động` / `Ngừng hoạt động`).
  - Thao tác:
    - Nút icon `Pencil`: Mở Modal cập nhật thông tin xe.
    - Nút icon `Trash2`: Bọc trong `Popconfirm` với tiêu đề "Xóa phương tiện?", nội dung "Xóa xe {licensePlate} khỏi tài khoản?", nút xác nhận nguy hiểm `Xóa`.

### D. Dialog Thêm / Cập Nhật Phương Tiện (SCR-MOD-04)
- Bật lên qua `Modal` Ant Design centered, width 650px:
  - Tiêu đề: `Thêm phương tiện mới` hoặc `Cập nhật phương tiện`.
  - Nút đóng: Icon `X` góc trên phải.
  - Trường `BIỂN SỐ XE`: Input chữ hoa, prefix `Hash`, bắt buộc, regex pattern `/^[0-9A-Z.-]{5,20}$/i`.
  - Trường `LOẠI XE`: Select dropdown, prefix `Truck`, các tùy chọn:
    - `TRUCK_SMALL`: Xe tải nhỏ (dưới 3.5 tấn)
    - `TRUCK_MEDIUM`: Xe tải trung (3.5 - 10 tấn)
    - `TRUCK_HEAVY`: Xe tải nặng (trên 10 tấn)
    - `CONTAINER`: Xe đầu kéo / Container
  - Trường `TẢI TRỌNG (TẤN)`: InputNumber, prefix `Scale`, min 0.1, max 100, step 0.1.
  - Trường `NHÃN HIỆU / MODEL`: Input text, prefix `Car`, tối đa 100 ký tự (ví dụ: `Hyundai Mighty`).
  - Nút chân trang: `Hủy bỏ` (đóng modal) và `Thêm mới` / `Cập nhật` (submit form, hiển thị loading spinner).

---

## 4. FUNCTIONAL CATALOG & USER ACTIONS

| STT | Tên chức năng | Nút / Thao tác UI | Dữ liệu đầu vào | Điều kiện tiên quyết | Kết quả mong đợi |
|---|---|---|---|---|---|
| **FN-020-01** | Xem danh sách xe | Tải trang `/vehicles` | Token đăng nhập driver | Đã đăng nhập vai trò DRIVER | Hiển thị toàn bộ phương tiện đã đăng ký |
| **FN-020-02** | Mở form thêm xe | Click `+ Thêm phương tiện` | Không | Không | Reset form và mở Dialog SCR-MOD-04 |
| **FN-020-03** | Thêm mới xe | Click `Thêm mới` trong dialog | Biển số, Loại xe, Tải trọng, Nhãn hiệu | Dữ liệu hợp lệ, Biển số chưa tồn tại trong hệ thống | Tạo xe mới, hiển thị toast success, đóng dialog, làm mới bảng |
| **FN-020-04** | Mở form sửa xe | Click icon `Pencil` trên dòng xe | Chọn đối tượng xe | Xe thuộc tài khoản driver | Mở Dialog SCR-MOD-04 điền sẵn thông tin xe |
| **FN-020-05** | Cập nhật thông tin xe | Click `Cập nhật` trong dialog | Biển số, Loại xe, Tải trọng, Nhãn hiệu | Biển số không trùng xe khác | Cập nhật DB, hiển thị toast success, đóng dialog, cập nhật bảng |
| **FN-020-06** | Xóa phương tiện | Click icon `Trash2` -> Confirm | ID xe | Không có booking active đang gắn với xe | Xóa mềm xe (chuyển sang INACTIVE), toast thông báo, reload bảng |

---

## 5. TECHNICAL TRACEABILITY & BACKEND MAPPING

### A. API Endpoints
1. `GET /api/v1/vehicles`: Lấy danh sách xe của tài xế (phân trang).
2. `POST /api/v1/vehicles`: Thêm mới phương tiện.
3. `PUT /api/v1/vehicles/{id}`: Cập nhật thông tin phương tiện.
4. `DELETE /api/v1/vehicles/{id}`: Xóa phương tiện.

### B. Controller & Method
- [`VehicleController.java:23-48`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/VehicleController.java#L23-L48)
  - `getMyVehicles(@AuthenticationPrincipal CustomUserDetails u, @PageableDefault(size = 20) Pageable pageable)` -> `@PreAuthorize("hasRole('DRIVER')")`
  - `addVehicle(@AuthenticationPrincipal CustomUserDetails u, @Valid @RequestBody AddVehicleRequest req)` -> `@PreAuthorize("hasRole('DRIVER')")`
  - `updateVehicle(@AuthenticationPrincipal CustomUserDetails u, @PathVariable Long id, @Valid @RequestBody UpdateVehicleRequest req)` -> `@PreAuthorize("hasRole('DRIVER')")`
  - `deleteVehicle(@AuthenticationPrincipal CustomUserDetails u, @PathVariable Long id)` -> `@PreAuthorize("hasRole('DRIVER')")`

### C. Service Implementation
- [`VehicleServiceImpl.java:22-88`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/service/impl/VehicleServiceImpl.java#L22-L88)
  - `addVehicle`: Kiểm tra `driverRepository.findByUserId(driverUserId)` -> Kiểm tra `vehicleRepository.existsByLicensePlate(licensePlate)` (ném `BadRequestException("Biển số xe đã tồn tại trong hệ thống!")`) -> Lưu với `VehicleStatusEnum.ACTIVE`.
  - `updateVehicle`: Kiểm tra quyền sở hữu `vehicle.getDriver().getUser().getId().equals(driverUserId)` -> Kiểm tra trùng lặp biển số nếu thay đổi -> Cập nhật thông tin.
  - `deleteVehicle`: Kiểm tra quyền sở hữu -> Thực hiện **Soft Delete**: `vehicle.setStatus(VehicleStatusEnum.INACTIVE); vehicleRepository.save(vehicle)`.

### D. DTOs & Entity
- DTO: `VehicleDto`, `AddVehicleRequest`, `UpdateVehicleRequest`
- Entity: [`Vehicle.java`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/entity/Vehicle.java), [`Driver.java`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/entity/Driver.java)

---

## 6. UI STATES & ERROR HANDLING

- **Loading State:** Hiển thị component Ant Design `Skeleton active` trong khi chờ API `GET /api/v1/vehicles`.
- **Empty State:** Khi tài xế chưa đăng ký xe nào, hiển thị Ant Design `Empty description="Bạn chưa có phương tiện"`.
- **Form Submitting State:** Nút `Thêm mới` / `Cập nhật` hiển thị `loading={submitting}` và vô hiệu hóa các thao tác.
- **Error Handling:** 
  - Trùng biển số: Backend trả lỗi 400 `Biển số xe đã tồn tại trong hệ thống!`, Frontend bắt lỗi và hiển thị `message.error(extractApiError(error))`.
  - Lỗi mạng hoặc server: Hiển thị toast thông báo lỗi chi tiết.

---

## 7. REDESIGN CONSIDERATIONS & INVARIANTS

### A. Yếu Tố Bắt Buộc Giữ Lại (Invariants)
1. **Ràng buộc định dạng biển số:** Phải chuẩn hóa ký tự in hoa và regex phù hợp với biển kiểm soát Việt Nam.
2. **Khóa liên kết phân loại xe:** 4 loại xe (`TRUCK_SMALL`, `TRUCK_MEDIUM`, `TRUCK_HEAVY`, `CONTAINER`) gắn liền với logic tính giá và khả năng tiếp nhận slot bãi đỗ.
3. **Soft Delete an toàn:** Không bao giờ được hard delete bản ghi xe trong cơ sở dữ liệu vì liên quan đến lịch sử booking, check-in, check-out và camera an ninh.

### B. Đề Xuất Cải Thiện Cho Thiết Kế Mới
1. **Hình ảnh đăng kiểm / Cà-vẹt xe:** Hệ thống hiện tại chỉ lưu thông tin text, chưa hỗ trợ upload ảnh giấy tờ xe để kiểm định tải trọng thực tế.
2. **Xe mặc định (Default Vehicle):** Cho phép tài xế chọn 1 xe làm mặc định để tự động điền sẵn khi bấm Đặt chỗ hoặc Xếp hàng.
