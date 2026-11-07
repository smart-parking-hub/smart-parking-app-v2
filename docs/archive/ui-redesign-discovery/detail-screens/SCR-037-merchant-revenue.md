# Screen Specification: SCR-037 MerchantRevenuePage (Báo cáo doanh thu)

---

## 1. SCREEN IDENTIFIER & CLASSIFICATION

- **Screen ID:** `SCR-037`
- **Screen Name:** Phân tích & Báo cáo doanh thu bãi đỗ (Merchant Financial & Revenue Analytics)
- **Module:** `MOD-04: Merchant Operations Portal`
- **Route URL:** `/merchant/revenue` (Định nghĩa tại [`AppRoutes.tsx:130`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L130) bọc bởi `MerchantLayout`)
- **Primary Component:** [`MerchantRevenuePage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/merchant/revenue/pages/MerchantRevenuePage.tsx)
- **Sub-components:**
  - `Recharts`: `ResponsiveContainer`, `ComposedChart`, `Bar`, `Line`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`, `Legend`
  - Ant Design: `Segmented`, `DatePicker.RangePicker`, `Statistic`, `Table`, `Alert`, `Skeleton`, `Empty`, `Button`
- **Access Role:** `ROLE_MERCHANT` (Chặn tại router bằng `ProtectedRoute allowedRoles={['MERCHANT']}`)
- **Discovery Status:** `VERIFIED` (Mã nguồn Frontend & Backend đã được đối chiếu 100%)

---

## 2. BUSINESS PURPOSE & CONTEXT

### A. Business Objective
1. Cung cấp báo cáo tài chính chuyên sâu và phân tích chu kỳ doanh thu của mạng lưới bãi đỗ xe thuộc quyền sở hữu của Merchant.
2. Cho phép tùy biến xem theo 3 mức độ chi tiết (Granularity): Theo ngày (`DAY`), Theo tháng (`MONTH`), hoặc Theo năm (`YEAR`).
3. Trực quan hóa mối tương quan giữa Doanh thu tiền tệ (VND) và Số lượng đơn đặt chỗ hoàn thành (`completedBookings`) qua biểu đồ kết hợp (Composed Chart: Cột Doanh thu + Đường Số đơn).
4. Cung cấp số dư ví khả dụng (`walletBalance`) sẵn sàng để tạo lệnh rút tiền về tài khoản ngân hàng.

### B. Target Users
- Chủ bãi đỗ xe, kế toán doanh nghiệp vận tải theo dõi số liệu doanh thu và đối soát định kỳ.

### C. Entry Points
- Click mục "Doanh thu" trên Sidebar menu của `MerchantLayout`.
- Click liên kết "Xem theo ngày/tháng/năm" từ biểu đồ Dashboard (`SCR-026`).

### D. Exit Points
- Click nút `Yêu cầu rút tiền`: Điều hướng sang Quản lý ví và rút tiền `/merchant/withdrawals` (`SCR-038`).

---

## 3. UI STRUCTURE & LAYOUT

### A. Header Trang
- Tiêu đề H1: `Doanh thu`.
- Mô tả phụ: `Theo dõi doanh thu theo ngày, tháng, năm từ giao dịch thanh toán thành công.`
- Nút liên kết: `Yêu cầu rút tiền` (icon `WalletOutlined`, chuyển hướng sang `/merchant/withdrawals`).

### B. Thanh Công Cụ Bộ Lọc Thời Gian (.merchant-revenue-filters)
- Thanh chuyển đổi `Segmented`: `Theo ngày` (DAY) | `Theo tháng` (MONTH) | `Theo năm` (YEAR).
- Bộ chọn khoảng thời gian `DatePicker.RangePicker`:
  - Tự động thay đổi picker mode theo độ mịn đã chọn (`pickerModeOf(granularity)`): Chọn khoảng ngày, khoảng tháng, hoặc khoảng năm.
- Nút bấm `Áp dụng`: Primary Button, icon `CalendarOutlined`.

### C. Thẻ Thống Kê Tổng Quan (Financial KPI Cards)
Hiển thị 3 chỉ số tài chính chủ chốt:
1. **Tổng doanh thu:** Giá trị tiền tệ lớn in đậm `{formatMoney(totalRevenue)}`, icon `DollarOutlined`.
2. **Số dư ví khả dụng:** Giá trị tiền `{formatMoney(walletBalance)}`, icon `WalletOutlined`.
3. **Đơn hoàn thành:** Con số `{completedBookings}`, icon `CheckCircleOutlined`.

### D. Biểu Đồ Phân Tích Kết Hợp (Composed Chart Card)
Biểu đồ Recharts ComposedChart với 2 trục tung độc lập:
- Trục hoành X: Nhãn thời gian theo chu kỳ (`d/m/Y`, `Thg m/Y`, hoặc `Y`).
- Trục tung trái (Y-Left): Doanh thu tiền tệ VND (hiển thị cột Bar màu vàng cam `#e08a00`).
- Trục tung phải (Y-Right): Số lượng đơn đặt chỗ (hiển thị đường Line màu xanh dương `#0284c7` kèm chấm tròn).
- Tooltip tương tác: Hiển thị song song số tiền doanh thu và số lượt booking hoàn tất khi rê chuột.
- Nếu không có dữ liệu: Hiển thị Ant Design `Empty description="Chưa có dữ liệu doanh thu trong khoảng thời gian này"`.

### E. Bảng Kê Chi Tiết Số Liệu (Data Breakdown Table)
Bảng số liệu dạng bảng:
- Cột 1: **Kỳ thời gian** (Ngày, Tháng hoặc Năm).
- Cột 2: **Số đơn hoàn thành** (`bookingCount`).
- Cột 3: **Doanh thu ghi nhận** (`revenue` định dạng tiền tệ VND).

---

## 4. FUNCTIONAL CATALOG & USER ACTIONS

| STT | Tên chức năng | Nút / Thao tác UI | Dữ liệu đầu vào | Điều kiện tiên quyết | Kết quả mong đợi |
|---|---|---|---|---|---|
| **FN-037-01** | Xem doanh thu mặc định | Tải trang `/merchant/revenue` | Token Merchant, granularity=DAY | Đã đăng nhập vai trò MERCHANT | Tải dữ liệu doanh thu ngày, cập nhật chart và bảng số liệu |
| **FN-037-02** | Chuyển đổi chu kỳ thời gian | Click tab Ngày / Tháng / Năm | Giá trị `DAY`, `MONTH`, `YEAR` | Không | Tải lại API theo chu kỳ mới, đổi định dạng trục biểu đồ |
| **FN-037-03** | Lọc theo khoảng thời gian | Chọn RangePicker & Click Áp dụng | Ngày bắt đầu, Ngày kết thúc | Khoảng ngày hợp lệ | Lọc doanh thu chính xác trong khoảng thời gian đã chọn |
| **FN-037-04** | Chuyển sang tạo lệnh rút tiền | Click `Yêu cầu rút tiền` | Không | Không | Điều hướng sang `/merchant/withdrawals` (`SCR-038`) |

---

## 5. TECHNICAL TRACEABILITY & BACKEND MAPPING

### A. API Endpoints
- `GET /api/v1/merchant/revenue`: Lấy dữ liệu doanh thu tổng hợp.
  - Query params: `startDate` (ISO LocalDateTime), `endDate` (ISO LocalDateTime), `granularity` (`DAY`, `MONTH`, `YEAR`).

### B. Controller & Method
- [`MerchantController.java:50-59`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/MerchantController.java#L50-L59):
  - `getRevenue(@AuthenticationPrincipal CustomUserDetails u, @RequestParam(required = false) LocalDateTime startDate, @RequestParam(required = false) LocalDateTime endDate, @RequestParam(defaultValue = "DAY") RevenueGranularityEnum granularity)`
  - Quyền hạn: `@PreAuthorize("hasRole('MERCHANT')")`

### C. Service Implementation
- [`ParkingLotServiceImpl.getTotalRevenue()`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/service/impl/ParkingLotServiceImpl.java):
  - Lấy `Merchant` theo user ID.
  - Truy vấn bảng `Payment` với điều kiện `status = 'SUCCESS'`, thuộc các bãi của Merchant, trong khoảng từ `startDate` đến `endDate`.
  - Nhóm dữ liệu (Aggregation) theo ngày, tháng hoặc năm.
  - Lấy số dư ví từ `MerchantWalletService.getWallet(merchant.getId())`.

---

## 6. UI STATES & ERROR HANDLING

- **Loading State:** Component Ant Design `Skeleton active paragraph={{ rows: 10 }}`.
- **Empty State:** Hiển thị `Empty description="Chưa có dữ liệu doanh thu trong khoảng thời gian này"`.
- **Error State:** Hiển thị `Alert type="error"` khi không thể truy xuất API.

---

## 7. REDESIGN CONSIDERATIONS & INVARIANTS

### A. Yếu Tố Bắt Buộc Giữ Lại (Invariants)
1. **Dữ liệu chỉ tính từ Payment SUCCESS:** Tuyệt đối không tính các giao dịch đang chờ (`PENDING`) hoặc đã hủy (`CANCELLED`) vào doanh thu thực nhận.
2. **2 trục tọa độ độc lập (Dual Y-Axis):** Doanh thu có giá trị hàng triệu/chục triệu trong khi số đơn có giá trị hàng chục/hàng trăm; bắt buộc duy trì 2 trục tung để biểu đồ không bị bẹp rúm.

### B. Đề Xuất Cải Thiện
1. **Phân tích theo phương thức thanh toán:** Bổ sung biểu đồ tròn (Pie Chart) thể hiện tỷ lệ thanh toán qua PayOS (QR ngân hàng) so với Tiền mặt tại cổng bãi.
2. **Xuất báo cáo PDF/Excel:** Bổ sung nút bấm tải file sao kê doanh thu có đóng dấu logo SmartParkingHub để phục vụ báo cáo thuế.
