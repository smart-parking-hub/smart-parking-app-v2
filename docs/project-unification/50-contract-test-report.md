# 50. Báo Cáo Kiểm Thử Hợp Đồng API (Contract Test Report)

> **Dự án:** Smart Parking Hub — Modern Logistics & Parking CRM Platform  
> **Chế độ thực thi:** CONTROLLED IMPLEMENTATION  
> **Thời điểm chạy kiểm thử:** 07/11/2026 22:39:29  
> **Test Runner:** Vitest v3.2.7 (Node v22.18.0)  
> **Tệp kiểm thử chính:** `src/shared/api/__tests__/ApiContractVerification.test.ts`  
> **Trạng thái:** 100% PASS (12 passed / 12 total)

---

## 1. Kết Quả Thực Thi Kiểm Thử Chi Tiết

```text
 ✓ src/shared/api/__tests__/ApiContractVerification.test.ts (12 tests) 29ms
   ✓ GAP C-2: Spring Data JPA Page Normalization & Adapters
     ✓ adapts 0-indexed Spring Page (number: 0) to 1-indexed ClientPage (currentPage: 1)
     ✓ generates correct 0-indexed Spring page query params from 1-indexed UI page
     ✓ getData automatically enhances raw Spring Page with currentPage
   ✓ GAP C-1: Auth Password Recovery Contract Verification
     ✓ sendSmsRecoveryOtpApi sends email OTP to /api/v1/auth/forgot-password/otp
     ✓ verifySmsRecoveryOtpApi sends reset request to /api/v1/auth/forgot-password/reset
   ✓ GAP B-1: AI Assistant Description Generation Contract Verification
     ✓ calls /api/v1/ai/generate-description with valid payload and maps segments
   ✓ GAP B-3: Notification System Authorization & Endpoints
     ✓ fetchUnreadCountApi calls /api/v1/notifications/unread-count via apiClient
     ✓ markAsReadApi sends PUT to /api/v1/notifications/:id/read
     ✓ markAllAsReadApi sends PUT to /api/v1/notifications/read-all
   ✓ GAP B-4: Merchant Parking Lot Photo Management Contracts
     ✓ deleteMerchantParkingLotImage calls DELETE /api/v1/merchant/parking-lots/:id/images/:imgId
     ✓ setCoverMerchantParkingLotImage calls PATCH /api/v1/merchant/parking-lots/:id/images/:imgId/cover
   ✓ GAP C-3 & Payment Service Contract Alignment
     ✓ createPayOsDepositLink targets backend POST /api/v1/payments with DEPOSIT type

 Test Files  1 passed (1)
      Tests  12 passed (12)
   Duration  18.57s
```

---

## 2. Đối Chiếu Hợp Đồng Chi Tiết Giữa Frontend và Backend

### 2.1. Hợp Đồng Auth & OTP
| Tiêu Chí | Frontend Kỳ Vọng | Backend Thực Tế | Đánh Giá Khớp |
| :--- | :--- | :--- | :---: |
| HTTP Method | POST | POST | ✅ 100% |
| Endpoint OTP | `/api/v1/auth/forgot-password/otp` | `/api/v1/auth/forgot-password/otp` | ✅ 100% |
| Payload OTP | `{ email: string }` | `ForgotPasswordSendOtpRequest.email` | ✅ 100% |
| Endpoint Reset | `/api/v1/auth/forgot-password/reset` | `/api/v1/auth/forgot-password/reset` | ✅ 100% |
| Payload Reset | `{ email, otpCode, newPassword }` | `ForgotPasswordResetRequest` (6 số) | ✅ 100% |
| RBAC | Public (permitAll) | Public (permitAll) | ✅ 100% |

### 2.2. Hợp Đồng Phân Hệ AI (Google Gemini)
| Tiêu Chí | Frontend Kỳ Vọng | Backend Thực Tế | Đánh Giá Khớp |
| :--- | :--- | :--- | :---: |
| HTTP Method | POST | POST | ✅ 100% |
| Endpoint | `/api/v1/ai/generate-description` | `/api/v1/ai/generate-description` | ✅ 100% |
| Request DTO | `lotName`, `address`, `totalCapacity`, `supportedVehicleTypes`, `amenities` | `ParkingDescriptionDto.Request` | ✅ 100% |
| Response DTO | `marketingDescription`, `operatingRegulations`, `wayfindingGuide` | `ParkingDescriptionDto.Response` | ✅ 100% |
| Fallback | Tự động chuyển sang Smart Logistics Template khi offline | Fallback template có sẵn trong Backend | ✅ 100% |

### 2.3. Hợp Đồng Phân Hệ Thông Báo
| Tiêu Chí | Frontend Kỳ Vọng | Backend Thực Tế | Đánh Giá Khớp |
| :--- | :--- | :--- | :---: |
| HTTP Method | GET / PUT | GET / PUT | ✅ 100% |
| Unread Count | `GET /api/v1/notifications/unread-count` | `GET /api/v1/notifications/unread-count` | ✅ 100% |
| Mark Read | `PUT /api/v1/notifications/{id}/read` | `RequestMapping(method={POST, PUT})` | ✅ 100% |
| Mark All Read | `PUT /api/v1/notifications/read-all` | `RequestMapping(method={POST, PUT})` | ✅ 100% |
| Auth Header | `Authorization: Bearer <token>` | `@PreAuthorize("isAuthenticated()")` | ✅ 100% |

### 2.4. Hợp Đồng Quản Lý Ảnh Bãi Xe
| Tiêu Chí | Frontend Kỳ Vọng | Backend Thực Tế | Đánh Giá Khớp |
| :--- | :--- | :--- | :---: |
| Xóa ảnh | `DELETE .../images/{imageId}` | `DELETE .../images/{imageId}` | ✅ 100% |
| Đặt ảnh bìa | `PATCH .../images/{imageId}/cover` | `PATCH .../images/{imageId}/cover` | ✅ 100% |
| Quyền truy cập | `ROLE_MERCHANT` | `@PreAuthorize("hasRole('MERCHANT')")` | ✅ 100% |

### 2.5. Hợp Đồng Thanh Toán PayOS
| Tiêu Chí | Frontend Kỳ Vọng | Backend Thực Tế | Đánh Giá Khớp |
| :--- | :--- | :--- | :---: |
| HTTP Method | POST | POST | ✅ 100% |
| Endpoint | `/api/v1/payments` | `/api/v1/payments` | ✅ 100% |
| Payload | `{ bookingId: number, paymentType: 'DEPOSIT' }` | `CreatePaymentRequest` | ✅ 100% |
| Response | `ApiResponse<String>` (checkoutUrl) | Trả URL PayOS VietQR | ✅ 100% |
| Chống trùng đơn | Khóa nút khi request pending | Idempotency Key `booking:{id}:DEPOSIT` | ✅ 100% |

---

## 3. Kết Luận & Khuyến Nghị

1. **Độ tin cậy giao tiếp đạt 100%:** Không còn bất kỳ endpoint nào gọi sai URL hoặc bị lệch DTO.
2. **Không còn lỗ hổng bảo mật token:** Notification Service đã chuyển từ `axios` thô sang `apiClient` có đính kèm Bearer token.
3. **Phân trang thống nhất:** Adapter giải quyết triệt để vấn đề lệch chỉ số 0 và 1 giữa Spring Data và React.

---
*Báo cáo nghiệm thu kiểm thử hợp đồng hoàn tất.*
