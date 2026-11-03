# TASK: IMPLEMENT ONE STITCH SCREEN INTO EXISTING CRM

Bạn phải tuân thủ AGENTS.md, toàn bộ rules liên quan và skill `stitch-screen-implementation`.

## SCREEN INFORMATION
- Screen name: [Tên màn hình]
- Route: [Đường dẫn nếu đã biết]
- Existing module: [Module nghiệp vụ]
- Stitch HTML/CSS: Tôi sẽ dán trực tiếp bên dưới.
- Assets: [Các assets liên quan nếu có]

## STRICT EXECUTION RULES

1. Chỉ triển khai đúng một màn hình trong task này.
2. Đọc toàn bộ HTML/CSS trước khi thực hiện.
3. Stitch là nguồn tham chiếu thiết kế đã được duyệt.
4. Không tự ý thay đổi màu sắc, typography, spacing, layout hoặc cấu trúc trực quan.
5. Không tự ý thêm hoặc xóa chức năng nghiệp vụ.
6. Phải khảo sát màn hình cũ và đối chiếu các chức năng hiện có.
7. Phải xác minh API, DTO, permission và business rules từ source code hoặc Backend.
8. Chuyển đổi thành React + TypeScript component đúng kiến trúc hiện tại.
9. Không sử dụng HTML tĩnh làm sản phẩm hoàn chỉnh.
10. Không tự ý thay đổi các màn hình khác.
11. Không bắt đầu màn hình tiếp theo khi chưa được tôi chấp thuận.
12. **Cổng kiểm tra Zero-Error & Zero-Warning:** Quét sạch toàn bộ lỗi đỏ (typecheck, build, test, console) và cảnh báo vàng (linter, unused variables, React hook warnings) mới được tính là hoàn thành.
13. **Đánh giá tính tái sử dụng và vị trí lưu trữ:** Phải đánh giá từng component có dùng nhiều chỗ không, phân loại rõ ràng vị trí đặt (`shared/components/` vs `entities/` vs `features/<feature>/components/`).

## EXECUTION ORDER

Phase 1: Analyze Stitch source.

Phase 2: Inspect existing frontend and backend contracts.

Phase 3: Create capability parity matrix.

Phase 4: Report implementation plan and architectural placement.

Phase 5: Implement the screen.

Phase 6: Integrate real API, permissions and business logic.

Phase 7: Run tests, build, linter and verify 0 Errors / 0 Warnings.

Phase 8: Update documentation, report results with reusability assessment.

## COMPLETION CONDITIONS

Không được tuyên bố hoàn thành chỉ vì giao diện đã render.

Phải kiểm tra:
- Visual fidelity against Stitch.
- Existing business capability parity.
- Zero Red Errors (typecheck, build, test, runtime).
- Zero Yellow Warnings (linter, unused vars, hook warnings).
- Reusability & placement assessment reported.
- API integration & permission enforcement.
- Loading, error, empty and success states.
- Responsive behavior & Accessibility (a11y).

Cuối cùng, báo cáo chính xác những gì đã làm, chưa làm, lỗi còn tồn tại và bằng chứng kiểm thử.

Sau khi hoàn thành, DỪNG và chờ tôi nghiệm thu.
