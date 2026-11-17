# SP-PAY-01 — Review bổ sung phục hồi ví và quyết toán

Ngày 18/11/2026. Báo cáo mới nhất cho các sửa F1/P1, F2/P2, F3/P2, đã tích hợp main. Báo cáo gốc [SP-PAY-01-REVIEW.md](SP-PAY-01-REVIEW.md) mô tả toàn bộ luồng ví; số kiểm thử và giới hạn mới nhất nằm ở bản bổ sung này.

## 1. Thông tin chung

- Ticket: SP-PAY-01. Loại thay đổi: fix, test, docs.
- Cặp PR: [BE #55](https://github.com/smart-parking-hub/smart-parking-service-microservice/pull/55), [FE #88](https://github.com/smart-parking-hub/smart-parking-app-v2/pull/88).
- Nhánh: feat/pay01-driver-wallet. Giữ lịch sử đã publish; merge main trước khi push, không force-push.
- Source heads và số kiểm tra: [verification.json](pay01-recovery-evidence/verification.json). Commit tài liệu sau kiểm thử không đổi source.

## 2. Bối cảnh và mục tiêu

Cọc ví capture phục hồi sau job có thể bị bỏ sót quyết toán. Mất response POST khiến FE không biết paymentId, hiện số dư cũ và mở lại thanh toán. Hoàn 0 đồng vẫn báo đang hoàn. Phần bổ sung khép ba nhánh lỗi này, giữ công thức hoàn và giới hạn sản phẩm đã duyệt.

## 3. Before / After và các luồng bị tác động

| Luồng | Before | After | Kiểm chứng |
| --- | --- | --- | --- |
| Cọc ví xác nhận muộn | Job ngày sau không chọn lại | Lấy bù WALLET DEPOSIT SUCCESS cũ chưa settlement journal, ghi vào batch ngày tạo gốc | JPA/H2 0%/50% hoàn, escrow và statement khớp |
| Batch đã COMPLETED / hai worker | Bỏ qua cọc mới thành công; thiếu bằng chứng cập nhật đồng thời | Khóa ngày, nhóm payment và merchant theo thứ tự; chỉ cộng phần journal mới | Rerun và hai worker ngày gốc/ngày bù: 1 journal, count 1, fee 1.600/net 14.400 cho cọc 16k |
| Ví 8k giữ 6k nhưng mất response | Không có paymentId để poll, còn hiện 8k và mở PayOS | Lookup theo booking/principal; sau mọi POST đọc lại balance/payment/booking, còn 2k và khóa thanh toán thêm khi pending | Component + browser, chỉ 1 POST |
| Refresh khi đang giữ tiền | Mất ID nằm trong component | Lookup tự khôi phục pending theo booking | Browser reload vẫn giữ khóa PayOS |
| Lookup lỗi / wallet FAILED | Chưa có nhánh khôi phục độc lập | Lỗi lookup chặn; FAILED cho dùng PayOS nếu booking còn hợp lệ | Component tests |
| Hoàn 0/NONE | Báo đang xử lý hoặc đã cộng ví | Không hứa có khoản cộng; trạng thái hoàn dương được phân biệt rõ | 0/NONE và 5 trạng thái hoàn dương; browser hoàn 0 |
| Lọc lịch sử payment từ main | Có thể xung đột phần enrich refund | Giữ lọc bookingId và trường refund cùng lúc | Hai regression cases filtered/unfiltered |
| Hủy booking từ main | Có dialog xác nhận/toast mới | Giữ consent ví và toast thành công, giữ hideReview và các bộ lọc mới | FE full suite + browser consent |

## 4. Chi tiết thay đổi

Payment thêm GET /api/v1/payments/wallet?bookingId=... chỉ tìm WALLET thuộc driver đăng nhập. Không có attempt thì data null được ApiResponse bỏ khỏi JSON; FE chấp nhận cả null/omitted. Đây là snapshot đọc, không phải cam kết một request mạng đến trễ sẽ không được xử lý; backend lock/idempotency vẫn quyết định.

Daily settlement bổ sung backlog cọc ví và có thể trả cả batch ngày cũ được bổ sung. Không backfill toàn bộ PayOS lịch sử; không đổi createdAt hoặc sửa journal đã ghi. Batch là snapshot quyết toán, deposit statement là báo cáo phân bổ ròng sau hoàn.

FE lookup theo booking mỗi 3 giây khi màn hình mở, reconcile cả khi POST lỗi, không tự gửi lại POST. Chặn nguồn thanh toán khác khi đang lookup/reconcile, lookup lỗi, PENDING, SUCCESS/REFUNDED chưa phản ánh lên booking hoặc REQUIRES_REVIEW.

Contract cũ giữ nguyên; FE mới cần endpoint BE mới. Phần sửa này không có migration mới.

## 5. Bằng chứng kiểm thử

Sau merge main: **BE 764 total: 754 passed, 10 conditional skips, 0 failures/errors; FE 854/854; E2E 9/9; lint/typecheck/build exit 0.** Gradle có 8 task chạy mới, 47 task không đổi UP-TO-DATE. Evidence chỉ ghi kết quả local, không suy ra CI remote.

BE chạy Gradle test --offline --console=plain với H2 in-memory, Kafka listener tắt, loại override DB ngoài khỏi process. FE chạy npm test -- --maxWorkers=2, npm run lint, npm run typecheck, npm run build. Browser chạy driver-wallet.spec.ts và driver-payment-history.spec.ts bằng Chrome/Vite localhost, HTTP mock; không chuyển khoản PayOS thật.

Test hồi quy trước sửa đã fail: BE 3 case, FE 6 case; sau sửa đã qua. Khi merge, thêm kiểm tra history giữ refund fields với/không lọc booking. Không bỏ/nới assertions tài chính hoặc quyền truy cập.

## 6. Triển khai và hành động thủ công

- Phát hành BE lookup trước FE. Không deploy hay migrate runtime trong đợt này.
- Task gốc vẫn có Payment V19/Booking V10; phần sửa phục hồi không thêm schema hoặc dependency.
- MySQL chưa chạy lại vì Docker local tắt; test hai worker mới là JPA/H2, chưa chứng minh mọi interleaving trên InnoDB/multi-instance. Evidence SQL debit cũ không thay thế bước này.
- Chưa có giao dịch ngân hàng/PayOS thật. Giữ binary hiểu WALLET và journal khi rollback; không xóa số dư.

## 7. Checklist

- [x] Ba lỗi có regression tests và đã đạt trong phạm vi local.
- [x] FE lint/test/typecheck/build, BE test và E2E liên quan qua sau merge main.
- [x] Không thêm config cá nhân, secrets, build output hoặc dependency vào phần sửa.
- [x] Diff task kiểm tra so với main; khoảng trắng có sẵn trên main không được sửa lan sang task.
- [ ] MySQL/full distributed runtime: chưa kiểm chứng lại.
- [ ] Java linter riêng: N/A, không cấu hình gate riêng trong Gradle đã đọc.

Kết luận: **3/3 tiêu chí sửa lỗi được kiểm chứng đạt**. Không đổi thành kết luận 100% toàn task SP-PAY-01 khi các kiểm chứng MySQL/runtime còn thiếu.
