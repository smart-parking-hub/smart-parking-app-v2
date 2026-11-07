# Đặc Tả Màn Hình SCR-047: AdminTransactionsPage

---

## A. THÔNG TIN CHUNG (General Information)

- **Mã màn hình:** `SCR-047`
- **Tên màn hình:** Giao dịch và đối soát (Transactions & Reconciliation Audit)
- **URL Route / Path:** `/admin/transactions` (được cấu hình tại [`AppRoutes.tsx:102`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L102))
- **Quyền truy cập (RBAC):** Bắt buộc Role `ADMIN` ([`AppRoutes.tsx:95`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L95))
- **Mục tiêu nghiệp vụ:** Giám sát nhật ký dòng tiền vào/ra trên toàn sàn (tiền cọc, thanh toán cuối, phí phạt quá giờ, tiền hoàn cọc) để phục vụ công tác thanh tra kế toán và giải quyết mâu thuẫn tài chính.
- **Actor chính:** System Administrator (Quản trị viên tài chính / Đối soát).

---

## B. CẤU TRÚC GIAO DIỆN (UI Structure)

1. **Header trang (`AdminPageHeader`):**
   - Eyebrow: `QUẢN LÝ TÀI CHÍNH`
   - Tiêu đề: `Giao dịch và đối soát`
   - Mô tả: `Theo dõi luồng tiền cọc, phí đỗ, phí quá giờ và hoàn tiền.`
2. **Thanh công cụ lọc & tìm kiếm (`.admin-toolbar`):**
   - Ô tìm kiếm text (`Input prefix={<SearchOutlined />} allowClear`): Tìm kiếm tức thời theo mã giao dịch (`code`), mã đặt chỗ (`bookingCode`), số điện thoại người trả (`payerName`) hoặc tên Merchant.
   - Hộp chọn trạng thái (`Select`):
     - `ALL`: Tất cả trạng thái
     - `SUCCESS`: Thành công
     - `PENDING`: Đang chờ
     - `FAILED`: Thất bại
     - `REFUNDED`: Đã hoàn tiền
   - Badge số lượng giao dịch hiển thị (`visible.length giao dịch`).
3. **Bảng dữ liệu dòng tiền (`Table`):**
   - Cột 1: Giao dịch (Mã giao dịch in đậm + Mã booking in nhỏ)
   - Cột 2: Người thanh toán (Số điện thoại tài xế)
   - Cột 3: Loại giao dịch (Việt hóa: Tiền cọc, Thanh toán cuối, Phí quá giờ, Hoàn tiền, Rút tiền)
   - Cột 4: Số tiền (Định dạng tiền tệ VNĐ, căn lề phải)
   - Cột 5: Trạng thái giao dịch (Tag phân loại màu sắc)
   - Cột 6: Thời gian tạo giao dịch
   - Cột 7: Thao tác (Nút icon con mắt xem chi tiết)
4. **Modal chi tiết giao dịch (`Modal`):**
   - Tiêu đề: "Chi tiết giao dịch".
   - Bảng thuộc tính viền khung (`Descriptions column={1} bordered`):
     - Mã giao dịch
     - Booking
     - Người thanh toán
     - Merchant
     - Cổng thanh toán (Gateway: PAYOS, VNPAY, CASH,...)
     - Số tiền
     - Trạng thái
     - Thời gian

---

## C. DANH SÁCH TƯƠNG TÁC & ACTION (Interaction Specification)

| Element Name | Loại UI | Hành Động Người Dùng | Điều Kiện Kích Hoạt | Phản Hồi Hệ Thống | API Gọi Tới | Trạng Thái Sau Thao Tác | Source Evidence |
|---|---|---|---|---|---|---|---|
| Tải trang ban đầu | Lifecycle Hook | Truy cập trang | Role `ADMIN` | Gọi API tải 200 bản ghi giao dịch | `GET /api/v1/admin/transactions?page=0&size=200` | Hiển thị bảng giao dịch đối soát | [`AdminTransactionsPage.tsx:19`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/transactions/AdminTransactionsPage.tsx#L19), [`adminRepository.ts:247-250`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/api/adminRepository.ts#L247-L250) |
| Ô tìm kiếm | Text Input | Nhập mã đơn/SĐT/Merchant | Bất kỳ lúc nào | Lọc danh sách theo chuỗi nhập tại Client | Không gọi API | Bảng hiển thị giao dịch khớp từ khóa | [`AdminTransactionsPage.tsx:20`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/transactions/AdminTransactionsPage.tsx#L20) |
| Bộ lọc trạng thái | Select Dropdown | Chọn giá trị trạng thái | Bất kỳ lúc nào | Lọc danh sách theo trường `status` tại Client | Không gọi API | Bảng hiển thị giao dịch có status đã chọn | [`AdminTransactionsPage.tsx:20`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/transactions/AdminTransactionsPage.tsx#L20) |
| Nút "Xem chi tiết" | Action Button | Click icon con mắt | Hàng có dữ liệu | Mở Modal hiển thị toàn bộ thuộc tính giao dịch | Không gọi API (dùng object hàng đã có) | Modal mở, hiển thị cổng thanh toán và đối soát | [`AdminTransactionsPage.tsx:28`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/transactions/AdminTransactionsPage.tsx#L28) |
| Nút đóng Modal | Modal Close | Click nút Đóng / icon X | Modal đang mở | Đóng Modal chi tiết | Không gọi API | `selected = null`, Modal ẩn | [`AdminTransactionsPage.tsx:30`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/transactions/AdminTransactionsPage.tsx#L30) |

---

## D. ĐẶC TẢ DỮ LIỆU (Data Specification)

| Tên Trường | Nhãn Hiển Thị | Loại Dữ Liệu | Bắt Buộc | Quy Tắc Validation | Nguồn Dữ Liệu | Ghi Chú |
|---|---|---|---|---|---|---|
| `transactionCode` | Mã giao dịch | `string` | Có | Định dạng mã duy nhất của cổng thanh toán | `Payment.transactionCode` | Tra cứu kế toán |
| `bookingCode` | Booking | `string` | Có | Mã đặt chỗ liên kết | `Booking.bookingCode` | Khớp nối đơn hàng |
| `payerPhone` | Người thanh toán | `string` | Có | Số điện thoại tài xế | `User.phone` (Driver) | Bên trả tiền |
| `merchantName` | Merchant | `string` | Có | Tên chủ bãi hưởng thụ | `User.fullName` (Merchant) | Bên nhận tiền |
| `gateway` | Cổng thanh toán | `enum` | Có | `PAYOS`, `VNPAY`, `WALLET`, `CASH` | `Payment.gateway` | Kênh trung gian |
| `amount` | Số tiền | `BigDecimal` | Có | Số tiền $\ge 0$, format Currency VNĐ | `Payment.amount` | Giá trị giao dịch |
| `type` | Loại giao dịch | `enum` | Có | `DEPOSIT`, `FINAL_PAYMENT`, `PENALTY`, `REFUND` | `Payment.type` | Mục đích thanh toán |
| `status` | Trạng thái | `enum` | Có | `SUCCESS`, `PENDING`, `FAILED`, `REFUNDED` | `Payment.status` | Trạng thái tài chính |
| `createdAt` | Thời gian | `string (ISO)` | Có | Format ngày giờ Việt Nam | `Payment.createdAt` | Thời điểm thanh toán |

---

## E. TRẠNG THÁI UI (UI States)

1. **Loading State:** Khi `loading === true`, hiển thị `<Skeleton active />` ([`AdminTransactionsPage.tsx:30`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/transactions/AdminTransactionsPage.tsx#L30)).
2. **Success State:** Hiển thị bảng giao dịch đầy đủ thông tin.
3. **Empty State:** Khi không có dữ liệu giao dịch hoặc bộ lọc không khớp kết quả, hiển thị `<Empty description="Không có giao dịch phù hợp" />` ([`AdminTransactionsPage.tsx:30`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/transactions/AdminTransactionsPage.tsx#L30)).
4. **Modal Detail State:** Khi click vào nút xem trên từng dòng, `selected` nhận object giao dịch và mở modal `Descriptions` hiển thị đầy đủ chi tiết bao gồm cổng thanh toán.

---

## F. RESPONSIVE & DEVICE ADAPTABILITY

- **Desktop ($\ge 1024\text{px}$):** Bảng hiển thị 7 cột mở rộng, thanh toolbar dàn ngang.
- **Mobile / Tablet ($< 768\text{px}$):** Thanh toolbar chuyển thành khối dọc. Bảng kích hoạt cuộn ngang tránh tràn màn hình. Modal mở rộng 95% chiều ngang màn hình.
