# FE v2 — bổ sung giao diện còn thiếu

Ngày xác minh: 2026-11-04. Phạm vi: giao diện React tại `smart-parking-app-v2`; đối chiếu controller/DTO trong `smart-parking-service-microservice` và đặc tả tại `stitch_smartparkinghub_visual_dna_analysis`.

Yêu cầu hiện tại của người dùng cho phép xử lý toàn bộ màn hình còn thiếu liên tục. Quy tắc dừng nghiệm thu từng màn hình trong tài liệu cũ được thay bằng nghiệm thu theo nhóm cho công việc này. Không thay đổi các tài liệu quy định gốc.

## Thiết kế

Áp dụng skill `frontend-design`: hướng industrial/utilitarian, navy làm nền tảng, cam làm điểm nhấn hành động, Sora cho tiêu đề và Inter cho nội dung theo design system đã có. Nhịp khoảng cách 4/8px; thẻ dữ liệu, bảng điều phối, số tiền rõ ràng; chuyển động chỉ phục vụ loading và điều hướng. DFII: tác động 4 + phù hợp 5 + khả thi 5 + hiệu năng 4 − rủi ro nhất quán 3 = 15. Đây là đánh giá thiết kế, không phải kết quả nghiệm thu người dùng. Mốc nhận diện là trạm QR tối màu với khung quét cam, kết hợp bảng điều phối sáng.

## Các màn hình mới

| ID | Màn hình | Route |
| --- | --- | --- |
| SCR-009 | Liên hệ, mở email để người dùng tự gửi | `/contact`, `/company/contact` |
| SCR-010 | Đăng nhập, chuyển về portal theo vai trò | `/login` |
| SCR-011 | Đăng ký Driver/Merchant, OTP | `/register` |
| SCR-012 | Quên mật khẩu, gửi/xác nhận OTP | `/forgot-password` |
| SCR-013 | Không có quyền | `/403` |
| SCR-030 | Chi tiết bãi Merchant | `/merchant/parking-lots/:id` |
| SCR-031 | Chỉnh sửa thông tin bãi | `/merchant/parking-lots/:id/edit` |
| SCR-032 | Sức chứa đủ 5 nhóm xe | `/merchant/parking-lots/:id/slots` |
| SCR-033 | Bảng giá đủ 5 nhóm xe | `/merchant/parking-lots/:id/pricing` |
| SCR-034 | Danh sách booking Merchant | `/merchant/bookings` |
| SCR-035 | Chi tiết booking Merchant | `/merchant/bookings/:id` |
| SCR-036 | Camera QR, nhập tay, check-in/out, xác nhận tiền mặt | `/merchant/qr-scanner` |
| SCR-037 | Doanh thu, chuỗi biểu đồ, bộ lọc thời gian | `/merchant/revenue` |
| SCR-038 | Ví, lịch sử và tạo yêu cầu rút tiền | `/merchant/withdrawals` |
| SCR-039 | Khiếu nại Merchant | `/merchant/disputes` |
| SCR-040 | Chi tiết khiếu nại Merchant | `/merchant/disputes/:id` |
| SCR-041 | Thông báo Merchant | `/merchant/notifications` |
| SCR-042 | Tổng quan Admin | `/admin/dashboard` |
| SCR-043 | Kiểm duyệt bãi | `/admin/parking-lots` |
| SCR-044 | Thẩm định, duyệt/từ chối/yêu cầu bổ sung | `/admin/parking-lots/:id` |
| SCR-045 | Danh sách người dùng | `/admin/users` |
| SCR-046 | Chi tiết, khóa/mở khóa, cảnh báo người dùng | `/admin/users/:id` |
| SCR-047 | Giao dịch và modal đối soát | `/admin/transactions` |
| SCR-048 | Duyệt/từ chối yêu cầu rút tiền | `/admin/withdrawals` |
| SCR-049 | Danh sách tranh chấp Admin | `/admin/disputes` |
| SCR-050 | Điều tra và ghi nhận phán quyết | `/admin/disputes/:id` |
| SCR-051 | Nhật ký kiểm toán, phân trang | `/admin/audit-logs` |
| SCR-052 | Thông báo Admin | `/admin/notifications` |
| SCR-053 | Hồ sơ và đổi mật khẩu Admin | `/admin/profile` |
| Bổ sung | Khiếu nại Driver, modal tạo từ booking hoàn tất | `/disputes` |
| Bổ sung | Chi tiết khiếu nại Driver | `/disputes/:id` |
| Bổ sung | Trang 404 | route không khớp |
| Bổ sung | AI Copilot, chat và thẻ bãi gợi ý | trong DriverLayout |

Trạng thái của các màn hình trên: **UI_IMPLEMENTED / API_WIRED / LIVE_BACKEND_ACCEPTANCE_PENDING**. Không đồng nghĩa đã nghiệm thu sản xuất hoặc đã đối chiếu pixel hoàn toàn với ảnh Stitch.

## Xem thiết kế

Chạy `npm run dev`, mở `/design-preview/merchant/qr-scanner`. Dropdown phía dưới cho xem 31 giao diện trong đợt bổ sung (29 màn hình SCR và 2 màn hình khiếu nại Driver). Các bản xem trước có dữ liệu minh họa, nằm trong cây `inert` chỉ đọc, cache riêng, không gọi nghiệp vụ thật. Route này chỉ được đăng ký khi `import.meta.env.DEV`; không có trong bản build production. Không thay JWT hoặc bỏ kiểm tra quyền ở route thật.

Các route thật dùng `access_token` hiện có; role và hạn dùng được đọc từ JWT theo `JwtTokenProvider`. Backend tiếp tục là nơi quyết định quyền truy cập. Alias `/solutions/*` và `/company/*` được bổ sung, các route v2 có sẵn được giữ.

## Đối chiếu contract và các giới hạn

1. **VERIFIED:** check-in, check-out, confirm-cash đều dùng `{ bookingCode, parkingLotId }`. Kết quả check-out là `totalAmount`, `advanceDeposit`, `amountDue`, `parkingMinutes`, `bookingStatus`. Chỉ xác nhận tiền mặt khi nhân viên chủ động bấm nút.
2. **CONFLICT:** đặc tả cũ yêu cầu `hourlyRate`, `overnightRate`, `overtimeHourlyRate`, `depositAmount`. Backend hiện có `basePricePerHour`, `surgeMultiplier`, `surgeStartTime`, `surgeEndTime`, `overtimePenaltyMultiplier`. UI dùng contract backend, không giả tạo khả năng lưu giá qua đêm hoặc cọc riêng. Muốn đáp ứng trọn đặc tả cũ cần mở rộng backend.
3. **VERIFIED:** chi tiết booking kiểm tra userId thuộc Driver hoặc Merchant sở hữu booking trong `BookingServiceImpl`.
4. **VERIFIED:** rút tối thiểu 50.000 VND theo DTO, kiểm tra số dư phía UI và để backend kiểm tra lại. Payload ngân hàng dùng `bankAccountNumber`, `accountHolderName`.
5. **VERIFIED:** Admin cảnh báo người dùng dùng `POST /api/v1/admin/users/{id}/warnings`; phán quyết dùng `PUT /api/v1/disputes/{id}/resolve` với `resolution`. Không gọi endpoint Admin tranh chấp giả định trong tài liệu cũ.
6. **LIMITATION:** MerchantRevenueController nhận bộ lọc nhưng hiện vẫn gọi service tổng hợp không truyền các bộ lọc. UI gửi đúng tham số; kết quả lọc theo khoảng thời gian cần backend hoàn thiện. Doanh thu từng bãi hiện trả số 0 hardcode, nên không thêm biểu đồ bãi giả.
7. **LIMITATION:** ghi nhận phán quyết không tự động hoàn tiền; không có cam kết hoàn tiền tự động trên UI.
8. **LIMITATION:** quét QR dùng BarcodeDetector khi có; trình duyệt không hỗ trợ hiển thị giải thích và dùng nhập mã thủ công. Chưa kiểm chứng camera thật/đèn flash/barie vật lý trên thiết bị cổng.
9. **SECURITY FOLLOW-UP:** backend `SendOtpResponse` vẫn có trường `otpCode`. FE mới không đọc/hiển thị/gửi email trường đó, nhưng backend vẫn cần loại bỏ OTP khỏi response production. Không sử dụng EmailJS trong Auth mới.
10. **LIMITATION:** không có endpoint contact được xác minh; trang liên hệ mở email để người dùng kiểm tra và tự gửi, không thông báo đã nhận hồ sơ giả.
11. **INHERITED:** các màn hình Driver/Merchant cũ vẫn có dữ liệu fallback và một số thao tác mô phỏng. Đợt này không tuyên bố đã chuyển toàn bộ ứng dụng sang dữ liệu production.
12. **VERIFIED:** API client tránh ghép lặp `/api/api/v1` hoặc `/api/v1/api/v1`; `.env.example` dùng gateway 8088, Vite proxy `/api` đến cùng gateway.

## Vị trí component

| Lớp | Nội dung |
| --- | --- |
| `shared/components` | Workspace, Panel, Field, Dialog native có focus/Escape, bảng có phân trang, Badge, QueryState, ApiImage |
| `shared/api` | Envelope helpers, thông báo lỗi, Axios đã có |
| `entities` | Kiểu dữ liệu đã đối chiếu DTO, danh mục 5 loại xe |
| `features` | Nghiệp vụ và form riêng của Auth, Merchant operations, Admin, disputes, portal account, Copilot |
| `layouts` | Admin shell, bổ sung Copilot vào Driver shell |
| `app` | Router, lazy loading và preview catalog chỉ trong development |

## Kiểm tra

- Bộ test cũ: 18 files / 146 tests pass; log có lỗi kết nối mạng từ test cũ gọi máy chủ không chạy.
- Bộ test mới: 10 tests pass, mock transport và không gọi nghiệp vụ thật. Kiểm tra token hết hạn, role, payload quét cổng, thu tiền mặt cần xác nhận riêng, lỗi backend, ví lỗi, lý do phán quyết, đủ 5 loại xe và contract giá.
- Kiểm tra tổng thể sau tích hợp: **19 files / 156 tests pass**, `npm run test -- --silent` (log test cũ bị ẩn bởi tùy chọn silent; không coi đây là bằng chứng không có lỗi kết nối).
- `npm run lint`: **0 lỗi, 0 cảnh báo**. Sáu cảnh báo có sẵn trong Merchant được sửa bằng kiểu dữ liệu cụ thể và bỏ biến catch không dùng.
- `npm run typecheck` và `npm run build`: **pass**. Build cuối không có cảnh báo chunk lớn; chunk ứng dụng chính 425,49 kB (gzip 100,31 kB), tách vendor và lazy-load các trang. Không tăng ngưỡng cảnh báo để che lỗi.
- Bản build cuối không phát sinh chunk DesignPreviewPage chứa dữ liệu minh họa. Nhánh import development được loại bỏ khi build production.
- Đã kiểm tra trực quan trên Edge desktop: đăng nhập, đăng ký, trạm QR, dashboard Admin.
- Sau khi kết nối lại công cụ trình duyệt, đã kiểm tra trực quan trạm QR và biểu phí ở viewport 390×844. Đã khôi phục viewport mặc định. Chưa kiểm tra camera thật, mọi màn hình trên mọi thiết bị hoặc so sánh pixel với ảnh Stitch.
- Chưa chạy end-to-end với backend thật hoặc thanh toán/ngân hàng thật. Cần tài khoản kiểm thử phù hợp và các dịch vụ hoạt động cho nghiệm thu đó.
