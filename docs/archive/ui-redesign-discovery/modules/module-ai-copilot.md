# Đặc Tả Trợ Lý AI Copilot Không Gian Thời Gian Thực (MOD-06: AI Copilot)

Trợ lý **SmartParking AI Copilot** là thành phần công nghệ hiện đại được tích hợp trực tiếp trên giao diện portal của Tài xế, kết hợp giữa mô hình ngôn ngữ lớn (LLM) và dịch vụ vị trí không gian thời gian thực (Spatial Geolocation).

---

## 1. Cấu Trúc Thành Phần Giao Diện (`SCR-MOD-01: AiChatWidget`)

Component được triển khai tại file [`src/features/ai-copilot/components/AiChatWidget.tsx`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/features/ai-copilot/components/AiChatWidget.tsx) và nhúng ở cấp độ Layout.

```
┌────────────────────────────────────────────────────────┐
│             AI Copilot Floating Launcher               │
│    [ Icon Bot 🤖 ] (Hiệu ứng phát sáng Sparkles ✨)    │
└──────────────────────────┬─────────────────────────────┘
                           │ (Bấm để mở)
                           ▼
┌────────────────────────────────────────────────────────┐
│            Cửa Sổ Trò Chuyện (Chat Window)             │
│ ┌────────────────────────────────────────────────────┐ │
│ │ Header: SmartParking AI Copilot  [x] Đóng          │ │
│ ├────────────────────────────────────────────────────┤ │
│ │ Lịch sử tin nhắn:                                  │ │
│ │ • Bot: "Xin chào! Tôi có thể hỗ trợ bạn tìm bãi..." │ │
│ │ • User: "Tìm bãi xe container gần đây"            │ │
│ │ • Bot: Trả lời + [Thẻ Bãi Xe Gợi Ý (Interactive)] │ │
│ │     ┌────────────────────────────────────────────┐ │ │
│ │     │ Bãi Xe Logistics Đình Vũ                   │ │ │
│ │     │ 📍 Cách 2.4 km • Còn 6 slot container      │ │ │
│ │     │ 💰 45.000 đ/h • ★ 4.9                     │ │ │
│ │     │ [ Đặt chỗ ngay ➔ ]                        │ │ │
│ │     └────────────────────────────────────────────┘ │ │
│ ├────────────────────────────────────────────────────┤ │
│ │ Quick Prompt Chips:                                │ │
│ │ [Tìm bãi gần tôi] [Quy định cọc 10p] [Đỗ quá giờ] │ │
│ ├────────────────────────────────────────────────────┤ │
│ │ Input: [Nhập câu hỏi của bạn...]          [Gửi ➔]  │ │
│ └────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

---

## 2. Các Năng Lực Nghiệp Vụ Cốt Lõi Của Trợ Lý AI

### 2.1. Tự Động Thu Thập Tọa Độ Không Gian (Spatial Awareness)
- Khi tài xế bấm nút "Gửi", widget kích hoạt `navigator.geolocation.getCurrentPosition`:
  - Lấy `userLat` (vĩ độ) và `userLon` (kinh độ) với timeout 3000ms.
  - Nếu tài xế không cấp quyền vị trí, hệ thống vẫn gửi câu hỏi văn bản bình thường mà không bị crash.
- Dữ liệu tọa độ được gửi kèm câu hỏi qua `POST /api/v1/ai/chat` lên dịch vụ `ai-service`.

### 2.2. Trả Về Thẻ Bãi Đỗ Tương Tác (Suggested ParkingLot Cards)
- Khi câu hỏi liên quan đến tìm bãi đỗ xe, câu trả lời của AI trả về mảng `suggestedLots`:
  ```typescript
  export interface SuggestedParkingLot {
    id: number
    name: string
    address: string
    distanceKm?: number
    availableSlots?: number
    pricePerHour?: number
    rating?: number
  }
  ```
- Mỗi bãi xe được render thành một danh thiếp thu nhỏ (Card) có nhãn khoảng cách, số slot trống, mức giá và **nút bấm trực tiếp "Xem chi tiết & Đặt chỗ"** dẫn tài xế sang `SCR-016: ParkingDetailPage`.

### 2.3. Giải Đáp Chính Sách Hệ Thống (Policy & FAQ)
- Tích hợp 3 nút câu hỏi nhanh (Quick Prompts):
  1. *"Tìm bãi xe ô tô còn chỗ gần tôi"* (Tìm kiếm theo GPS).
  2. *"Quy định giữ chỗ 10 phút thế nào?"* (Giải thích cơ chế Hold TTL 10m và hoàn cọc).
  3. *"Đỗ quá giờ thì bị tính phí ra sao?"* (Giải thích hệ số phụ trội quá giờ `overtimeHourlyRate`).
- Tin nhắn trả về có gắn nhãn nguồn tài liệu tham chiếu (ví dụ: `[Nguồn: Chính sách SmartTruck]`).

---

## 3. Các Trạng Thái Giao Diện Của Widget

1. **Minimized State:** Nút tròn nổi kích thước 56px x 56px, nền màu Teal `#0f766e`, có badge chấm xanh biểu thị trạng thái online.
2. **Open / Expanded State:** Cửa sổ kích thước 380px x 540px (hoặc full-screen trên mobile màn hình hẹp), có thanh cuộn tự động trôi về tin nhắn mới nhất (`scrollIntoView`).
3. **Thinking / Loading State:** Hiển thị 3 dấu chấm nhảy động (Typing indicator) khi chờ phản hồi từ AI server.
4. **Offline / Error Fallback:** Nếu mất mạng hoặc API lỗi, hiển thị thông báo nhẹ nhàng: *"Hệ thống đang bận, bạn vui lòng sử dụng chức năng tìm kiếm trên bản đồ hoặc thử lại sau."*
