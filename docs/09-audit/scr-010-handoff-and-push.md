# Báo cáo bàn giao và hướng dẫn push FE + BE

Ngày: 05/11/2026 · Task: SCR-010 / SP-S2-FE-010

## 1. Báo cáo SCR-010 để cập nhật ticket

Đã triển khai /login với LoginPage, LoginForm và AuthLayout riêng theo kiến trúc dự án. Dùng Redux Toolkit theo xác nhận của chủ dự án, React Hook Form + Zod cho validation và TanStack Query cho API mutation. API đối chiếu với identity-service microservice: POST /api/v1/auth/login, request phone/password, response data.token/data.role.

Đã bổ sung lưu JWT theo cơ chế hiện hữu; đồng bộ role Redux khi tải lại, đăng xuất, hết hạn và thay đổi phiên ở tab khác; xóa cache khi đổi phiên; guest guard; chuyển dashboard DRIVER/MERCHANT/ADMIN; giữ deep link hợp lệ; ghi nhớ SĐT; hiện/ẩn mật khẩu; spinner/disabled; mã lỗi và retry; toast sau chuyển trang. Password không được ghi nhớ.

Kết quả đã chạy: typecheck PASS, lint PASS, production build PASS; 30 test files / 217 tests PASS; 7/7 Playwright E2E PASS trên Edge với phản hồi API được mô phỏng theo contract. Có ảnh desktop/mobile và log trong docs/09-audit/scr-010-*.

Giới hạn: gateway local 8088 chưa phản hồi nên chưa xác minh tài khoản thực với backend/DB đang chạy. Chưa chứng nhận pixel-perfect với mọi biến thể Stitch. Suite ngoài auth còn stderr XHR do backend request không được mock; không tuyên bố toàn repo sạch runtime log. Chi tiết: [scr-010-login-record.md](./scr-010-login-record.md).

SCR-010 không sửa backend. Những thay đổi BE đang có thuộc task khác và chưa được kiểm thử/review trong phiên này. Không ghi chúng vào kết quả hoàn thành SCR-010.

## 2. Trạng thái Git đã kiểm tra

| Repo | Thư mục | Nhánh hiện tại | Remote |
|---|---|---|---|
| FE | D:/DuAnOjt/smart-parking-app-v2 | feat/scr-006-about-us | https://github.com/smart-parking-hub/smart-parking-app-v2.git |
| BE | D:/DuAnOjt/smart-parking-service-microservice | main | https://github.com/smart-parking-hub/smart-parking-service-microservice.git |

FE đang có cả thay đổi SCR-005/landing và SCR-010. Không dùng git add . rồi commit chung. Chưa thấy nhánh SCR-010 trong danh sách local/remote đã lưu; phải fetch và kiểm tra lại trước khi tạo. Nếu đã có nhánh SCR-010 trên remote, tiếp tục đúng nhánh đó.

BE có sẵn nhánh local và remote fix/booking-parking-lot-address-migration. Tái sử dụng nhánh này cho đúng phần việc của nó, không tự tạo nhánh -v2/-fix mới. Các file BE chưa commit:

- booking-service/src/main/java/com/smartparking/booking/infrastructure/client/ParkingLotClient.java
- booking-service/src/main/java/com/smartparking/booking/infrastructure/scheduler/BookingExpirationScheduler.java
- docs/data-ownership.md
- parking-lot-service/src/main/resources/db/migration/V3__add_changes_requested_parking_lot_status.sql
- parking-lot-service/src/test/java/com/smartparking/parkinglot/ParkingLotSchemaMigrationTest.java

## 3. Chuẩn bị nhánh FE và giữ lại công việc khác

Các lệnh dưới đây là hướng dẫn để bạn chạy trong PowerShell, chưa được thực thi. Chạy từng khối và kiểm tra kết quả. Nếu có conflict, dừng khối hiện tại, xử lý conflict và chạy lại kiểm thử trước khi tiếp tục. Stash được giữ lại đến khi đối chiếu đủ dữ liệu; không xóa stash ngay sau apply.

```powershell
Set-Location D:\DuAnOjt\smart-parking-app-v2
git status --short
git stash push -u -m "backup-before-scr-010-push"
git fetch origin
git branch --list "*scr-010*"
git branch -r --list "*scr-010*"
```

Nếu không có nhánh SCR-010, tạo từ main vừa fetch:

```powershell
git switch -c feat/scr-010-login origin/main
git stash apply 'stash@{0}'
```

Nếu đã có nhánh local, thay lệnh switch ở trên bằng git switch TEN_NHANH_DA_CO; nếu chỉ có remote thì git switch --track origin/TEN_NHANH_DA_CO. Không chạy nguyên placeholder. Việc apply khôi phục cả các thay đổi task khác vào working tree; bước stage bên dưới tách riêng phạm vi SCR-010.

## 4. Stage và commit FE

```powershell
git add -- package.json package-lock.json playwright.config.ts e2e/login.spec.ts
git add -- src/features/auth src/layouts/AuthLayout.tsx
git add -- src/app/providers/AuthSession.tsx src/app/providers/index.tsx src/app/store/index.ts src/app/router/index.tsx
git add -- src/layouts/AdminLayout.tsx src/layouts/driver/DriverHeader.tsx src/layouts/merchant/MerchantHeader.tsx
git add -- src/features/merchant/operations/operations.test.tsx src/features/profile/components/NotificationSettingsModal.tsx
git add -- docs/09-audit/scr-010-login-record.md docs/09-audit/scr-010-handoff-and-push.md
git add -- docs/09-audit/scr-010-build.log docs/09-audit/scr-010-tests.log docs/09-audit/scr-010-e2e.log docs/09-audit/scr-010-desktop.png docs/09-audit/scr-010-mobile.png
```

Ba file có thay đổi trộn nhiều task phải stage từng hunk. Chỉ chọn phần SCR-010 và phần sửa test provider/chờ lazy load, không chọn nội dung SCR-005:

```powershell
git add -p -- src/app/App.test.tsx docs/09-audit/screen-inventory.md docs/09-audit/parity-matrix.md
git diff --cached --stat
git diff --cached --check
git diff --cached
git status --short
```

Trong git add -p: y chọn, n bỏ, s tách hunk; nếu một hunk vẫn chứa nhiều task, dùng e để chọn chính xác hoặc bỏ hunk đó và tách lại trước commit. Kiểm tra cả file vừa tạo trước khi add: thư mục e2e/auth không được vô tình chứa công việc khác. Không stage .env, node_modules, dist, .artifacts hoặc dữ liệu riêng trong ghi-chu.

```powershell
npm ci
npm run typecheck
npm run lint
npm test
npm run build
```

E2E: mở terminal thứ hai, chạy server rồi để chạy trong lúc test:

```powershell
Set-Location D:\DuAnOjt\smart-parking-app-v2
npm run dev -- --host 127.0.0.1 --port 5174 --strictPort
```

Ở terminal chính (cần Edge cài sẵn):

```powershell
npm run test:e2e
git diff --cached --check
git commit -m "feat(auth): complete SCR-010 multi-role login"
```

Lưu ý E2E tạo lại ảnh/log; nếu bằng chứng thay đổi, review và stage lại đúng các file bằng chứng trước commit.

## 5. Đồng bộ và push FE

Để rebase khi còn thay đổi task khác, cất phần còn lại trước:

```powershell
git stash push -u -m "remaining-work-after-scr-010-commit"
git fetch origin
git rebase origin/main
```

Nếu conflict: sửa đúng nội dung, git add từng file rồi git rebase --continue; có thể git rebase --abort để trở lại trước rebase. Sau rebase phải chạy lại các kiểm tra phía trên, rồi:

```powershell
git push -u origin feat/scr-010-login
```

Nếu tái sử dụng một nhánh SCR-010 khác, dùng đúng tên nhánh đó. Nếu push bị non-fast-forward, kiểm tra và đồng bộ với nhánh remote; không dùng force push mặc định. Không tự merge vào main. Phần công việc còn lại nằm trong stash và snapshot sao lưu ban đầu; khôi phục trên đúng nhánh của từng task sau khi kiểm tra git stash list, không apply lặp cả hai stash vào cùng working tree.

PR FE: base main; title `feat(auth): complete SCR-010 multi-role login`. Mô tả kết quả từ mục 1, ghi rõ E2E dùng API mock và live backend pending. Link báo cáo và ảnh trong repo. Các sửa lỗi quality gate ngoài auth phải được reviewer nhìn thấy, không mô tả chúng là thay đổi nghiệp vụ của SCR-010.

## 6. BE — có cần push cho SCR-010 không?

Không cần commit/push BE cho riêng SCR-010: API login hiện hữu đã khớp FE, chưa có thay đổi identity-service của task này. Không tạo commit rỗng để đủ hai repo.

Nếu bạn cũng muốn đưa các thay đổi BE đang có lên remote, đó là đợt bàn giao riêng. Các lệnh sau chỉ áp dụng sau khi xác nhận đúng chủ sở hữu/phạm vi và review diff; kết quả test BE chưa được xác minh trong phiên này.

```powershell
Set-Location D:\DuAnOjt\smart-parking-service-microservice
git status --short
git diff
git stash push -u -m "backup-before-booking-parkinglot-push"
git fetch origin
git switch fix/booking-parking-lot-address-migration
git merge --ff-only origin/fix/booking-parking-lot-address-migration
git stash apply 'stash@{0}'
```

Nếu nhánh không thể fast-forward hoặc apply conflict, dừng để review lịch sử/diff; không dùng reset --hard để ép. Không sửa hoặc chạy migration trên DB production trong thao tác push source.

Sau khi kiểm tra cấu hình test chỉ dùng môi trường local/test, chạy các module liên quan:

```powershell
.\gradlew.bat :identity-service:test :booking-service:test :parking-lot-service:test
```

Đây là lệnh đề xuất, chưa phải bằng chứng PASS. Review cả test migration H2 và độ tương thích MySQL trước triển khai migration.

Stage/commit phần client, schema và tài liệu nếu cùng phạm vi:

```powershell
git add -- booking-service/src/main/java/com/smartparking/booking/infrastructure/client/ParkingLotClient.java
git add -- parking-lot-service/src/main/resources/db/migration/V3__add_changes_requested_parking_lot_status.sql
git add -- parking-lot-service/src/test/java/com/smartparking/parkinglot/ParkingLotSchemaMigrationTest.java docs/data-ownership.md
git diff --cached --check
git diff --cached
git commit -m "fix(parkinglot): align client and parking lot status schema" -m "Align the existing client mapping and preserve parking lot status compatibility." -m "Include the status migration, schema regression test and ownership documentation. Record actual test results in the PR."
```

BookingExpirationScheduler.java cần review riêng hành vi khi release slot/queue thất bại. Nếu thuộc nhánh này, tạo commit riêng và ghi đúng kết quả kiểm thử; nếu là task khác, giữ lại ngoài stage và bàn giao trên nhánh task tương ứng.

```powershell
git add -- booking-service/src/main/java/com/smartparking/booking/infrastructure/scheduler/BookingExpirationScheduler.java
git diff --cached
git commit -m "fix(booking): isolate expiration cleanup failures" -m "Separate expiration state handling from slot release and queue promotion failures." -m "Review failure recovery and record executed regression tests before merge."
```

Sau khi đã commit đúng phạm vi và working tree sạch (hoặc đã stash phần khác):

```powershell
git fetch origin
git rebase origin/main
.\gradlew.bat :identity-service:test :booking-service:test :parking-lot-service:test
git push -u origin fix/booking-parking-lot-address-migration
```

PR BE tách riêng PR FE. Nêu rõ client mapping, migration V3, scheduler và test evidence thực tế; không gắn chúng thành thay đổi backend của login. Push source không đồng nghĩa deploy hay tự chạy migration.

## 7. Xác nhận sau push

Ở từng repo:

```powershell
git status --short
git log -1 --oneline
git branch -vv
```

Kiểm tra commit xuất hiện trên đúng remote branch và CI của PR đạt. Chưa chạy commit, stash, đổi nhánh, rebase hoặc push nào trong quá trình viết hướng dẫn này.
