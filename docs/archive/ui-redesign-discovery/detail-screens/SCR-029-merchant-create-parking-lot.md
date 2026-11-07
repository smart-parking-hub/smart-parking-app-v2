# Screen Specification: SCR-029 CreateMerchantParkingLotPage (Tạo bãi đỗ mới)

---

## 1. SCREEN IDENTIFIER & CLASSIFICATION

- **Screen ID:** `SCR-029`
- **Screen Name:** Đăng ký bãi đỗ xe mới (Create Merchant Parking Lot Wizard)
- **Module:** `MOD-04: Merchant Operations Portal`
- **Route URL:** `/merchant/parking-lots/new` (Định nghĩa tại [`AppRoutes.tsx:122`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L122) bọc bởi `MerchantLayout`)
- **Primary Component:** [`CreateMerchantParkingLotPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/merchant/parking-lots/pages/CreateMerchantParkingLotPage.tsx)
- **Sub-components:**
  - [`ParkingLotMapPicker.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/merchant/parking-lots/components/ParkingLotMapPicker.tsx) (Component chọn tọa độ bản đồ tương tác)
  - [`GenerateDescriptionModal.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/ai-copilot/components/GenerateDescriptionModal.tsx) (Trợ lý AI hỗ trợ điền nhanh thông tin)
  - Ant Design: `Steps`, `Form`, `Input`, `InputNumber`, `Upload`, `Descriptions`, `Alert`, `Button`
- **Access Role:** `ROLE_MERCHANT` (Chặn tại router bằng `ProtectedRoute allowedRoles={['MERCHANT']}`)
- **Discovery Status:** `VERIFIED` (Mã nguồn Frontend & Backend đã được đối chiếu 100%)

---

## 2. BUSINESS PURPOSE & CONTEXT

### A. Business Objective
1. Cho phép Merchant đăng ký một bãi đỗ xe mới vào hệ thống SmartParkingHub để mở rộng mạng lưới bãi đỗ xe thương mại.
2. Thu thập đầy đủ hồ sơ pháp lý, địa chỉ, tọa độ GPS chuẩn xác để phục vụ tính năng dẫn đường cho tài xế xe tải.
3. Cho phép tải lên tối đa 5 bức ảnh chụp thực tế cổng vào và mặt bằng để Quản trị viên (Admin) thẩm định độ an toàn và sức chứa.
4. Tích hợp AI Copilot hỗ trợ chủ bãi tự động soạn thảo mô tả giới thiệu, quy định PCCC và hướng dẫn chỉ đường.

### B. Target Users
- Chủ bãi đỗ xe mới tham gia nền tảng hoặc mở thêm cơ sở bến bãi mới.

### C. Entry Points
- Click nút `+ Thêm bãi đỗ` từ Bảng điều khiển tổng quan (`SCR-026`).
- Click nút `Tạo bãi mới` từ Danh sách bãi đỗ (`SCR-028`).

### D. Exit Points
- Hoàn tất đăng ký thành công: Tự động chuyển hướng sang Chi tiết bãi đỗ `/merchant/parking-lots/:id` (`SCR-030`).
- Hủy bỏ: Quay về danh sách bãi đỗ `/merchant/parking-lots` (`SCR-028`).

---

## 3. UI STRUCTURE & LAYOUT

Giao diện được thiết kế dạng quy trình từng bước (3-Step Wizard):
- Thanh tiến trình `Steps`: Bước 1 `Thông tin` -> Bước 2 `Vị trí` -> Bước 3 `Xác nhận`.

### A. Bước 1: Thông Tin Cơ Bản (Step 0)
- Tiêu đề khối: `Thông tin cơ bản`.
- Nút trợ lý AI: `✨ Điền nhanh bằng AI` (mở `GenerateDescriptionModal`).
- Ô nhập `Tên bãi`: Input text, bắt buộc, tối đa 150 ký tự (ví dụ: `Bãi đỗ xe tải Thủ Đức`).
- Ô nhập `Địa chỉ`: TextArea 3 dòng, bắt buộc, tối đa 300 ký tự (ví dụ: `Số 12 Quốc Lộ 1A, Phường Linh Trung, TP. Thủ Đức`).
- Khối hiển thị nội dung AI đã sinh (nếu có sử dụng): Thẻ xanh ngọc hiển thị tóm tắt Giới thiệu, Nội quy PCCC, Chỉ dẫn đường đi.
- Khu vực tải ảnh `Upload picture-card`:
  - Giới hạn tối đa 5 ảnh, định dạng JPG, PNG hoặc WebP, dung lượng không quá 5 MB/ảnh.
  - Cảnh báo: `Ảnh đầu tiên được chọn sẽ tự động làm ảnh đại diện của bãi đỗ.`
- Nút bấm: `Tiếp tục` (validate dữ liệu bước 1).

### B. Bước 2: Vị Trí Bãi Đỗ (Step 1)
- Tiêu đề khối: `Vị trí bãi` kèm nút `Vị trí hiện tại` (icon `AimOutlined`, tự động lấy tọa độ qua Geolocation API của trình duyệt).
- Lưới 2 cột nhập tọa độ:
  - `Latitude`: InputNumber từ -90 đến 90, độ chính xác 7 chữ số thập phân (`precision={7}`).
  - `Longitude`: InputNumber từ -180 đến 180, độ chính xác 7 chữ số thập phân (`precision={7}`).
- Bản đồ tương tác [`ParkingLotMapPicker.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/merchant/parking-lots/components/ParkingLotMapPicker.tsx): Cho phép click hoặc kéo ghim trên bản đồ Leaflet để tự động cập nhật tọa độ vào 2 ô input.
- Nút bấm: `Quay lại` và `Tiếp tục`.

### C. Bước 3: Xác Nhận Hồ Sơ (Step 2)
- Tiêu đề khối: `Xác nhận thông tin`.
- Bảng Ant Design `Descriptions bordered column={1}`:
  - Tên bãi đỗ, Địa chỉ, Mô tả AI (nếu có), Tọa độ (`lat, lng`), Số lượng ảnh đã chọn.
- Khối cảnh báo: Thông báo hồ sơ sau khi tạo sẽ ở trạng thái `PENDING_APPROVAL` chờ Admin duyệt.
- Nút bấm:
  - Nút `Quay lại` (về bước 2).
  - Nút Primary `Tạo bãi đỗ` (loading `{submitting}`).

---

## 4. FUNCTIONAL CATALOG & USER ACTIONS

| STT | Tên chức năng | Nút / Thao tác UI | Dữ liệu đầu vào | Điều kiện tiên quyết | Kết quả mong đợi |
|---|---|---|---|---|---|
| **FN-029-01** | Điền nhanh bằng AI | Click `✨ Điền nhanh bằng AI` | Tên bãi, địa phương | Không | Mở modal AI sinh mô tả bãi, nội quy và điền vào form |
| **FN-029-02** | Chọn ảnh bãi đỗ | Click `Thêm ảnh` | File ảnh JPG/PNG/WebP | File <= 5MB, tối đa 5 ảnh | Hiển thị thumbnail ảnh trong danh sách fileList |
| **FN-029-03** | Lấy tọa độ GPS hiện tại | Click `Vị trí hiện tại` | Tọa độ trình duyệt | Thiết bị cấp quyền định vị | Tự động điền Latitude và Longitude, di chuyển bản đồ |
| **FN-029-04** | Chọn vị trí trên bản đồ | Click trên bản đồ tương tác | Tọa độ click | Ở Bước 2 | Ghim marker và cập nhật số vào ô kinh/vĩ độ |
| **FN-029-05** | Xác nhận tạo bãi đỗ | Click `Tạo bãi đỗ` (Bước 3) | Toàn bộ form và danh sách ảnh | Dữ liệu hợp lệ | Gửi request tạo bãi, sau đó upload ảnh, chuyển sang chi tiết bãi |

---

## 5. TECHNICAL TRACEABILITY & BACKEND MAPPING

### A. API Endpoints
1. `POST /api/v1/merchant/parking-lots`: Tạo mới bãi đỗ (trạng thái ban đầu `PENDING_APPROVAL`).
2. `POST /api/v1/merchant/parking-lots/{id}/images`: Tải lên danh sách ảnh bãi đỗ (Multipart/form-data).

### B. Controller & Method
- [`ParkingLotController.java:29-33`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/ParkingLotController.java#L29-L33):
  - `create(@AuthenticationPrincipal CustomUserDetails u, @Valid @RequestBody CreateParkingLotRequest req)` -> `@PreAuthorize("hasRole('MERCHANT')")`
- [`ParkingLotImageController.java:30-38`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/ParkingLotImageController.java#L30-L38):
  - `upload(@AuthenticationPrincipal CustomUserDetails user, @PathVariable Long parkingLotId, @RequestPart("files") @Size(min = 1, max = 5) List<MultipartFile> files)` -> `@PreAuthorize("hasRole('MERCHANT')")`

### C. Service Implementation
- [`ParkingLotServiceImpl.createParkingLot()`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/service/impl/ParkingLotServiceImpl.java): Khởi tạo bản ghi `ParkingLot` gắn với Merchant ID, trạng thái mặc định `ParkingLotStatusEnum.PENDING_APPROVAL`.
- [`ParkingLotImageServiceImpl.upload()`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/service/impl/ParkingLotImageServiceImpl.java): Kiểm tra số lượng ảnh tối đa 5, lưu trữ file và gắn ảnh đầu tiên làm ảnh bìa (`isCover = true`).

---

## 6. UI STATES & ERROR HANDLING

- **Validation Errors:** Bắt buộc nhập tên bãi, địa chỉ hợp lệ và tọa độ trong phạm vi hợp lệ (-90 đến 90 cho latitude, -180 đến 180 cho longitude).
- **Submitting State:** Nút `Tạo bãi đỗ` hiển thị loading spinner, vô hiệu hóa các thao tác click đúp.
- **Upload Partial Failure Handling:** Nếu tạo bãi thành công nhưng upload ảnh gặp lỗi mạng, hệ thống lưu `createdParkingLotId` để người dùng có thể bấm thử lại upload mà không bị tạo trùng bãi đỗ.

---

## 7. REDESIGN CONSIDERATIONS & INVARIANTS

### A. Yếu Tố Bắt Buộc Giữ Lại (Invariants)
1. **Chuỗi 2 giai đoạn (Tạo bãi -> Upload ảnh):** Đảm bảo tính toàn vẹn dữ liệu: Bãi xe phải được sinh ID trong cơ sở dữ liệu trước khi các file ảnh được lưu trữ gắn với ID đó.
2. **Quy chuẩn tọa độ 7 chữ số thập phân:** Cực kỳ quan trọng để đảm bảo sai số định vị thực tế dưới 1 mét, phục vụ dẫn đường cho xe container trọng tải lớn vào đúng cổng bãi.

### B. Đề Xuất Cải Thiện
1. **Tự động Geocoding ngược (Reverse Geocoding):** Khi người dùng nhập địa chỉ văn bản, hệ thống nên tự động gợi ý tọa độ GPS gần đúng (qua Nominatim hoặc Google Maps API) để người dùng không phải tự nhập kinh/vĩ độ thủ công.
