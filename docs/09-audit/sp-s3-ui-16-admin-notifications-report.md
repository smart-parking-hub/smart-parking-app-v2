# SP-S3-UI-16 — Cập nhật kiểm chứng 2026-11-13

- Owner: SPH; last_verified: 2026-11-13; self-review, chưa có maintainer sign-off.
- Base FE: origin/main `2bf9673974d7d11dec56d061a467fda38f8fcbb3`. Giữ cleanup router mới, chỉ thêm route Admin notifications; Merchant giữ nguyên.
- Trạng thái hiện tại thay thế các ghi chú hạn mức/lint/base cũ trong báo cáo lịch sử bên dưới. Đã đóng gói thay đổi riêng của task trên main mới; không gộp thay đổi khác, không deploy.
- `npm run typecheck`: PASS (tsc --noEmit).
- `npm run build`: PASS (TypeScript project build + Vite).
- `npm run lint`: PASS, 0 errors / 0 warnings trên main mới.
- `npm test -- --maxWorkers=2`: PASS, **79 files / 672 tests**.
- `npm run test:e2e -- e2e/admin-notifications.spec.ts`: PASS, **13/13**, Chrome, 390px/1440px; API giả lập, có kiểm tra bàn phím, phân trang, session isolation, lỗi và guard. Tooling in warning NO_COLOR/FORCE_COLOR; không tuyên bố mọi runtime zero-warning.
- Logs lưu ở thư mục artifact `admin-notifications-pr/FE`: build.log, lint.log, tests.log, e2e.log. Bản kiểm chứng là archive main cộng đúng 14 file task, không phải Git worktree.
- Chưa xác minh FE–BE live, MySQL và hình ảnh đối chiếu Stitch; chưa có nghiệm thu người dùng. PR nên để draft đến khi quality gates bắt buộc hoàn tất.


---

## Báo cáo lần triển khai trước (lịch sử)

# Báo cáo SP-S3-UI-16 — Trung tâm thông báo quản trị

- Task ID: `SP-S3-UI-16` / `SCR-052`.
- Owner: Đội phát triển SPH; reviewer/người nghiệm thu chưa được gán.
- last_verified: `2026-11-12`.
- Status: **FE đã triển khai và kiểm thử; nghiệm thu tổng thể còn chờ** backend thật, xử lý baseline lint và review.
- Phạm vi được người dùng giao: Tự triển khai task đã chỉnh và bàn giao tóm tắt.

## Kết quả

Đã tách màn Admin riêng tại `/admin/notifications`, giữ URL/guard/menu/layout. Feed theo SCR-052 dùng API thật, có phân trang server 20 mục, count toàn tài khoản, đọc một mục/đọc tất cả qua PUT. Không cập nhật giả trước response. Mỗi trạng thái loading/empty/error/pending có UI tương ứng; count lỗi không bị thay bằng số 0; ghi thành công nhưng tải lại lỗi được báo riêng.

Đổi phiên remount inbox và cô lập cache bằng revision, không lưu token trong query key. Request đọc đang chờ sẽ kiểm tra phiên trước khi gửi. Nội dung HTML hiển thị như text; thao tác hỗ trợ keyboard/focus. Portal Merchant không bị sửa.

## Files changed và placement

| File | Thay đổi / Lý do đặt vị trí |
| --- | --- |
| `src/features/admin/pages/AdminNotificationsPage.tsx` | Page mới, composition/query state của riêng Admin. |
| `src/features/admin/pages/admin-notifications.css` | CSS scoped, token hiện có; không ảnh hưởng màn khác. |
| `src/features/admin/components/AdminNotificationFeed.tsx` | Feed/item và skeleton thuộc nghiệp vụ một màn Admin. |
| `src/features/admin/api/adminNotifications.ts` | API/type tối thiểu; tái sử dụng DTO entity. |
| `src/features/admin/hooks/useAdminNotifications.ts` | Query/mutation, cancellation, phiên và page. |
| `src/features/admin/__tests__/AdminNotificationsPage.test.tsx` | 14 component cases, gồm dữ liệu, lỗi, bảo mật UI và session race. |
| `e2e/admin-notifications.spec.ts` | 13 browser cases, API giả lập. |
| `src/app/router/index.tsx` | Lazy route mới, chỉ thay Admin notifications element. |
| `src/app/router/router.test.tsx` | Thêm 2 ca ownership route Admin/Merchant. |
| `src/features/auth/index.tsx` | Chỉ export thêm hằng SESSION_EVENT qua public API; không đổi hành vi auth. |
| `docs/05-modules/admin/scr-052-notifications.md` | Module contract/flow/parity/giới hạn. |
| `docs/09-audit/screen-inventory.md`, `parity-matrix.md` | Traceability SCR-052. |

Không xóa file, không thêm dependency, không sửa backend. Tái sử dụng `Button`, `Alert`, `Pagination`, `EmptyState`, `Skeleton` và `formatNotificationTime`/DTO entity; không tạo primitive shared trùng.

## API / permissions / thiết kế

Contracts đã đối chiếu từ notification-service: GET danh sách, GET count, PUT đọc một mục/tất cả; response bọc `ApiResponse`, trang 0-based. Backend hỗ trợ POST nhưng giữ PUT như hiện trạng. Backend giới hạn theo principal; ADMIN là guard của route FE, không phải permission mới của endpoint.

Đã đọc HTML/CSS và xem ảnh SCR-052 trong thư mục visual DNA. Giữ header nền xanh nhạt và feed; giữ layout/font/token dự án. Theo task đã sửa, bỏ phần mockup ngoài hợp đồng (KPI/Live/SMS/filter/CTA), giữ phân trang 20 mục thay archived size=100. Không tuyên bố toàn bộ mockup đã được triển khai.

## Verification

Logs và ảnh nằm trong `.artifacts/` của repo (ignored), các đường dẫn bên dưới tương đối với repo.

| Check | Command / môi trường | Result |
| --- | --- | --- |
| Typecheck app | `npx --no-install tsc --noEmit -p tsconfig.app.json` | PASS, exit 0; `.artifacts/sp-s3-ui-16-typecheck.log`. |
| Lint file thay đổi | `npx --no-install eslint` với 8 file TS/TSX thay đổi + `--max-warnings 0` | PASS, 0 errors/0 warnings; `.artifacts/sp-s3-ui-16-lint-changed.log`. E2E ngoài glob lint hiện tại của repo, được typecheck qua build. |
| Lint toàn repo | `npm run lint -- --max-warnings 0` | FAIL: 0 errors, 18 warnings có sẵn ngoài phạm vi. Kiểm tra bản source HEAD độc lập cũng có 18 warnings, exit 1; `.artifacts/sp-s3-ui-16-baseline-lint.log`. |
| Component/route/regression | Vitest 5 suite Admin/router liên quan, `--maxWorkers=2` | **51/51 PASS**, exit 0; `.artifacts/sp-s3-ui-16-focused-tests.log`. |
| Full regression | `npm run test -- --maxWorkers=2` | **649/649 PASS, 77 suites**, exit 0; `.artifacts/sp-s3-ui-16-full-tests-limited.log`. Run này chứa 13 case mới; case thứ 14 (queued mutation khi đổi account) thêm sau và đã PASS trong 51 case focused cuối. |
| Lần full run mặc định | `npm run test` | 645 PASS / 4 FAIL, lỗi waitFor/timeout khi chạy nhiều worker cùng các kiểm tra khác. Ba suite liên quan đã chạy lại 26/26 PASS; full run giới hạn worker 649/649 PASS. Giữ log `.artifacts/sp-s3-ui-16-full-tests.log` và `sp-s3-ui-16-recheck.log`. |
| Production build | `npm run build` (`tsc -b && vite build`) | PASS, exit 0; `.artifacts/sp-s3-ui-16-build.log`. |
| Browser | `npm run test:e2e -- e2e/admin-notifications.spec.ts --project=chromium` | **13/13 PASS**, Chrome, API giả lập; `.artifacts/sp-s3-ui-16-e2e.log`. |
| Diff | `git diff --check` | PASS. |
| API thật | GET gateway local `127.0.0.1:8088` | Không kết nối: gateway từ chối. Chưa nghiệm thu runtime backend. |

Warnings baseline thuộc Copilot test, Merchant Scanner, Queue API/modal, API contract test và shared Popover/ScrollToTop; không thay đổi các file này để mở rộng phạm vi. Tooling cũng in cảnh báo NO_COLOR/FORCE_COLOR; đây không phải browser console warning của màn. Trong 2 browser happy-path desktop/mobile, listener kiểm tra không ghi nhận runtime error hoặc console error/warning.

## Visual / accessibility evidence

- `.artifacts/admin-notifications-unread-390.png`, `admin-notifications-unread-1440.png`: trạng thái đầu có mục chưa đọc.
- `.artifacts/admin-notifications-390.png`, `admin-notifications-1440.png`: sau đọc tất cả.
- `.artifacts/admin-notifications-empty.png`, `admin-notifications-error.png`, `admin-notifications-pending.png`.
- Đã xem trực tiếp ảnh desktop/mobile; xác nhận header/feed, wrap mobile và không tràn ngang.
- Browser test xác nhận read bằng Enter, touch target >=48px, menu aria-current, đúng guest next/403, đổi tài khoản không lộ feed trước.

## AC coverage và giới hạn nghiệm thu

AC01–AC11 đều có component/browser coverage theo scope, gồm 101 bản ghi và count khác trang; nội dung chi tiết xem module và test source. API giả lập kiểm chứng FE gửi đúng method/path/params và phản ứng theo response, không thay thế bằng chứng backend/ownership thật.

Chưa được đánh dấu DoD tổng thể hoàn tất vì: gateway local không chạy/chưa có seed Admin để thử backend, lint toàn repo còn 18 warnings baseline, chưa có reviewer sign-off hoặc nghiệm thu người dùng. Không cam kết producer cảnh báo duyệt bãi/rút tiền/tranh chấp, broadcast hoặc realtime. Chưa tạo commit/PR hoặc deploy trong task này.

Rollback FE: đổi duy nhất element route `/admin/notifications` về `PortalNotificationsPage`; không có migration dữ liệu hay thay hợp đồng backend.
