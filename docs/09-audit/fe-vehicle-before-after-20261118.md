# Review trước/sau — feat(vehicles): Show current parking lot and operational status

Ngày review/publish: 2026-11-17 (Asia/Bangkok). Các tên fixture và tài liệu 20261118 được giữ nguyên từ lượt triển khai nguồn.
Owner: SmartParkingHub. Phạm vi: `feat/vehicle-current-parking`; base `f51b71cd3bf7`. Chưa deploy.

## Trước và sau

| Trước | Sau |
|---|---|
| Bảng chỉ có thông tin xe và ACTIVE/INACTIVE | Thêm bãi hiện tại, địa chỉ/vị trí và trạng thái đang đỗ/quá giờ |
| Chưa đối chiếu lượt đang đỗ của từng xe | Đọc đủ trang PARKING và OVERTIME, ghép bằng vehicleId, poll 15 giây |
| Lỗi dữ liệu bãi có thể bị hiểu là xe không ở bãi | Hiện Chưa xác định và nút thử lại; giữ thao tác quản lý xe |

## Review trước push

- Tách đúng phạm vi bằng worktree từ origin/main đã fetch; không gộp thay đổi tính năng khác.
- Đối chiếu contract, ownership, trạng thái, xử lý lỗi và test; không stage secrets, dependency/build output hoặc config kiểm thử local.
- `git diff --check`: đạt. Kết quả kiểm tra sau push (SHA, file scope, CI) được cập nhật trong mô tả PR và báo cáo publish.

## Kiểm chứng

- Vitest: **29/29 đạt** (test component liên quan).
- `npm run typecheck`, `npm run lint` (0 lỗi/cảnh báo) và `npm run build`: đạt trên worktree riêng.
- Chrome/Playwright: **2/2 đạt**, máy chủ worktree riêng, không tái sử dụng dev server đang mở. API được mock.

## Giới hạn và rollout

Dữ liệu phản ánh trạng thái backend gần nhất, có độ trễ poll đến 15 giây. Không có kiểm chứng barie thật. Giữ nguyên ACTIVE/INACTIVE và các thao tác CRUD; không đổi endpoint hoặc permission.

Không merge/deploy hoặc chuyển tiền thật trong lượt publish này. Working tree nguồn được giữ nguyên; bản sửa review của vé nằm trên nhánh PR riêng.
