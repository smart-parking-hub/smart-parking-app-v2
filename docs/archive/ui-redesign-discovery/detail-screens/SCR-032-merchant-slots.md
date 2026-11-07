# Screen Specification: SCR-032 MerchantSlotsPage (Cấu hình sức chứa)

---

## 1. SCREEN IDENTIFIER & CLASSIFICATION

- **Screen ID:** `SCR-032`
- **Screen Name:** Cấu hình sức chứa bãi đỗ theo loại xe (Merchant Slot Capacity Configuration)
- **Module:** `MOD-04: Merchant Operations Portal`
- **Route URL:** `/merchant/parking-lots/:parkingLotId/slots` (Định nghĩa tại [`AppRoutes.tsx:125`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L125) bọc bởi `MerchantLayout`)
- **Primary Component:** [`MerchantSlotsPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/merchant/slots/pages/MerchantSlotsPage.tsx)
- **Sub-components:** Ant Design `InputNumber`, `Progress`, `Popconfirm`, `Alert`, `Button`, `Skeleton`
- **Access Role:** `ROLE_MERCHANT` (Chặn tại router bằng `ProtectedRoute allowedRoles={['MERCHANT']}`)
- **Discovery Status:** `VERIFIED` (Mã nguồn Frontend & Backend đã được đối chiếu 100%)

---

## 2. BUSINESS PURPOSE & CONTEXT

### A. Business Objective
1. Cung cấp giao diện cho Merchant thiết lập tổng số chỗ đỗ (`totalCapacity`) cho từng phân loại phương tiện trong hệ thống (Xe tải nhỏ, xe tải trung, xe tải nặng, xe đầu kéo container).
2. Tự động tính toán số chỗ đỗ khả dụng (`availableCapacity`) dựa trên số lượng xe đang thực tế đỗ trong bãi.
3. Thiết lập chốt an toàn nghiệp vụ: Tuyệt đối không cho phép giảm tổng sức chứa xuống thấp hơn số xe đang đỗ thực tế trong bãi để tránh lỗi tràn bãi (Overcapacity Error).
4. Hỗ trợ cơ chế Lưu hàng loạt (Bulk Save) trong một giao dịch đơn nhất để tránh tình trạng mạng chập chờn gây lưu thiếu loại xe.

### B. Target Users
- Chủ bãi đỗ xe hoặc đội ngũ quản lý điều phối mặt bằng bến bãi.

### C. Entry Points
- Click nút `Slot` trên trang Chi tiết bãi đỗ (`SCR-030`).
- Tự động gợi ý mở sau khi bãi xe được Admin phê duyệt (`APPROVED`).

### D. Exit Points
- Nút `Chi tiết bãi`: Quay lại màn hình `/merchant/parking-lots/:id` (`SCR-030`).

---

## 3. UI STRUCTURE & LAYOUT

### A. Header Trang
- Tiêu đề H1: `Cấu hình sức chứa`.
- Mô tả phụ: `Thiết lập sức chứa theo loại xe và lưu tất cả trong một lần.`
- Nút điều hướng: `Chi tiết bãi` (icon `ArrowLeftOutlined`).

### B. Khối Cảnh Báo Quy Tắc Nghiệp Vụ
1. **Cảnh báo duyệt bãi:** Nếu bãi chưa được duyệt (`status !== 'APPROVED'`), hiển thị `Alert type="warning"`:
   - *"Bãi chưa được Admin duyệt — Sau khi Admin phê duyệt, bạn mới được cấu hình và lưu slot."*
2. **Cảnh báo bảo toàn số chỗ đỗ:** Hiển thị `Alert type="info"`:
   - *"Số chỗ đang sử dụng được bảo toàn: Khi thay đổi tổng sức chứa, hệ thống tự tính lại số chỗ trống và không cho giảm thấp hơn số xe đang đỗ."*

### C. Lưới Thẻ Sức Chứa Theo Loại Xe (.merchant-slot-grid)
Hiển thị danh sách thẻ đại diện cho từng loại phương tiện:
- Header thẻ:
  - Tên loại xe (In đậm, ví dụ: `Xe tải trung (3.5 - 10 tấn)`).
  - Trạng thái cấu hình: Tag `Đã cấu hình` hoặc `Chưa cấu hình`.
  - Tỷ lệ khả dụng: `{availableCapacity}/{totalCapacity} trống`.
- Thanh tiến trình `Progress`: Thể hiện tỷ lệ phần trăm chỗ đã có xe đỗ (màu xanh hoặc màu đỏ khi gần đầy).
- Dòng nhập liệu:
  - Nhãn: `Tổng số chỗ (Capacity)`.
  - Ô nhập: `InputNumber` (min 0, precision 0).
  - Ghi chú: Hiển thị số chỗ đang sử dụng `{occupied} chỗ đang đỗ`.

### D. Khối Điều Khiển Lưu Chân Trang (.merchant-form-actions)
- Nút bấm `Hủy thay đổi`: Khôi phục lại các giá trị ban đầu từ máy chủ.
- Nút bấm `Lưu cấu hình tất cả các loại xe`:
  - Nếu có loại xe bị giảm sức chứa (`hasDecrease`), bọc trong `Popconfirm`: *"Xác nhận giảm sức chứa? Hệ thống đã kiểm tra đảm bảo không thấp hơn số xe đang đỗ."*
  - Nút Primary, icon `SaveOutlined`, loading `{saving}`.

---

## 4. FUNCTIONAL CATALOG & USER ACTIONS

| STT | Tên chức năng | Nút / Thao tác UI | Dữ liệu đầu vào | Điều kiện tiên quyết | Kết quả mong đợi |
|---|---|---|---|---|---|
| **FN-032-01** | Xem cấu hình sức chứa hiện tại | Mở trang `/slots` | ID bãi đỗ | Bãi thuộc quyền Merchant | Tải danh sách slot và số xe đang đỗ của từng loại xe |
| **FN-032-02** | Thay đổi sức chứa từng loại xe | Nhập số vào ô InputNumber | Số nguyên >= 0 | Bãi đã APPROVED | Cập nhật giá trị nháp (drafts) trên giao diện |
| **FN-032-03** | Kiểm tra ràng buộc giảm sức chứa | Tự động khi bấm Lưu | Giá trị mới vs Số xe đang đỗ (`occupied`) | Giá trị mới < occupied | Báo lỗi ngay lập tức, chặn không cho gửi request |
| **FN-032-04** | Lưu cấu hình hàng loạt | Click `Lưu cấu hình tất cả` | Mảng `slots: [{ vehicleType, totalCapacity }]` | Bãi APPROVED, dữ liệu hợp lệ | Gửi `PUT /slots/bulk`, cập nhật DB, hiển thị toast thành công |

---

## 5. TECHNICAL TRACEABILITY & BACKEND MAPPING

### A. API Endpoints
1. `GET /api/v1/parking-lots/{id}/slots`: Lấy danh sách slot hiện tại.
2. `PUT /api/v1/merchant/parking-lots/{id}/slots/bulk`: Cập nhật toàn bộ cấu hình slot trong 1 request.

### B. Controller & Method
- [`ParkingLotController.java:83-91`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/ParkingLotController.java#L83-L91):
  - `configSlots(@AuthenticationPrincipal CustomUserDetails u, @PathVariable Long id, @Valid @RequestBody BulkSlotConfigRequest req)`
  - Quyền hạn: `@PreAuthorize("hasRole('MERCHANT')")`

### C. Service Implementation
- [`SlotServiceImpl.configureSlots()`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/service/impl/SlotServiceImpl.java):
  - Duyệt qua từng loại xe trong danh sách.
  - Tìm bản ghi `Slot` theo `parkingLotId` và `vehicleType`.
  - Tính toán chênh lệch: `delta = newTotal - oldTotal`.
  - Kiểm tra điều kiện: `availableCapacity + delta >= 0` (ngăn giảm dưới số xe đang đỗ).
  - Cập nhật `totalCapacity` và `availableCapacity`. Lưu vào DB.

---

## 6. UI STATES & ERROR HANDLING

- **Validation Error States:**
  - Nhập số âm hoặc số thập phân: Báo lỗi định dạng.
  - Nhập sức chứa nhỏ hơn số xe đang đỗ: Báo lỗi *"Không thể giảm dưới X chỗ đang sử dụng"*.
- **Unauthorized Gatekeeper:** Nếu bãi chưa được duyệt (`APPROVED`), vô hiệu hóa nút Lưu và hiển thị Banner cảnh báo.

---

## 7. REDESIGN CONSIDERATIONS & INVARIANTS

### A. Yếu Tố Bắt Buộc Giữ Lại (Invariants)
1. **Thuật toán bảo toàn chỗ đỗ (`occupied invariant`):** Bắt buộc phải duy trì quy tắc `totalCapacity >= occupied` cả ở Frontend và Backend để ngăn chặn sự cố dữ liệu âm chỗ trống (`availableCapacity < 0`).
2. **Cập nhật đồng thời (Bulk Update):** Phải lưu toàn bộ loại xe trong cùng một Transaction để đảm bảo tính nhất quán của bãi xe.

### B. Đề Xuất Cải Thiện
1. **Cảnh báo giới hạn diện tích vật lý:** Bổ sung tính năng cảnh báo tổng diện tích quy đổi (m²) để giúp chủ bãi không cấu hình vượt quá diện tích thực tế của thửa đất.
