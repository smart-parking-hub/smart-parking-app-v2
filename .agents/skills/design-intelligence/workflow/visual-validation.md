# Workflow Phase 3: Visual & Functional Validation Gates

Sau khi viết xong mã nguồn, Agent **không được phép** tuyên bố hoàn thành ngay mà phải vượt qua 4 cổng kiểm thử kỹ thuật và bảng đối chiếu trực quan:

---

## 1. Bốn cổng kiểm thử kỹ thuật bắt buộc (Zero Error & Zero Warning)

```bash
# Cổng 1: TypeScript Strict Typecheck
npm run typecheck
# Yêu cầu: 0 lỗi type (Exit code 0)

# Cổng 2: ESLint Flat Config
npm run lint
# Yêu cầu: 0 errors, 0 warnings (Exit code 0)

# Cổng 3: Vitest Unit & Component Tests
npm run test
# Yêu cầu: 100% tests passed (Exit code 0)

# Cổng 4: Production Build
npm run build
# Yêu cầu: Vite bundle thành công vào dist/ mà không có lỗi cảnh báo module
```

---

## 2. Bảng kiểm tra chất lượng hiển thị đa màn hình (Responsive Matrix)

Agent phải xác nhận giao diện hoạt động hoàn hảo trên ít nhất 4 dải độ phân giải:
- [ ] **Large Desktop (1920x1080):** Layout căn giữa trong `max-w-310`, không bị dãn bè ra hai bên màn hình.
- [ ] **Standard Laptop (1366x768 & 1280x800):** Header không bị rớt dòng, modal chân nút bấm hiển thị đầy đủ không bị tràn màn hình.
- [ ] **Tablet (768x1024):** Grid 4 cột chuyển thành 2 cột, bảng có thanh cuộn ngang mượt mà.
- [ ] **Mobile (375x667 & 390x844):** Cột chuyển thành 1 cột dọc, nút bấm full-width dễ chạm, không có horizontal scroll toàn trang.

---

## 3. Bảng kiểm tra tương tác người dùng (Interaction Checks)
- [ ] Con trỏ chuột chuyển thành `pointer` trên mọi nút bấm và thẻ clickable.
- [ ] Loại bỏ hoàn toàn các style khóa giao diện thừa từ Stitch HTML mẫu (như `style="cursor: grabbing; user-select: none;"`).
- [ ] Hỗ trợ đầy đủ phím `Tab` để di chuyển focus và `focus-visible:ring-2`.
- [ ] Trạng thái Loading có skeleton mượt mà, không làm giật nhảy layout khi dữ liệu về.
