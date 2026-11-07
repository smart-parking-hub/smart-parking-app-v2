# Đặc Tả Màn Hình SCR-049: AdminDisputesPage

---

## A. THÔNG TIN CHUNG (General Information)

- **Mã màn hình:** `SCR-049`
- **Tên màn hình:** Danh sách khiếu nại & tranh chấp (Dispute Resolution Queue)
- **URL Route / Path:** `/admin/disputes` (được cấu hình tại [`AppRoutes.tsx:104`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L104))
- **Quyền truy cập (RBAC):** Bắt buộc Role `ADMIN` ([`AppRoutes.tsx:95`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L95))
- **Mục tiêu nghiệp vụ:** Trung tâm tiếp nhận danh sách các vụ tranh chấp giữa Tài xế và Chủ bãi (về tiền thừa, tính sai giờ, thái độ phục vụ hoặc va quẹt xe) để Quản trị viên phân loại, kiểm tra và chuyển tiếp vào bàn thụ lý.
- **Actor chính:** System Administrator (Trọng tài viên hệ thống).

---

## B. CẤU TRÚC GIAO DIỆN (UI Structure)

1. **Header trang (`AdminPageHeader`):**
   - Eyebrow: `HỖ TRỢ KHÁCH HÀNG`
   - Tiêu đề: `Khiếu nại và tranh chấp`
   - Mô tả: `Đối chiếu booking, giao dịch và bằng chứng trước khi đưa ra quyết định.`
2. **Thanh công cụ lọc & tra cứu (`.admin-toolbar`):**
   - Ô tìm kiếm text (`Input prefix={<SearchOutlined />} allowClear`): Tìm theo mã ticket (`DSP-XXX`), tiêu đề/lý do, số điện thoại người gửi hoặc mã booking.
   - Hộp chọn trạng thái khiếu nại (`Select`):
     - `ALL`: Tất cả trạng thái
     - `OPEN`: Mới (tương ứng `PENDING` ở Backend)
     - `IN_REVIEW`: Đang xử lý (tương ứng `REVIEWING` ở Backend)
     - `WAITING_EVIDENCE`: Chờ bằng chứng
     - `RESOLVED`: Đã giải quyết
     - `CLOSED`: Đã đóng (tương ứng `REJECTED` ở Backend)
   - Nhãn đếm số lượng ticket (`visible.length ticket`).
3. **Bảng danh sách khiếu nại (`Table`):**
   - Cột 1: Ticket (Mã `DSP-XXX` in đậm + Tiêu đề khiếu nại in nhỏ)
   - Cột 2: Người gửi (Số điện thoại tài xế)
   - Cột 3: Booking (Mã đặt chỗ liên quan)
   - Cột 4: Giá trị liên quan (Tổng tiền giao dịch thanh toán trong booking, căn lề phải)
   - Cột 5: Mức độ ưu tiên (Render qua `AdminStatusTag`: Cao, Trung bình, Thấp)
   - Cột 6: Trạng thái (Tag màu phân loại)
   - Cột 7: Ngày tạo ticket
   - Cột 8: Thao tác: Nút bấm `Xử lý` (`Button icon={<EyeOutlined />}`)

---

## C. DANH SÁCH TƯƠNG TÁC & ACTION (Interaction Specification)

| Element Name | Loại UI | Hành Động Người Dùng | Điều Kiện Kích Hoạt | Phản Hồi Hệ Thống | API Gọi Tới | Trạng Thái Sau Thao Tác | Source Evidence |
|---|---|---|---|---|---|---|---|
| Tải trang ban đầu | Lifecycle Hook | Truy cập trang | Role `ADMIN` | Gọi API tải danh sách 200 vụ khiếu nại | `GET /api/v1/disputes/admin?page=0&size=200`<br>hoặc `/api/v1/admin/disputes` | Hiển thị bảng hàng đợi tranh chấp | [`AdminDisputesPage.tsx:18`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/disputes/AdminDisputesPage.tsx#L18), [`adminRepository.ts:265-268`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/api/adminRepository.ts#L265-L268) |
| Ô tìm kiếm | Text Input | Nhập từ khóa | Bất kỳ lúc nào | Lọc danh sách hiển thị tại Client | Không gọi API | Bảng hiển thị các vụ việc khớp từ khóa | [`AdminDisputesPage.tsx:19`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/disputes/AdminDisputesPage.tsx#L19) |
| Hộp chọn trạng thái | Select Dropdown | Chọn trạng thái | Bất kỳ lúc nào | Lọc danh sách theo trường `status` tại Client | Không gọi API | Bảng hiển thị các ticket có status đã chọn | [`AdminDisputesPage.tsx:19`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/disputes/AdminDisputesPage.tsx#L19) |
| Nút "Xử lý" | Action Button | Click nút trên hàng | Dòng có dữ liệu | Chuyển hướng sang bàn thụ lý hồ sơ tranh chấp chi tiết | Không gọi API | Chuyển URL sang `/admin/disputes/:disputeId` | [`AdminDisputesPage.tsx:28`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/disputes/AdminDisputesPage.tsx#L28) |

---

## D. ĐẶC TẢ DỮ LIỆU (Data Specification)

| Tên Trường | Nhãn Cột | Loại Dữ Liệu | Bắt Buộc | Quy Tắc Validation | Nguồn Dữ Liệu | Ghi Chú |
|---|---|---|---|---|---|---|
| `code` | Ticket | `string` | Có | Định dạng `DSP-{id}` | Tự động sinh từ ID | Mã định danh tranh chấp |
| `title` | Tiêu đề | `string` | Có | Chuỗi lý do nộp khiếu nại | `Dispute.reason` | Tóm lược mâu thuẫn |
| `reporterName` | Người gửi | `string` | Có | Số điện thoại tài xế nộp đơn | `Booking.driver.user.phone` | Bên nguyên đơn |
| `bookingCode` | Booking | `string` | Có | Mã booking tranh chấp | `Booking.bookingCode` | Đơn hàng phát sinh mâu thuẫn |
| `amount` | Giá trị | `number` | Có | Tổng tiền các payment liên quan | $\sum$ `Payment.amount` | Số tiền liên quan |
| `priority` | Ưu tiên | `string` | Có | `LOW`, `MEDIUM`, `HIGH` | FE gán mặc định `MEDIUM` | Mức độ khẩn cấp |
| `status` | Trạng thái | `AdminDisputeStatus` | Có | `OPEN`, `IN_REVIEW`, `WAITING_EVIDENCE`, `RESOLVED`, `CLOSED` | `Dispute.status` qua mapper | Trạng thái vụ việc |
| `createdAt` | Ngày tạo | `string (ISO)` | Có | Format ngày giờ Việt Nam | `Dispute.createdAt` | Thời điểm nộp đơn |

---

## E. TRẠNG THÁI UI (UI States)

1. **Loading State:** Khi `loading === true`, hiển thị `<Skeleton active />` ([`AdminDisputesPage.tsx:30`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/disputes/AdminDisputesPage.tsx#L30)).
2. **Success State:** Hiển thị bảng dữ liệu 8 cột.
3. **Empty State:** Khi bộ lọc không có ticket phù hợp, hiển thị `<Empty description="Không có khiếu nại phù hợp" />` ([`AdminDisputesPage.tsx:30`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/admin/disputes/AdminDisputesPage.tsx#L30)).

---

## F. RESPONSIVE & DEVICE ADAPTABILITY

- **Desktop ($\ge 1024\text{px}$):** Bảng hiển thị 8 cột rõ ràng.
- **Mobile / Tablet ($< 768\text{px}$):** Toolbar co giãn theo cột dọc. Bảng kích hoạt cuộn ngang đảm bảo không làm đứt gãy tiêu đề khiếu nại và nút thao tác.
