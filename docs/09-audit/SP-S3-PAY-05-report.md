# Báo cáo SP-S3-PAY-05 — SCR-047

- Owner: đội phát triển SPH. last_verified: 2026-11-14.
- Status: implementation và kiểm thử tự động hoàn tất; chờ review / nghiệm thu backend thật.
- [Task đã chuẩn hóa và kế hoạch](../08-project-operations/SP-S3-PAY-05.md).

## Kết quả và phạm vi

Đối chiếu backlog Sprint 3 và source cho thấy đây là task FE nâng cấp màn hình có sẵn, không cần triển khai lại backend/schema. Đã bỏ yêu cầu boilerplate không liên quan; ghi rõ màn hình chỉ theo dõi `payments`, không đại diện mọi journal/posting hay các lệnh rút tiền. Bổ sung tiêu chí nghiệm thu cụ thể, API thật, phạm vi loại trừ và rollback.

Giữ route `/admin/transactions`, public export `AdminTransactionsPage`, JWT client, RequireRole ADMIN, định dạng tiền/ngày và bộ UI hiện có. Backend giữ nguyên. Các thay đổi nghiệp vụ nằm trong phạm vi yêu cầu hoàn thiện task: phân trang 20 bản ghi, tổng số từ server, sắp xếp Pageable có ID tie-breaker, reset trang khi đổi sort, làm mới và card mobile. Modal lấy GET chi tiết mới theo ID; loading/lỗi/404/thử lại, hủy request khi đóng. Đổi nhãn “Đối soát” thành “Xem chi tiết” đúng hành vi chỉ đọc, không gửi request ghi nhận đối soát.

## File thay đổi

- Tạo `src/features/admin/transactions/api/adminTransactionsApi.ts`: DTO, query keys, GET danh sách/chi tiết, AbortSignal.
- Tạo `src/features/admin/transactions/pages/AdminTransactionsPage.tsx`: compose danh sách, sort, refresh và chọn ID.
- Tạo `src/features/admin/transactions/components/TransactionDetailDialog.tsx`: chi tiết từ API riêng, không fallback dữ liệu danh sách.
- Tạo `src/features/admin/transactions/components/TransactionBadges.tsx`: nhãn theo enum payment-service, gồm REQUIRES_REVIEW / REFUNDED.
- Tạo `src/features/admin/transactions/__tests__/AdminTransactionsPage.test.tsx`: 13 trường hợp hành vi.
- Tạo `e2e/admin-transactions.spec.ts`: 5 kịch bản trình duyệt với network fixture.
- Sửa `.github/workflows/frontend-quality-gate.yml`: chạy E2E giao dịch trong quality gate của PR, giữ nguyên các kịch bản booking/gate.
- Sửa `src/features/admin/index.tsx`: tách Transaction interface/page cũ và giữ re-export.
- Sửa hai file regression `src/features/admin/__tests__/AdminUserGovernanceAndSettlement.test.tsx` và `Batch14GAdminFinanceSecurityIntegration.test.tsx`: enum DEPOSIT hợp lệ, fixture GET chi tiết và desktop/mobile.
- Cập nhật task, backlog Sprint 3, screen inventory, parity matrix và báo cáo này. Không xóa file.

## Contract và quyền

VERIFIED từ source backend:

- `payment-service/src/main/java/com/smartparking/payment/api/controller/AdminFinanceController.java`: GET `/api/v1/admin/transactions`, GET `/api/v1/admin/transactions/{id}`, `@PreAuthorize` ADMIN.
- `payment-service/.../application/service/impl/PaymentServiceImpl.java`: `findAll(Pageable)` và chi tiết `findById`, NOT_FOUND khi không tồn tại.
- `payment-service/.../application/dto/AdminTransactionResponse.java`: đầy đủ DTO; merchantName và payerPhone hiện là nhãn dựng từ ID. UI dùng payerUserId thay vì trình bày USER#... như số điện thoại.
- `payment-service/.../infrastructure/security/SecurityConfig.java`: ADMIN cho `/api/v1/admin/**`.
- `common-library/.../dto/PageResponse.java`: currentPage bắt đầu từ 0; `common-library/.../enums/Payment*Enum.java`: các giá trị loại/trạng thái/gateway.
- Frontend: `src/app/router/index.tsx` và RequireRole ADMIN giữ nguyên; kiểm thử route chặn người dùng MERCHANT/DRIVER trước khi GET dữ liệu.

Không đổi contract, không thêm dependency, không truy vấn chéo database. API thiếu bộ lọc nghiệp vụ nên không thêm tìm kiếm toàn hệ thống hoặc tổng doanh thu bằng cách cộng riêng trang.

## Kiểm chứng

| Check | Lệnh | Kết quả quan sát |
|---|---|---|
| TypeScript script | `npm run typecheck` | PASS |
| TypeScript thực tế app | `npx tsc -p tsconfig.app.json --noEmit` | PASS |
| Lint toàn repo | `npm run lint` | PASS, không có lỗi/cảnh báo ESLint |
| Test tập trung và hồi quy admin | `npm test -- src/features/admin/transactions src/features/admin/__tests__/Batch14GAdminFinanceSecurityIntegration.test.tsx src/features/admin/__tests__/AdminUserGovernanceAndSettlement.test.tsx` | 27/27 PASS |
| Test toàn dự án | `npm test -- --maxWorkers=2` | 82 files, 695/695 PASS; 134.48s |
| Kiểm tra bổ sung nhãn trạng thái | `npm test -- src/features/admin/transactions` | 13/13 PASS sau bổ sung assertion cho từng trạng thái |
| Production build | `npm run build` | PASS, TypeScript build và Vite 2630 modules; Vite 13.88s |
| Browser E2E | `npx playwright test e2e/admin-transactions.spec.ts` | 5/5 PASS, 13.2s, Chrome headless / Vite local |
| Diff | `git diff --check` | PASS |

Các case mới kiểm tra page/sort/refresh và tổng số server; chi tiết có số tiền/trạng thái mới khác bản ghi danh sách; mở lại fetch mới; loading/empty; lỗi mạng/403; chi tiết 404/retry/refresh; abort khi đóng; enum trạng thái và không có write request. Browser xác minh hai viewport 390px/1440px, không tràn ngang, Enter/Escape và khôi phục focus; không có pageerror hoặc console error/warning ở hai luồng thành công.

Giới hạn log: bộ Vitest toàn dự án có stderr AggregateError từ request mạng không được mock trong `LayoutsAndNavigation.test.tsx` và `PaymentCancelPage.test.tsx`; các test đó vẫn PASS và không thuộc diff PAY-05. Không tuyên bố console toàn bộ dự án sạch. Playwright có cảnh báo Node về NO_COLOR/FORCE_COLOR ở test runner. Lần chạy browser trong sandbox ban đầu bị chặn loopback; đã dừng và chạy lại với quyền cho localhost, kết quả 5/5 ở trên.

## Bằng chứng giao diện / tái sử dụng

Đã xem ảnh desktop, mobile và modal mobile, giữ layout/token của dự án. Không có mẫu Stitch mới trong yêu cầu để so sánh pixel.

Ảnh chỉ lưu local trong thư mục `.artifacts/` được Git ignore, không nằm trong PR. Chạy lại E2E để tái tạo:

- Desktop: `.artifacts/admin-transactions-1440.png`.
- Mobile: `.artifacts/admin-transactions-390.png`.
- Chi tiết desktop: `.artifacts/admin-transactions-detail-1440.png`.
- Chi tiết mobile: `.artifacts/admin-transactions-detail-390.png`.

Workspace / DataTable / Dialog / QueryState / Field / money / date là shared primitives/formatter đã có. Page, dialog giao dịch và badge nghiệp vụ chỉ phục vụ AdminTransactionsPage nên đặt trong `features/admin/transactions`, không đưa vào shared hay tạo entity layer thừa. Dialog native đảm nhiệm focus và Escape; browser test đã xác minh trả focus về đúng nút.

## Nghiệm thu còn lại

- Chưa chạy staging/VPS hoặc xác minh API với dữ liệu/database thật; E2E dùng fixture ở network layer. Chưa chạy Gradle vì không đổi backend.
- Đã tự review trước PR, chưa có human code review/sign-off. Không tự đánh dấu DoD review/staging hoàn tất.
- LocalDateTime backend không có timezone; giữ formatter dự án, không gán UTC tùy ý. Tên merchant/số điện thoại thật cần bổ sung contract ở task riêng nếu có yêu cầu.
- Tìm Trello bằng mã PAY-05 không trả về card trong tài khoản kết nối. Task/plan đã được cập nhật trong repository; chưa chỉnh card Trello trực tiếp.
- Rollback: revert đúng diff PAY-05 ở frontend. Không có migration hoặc thay đổi dữ liệu cần khôi phục.

## Review trước PR

Đã rà diff PAY-05 theo thứ tự: tính đúng nghiệp vụ, quyền và dữ liệu nhạy cảm, contract GET/Pageable, ranh giới feature, cache/abort/race, desktop/mobile và chất lượng test. Không phát hiện Blocker/Critical/Major trong phạm vi đã kiểm chứng. Các giới hạn staging, timezone và nhãn tham chiếu backend vẫn giữ ở trên, không coi là đã xác minh runtime backend.

Hai mục bàn giao đã xử lý sau review: đưa E2E PAY-05 vào CI để không chỉ chạy local, và bỏ link ảnh tương đối không tồn tại trong Git vì ảnh nằm trong `.artifacts/` được ignore. Public export/route ADMIN giữ nguyên; không thêm write endpoint hoặc dependency. Review này là tự review của tác giả, không thay thế reviewer độc lập.

Nhánh `feat/admin-transactions` được fast-forward lên `origin/main` tại `fe5fa48` trước khi commit. Kiểm chứng lại sau đồng bộ: lint và TypeScript app đạt; 27/27 test liên quan đạt; chạy đúng 5 file Playwright trong CI (booking deposit, merchant check-in, merchant checkout, core lifecycle và admin transactions) đạt 9/9, 22.8s. Các kịch bản booking/gate có log proxy ECONNREFUSED cho request profile/unread-count chưa mock khi không chạy backend local; tất cả 9 assertions vẫn đạt. Không coi đây là nghiệm thu backend thật.
