# Frontend ↔ Spring Boot contract proposal

Status: **PROPOSED** throughout, except `NguoiDungController` currently reserves `/api/users` without implemented methods. No Booking, Pet, Catalog, Availability, Payment or Review REST endpoint exists. This document describes the boundary to implement, not an existing API. Use authenticated identity on the server; never accept `userId` for ownership.

## Conventions

- JSON domain names use English camelCase. Database Vietnamese names stay inside entities/repositories and DTO mapping. IDs are positive integers; normalize React Router string params at the service boundary.
- Date-only `YYYY-MM-DD` ↔ `LocalDate`, time-only `HH:mm` ↔ `LocalTime`, no UTC conversion for an appointment. Timestamps need a documented zone/offset. Amounts are integer VND in JSON (or decimal strings if fractions are introduced), `BigDecimal` in Java and `decimal(12,2)` in SQL. Server validates and computes money.
- Enums: pet `DOG|CAT|OTHER`; provider `LOCAL|GOOGLE`; persisted role `CUSTOMER|ADMIN` (Guest is unauthenticated); service `SINGLE|COMBO`; booking `PENDING|CONFIRMED|COMPLETED|CANCELLED`; booking payment `UNPAID|PAID`; payment method `CASH|VNPAY`; transaction `PENDING|SUCCESS|FAILED|CANCELLED`. Return booleans for active/hidden flags, not SQL `0/1`.
- Proposed errors: `{code, message, errors?: [{field, message}]}`. 400 invalid input, 401 unauthenticated, 403 ownership/role, 404 absent resource, 409 stale slot/status or duplicate review, 500 unexpected failure. UI services must propagate errors. List endpoints may start as arrays; if pagination is added, agree on `{items, page, total}` before switching.

## Use cases

| Use case | Method + endpoint | Request | Response / validation |
|---|---|---|---|
| Local login | `POST /api/auth/login` | email, password | token and account summary; Google account password may be null; validate provider |
| Google login | `GET /api/auth/google/...` or OAuth callback | OAuth flow | authenticated session/token; verify Google identity server side |
| Current user | `GET /api/users/me` | Authorization | `id,fullName,email,phone? ,role`; phone nullable; do not expose password/googleId |
| My pets | `GET /api/pets/my` | Authorization | array of `id,name,type,breed?,weightKg,imageUrl?,active`; owner inferred from token |
| Create pet | `POST /api/pets` | `name,type,breed?,weightKg,imageUrl?` | saved pet; owner assigned server side; validate active user and weight |
| Catalog | `GET /api/services` | optional active/filter | `id,name,category,durationMinutes,imageUrl?,description?,priceBands[]`, combo may include `components[]`; only active bookable services |
| Availability | `GET /api/availability/slots?date=...&serviceIds=...&petId=...`; `GET /api/availability/staff?date=...&startTime=...&serviceIds=...&petId=...` | calendar date and selection | slots/staff IDs; server recomputes duration, honors status and conflicts. For reschedule use booking ID instead of trusting a client duration |
| Create booking | `POST /api/bookings` | `petId,serviceIds[],appointmentDate,startTime,employeeId,note?,paymentMethod` | booking ID/code, status, paymentStatus and detail; validate ownership, active pet/services/staff, price tier, schedule and overlap atomically |
| My bookings | `GET /api/bookings/my` | optional filter/page later | booking summaries with pet and service snapshots, status and overall payment state; owner from token |
| Detail | `GET /api/bookings/{bookingId}` | Authorization | aggregated detail shape below; enforce owner/admin |
| Reschedule | `PATCH /api/bookings/{bookingId}/appointment` | `appointmentDate,startTime,employeeId` only | updated detail; compute endTime from booked item snapshots, check eligibility and conflict atomically |
| Cancel | `POST /api/bookings/{bookingId}/cancel` | `reason?` | updated detail; validate status/payment rule, no arbitrary status update |
| Start VNPay | `POST /api/bookings/{bookingId}/payments/vnpay` | no amount | redirect URL/attempt ID; amount from booking; only eligible unpaid booking |
| VNPay return/IPN | backend routes to define | gateway parameters | verify signature, amount, reference and idempotency before transaction SUCCESS and booking PAID; frontend query is not proof |
| Payment history | `GET /api/bookings/{bookingId}/payments` | Authorization | `payments[]`; one booking can have many attempts |
| Review | `POST /api/bookings/{bookingId}/review` | `rating,comment?` | review; only owner, COMPLETED and PAID, one per booking, rating 1–5 |

### Aggregated booking detail response

`{id,code,userId,contact:{name,phone,email},pet:{id,name,type,weight,breed?,imageUrl?},employee:{id,name,avatarUrl?},appointment:{date,startTime,endTime},services:[{bookingDetailId,serviceId,name,price,durationMinutes}],note?,totalPrice,bookingStatus,paymentStatus,payment:{id?,method?,amount?,transactionStatus?,paidAt?},payments:[...],review?,cancellationReason?,createdAt,updatedAt}`.

`pet.name/type/weight` and `services[].name/price/durationMinutes` must come from `datlich` and `chitietdatlich` snapshots, never current pet/service rows. `breed` and images are optional live enrichment because SQL has no booking snapshot for them. `payment` is a compatibility summary for current UI; select the relevant/latest attempt deliberately. `payments` is the full attempt list. No transaction status should be inferred from `paymentStatus`. For CASH chosen at booking creation, confirm whether a PENDING payment row is created immediately or method is kept in a separate DTO field.

## Field mapping

| Frontend model | Proposed DTO | SQL |
|---|---|---|
| `booking.id`, `code`, `userId` | `id`, `code`, `userId` | `datlich.madatlich`, `codedatlich`, `manguoidung` |
| `booking.appointment.date/startTime/endTime` | same | `ngayhen`, `giobatdau`, `gioketthuc` |
| `booking.bookingStatus/paymentStatus` | same | `trangthaidatlich`, `trangthaithanhtoan` |
| `booking.contact.*`, `pet.name/type/weight` | snapshot objects | `tenlienhe/sdtlienhe/emaillienhe`, `tenthucung/loaithucung/cannangthucung` |
| `booking.services[]` | item snapshots | `chitietdatlich.id/madichvu/tendichvu/gia/thoiluongphut` |
| `booking.totalPrice/note` | same | `tongtien/ghichu` |
| `paymentStatus` vs `payments[].transactionStatus` | separate enums | `datlich.trangthaithanhtoan` vs `thanhtoan.trangthai` |
| pet `type`, `weightKg`, `imageUrl` | same | `thucung.loaithucung/cannang/hinhanh` |
| catalog `category`, `priceBands[]` | same | `dichvu.loaidichvu`, `giadichvu.cannangtu/cannangden/gia` |

## Ownership matrix

| Data | Frontend sends | Backend computes/checks | DB stores |
|---|---|---|---|
| Customer/owner | token only | authenticated user, pet/booking ownership | `manguoidung` |
| Booking choice | pet ID, service IDs, date, start, staff ID, note, method | valid/active resources, collision, eligibility | FKs, note, date/start, payment method in attempt |
| Duration/end | never authoritative | sum current selected durations at creation; booked snapshots on reschedule | `chitietdatlich.thoiluongphut`, `gioketthuc` |
| Prices/total | display estimate only | weight-tier price, decimal sum and revalidation | item `gia`, `tongtien` |
| Code/status/payment status | never | code generation and explicit transitions | `codedatlich`, both status columns |
| Review | rating, comment | owner, eligibility, uniqueness | `danhgia` |
