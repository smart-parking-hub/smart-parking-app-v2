# Design Decision-Making & Conflict Resolution Hierarchy

Khi có sự mâu thuẫn giữa Mockup Stitch, Yêu cầu nghiệp vụ, Quy chuẩn hệ thống và Trực giác thiết kế, Agent phải tuân thủ nghiêm ngặt **Thứ tự ưu tiên 7 cấp (Strict Priority Order)**:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Business Rules, Security & Permission Contracts (CAO NHẤT)│
├─────────────────────────────────────────────────────────────┤
│ 2. Quyết định rõ ràng đã được Người dùng phê duyệt          │
├─────────────────────────────────────────────────────────────┤
│ 3. Design Intent đã được xác lập của màn hình                │
├─────────────────────────────────────────────────────────────┤
│ 4. Design System của dự án (Tokens, Tailwind v4 scale)      │
├─────────────────────────────────────────────────────────────┤
│ 5. Patterns UI nhất quán đã có trong sản phẩm CRM           │
├─────────────────────────────────────────────────────────────┤
│ 6. Quy ước UX/A11y quốc tế phổ biến (WCAG, Human Interface) │
├─────────────────────────────────────────────────────────────┤
│ 7. Suy luận hoặc sở thích cá nhân của Agent (THẤP NHẤT)     │
└─────────────────────────────────────────────────────────────┘
```

---

## 1. Ví dụ giải quyết xung đột thực tế

### Tình huống 1: Stitch thiếu nút kiểm tra quyền
- **Xung đột:** Mockup Stitch không vẽ nút "Khóa ô đỗ khẩn cấp", nhưng Backend và Legacy screen đều có chức năng này dành riêng cho vai trò `OPERATOR`.
- **Giải quyết:** Cấp 1 (Nghiệp vụ & Quyền) > Cấp 3 (Stitch).  
  $\rightarrow$ **Agent giữ lại chức năng**, tạo nút với quyền `OPERATOR`, áp dụng phong cách thiết kế của hệ thống.

### Tình huống 2: Stitch dùng màu tùy tiện không thuộc Design System
- **Xung đột:** Mockup Stitch dùng mã màu hex ngẫu nhiên `#fa8c16` thay vì token `#F97316` (`brand-orange`) của dự án.
- **Giải quyết:** Cấp 4 (Design System) > Cấp 7 (Suy luận).  
  $\rightarrow$ **Agent tự động map về token `brand-orange`** chuẩn của dự án.

### Tình huống 3: Header Stitch có 10 mục menu gây rớt dòng ở laptop
- **Xung đột:** Cấp 3 (Ý đồ có 10 mục menu) xung đột với Cấp 6 (Trải nghiệm bị vỡ dòng tại 1366px).
- **Giải quyết:** 
  1. Kiểm tra Cấp 4: Giảm `gap` và điều chỉnh padding (Level 1 Autonomous).
  2. Nếu vẫn tràn: Áp dụng Level 2 Propose (chuyển 3 mục cuối vào `More...` dropdown), báo cáo theo cơ chế **Continue Safe**.

---

## 2. Bản ghi quyết định thiết kế (Design Decision Record - DDR)
Mọi quyết định thuộc Level 2 hoặc điều chỉnh Type A đáng chú ý phải được ghi vào nhật ký:
- Vị trí: `.agents/records/design-decisions/`
- Định dạng: Đặt mã `DDR-XXX-[tên-thành-phần].md`
- Mục tiêu: Giữ sự nhất quán giữa các màn hình, không giải quyết cùng một vấn đề theo hai cách trái ngược nhau.
