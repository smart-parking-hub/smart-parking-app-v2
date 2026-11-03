# Rule 15 — Stitch HTML: Single Screen Implementation Protocol

> Status: MANDATORY & CONSTITUTIONAL  
> Applies to: Every task involving UI screens, Stitch HTML/CSS intake, or screen redesign.  
> Trigger: Any prompt containing `# TASK: IMPLEMENT ONE STITCH SCREEN INTO EXISTING CRM` or any user input providing Stitch HTML/CSS.

---

## 1. Mandatory Intake Rule (Quy Định Bắt Buộc Khi Nhận HTML Giao Diện)

> [!CRITICAL]
> Mỗi lần người dùng gửi file HTML/CSS giao diện (từ Stitch hoặc bất kỳ nguồn thiết kế nào), Agent **BẮT BUỘC** phải đọc và tuân thủ nghiêm ngặt văn bản quy chuẩn:
> **`# TASK: IMPLEMENT ONE STITCH SCREEN INTO EXISTING CRM`**
> Tuyệt đối không được bỏ qua bất kỳ quy tắc hoặc giai đoạn thực thi nào dưới đây.

---

## 2. 11 Strict Execution Rules (11 Quy Tắc Thực Thi Nghiêm Ngặt)

1. **Chỉ triển khai đúng một màn hình trong task này:** Tuyệt đối không làm gộp nhiều màn hình trong một lần thực thi.
2. **Đọc toàn bộ HTML/CSS trước khi thực hiện:** Đọc và phân tích toàn bộ source markup, inline/external CSS và responsive rules trước khi viết bất kỳ dòng code nào.
3. **Stitch là nguồn tham chiếu thiết kế đã được duyệt:** Coi mockup Stitch là thẩm quyền cao nhất về mặt giao diện trực quan.
4. **Không tự ý thay đổi màu sắc, typography, spacing, layout hoặc cấu trúc trực quan:** Giữ nguyên vẹn tính trung thực thiết kế (Visual Fidelity).
5. **Không tự ý thêm hoặc xóa chức năng nghiệp vụ:** Mockup thiếu không đồng nghĩa với việc xóa bỏ logic cũ. Không tự sáng tác quy trình nghiệp vụ mới.
6. **Phải khảo sát màn hình cũ và đối chiếu các chức năng hiện có:** Lập bảng kiểm tra 100% tính năng của màn hình tương ứng trên hệ thống cũ.
7. **Phải xác minh API, DTO, permission và business rules từ source code hoặc Backend:** Không giả định endpoint, request/response format hay mã quyền hạn.
8. **Chuyển đổi thành React + TypeScript component đúng kiến trúc hiện tại:** Tuân thủ phân lớp kiến trúc (Feature-driven / 4-Layer Architecture) của dự án.
9. **Không sử dụng HTML tĩnh làm sản phẩm hoàn chỉnh:** Tuyệt đối không copy paste mã HTML thô hoặc dùng `dangerouslySetInnerHTML` làm sản phẩm giao nộp.
10. **Không tự ý thay đổi các màn hình khác:** Cô lập hoàn toàn phạm vi thay đổi trong màn hình đang làm; không gây side-effect sang các module khác.
11. **Không bắt đầu màn hình tiếp theo khi chưa được tôi chấp thuận:** Sau khi hoàn thành, DỪNG LẠI và chờ người dùng nghiệm thu trước khi chuyển bước.

---

## 3. 8 Execution Phases (Thứ Tự Thực Hiện 8 Giai Đoạn)

### Phase 1: Analyze Stitch source
- Phân tích bố cục vùng (header, sidebar, content, modal).
- Trích xuất token: màu sắc, typography, spacing, shadows, borders, breakpoints.
- Bóc tách components, icons, assets, và dữ liệu tĩnh/demo placeholder.

### Phase 2: Inspect existing frontend and backend contracts
- Khảo sát màn hình cũ tương ứng: URL route, actions, data bindings, permissions.
- Kiểm tra Backend: Controller, DTO, OpenAPI schema, authorization guards, error codes.
- Ghi nhận những tính năng cũ bị thiếu trong thiết kế Stitch mới.

### Phase 3: Create capability parity matrix
- Lập bảng đối chiếu chi tiết:
  | Chức năng cũ | Thể hiện trên Stitch | Chuyển đổi React Component | API / Quyền hạn | Trạng thái |
  |---|---|---|---|---|
- Đánh dấu rõ: `Preserved`, `Changed` (cần duyệt), `MissingInDesign`, `ClarificationRequired`.

### Phase 4: Report implementation plan and unresolved issues
- Trình bày kế hoạch thực thi tóm tắt trước khi gõ code:
  - Danh sách file tạo mới / chỉnh sửa.
  - Components tái sử dụng / tạo mới.
  - Các điểm nghi vấn hoặc rủi ro nghiệp vụ cần xác nhận.

### Phase 5: Implement the screen
- Chuyển đổi markup thành component React 19 + TypeScript + Tailwind CSS v4.
- Đảm bảo HTML ngữ nghĩa (semantic HTML), tính tương thích màn hình (responsive design).
- Xây dựng cấu trúc layout và composition sạch sẽ.

### Phase 6: Integrate real API, permissions and business logic
- Kết nối API client thực tế, xử lý state đầy đủ.
- Ép kiểm tra phân quyền (RBAC) trên từng nút hành động / view.
- Xử lý đủ các trạng thái UI:
  - `Loading State` (Skeleton / Spinner).
  - `Empty State` (Chưa có dữ liệu / Lọc không có kết quả).
  - `Error State` (Lỗi mạng / Lỗi 403 / 500 kèm nút retry).
  - `Success State` (Hiển thị dữ liệu / Thông báo thành công).
  - `Disabled State` (Vô hiệu hóa khi form chưa hợp lệ hoặc đang xử lý).

### Phase 7: Run tests, build and visual comparison
- Chạy kiểm tra chất lượng code:
  - TypeScript compilation: `npm run typecheck` hoặc `tsc --noEmit`.
  - Linter: `npm run lint`.
  - Unit / Component tests: `npm run test`.
  - Production build: `npm run build`.
- So sánh giao diện trực quan tại cùng độ phân giải với Stitch.
- Kiểm tra tương tác bàn phím (Tab, Enter, Escape) và Accessibility (a11y).

### Phase 8: Update documentation and report results
- Cập nhật Screen Inventory (`docs/09-audit/screen-inventory.md`).
- Cập nhật Parity Matrix (`docs/09-audit/parity-matrix.md`).
- Xuất Task Report tổng kết minh bạch:
  - Đã làm gì / Chưa làm gì.
  - Lỗi còn tồn tại.
  - Bằng chứng kiểm thử (logs, kết quả build).
- **DỪNG LẠI (HALT) và chờ người dùng nghiệm thu.**

---

## 4. Completion Conditions (Điều Kiện Nghiệm Thu Bắt Buộc)

> [!WARNING]
> **Tuyệt đối không được tuyên bố hoàn thành chỉ vì giao diện đã render được trên trình duyệt.**

Phải kiểm tra đầy đủ danh mục nghiệm thu:
- [ ] **Visual fidelity against Stitch:** Bố cục, font, màu sắc, khoảng cách đạt độ khớp chuẩn xác.
- [ ] **Existing business capability parity:** 100% tính năng của màn hình cũ được kế thừa hoặc ghi nhận rõ.
- [ ] **API integration:** Dữ liệu thật từ Backend, DTO đúng kiểu TypeScript, không dùng mock data cho luồng chính.
- [ ] **Permission enforcement:** Đúng role, ẩn/vô hiệu hóa đúng quyền.
- [ ] **State completeness:** Loading, Error, Empty, Success được kiểm thử trực quan.
- [ ] **Responsive behavior:** Hiển thị chuẩn trên desktop và các breakpoint được yêu cầu.
- [ ] **Accessibility & Keyboard:** Hỗ trợ phím, focus visible, ARIA labels.
- [ ] **TypeScript, Lint, Tests & Production Build:** Tất cả pass 0 lỗi.

**Báo cáo kết quả trung thực, DỪNG LẠI và chờ người dùng duyệt trước khi làm bất kỳ việc nào tiếp theo.**
