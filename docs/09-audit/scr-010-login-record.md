> Log cleanup 2026-11-07: generated `.log` attachments referenced below were removed at the user's request. Historical results remain recorded here; they do not represent the latest verification.

# SCR-010 — Đăng nhập đa vai trò

last_verified: 2026-11-05
Owner: frontend team
Status: UI_IMPLEMENTED / API_WIRED / AUTOMATED_TESTS_PASSED / LIVE_BACKEND_ACCEPTANCE_PENDING

## Phạm vi và quyết định

Triển khai riêng /login. Giữ Redux Toolkit theo xác nhận của người dùng và ADR-0001; TanStack Query quản lý mutation, React Hook Form + Zod quản lý form. Không đổi hợp đồng token access_token hiện hữu. Không lưu mật khẩu. “Ghi nhớ” chỉ lưu số điện thoại, không kéo dài hạn JWT.

## Bằng chứng backend (VERIFIED từ source)

identity-service/src/main/java/com/smartparking/identity/api/AuthController.java: POST /api/v1/auth/login trả ApiResponse<AuthResponse>. AuthRequest: phone Việt Nam (0 hoặc +84), password 6–50 ký tự. AuthResponse: token, role. JwtTokenProvider cấp role có tiền tố ROLE_ và exp. Client kiểm tra shape, hạn token và sự thống nhất giữa role phản hồi và claim trước khi lưu. Việc đọc claim chỉ phục vụ UX; backend vẫn xác minh chữ ký và phân quyền.

## Thành phần và vị trí

| Thành phần | Vị trí | Vai trò |
|---|---|---|
| LoginPage | features/auth/pages | Composition và guest guard |
| LoginForm | features/auth/components | Validation, pending spinner, disabled, error code/retry, remember phone, visibility, navigation |
| RequireRole | features/auth/components | Giữ deep link cho guest; chuyển 403 khi sai vai trò |
| session / authSlice | features/auth/model | Đọc/lưu/xóa phiên, chuyển hướng an toàn, trạng thái role Redux |
| AuthSession | app/providers | Hydrate Redux, đồng bộ sự kiện/storage/focus, hết hạn tự động, xóa cache khi đổi phiên, toast tồn tại sau chuyển route |
| AuthLayout | layouts | Shell hai cột desktop và mobile brand; không chứa API nghiệp vụ |
| Workspace controls | shared/components | Tái sử dụng token/control/button/Notice hiện hữu |

Không tạo entity giả vì không có entity display dùng chung trong màn hình này. Không thêm dependency runtime. @playwright/test là dev dependency để tái chạy E2E, sử dụng Edge cài sẵn; không tăng bundle sản phẩm.

## Đối chiếu hành vi

| Khả năng | Kết quả |
|---|---|
| SĐT và mật khẩu, Enter submit | Preserved; Zod chuẩn hóa khoảng trắng, lỗi gắn aria-describedby |
| JWT và dashboard DRIVER / MERCHANT / ADMIN | Preserved và kiểm tra phản hồi trước khi lưu |
| Deep link sau đăng nhập | Preserved; loại URL bên ngoài, backslash, vòng lặp auth và đích trái vai trò |
| Đăng ký / quên mật khẩu | Preserved; /register và /forgot-password |
| Ghi nhớ SĐT, hiện/ẩn mật khẩu | Implemented; không nhớ password |
| Loading / disabled / error / retry / success | Implemented; toast đặt ở provider để còn hiện sau chuyển dashboard |
| Empty | Form trống ban đầu; màn hình này không có danh sách bản ghi |
| Tải lại, guest guard, token hỏng/hết hạn | Implemented; không cần thao tác tải lại để xử lý hết hạn |
| Đăng xuất và khác tab | Implemented; cập nhật Redux, xóa token/cache, quay lại login qua guard |
| Mobile | 390×844: ẩn hero lớn, hiện logo và form ngay; không tràn ngang |

Bố cục desktop kế thừa giao diện hiện hữu. Đây không phải chứng nhận pixel-perfect với toàn bộ các biến thể Stitch. Không đưa tài khoản demo, mật khẩu mẫu hay các tuyên bố bảo mật giả từ HTML vào sản phẩm.

## Kiểm thử và bằng chứng

- npm run typecheck: PASS.
- npm run lint: PASS, 0 errors / warnings.
- npm run build: PASS (tsc -b và Vite); xem scr-010-build.log.
- npm test -- --reporter=dot: 30 files / 217 tests PASS, không còn unhandled error; xem scr-010-tests.log. Các test ngoài auth còn ghi stderr XHR do request backend không được mock; không tuyên bố toàn repo sạch runtime log.
- Auth/session: 18 tests, gồm ba vai trò, JWT/Redux, validation, retry, pending lock, malformed/expired token, expiry khi đang mở trang, same-tab logout, cross-tab logout, role mismatch, safe redirect.
- npm run test:e2e: 7/7 PASS trên Edge, API login được intercept theo contract: mobile keyboard/overflow, ba vai trò login/token/toast/reload/guest guard, HTTP 401 retry, admin logout, desktop snapshot. Xem scr-010-e2e.log, scr-010-mobile.png, scr-010-desktop.png.
- Kiểm tra trình duyệt trực tiếp: desktop/mobile, Enter validation, console warn/error rỗng trong thao tác form không gửi API.
- E2E yêu cầu chạy npm run dev -- --host 127.0.0.1 --port 5174 --strictPort trước, rồi npm run test:e2e. Edge phải được cài. Trace lỗi nằm ở .artifacts/playwright. Runner có cảnh báo môi trường NO_COLOR/FORCE_COLOR; không phải cảnh báo source ESLint.

## Sửa lỗi cổng kiểm tra liên quan

Bổ sung Redux Provider cho test guard cũ, QueryClientProvider/chờ lazy loading cho test App; gỡ route /solutions/drivers khai báo trùng (giữ route có hiệu lực trước đó). Hủy timer NotificationSettingsModal khi unmount để hết lỗi window is not defined sau teardown. Không thay đổi nghiệp vụ các màn hình đó. Giữ nguyên các chỉnh sửa landing có sẵn trong workspace.

## Giới hạn nghiệm thu

Gateway http://127.0.0.1:8088 không phản hồi tại thời điểm kiểm tra (curl health trả 000). E2E thành công ở trên dùng API mô phỏng, chưa chứng minh đăng nhập tài khoản thực với microservices/DB đang chạy. Chưa chứng nhận visual parity pixel-perfect. Việc npm install báo dependency audit findings cần đánh giá riêng, không áp dụng npm audit fix --force trong task màn hình. Chưa merge/deploy. Chờ nghiệm thu của chủ dự án.
