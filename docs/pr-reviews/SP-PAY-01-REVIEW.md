# Review SP-PAY-01 — Ví tài xế, hoàn cọc và đối soát phí sàn

Ngày: 17/11/2026. Phạm vi được duyệt: BE + FE trong kế hoạch ví tài xế. ĐÃ HOÀN TẤT SOURCE LOCAL VÀ KIỂM THỬ. Chưa deploy vào các container/VPS đang chạy. Báo cáo dùng cho cặp PR BE/FE của PAY-01.

## Bảng review các luồng bị tác động

| Luồng / vai trò | Trước thay đổi | Sau thay đổi | Kiểm chứng |
|---|---|---|---|
| Tài xế mở ví | Chưa có ví tài xế | /wallet có số dư khả dụng, tiền đang giữ, lịch sử cộng/trừ và liên kết booking; tài khoản mới là 0đ | BE integration + FE component + browser mobile/desktop |
| Hủy cọc 16k, hoàn 100% | Tạo yêu cầu hoàn ngân hàng thủ công | Khi đã đồng ý hoàn ví và đủ điều kiện: ghi có ví 16k; phần cọc giữ lại/phí/chủ bãi là 0 | BE integration trước/sau quyết toán |
| Hủy cọc 16k, hoàn 50% | Chưa có số dư ví để nhận 8k | Ví nhận 8k; 8k giữ lại sau quyết toán chia phí 800đ và chủ bãi 7.200đ khi tỷ lệ là 10% | BE integration + bảng kê component + browser consent |
| Hủy không được hoàn / no-show | Hoàn 0 theo chính sách | Giữ nguyên chính sách; ví không tăng; cọc 16k sau quyết toán chia phí 1.600đ, chủ bãi 14.400đ | BE integration |
| Ví 8k trả cọc mới 6k | Chỉ có phương thức cọc hiện có | Giữ 6k, xác nhận booking, chốt khoản cọc; ví còn 2k; không ghi nhận thêm tiền thu mới qua gateway | BE integration + FE component + browser 390px/1440px |
| Ví 8k trả cọc mới 16k | Chưa có kiểm tra ví | Không trừ ví; thông báo thiếu 8k; vẫn có thể trả toàn bộ 16k qua PayOS | BE rollback test + FE component |
| Trùng nút/event, hai lượt cạnh tranh số dư | Chưa có kiểm soát ví tài xế | Khóa nhóm thanh toán + khóa ví + điều kiện không âm + journal key; không cộng/trừ hai lần | BE integration + MySQL concurrent debit |
| Xác nhận booking lỗi/timeout | Chưa có tiền giữ hoặc quyết định ví có thể phục hồi | Giữ tiền khi kết quả chưa rõ; retry theo paymentId; chỉ chốt trừ khi accepted, trả tiền giữ khi rejected | BE timeout/recovery + durable receipt tests |
| Hủy trùng lúc capture, quyết toán đến trước hoàn | Chưa có trạng thái ví tương ứng | Lưu yêu cầu hoàn bền vững, chờ capture, ưu tiên hoàn từ escrow còn lại; phí/phần chủ bãi trên phần giữ lại không bị đảo nhầm | BE integration cancellation/capture/partial settlement |
| Hoàn giao dịch có phí lịch sử 8% khi cấu hình mới 10% | Đảo hoàn theo tỷ lệ hiện tại | Dùng tỷ lệ và số tiền của journal gốc; ví nhận đúng khoản hoàn, phần phí/thực nhận còn lại giữ đúng lịch sử | BE integration historical-rate test |
| Yêu cầu hoàn ngân hàng cũ | BANK_MANUAL, bằng chứng chủ bãi và admin xác minh | Giữ nguyên kênh cũ; không tự chuyển thành số dư ví; API ngân hàng từ chối khoản WALLET | Regression BE + MySQL preservation test |
| Chủ bãi xem bảng kê | Có gộp/phí/biến động ví chung | /merchant/revenue → “Xem đối soát tiền cọc”: thu, phải hoàn, đã hoàn, còn phải hoàn, còn giữ, phí sàn, chủ bãi ròng và kiểm tra khớp tiền | BE integration statement conservation + FE component |
| Admin xem/đối soát hoàn | Có API hoàn nhưng FE chưa đủ thông tin tác nghiệp | /admin/transactions → “Xem đối soát tiền cọc”: bảng kê và danh sách yêu cầu hoàn, bao gồm yêu cầu thiếu payment gốc; thử lại hoàn ví khi đủ điều kiện | FE component + BE retry/funding integration |
| Tài xế xem lịch sử thanh toán | Thông tin nguồn thanh toán chung | Hiển thị “Ví tài xế”, khoản hoàn/kênh/trạng thái/mã hoàn riêng; hoàn một phần không bị che bởi nguồn còn SUCCESS | FE regression + browser payment history |
| Phân quyền và tương thích | Quyền DRIVER/MERCHANT/ADMIN hiện có | Chỉ tài xế đọc/chi ví mình; chủ bãi chỉ xem bảng kê mình; admin mới được retry; không nhận owner/amount tùy ý từ FE | MVC security/input tests + BE ownership integration |
| PayOS, thanh toán cuối, QR check-in | Các luồng đang dùng | Giữ phương thức thanh toán cuối và điều kiện QR; nguồn ví/PayOS được chặn xung đột, sync ví không gọi PayOS | Toàn bộ BE/FE regression + browser history |

Các số phí/thực nhận trong ví dụ là sau quyết toán. “Hoàn ví” là ghi có số dư nội bộ; “chủ bãi ròng” là công nợ ghi nhận, không đồng nghĩa đã chuyển khoản ngân hàng.

## Những phần đã thay đổi

- payment-service: driver wallet, hold/capture/release, hoàn ví, phục hồi giao dịch, API đọc/thanh toán/đối soát/retry, phí lịch sử và đối soát đúng paymentId.
- booking-service: kênh hoàn trong booking, consent, receipt xác nhận ví theo paymentId và cập nhật trạng thái hoàn từ event.
- common-library: nguồn WALLET và trường refundChannel trong event; gateway bổ sung route public cần thiết.
- Flyway: Payment V19 và Booking V10, chỉ bổ sung; không sửa migration lịch sử.
- FE: màn hình Ví của tôi, consent và tiến độ hoàn, chọn ví trả cọc, chi tiết lịch sử thanh toán, bảng kê chủ bãi/admin và danh sách yêu cầu hoàn admin.
- Tài liệu: ADR 0009, API contract, data ownership, event catalog và tài liệu module FE.

## Bằng chứng kiểm thử

- Bộ test BE toàn repo đã chạy thành công bằng Gradle; sau rà soát cuối chạy lại payment/booking, rồi payment sau bổ sung kiểm thử giữ cọc chưa xác minh. Tổng bộ test: 752 bài, 742 đạt, 10 bỏ qua có điều kiện, 0 lỗi. Hai bài ví/MySQL trong số này được chạy riêng và đều đạt. Chi tiết đếm từng module ở [backend-tests-summary.json](pay01-wallet-evidence/backend-tests-summary.json). Một số test MySQL tùy chọn của các task cũ không được kích hoạt trong lượt chạy thường.
- Hai test MySQL riêng cho task đã chạy và đạt: nâng cấp Payment V18→V19 bảo toàn BANK_MANUAL và cập nhật đồng thời; nâng cấp Booking V9→V10 bảo toàn booking và receipt duy nhất. Xem [mysql-tests-summary.json](pay01-wallet-evidence/mysql-tests-summary.json).
- FE: 834/834 bài đạt, 0 lỗi. Build TypeScript/Vite và ESLint đã qua; xem [frontend-tests-summary.json](pay01-wallet-evidence/frontend-tests-summary.json).
- Browser: 7/7 bài đạt cho ví mobile/desktop, đồng ý hủy/hoàn ví và hồi quy lịch sử thanh toán (gồm 320px, 390px, 768px, 1440px). Các bài trình duyệt dùng HTTP mock; không thực hiện chuyển khoản PayOS thật.
- Đã xem ảnh giao diện ví mobile; ảnh nằm tại [mobile](pay01-wallet-assets/wallet-390.png) và [desktop](pay01-wallet-assets/wallet-1440.png). Mobile dùng card để đọc đủ biến động khả dụng/tiền giữ.
- git diff --check đã qua. Không thêm thư viện, không sửa lockfile, không chạy migration/deploy vào database/container dự án đang chạy. Các lượt test cuối tắt Kafka listener và dùng broker không hoạt động để cô lập. MySQL kiểm thử riêng đã được dọn sau khi hoàn tất.

## Giới hạn đã duyệt và điều kiện vận hành

- Ví chỉ nhận tiền hoàn và trả toàn bộ tiền cọc. Chưa nạp/rút/chuyển tiền, chưa kết hợp một phần ví với PayOS, chưa trả thanh toán cuối bằng ví.
- Thiếu giao dịch gốc hoặc thiếu nguồn tiền hợp lệ: không tự cộng ví; admin thấy cần đối soát. Khoản cọc có yêu cầu hoàn chưa xác minh được giữ trong escrow; không trừ nhầm vào thanh toán cuối.
- Nếu chủ bãi đã rút tiền và không đủ số dư để đảo quyết toán: giữ yêu cầu cần đối soát; admin chỉ retry được sau khi đủ điều kiện. Không tạo công nợ ví âm.
- Yêu cầu BANK_MANUAL cũ vẫn giữ quy trình ngân hàng; đợt này không xây toàn bộ màn hình nộp bằng chứng ngân hàng mới.
- Chưa thực hiện deploy, migration lên database đang chạy hoặc giao dịch PayOS thật.

## Triển khai và rollback

1. Deploy Booking V10 và endpoint receipt nội bộ.
2. Deploy Payment V19 và phiên bản hiểu WALLET, đặt DRIVER_WALLET_ENABLED=false trong quá trình rollout.
3. Deploy gateway/FE, xác minh contract và các test tiền, sau đó bật ví.
4. Khi cần rollback: tắt giao dịch ví mới nhưng giữ bản BE hiểu ví để hoàn tất giao dịch đang dở; giữ schema/journal/receipt. Không xóa số dư hoặc quay về binary không đọc được WALLET.

Phạm vi kế hoạch đã được người dùng duyệt trong chat: ví nhận hoàn và trả toàn bộ cọc; chưa nạp/rút/chuyển tiền hoặc thanh toán kết hợp. API và hạch toán chi tiết nằm trong repository BE: docs/api-contracts/driver-wallet.md và docs/adr/0009-driver-refund-wallet.md.

## Kiểm tra khi chuẩn bị PR

- Đã rebase lên main mới nhất trước push; giữ nguyên các thay đổi tiền mặt/camera QR vừa được merge.
- Đã chạy lại bộ test BE toàn repo; booking được chạy lại sau khi ghim bài kiểm thử lịch sử UnpaidHoldMigrationTest về đúng phạm vi V8→V9. V10 có bài kiểm thử riêng.
- Đã chạy lại toàn bộ test FE, build, lint và 7 bài kiểm thử trình duyệt sau đồng bộ main.
- Hai bài MySQL cho ví đã đạt trong giai đoạn triển khai trước; lượt này không chạy lại MySQL vì Docker daemon cục bộ không hoạt động. Kiểm thử MySQL lịch sử có điều kiện sẽ chạy trong CI khi được cấp môi trường.
