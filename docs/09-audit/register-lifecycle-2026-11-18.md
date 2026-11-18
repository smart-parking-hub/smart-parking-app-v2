# Registration lifecycle — bản sửa sau Codex re-review

Ngày xác minh: 18/11/2026 (Asia/Bangkok). Người sửa và kiểm chứng đợt 2: Codex, theo yêu cầu người dùng sửa trực tiếp.

Baseline review: repo `smart-parking-app-v2`, HEAD `ad6429acf5aed24dfa5bebf3691b1cda27c37d34`. Các mục 1–5 ghi lại kết quả của đợt review local trước khi xuất bản. Kiểm chứng trên nhánh PR được ghi riêng ở mục 6.

Tài liệu đối chiếu:

- `D:/DuAnOjt/plans/SP-AUTH-REG-RESET-01-rereview-2026-11-18.md`: giữ nguyên kết luận và bằng chứng lỗi trước sửa.
- `D:/DuAnOjt/plans/SP-AUTH-REG-RESET-01-round2-fix-plan-2026-11-18.md`: phạm vi sửa hiện tại.
- Fix-plan R1–R5 và plan gốc cùng thư mục `plans`: giữ các AC và hành vi đã đạt.

Báo cáo này thay nội dung bàn giao trước có tên test/output không khớp suite. Chỉ các assertions dưới đây được chứng nhận; không suy ra độ phủ toàn bộ tổ hợp từ số tests pass. Các kết quả cũ trong review lịch sử vẫn mô tả baseline trước sửa.

## 1. Thay đổi đợt này

| Finding | Bản sửa | Bằng chứng |
|---|---|---|
| RR1 — proof/eligibility sống lại sau sửa OTP | Handler sửa code xóa verified proof và nguồn link, tăng request ID verify, xóa thông báo cũ. Giữ bằng chứng send đúng email và cooldown, không tự gửi request khi gõ. Nhập lại code cũ không phục hồi proof. | Hai repro RR1 sau sửa pass; regression chính thức kiểm tra sent-code cần verify lần 2 và link-code cần send mới. |
| RR2 — autoVerify thất bại không hiện lỗi | Render alert ở đầu form từ mutation error hiện hành, đối chiếu generation/request/intake/email/code. Giữ lỗi khi hủy đổi role; dọn khi edit, resend, verify mới, intake mới hoặc reset. Không focus vào field đang ẩn. | Repro RR2 và tests expired/service error, recovery, stale response đều pass. |
| RR3 — coverage/báo cáo sai | Bổ sung pending submit, queued intake success/error, stale verify trước/sau B và sau reset, deep cancel/reset, bank cache và payload merchant mới. Sửa tên test vốn mô tả quá phạm vi; unit navigation dùng router Back thật; browser dùng keyboard chọn option và Back/Forward thật. Viết lại mapping theo source hiện hành. | Lifecycle hiện 55 tests; toàn auth 154 tests; hai browser specs 18 tests. |

Khi tiếp nhận link mới sau submit thất bại, `applyLinkIntake` còn reset observer submit để lỗi register trước đó không xuất hiện trong lượt link mới. Submit đang pending vẫn giữ nguyên form/payload; submit thành công bỏ link chờ.

Files sửa trong đợt này:

- `src/features/auth/pages/RegisterPage.tsx`
- `src/features/auth/__tests__/RegisterLifecycle.test.tsx`
- `e2e/register-lifecycle.spec.ts`
- `docs/05-modules/auth/scr-011-register.md`
- `docs/09-audit/register-lifecycle-2026-11-18.md`

Đợt review local không thay API, validation nghiệp vụ, shared Dialog/Select, backend, session/token hoặc dependencies; chưa commit/push/deploy ở thời điểm review.

## 2. Mapping regression mới — tên trong source và assertion

Mọi component test trong bảng thuộc `src/features/auth/__tests__/RegisterLifecycle.test.tsx`, nhóm `Round 2: RR1, RR2 and missing RR3 evidence`. `%s` và `$outcome/$order` là template tên của test.each trong source, không phải tên test được dựng lại từ trí nhớ.

| Tên test | Assertion quan sát |
|---|---|
| `RR1: editing and restoring a sent OTP requires fresh verification without resetting cooldown` | Send đúng 1 lần, verify đúng 2 lần sau A→B→A; resend vẫn disabled bởi cooldown; password chỉ mở sau verify. |
| `RR1: editing and restoring a link %s permanently discards eligibility` — otpCode/otp | Sau sửa rồi nhập lại code link: không request, password ẩn, báo phải send; send mới xóa code và code mới verify thành công. |
| `RR1: changing email and restoring it does not restore link code or proof` | Email A→B→A xóa code; nhập lại code cũ không mở password hay tạo verify mới. |
| `RR2: autoVerify shows visible server error: %s` — hết hạn/lỗi dịch vụ | Alert chứa lỗi server khi info đang hiển thị; cancel role giữ lỗi; confirm role xóa lỗi. |
| `RR2: clears autoVerify error on %s and allows recovery` — email/code/resend | Edit hoặc resend làm mất alert cũ; send và verify tiếp theo mở password. |
| `RR2: a new link clears a visible autoVerify error and verifies the new code once` | Lỗi link A biến mất; link B được verify đúng 1 lần, email B xuất hiện. |
| `RR2/RR3: stale verify A $outcome $order cannot change B proof or errors` — resolve/reject × before B/after B | A về trước B không mở proof/notice, role vẫn bị khóa khi B pending; A về sau B không đặt lỗi hay đổi email; B tiếp tục tới password mà không verify thừa. |
| `RR3: stale verify %s after pageshow reset cannot restore data, errors or proof` — resolve/reject | Reset về DRIVER; email/code rỗng; A về muộn không notice/error; không thể mở password bằng proof cũ. |
| `RR3: submit pending locks role, prevents duplicate requests and handles queued link on %s` — resolve/reject | Cả role select/trigger disabled; hai submit event thêm không tạo register thứ 2; URL link được dọn, form/payload hiện tại không đổi. Success bỏ link chờ; failure nhận B, verify B, xóa password/confirm và lỗi submit cũ. |
| `RR3: cancel preserves deep merchant fields, errors, visibility, cooldown and proof; confirm clears them and retains bank catalog` | Đi tới password với bank/email/OTP; tạo lỗi confirm và bật showPassword; cancel giữ toàn bộ giá trị, lỗi, visibility, cooldown, proof và focus role. Confirm xóa các field/ lỗi/visibility, focus fullName; bank value/logo không còn, cache còn; code/proof cũ không mở password; hoàn tất merchant mới và assert payload chính xác, gồm bank mới. |

Regression driver payload sau đổi từ merchant vẫn ở test `switching from MERCHANT with bank info to DRIVER isolates payload with no bank remnants` (nhóm AC9): body DRIVER không chứa bankName/bankAccountNum và dùng dữ liệu mới.

Browser: `e2e/register-lifecycle.spec.ts`:

| Tên test | Assertion |
|---|---|
| `AC4, AC12 browser: interactive role trigger and keyboard navigation flow` | Enter mở trigger hiển thị; Tab tới option MERCHANT và Enter chọn; dialog có accessible name/description; focus nút giữ; Escape trả focus trigger; confirm focus fullName. |
| `AC11 browser: navigating away to login and returning via browser back/forward` | Login → goBack về form trống; nhập lại → goForward login → goBack về form trống lần nữa. |
| `AC1 browser: reload at email step clears code, send state and personal fields` | Reload ngay khi email/code/send đang có; DRIVER/info trống, email/code rỗng và notice send biến mất. |

## 3. Đối chiếu AC và giới hạn của kết luận

| AC | Bằng chứng hiện hành | Kết luận |
|---|---|---|
| AC1 | Browser reload tại bank, email, password đang hiển thị và sau success; component pageshow persisted true/false; browser Back/Forward. | PASS các case đã chạy; bfcache thực NOT VERIFIED. |
| AC2 | Helpers purge đúng key và giữ key khác; component legacy valid/malformed/unknown role, storage throws và no draft writes. Test malformed/unknown đã unmount lần render đầu trước khi kiểm tra lần sau. | PASS assertions hiện có. |
| AC3 | Pristine DRIVER↔MERCHANT, same-role no-op, lỗi khi field trống được reset. | PASS. |
| AC4 | Tests cancel/close/backdrop giữ personal values; deep cancel giữ bank/email/OTP/password/errors/proof; browser Escape và focus. | PASS các đường đi nêu trên; không tuyên bố đã thử mọi tổ hợp dữ liệu × cách hủy. |
| AC5 | Deep reset các field/ lỗi/visibility/cooldown/proof, bank value/logo; A→B→A; browser confirm focus. | PASS assertions nêu ở mục 2. |
| AC6 | Component Back/Next personal values không gọi API; browser magic-link Back/Next giữ personal values. | PASS. |
| AC7 | Send A/B cũ; verify A resolve/reject trước/sau B và sau reset; verify/submit pending khóa role, duplicate submit và queued intake. | PASS các case đã chạy. |
| AC8 | Non-auto link và alias; expired/error; StrictMode single verify; sequential links; query/hash cleanup; invalidation và queued intake. | PASS các regression hiện có. |
| AC9 | Exact DRIVER contract; merchant→driver body không có bank; deep test tạo merchant mới với body mới; BankField integration. | PASS. |
| AC10 | RegisterValidation 22, EmailOtp 15, account-registration E2E 6. | PASS assertions của các suites này. |
| AC11 | Unit router Back, browser Back/Forward; deep test bank cache/value/logo; login/forgot/useSession/authSlice suites. | PASS; không tạo tài khoản thật. |
| AC12 | 1440/390px, dialog 320px không tràn/nút >=44px; keyboard role selection, accessible dialog name/description, Escape/confirm focus. | PASS assertions đã chạy; screen reader thủ công NOT VERIFIED. Không có kiểm tra toàn diện mọi console message hoặc mọi tab-order của mọi bước. |

## 4. Commands và kết quả

Chạy tại repo FE. Logs trong `.artifacts/register-review/`:

| Command | Kết quả | Log |
|---|---|---|
| `npm.cmd test -- --config .artifacts/register-review/review.vitest.config.ts --reporter=verbose` | exit 0; 5/5 pass | `round2-original-repro-after.log` |
| `npm.cmd test -- --config .artifacts/register-review/round2.vitest.config.ts --reporter=verbose` | exit 0; 3/3 pass | `round2-repro-after.log` |
| `npm.cmd run typecheck` | exit 0 | `round2-typecheck.log` |
| `npm.cmd run lint` | exit 0; không diagnostic | `round2-lint.log` |
| `npm.cmd test -- src/features/auth` | exit 0; 10 files, 154/154 pass; RegisterLifecycle 55 tests | `round2-auth.log` |
| `npm.cmd run build` | exit 0; tsc -b và Vite 6.4.5 pass, Vite build 8.11s | `round2-build.log` |
| `$env:ACCOUNT_REGISTRATION_BASE_URL='http://127.0.0.1:5174'; npm.cmd run test:e2e -- e2e/account-registration.spec.ts e2e/register-lifecycle.spec.ts --project=chromium` | exit 0; 18/18 Chromium pass, 44.3s | `round2-e2e.log` |

Build lần đầu phát hiện lỗi TypeScript trong tests mới (URL optional, option exact của getByRole). Đã sửa optional chaining và dùng regex tên nút; build sau đó pass. Lượt build cuối kiểm tra thêm các tests vừa bổ sung. `tsc --noEmit` không thay thế `tsc -b` trong gate build.

E2E dùng quyền môi trường cho localhost/Chromium như lượt review trước. Có cảnh báo môi trường NO_COLOR/FORCE_COLOR; không có assertion thất bại. Sau lượt E2E không thay code sản phẩm hoặc browser spec; chỉ bổ sung component tests và tài liệu.

Repro reviewer cũ/mới giữ nguyên. Log `round2-repro.log` là 3 FAIL trước sửa; log `round2-repro-after.log` là 3 PASS sau sửa. Các regression tương đương hiện nằm trong suite chính thức, không phụ thuộc ignored artifacts để chạy CI.

Screenshots được E2E cập nhật bằng dữ liệu giả:

- `.artifacts/register-lifecycle-1440.png`
- `.artifacts/register-lifecycle-390.png`
- `.artifacts/register-lifecycle-320.png`

## 5. Giới hạn và bảo toàn phạm vi

- API mocks: không xác minh SMTP, database hay backend runtime, không gửi email/tạo account thật.
- Back/Forward thực đã chạy; navigation entry ghi nhận `navigate`. Không coi đây là bằng chứng bfcache thực. Component dispatch pageshow.persisted là kiểm tra handler riêng.
- Không chạy NVDA/JAWS/VoiceOver thủ công. Không nâng kết quả accessibility assertions thành chứng nhận screen reader đầy đủ.
- Baseline ngoài phạm vi: `.artifacts/register-review/round2-pre-fix-status.txt`, `round2-pre-fix-outside.patch`; bản sau sửa `round2-post-fix-outside.patch` có cùng SHA256 `F4B20A503152270AE0407EA69A7A1D1C9A0B680037710CC409EED7D2462DFB8D`. Git status không xuất hiện file ngoài phạm vi mới; diff ngoài auth và các file test/docs được cho phép được giữ nguyên. `git diff --check` không báo lỗi whitespace; không có test only/skip trong hai file tests vừa sửa.
- Rollback chỉ hoàn tác các thay đổi đợt 2 trong các file trên, đối chiếu baseline/review; không dùng git reset/clean trên working tree đang có thay đổi khác.

## 6. Kiểm chứng trước khi xuất bản PR — 18/11/2026

Nhánh `fix/auth-otp-password` được cập nhật fast-forward từ `origin/main`
(`6ebbde1`) trong worktree riêng. Chỉ đưa vào chín file đăng ký: page, helper
`registrationLifecycle.ts`, ba component test, hai browser spec và hai tài liệu
auth. Các thay đổi notification/parking-detail trong workspace gốc được giữ nguyên.

| Kiểm tra | Kết quả |
|---|---|
| `npm.cmd run typecheck` | PASS |
| `npm.cmd run lint` | PASS, không diagnostic |
| `npm.cmd run build` | PASS, gồm `tsc -b` và Vite |
| `npm.cmd test -- src/features/auth --maxWorkers=2` | 154/154 PASS |
| `npm.cmd test -- --maxWorkers=2` | 99 files, 957/957 PASS |
| Hai browser spec đăng ký, Chromium | 18/18 PASS |
| `git diff --check` | PASS |

Browser dùng Vite của worktree riêng tại `127.0.0.1:5186`, đặt
`ACCOUNT_REGISTRATION_BASE_URL` cùng địa chỉ và cấu hình Playwright local bỏ qua
bởi Git tại `.artifacts/register-publish/playwright.config.ts`. Spec và product
source giữ nguyên so với bản review. Screenshot mobile đã được xem lại.

Lượt test tổng thể đầu chạy đồng thời với build/E2E có một test deep merchant
chạm timeout 5 giây (956/957 đạt). Không thay timeout hoặc assertions: chạy riêng
auth đạt 154/154, test đó mất 1,9 giây; lượt tổng thể sau khi các tiến trình khác
hoàn tất đạt 957/957, test đó mất 1,8 giây. Log lần xuất bản nằm tại
`audit-reports/register-lifecycle-pr-20261118` của workspace, không commit artifacts.

Các giới hạn API mocks, bfcache và screen reader ở mục 5 vẫn áp dụng. Lần xuất bản
này chỉ commit/push và tạo PR; không triển khai production.
