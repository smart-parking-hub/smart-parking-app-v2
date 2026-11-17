# Review trước/sau — fix(booking): Improve compact payment and confirmed QR tickets

Ngày review/publish: 2026-11-17 (Asia/Bangkok). Các tên fixture và tài liệu 20261118 được giữ nguyên từ lượt triển khai nguồn.
Owner: SmartParkingHub. Phạm vi: `fix/quick-book-payment-ticket`; base `f51b71cd3bf7`. Chưa deploy.

## Trước và sau

| Trước | Sau |
|---|---|
| Hộp thanh toán tối đa 560px, thông tin và tác vụ dày | Tối đa 680px, layout theo container, thông tin giá/tác vụ mở rộng vẫn truy cập được |
| Vé QR sau trả ví khó đọc và có các thông tin/nút lặp | BookingCheckinTicket chỉ xuất hiện sau PENDING_CHECKIN; một mã, QR, copy và tải PNG |
| Review tái hiện 1 test lỗi vì mã vé lặp trong chi tiết noncompact | Loại phần chi tiết/notice trùng ở PENDING_CHECKIN, giữ assertion hiện có |
| Lỗi sao chép/tải ảnh ít phản hồi | Thông báo lỗi rõ ràng; không suy trạng thái đã cọc từ riêng POST ví |

## Review trước push

- Tách đúng phạm vi bằng worktree từ origin/main đã fetch; không gộp thay đổi tính năng khác.
- Đối chiếu contract, ownership, trạng thái, xử lý lỗi và test; không stage secrets, dependency/build output hoặc config kiểm thử local.
- `git diff --check`: đạt. Kết quả kiểm tra sau push (SHA, file scope, CI) được cập nhật trong mô tả PR và báo cáo publish.

## Kiểm chứng

- Vitest: **858/858 đạt** (toàn bộ suite của nhánh).
- `npm run typecheck`, `npm run lint` (0 lỗi/cảnh báo) và `npm run build`: đạt trên worktree riêng.
- Chrome/Playwright: **6/6 đạt**, máy chủ worktree riêng, không tái sử dụng dev server đang mở. API được mock.
- Trước sửa review: MyBookingsPage 10 đạt/1 lỗi vì mã bị lặp; test và assertion giữ nguyên sau sửa. Suite ban đầu của working tree gộp: 867 đạt/1 lỗi. Log đỏ `pr-ticket-before.log`; log sau sửa `pr-fe-ticket-final.log`.
- Suite vẫn có stderr network của layout tests không mock request; phân biệt với assertion thất bại. Playwright launcher có cảnh báo FORCE_COLOR/NO_COLOR sẵn có.

## Giới hạn và rollout

Không đổi payload thanh toán, quyền, công thức phí hoặc số dư ví. Browser test dùng API mock, không phải giao dịch ngân hàng thật. Lỗi trùng lịch chỉ được backend quyết định; regression 409 giữ form để chỉnh giờ/xe.

Không merge/deploy hoặc chuyển tiền thật trong lượt publish này. Working tree nguồn được giữ nguyên; bản sửa review của vé nằm trên nhánh PR riêng.
