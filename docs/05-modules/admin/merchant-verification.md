# Admin Merchant Verification Documentation

- **Module**: Admin Management / Merchant KYC Verifications
- **Routes**:
  - Danh sách hồ sơ: `/admin/merchant-verifications`
  - Chi tiết hồ sơ: `/admin/merchant-verifications/:id`
- **Task**: `SP-MERCHANT-KYC-01-FE`
- **Related Backend**: `identity-service` (`/api/v1/admin/merchant-verifications`)

---

## 1. Mục tiêu và Chức năng

Cung cấp không gian làm việc cho Quản trị viên (Admin) xét duyệt hồ sơ doanh nghiệp chủ bãi xe:
1. **Danh sách hồ sơ nộp**:
   - Lọc theo các tab trạng thái: `Chờ duyệt (PENDING_REVIEW)` (mặc định), `Yêu cầu bổ sung (CHANGES_REQUESTED)`, `Đã xác minh (VERIFIED)`, `Tất cả`.
   - Bảng hiển thị: Mã hồ sơ, Chủ bãi ID, Tên pháp lý công ty, Mã số thuế/GPKD, Phiên bản nộp, Kết quả sơ bộ OCR (Badge), Thời điểm nộp.
   - Phân trang chuẩn với `Pagination` component.
2. **Chi tiết hồ sơ & Đối chiếu tài liệu**:
   - Chi tiết tự cập nhật khi OCR đang chạy hoặc hồ sơ còn chờ xử lý. Khi tải thất bại, dùng nút **Thử tải lại**.
   - Thông tin tự khai: Mã số thuế, Tên pháp lý doanh nghiệp, Ghi chú giải trình (nếu nộp lại).
   - Tệp đính kèm được gom theo nhóm giấy tờ bằng tên tiếng Việt và hiển thị số lượng từng nhóm. Cửa sổ xem tệp cho biết tệp thuộc nhóm nào. Xem trực tiếp ảnh (PNG, JPEG, WebP) trong Modal hoặc mở xem/tải tệp PDF an toàn (sử dụng Blob URL với quyền hạn và thu hồi an toàn qua `URL.revokeObjectURL`).
3. **Bảng đối chiếu tiêu chí OCR tự động (`AssessmentChecklist`)**:
   - Hiển thị 4 tiêu chí cốt lõi:
     - `REQUIRED_DOCUMENT`: Kiểm tra tài liệu bắt buộc.
     - `READABILITY`: Kiểm tra khả năng đọc của tệp.
     - `REGISTRATION_NUMBER_MATCH`: Đối chiếu mã số doanh nghiệp.
     - `LEGAL_NAME_MATCH`: Đối chiếu tên pháp lý công ty.
   - Nhãn kết quả: `Đạt (PASS)`, `Cần kiểm tra (WARN)`, `Chưa kiểm tra (NOT_CHECKED)`.
   - Trường hợp OCR không khả dụng (`UNAVAILABLE`): Hiển thị cảnh báo màu vàng, thông báo Admin kiểm tra thủ công trực tiếp với tài liệu gốc đính kèm.
4. **Phê duyệt hồ sơ (`ApproveVerificationModal`)**:
   - Hộp thoại yêu cầu checkbox bắt buộc: "Tôi xác nhận đã xem xét trực tiếp đầy đủ các tệp tài liệu gốc đính kèm của hồ sơ này".
   - Nếu có tiêu chí cảnh báo (`WARN`) hoặc trạng thái kiểm tra `UNAVAILABLE`: Bắt buộc Admin phải nhập ghi chú giải trình kiểm duyệt chi tiết (tối thiểu 5 ký tự) trước khi bấm duyệt.
5. **Yêu cầu bổ sung (`RequestChangesModal`)**:
   - Với hồ sơ chờ duyệt, Admin có thể chọn **Không đúng yêu cầu** từ danh sách hoặc khi xem tệp. Hộp thoại chọn sẵn loại tài liệu đã khai và điền lý do chứa tên tệp. Admin có thể sửa lý do trước khi xác nhận gửi.
   - Cho phép Admin chọn một hoặc nhiều mục cần sửa đổi (`BUSINESS_INFO`, `BUSINESS_REGISTRATION`, `AUTHORIZATION_LETTER`, `SUPPORTING_DOCUMENT`).
   - Bắt buộc nhập lý do chi tiết cho từng mục đã chọn.
   - Gửi yêu cầu chuyển trạng thái hồ sơ sang `CHANGES_REQUESTED` và phát sinh thông báo in-app cho chủ bãi.
6. **Xử lý 409 Conflict**:
   - Khi có xung đột phiên bản (do Admin khác đã duyệt hoặc Merchant đã gửi bản nộp mới), hệ thống tự động refetch dữ liệu mới nhất và hiển thị thông báo rõ ràng cho Admin.

---

## 2. API Contract Mapping

| Thao tác Admin | HTTP Method & Endpoint | Payload / Params |
| :--- | :--- | :--- |
| Danh sách hồ sơ | `GET /api/v1/admin/merchant-verifications` | Query: `page`, `size`, `status?` |
| Chi tiết hồ sơ | `GET /api/v1/admin/merchant-verifications/{id}` | N/A (Bearer JWT) |
| Tra cứu MST | `POST /api/v1/admin/merchant-verifications/{id}/submissions/{ver}/tax-lookup` | `{ confirmedBusinessTaxCode: true }` |
| Duyệt hồ sơ | `POST /api/v1/admin/merchant-verifications/{id}/approve` | `{ submissionVersion, documentsReviewed: true, note? }` |
| Yêu cầu bổ sung | `POST /api/v1/admin/merchant-verifications/{id}/request-changes` | `{ submissionVersion, items: [{ key, reason }] }` |
| Tải/xem tệp phiên bản | `GET /api/v1/admin/merchant-verifications/{id}/submissions/{ver}/documents/{docId}/content` | Raw bytes kèm header bảo mật |

## Đồng bộ bản nộp và lỗi API

Tài liệu dùng UUID dạng chuỗi. Timeline đọc lý do từ `items`, người ra quyết định từ `actor` và ghi chú kiểm duyệt từ `note` do API cấp cho Admin. HTTP 409 kích hoạt tải lại dữ liệu và yêu cầu xác nhận lại hành động. Lỗi tải hồ sơ có nút thử lại và khóa thao tác ghi khi dữ liệu không còn đáng tin cậy.
Xác nhận duyệt và yêu cầu bổ sung gắn với phiên bản lúc mở hộp thoại. Preview được hủy khi đóng và tải xuống lỗi có thông báo để thử lại.

## Tra cứu mã số thuế

Trong hồ sơ đang chờ duyệt, **Tra cứu mã số thuế** có ngay từ bản nộp đầu, kể cả khi OCR đang xử lý. Admin xác nhận mã ghi trên giấy tờ là MST doanh nghiệp 10 số hoặc chi nhánh dạng 10 số-3 số trước khi tra Casso. Với mã 12 số và các định dạng khác, màn hình hướng dẫn đối chiếu trực tiếp trên giấy tờ. Admin tiếp tục dùng thao tác duyệt hoặc yêu cầu bổ sung theo trạng thái hồ sơ.

Kết quả hiện cạnh thông tin khai và OCR, gồm tên đăng ký, trạng thái hoạt động, nguồn và thời điểm tra cứu. Khi kết quả **Không tìm thấy MST** hoặc tên đăng ký khác tên đã khai, Admin xem giấy tờ và có thể yêu cầu bổ sung. Khi **Chưa tra cứu được**, Admin có thể thử lại theo thời điểm hiển thị hoặc kiểm tra thủ công. Kết quả chỉ hiện cho bản nộp đang xem. Các bước kiểm tra giấy tờ, quyền đại diện và quyết định hồ sơ do Admin thực hiện.

Kết quả từ khóa Casso dùng thử được gắn nhãn và dùng để kiểm thử tích hợp. Giao diện chỉ cảnh báo lệch tên theo phản hồi của app chính thức.

## Nguồn đối chiếu và yêu cầu sửa tên pháp lý

Bảng OCR hiển thị tên tệp, phương thức đọc và số phiên bản từ `assessment.source`. **Mở tệp đã đối chiếu** dùng API xem tệp của đúng phiên bản. Kết quả cũ thiếu nguồn hiển thị **Chưa lưu nguồn đối chiếu**.

Dòng tên pháp lý có kết quả không khớp cung cấp nút **Yêu cầu sửa tên pháp lý**. Hộp thoại chọn sẵn **Thông tin doanh nghiệp** và điền mẫu lý do từ tên đã khai và tên trích xuất. Khi gửi với mục này được chọn, UI gửi thêm `resetLegalName: true` để Identity xóa tên khỏi vòng sửa của chủ bãi.
