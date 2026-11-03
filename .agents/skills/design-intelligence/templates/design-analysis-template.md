# Template: Design Analysis Brief

```markdown
# DESIGN ANALYSIS BRIEF: [Tên Màn Hình]

## 1. Thông tin chung
- Screen Name: [Tên màn hình]
- Route: [Ví dụ: /dashboard, /lots, /reconciliation]
- Existing Module: [Module nghiệp vụ]
- Source References: [Link Stitch HTML, Figma hoặc Screenshots]

## 2. Phân tích Design Intent
- Vai trò chính của màn hình: [Mô tả ngắn gọn]
- Primary CTA: [Nút hành động chính]
- Secondary Actions: [Các thao tác phụ]
- Layout Archetype: [Top-Nav / Sidebar Layout / Split-Screen / Bento Grid]
- Target Container: max-w-310 (1240px)

## 3. Khảo sát Capability & Legacy Parity
| Chức năng / Trường dữ liệu | Có trong Stitch? | Có trong Backend/Legacy? | Hành động của Agent |
| :--- | :--- | :--- | :--- |
| [Trường A] | Có | Có | Triển khai bình thường |
| [Nút Phân quyền B] | Không | Có (Bắt buộc) | Bổ sung theo chuẩn RBAC |
| [Bộ lọc nâng cao C] | Có | Đang thiếu API | Triển khai UI + Mock API |

## 4. Phát hiện bất thường ban đầu
- Type A (Lỗi kỹ thuật): [Liệt kê các lỗi CSS/layout thấy trước]
- Type B (Chủ ý thiết kế): [Các điểm phá cách cần bảo toàn]
- Type C (Lỗi UX tiềm ẩn): [Các vùng có nguy cơ nghẽn hoặc vỡ dòng]
- Type D (Chưa rõ thông tin): [Các điểm cần làm rõ]
```
