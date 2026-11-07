# Screen Specification: SCR-004 PricingPage (Bảng giá dịch vụ)

---

## 1. SCREEN IDENTIFIER & CLASSIFICATION

- **Screen ID:** `SCR-004`
- **Screen Name:** Bảng giá dịch vụ & Gói giải pháp (Pricing Plans)
- **Module:** `MOD-01: Public Landing & Marketing Website`
- **Route URL:** `/pricing` (Định nghĩa tại [`AppRoutes.tsx:80`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L80))
- **Layout Type:** `LandingLayout` ([`LandingLayout.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/landing/components/LandingLayout.tsx))
- **Primary Component:** `smart-parking-app/src/features/landing/pages/PricingPage.tsx`
- **Sub-components:** `LandingNavbar`, `LandingFooter`, `framer-motion`
- **Access Role:** Public (Khách vãng lai, Doanh nghiệp vận tải, Chủ bãi)
- **Discovery Status:** `VERIFIED` (Mã nguồn đã kiểm tra đối chiếu)

---

## 2. BUSINESS PURPOSE & CONTEXT

### A. Business Objective
Minh bạch hóa mô hình kinh doanh và biểu phí dịch vụ của SmartTruck:
1. Thuyết phục tài xế cá nhân yên tâm sử dụng dịch vụ (nền tảng hoàn toàn miễn phí cho tài xế tìm kiếm bãi xe, chỉ trả phí đỗ xe cho chủ bãi).
2. Chào mời các doanh nghiệp vận tải có đội xe lớn sử dụng gói B2B (thanh toán tập trung theo công nợ, xuất hóa đơn VAT điện tử).
3. Công bố cơ chế hợp tác chia sẻ doanh thu theo tỷ lệ phần trăm chiết khấu (`Chiết khấu %`) cho chủ bãi tham gia mạng lưới.

### B. Target Users
- Tài xế cá nhân, Chủ doanh nghiệp vận tải hàng hóa.
- Chủ mặt bằng kinh doanh bãi đỗ xe.

### C. Entry Points
- Liên kết "Ưu đãi" hoặc "Bảng giá" từ `LandingFooter`.
- Các banner quảng bá và trang đích.

### D. Exit Points
- Gói Tài xế cá nhân: Nút "Đăng ký ngay" chuyển hướng tới `/register` (`SCR-011`).
- Gói Đội xe doanh nghiệp: Nút "Nhận báo giá" chuyển hướng tới `/company/contact` (`SCR-009`).
- Gói Chủ bãi đỗ: Nút "Đăng ký bãi đỗ" chuyển hướng tới `/register` (`SCR-011`).

---

## 3. UI STRUCTURE & LAYOUT

### A. Bố Cục Tổng Thể
- Container căn giữa (`max-w-max-width-driver mx-auto px-container-padding py-24`).
- Tiêu đề trung tâm và Lưới 3 cột thẻ giá (`grid md:grid-cols-3 gap-8`).

### B. Chi Tiết Các Gói Dịch Vụ

#### 1. Gói 1: Tài Xế Cá Nhân (Thẻ Trái)
- Thẻ nền trắng viền xám nhạt (`bg-surface border border-outline-variant rounded-3xl p-8`).
- Tiêu đề gói: `Tài Xế Cá Nhân`.
- Mức giá: `Miễn phí` (Font chữ lớn màu Teal đậm).
- Danh sách tính năng (Checklist icon `check`):
  - Tìm bãi đỗ trên bản đồ
  - Xem đánh giá và tiện ích
  - Đặt chỗ ngay lập tức
- CTA Button: `<Link to="/register">Đăng ký ngay</Link>` (Button viền mỏng màu primary).

#### 2. Gói 2: Đội Xe / Doanh Nghiệp (Thẻ Nổi Bật Trung Tâm)
- Thẻ màu xanh Teal chủ đạo, nâng cao hơn so với 2 thẻ bên cạnh (`transform md:-translate-y-4 shadow-xl`).
- Huy hiệu phía trên cùng: `Phổ biến nhất` (Màu cam `#FF6B00`, chữ trắng hoa in đậm).
- Tiêu đề gói: `Đội Xe / Doanh Nghiệp`.
- Mức giá: `Liên hệ`.
- Danh sách tính năng (Icon `check` màu trắng):
  - Mọi tính năng của Tài xế
  - Thanh toán công ty tập trung
  - Báo cáo chi phí xuất hóa đơn
- CTA Button: `<Link to="/company/contact">Nhận báo giá</Link>` (Button nền trắng chữ Teal đậm nổi bật).

#### 3. Gói 3: Chủ Bãi Đỗ (Thẻ Phải)
- Thẻ nền trắng viền xám nhạt tương tự gói 1.
- Tiêu đề gói: `Chủ Bãi Đỗ`.
- Mức giá: `Chiết khấu %`.
- Danh sách tính năng:
  - Phần mềm quản lý bãi đỗ
  - Tự động hóa thanh toán
  - Tiếp cận mạng lưới 10,000+ tài xế
- CTA Button: `<Link to="/register">Đăng ký bãi đỗ</Link>` (Button viền mỏng màu primary).

---

## 4. INTERACTION & DATA SPECIFICATION

- **Tương tác:** Mỗi thẻ được áp dụng animation `framer-motion` với độ trễ so le (`delay: 0.1s`, `0.2s`, `0.3s`).
- **Dữ liệu:** Dữ liệu tĩnh trên code React, không gọi API backend.

---

## 5. DISCREPANCIES & REDESIGN RECOMMENDATIONS

| Vấn đề hiện tại | Đánh giá UX / Kinh doanh | Khuyến nghị thiết kế lại |
|---|---|---|
| **Mức giá "Chiết khấu %" và "Liên hệ" còn mơ hồ** | Người dùng không biết chính xác mức chiết khấu là bao nhiêu (5%, 8% hay 15%), dễ gây ngần ngại cho chủ bãi khi cân nhắc đăng ký. | Công bố rõ ràng dải chiết khấu minh bạch (ví dụ: "Chiết khấu từ 5% - 8% trên mỗi giao dịch thành công, không phí duy trì hàng tháng"). |
| **Thiếu Phần Câu Hỏi Thường Gặp Về Thanh Toán (Pricing FAQ)** | Các câu hỏi quan trọng như: "Tiền đặt cọc được hoàn lại thế nào?", "Hóa đơn VAT xuất trong bao lâu?", "Bao lâu thì chủ bãi nhận được tiền đối soát?" chưa được giải đáp. | Bổ sung phần Accordion FAQ trực tiếp bên dưới 3 bảng giá để tăng tỷ lệ chuyển đổi. |
