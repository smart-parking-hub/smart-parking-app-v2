# Completion report — thông báo Admin / Merchant / Driver

- Task ID: notifications-persistence-20261117
- Owner: SPH; last_verified: 2026-11-17.
- Status: Done for scoped local correction; VPS and all-history reconciliation not included.
- Summary: Xác minh phân biệt dữ liệu nghiệp vụ với thông báo, sửa nhận sự kiện backend và cập nhật danh sách/chuông frontend. Không có bằng chứng để kết luận chung “thao tác mới không lưu DB”.

## Files changed

- Created: `src/features/notifications/__tests__/NotificationRefresh.test.tsx`, báo cáo này.
- Modified: notification query hook, Merchant `PortalNotificationsPage`, Admin notification hook/test, `e2e/admin-notifications.spec.ts`, tài liệu module Admin/Merchant.
- Deleted: none. Những thay đổi parking-detail đã có trong working tree không thuộc task này.
- Backend: BookingCreatedEvent/publisher thêm merchantId; ba listener dùng String JSON factory có retry/DLT và ném lỗi để rollback; kiểm thử và tài liệu tương ứng. Chi tiết ở `D:/DuAnOjt/smart-parking-service-microservice/docs/implementation/notifications-persistence-20261117.md`.

## Behavior / API / permissions

- Giữ nguyên routes, API, role guards, sở hữu inbox, phân trang, lọc, cách đọc từng tin/toàn bộ. Không đổi thiết kế màn hình.
- Merchant/Driver list refresh mỗi 15 giây khi hiển thị; focus refresh theo stale policy. UI cache không phải nơi lưu thông báo bền vững.
- Admin đọc tin xong invalidate cả count/feed và indicator trên header; test xác minh chuông tắt sau server lưu read-all.
- Endpoints đối chiếu backend: GET `/api/v1/notifications`, `/unread-count`; POST/PUT `/{id}/read`, `/read-all`. User lấy từ JWT; `read_at` thuộc bảng notifications trong DB Notification.
- API thất bại vẫn báo lỗi; optimistic read của Driver rollback khi ghi lỗi. Không tự tạo notification trong FE.

## Verification

| Check | Command / environment | Result |
| --- | --- | --- |
| Typecheck | `npm run typecheck` | PASS |
| Lint | `npm run lint` | PASS, 0 errors/warnings |
| Unit/component | `npm test -- src/features/notifications src/features/admin/__tests__/AdminNotificationsPage.test.tsx src/features/admin/__tests__/WithdrawalNotificationSorting.test.tsx` | 40 PASS |
| E2E | `npm run test:e2e -- e2e/admin-notifications.spec.ts` | 13 PASS |
| Build | `npm run build` | PASS |
| Backend | Gradle Notification/Booking suites | 62 + 237 PASS |
| Shared compatibility | Common-library tests; compile Parking/Payment/Identity | 8 PASS; compile PASS |
| MySQL/Kafka/API local | Admin create lot; retained booking/payment events; reread/read/dedup | PASS |

Hai test refresh FAIL trước sửa và PASS sau sửa. E2E 401 ban đầu FAIL do test cũ chỉ tính hai request; header bell có thêm request count. Nay assert riêng list=1 và count=2, vẫn giữ yêu cầu hiển thị lỗi và khóa thao tác.

## Runtime evidence / accessibility

Admin tạo bãi #42 nhận notification 260/261/262 trên ba tài khoản. Driver/Merchant nhận booking notifications 263/264; Driver nhận payment notification 265. MySQL lưu read_at và GET lần tiếp theo giữ trạng thái. Replay cùng eventId không tăng số tin. Hai service local cập nhật đều UP; giữ nguyên schema và các class không thuộc sửa lỗi.

Playwright kiểm tra keyboard, viewport 390/1440, permission guards, lỗi API, trạng thái đọc và Merchant portal. Không redesign, không thêm control; ảnh/log do E2E lưu trong `.artifacts`/`test-results`, báo cáo chung tại `D:/DuAnOjt/audit-reports/notifications-20261117`.

## Known limitations

Không đồng nghĩa mọi thao tác trong lịch sử đã được nghiệm thu. Test mẫu xác minh pipeline hiện tại và phục hồi đúng hai event còn payload; không backfill hàng loạt, không sửa chủ sở hữu dữ liệu cũ, không deploy VPS. Kiểm tra thao tác cũ cần ID/thời điểm cụ thể. Không bổ sung dependency hay thay đổi auth.
