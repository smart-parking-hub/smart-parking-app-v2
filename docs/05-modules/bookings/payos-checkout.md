# Thanh toán PayOS trong booking

## Hủy/thoát và redirect bị chặn — 2026-11-15

**Final correction:** localhost, loopback and private IPv4/local hostnames now use a same-tab hosted PayOS page rather than an iframe. Browser local-network checks can suppress iframe load/error callbacks entirely, so navigation detection plus PENDING sync is insufficient. The payment panel presents **Mở PayOS để thanh toán** and **Quay lại vé**; cancellation returns to the existing application cancel route and syncs authoritative state. Public deployments retain the embedded checkout and its cancellation summaries. Tests verify host selection, SDK behavior and local hosted return flows. The older frame-navigation mitigation below remains supplementary for public embedded checkouts, not the fix used on localhost.


Owner: SPH frontend. `last_verified`: 2026-11-15. Evidence: `PayOsCheckoutFrame`, `PayOsPaymentPanel`, `PaymentResultPage`, `PayOsPaymentPanel.test.tsx`, `e2e/payos-cancel.spec.ts`.

- Hủy qua SDK gỡ iframe và hiện thông báo gọn; thoát hoặc điều hướng khung thì hiện trạng thái đóng. Các callback cũ bị bỏ qua sau khi khung kết thúc.
- Chrome local có thể chặn điều hướng từ PayOS công khai về localhost bằng `ERR_BLOCKED_BY_LOCAL_NETWORK_ACCESS_CHECKS`. Khi khung tải một trang khác sau QR, UI thu khung lại ngay cả lúc backend vẫn trả `PENDING`, rồi kiểm tra server riêng. Không dựa vào lỗi trình duyệt để kết luận đã thanh toán/hủy booking.
- Trang `/payment/cancel` hoặc `/payment/return` trong iframe gửi tín hiệu tới parent. Chỉ chấp nhận cùng origin, đúng cửa sổ iframe hiện tại và booking ID. URL/message không tự xác nhận tiền đã nhận; trạng thái thanh toán luôn đến từ API sync/webhook.
- Thông báo sau hủy/đóng có **Quay lại vé** và **Kiểm tra trạng thái thanh toán**. Không mở lại link đã hủy trong panel và không tự tạo khoản thu mới. Quay lại vé rồi chọn thanh toán sẽ đi qua kiểm tra link hiện hữu của server.
- `FAILED`, `REQUIRES_REVIEW`, `REFUNDED`, `SUCCESS` từ sync gỡ khung; `PENDING` không xóa thông báo hủy/đóng. Thanh toán phần còn lại được xử lý giống tiền cọc.
- Không thay đổi quyền, hạn cọc hay hành động hủy booking. SDK/redirect theo [SDK PayOS](https://payos.vn/docs/sdks/front-end/script-js/) và [Return URL](https://payos.vn/docs/du-lieu-tra-ve/return-url/).

Tách lifecycle của iframe thành component riêng trong `features/booking-flow`; dùng các primitive/token hiện tại, không thêm dependency. Thông tin runtime và giới hạn ở phần dưới được giữ làm lịch sử.

Tại `/bookings` hoặc sau khi đặt chỗ, người dùng bấm thanh toán cọc hoặc thanh toán phần còn lại. FE gửi `bookingId` cùng `DEPOSIT` hoặc `FINAL_PAYMENT` qua `POST /api/v1/payments`. Với link checkout hợp lệ, FE tải SDK từ CDN chính thức và mở khung VietQR trong panel. Người dùng có thể tải lại khung hoặc mở cùng link PayOS trong tab riêng.

Khi nhận callback thanh toán hoặc khi người dùng bấm kiểm tra giao dịch, FE gọi `POST /api/v1/payments/sync` bằng bookingId hiện tại rồi tải lại booking. Server quyết định trạng thái hiển thị và thời điểm cấp QR check-in. Link `/payment/return` do server trả về tiếp tục đi qua màn đồng bộ thanh toán hiện có.

Cấu hình nhúng và các origin CSP cần cho môi trường triển khai được mô tả trong [tài liệu SDK PayOS](https://payos.vn/docs/sdks/front-end/script-js/).

Các ca Playwright dùng API, SDK và iframe mô phỏng cho cả hai loại thanh toán ở 390px và 1440px. Việc quét bằng app ngân hàng và xác nhận webhook thực cần được kiểm chứng trên môi trường thanh toán được cấp.

Kiểm tra runtime local ngày 2026-11-11 xác nhận link checkout hiện có hiển thị VietQR ở trang hosted và khi đặt nguyên link trong iframe. Đường dẫn SDK `/embedded/` và biến thể `iframe=true&redirect_uri=...` đều trả thông báo tham số không hợp lệ trên local. Panel vì vậy đặt `src` iframe về nguyên checkout URL đã được backend cấp và FE kiểm tra origin. Người dùng kiểm tra giao dịch qua nút đồng bộ khi trang hosted không phát callback SDK. Lần kiểm tra này chỉ đọc link hiện có, chưa chuyển tiền hoặc xác minh webhook thực.

## Unified production return/recovery — 2026-11-15

This section supersedes the earlier statement that the existing cancel route was already unified. Root cancel/return/success and driver/dashboard cancel/success now share PaymentResultPage. The legacy cancel page is a compatibility wrapper; demo ticket merges, reset countdown, fake success and demo-repay-checkout fallback are removed.

A single-column result verifies payment then reads the real booking. One primary action depends on server state; no return query flag confirms payment. canRetry/canResume from payment sync grant a recovery action only; POST payments checks it again. No retry after expiry/review/unknown money. Payment success with delayed booking update gets bounded polling and no extra charge. Hosted local checkout validates the URL again when opened; BFCache restoration closes its cached panel.

Back to bookings opens `/bookings?bookingId=...` through a separate authenticated booking query, even when the ticket is outside the current list page. Hủy đặt chỗ is separate from leaving PayOS, requires confirmation, and never claims an unverified refund/bank balance. Only deposit pending payment shows an original expiresAt deadline. Footer/Copilot are hidden on the result route to keep actions unobscured.

Full parity and verification: [PayOS recovery report](../../09-audit/payos-recovery-2026-11-15.md). Backend DTO, attempts, migration V18, concurrency and rollback: `docs/api-contracts/payos-payment-recovery.md` in payment-service repository.


## Quick payment presentation and QR reopening — 2026-11-15

User-requested compact reservation payment variant: prominent real deposit/deadline, readable lot/plate/schedule, copyable truncated code, one primary PayOS action and disclosed tariff/secondary actions. Existing API, calculations, QR eligibility and demo gating are preserved. Hosted opening now revalidates through a button and removes the stale opener on error. The retained local backend is now activated using a copy-tested compatibility lineage; the earlier runtime-blocker note is superseded for this local instance. See [implementation and parity](../../09-audit/quick-payment-polish-2026-11-15.md).
