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

## 2. 13 Strict Execution Rules (13 Quy Tắc Thực Thi Nghiêm Ngặt)

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
12. **Cổng kiểm tra Zero-Error & Zero-Warning (Xóa sạch toàn bộ Lỗi Đỏ & Cảnh Báo Vàng):**
    * Hoàn thành giao diện KHÔNG PHẢI chỉ chia xong component hay render được trên trình duyệt.
    * **BẮT BUỘC** phải kiểm tra và quét sạch sẽ:
      * **Lỗi đỏ (Errors):** Lỗi biên dịch TypeScript (`tsc --noEmit`), build thất bại (`vite build`), test thất bại (`vitest`), lỗi console runtime, ảnh/asset gãy (broken 404).
      * **Cảnh báo vàng (Warnings):** Cảnh báo linter (`eslint .`), biến/import thừa không dùng, thiếu dependencies trong React hooks, thiếu `key` trong danh sách lặp, type-casting lỏng lẻo (`any`).
    * Tất cả các lệnh kiểm tra phải đạt trạng thái **0 Errors, 0 Warnings** mới được tính là hoàn thành.
13. **Đánh giá nghiệm thu tính tái sử dụng và vị trí lưu trữ (Reusability & Placement Assessment):**
    * Mỗi component bóc tách từ Stitch bắt buộc phải được đánh giá:
      * Component này chỉ dùng riêng cho màn hình này hay có tiềm năng tái sử dụng ở nhiều màn hình khác?
      * **Vị trí lưu trữ chuẩn theo kiến trúc 4 lớp:**
        * `src/shared/components/`: Dành cho generic UI primitives dùng chung toàn hệ thống (Button, Input, Modal, Badge, Tooltip, Data Table, Dropdown...). Tuyệt đối không chứa logic nghiệp vụ.
        * `src/entities/`: Dành cho component gắn với khái niệm nghiệp vụ dùng chung xuyên suốt 2+ features (ví dụ: `VehicleCard`, `ParkingLotStatusBadge`, `DriverAvatar`, `PriceTag`).
        * `src/features/<feature>/components/`: Dành cho component chỉ phục vụ ngữ cảnh riêng của màn hình/feature đó (Hero, Bento, Services grid, form đặc thù...).
    * Tuyệt đối không để component bừa bãi ra ngoài root hoặc nhét bừa vào `shared` khi chưa đánh giá; không nhân bản (duplicate) code khi component có tính tái sử dụng cao.

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

### Phase 4: Report implementation plan & Component placement
- Trình bày kế hoạch thực thi tóm tắt trước khi gõ code:
  - Danh sách file tạo mới / chỉnh sửa.
  - **Đánh giá vị trí lưu trữ từng component:** `shared/components/` vs `entities/` vs `features/<feature>/components/`.
  - Các điểm nghi vấn hoặc rủi ro nghiệp vụ cần xác nhận.

### Phase 5: Implement the screen
- Chuyển đổi markup thành component React 19 + TypeScript + Tailwind CSS v4.
- Đảm bảo HTML ngữ nghĩa (semantic HTML), tính tương thích màn hình (responsive design).
- Xây dựng cấu trúc layout và composition sạch sẽ, tách file module hóa.

### Phase 6: Integrate real API, permissions and business logic
- Kết nối API client thực tế, xử lý state đầy đủ theo ADR-0001.
- Ép kiểm tra phân quyền (RBAC) trên từng nút hành động / view.
- Xử lý đủ các trạng thái UI: `Loading State`, `Empty State`, `Error State`, `Success State`, `Disabled State`.

### Phase 7: Run tests, build and ZERO-ERROR / ZERO-WARNING verification
- Chạy toàn bộ các cổng kiểm định chất lượng:
  - TypeScript compilation: `npm run typecheck` (`tsc --noEmit`) -> **0 lỗi**.
  - Linter: `npm run lint` (`eslint .`) -> **0 lỗi đỏ, 0 cảnh báo vàng**.
  - Unit / Component tests: `npm run test` (`vitest run`) -> **100% PASS**.
  - Production build: `npm run build` (`tsc -b && vite build`) -> **PASS**.
- Kiểm tra console trình duyệt: Không có lỗi đỏ (error) hay cảnh báo vàng (warning) nào khi tương tác.
- So sánh giao diện trực quan tại cùng độ phân giải với Stitch.
- Kiểm tra tương tác bàn phím (Tab, Enter, Escape) và Accessibility (a11y).

### Phase 8: Update documentation, report results & Reusability assessment
- Cập nhật Screen Inventory (`docs/09-audit/screen-inventory.md`).
- Cập nhật Parity Matrix (`docs/09-audit/parity-matrix.md`).
- **Xuất Báo Cáo Nghiệm Thu Tổng Kết:**
  - Kết quả kiểm tra Zero-Error & Zero-Warning (kèm log).
  - Bảng đánh giá tính tái sử dụng & vị trí đặt các component.
  - Những việc đã làm / chưa làm.
- **DỪNG LẠI (HALT) và chờ người dùng nghiệm thu.**

---

## 4. Completion Conditions (Điều Kiện Nghiệm Thu Bắt Buộc)

> [!WARNING]
> **Tuyệt đối không được tuyên bố hoàn thành chỉ vì giao diện đã render được trên trình duyệt.**

Phải kiểm tra đầy đủ danh mục nghiệm thu:
- [ ] **Visual fidelity against Stitch:** Bố cục, font, màu sắc, khoảng cách đạt độ khớp chuẩn xác.
- [ ] **Existing business capability parity:** 100% tính năng của màn hình cũ được kế thừa hoặc ghi nhận rõ.
- [ ] **Zero Red Errors:** `typecheck`, `build`, `test`, `console` không có bất kỳ lỗi đỏ nào.
- [ ] **Zero Yellow Warnings:** `eslint .` sạch sẽ 0 cảnh báo vàng, không còn biến thừa, không warning hooks hay missing keys.
- [ ] **Component Placement Reviewed:** Mọi component đều được phân loại đúng vị trí (`shared` vs `entities` vs `features`).
- [ ] **API integration & State completeness:** Dữ liệu thật, xử lý đủ 5 trạng thái UI (Loading, Empty, Error, Success, Disabled).
- [ ] **Permission enforcement:** Đúng role, ẩn/vô hiệu hóa đúng quyền.
- [ ] **Responsive behavior:** Hiển thị chuẩn trên desktop và các breakpoint được yêu cầu.
- [ ] **Accessibility & Keyboard:** Hỗ trợ phím, focus visible, ARIA labels.

**Báo cáo kết quả trung thực, DỪNG LẠI và chờ người dùng duyệt trước khi làm bất kỳ việc nào tiếp theo.**
