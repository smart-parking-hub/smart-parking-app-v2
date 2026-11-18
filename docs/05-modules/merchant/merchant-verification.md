# Merchant Business Verification (KYC) Documentation

- **Module**: Merchant Profile / Legal Documents
- **Route**: `/merchant/profile#giay-to`
- **Task**: `SP-MERCHANT-KYC-01-FE`
- **Related Backend**: `identity-service` (`/api/v1/merchant/profile/verification`)

---

## 1. Mục tiêu và Chức năng

Cung cấp giao diện trực quan cho Chủ bãi xe (Merchant) quản lý hồ sơ định danh doanh nghiệp:
1. **Lưu nháp thông tin kinh doanh**: Nhập và cập nhật Mã số doanh nghiệp / Giấy phép kinh doanh (`businessRegistrationNumber`), Tên pháp lý công ty (`legalName`), và Ghi chú giải trình khi nộp lại (`resubmissionNote`).
2. **Quản lý tài liệu theo danh mục**:
   - `BUSINESS_REGISTRATION`: Giấy chứng nhận đăng ký kinh doanh/doanh nghiệp (Bắt buộc, 1-3 tệp, tối đa 5MB/tệp).
   - `AUTHORIZATION_LETTER`: Giấy ủy quyền đại diện pháp luật (Tùy chọn, 1-3 tệp).
   - `SUPPORTING_DOCUMENT`: Tài liệu bổ sung khác (Tùy chọn, 1-3 tệp).
   - Xem và tải xuống các tệp đã lưu trong bản nháp hoặc bản đã nộp.
   - Thay thế hoặc xóa tệp khi được phép chỉnh sửa (`editableItems`).
3. **Thẩm định OCR sơ bộ**: Hiển thị trạng thái kiểm tra tự động (`COMPLETED`, `PENDING`, `UNAVAILABLE`) và danh sách tiêu chí đối chiếu (`REQUIRED_DOCUMENT`, `READABILITY`, `REGISTRATION_NUMBER_MATCH`, `LEGAL_NAME_MATCH`).
4. **Gửi duyệt hồ sơ**:
   - Chỉ cho phép gửi khi đã nhập đủ mã số, tên pháp lý và có ít nhất 1 tệp giấy phép kinh doanh.
   - Merchant xác nhận trước khi gửi. Hệ thống khóa chỉnh sửa khi hồ sơ chuyển sang **Chờ duyệt**.
   - Nếu đã gửi nhầm, Merchant liên hệ Admin để yêu cầu bổ sung đúng mục cần chỉnh. Khi trạng thái chuyển sang **Yêu cầu bổ sung**, Merchant cập nhật các mục được mở. Lần gửi lại tạo phiên bản nộp mới, bản đã nộp trước đó được lưu trong lịch sử.
   - Danh sách yêu cầu bổ sung và lịch sử hiển thị tên mục bằng tiếng Việt kèm lý do.
   - Khi sửa hồ sơ, các nhóm được mở hiện trước. Các nhóm chỉ đọc ghi rõ tệp được giữ từ phiên bản đã nộp.
5. **Theo dõi trạng thái & Lịch sử**: Hiển thị badge trạng thái (`DRAFT`, `PENDING_REVIEW`, `CHANGES_REQUESTED`, `VERIFIED`), phiên bản nộp và dòng thời gian xử lý (`history`).

---

## 2. API Contract Mapping

| Thao tác UI | HTTP Method & Endpoint | Payload / Params | Xử lý phản hồi / Lỗi |
| :--- | :--- | :--- | :--- |
| Tải hồ sơ xác minh | `GET /api/v1/merchant/profile/verification` | N/A (Bearer JWT) | Cập nhật form state & cache |
| Lưu nháp thông tin | `PUT /api/v1/merchant/profile/verification/details` | `{ draftRevision, businessRegistrationNumber, legalName, resubmissionNote? }` | Tăng `draftRevision`, thông báo thành công |
| Tải lên tài liệu | `PUT /api/v1/merchant/profile/verification/documents/{type}` | FormData: `draftRevision`, `files` (1-3) | Tăng `draftRevision`, cập nhật danh sách tệp |
| Xóa tài liệu | `DELETE /api/v1/merchant/profile/verification/documents/{type}` | Query: `draftRevision` | Tăng `draftRevision`, cập nhật danh sách tệp |
| Gửi duyệt hồ sơ | `POST /api/v1/merchant/profile/verification/submit` | `{ draftRevision, ocrDocumentId? }` | Chuyển trạng thái sang `PENDING_REVIEW` |
| Tải/xem tệp | `GET /api/v1/merchant/profile/verification/documents/{id}/content` | Blob request kèm auth | Tải tệp an toàn hoặc mở xem |

---

## 3. Xử lý Lỗi & Xung đột

- **400 Bad Request**: Hiển thị thông báo lỗi kiểm tra đầu vào cạnh trường dữ liệu hoặc alert panel.
- **409 Conflict**: Xảy ra khi `draftRevision` cũ hoặc trạng thái hồ sơ bị thay đổi trên tab/phiên khác. Hệ thống tự động kích hoạt `refetch` tải lại phiên bản mới nhất từ server và hiển thị thông báo để người dùng thao tác tiếp.
- **413 Payload Too Large / 415 Unsupported Media Type**: Bắt lỗi từ phía client trước khi upload (chỉ chấp nhận PDF, JPEG, PNG, WebP; tối đa 5MB/tệp, tối đa 16MB/request).
- **Responsive**: Hỗ trợ chuẩn xác kích thước màn hình từ Mobile 390px đến Desktop 1440px không bị tràn ngang.

## Đồng bộ bản nộp và lỗi API

Tài liệu dùng UUID dạng chuỗi. Timeline đọc lý do từ `items`, người ra quyết định từ `actor` và ghi chú kiểm duyệt từ `note` do API cấp cho Admin. HTTP 409 kích hoạt tải lại dữ liệu và yêu cầu xác nhận lại hành động. Lỗi tải hồ sơ có nút thử lại và khóa thao tác ghi khi dữ liệu không còn đáng tin cậy.
Thông tin đang nhập được giữ khi tải/xóa tệp hoặc cập nhật dữ liệu cùng vòng sửa. Lưu thông tin trước khi gửi. API báo mục cần bổ sung đã xử lý qua `addressed`.

Tại trang thông báo của Merchant, liên kết “Xem hồ sơ giấy tờ” nằm trực tiếp trong hàng thông báo yêu cầu bổ sung hoặc duyệt và mở mục giấy tờ trong hồ sơ.

## Tệp dùng để đối chiếu và tên pháp lý

Hồ sơ có một giấy đăng ký sẽ tự chọn tệp đó. Khi có nhiều giấy đăng ký, chủ bãi chọn **Tệp dùng để đối chiếu** và kiểm tra lại tên tệp trong hộp thoại xác nhận trước khi nộp. Mỗi bản nộp lưu lựa chọn riêng.

Bản nháp mới mở với tên pháp lý trống. Khi Admin dùng **Yêu cầu sửa tên pháp lý**, tên pháp lý trong vòng sửa được để trống. Chủ bãi nhập tên trên giấy đăng ký, lưu thông tin rồi gửi phiên bản mới.
