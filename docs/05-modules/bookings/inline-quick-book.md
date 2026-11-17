# Inline Quick Booking & Server Reservation Integration

## Cập nhật 2026-11-18 — bố cục thanh toán thoáng hơn

Owner: SPH frontend. `last_verified`: 2026-11-18. Evidence: `QuickBookingPaymentSummary`, `BookingStatusPanel`, `WalletDepositPayment`, `e2e/quick-hold-redesign.spec.ts`.

- Hộp thoại rộng tối đa 680px. Khi vùng nội dung đủ rộng, bãi/địa chỉ/xe và khung giờ nằm cạnh nhau; vùng hẹp tự xếp dọc. Địa chỉ hiển thị đầy đủ; giờ và ngày được tách dòng, giữ cả giây và múi giờ Việt Nam.
- Thứ tự đọc: trạng thái/số đơn → bãi/xe/giờ → cọc/phí dự kiến/hạn trả → PayOS → ví → thông báo QR → các mục mở rộng. Bỏ khung viền lồng nhau; tiền cọc dùng nền cam nhạt. Các mục giá/phụ phí và tác vụ khác mặc định đóng, dùng được bằng bàn phím.
- `WalletDepositPayment.compact` chỉ đổi cách trình bày. Giữ nguyên kiểm tra số dư, chặn thanh toán đồng thời, đối soát, retry và lỗi. Tiền cọc, hạn trả, quyền nhận QR, API và chính sách hủy vẫn do server quyết định.
- [Ma trận chức năng, ảnh và kết quả kiểm tra](../../09-audit/quick-payment-layout-2026-11-18.md). Bộ kiểm thử toàn dự án còn một lỗi truy vấn mã vé trùng trên màn hình `/bookings` ở trạng thái `PENDING_CHECKIN`; đây không phải chế độ thanh toán gọn.

## Cập nhật 2026-11-15 — phiếu giữ chỗ gọn

Owner: SPH frontend. `last_verified`: 2026-11-15. Evidence: `ReservationFlow`, `InlineQuickBookPanel`, `e2e/quick-hold-redesign.spec.ts`.

- Tên bãi/địa chỉ trong một khối; tên loại xe tiếng Việt, giờ vào/ra cạnh nhau trên desktop và xếp dọc trên mobile; giá cơ bản/cọc thành hai cột. Giữ mọi lỗi, thử lại, kiểm tra xe và chỗ trống từ server.
- Accessible name dialog là **Đặt giữ chỗ nhanh**; bỏ nhãn hứa giữ 10 phút trên nút bản đồ. Hạn thanh toán thực tế vẫn 15 phút, cọc 20%, check-in sớm tối đa 30 phút.
- Giữ focus trap, Escape, khóa cuộn và hoàn trả focus. E2E dùng route ứng dụng với API fixtures, thay cơ chế inject một React root thứ hai vốn phụ thuộc cache Vite.
- Bản đồ không chọn bãi mặc định, xóa lựa chọn khi vào lại `/parking`; chỉ target khi chọn card/marker/gợi ý hoặc bắt đầu giữ chỗ.
- Chi tiết kiểm chứng: `docs/09-audit/booking-usability-2026-11-15.md`. Nội dung bên dưới về accessible name 10 phút là lịch sử, đã được thay thế bởi cập nhật này.

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
  - Giữ accessible name của dialog là `Panel giữ chỗ nhanh 10 phút` để tương thích với kiểm thử tích hợp hiện có; hạn thanh toán cọc thực tế vẫn là 15 phút từ server.
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


## 4. CI E2E booking & gate regression

- `last_verified`: 2026-11-11; evidence: `e2e/test-01-driver-booking-deposit.spec.ts`, `e2e/core-booking-gate-flow.spec.ts`, `e2e/fixtures/payos-checkout.ts`.
- The core CI scenarios use separate response shapes for parking-lot detail, booking creation/detail, and paginated lists. Lot detail supplies `status`, `slots`, and `pricingRules`; booking responses satisfy the booking-flow schema.
- Driver coverage now follows `PENDING_PAYMENT` → PayOS checkout → server sync → `PENDING_CHECKIN`. It verifies that no check-in QR exists before deposit confirmation, then checks the server booking code and QR. The lifecycle scenario continues through merchant check-in, check-out, and cash settlement.
- SDK and checkout fixtures are shared with the embedded-checkout tests. All payment requests are intercepted; these scenarios do not transfer money.
- The old pre-submit 10-minute timer, client-generated `BK-HOLD` code, and immediate-success screen belong to the superseded local-only implementation and are no longer E2E acceptance criteria.

## 5. Vé sau khi thanh toán ví và lỗi trùng lịch xe (2026-11-18)

- `BookingCheckinTicket` hiển thị khi server xác nhận `PENDING_CHECKIN`: trạng thái đã cọc, bãi/biển số, QR và mã vé nguyên gốc, khung check-in, giờ dự kiến và khoản cọc. Nội dung một cột vừa hộp thoại hẹp trên màn hình desktop; nút thao tác dùng container query theo chiều rộng thẻ.
- Chế độ `compact` tiếp tục áp dụng sau khi trả bằng ví. Không lặp lại mã vé, thông tin tiền, QR hoặc nút sao chép bên dưới thẻ. Chi tiết giá/phụ phí và tác vụ hủy/xem booking vẫn truy cập được qua phần mở rộng.
- Sao chép và tải PNG có phản hồi lỗi; QR chỉ xuất hiện từ trạng thái booking server, không suy từ kết quả POST ví. Trạng thái chờ xác nhận và PayOS được giữ nguyên.
- Khi backend trả `409 CONFLICT` do cùng xe trùng lịch, form vẫn giữ phương tiện/giờ và cho chỉnh lại, không mở thanh toán hay báo thành công. Booking nối tiếp đúng giờ ra/vào vẫn được backend cho phép.
- Kiểm thử component gồm chuyển từ trả ví sang vé xác nhận, mã dài, một nút sao chép, lỗi clipboard và lỗi trùng lịch. `e2e/wallet-booking-success.spec.ts` kiểm tra cả luồng ví với API fixtures ở 390/650/1440px, không tràn ngang, QR căn giữa, tải PNG và đúng một POST ví. Các giao dịch trong E2E được mô phỏng, không chuyển tiền thật.
