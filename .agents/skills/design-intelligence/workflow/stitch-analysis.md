# Workflow Phase 1: Stitch Intake & Pre-Code Analysis

Trước khi gõ bất kỳ dòng code React hay Tailwind nào, Agent bắt buộc phải thực hiện các bước phân tích sau:

---

## 1. Đọc và bóc tách mã nguồn Stitch
- [ ] **Đọc toàn bộ file HTML & CSS:** Không đọc lướt, không chia nhỏ rồi code vội từng khúc.
- [ ] **Nhận diện layout vĩ mô:**
  - Cấu trúc trang là gì? (Landing Page, Top-Nav Layout, Sidebar Layout, hay Fullscreen Dashboard?)
  - Container chính có độ rộng bao nhiêu? (Ví dụ: `max-w-[1240px]` $\rightarrow$ map sang `max-w-310` của Tailwind v4).
- [ ] **Nhận diện hệ thống icon:**
  - Stitch đang dùng icon từ Google Material Symbols hay CDN nào?
  - Lập danh sách đối chiếu sang thư viện `lucide-react` đã cài sẵn.
- [ ] **Nhận diện các khối tĩnh (Static Mocks):**
  - Chỗ nào trong HTML là dữ liệu tĩnh cần biến thành mảng động (`.map(...)`)?
  - Chỗ nào là form cần gắn `react-hook-form`?
  - Chỗ nào là bảng cần phân trang và loading skeleton?

---

## 2. Đối chiếu hợp đồng Backend & Màn hình cũ (Capability Parity)
- [ ] Mở source code Backend hoặc API Contracts tương ứng.
- [ ] Mở màn hình Legacy (nếu có) để tìm các logic ngầm:
  - Có logic lọc dữ liệu theo quyền hạn không?
  - Có logic xuất Excel/PDF không?
  - Có các cột dữ liệu quan trọng mà Stitch quên vẽ không?
- [ ] Lập **Capability Parity Matrix** (Bảng đối chiếu 100% tính năng).

---

## 3. Tạo phiếu phân tích thiết kế (Design Analysis Brief)
Điền đầy đủ thông tin vào mẫu [`templates/design-analysis-template.md`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app-v2/.agents/skills/design-intelligence/templates/design-analysis-template.md) trước khi chuyển sang bước viết mã.
