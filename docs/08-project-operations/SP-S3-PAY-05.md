# [SP-S3-PAY-05] [FE] Hoàn thiện giám sát giao dịch toàn hệ thống (SCR-047, 5 STP)

- Owner: Đội phát triển SPH. Module: Admin / Payments.
- Repository: `smart-parking-app-v2`; route: `/admin/transactions`; quyền: ADMIN.
- last_verified: 2026-11-14. Status: đã triển khai, chờ nghiệm thu / sign-off.

## Điều chỉnh task

VERIFIED: Sprint backlog 3 xác định PAY-05 là FE / AdminTransactionsPage. Source đã có danh sách phân trang và modal lấy từ bản ghi danh sách. Backend `smart-parking-service-microservice/payment-service` đã cung cấp API danh sách và chi tiết, có RBAC ADMIN.

Thay nhãn BE bằng FE; giữ Reporting / Sprint 03. Bỏ HTML sao chép từ Trello, mục rỗng Add/Dates/Members/Card Views, mô tả Given/When/Then chung chung, yêu cầu Flyway/entity và `./gradlew test` không phù hợp phạm vi frontend. Chưa đánh dấu code review hay kiểm thử chưa chạy là hoàn tất.

## Phạm vi

Hoàn thiện màn hình chỉ đọc: danh sách giao dịch thanh toán toàn hệ thống, tổng bản ghi, phân trang server (20/trang), sắp xếp mới/cũ và số tiền qua Pageable, làm mới, chi tiết lấy mới theo ID. Hiển thị mã giao dịch/booking, số tiền VND, loại, trạng thái, gateway, merchant và định danh người trả theo DTO. Hỗ trợ desktop/mobile, loading, rỗng, lỗi, thử lại và đóng modal bằng bàn phím.

Ngoài phạm vi: ghi/sửa bút toán, xác nhận đối soát, chuyển tiền, duyệt rút tiền, xử lý hoàn tiền, báo cáo tổng hợp, xuất file, realtime và tìm kiếm/lọc toàn hệ thống (API hiện chưa hỗ trợ). Đây là danh sách `payments`, không phải toàn bộ `ledger_journals`/`ledger_postings` hay lịch sử mọi khoản rút tiền.

## Contract đã xác minh

- `GET /api/v1/admin/transactions?page=0&size=20&sort=createdAt,desc`: `ApiResponse<PageResponse<AdminTransactionResponse>>`; `currentPage` bắt đầu từ 0.
- `GET /api/v1/admin/transactions/{id}`: `ApiResponse<AdminTransactionResponse>`; không tồn tại trả NOT_FOUND / 404.
- Controller và SecurityConfig payment-service đều giới hạn ADMIN; frontend giữ RequireRole ADMIN, client JWT hiện có.
- Loại: DEPOSIT / FINAL_PAYMENT / PENALTY / REFUND. Trạng thái: REQUIRES_REVIEW / PENDING / SUCCESS / FAILED / REFUNDED.
- DTO hiện dựng `bookingCode = BK-{bookingId}`, `merchantName = Merchant #{merchantId}` và `payerPhone = USER#{driverId}`; không coi các trường này là tên thật/số điện thoại đã tra cứu. Dùng ID người trả và ghi rõ merchant theo dữ liệu hệ thống; không bổ sung truy vấn chéo dịch vụ.
- Nguồn: `payment-service/.../api/controller/AdminFinanceController.java`, `application/dto/AdminTransactionResponse.java`, `application/service/impl/PaymentServiceImpl.java`, `infrastructure/security/SecurityConfig.java`; `common-library/.../enums/Payment*Enum.java`.

## Tiêu chí nghiệm thu

1. ADMIN mở route: gọi GET danh sách phân trang, mặc định mới nhất; hiển thị số tiền căn phải, loại/trạng thái đúng DTO và tổng số bản ghi từ server.
2. Chuyển trang/sắp xếp: request tương ứng; đổi sắp xếp về trang đầu. Không sắp xếp/lọc riêng trang rồi trình bày như kết quả toàn hệ thống.
3. Chọn giao dịch: gọi GET chi tiết theo ID; hiển thị dữ liệu mới từ server, không dùng snapshot danh sách làm kết quả chi tiết.
4. Loading, danh sách rỗng, lỗi mạng/403 và chi tiết 404 có thông báo, thử lại được, modal vẫn đóng được; không phát sinh request ghi.
5. Làm mới lấy lại dữ liệu; không hiển thị hành động ghi nhận/hoàn tất đối soát. Người dùng khác ADMIN bị route guard chặn; backend vẫn là nơi thực thi quyền.
6. 390px và 1440px: dùng được danh sách/chi tiết, không tràn viewport, bàn phím mở/đóng và trả focus về nút gọi.

## Kế hoạch thực thi

1. Tách type, API, page và dialog giao dịch vào `src/features/admin/transactions/`; giữ public export cũ trong `admin/index.tsx` để tương thích route/import.
2. Dùng TanStack Query và HTTP client hiện có; tái sử dụng Workspace, DataTable, Dialog, QueryState, formatter; component nghiệp vụ đặt trong feature, không thêm dependency.
3. Kiểm thử hành vi danh sách, sort/page/refresh, chi tiết mới, lỗi, rỗng, đổi giao dịch và RBAC route. Cập nhật hai test hồi quy cũ theo GET chi tiết thật.
4. Chạy lint, TypeScript, Vitest, build và Playwright có network fixture; ghi kết quả/giới hạn trong báo cáo.

Rủi ro: DTO dùng nhãn tham chiếu thay tên thật; LocalDateTime không chứa timezone; không tự suy diễn doanh thu hay giờ UTC. Giữ formatter hiện có và ghi nhận giới hạn. Rollback: revert đúng diff frontend của PAY-05; không có migration hay dữ liệu cần khôi phục.

## Kiểm chứng và DoD

- `npm run typecheck`; `npm run lint`; `npm test`; `npm run build`.
- `npx playwright test e2e/admin-transactions.spec.ts` (fixture network, không thay thế kiểm thử tích hợp backend thật).
- Thủ công staging: đăng nhập ADMIN, chuyển trang/sắp xếp/làm mới, đối chiếu GET chi tiết với payment-service; kiểm tra DRIVER/MERCHANT bị 403 tại API thật.
- Bằng chứng: [Báo cáo PAY-05](../09-audit/SP-S3-PAY-05-report.md).
- Code review, sign-off và staging thật: chưa xác minh, không tự đánh dấu hoàn thành.

- [x] Triển khai trong phạm vi frontend và giữ public export/route.
- [x] Lint, TypeScript, build đạt; 695/695 Vitest, 5/5 browser E2E dùng fixture đạt.
- [x] Cập nhật tài liệu contract, inventory, parity và bằng chứng.
- [ ] Nghiệm thu với payment-service trên staging và dữ liệu thật.
- [ ] Human code review / sign-off.

Nhánh bàn giao: `feat/admin-transactions`. Commit và PR được tra cứu theo nhánh này trong GitHub.
