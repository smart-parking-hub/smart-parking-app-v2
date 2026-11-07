# Screen Specification: SCR-015 SearchParkingPage (Bản đồ tìm kiếm bãi đỗ)

---

## 1. SCREEN IDENTIFIER & CLASSIFICATION

- **Screen ID:** `SCR-015`
- **Screen Name:** Bản đồ tương tác tìm kiếm bãi đỗ xe (Interactive Parking Search & Map)
- **Module:** `MOD-03: Driver Operations Portal`
- **Route URLs:**
  - `/parking` (Định nghĩa tại [`AppRoutes.tsx:71`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L71) bọc bởi `LandingLayout`)
  - `/dashboard/search` (Định nghĩa tại [`AppRoutes.tsx:153`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-app/src/app/routes/AppRoutes.tsx#L153) bọc bởi `DashboardLayout`)
- **Primary Component:** `smart-parking-app/src/features/parking-search/pages/SearchParkingPage.tsx`
- **Sub-components:**
  - `DriverParkingMap`: `smart-parking-app/src/features/parking-search/components/DriverParkingMap.tsx`
  - `InlineQuickBookPanel`: `smart-parking-app/src/features/parking-search/components/InlineQuickBookPanel.tsx`
  - Custom Hook: `smart-parking-app/src/features/parking-search/hooks/useSearchParking.ts`
- **Access Role:** `ROLE_DRIVER` (Yêu cầu phiên đăng nhập tài xế)
- **Discovery Status:** `VERIFIED` (Mã nguồn Frontend & Backend đã được đối chiếu 100%)

---

## 2. BUSINESS PURPOSE & CONTEXT

### A. Business Objective
Là màn hình chức năng quan trọng nhất của phân hệ tài xế (Core Driver Feature), cho phép tài xế xe tải:
1. Định vị GPS thời gian thực của phương tiện trên bản đồ số tương tác (Leaflet OpenStreetMap).
2. Tìm kiếm bãi đỗ xe theo bán kính linh hoạt (1 km đến 50 km) quanh vị trí hiện tại hoặc quanh một địa điểm giao nhận hàng hóa cụ thể (sử dụng công cụ tìm kiếm gợi ý địa chỉ tự động).
3. Lọc chính xác các bãi xe có thể tiếp nhận đúng chủng loại phương tiện của tài xế (`SEDAN_SUV`, `BUS_COACH`, `LIGHT_TRUCK`, `HEAVY_TRUCK`, `CONTAINER`) và còn slot trống vật lý.
4. Quan sát khoảng cách di chuyển thực tế (km) và thời gian dự kiến tiếp cận (ETA phút), mở chỉ đường Google Maps ngoài ứng dụng.
5. Thực hiện đặt giữ chỗ nhanh trong 10 phút ngay trên bản đồ thông qua ngăn kéo `InlineQuickBookPanel` mà không cần rời trang.

### B. Target Users
- Tài xế đang trên đường di chuyển cần tìm chỗ đỗ nghỉ ngơi khẩn cấp.
- Tài xế chuẩn bị hành trình cần đặt trước bãi đỗ gần kho hàng hoặc bến cảng.

### C. Entry Points
- Click "Tìm bãi đỗ" trên thanh điều hướng `LandingNavbar` hoặc `DashboardLayout`.
- Click CTA trên Banner trang chủ `SCR-001`.
- Click thẻ lối tắt trên `DashboardHomePage` (`SCR-014`).

### D. Exit Points
- Nút "Xem chi tiết" trên thẻ bãi đỗ: Điều hướng sang `/dashboard/parking/:id` (`SCR-016`).
- Nút "Chỉ đường": Mở ứng dụng Google Maps dẫn đường trong tab mới.
- Đặt cọc nhanh thành công trong `InlineQuickBookPanel`: Điều hướng sang `/bookings` (`SCR-017`).

---

## 3. UI STRUCTURE & LAYOUT

### A. Bố Cục Tổng Thể
- Cấu trúc 2 phần toàn màn hình (Split-View Map Layout):
  - **Thanh công cụ lọc trên cùng (Top Filter Toolbar):** Nằm cố định trên đầu trang.
  - **Khung nội dung chính (2 Cột):**
    - **Cột trái (Danh sách kết quả - 40% width):** Thanh tìm kiếm địa chỉ đích + Danh sách thẻ bãi đỗ xe cuộn dọc độc lập.
    - **Cột phải (Bản đồ số - 60% width):** Canvas bản đồ Leaflet OpenStreetMap toàn màn hình.
  - **Ngăn kéo đặt nhanh (`InlineQuickBookPanel`):** Drawer trượt từ cạnh phải khi bấm "Đặt nhanh".

### B. Chi Tiết Các Khối Điều Khiển

#### 1. Thanh Công Cụ Bộ Lọc (Top Filter Toolbar)
- **Chọn xe sở hữu (`Select`):** Cho phép chọn nhanh 1 trong các phương tiện tài xế đã đăng ký. Hệ thống tự động gán loại xe tương ứng vào bộ lọc.
- **Lọc theo loại xe (`Select`):** 5 loại chuẩn: `SEDAN_SUV`, `BUS_COACH`, `LIGHT_TRUCK`, `HEAVY_TRUCK`, `CONTAINER`.
- **Thanh trượt bán kính (`Slider`):** Dải từ `1 km` đến `50 km` (Bước nhảy 1km, Mặc định 10km).
- **Bộ sắp xếp (`Select`):** 3 tiêu chí: `Gần nhất` (`distance`), `Giá thấp nhất` (`price_asc`), `Đánh giá cao nhất` (`rating_desc`).
- **Công tắc bãi đầy (`Switch`):** Nhãn "Hiển thị bãi đã đầy" (`includeFull`).

#### 2. Thanh Tìm Kiếm Địa Điểm & Gợi Ý Autocomplete
- Ô input tìm kiếm địa chỉ với icon `<Search />` và nút xóa nhanh `<X />`.
- Tích hợp Geocoding gợi ý địa chỉ tự động (Autocomplete Dropdown) lấy từ dịch vụ bản đồ OSM Nominatim khi người dùng gõ từ khóa.
- Nút bấm định vị GPS: Icon `<LocateFixed />` - "Vị trí của tôi" (Sử dụng trình duyệt `navigator.geolocation.getCurrentPosition`).

#### 3. Cột Danh Sách Thẻ Bãi Đỗ Xe (`lots-list`)
Mỗi thẻ bãi xe (`.parking-lot-card`) hiển thị:
- Tên bãi đỗ xe (In đậm) + Huy hiệu `<ShieldCheck /> Đã phê duyệt`.
- Địa chỉ bãi xe kèm icon `<MapPin />`.
- Khoảng cách di chuyển (`distanceKm`) và thời gian dự tính (`etaMinutes`).
- Thẻ trạng thái slot: Tag màu xanh `"Còn X chỗ"` hoặc tag màu xám `"Hết chỗ"`.
- Đơn giá giờ: Ví dụ `35.000 đ/giờ`.
- Điểm đánh giá sao: Icon `<Star />` kèm điểm trung bình (ví dụ `4.8`).
- Hai nút hành động:
  - Nút viền: `Xem chi tiết` -> Mở `SCR-016`.
  - Nút màu: `Đặt nhanh` -> Mở ngăn kéo `InlineQuickBookPanel`.

#### 4. Cột Bản Đồ Leaflet (`DriverParkingMap`)
- Khung bản đồ trực quan với các lớp marker:
  - Marker vị trí tài xế (Icon xe tải màu xanh dương nhấp nháy).
  - Marker các bãi đỗ xe (Hiển thị giá tiền và số slot trống trên marker icon).
  - Đường vẽ polyline màu cam đứt đoạn nối từ vị trí tài xế đến bãi xe đang được chọn.
  - Nút "Chỉ đường" nổi trên bản đồ mở Google Maps URL.

#### 5. Ngăn Kéo Đặt Nhanh (`InlineQuickBookPanel`)
- Panel trượt bên phải hiển thị:
  - Tên bãi và địa chỉ đã chọn.
  - Dropdown chọn xe đặt cọc.
  - Thời gian dự kiến vào/ra bãi.
  - Bảng tính số tiền cọc (thời hạn giữ slot 10 phút).
  - Nút "Xác nhận đặt giữ chỗ 10 phút".

---

## 4. INTERACTION SPECIFICATION

| Phần Tử Giao Diện | Loại UI | Hành Động | Xử Lý Frontend | API Được Gọi | Kết Quả / UI State |
|---|---|---|---|---|---|
| **Dropdown Chọn Xe** | Select | Thay đổi xe | Lấy `vehicleType` của xe đó, gán vào bộ lọc | `GET /api/v1/parking-lots/search` | Tải lại danh sách bãi phù hợp loại xe |
| **Slider Bán Kính** | Slider | Kéo thay đổi km | Debounce 300ms, cập nhật `distance` | `GET /api/v1/parking-lots/search` | Cập nhật markers trên bản đồ theo bán kính mới |
| **Thanh Tìm Địa Điểm**| Input Text | Gõ từ khóa | Debounce 350ms, gọi gợi ý Nominatim | `nominatim.openstreetmap.org/search` | Mở dropdown gợi ý địa điểm bên dưới ô tìm kiếm |
| **Chọn Gợi Ý Địa Điểm**| Menu Item | Click địa điểm | Cập nhật tọa độ tìm kiếm mới, bay bản đồ `flyTo` | `GET /api/v1/parking-lots/search` | Tải danh sách bãi quanh địa điểm mới chọn |
| **Nút "Vị trí của tôi"**| Button | Click | Kích hoạt `navigator.geolocation` | `GET /api/v1/parking-lots/search` | Định vị lại GPS thiết bị, vẽ lại polyline |
| **Click Thẻ Bãi Xe** | Card | Click | Set `selectedId`, vẽ đường polyline tới bãi | Không gọi API | Bản đồ tự động canh giữa bãi xe đã chọn |
| **Nút "Đặt nhanh"** | Button | Click | Bật `quickBookLoading`, lấy chi tiết bãi | `GET /api/v1/parking-lots/{id}` | Mở ngăn kéo `InlineQuickBookPanel` |
| **Nút "Xem chi tiết"** | Button | Click | Điều hướng router | Không gọi API | Mở màn hình `SCR-016: ParkingDetailPage` |
| **Nút "Chỉ đường"** | Button Link | Click | Mở tab mới với Google Maps URL | Không gọi API | Chuyển sang Google Maps dẫn đường |

---

## 5. DATA SPECIFICATION

| Tên Tham Số / DTO | Kiểu Dữ Liệu | Bắt Buộc | Mô Tả & Validation Rule | Nguồn Dữ Liệu |
|---|---|:---:|---|---|
| `vehicleType` | Enum | Có | 1 trong 5 loại: `SEDAN_SUV`, `BUS_COACH`, `LIGHT_TRUCK`, `HEAVY_TRUCK`, `CONTAINER` | Lựa chọn từ xe sở hữu hoặc bộ lọc |
| `latitude` | Double | Có | Vĩ độ điểm tìm kiếm (GPS hoặc điểm đích) | `useSearchParking` |
| `longitude` | Double | Có | Kinh độ điểm tìm kiếm | `useSearchParking` |
| `radiusKm` | Double | Không | Bán kính tìm kiếm (1.0 đến 50.0 km, mặc định 10.0) | Slider bán kính |
| `keyword` | String | Không | Từ khóa tên bãi hoặc địa chỉ | Input tìm kiếm |
| `sortBy` | String | Không | `distance`, `price_asc`, `rating_desc` | Select sắp xếp |
| `showFullLots` | Boolean | Không | `true` (hiện cả bãi hết slot) hoặc `false` (chỉ hiện bãi còn slot) | Switch hiển thị |

---

## 6. UI STATES & EDGE CASES

- **Trạng thái Đang Tải (Loading):** Cột danh sách bên trái hiển thị Ant Design `Skeleton active`, bản đồ bên phải hiển thị icon spinner mờ.
- **Trạng thái Trống (Empty Results):** Hiển thị component `Empty` với thông báo: *"Không tìm thấy bãi đỗ nào phù hợp trong bán kính X km"*, gợi ý tăng bán kính hoặc tắt bộ lọc xe.
- **Trạng thái Lỗi Vị Trí (Location Error):** Nếu người dùng từ chối quyền truy cập vị trí trên trình duyệt, thanh cảnh báo màu vàng hiển thị: *"Không thể lấy vị trí GPS, đang dùng vị trí trung tâm mặc định (TP.HCM)"*.

---

## 7. BACKEND MAPPING & EVIDENCE

### A. Controller Mapping
- **Controller File:** [`ParkingLotController.java:57-69`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/controller/ParkingLotController.java#L57-L69)
  ```java
  @GetMapping("/api/v1/parking-lots/search")
  @PreAuthorize("hasRole('DRIVER')")
  public ResponseEntity<ApiResponse<PageResponse<ParkingLotSearchResponse>>> search(
          @RequestParam VehicleTypeEnum vehicleType,
          @RequestParam(required = false) Double latitude,
          @RequestParam(required = false) Double longitude,
          @RequestParam(defaultValue = "10.0") @Min(1) @Max(50) Double radiusKm,
          @RequestParam(required = false) String keyword,
          @RequestParam(required = false) BigDecimal minPrice,
          @RequestParam(required = false) BigDecimal maxPrice,
          @RequestParam(required = false) Double rating,
          @RequestParam(defaultValue = "false") Boolean showFullLots,
          @RequestParam(defaultValue = "distance") String sortBy,
          @RequestParam(defaultValue = "asc") String sortDirection,
          @RequestParam(defaultValue = "0") @Min(0) int page,
          @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size)
  ```

### B. Service & Business Logic
- **Service Implementation:** [`ParkingLotServiceImpl.java`](file:///d:/Documents/JAVA%20WEB%20SERVICE/SmartParkingHub/smart-parking-service/src/main/java/com/backend/service/impl/ParkingLotServiceImpl.java)
  - Sử dụng công thức tính khoảng cách hình cầu Haversine Formula trên MySQL:
    `6371 * acos(cos(radians(:lat)) * cos(radians(p.latitude)) * cos(radians(p.longitude) - radians(:lng)) + sin(radians(:lat)) * sin(radians(p.latitude)))`.
  - Chỉ lọc các bãi đỗ có trạng thái kiểm duyệt `status == ParkingLotStatusEnum.APPROVED`.
  - Kiểm tra sức chứa khả dụng theo `vehicleType`: `slot.availableCapacity > 0` (nếu `showFullLots == false`).

---

## 8. DISCREPANCIES & REDESIGN RECOMMENDATIONS

| Vấn đề hiện tại | Đánh giá Kỹ thuật / UX | Khuyến nghị thiết kế lại |
|---|---|---|
| **Gợi ý địa chỉ phụ thuộc Nominatim công cộng** | Dịch vụ Nominatim OSM miễn phí có giới hạn tần suất (Rate limit 1 req/s) và dễ bị lỗi mạng ở Việt Nam. | Chuyển sang dịch vụ Geocoding nội bộ hoặc tích hợp Google Places Autocomplete API / Mapbox Geocoding để kết quả chính xác hơn tại các tỉnh thành Việt Nam. |
| **Drawer Đặt Nhanh Chưa Hỗ Trợ Thanh Toán Ngay** | `InlineQuickBookPanel` tạo được booking `PENDING_PAYMENT` nhưng tài xế vẫn phải chuyển sang `/bookings` để bấm nút thanh toán cọc PayOS. | Nhúng nút quét mã QR thanh toán PayOS trực tiếp vào trong Drawer đặt nhanh để tài xế hoàn tất cọc ngay trên bản đồ. |
| **Cần API Tính ETA Theo Tuyến Đường Thực Tế** | Hiện tại khoảng cách và ETA được tính xấp xỉ theo đường chim bay (Haversine). Xe tải lớn bị cấm đường và cấm giờ nên thời gian thực tế có thể dài hơn nhiều. | Tích hợp công cụ định tuyến OSRM / Google Directions API có cấu hình loại xe tải để hiển thị ETA chính xác theo tuyến đường xe tải được phép lưu thông. |
