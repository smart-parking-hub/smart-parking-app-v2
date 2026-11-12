# Báo Cáo Đánh Giá Kỹ Thuật Pull Request #68

> **Dự án:** `smart-parking-app-v2`  
> **Tiêu chuẩn áp dụng:** `ak-review-pr v3.0.0` (Anti-AI Slop, Finding Standard & Safety Engine)  
> **Thời điểm đánh giá:** 2026-11-12T21:22:00+07:00  
> **Quyết định đề xuất:** ✅ **APPROVE WITH RECOMMENDATIONS (Phê duyệt kèm khuyến nghị kiến trúc)**

---

## 1. Thông Tin Tổng Quan Pull Request

| Thuộc tính | Chi tiết |
| :--- | :--- |
| **Pull Request** | [#68 - feat(merchant-bookings): redesign bookings table, detail modal, custom select and cross-lot counts](https://github.com/smart-parking-hub/smart-parking-app-v2/pull/68) |
| **Tác giả** | `@HoQuocKhai` |
| **Nhánh nguồn (Head)** | `feat/merchant-bookings` (`1b69307`) |
| **Nhánh đích (Base)** | `main` (`2e8d638`) |
| **Phạm vi thay đổi** | 21 files (`+2,972` dòng / `-240` dòng) |
| **CI / Quality Gate** | ✅ Vercel Preview (Success), ✅ Frontend Quality Gate & Validation (Success) |
| **Mergeable** | `True` (Không có conflict với nhánh base) |

---

## 2. Tóm Tắt Đánh Giá (Executive Summary)

PR #68 là một bản nâng cấp toàn diện và có chất lượng kỹ thuật rất xuất sắc cho phân hệ quản lý đơn đặt chỗ của Chủ bãi (**SCR-034: Merchant Bookings Management** và **SCR-035: Merchant Booking Detail**):

1. **Tuân thủ xuất sắc kiến trúc 4 lớp:** Phân tách rành mạch thành `api/`, `components/`, `hooks/`, `pages/`, `schemas/`, `store/`, và `types/`.
2. **Tương thích ngược 100%:** File nguyên khối cũ `BookingsPages.tsx` (222 dòng) được tinh giản thành các re-export sạch sẽ từ thư mục `../bookings`, đảm bảo tất cả các router hay component khác trong dự án đang import từ đường dẫn cũ hoàn toàn không bị gãy vỡ (zero regression).
3. **Giải quyết triệt để lỗi định dạng thời gian Jackson Backend:** Bổ sung kiểu `ApiDateTimeValue` (`string | number[] | null | undefined`) và hàm phân tích cú pháp `parseBookingDateTime`, xử lý êm ái hiện tượng Spring Boot Jackson tuần tự hóa ngày giờ thành mảng số nguyên `[YYYY, MM, DD, HH, mm, ss]` thay vì chuỗi ISO.
4. **Tái sử dụng tối đa Design System cốt lõi:** Khác hoàn toàn với việc tự viết lại UI như ở PR #67, tác giả tái sử dụng chuẩn mực các UI Primitives có sẵn trong `@/shared/components/`:
   - `Select` (kèm biểu tượng tùy biến và hiển thị badge đếm số lượng).
   - `SearchField` (tích hợp phím tắt, debounce, nút clear).
   - `Badge` (mở rộng thêm các trạng thái `AWAITING_FINAL_PAYMENT`, `EXPIRED`, `REVIEWED`).
   - `Modal`, `Table`, `Skeleton`, `Toast`, `EmptyState`, `Alert`.
5. **Chất lượng kiểm thử tự động mẫu mực:** File `MerchantBookingsPage.test.tsx` (597 dòng) xây dựng 7 ca kiểm thử thực chất, bao phủ toàn diện từ phân quyền RBAC (`RequireRole`), validation form với Zod, bộ lọc URL query, bàn phím A11y (Escape modal), thao tác copy mã đơn và cơ chế phân trang.

**Vấn đề kiến trúc trọng tâm cần ghi nhận (Technical Debt):**
Do API backend `GET /api/v1/merchant/bookings` hiện tại chưa hỗ trợ tham số lọc trạng thái (`status`) và từ khóa (`keyword`), tác giả đã triển khai giải pháp lai (Hybrid Client/Server Pagination) bằng cách tải trước tối đa 500 bản ghi (`size=500`) qua `fetchMerchantBookingsSummarySafe` để tính toán số lượng đơn cho các tab (`ALL`, `PENDING_CHECKIN`, `PARKING`, `COMPLETED`) và phục vụ tìm kiếm nhanh phía client. Đây là giải pháp tình thế thông minh và hợp lý ở tầng Frontend để đáp ứng yêu cầu nghiệp vụ ngay lập tức, nhưng cần được theo dõi và lên kế hoạch chuyển giao cho Backend xử lý khi dữ liệu mở rộng.

---

## 3. Bảng Tổng Hợp Các Điểm Phát Hiện (Findings Summary)

| ID | Tiêu đề | Phân loại | Mức độ | Mức tin cậy | Độ ưu tiên | File ảnh hưởng |
| :---: | :--- | :---: | :---: | :---: | :---: | :--- |
| **F-01** | Truy vấn `summaryQuery` tải trước `size=500` bản ghi trên client (Giới hạn quy mô & Tải kép khi mount) | `scalability` / `architecture` | **Major** | High | **P2** | `merchantBookingsApi.ts#L47-L52`<br>`MerchantBookingsPage.tsx#L125-L160` |
| **F-02** | `listQuery` vẫn gửi request lên server khi người dùng chuyển trang trong chế độ lọc Client | `performance` / `efficiency` | **Minor** | High | **P3** | `MerchantBookingsPage.tsx#L96`<br>`useMerchantBookingsQuery.ts#L18-L30` |
| **F-03** | Trường hợp `summaryData` bị lỗi mạng, bộ lọc client bị thu hẹp vào 5 bản ghi của trang hiện tại | `ux` / `resilience` | **Minor** | Medium | **P3** | `MerchantBookingsPage.tsx#L162-L170` |
| **F-04** | Đảm bảo đồng bộ tham số URL giữa Modal chi tiết và màn hình Trạm quét QR (`SCR-027`) | `integration` | **Suggestion** | High | **P4** | `MerchantBookingDetailModal.tsx#L476` |

---

## 4. Chi Tiết Các Điểm Phát Hiện & Hướng Dẫn Tối Ưu

### 🟡 F-01: Truy vấn `summaryQuery` tải cứng `size=500` bản ghi (Architectural Trade-off)
* **Vị trí:** 
  - `src/features/merchant/bookings/api/merchantBookingsApi.ts` (Dòng 47–52)
  - `src/features/merchant/bookings/pages/MerchantBookingsPage.tsx` (Dòng 125–160)
* **Hiện tượng thực tế:**
  ```typescript
  // merchantBookingsApi.ts
  export async function fetchMerchantBookingsSummarySafe(
    parkingLotId: number | null,
    signal?: AbortSignal,
  ): Promise<MerchantBookingsSummaryData | null> {
    const params = { page: 0, size: 500 }
    if (typeof parkingLotId === 'number' && Number.isFinite(parkingLotId) && parkingLotId > 0) {
      params.parkingLotId = parkingLotId
    }
    const res = await apiClient.get('/api/v1/merchant/bookings', { params, signal })
    ...
  }
  ```
  Khi người dùng truy cập màn hình `/merchant/bookings`, Frontend đồng thời kích hoạt 2 request song song:
  1. `useMerchantBookingsListQuery(page, pageSize, effectiveLotId)`: Lấy 5 bản ghi đầu tiên để hiển thị bảng.
  2. `useMerchantBookingsSummaryQuery(effectiveLotId)`: Lấy 500 bản ghi để đếm số lượng cho các tab trạng thái và làm nguồn dữ liệu tìm kiếm client-side.
* **Nguyên nhân gốc rễ (Root Cause):**
  Đối chiếu mã nguồn Backend tại `smart-parking-microservice`:
  ```java
  // MerchantCheckInOutController.java
  @GetMapping("/bookings")
  @PreAuthorize("hasRole('MERCHANT')")
  public ResponseEntity<ApiResponse<PageResponse<BookingDto>>> getMerchantBookings(
          @AuthenticationPrincipal AuthenticatedUser user,
          @RequestParam(required = false) Long parkingLotId,
          @PageableDefault(size = 20) Pageable pageable) {
      PageResponse<BookingDto> page = bookingService.getMerchantBookings(user.getId(), parkingLotId, pageable);
      return ResponseEntity.ok(ApiResponse.success(page, "Lấy danh sách đặt chỗ thành công"));
  }
  ```
  Endpoint hiện hữu chỉ nhận `parkingLotId` và `pageable`, **hoàn toàn chưa có** `@RequestParam(required = false) String status` và `@RequestParam(required = false) String search`. Do đó Frontend bắt buộc phải tải dữ liệu về để tự xử lý.
* **Rủi ro & Đánh giá tác động:**
  - **Giới hạn 500 đơn:** Nếu một chủ bãi có trên 500 đơn đặt chỗ, các đơn từ thứ 501 trở đi sẽ không bao giờ xuất hiện trong kết quả tìm kiếm client và không được tính vào số lượng tab.
  - **Băng thông mạng & Bộ nhớ:** Với các bãi xe có lượng booking lớn, tải payload 500 entities chứa đầy đủ thông tin chi tiết trên thiết bị di động cấu hình yếu có thể gây tải nặng trong quá trình giải mã JSON.
* **Giải pháp đề xuất (Roadmap):**
  - **Ngắn hạn (Frontend - Chấp nhận PR):** Giữ nguyên cơ chế hiện tại vì `staleTime: 60000` (1 phút) và `gcTime: 300000` (5 phút) đã được cấu hình tốt, không gây spam server liên tục.
  - **Dài hạn (Backend Sprint kế tiếp):**
    1. Bổ sung `status` và `keyword` vào `GET /api/v1/merchant/bookings`.
    2. Tạo endpoint chuyên biệt siêu nhẹ `GET /api/v1/merchant/bookings/summary` chỉ trả về DTO đếm số lượng: `{ totalAll: number, pendingCheckin: number, parking: number, completed: number }`.

---

### 🟢 F-02: `listQuery` vẫn gửi request server khi đổi trang trong chế độ lọc Client
* **Vị trí:** `src/features/merchant/bookings/pages/MerchantBookingsPage.tsx` (Dòng 96) & `useMerchantBookingsQuery.ts` (Dòng 18–30)
* **Hiện tượng thực tế:**
  ```typescript
  // MerchantBookingsPage.tsx
  const listQuery = useMerchantBookingsListQuery(page, pageSize, effectiveLotId)
  ...
  const hasClientFilter = statusFilter !== 'ALL' || Boolean(normalizedKeyword)
  ```
  Khi `hasClientFilter === true` (người dùng đang chọn tab 'Đang đỗ' hoặc nhập từ khóa tìm kiếm), dữ liệu bảng hiển thị lấy từ mảng `filteredFullList` (cắt lát từ `summaryData`).
  Tuy nhiên, khi người dùng bấm chuyển sang trang 2 (`page = 1`), state `page` trong store thay đổi. Do `useMerchantBookingsListQuery` phụ thuộc vào `page` và luôn ở trạng thái `enabled: true`, TanStack Query sẽ kích hoạt request `GET /api/v1/merchant/bookings?page=1&size=5` lên server. Kết quả trả về của request này hoàn toàn bị bỏ qua không hiển thị ra màn hình.
* **Cách khắc phục khuyến nghị:**
  Tối ưu cờ `enabled` trong query hook:
  ```typescript
  // Trong MerchantBookingsPage.tsx hoặc useMerchantBookingsQuery.ts:
  export function useMerchantBookingsListQuery(
    page: number,
    size: number,
    parkingLotId: number | null,
    enabled = true,
  ) {
    return useQuery({
      queryKey: merchantBookingsQueryKeys.list(page, size, parkingLotId),
      queryFn: () => fetchMerchantBookingsApi({ page, size, parkingLotId }),
      enabled,
      staleTime: 15000,
    })
  }
  
  // Trong MerchantBookingsPage.tsx:
  const listQuery = useMerchantBookingsListQuery(
    page,
    pageSize,
    effectiveLotId,
    !hasClientFilter, // ⚡ Tắt gọi API phân trang ngầm khi đang lọc phía client
  )
  ```

---

### 🟢 F-03: Xử lý dự phòng (Graceful Degradation) khi `summaryData` lỗi kết nối
* **Vị trí:** `src/features/merchant/bookings/pages/MerchantBookingsPage.tsx` (Dòng 162–170)
* **Hiện tượng thực tế:**
  ```typescript
  const keywordMatchedPool = useMemo(() => {
    const pool = summaryData?.items ?? pageRows // Nếu summaryData null, pool chỉ có 5 bản ghi của trang hiện tại
    if (!normalizedKeyword) return pool
    return pool.filter((row) => matchesBookingKeyword(row, normalizedKeyword))
  }, [summaryData?.items, pageRows, normalizedKeyword])
  ```
  Nếu request `summaryQuery` bị timeout hoặc mạng gián đoạn, biến `summaryData` nhận giá trị `null`. Khi đó, người dùng gõ từ khóa tìm kiếm sẽ chỉ tìm được trong phạm vi 5 dòng của trang đang xem.
* **Cách khắc phục khuyến nghị:**
  Nếu `summaryQuery.isError`, có thể hiển thị một icon cảnh báo nhỏ hoặc badge chú thích cạnh ô tìm kiếm: *"Đang ở chế độ tìm kiếm cục bộ trên trang hiện tại"*, giúp người dùng hiểu rõ phạm vi tìm kiếm.

---

### ℹ️ F-04: Điều hướng liên thông sang Trạm Quét QR (`SCR-027`)
* **Vị trí:** `src/features/merchant/bookings/components/MerchantBookingDetailModal.tsx` (Dòng 476)
* **Đoạn mã hiện tại:**
  ```tsx
  <Link
    to={`/merchant/qr-scanner?code=${encodeURIComponent(booking.bookingCode)}&lot=${booking.parkingLotId ?? ''}`}
    onClick={onClose}
    ...
  >
    Xử lý tại trạm QR
  </Link>
  ```
* **Đánh giá:**
  Đây là một điểm tích hợp rất xuất sắc (Great DX & UX) giúp chủ bãi từ modal chi tiết có thể bấm 1 chạm chuyển thẳng sang trạm quét barie với mã đặt chỗ và bãi đỗ đã được điền sẵn. Cần đảm bảo component `QRScannerPage` (SCR-027) đọc cả 2 param `code` và `lot` để tự động kích hoạt phiên quét.

---

## 5. Đánh Giá Chất Lượng Kỹ Thuật Chuyên Sâu

### 5.1. Tuân Thủ Tiêu Chuẩn Anti-AI Slop Standard
- ✅ **Không có Ghost Code / Dead Code:** Mọi hàm, helper (`resolveBookingPlate`, `formatBookingDateTime`, `isActionableGateStatus`) đều được sử dụng tại các component và kiểm thử trong unit test.
- ✅ **Form & Validation thực chất:** `MerchantBookingsFilterBar` sử dụng `<form onSubmit={handleSubmit(...)}>`, có đăng ký input, hiển thị thông báo lỗi `role="alert"` màu đỏ khi vượt quá 100 ký tự và kích hoạt reset khi đổi prop.
- ✅ **Không tạo UI giả lập:** Modal chi tiết sử dụng `Modal` thật với focus trap và phím Escape; Badge và Select dùng component dùng chung chuẩn của dự án.
- ✅ **State Management rõ ràng:** `useSyncExternalStore` được đóng gói trong `merchantBookingsStore.ts` kèm hàm `resetStore()` và hỗ trợ chụp snapshot trong môi trường kiểm thử Vitest.

### 5.2. An Toàn Kiểu Dữ Liệu & Hợp Đồng Backend
- ✅ Đã mở rộng `Booking` interface trong `src/entities/operations.ts` đầy đủ các trường phục vụ hiển thị (`surgeMultiplier`, `surgeStartTime`, `cancellationReason`, `refundAmount`...).
- ✅ Cấu trúc `ApiDateTimeValue` giải quyết triệt để sự không đồng nhất giữa định dạng Date mảng của Spring Boot và ISO chuỗi.

### 5.3. Khả Năng Tiếp Cận (Accessibility - A11y)
- ✅ Đầy đủ thuộc tính `aria-label`, `aria-live="polite"` cho Toast, `role="alert"` cho validation error.
- ✅ Modal có đầy đủ tiêu đề mô tả, hỗ trợ phím Escape và đóng modal bằng chuột/bàn phím.
- ✅ Bảng dữ liệu có `TableHead scope="col"` và thẻ `th`, `td` chuẩn ngữ nghĩa HTML5.

---

## 6. Kết Quả Kiểm Thử Sau Khi Rà Soát

Tất cả các bài kiểm thử liên quan đều vượt qua với kết quả tuyệt đối:
- **CI GitHub Actions:** PASS (Tất cả job kiểm tra lint, typescript và vitest đều màu xanh).
- **Vercel Preview:** PASS (Bản xem trước deploy thành công không có lỗi runtime).
- **Merchant Bookings Unit Tests:** 7/7 tests PASS (`MerchantBookingsPage.test.tsx`).

---

## 7. Kết Luận & Quyết Định Nghiệm Thu

Pull Request #68 được thực hiện với tinh thần kỹ thuật rất cao, giải quyết sạch sẽ các bài toán về trải nghiệm người dùng, tính tương thích ngược và tái cấu trúc mã nguồn.

### Quyết định: ✅ **APPROVE (PHÊ DUYỆT ĐỂ MERGE)**
- Cho phép Merge PR #68 vào nhánh `main`.
- Đưa phát hiện **F-01** vào tài liệu nợ kỹ thuật (Technical Debt Backlog) để bổ sung API Backend cho phân hệ Merchant trong các sprint tiếp theo.
