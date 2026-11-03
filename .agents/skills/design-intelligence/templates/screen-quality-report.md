# Template: Screen Quality & Acceptance Scorecard

Dùng để chấm điểm chất lượng và xuất báo cáo nghiệm thu cuối cùng cho một màn hình:

```markdown
# BÁO CÁO NGHIỆM THU CHẤT LƯỢNG MÀN HÌNH: [TÊN MÀN HÌNH]

## 1. Kết quả kiểm định 4 Cổng Kỹ Thuật
- [x] **TypeScript Strict:** 0 Errors (`npm run typecheck`)
- [x] **ESLint 9 Flat Config:** 0 Errors, 0 Warnings (`npm run lint`)
- [x] **Vitest Unit/Component:** 100% Passed (`npm run test`)
- [x] **Vite Production Build:** Success trong [X.Xs] (`npm run build`)

---

## 2. Bảng Chấm Điểm 10 Tiêu Chí Thiết Kế (Thang điểm 0..4)

| STT | Tiêu chí đánh giá | Điểm (0..4) | Bằng chứng quan sát |
| :---: | :--- | :---: | :--- |
| 1 | Visual Hierarchy (Phân cấp thị giác) | 4/4 | Tiêu đề, CTA chính, số liệu nổi bật rõ ràng |
| 2 | Spacing & Alignment (Khoảng cách & Gióng hàng) | 4/4 | Chuẩn hệ 4px, không lệch tâm, card đồng đều |
| 3 | Color & Token Consistency (Đồng nhất màu sắc) | 4/4 | 100% token brand-navy, brand-orange, slate |
| 4 | Layout Integrity (Tính toàn vẹn bố cục) | 4/4 | Container max-w-310, tỷ lệ phân chia cân xứng |
| 5 | Responsive Adaptability (Đa màn hình) | 4/4 | Hoàn hảo từ 375px đến 1920px, 0 horizontal scroll |
| 6 | Interaction Clarity (Rõ ràng tương tác) | 4/4 | Con trỏ pointer, hover, active, disabled đầy đủ |
| 7 | Accessibility (Khả năng tiếp cận WCAG AA) | 4/4 | Có aria-hidden, aria-label, focus-visible:ring-2 |
| 8 | Information Hierarchy (Khả năng quét tin) | 4/4 | Người dùng quét được thông tin chính trong 3s |
| 9 | Information Density (Mật độ thông tin) | 4/4 | Cân bằng tải nhận thức, dữ liệu phụ giấu khéo léo |
| 10 | System Consistency (Đồng bộ hệ thống) | 4/4 | Đồng nhất nút bấm, bảng, badge với toàn CRM |

**TỔNG ĐIỂM THIẾT KẾ:** **[XX] / 40**

---

## 3. Điều Kiện Chặn Nghiệp Vụ (Hard Blockers)
- [x] **Business & RBAC Parity:** **PASS** (100% tính năng, trường dữ liệu, quyền hạn được bảo toàn).
- [x] **Zero Error & Zero Warning:** **PASS** (Không có lỗi đỏ, không có cảnh báo vàng).
- [x] **Responsive Safety:** **PASS** (Không bị tràn màn hình mobile).

---

## 4. Quyết Định Nghiệm Thu
- [ ] **ĐẠT TIÊU CHUẨN (Approved for Production)**
- [ ] **CẦN ĐIỀU CHỈNH THÊM (Needs Revisions)**
```
