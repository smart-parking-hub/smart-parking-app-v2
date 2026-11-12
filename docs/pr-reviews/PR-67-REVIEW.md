# Báo Cáo Đánh Giá Kỹ Thuật Pull Request #67

> **Dự án:** `smart-parking-app-v2`  
> **Tiêu chuẩn áp dụng:** `ak-review-pr v3.0.0` (Anti-AI Slop, Finding Standard & Safety Engine)  
> **Thời điểm đánh giá:** 2026-11-12T20:57:00+07:00  
> **Quyết định đề xuất:** **CHANGES REQUESTED (Yêu cầu chỉnh sửa trước khi Merge)**

---

## 1. Thông Tin Tổng Quan Pull Request

| Thuộc tính             | Chi tiết                                                                                                                                                               |
| :--------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Pull Request**       | [#67 - [SP-S3-UI-01] Feat(Merchant): Xây dựng Bảng Điều khiển Tổng quan Vận hành Chủ bãi (SCR-026)](https://github.com/smart-parking-hub/smart-parking-app-v2/pull/67) |
| **Tác giả**            | `@2imBenne`                                                                                                                                                            |
| **Nhánh nguồn (Head)** | `feat/merchant-sp-s3-ui-01-dashboard-scr-026` (`45904fd`)                                                                                                              |
| **Nhánh đích (Base)**  | `main` (`2e8d638`)                                                                                                                                                     |
| **Phạm vi thay đổi**   | 6 files (`+518` dòng / `-64` dòng)                                                                                                                                     |
| **CI / Quality Gate**  | Vercel Preview (Success), Frontend Quality Gate & Validation (Success)                                                                                                 |
| **Mergeable**          | `True` (Không có conflict với nhánh base)                                                                                                                              |

---

## 2. Tóm Tắt Đánh Giá (Executive Summary)

PR #67 hoàn thành tốt các mục tiêu về mặt giao diện và bố cục của màn hình **SCR-026 (Merchant Executive Dashboard)**:

- Đã bổ sung thanh lọc cơ sở bãi đỗ kết hợp các nút chọn kỳ báo cáo (`ALL`, `TODAY`, `WEEK`, `MONTH`).
- Đã thiết lập store trạng thái client (`useSyncExternalStore`) để quản lý `selectedLotId`, `timeRange`, và `toast`.
- Đã viết thêm component form và bổ sung 2 ca kiểm thử mới cho tương tác time range và nút làm mới dữ liệu.

Tuy nhiên, qua quá trình rà soát đối chiếu chuyên sâu theo tiêu chuẩn **Anti-AI Slop Standard** và **API Contract**, phát hiện **2 lỗi mức Major (Logic sai lệch & Phản hồi ảo)** cùng **3 vấn đề về kiến trúc & chất lượng kiểm thử** cần phải khắc phục trước khi hòa nhập vào nhánh `main`.

---

## 3. Bảng Tổng Hợp Các Điểm Phát Hiện (Findings Summary)

|    ID    | Tiêu đề                                                                                                          |           Phân loại            |  Mức độ   | Mức tin cậy | Độ ưu tiên | File ảnh hưởng                              |
| :------: | :--------------------------------------------------------------------------------------------------------------- | :----------------------------: | :-------: | :---------: | :--------: | :------------------------------------------ |
| **F-01** | Lọc kỳ báo cáo `timeRange` không được truyền vào API doanh thu (Tạo ảo giác lọc dữ liệu)                         | `correctness` / `api-contract` | **Major** |    High     |   **P2**   | `MerchantDashboardPage.tsx#L303-L305`       |
| **F-02** | Nút làm mới dữ liệu thông báo thành công dù request refetch thất bại                                             |         `correctness`          | **Major** |    High     |   **P2**   | `MerchantDashboardPage.tsx#L318-L327`       |
| **F-03** | Tự code lại Toast cục bộ thay vì tái sử dụng `@/shared/components/Toast` có sẵn                                  |  `ai-slop` (reimplementation)  | **Minor** |    High     |   **P3**   | `MerchantDashboardPage.tsx#L377-L407`       |
| **F-04** | Hook `useForm` mang tính trang trí (không có thẻ form, không hiển thị lỗi, callback kích hoạt bất kể validation) |  `ai-slop` (ornamental code)   | **Minor** |    High     |   **P3**   | `MerchantDashboardFilterForm.tsx#L143-L160` |
| **F-05** | Test case chỉ kiểm tra biến RAM in-memory của store, không kiểm tra API hay thay đổi giao diện                   |    `testing` (shallow test)    | **Minor** |    High     |   **P3**   | `MerchantDashboardPage.test.tsx#L26-L54`    |

---

## 4. Chi Tiết Các Điểm Phát Hiện & Hướng Dẫn Sửa Đổi

### F-01: Lọc kỳ báo cáo `timeRange` không được truyền vào API (UI Illusion)

- **Vị trí:** `src/features/merchant/dashboard/pages/MerchantDashboardPage.tsx` (Dòng 303–305) & `src/features/merchant/dashboard/components/MerchantDashboardFilterForm.tsx` (Dòng 124–129)
- **Hiện tượng thực tế:**
  ```typescript
  // MerchantDashboardPage.tsx
  const lotRevenueQuery = useQuery({
    queryKey: ["merchant-revenue-stats", selectedLotId, timeRange],
    queryFn: () => fetchRevenueStats(selectedLotId), // timeRange không hề được truyền vào hàm gọi API!
    enabled: selectedLotId !== null,
    staleTime: 20000,
  });
  ```
  Trong khi đó, hàm `fetchRevenueStats` tại `merchantDashboardApi.ts` đã được định nghĩa hỗ trợ `startDate` và `endDate`:
  ```typescript
  export async function fetchRevenueStats(
    parkingLotId?: number | null,
    startDate?: string,
    endDate?: string,
  );
  ```
- **Hậu quả:**
  Khi chủ bãi bấm các nút "Hôm nay", "7 ngày qua", "30 ngày qua", TanStack Query thấy `queryKey` thay đổi nên trigger gọi lại API, nhưng tham số gửi lên backend hoàn toàn không có `startDate`/`endDate`. Backend luôn trả về doanh thu trọn đời (`lifetime revenue`). Người dùng tưởng rằng đang xem doanh thu hôm nay hoặc 7 ngày qua, nhưng thực chất số tiền hiển thị không thay đổi.
  Đặc biệt: Khi `selectedLotId === null` (đang xem tổng hợp tất cả bãi), query `merchant-dashboard-summary` còn không hề chứa `timeRange` trong `queryKey`, dẫn đến việc bấm lọc kỳ báo cáo không có bất kỳ phản ứng nào.
- **Cách khắc phục:**
  1. Viết một helper tính toán `startDate` và `endDate` (chuẩn ISO `YYYY-MM-DD`) dựa trên `timeRange` (`TODAY`, `WEEK`, `MONTH`, `ALL`).
  2. Truyền `startDate` và `endDate` vào `fetchRevenueStats(selectedLotId, startDate, endDate)`.
  3. Khi `selectedLotId === null`, nếu backend API `/api/v1/merchant/revenue` hỗ trợ lọc kỳ, hãy bổ sung `timeRange` vào `queryKey` và gọi tương ứng.

---

### F-02: Nút "Làm mới dữ liệu" thông báo thành công dù request thất bại

- **Vị trí:** `src/features/merchant/dashboard/pages/MerchantDashboardPage.tsx` (Dòng 318–327)
- **Đoạn mã hiện tại:**
  ```typescript
  const handleManualRefresh = async () => {
    await refetch();
    if (selectedLotId !== null) {
      await lotRevenueQuery.refetch();
    }
    showToast(
      "Dữ liệu bảng điều khiển chủ bãi đã được làm mới thành công!",
      "success",
    );
  };
  ```
- **Hiện tượng thực tế:**
  Hàm không bọc trong khối `try...catch` và không kiểm tra cờ `isSuccess` / `isError` của kết quả `refetch()`. Nếu kết nối mạng chập chờn hoặc máy chủ backend phản hồi mã lỗi 500, lệnh `showToast(..., 'success')` vẫn kích hoạt thông báo xanh lá "Làm mới thành công!".
- **Hậu quả:** Gây hiểu lầm tai hại cho chủ bãi khi hệ thống đang lỗi kết nối nhưng lại báo dữ liệu đã mới nhất.
- **Cách khắc phục:**
  ```typescript
  const handleManualRefresh = async () => {
    try {
      const summaryRes = await refetch();
      let lotResSuccess = true;
      if (selectedLotId !== null) {
        const lotRes = await lotRevenueQuery.refetch();
        lotResSuccess = !lotRes.isError;
      }
      if (summaryRes.isError || !lotResSuccess) {
        showToast("Không thể làm mới dữ liệu. Vui lòng thử lại sau.", "error");
      } else {
        showToast(
          "Dữ liệu bảng điều khiển chủ bãi đã được làm mới thành công!",
          "success",
        );
      }
    } catch {
      showToast("Có lỗi xảy ra khi kết nối máy chủ.", "error");
    }
  };
  ```

---

### F-03: Tái tạo Toast cục bộ thay vì dùng `@/shared/components/Toast`

- **Vị trí:** `src/features/merchant/dashboard/pages/MerchantDashboardPage.tsx` (Dòng 377–407)
- **Vấn đề theo Anti-AI Slop:**
  Hệ thống đã có component chuẩn dùng chung `Toast` tại `@/shared/components/Toast` (hỗ trợ variant `success`, `error`, `info`, `warning`, tự động đóng, icon chuẩn và khả năng tiếp cận a11y).
  PR này lại tự tay viết một khối `div` floating cố định ở góc màn hình, tạo timer `setTimeout` thủ công ở `useEffect`, tự import các icon `CheckCircle2`, `AlertCircle`, `Info`, `X` riêng biệt.
- **Cách khắc phục:**
  Import và tái sử dụng component chuẩn:
  ```typescript
  import { Toast } from '@/shared/components/Toast'
  ...
  {toast && (
    <Toast
      title={toast.type === 'success' ? 'Thành công' : 'Thông báo'}
      message={toast.message}
      variant={toast.type}
      onClose={clearToast}
      duration={4000}
    />
  )}
  ```

---

### F-04: Hook `useForm` mang tính trang trí (Ornamental Code)

- **Vị trí:** `src/features/merchant/dashboard/components/MerchantDashboardFilterForm.tsx` (Dòng 143–160)
- **Vấn đề theo Anti-AI Slop:**
  Tác giả khởi tạo `useForm<MerchantDashboardFilterValues>({ resolver: zodResolver(...) })`, nhưng:
  1. Component bên dưới render bằng thẻ `<div>`, không hề có thẻ `<form onSubmit={...}>`.
  2. Không có bất kỳ thẻ input nào dùng `register` hay `watch`.
  3. `formState.errors` không hề được đọc hay hiển thị ở bất kỳ đâu trên giao diện.
  4. Các hàm `onLotChange` và `onTimeRangeChange` được gọi trực tiếp ngay lập tức khi người dùng click/change, bất chấp việc validation có hợp lệ hay không.
- **Hậu quả:** Tăng overhead thừa, gây khó hiểu cho người đọc code sau này vì tưởng rằng có xử lý form phức tạp.
- **Cách khắc phục:**
  - Nếu chỉ cần lọc trên click dropdown/pill: Sử dụng trực tiếp `merchantDashboardFilterSchema.safeParse` để kiểm tra trước khi gọi `onTimeRangeChange`, loại bỏ `useForm` để code sạch sẽ và nhẹ nhàng.
  - Hoặc nếu muốn giữ `useForm`: Bọc bằng thẻ `<form>` thực sự và nối các input qua React Hook Form theo chuẩn.

---

### F-05: Kiểm thử nông (Shallow Unit Test)

- **Vị trí:** `src/features/merchant/dashboard/__tests__/MerchantDashboardPage.test.tsx` (Dòng 26–54)
- **Hiện tượng:**
  Ca kiểm thử `SP-S3-UI-01: selects time range pills and synchronizes with merchantDashboardStore` chỉ bấm nút và kiểm tra:
  `expect(getMerchantDashboardStoreSnapshot().timeRange).toBe('WEEK')`
  Test này chỉ kiểm tra biến RAM của store JavaScript có đổi giá trị hay không, hoàn toàn bỏ qua việc giao diện hay API có thực sự phản hồi tương ứng không. Chính vì test nông như vậy nên lỗi **F-01** (không truyền tham số lọc vào API) đã lọt qua được CI.
- **Cách khắc phục:**
  Bổ sung assertion kiểm tra việc gọi API với tham số tương ứng hoặc kiểm tra hiển thị trên biểu đồ / bảng dữ liệu.

---

## 5. Hướng Dẫn Hành Động Dành Cho Tác Giả PR

1. **Khắc phục F-01 (Ưu tiên cao nhất):** Nối tham số `startDate` và `endDate` từ `timeRange` vào hàm `fetchRevenueStats`.
2. **Khắc phục F-02:** Xử lý bắt lỗi trong `handleManualRefresh` để không báo thành công giả tạo.
3. **Khắc phục F-03:** Thay thế khối toast thủ công bằng `@/shared/components/Toast`.
4. **Khắc phục F-04:** Dọn dẹp hook `useForm` thừa trong `MerchantDashboardFilterForm`.
5. **Cập nhật Test:** Bổ sung kiểm thử gọi API tương ứng trong `MerchantDashboardPage.test.tsx`.

Sau khi tác giả hoàn tất các chỉnh sửa trên và commit lên nhánh `feat/merchant-sp-s3-ui-01-dashboard-scr-026`, PR #67 hoàn toàn đủ điều kiện để được **APPROVED** và hòa nhập vào nhánh `main`.
