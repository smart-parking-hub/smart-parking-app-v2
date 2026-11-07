# Screen Specification: SCR-033 MerchantPricingPage (Cấu hình bảng giá)

---

## 1. SCREEN IDENTIFIER & CLASSIFICATION

- **Screen ID:** `SCR-033`
- **Screen Name:** Cấu hình ma trận bảng giá theo loại xe & phụ phí (Merchant Pricing Matrix Configuration)
- **Module:** `MOD-04: Merchant Operations Portal`
- **Route URL:** `/merchant/parking-lots/:parkingLotId/pricing` (Định nghĩa tại [`AppRoutes.tsx:126`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L126) bọc bởi `MerchantLayout`)
- **Primary Component:** [`MerchantPricingPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/merchant/pricing/pages/MerchantPricingPage.tsx)
- **Sub-components:** Ant Design `InputNumber`, `Select`, `Alert`, `Button`, `Skeleton`, `Popconfirm`
- **Access Role:** `ROLE_MERCHANT` (Chặn tại router bằng `ProtectedRoute allowedRoles={['MERCHANT']}`)
- **Discovery Status:** `VERIFIED` (Mã nguồn Frontend & Backend đã được đối chiếu 100%)

---

## 2. BUSINESS PURPOSE & CONTEXT

### A. Business Objective
1. Cho phép Merchant chủ động thiết lập đơn giá đỗ xe theo giờ (`basePricePerHour`) phù hợp với giá trị và kích thước của từng loại phương tiện vận tải.
2. Thiết lập cơ chế định giá linh hoạt theo nhu cầu (Surge Pricing): Cấu hình hệ số phụ trội (`surgeMultiplier`) trong khung giờ cao điểm (`surgeStartTime` đến `surgeEndTime`) để tối đa hóa doanh thu bãi.
3. Thiết lập chế tài phạt đỗ quá giờ (`overtimePenaltyMultiplier`, hệ số từ 1.0 đến 9.99) nhằm ngăn ngừa tình trạng tài xế chiếm dụng chỗ đỗ quá giờ hẹn, giải phóng slot cho các booking tiếp theo.
4. Tích hợp bộ công cụ giả lập tính cước (Interactive Pricing Simulator) giúp Merchant thử nghiệm ngay công thức tính tiền trước khi áp dụng vào thực tế.

### B. Target Users
- Chủ bãi đỗ xe thiết lập chính sách giá hoặc điều chỉnh biểu phí theo mùa vụ/ngày lễ.

### C. Entry Points
- Click nút `Bảng giá` trên trang Chi tiết bãi đỗ (`SCR-030`).

### D. Exit Points
- Nút `Chi tiết bãi`: Quay lại màn hình `/merchant/parking-lots/:id` (`SCR-030`).

---

## 3. UI STRUCTURE & LAYOUT

### A. Header Trang
- Tiêu đề H1: `Cấu hình bảng giá`.
- Mô tả phụ: `Thiết lập giá riêng cho từng loại xe. Đơn vị tiền tệ: VND.`
- Nút điều hướng: `Chi tiết bãi` (icon `ArrowLeftOutlined`).

### B. Khối Giả Lập Tính Tiền (.merchant-pricing-preview-card)
Thẻ công cụ tính thử cước phí đỗ xe tương tác:
- Header: Icon `CalculatorOutlined` kèm tiêu đề `Công cụ tính thử cước phí`.
- Bộ lọc mô phỏng:
  - Chọn loại xe: Dropdown chọn trong 4 loại xe tải.
  - Số giờ đỗ cơ bản: Ô nhập số (ví dụ: `4` giờ).
  - Số giờ đỗ quá hạn: Ô nhập số (ví dụ: `2` giờ).
- Bảng kết quả giả lập:
  - Tiền giờ cơ bản = `giờ * đơn giá * hệ số cao điểm`.
  - Phí phạt quá giờ = `giờ quá hạn * đơn giá * hệ số quá giờ`.
  - **Tổng tiền khách phải trả:** Con số lớn in đậm, màu xanh lá cây (ví dụ: `350.000 ₫`).

### C. Danh Sách Thẻ Cấu Hình Bảng Giá (.merchant-pricing-grid)
Mỗi loại xe hiển thị một khối cấu hình chi tiết:
1. **Giá cơ bản theo giờ (`basePricePerHour`):** `InputNumber`, min 1.000 VND, step 5.000 VND, đơn vị VND/giờ.
2. **Khung giờ cao điểm (Surge Window):**
   - Giờ bắt đầu (`surgeStartTime`) & Giờ kết thúc (`surgeEndTime`): Input dạng `HH:mm` (ví dụ: `06:00` đến `18:00`).
   - Hệ số phụ trội (`surgeMultiplier`): `InputNumber` từ 1.00 đến 9.99 (ví dụ: `1.20` tức tăng 20%).
3. **Hệ số phạt quá giờ (`overtimePenaltyMultiplier`):**
   - `InputNumber` từ 1.00 đến 9.99 (mặc định là `2.00` tức phạt gấp đôi đơn giá giờ).

### D. Nút Hành Động Chân Trang
- Nút `Lưu toàn bộ bảng giá`: Primary button, icon `SaveOutlined`, loading `{saving}`.

---

## 4. FUNCTIONAL CATALOG & USER ACTIONS

| STT | Tên chức năng | Nút / Thao tác UI | Dữ liệu đầu vào | Điều kiện tiên quyết | Kết quả mong đợi |
|---|---|---|---|---|---|
| **FN-033-01** | Xem bảng giá hiện tại | Mở trang `/pricing` | ID bãi đỗ | Bãi thuộc quyền Merchant | Tải danh sách đơn giá và hệ số cước của từng loại xe |
| **FN-033-02** | Thử nghiệm tính cước | Thay đổi số giờ đỗ và quá giờ | Giờ đỗ, giờ quá hạn, loại xe | Có nhập giá cơ bản | Tự động cập nhật tổng tiền trên khối Preview theo thời gian thực |
| **FN-033-03** | Nhập đơn giá và hệ số cước | Nhập các trường trong thẻ xe | Đơn giá > 0, hệ số 1.0 - 9.99, khung giờ | Bãi đã APPROVED | Lưu trữ dữ liệu nháp vào state |
| **FN-033-04** | Kiểm tra tính hợp lệ khung giờ | Tự động khi lưu | Giờ bắt đầu, Giờ kết thúc | Không được để trống 1 trong 2 | Bắt buộc nhập cả hai hoặc để trống cả hai |
| **FN-033-05** | Lưu hàng loạt bảng giá | Click `Lưu toàn bộ bảng giá` | Mảng `pricingRules` | Bãi APPROVED, dữ liệu hợp lệ | Gửi request `PUT /pricing/bulk`, cập nhật DB, hiển thị toast thành công |

---

## 5. TECHNICAL TRACEABILITY & BACKEND MAPPING

### A. API Endpoints
1. `GET /api/v1/parking-lots/{id}/pricing`: Lấy danh sách quy tắc tính giá hiện có.
2. `PUT /api/v1/merchant/parking-lots/{id}/pricing/bulk`: Cập nhật bảng giá cho tất cả các loại xe trong một giao dịch.

### B. Controller & Method
- [`ParkingLotController.java:102-110`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/ParkingLotController.java#L102-L110):
  - `configPricingRules(@AuthenticationPrincipal CustomUserDetails u, @PathVariable Long id, @Valid @RequestBody BulkPricingRuleRequest req)`
  - Quyền hạn: `@PreAuthorize("hasRole('MERCHANT')")`

### C. Service Implementation
- [`SlotServiceImpl.configurePricingRules()`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/service/impl/SlotServiceImpl.java):
  - Tìm hoặc tạo mới bản ghi `PricingRule` cho từng loại xe.
  - Lưu trữ `basePricePerHour`, `surgeMultiplier`, `surgeStartTime`, `surgeEndTime`, `overtimePenaltyMultiplier`.

---

## 6. UI STATES & ERROR HANDLING

- **Validation Rules:**
  - `basePricePerHour` bắt buộc lớn hơn 0.
  - `surgeMultiplier` và `overtimePenaltyMultiplier` phải nằm trong khoảng từ `1.00` đến `9.99`.
  - Giờ bắt đầu và kết thúc cao điểm: Phải nhập đủ cả 2 hoặc để trống cả 2.
- **Unauthorized Gatekeeper:** Bãi chưa duyệt (`APPROVED`) sẽ bị khóa chức năng lưu giá.

---

## 7. REDESIGN CONSIDERATIONS & INVARIANTS

### A. Yếu Tố Bắt Buộc Giữ Lại (Invariants)
1. **Thuật toán tính phụ phí quá giờ đồng nhất:** Công thức phạt quá giờ tại đây là chuẩn đối soát được Backend [`CheckInOutServiceImpl:105-111`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/service/impl/CheckInOutServiceImpl.java#L105-L111) sử dụng khi bảo vệ bấm Check-out; tuyệt đối không thay đổi cách tính làm lệch hóa đơn.
2. **Khung giờ cao điểm an toàn:** Phải định dạng `HH:mm:ss` chuẩn ISO để Backend so khớp thời gian xe check-in thực tế.

### B. Đề Xuất Cải Thiện
1. **Giá đỗ theo block 30 phút hoặc theo ca đêm:** Thiết kế hiện tại chỉ hỗ trợ đơn giá tính theo block 1 giờ tròn; cần mở rộng cho phép tính cước theo block 15-30 phút hoặc giá trọn gói qua đêm (Overnight Flat Rate).
