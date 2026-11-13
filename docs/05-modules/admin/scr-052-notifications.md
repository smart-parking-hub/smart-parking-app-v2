# SCR-052 — Trung tâm thông báo quản trị

- Task: `SP-S3-UI-16`; owner: Đội phát triển SPH; reviewer/người nghiệm thu chưa được gán.
- last_verified: `2026-11-12`.
- Trạng thái: Đã triển khai FE và kiểm thử API giả lập; chờ backend thật và nghiệm thu.
- Route: `/admin/notifications`, `AdminLayout`, guard `ADMIN` hiện có.

BE update (2026-11-12): repo `smart-parking-service-microservice` cùng workspace đã bổ sung producer/outbox/recipient/consumer cho hồ sơ bãi, rút tiền và tranh chấp, giữ nguyên các endpoint FE hiện dùng. BE có 58 test trực tiếp PASS bằng JDK21/H2; chưa có Gradle/MySQL/Kafka hoặc FE–BE live acceptance. Xem `docs/implementation/sp-s3-ui-16-backend-report.md` trong repo BE. Không thay trạng thái nghiệm thu FE thành backend-verified chỉ từ kết quả này.

## Phạm vi và luồng

`src/features/admin/pages/AdminNotificationsPage.tsx` thay việc dùng `PortalNotificationsPage` tại route Admin. Merchant vẫn dùng portal cũ. Màn chỉ xem, phân trang, đếm chưa đọc, đọc từng mục và đọc tất cả thông báo của tài khoản hiện tại.

1. Tải trang 0, 20 mục và tổng chưa đọc bằng hai query độc lập.
2. Feed hiển thị title/content/createdAt; `readAt == null` là chưa đọc. Dùng `formatNotificationTime` của entity notification, hỗ trợ string/mảng LocalDateTime, không tự gán timezone UTC.
3. Chờ PUT thành công rồi invalidate list/count. Mục đã đọc không có nút ghi lặp; trong mutation/refetch khóa thao tác xung đột.
4. Đọc tất cả theo count toàn tài khoản, kể cả khi trang hiện tại đã đọc hết. Backend cập nhật cả trang khác.
5. Lỗi list/count có retry riêng. Count lỗi không thay bằng số 0. Ghi thành công nhưng refetch lỗi có cảnh báo riêng; dữ liệu cũ được ghi rõ chưa cập nhật.

## API và quyền

Nguồn: `NotificationController.java`, `NotificationRepository.java`, `NotificationDto.java` của notification-service và `PageResponse.java` trong repo `smart-parking-service-microservice` cùng workspace.

| Tác vụ | Request | Dữ liệu |
| --- | --- | --- |
| Danh sách | `GET /api/v1/notifications?page={0-based}&size=20` | `ApiResponse<PageResponse<NotificationDto>>`. |
| Tổng chưa đọc | `GET /api/v1/notifications/unread-count` | `ApiResponse<Integer>`; số nguyên an toàn không âm. |
| Đọc một mục | `PUT /api/v1/notifications/{id}/read` | `ApiResponse<Void>`. |
| Đọc tất cả | `PUT /api/v1/notifications/read-all` | `ApiResponse<Void>`; toàn tài khoản. |

Dùng `getData`/`sendData` và interceptor có sẵn. Backend hỗ trợ cả POST/PUT; giữ PUT như portal cũ. Backend yêu cầu authenticated và giới hạn dữ liệu theo principal. Guard FE không biến endpoint thành API admin-only. Không gửi user ID để chọn tài khoản khác.

Type tối thiểu tái sử dụng `Pick<BackendNotificationDto, 'id' | 'title' | 'content' | 'readAt' | 'createdAt'>`. Không dùng mapper/CTA Driver hoặc tạo enum từ fixture test. Nội dung render bằng React text, không chèn HTML.

## State và phiên

- TanStack Query quản lý API/cache; React state quản lý page. Không có form/store/dependency mới.
- Key: `['admin-notifications', opaqueSessionRevision, 'list', page]` và `[..., 'unread-count']`.
- Hook chỉ quan sát sự kiện phiên hiện có (`SESSION_EVENT`, storage, focus); không thay đổi auth/token storage. Export thêm `SESSION_EVENT` qua public API auth để tránh import nội bộ feature khác.
- Token đổi -> revision đổi -> inbox remount ngay, reset page/mutation. Token không nằm trong query key. `AuthSession` có sẵn vẫn chịu trách nhiệm xóa cache/đồng bộ role.
- Query có `AbortSignal`. Mutation hủy query đang chạy trước khi ghi, không tự retry. Trước khi gửi, kiểm tra revision để không gửi yêu cầu đang chờ bằng phiên tài khoản khác.
- Sau ghi, invalidate scope phiên; trang cache khác stale. Chờ promise refetch trong mutation pending.

## Thiết kế và parity

Đã đọc HTML/CSS và xem ảnh trong `stitch_smartparkinghub_visual_dna_analysis/scr_052_trung_t_m_th_ng_b_o_qu_n_tr_admin_notifications/` ở workspace. Giữ header xanh nhạt, hierarchy, feed thẻ dọc, vạch cam/chấm + chữ chưa đọc và nút đọc. CSS scoped `admin-notifications`/`admin-notification`, dùng token/font hiện tại.

Theo task đã chỉnh và yêu cầu triển khai của người dùng, không đưa demo ngoài hợp đồng vào sản phẩm: KPI bãi/rút tiền/tranh chấp, WebSocket Live, âm thanh, SMS/Telegram, lọc/search và CTA nghiệp vụ. Giữ `AdminLayout` hiện tại, phân trang 20 mục thay giới hạn 100 mục của đặc tả archived. Không tuyên bố khớp toàn bộ mockup.

| Năng lực trước | Hiện thực mới | Trạng thái |
| --- | --- | --- |
| Route/guard/menu Admin | Chỉ thay element `notifications` | Preserved |
| Danh sách, nội dung, thời gian | `AdminNotificationFeed`, entity formatter | Preserved / đổi trình bày |
| Phân trang 20 mục | Shared `Pagination` zero-indexed | Preserved |
| Đọc một mục/tất cả PUT | API module + mutation, chống gửi lặp | Preserved / củng cố lỗi/pending |
| Tổng chưa đọc | API count, không đếm từ trang | Added theo task đã chỉnh |
| Portal Merchant | Không sửa source portal | Preserved; component regression + E2E |

## Kiểm thử và giới hạn

- Component: `src/features/admin/__tests__/AdminNotificationsPage.test.tsx` — loading/empty, date/XSS, 101 mục, count khác trang, keyboard/pending, lỗi PUT/list/count/refetch, malformed count, session switch và queued mutation.
- Route: `src/app/router/router.test.tsx`.
- Browser: `e2e/admin-notifications.spec.ts` — 390px/1440px, menu, không tràn ngang, touch target 48px, read/read-all, 401/403, guest/wrong role, đổi account, lịch sử >100 và Merchant.
- Kết quả: [báo cáo triển khai](../../09-audit/sp-s3-ui-16-admin-notifications-report.md).
- Gateway local `127.0.0.1:8088` từ chối kết nối khi kiểm tra. Chưa có nghiệm thu backend thật/seed Admin; mock không chứng minh producer phát cảnh báo Admin.
- Broadcast/realtime/polling mới/email/SMS/backend ngoài phạm vi.
