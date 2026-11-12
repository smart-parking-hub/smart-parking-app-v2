# Thanh toán PayOS trong booking

Tại `/bookings` hoặc sau khi đặt chỗ, người dùng bấm thanh toán cọc hoặc thanh toán phần còn lại. FE gửi `bookingId` cùng `DEPOSIT` hoặc `FINAL_PAYMENT` qua `POST /api/v1/payments`. Với link checkout hợp lệ, FE tải SDK từ CDN chính thức và mở khung VietQR trong panel. Người dùng có thể tải lại khung hoặc mở cùng link PayOS trong tab riêng.

Khi nhận callback thanh toán hoặc khi người dùng bấm kiểm tra giao dịch, FE gọi `POST /api/v1/payments/sync` bằng bookingId hiện tại rồi tải lại booking. Server quyết định trạng thái hiển thị và thời điểm cấp QR check-in. Link `/payment/return` do server trả về tiếp tục đi qua màn đồng bộ thanh toán hiện có.

Cấu hình nhúng và các origin CSP cần cho môi trường triển khai được mô tả trong [tài liệu SDK PayOS](https://payos.vn/docs/sdks/front-end/script-js/).

Các ca Playwright dùng API, SDK và iframe mô phỏng cho cả hai loại thanh toán ở 390px và 1440px. Việc quét bằng app ngân hàng và xác nhận webhook thực cần được kiểm chứng trên môi trường thanh toán được cấp.

Kiểm tra runtime local ngày 2026-11-11 xác nhận link checkout hiện có hiển thị VietQR ở trang hosted và khi đặt nguyên link trong iframe. Đường dẫn SDK `/embedded/` và biến thể `iframe=true&redirect_uri=...` đều trả thông báo tham số không hợp lệ trên local. Panel vì vậy đặt `src` iframe về nguyên checkout URL đã được backend cấp và FE kiểm tra origin. Người dùng kiểm tra giao dịch qua nút đồng bộ khi trang hosted không phát callback SDK. Lần kiểm tra này chỉ đọc link hiện có, chưa chuyển tiền hoặc xác minh webhook thực.
