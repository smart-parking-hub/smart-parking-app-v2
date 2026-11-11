# Inline Quick Booking & Server Reservation Integration

## 1. Bối cảnh & Vấn đề

- **Trước khi sửa:** Thành phần `InlineQuickBookPanel` (`SCR-MOD-06`) trên trang bản đồ tìm kiếm bãi đỗ (`/parking` - `SearchParkingPage`) khi tài xế bấm xác nhận giữ chỗ chỉ sinh mã ngẫu nhiên dạng `BK-HOLD-2026-xxxx`, ghi vào `localStorage['smart-truck-parking.active_hold']` và hiển thị màn hình thành công giả lập kèm biển số hardcode ("51D-894.12"). Không có mutation HTTP nào gửi lên server (`booking-service`).
- **Hệ quả:** Khi tài xế truy cập `/bookings` (`MyBookingsPage`), trang này đọc danh sách đặt chỗ thực từ API server qua query key `['real-bookings']`, dẫn đến danh sách rỗng ("Bạn chưa có lượt đặt chỗ nào") dù trước đó đã báo "Giữ chỗ thành công".

## 2. Giải pháp kỹ thuật

- **Tái dùng luồng đặt chỗ thực:** Tích hợp `ReservationFlow` từ `@/features/booking-flow` trực tiếp bên trong `InlineQuickBookPanel`.
- **Dữ liệu thật:**
  - Lấy danh sách phương tiện đã đăng ký và ở trạng thái `ACTIVE` của tài xế (`GET /api/v1/vehicles`).
  - Lấy thông tin chi tiết bãi đỗ, bảng giá (`pricingRules`) và sức chứa (`slots`) từ server (`GET /api/v1/parking-lots/{id}`).
  - Lựa chọn thời gian vào/ra dự kiến theo giờ Việt Nam (UTC+7).
- **Quy tắc giữ chỗ và cọc theo backend:**
  - Tiền cọc 20% phí dự kiến do backend tính toán.
  - Hạn thanh toán cọc 15 phút từ lúc tạo booking (`expiresAt`), đúng quy định của `booking-service`.
  - Check-in sớm tối đa 30 phút.
- **Tạo booking qua API chuẩn:**
  - Gửi request `POST /api/v1/bookings` với DTO: `parkingLotId`, `vehicleId`, `vehicleType`, `expectedCheckInTime`, `expectedCheckOutTime`, `requestId`.
  - Hỗ trợ idempotency qua `requestId` lưu theo intent trong `sessionStorage`.
  - Phản hồi từ server được parse và kiểm thực qua `bookingSchema` (Zod).
  - Trạng thái ban đầu sau khi tạo là `PENDING_PAYMENT` ("Chờ thanh toán cọc"), chuyển tiếp sang `BookingStatusPanel` để xem mã đặt chỗ thật, mã QR và thanh toán cọc PayOS.
- **Đồng bộ trạng thái với `/bookings`:**
  - Khi tạo booking thành công, `queryClient.invalidateQueries({ queryKey: ['real-bookings'] })` được kích hoạt.
  - Khi tài xế chuyển sang `/bookings`, query tự động nạp booking thật từ server; khi reload trang, booking vẫn hiển thị chính xác từ API backend.
- **Loại bỏ hoàn toàn mã giả:**
  - Xóa bỏ sinh mã `BK-HOLD-2026-xxxx` bằng Math.random.
  - Xóa bỏ ghi `active_hold` vào `localStorage`.
  - Xóa bỏ biển số / ALPR giả định.
- **Khả năng tiếp cận & Focus Management:**
  - Khóa cuộn trang khi panel mở (`document.body.style.overflow = 'hidden'`) và hoàn trả khi đóng.
  - Bắt phím `Escape` để đóng panel.
  - Focus trap tuần hoàn khi bấm `Tab` / `Shift+Tab`.
  - Hoàn trả focus về phần tử kích hoạt khi panel đóng.
  - Phản hồi tốt trên cả 390px và 1440px không bị tràn ngang.

## 3. Kiểm thử nghiệm thu

- **Unit / Component Test (`InlineQuickBookPanel.test.tsx`):**
  - AC1 & AC2: Mở panel, chọn xe ACTIVE, gửi POST booking lên server, hiển thị mã `BK-SERVER-...` và `PENDING_PAYMENT`, không ghi `localStorage.active_hold`.
  - AC3: Đồng bộ qua `QueryClient`: tạo booking trong panel → xuất hiện trong `/bookings` (`MyBookingsPage`) → refetch vẫn tồn tại.
  - AC4: Xử lý lỗi server (400/409/5xx), bãi hết chỗ hoặc chưa có xe; không báo thành công giả, không dùng mock fallback.
  - AC5: Xác thực hạn giữ chỗ 15 phút và tỷ lệ cọc 20%.
  - AC6: Focus trap và phím `Escape` đóng panel; mở lại/đổi bãi tự động reset state.
- **Playwright E2E Test (`e2e/quick-hold-redesign.spec.ts`):**
  - Chạy trên 2 độ phân giải 390px (mobile) và 1440px (desktop).
  - Kiểm tra dialog hiển thị đúng bãi, xe, hạn 15 phút, không tràn ngang (`scrollWidth <= clientWidth`).
  - Thực hiện toàn bộ user journey: Submit booking → hiển thị mã server `BK-SERVER-88` → chuyển sang `/bookings` → thấy booking từ API → không có lỗi console / pageerror.

