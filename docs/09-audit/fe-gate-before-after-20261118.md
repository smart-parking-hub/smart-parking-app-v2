# Review trước/sau — fix(merchant): Confirm gate settlement from server payment state

Ngày review/publish: 2026-11-17 (Asia/Bangkok). Các tên fixture và tài liệu 20261118 được giữ nguyên từ lượt triển khai nguồn.
Owner: SmartParkingHub. Phạm vi: `feat/gate-final-payment`; base `f51b71cd3bf7`. Chưa deploy.

## Trước và sau

| Trước | Sau |
|---|---|
| Tự ghép URL PayOS và xác nhận QR bằng endpoint tiền mặt | Dùng luồng FINAL_PAYMENT của tài xế, bỏ QR tự ghép và xác nhận QR thủ công |
| Cổng giữ kết quả cũ khi tài xế đã trả qua PayOS | Poll mỗi 3 giây và kiểm tra thủ công; xác minh booking ID/code/lot |
| Lệnh cash thiếu amount; popup không dựa vào phương thức được xác nhận | Gửi đúng amountDue; hoàn tất sau acknowledgement hoặc trạng thái server |
| Đóng màn có nguy cơ nhận kết quả từ phiên cũ | Hủy observer/request; test kết quả trễ không hoàn tất phiên đã đóng |

## Review trước push

- Tách đúng phạm vi bằng worktree từ origin/main đã fetch; không gộp thay đổi tính năng khác.
- Đối chiếu contract, ownership, trạng thái, xử lý lỗi và test; không stage secrets, dependency/build output hoặc config kiểm thử local.
- `git diff --check`: đạt. Kết quả kiểm tra sau push (SHA, file scope, CI) được cập nhật trong mô tả PR và báo cáo publish.

## Kiểm chứng

- Vitest: **37/37 đạt** (test component liên quan).
- `npm run typecheck`, `npm run lint` (0 lỗi/cảnh báo) và `npm run build`: đạt trên worktree riêng.
- Chrome/Playwright: **3/3 đạt**, máy chủ worktree riêng, không tái sử dụng dev server đang mở. API được mock.

## Giới hạn và rollout

Phụ thuộc backend gate-final-payment và hai migration tương ứng. Browser test dùng API mock, không chuyển tiền thật hoặc điều khiển barie vật lý. Popup sau xác nhận hiển thị nợ còn lại bằng 0; chưa bổ sung dòng biên nhận riêng cho số tiền mặt đã thu.

Không merge/deploy hoặc chuyển tiền thật trong lượt publish này. Working tree nguồn được giữ nguyên; bản sửa review của vé nằm trên nhánh PR riêng.
