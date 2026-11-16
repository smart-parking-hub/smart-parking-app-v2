# SP-PAY-01 — sửa fixture Frontend Quality Gate

## 1. Thông tin chung

18/11/2026, test/ci, PR #88, feat/pay01-driver-wallet. Run trước [43924780654](https://github.com/smart-parking-hub/smart-parking-app-v2/actions/runs/43924780654) bị cancelled ở Playwright sau khoảng 10 phút; typecheck/lint/unit/build đã qua. [Evidence](pay01-recovery-evidence/frontend-ci-fixtures.json).

## 2. Nguyên nhân

Các E2E PayOS cũ chưa mock GET payments/wallet?bookingId sau khi FE thêm lookup phục hồi. Có case rơi vào proxy localhost không có backend, có case catch-all trả Page thay vì PaymentDto/null. Guard của FE khóa PayOS khi lookup chưa xác minh được. Test chờ button, timeout/retry nhiều lần và job chạm giới hạn 10 phút. Users/me, unread-count và wallet balance cũng thiếu fixture ở một số luồng.

Lượt trước chỉ chạy 9 E2E trọng tâm, chưa phát hiện contract thiếu trong phần còn lại của CI. Lượt này chạy toàn nhóm workflow và thêm test ví vào workflow.

## 3. Before / After

| Luồng | Before | After |
| --- | --- | --- |
| PayOS cọc/cancel/retry/Back | Lookup lỗi/sai schema, nút disabled và timeout | Fixture balance 0/no attempt đúng contract; kiểm tra GET và bookingId; mutations vẫn theo scenario |
| Core booking → cọc → barie | Read ví/header rơi vào proxy | Shared PayOS fixture cung cấp các read dependencies |
| Quick hold/UI/shell merchant | Một số read nền chưa mock | Fixtures đúng endpoint, không cần backend thật |
| Wallet recovery/zero refund | Chưa nằm trong workflow | driver-wallet.spec.ts chạy cùng toàn nhóm CI |

## 4. Chi tiết thay đổi

Thêm e2e/fixtures/payment-reads.ts cho shell reads và ví rỗng trong scenario PayOS. Helper assert GET và bookingId; no attempt dùng envelope bỏ data null đúng ApiResponse. Không tạo SUCCESS payment giả. Test ví tiếp tục dùng fixture trạng thái riêng cho hold/pending/lost response/reload.

Sử dụng helper ở shared PayOS deposit, cancel/hosted, quick hold, UI consistency và merchant shell. Production code, backend contract, assertions tiền/QR/payload, timeout/retry giữ nguyên. Workflow chỉ thêm driver-wallet.spec.ts, giữ timeout 10 phút và retry policy hiện có.

## 5. Kiểm thử

- Red: PayOS cancel deposit 390px timeout chờ nút enabled trước sửa, đúng triệu chứng CI.
- Focused: 24/24 PayOS/core qua.
- Full workflow selection + wallet: **60/60 passed**, 0 skipped/flaky, retries=0, khoảng 158 giây, **0 proxy errors/ECONNREFUSED**.
- Vitest **854/854**, lint/typecheck/build exit 0.
- Local dùng Chrome/Chromium engine, Vite 127.0.0.1:5174 và HTTP mocks; không tạo giao dịch thật. CI remote cần đọc check của commit mới, không suy ra từ local.
- Các screenshot docs do E2E cũ sinh ra được khôi phục đúng HEAD, không đưa vào commit.

## 6. Triển khai / rollback

Không sửa product/runtime/schema, không thêm dependency hoặc deploy. Có thể revert commit tests riêng; không tác động tiền/dữ liệu. Khi chạy ứng dụng thật, PayOS vẫn cần read API ví của BE hiện tại.

## 7. Checklist

- [x] Tái hiện trước sửa, giữ nguyên assertions nghiệp vụ.
- [x] Chạy đủ 60 E2E của workflow mới, không dựa riêng 9 case trước.
- [x] Unit/lint/typecheck/build qua; giữ nguyên timeout/retry.
- [x] Production guard giữ nguyên; chỉ bổ sung fixture đọc đúng contract.
- [ ] Kết quả remote: xem Checks trên PR ở commit mới; local không thay thế CI.
