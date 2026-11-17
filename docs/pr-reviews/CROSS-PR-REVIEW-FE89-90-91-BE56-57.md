# Báo Cáo Đánh Giá Kỹ Thuật Toàn Diện (Cross-PR Review) 5 PRs Trọng Yếu

> **Dự án:** `SmartParkingHub` (`smart-parking-app-v2` & `smart-parking-service-microservice`)  
> **Tiêu chuẩn áp dụng:** `ak-review-pr v3.0.0` (19-Step Systematic Workflow, Anti-AI Slop, React/TS & Spring Boot/Java Adapters)  
> **Thời điểm rà soát:** 2026-11-17T08:58:00+07:00  
> **Phạm vi rà soát:** 5 PRs liên kết chặt chẽ (3 Frontend + 2 Backend)

---

## 1. Bảng Tổng Hợp Đánh Giá Từng PR (Per-PR Summary Table)

| PR | Nhánh (Head) | Mục tiêu chính | Files / Churn | Trạng thái CI | Quyết định (Verdict) |
| :--- | :--- | :--- | :---: | :---: | :---: |
| [**FE #89**](https://github.com/smart-parking-hub/smart-parking-app-v2/pull/89) | `feat/gate-final-payment` (`f629f24`) | Bỏ QR PayOS tự chế, polling trạng thái thanh toán cổng thực tế từ server, gửi `amountDue` khi thu tiền mặt | 10 files<br/>`+274 / -199` | ✅ Vercel: PASS<br/>✅ Quality Gate: PASS | ✅ **APPROVE** |
| [**FE #90**](https://github.com/smart-parking-hub/smart-parking-app-v2/pull/90) | `feat/vehicle-current-parking` (`486f3a7`) | Hiển thị bãi đỗ hiện tại, địa chỉ, vị trí ô và trạng thái đỗ (PARKING / OVERTIME) trên bảng quản lý đội xe | 9 files<br/>`+267 / -12` | ✅ Vercel: PASS<br/>✅ Quality Gate: PASS | ✅ **APPROVE** |
| [**FE #91**](https://github.com/smart-parking-hub/smart-parking-app-v2/pull/91) | `fix/quick-book-payment-ticket` (`fab4d92`) | Tối ưu layout modal đặt nhanh (680px), xử lý lỗi 409 trùng xe, hiển thị vé QR check-in xác nhận | 14 files<br/>`+506 / -178` | ✅ Vercel: PASS<br/>✅ Quality Gate: PASS | ✅ **APPROVE** |
| [**BE #56**](https://github.com/smart-parking-hub/smart-parking-service-microservice/pull/56) | `feat/gate-final-payment` (`bbea946`) | Điều phối quyết toán cổng đa kênh (Tiền mặt & PayOS), chống race condition/double payment | 39 files<br/>`+880 / -23` | ✅ Build & Test: PASS | ✅ **APPROVE** |
| [**BE #57**](https://github.com/smart-parking-hub/smart-parking-service-microservice/pull/57) | `fix/vehicle-booking-conflicts` (`7256f11`) | Chặn đặt trùng lịch cùng 1 xe (HTTP 409 CONFLICT) dưới khóa tuần tự `VEHICLE:<id>` | 6 files<br/>`+304 / -6` | ❌ Build: FAILED *(Flaky test ở common-library)* | ⚠️ **REQUEST CHANGES / FIX CI** |

---

## 2. Sơ Đồ Kiến Trúc & Mối Liên Hệ Giữa 5 PRs (System Dependency Matrix)

5 PRs này không hề rời rạc mà cùng cấu thành **toàn bộ vòng đời khép kín của xe trong hệ thống**:

```
                  ┌────────────────────────────────────────┐
                  │          TÀI XẾ TẠO ĐẶT CHỖ            │
                  │   (FE #91 Modal Đặt Nhanh / Compact)   │
                  └──────────────────┬─────────────────────┘
                                     │
                        POST /api/v1/bookings
                                     ▼
                  ┌────────────────────────────────────────┐
                  │       KIỂM TRA XUNG ĐỘT LỊCH XE        │
                  │ (BE #57: Chặn đặt trùng xe - HTTP 409) │
                  └──────────────────┬─────────────────────┘
                                     │ (Nếu trùng lịch -> FE #91 giữ form & báo lỗi)
                                     │ (Nếu hợp lệ -> Đặt thành công & Cọc)
                                     ▼
                  ┌────────────────────────────────────────┐
                  │        XE CHECK-IN VÀO BÃI ĐỖ          │
                  │ (Trạng thái: PARKING hoặc OVERTIME)    │
                  └──────────┬───────────────────┬─────────┘
                             │                   │
                             ▼                   ▼
    ┌───────────────────────────────┐     ┌───────────────────────────────┐
    │     THEO DÕI XE TẠI BÃI       │     │     XE RA CỔNG & THANH TOÁN   │
    │  (FE #90: Bảng Quản Lý Đội Xe │     │ (FE #89 Polling cổng Merchant │
    │   hiển thị Bãi / Ô / Trạng    │     │  & BE #56 Điều phối Tiền mặt/ │
    │   thái đỗ tức thời)           │     │  PayOS chống thanh toán kép)  │
    └───────────────────────────────┘     └──────────────┬────────────────┘
                                                         │
                                                         ▼
                                          ┌───────────────────────────────┐
                                          │        HOÀN TẤT LƯỢT ĐỖ       │
                                          │  (COMPLETED - Xe được giải    │
                                          │   phóng, sẵn sàng đặt mới)    │
                                          └───────────────────────────────┘
```

---

## 3. Phân Tích Kỹ Thuật Chi Tiết Từng Cụm Tính Năng

### 3.1. Cụm Quyết Toán Tại Cổng: FE #89 & BE #56 (`feat/gate-final-payment`)
- **Vấn đề cốt lõi trước đây (ở PR #87):**
  - Frontend tự render mã QR PayOS bằng cách ghép chuỗi URL (`https://pay.payos.vn/web/checkout?code=...`).
  - Nút *"Đã nhận thanh toán QR"* thực chất lại gọi endpoint thu tiền mặt `confirmCashPayment`!
  - Lỗi nguy hiểm: Nếu tài xế quét chuyển khoản thật, nhưng tiền chưa vào tài khoản hoặc bị trễ, nhân viên bấm nút sẽ ghi nhận là đã thu tiền mặt, gây sai lệch sổ cái tài chính nghiêm trọng.
- **Giải pháp chuẩn hóa trong FE #89 & BE #56:**
  - **BE #56:** Xây dựng `GateSettlementCoordinator` và mở rộng `InternalPaymentConfirmationController`. Bổ sung trường `finalPaymentMethod` (`CASH` hoặc `PAYOS`), `finalPaymentAmount`, `finalPaymentReference` vào `Booking` và `BookingDto`. Khi tài xế quét PayOS trên điện thoại cá nhân, Payment Service ghi nhận và xác nhận thanh toán trực tiếp. Khi nhân viên thu tiền mặt, endpoint yêu cầu truyền bắt buộc `amount: amountDue`. Cả hai kênh được khóa tuần tự, ngăn chặn hoàn toàn race condition nếu tài xế vừa bấm chuyển khoản PayOS đúng lúc nhân viên bấm nút tiền mặt.
  - **FE #89:** Xóa bỏ hoàn toàn mã QR PayOS tự tạo và nút bấm xác nhận QR giả. Tại cổng, màn hình quét mã của Merchant hiển thị số tiền còn nợ (`amountDue`) và thiết lập **Polling ngầm mỗi 3 giây** tới `/api/v1/merchant/bookings/{id}` với `AbortSignal`:
    - Khi tài xế hoàn tất PayOS trên thiết bị của họ, màn hình cổng tự động phát hiện `finalPaymentMethod === 'PAYOS'` và báo thành công tức thì.
    - Nếu tài xế chọn trả tiền mặt, nhân viên nhấn *"Xác nhận thu tiền mặt"*, gửi payload `{ bookingCode, parkingLotId, amount: amountDue }`.
    - Khi đóng popup hoặc chuyển sang quét xe khác, observer cũ lập tức được hủy (unmount), tránh rò rỉ trạng thái.

---

### 3.2. Cụm Đặt Chỗ & Chặn Trùng Lịch: FE #91 & BE #57
- **Vấn đề cốt lõi:**
  - Trước đây, hệ thống cho phép cùng một phương tiện (`vehicleId`) tạo nhiều booking trùng khoảng thời gian tại các bãi khác nhau, hoặc xe đang đỗ (`PARKING`, `OVERTIME`) vẫn có thể đặt thêm chỗ ở nơi khác.
- **Giải pháp trong BE #57:**
  - Áp dụng khóa tuần tự cấp phương tiện `holdPolicyStore.lock("VEHICLE:" + vehicleId)`.
  - Hàm `hasScheduleConflict(...)` kiểm tra toán học khoảng thời gian `[start, end)`:
    - Chặn các booking giao nhau với trạng thái `PENDING_PAYMENT`, `PENDING_CHECKIN`.
    - Chặn các booking với xe đang `PARKING`, `OVERTIME`, `AWAITING_FINAL_PAYMENT` cho đến khi lượt đỗ hiện tại thực sự kết thúc.
    - Cho phép các lượt nối tiếp liền kề: ví dụ lượt 1 kết thúc lúc 12:00, lượt 2 bắt đầu lúc 12:00.
    - Khi xung đột, trả về mã HTTP `409 CONFLICT` kèm thông báo: *"Xe này đã có booking trùng thời gian. Vui lòng chọn thời gian khác hoặc hoàn tất lượt đỗ hiện tại."*
- **Sự phối hợp trong FE #91:**
  - Tối ưu kích thước modal đặt nhanh lên tối đa 680px, phân cấp thị giác rõ ràng (PayOS là phương thức chính, Ví tài xế gọn gàng bên dưới).
  - Bắt lỗi HTTP 409 từ BE #57: Không phá hỏng form đặt chỗ, giữ nguyên ngày giờ và thông tin xe đã chọn để tài xế có thể đổi giờ hoặc chọn xe khác dễ dàng.
  - Thẻ `BookingCheckinTicket` hiển thị QR xác nhận sau khi cọc thành công, có tính năng sao chép mã và tải ảnh PNG.

---

### 3.3. Cụm Quản Lý Đội Xe: FE #90 (`feat/vehicle-current-parking`)
- **Tính năng bổ sung:**
  - Trên màn hình danh sách xe (`/vehicles`), bổ sung cột **"Bãi hiện tại"** hiển thị: Tên bãi đỗ, địa chỉ đầy đủ, mã ô đỗ vật lý.
  - Các huy hiệu trạng thái vận hành: **"Đang đỗ"** (xanh dương - `PARKING`), **"Đỗ quá giờ"** (đỏ cảnh báo - `OVERTIME`), và **"Không đỗ tại bãi"** (xám).
  - Tự động poll mỗi 15 giây qua TanStack Query.
- **Mối liên hệ tương hỗ:**
  - Khi tài xế bị BE #57 chặn đặt chỗ với lỗi 409, họ chỉ cần vào `/vehicles` là thấy ngay xe của mình đang ở bãi nào, tình trạng đỗ ra sao.
  - Khi xe rời cổng qua FE #89 / BE #56, trạng thái trong danh sách xe lập tức cập nhật thành "Không đỗ tại bãi".

---

## 4. Điểm Cần Lưu Ý Đặc Biệt (Critical Finding on BE #57 CI)

### Phát hiện F-BE57-01: Lỗi CI GitHub Actions trên PR #57
- **Mô tả:** Check run `build` trên PR #57 kết thúc với trạng thái `failure` tại commit `7256f11`.
- **Kết quả điều tra chuyên sâu của chúng tôi:**
  1. Toàn bộ logic mới trong `booking-service` (bao gồm 25 kịch bản tích hợp chống xung đột lịch `VehicleBookingConflictIntegrationTest`) **đều PASS 100%** (197 passed, 4 skipped, 0 failed).
  2. Lỗi thực sự khiến `./gradlew build` bị dừng nằm ở test case `TransactionalEventOutboxTest.brokerFailureRetainsEventWithBackoffAndReplayUsesTheOriginalEventId` thuộc module `common-library`:
     ```
     TransactionalEventOutboxTest > brokerFailureRetainsEventWithBackoffAndReplayUsesTheOriginalEventId() FAILED
     expected: "FAILED" but was: "PENDING"
     at TransactionalEventOutboxTest.java:96
     ```
  3. **Nguyên nhân gốc rễ (Root Cause):** Đây là một **Flaky Test do lệch thời gian (Timing Race Condition)** trong môi trường H2:
     - Lệnh test thực hiện: `UPDATE admin_event_outbox SET attempts = 4, next_attempt_at = CURRENT_TIMESTAMP`
     - Ngay sau đó gọi `relay.relay()`, bên trong truy vấn: `WHERE status = 'PENDING' AND next_attempt_at <= ?` (với `?` là `Timestamp.from(Instant.now())`).
     - Khi đồng hồ microsecond của database H2 chạy nhanh hơn hoặc lệch một vài mili-giây so với `Instant.now()` trên JVM, điều kiện `<=` trả về 0 bản ghi, khiến `attempts` không tăng lên 5 và trạng thái chưa chuyển thành `FAILED`.
- **Khuyến nghị hành động:**
  - PR #57 không hề chỉnh sửa code của `common-library`. Tuy nhiên để đảm bảo tiêu chuẩn CI/CD nghiêm ngặt trước khi merge, tác giả `@lochuynh22` cần re-trigger lại GitHub Actions (hoặc chỉnh nhẹ điều kiện test outbox để tránh flakiness: ví dụ `next_attempt_at = CURRENT_TIMESTAMP - 1 SECOND`) để CI đạt trạng thái xanh hoàn toàn.

---

## 5. Trình Tự Hợp Nhất Đề Xuất (Recommended Merge Order)

Để đảm bảo không xảy ra xung đột hợp đồng API giữa Frontend và Backend, đề xuất tiến hành merge theo 3 bước:

```
[Bước 1: Merge Backend Core]
       ├── BE #56 (feat/gate-final-payment) -> Sẵn sàng merge ngay (CI đã PASS)
       └── BE #57 (fix/vehicle-booking-conflicts) -> Merge sau khi re-run CI xanh

[Bước 2: Merge Frontend Đồng Hành]
       ├── FE #89 (fix/merchant gate settlement) -> Merge ngay sau BE #56
       └── FE #91 (fix/quick-book-payment-ticket) -> Merge ngay sau BE #57

[Bước 3: Merge Độc Lập]
       └── FE #90 (feat/vehicle-current-parking) -> Có thể merge bất kỳ lúc nào (độc lập)
```
