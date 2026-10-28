# Integration readiness audit — 2026-10-28

## A. Current architecture

React routes call async `customerService`, `petService`, `serviceService`, `availabilityService`, `staffService` and `bookingService`. These currently read fixtures under `frontend/src/mocks`, with a few writes in browser session storage. `bookingMapper` normalizes detail/list records; `bookingPrice`, `bookingDuration`, `bookingDate`, `bookingDetail` hold shared calculations/rules. `apiClient` exists but is not wired. Public/auth/admin pages are mostly presentation or placeholders. Spring Boot has entities, repositories and an empty `/api/users` controller/service; no Booking, Auth, Pet, Catalog, Availability, Payment or Review endpoints, DTOs, security configuration or tests. SQL has schema only and no seed/business document. No live VNPay implementation exists.

## B. Ready for backend

- Booking page submits choice fields through `bookingService.createBooking`; price/end/status/code are absent from request. Pet/catalog/staff/availability methods already return Promises, so a data source can be replaced within each service. Booking detail/list share one mapper and use numeric IDs. Appointment values are local date and time strings. Snapshot service data is stored in mock booking detail records.
- The proposal in [frontend-backend-contract.md](frontend-backend-contract.md) is the API boundary to implement. It is **not** a claim that those routes already exist.

## C. Issues fixed

| Severity | Finding and correction |
|---|---|
| HIGH | Hủy lịch/đánh giá trước đây chỉ sửa React state rồi mất khi reload. Mock service nay xử lý và lưu session; trang chi tiết chờ kết quả và chặn gửi lặp. |
| HIGH | Mapper trước đây bịa transaction SUCCESS/PENDING từ booking PAID/UNPAID. Nay transaction status nullable khi không có attempt; `payments[]` giữ nhiều lần thử. |
| MEDIUM | Mock reschedule trước đây ghi nhân viên bất kỳ dù không còn trong danh sách khả dụng. Nay service kiểm tra lại slot/nhân viên khi submit. |
| MEDIUM | Khung 08:00 có trong fixture nhưng validator reschedule từ chối trước 09:00. Đã đồng bộ validator với slot đầu 08:00. |
| LOW | Booking-detail item ID trước đây rơi về service ID, nhầm PK snapshot với FK dịch vụ. Đã giữ hai ID riêng. |

## D. Remaining risks

| Severity | Risk / next action |
|---|---|
| CRITICAL | Backend chưa có authentication/authorization. Spring Security dependency có thể chặn endpoint mặc định; phải thiết kế token/current-user và ownership cho mọi thao tác trước khi nối dữ liệu thật. Không nhận `userId` từ client. |
| CRITICAL | Không có transaction/locking cho booking overlap. Availability chỉ là preview; create/reschedule phải kiểm tra và giữ chỗ atomically. Xem `future-booking-concurrency.md`. |
| HIGH | SQL `giadichvu` dùng `[cannangtu,cannangden]` đều NOT NULL; frontend fixture dùng `maxWeightKg:null` cho >20kg và không có lower bound. Backend cần quy ước interval có biên rõ, ngăn overlap/gap, rồi adapter catalog trả tier tương ứng. |
| HIGH | Mock booking fixtures tham chiếu service ID 5 nhưng catalog chỉ có 1–4; staff 4 nhưng staff fixture chỉ 1–3; pet 103 nhưng pet fixture chỉ 101–102. Booking snapshots vẫn render được, nhưng fixture không thể dùng làm relational seed nguyên trạng. |
| HIGH | Snapshot giá/thời lượng của một số booking không khớp catalog hiện tại (ví dụ Mochi 4.8 kg có snapshot tắm 150.000đ, catalog hiện 120.000đ; dịch vụ cắt tỉa có snapshot 120 phút, catalog hiện 90 phút). Đây có thể là giá/thời lượng lịch sử hợp lệ; không tự sửa snapshot. Backend phải lưu giá và thời lượng tại thời điểm đặt. |
| HIGH | Mock slot và staff availability là lịch giả theo weekday, chưa tính mọi booking overlap, status/active flag hoặc concurrent requests. Không coi mock là quy tắc backend. |
| MEDIUM | `payment` compatibility object vẫn giả định một method hiển thị. DB cho phép nhiều `thanhtoan`; DTO phải chọn attempt phù hợp và trả `payments[]`. Chưa có payment integration, button VNPay hiện chỉ báo placeholder. |
| MEDIUM | Pet form/fixture dùng nhãn `Chó/Mèo`, SQL enum `DOG/CAT/OTHER`. Trước khi thay `petService`, map tại service adapter; giữ nhãn Việt ở UI. |
| MEDIUM | Ảnh catalog là import cục bộ, còn SQL là URL nullable. Adapter HTTP cần chuẩn hóa relative/absolute/null; `avatarTone`, staff specialties, service image demo là UI enrichment. |
| MEDIUM | Frontend account/login/admin pages hiện là placeholder; không có current user token, auth header hoặc role guard thật. `MOCK_CUSTOMER.id=1` là fixture, không dùng cho ownership production. |
| LOW | Browser session storage có thể bị xóa/giả mạo, mock create chỉ tạo code mà không lưu booking mới vào list. Thay bằng backend persistence; không dùng mock state để chứng minh bảo mật. |

## E. Frontend ↔ backend ↔ database conflicts

- `bookingMapper` accepts English domain fields and selected DB-style fields, but SQL/JPA entities cannot be sent raw: lazy relations and internal fields would leak. Implement DTOs per use case. Detail needs aggregate snapshots, review and payment attempts.
- `thucung` has nullable breed/image and `nguoidung` nullable password/phone/google ID. API response and validation must reflect provider and nullability. Guest is absence of login, not persisted role.
- `datlich` has pet/contact snapshots, `chitietdatlich` service snapshots; list/detail must not rebuild history from current catalog/pet. DB FK still requires original referenced records to exist.
- SQL review unique key enforces at most one review, but rating 1–5 and COMPLETED + PAID must be validated in backend service. SQL `is_hidden` and active fields are tinyint; DTO should expose booleans.
- SQL has no partial uniqueness/exclusion constraint for staff time and no constraint preventing overlapping price tiers or invalid combo membership. Enforce in service/database transaction.

## F. Business conflicts needing confirmation

- Current frontend permits reschedule for any PENDING booking, including PAID; cancel only for PENDING + UNPAID; pay only PENDING + UNPAID + VNPAY; review COMPLETED + PAID. No business requirements file states cutoff hours, refund/cancellation of paid bookings, or whether CONFIRMED can reschedule. Preserve current UI rules until confirmed; backend must be authoritative.
- SQL `thanhtoan` method exists only on payment attempt, while UI shows a chosen CASH/VNPAY method even before successful payment. Decide when a PENDING row is created and which attempt supplies the detail summary.
- Mock fixture booking #27 is dated 2026-10-27 (yesterday at audit time) but PENDING/reschedulable. Define whether past appointments can remain PENDING and whether actions require future date.
- Price tier inclusivity at exact boundary (5, 10, 20 kg) needs a server-side rule. Frontend currently chooses first `maxWeightKg >= weight`.

## G. Recommended implementation order

1. Auth/current user and ownership checks.
2. Pet DTO/service and catalog with active status, combo components and price bands.
3. Availability with conflict protection and consistent local date/time.
4. Create booking with server-side snapshots, price calculation and atomic reservation.
5. My bookings + aggregated detail DTO; replace mock mapper inputs per contract.
6. Reschedule/cancel/review as explicit business operations.
7. Cash confirmation and VNPay attempt, IPN verification, idempotency and payment history.

## API connection checklist

- [ ] Define DTO/error conventions and implement auth/JWT/current user.
- [ ] Replace mock customer/pet/catalog services and map pet enum, booleans, nullable images.
- [ ] Replace availability service; add conflict check under transaction.
- [ ] Replace booking create/list/detail service; validate ownership, active entities, snapshots, prices and statuses.
- [ ] Replace reschedule/cancel/review mock actions with protected endpoints.
- [ ] Implement payment attempts, CASH confirmation, VNPay return/IPN verification and reconcile PAID state.
- [ ] Test boundary weights, booking overlap, status transitions, duplicate review, repeated payment callback and wrong-owner access.
- [ ] Remove browser session mock overrides after each corresponding API is integrated.

## Verification

Frontend `npm run build -- --outDir node_modules/.cache/reschedule-ui-build`: passed. Backend `mvnw.cmd test` with JDK 23: passed; there are currently no test sources. The default `java` on this machine is JDK 17, which fails to compile a project configured for Java 23. No CSS or visual markup was changed for this audit.
