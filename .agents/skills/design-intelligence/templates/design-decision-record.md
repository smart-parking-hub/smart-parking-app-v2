# Template: Design Decision Record (DDR)

Mỗi quyết định thiết kế quan trọng (Type A lớn hoặc Level 2 Propose) phải được lưu trữ thành file markdown tại `.agents/records/design-decisions/DDR-[MÃ].md` theo mẫu sau:

```markdown
# DDR-[MÃ]: [Tiêu đề Quyết định]

- **Trạng thái:** [Proposed | Approved | Rejected | Resolved]
- **Màn hình liên quan:** [Tên màn hình, ví dụ: Landing Page, Dashboard Điều vận]
- **Thành phần:** [Ví dụ: Header Navigation, Bento Grid, Table Bộ lọc]
- **Phân loại vấn đề:** [Type A / Type B / Type C / Type D]
- **Mức tự chủ áp dụng:** [Level 1 Autonomous | Level 2 Propose & Continue Safe | Level 3 Restricted]
- **Ngày ghi nhận:** [YYYY-MM-DD]

---

## 1. Bối cảnh & Quan sát thực tế
- Mô tả sự cố hoặc hiện tượng phát hiện trên Stitch hoặc trong code.
- **Bằng chứng kỹ thuật:** Viewport phát sinh lỗi, thông báo linter, kết quả đo đạc kích thước.

## 2. Các phương án cân nhắc
- **Phương án 1 (Giữ nguyên hoặc can thiệp tối thiểu):** Mô tả & Trade-off.
- **Phương án 2 (Đề xuất tối ưu):** Mô tả & Trade-off.

## 3. Quyết định lựa chọn & Lý do
- Nêu rõ quyết định cuối cùng được chọn.
- Lý do chọn phương án này dựa trên Thứ tự ưu tiên 7 cấp.

## 4. Kết quả kiểm chứng (Validation)
- Thử nghiệm trên các dải viewport (Desktop, Laptop, Tablet, Mobile).
- Kết quả chạy kiểm định 4 cổng (Typecheck, Lint, Test, Build).
- Tác động tới các màn hình khác trong hệ thống.
```
