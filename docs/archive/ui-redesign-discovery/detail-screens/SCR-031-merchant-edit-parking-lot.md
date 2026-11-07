# Screen Specification: SCR-031 EditMerchantParkingLotPage (Chỉnh sửa bãi đỗ)

---

## 1. SCREEN IDENTIFIER & CLASSIFICATION

- **Screen ID:** `SCR-031`
- **Screen Name:** Chỉnh sửa & Cập nhật hồ sơ bãi đỗ xe (Edit Merchant Parking Lot)
- **Module:** `MOD-04: Merchant Operations Portal`
- **Route URL:** `/merchant/parking-lots/:parkingLotId/edit` (Định nghĩa tại [`AppRoutes.tsx:124`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L124) bọc bởi `MerchantLayout`)
- **Primary Component:** [`EditMerchantParkingLotPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/merchant/parking-lots/pages/EditMerchantParkingLotPage.tsx)
- **Sub-components:**
  - [`ParkingLotMapPicker.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/merchant/parking-lots/components/ParkingLotMapPicker.tsx) (Bản đồ chọn tọa độ tương tác)
  - Ant Design `Form`, `Input`, `InputNumber`, `Button`, `Tag`, `Alert`, `Skeleton`
- **Access Role:** `ROLE_MERCHANT` (Chặn tại router bằng `ProtectedRoute allowedRoles={['MERCHANT']}`)
- **Discovery Status:** `VERIFIED` (Mã nguồn Frontend & Backend đã được đối chiếu 100%)

---

## 2. BUSINESS PURPOSE & CONTEXT

### A. Business Objective
1. Cho phép Merchant chỉnh sửa thông tin bãi đỗ khi hồ sơ bị Admin từ chối (`REJECTED`) hoặc yêu cầu bổ sung thông tin (`CHANGES_REQUESTED`).
2. Hiển thị biên bản phản hồi từ Admin (`reviewReason`) để Merchant biết chính xác cần bổ sung giấy tờ gì hoặc chỉnh sửa thông tin nào.
3. Cập nhật lại tên bãi, địa chỉ chi tiết, và tọa độ địa lý chính xác trên bản đồ số trước khi gửi lại yêu cầu phê duyệt mới.
4. Đảm bảo tính kiểm soát: Ngăn chặn Merchant tự ý thay đổi tọa độ hoặc địa chỉ của bãi xe đã được duyệt (`APPROVED`) nhằm phòng ngừa gian lận vị trí.

### B. Target Users
- Chủ bãi đỗ xe nhận được thông báo yêu cầu bổ sung thông tin từ Quản trị viên.

### C. Entry Points
- Click nút `Chỉnh sửa` trên trang Chi tiết bãi đỗ (`SCR-030`).
- Click từ thông báo yêu cầu bổ sung trên Trung tâm thông báo (`SCR-041`).

### D. Exit Points
- Gửi thành công: Tự động điều hướng về trang Chi tiết bãi `/merchant/parking-lots/:id` (`SCR-030`).
- Hủy bỏ: Bấm nút quay lại hoặc menu chuyển trang.

---

## 3. UI STRUCTURE & LAYOUT

### A. Header Trang
- Tiêu đề H1: `Chỉnh sửa bãi đỗ`.
- Mô tả phụ: `Cập nhật thông tin và gửi lại để Admin kiểm duyệt.`
- Tag trạng thái hiện tại của bãi: Màu vàng (nếu sửa được) hoặc màu xám (nếu bị khóa).

### B. Khối Cảnh Báo Quy Tắc Kiểm Soát (.ant-alert)
1. **Cảnh báo quyền chỉnh sửa:** Nếu trạng thái bãi không thuộc `REJECTED` hoặc `CHANGES_REQUESTED`, hiển thị `Alert type="warning"`:
   - Tiêu đề: `Hồ sơ hiện không thể chỉnh sửa`.
   - Mô tả: `Chỉ chỉnh sửa khi trạng thái là REJECTED hoặc CHANGES_REQUESTED.`
   *(Toàn bộ các trường trong Form sẽ bị vô hiệu hóa `disabled={!canEdit}`)*.
2. **Khối ghi chú thẩm định của Admin:** Nếu có trường `reviewReason`, hiển thị `Alert type="info"`:
   - Tiêu đề: `Ghi chú kiểm duyệt gần nhất`.
   - Mô tả: Nội dung phản hồi chi tiết từ Admin (ví dụ: *"Ảnh chụp cổng vào chưa rõ biển báo PCCC, vui lòng chụp lại và đính kèm"*).

### C. Form Chỉnh Sửa Thông Tin Bãi Đỗ (.merchant-form-card)
- Trường `Tên bãi`: Input text, bắt buộc, tối đa 150 ký tự.
- Trường `Địa chỉ`: TextArea 3 dòng, bắt buộc, tối đa 300 ký tự.
- Khối tọa độ GPS:
  - Nút `Vị trí hiện tại` (icon `AimOutlined`): Tự động cập nhật tọa độ qua Geolocation.
  - 2 ô nhập: `Latitude` (InputNumber, precision 7, min -90 max 90) và `Longitude` (InputNumber, precision 7, min -180 max 180).
  - Bản đồ tương tác [`ParkingLotMapPicker`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/merchant/parking-lots/components/ParkingLotMapPicker.tsx) để kéo thả ghim vị trí.
- Nút bấm hành động:
  - Nút `Quay lại` (về chi tiết bãi).
  - Nút Primary `Gửi lại hồ sơ kiểm duyệt` (loading `{submitting}`, disabled nếu không được phép sửa).

---

## 4. FUNCTIONAL CATALOG & USER ACTIONS

| STT | Tên chức năng | Nút / Thao tác UI | Dữ liệu đầu vào | Điều kiện tiên quyết | Kết quả mong đợi |
|---|---|---|---|---|---|
| **FN-031-01** | Kiểm tra quyền chỉnh sửa | Tự động khi tải trang | Trạng thái bãi `lot.status` | Bãi thuộc quyền sở hữu | Nếu trạng thái là `APPROVED` hoặc `PENDING_APPROVAL`, khóa toàn bộ form |
| **FN-031-02** | Xem lý do bị từ chối / cần sửa | Tự động khi tải trang | Dữ liệu `lot.reviewReason` | Có ghi chú từ Admin | Hiển thị Banner ghi chú màu xanh lam |
| **FN-031-03** | Cập nhật vị trí GPS | Kéo thả ghim trên map hoặc click `Vị trí hiện tại` | Tọa độ mới | Form đang mở cho phép sửa | Cập nhật số liệu vào ô Latitude và Longitude |
| **FN-031-04** | Gửi lại hồ sơ kiểm duyệt | Click `Gửi lại hồ sơ kiểm duyệt` | Form data: name, address, lat, lng | Dữ liệu hợp lệ, bãi ở trạng thái REJECTED hoặc CHANGES_REQUESTED | Gọi API update, chuyển trạng thái bãi sang PENDING_APPROVAL, thông báo thành công |

---

## 5. TECHNICAL TRACEABILITY & BACKEND MAPPING

### A. API Endpoints
- `PUT /api/v1/merchant/parking-lots/{id}`: Cập nhật thông tin hồ sơ bãi đỗ.

### B. Controller & Method
- [`ParkingLotController.java:35-43`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/ParkingLotController.java#L35-L43):
  - `update(@AuthenticationPrincipal CustomUserDetails u, @PathVariable Long id, @Valid @RequestBody CreateParkingLotRequest req)`
  - Quyền hạn: `@PreAuthorize("hasRole('MERCHANT')")`

### C. Service Implementation
- [`ParkingLotServiceImpl.updateParkingLot()`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/service/impl/ParkingLotServiceImpl.java):
  - Kiểm tra quyền sở hữu bãi `parkingLot.getMerchant().getUser().getId().equals(merchantUserId)`.
  - Cập nhật tên, địa chỉ, kinh độ, vĩ độ.
  - Tự động reset trạng thái bãi xe về `ParkingLotStatusEnum.PENDING_APPROVAL` để đẩy vào hàng đợi duyệt của Admin.

---

## 6. UI STATES & ERROR HANDLING

- **Loading State:** Component Ant Design `Skeleton active paragraph={{ rows: 10 }}`.
- **Lockout State:** Nếu bãi đang ở trạng thái `APPROVED`, giao diện mờ form kèm cảnh báo không cho sửa để bảo đảm tính ổn định của hệ sinh thái bến bãi.
- **Error State:** Hiển thị `Alert type="error"` nếu không tìm thấy ID bãi hoặc lỗi kết nối mạng.

---

## 7. REDESIGN CONSIDERATIONS & INVARIANTS

### A. Yếu Tố Bắt Buộc Giữ Lại (Invariants)
1. **Khóa sửa đối với bãi đã duyệt:** Bắt buộc không cho Merchant tự ý đổi địa chỉ/tọa độ của bãi đã duyệt vì sẽ làm sai lệch dữ liệu đặt chỗ của các tài xế đang trên đường tới bãi.
2. **Hiển thị rõ lý do kiểm duyệt:** Luôn hiển thị trường `reviewReason` của Admin ở vị trí dễ nhìn nhất để giảm thiểu thời gian trao đổi qua lại giữa Merchant và Admin.

### B. Đề Xuất Cải Thiện
1. **Chỉnh sửa thông tin phi vị trí (Non-locational Updates):** Cho phép Merchant chỉnh sửa số điện thoại hotline hoặc giờ đóng/mở cửa mà không cần đưa bãi về trạng thái `PENDING_APPROVAL`, chỉ yêu cầu kiểm duyệt lại khi thay đổi tên, địa chỉ hoặc tọa độ GPS.
