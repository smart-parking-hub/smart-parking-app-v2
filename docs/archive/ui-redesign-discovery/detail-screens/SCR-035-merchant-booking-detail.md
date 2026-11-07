# Screen Specification: SCR-035 MerchantBookingDetailPage (Chi tiết đơn đặt chỗ)

---

## 1. SCREEN IDENTIFIER & CLASSIFICATION

- **Screen ID:** `SCR-035`
- **Screen Name:** Chi tiết đơn đặt chỗ & Nhật ký vào/ra (Merchant Booking Operational Detail)
- **Module:** `MOD-04: Merchant Operations Portal`
- **Route URL:** `/merchant/bookings/:bookingId` (Định nghĩa tại [`AppRoutes.tsx:128`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L128) bọc bởi `MerchantLayout`)
- **Primary Component:** [`MerchantBookingDetailPage.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/merchant/bookings/pages/MerchantBookingDetailPage.tsx)
- **Sub-components:** Ant Design `Descriptions`, `Tag`, `Button`, `Alert`, `Skeleton`
- **Access Role:** `ROLE_MERCHANT` (Chặn tại router bằng `ProtectedRoute allowedRoles={['MERCHANT']}`)
- **Discovery Status:** `VERIFIED` (Mã nguồn Frontend & Backend đã được đối chiếu 100%)

---

## 2. BUSINESS PURPOSE & CONTEXT

### A. Business Objective
1. Cung cấp hồ sơ chi tiết toàn diện của một đơn đặt chỗ cụ thể để phục vụ công tác kiểm tra, đối soát hóa đơn và giải quyết thắc mắc của khách hàng tại bãi đỗ.
2. Theo dõi thời gian thực tế xe vào cổng (`checkInTime`) và thời gian thực tế xe ra cổng (`checkOutTime`) so với thời gian dự kiến đăng ký ban đầu.
3. Đối soát minh bạch giữa số tiền cọc ban đầu (`advanceDeposit`) và tổng chi phí chuyến đỗ (`totalAmount`) đã được tính cước.
4. Cung cấp lối tắt nhanh dẫn sang công cụ quét mã QR (`SCR-036`) khi xe đang ở các trạng thái chờ xử lý tại cổng.

### B. Target Users
- Quản lý bãi đỗ hoặc nhân viên đối soát khiếu nại của Merchant.

### C. Entry Points
- Click nút `Chi tiết` trên bảng danh sách booking (`SCR-034`).
- Click vào đơn đặt chỗ từ danh sách booking gần đây trên Dashboard (`SCR-026`).

### D. Exit Points
- Nút `Quay lại danh sách`: Về `/merchant/bookings` (`SCR-034`).
- Nút `Mở quét QR`: Chuyển sang `/merchant/qr-scanner` (`SCR-036`).

---

## 3. UI STRUCTURE & LAYOUT

### A. Header Trang
- Nút link `Quay lại danh sách` (icon `ArrowLeftOutlined`).
- Tiêu đề H1: `Chi tiết booking`.
- Mô tả phụ: `Thông tin đơn đặt chỗ và trạng thái vận hành.`
- Nút hành động: `Tải lại` (icon `ReloadOutlined`).

### B. Thẻ Thông Tin Chi Tiết Đơn Đặt Chỗ (.merchant-detail-card)
Bảng Ant Design `Descriptions bordered column={1}`:
1. **Mã booking:** Chuỗi mã định danh duy nhất (ví dụ: `BK-9F8A12BC`).
2. **Trạng thái vé:** Tag màu sắc chỉ thị trạng thái hiện tại (`PENDING_PAYMENT`, `PENDING_CHECKIN`, `PARKING`, `OVERTIME`, `AWAITING_FINAL_PAYMENT`, `COMPLETED`, `CANCELLED`, `EXPIRED`, `REVIEWED`).
3. **Bãi đỗ:** Tên bãi xe và địa chỉ chi tiết.
4. **Thông tin tài xế:** Họ tên tài xế và số điện thoại liên lạc.
5. **Thông tin phương tiện:** Biển kiểm soát xe và phân loại phương tiện.
6. **Thời gian lịch trình:**
   - Check-in dự kiến (`expectedCheckInTime`).
   - Check-out dự kiến (`expectedCheckOutTime`).
   - Thời hạn giữ chỗ (`expiresAt`).
7. **Thời gian thực tế:**
   - Check-in thực tế (`checkInTime`): Ghi nhận khi quét mã vào cổng.
   - Check-out thực tế (`checkOutTime`): Ghi nhận khi quét mã ra cổng.
8. **Thông tin tài chính:**
   - Tiền cọc giữ chỗ: `{formatMoney(advanceDeposit)}`.
   - Tổng cước phí thanh toán: `{formatMoney(totalAmount)}`.

### C. Lối Tắt Thao Tác Cổng (Action Footer)
- Nếu booking ở trạng thái `PENDING_CHECKIN`, `PARKING`, hoặc `OVERTIME`: Hiển thị nút Primary `Mở quét QR` (điều hướng sang `/merchant/qr-scanner`).

---

## 4. FUNCTIONAL CATALOG & USER ACTIONS

| STT | Tên chức năng | Nút / Thao tác UI | Dữ liệu đầu vào | Điều kiện tiên quyết | Kết quả mong đợi |
|---|---|---|---|---|---|
| **FN-035-01** | Xem chi tiết đơn đặt chỗ | Mở URL `/merchant/bookings/:id` | ID booking từ URL | Booking thuộc bãi của Merchant | Hiển thị toàn bộ dữ liệu xe, thời gian, tài xế, tài chính |
| **FN-035-02** | Mở công cụ quét QR | Click nút `Mở quét QR` | Không | Booking ở trạng thái chờ vào/ra | Điều hướng thẳng tới màn hình Quét mã QR (`SCR-036`) |
| **FN-035-03** | Tải lại chi tiết | Click nút `Tải lại` | Không | Không | Làm mới dữ liệu từ máy chủ |

---

## 5. TECHNICAL TRACEABILITY & BACKEND MAPPING

### A. API Endpoints
- `GET /api/v1/merchant/bookings`: Lấy danh sách booking của Merchant để lọc tìm đơn theo ID.

### B. Controller & Method
- [`MerchantController.java:27-35`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/MerchantController.java#L27-L35):
  - `getMerchantBookings(@AuthenticationPrincipal CustomUserDetails u, @RequestParam(required = false) Long parkingLotId, Pageable pageable)`

### C. Phát Hiện Khoảng Trống Kỹ Thuật (Backend Gap)
- **Mã nguồn thực tế tại [`MerchantBookingDetailPage.tsx:40-46`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/merchant/bookings/pages/MerchantBookingDetailPage.tsx#L40-L46) ghi chú rõ:**
  ```typescript
  // BE chưa có GET /merchant/bookings/{id} — lấy trang và tìm theo id
  let found: BookingDto | undefined
  for (let page = 0; page < 5 && !found; page += 1) {
    const result = await getMerchantBookings(page, 50)
    found = result.content.find((item) => item.id === id)
    if (page >= result.totalPages - 1) break
  }
  ```
  Backend hiện tại **chưa có endpoint chuyên biệt `GET /api/v1/merchant/bookings/{id}`**. Frontend đang phải dùng vòng lặp quét qua 5 trang (tối đa 250 bản ghi) để tìm đơn theo ID. Đây là một điểm yếu hiệu năng nghiêm trọng cần khắc phục.

---

## 6. UI STATES & ERROR HANDLING

- **Loading State:** Hiển thị component Ant Design `Skeleton active paragraph={{ rows: 8 }}`.
- **Not Found State:** Nếu duyệt qua các trang mà không tìm thấy booking, hiển thị `Alert type="error"`: *"Không tìm thấy booking thuộc bãi của bạn"*.
- **Invalid ID State:** Nếu ID trên URL không phải là số hợp lệ, báo lỗi *"Mã booking không hợp lệ"*.

---

## 7. REDESIGN CONSIDERATIONS & INVARIANTS

### A. Yếu Tố Bắt Buộc Giữ Lại (Invariants)
1. **Nhật ký thời gian chính xác:** Bắt buộc duy trì cặp mốc thời gian dự kiến vs thực tế để phục vụ giải quyết khiếu nại tranh chấp cước phí.
2. **Quyền riêng tư dữ liệu:** Chỉ cho phép xem chi tiết đơn thuộc các bãi xe mà Merchant đang sở hữu.

### B. Đề Xuất Cải Thiện Cho Thiết Kế Mới
1. **Bổ sung ngay API `GET /api/v1/merchant/bookings/{id}` phía Backend:** Thay thế cơ chế quét trang phân trang hiện tại bằng một API truy vấn trực tiếp theo ID để tối ưu tốc độ tải trang.
2. **Hiển thị lịch sử giao dịch (Payment History Audit):** Bổ sung bảng phụ thể hiện chi tiết tiền cọc đã thu qua cổng nào, mã giao dịch PayOS và số tiền phạt quá giờ (nếu có).
