# Database notes

`database/spathucung.sql` is the source of truth. No schema changes were made. No separate business requirements document was present in the repository when the scaffold was prepared.

## Schema summary

| Table | Primary key | Notable constraints and columns |
|---|---|---|
| `nguoidung` | `manguoidung` (auto increment) | Unique email, nullable unique phone and `googleid`; enums `nhacungcap` (LOCAL/GOOGLE), `vaitro` (CUSTOMER/ADMIN) |
| `thucung` | `mathucung` (auto increment) | Required owner FK; DOG/CAT/OTHER; decimal weight |
| `dichvu` | `madichvu` (auto increment) | SINGLE/COMBO enum; duration; nullable image/description |
| `giadichvu` | `magiadichvu` (auto increment) | Required service FK; unique `(madichvu,cannangtu,cannangden)`; decimal weight band and price |
| `nhanvien` | `manhanvien` (auto increment) | MALE/FEMALE/OTHER; unique required phone and nullable email |
| `datlich` | `madatlich` (auto increment) | Unique booking code; required user, pet, staff FKs; copied contact/pet fields; date/time; PENDING/CONFIRMED/COMPLETED/CANCELLED and UNPAID/PAID enums |
| `chitietdatlich` | `id` (auto increment) | Required booking and service FKs; unique `(madatlich,madichvu)`; stores service name, price and duration snapshots |
| `chitietcombo` | `(macombo,madichvucon)` | Both columns are required FKs to `dichvu`; `macombo` cascades on delete |
| `danhgia` | `madanhgia` (auto increment) | Unique booking FK; nullable comment; `is_hidden` tinyint; timestamps |
| `thanhtoan` | `mathanhtoan` (auto increment) | Required booking FK; VNPAY/CASH and PENDING/SUCCESS/FAILED/CANCELLED enums; nullable VNPay metadata; transaction refs unique when non-null |

## Relationships reflected by foreign keys

- One user can own many pets and bookings; each pet and booking has one required user.
- One pet and one staff member can each be referenced by many bookings; each booking references one of each.
- One booking can have many booking detail rows and payment rows. The SQL does not make `thanhtoan.madatlich` unique.
- A booking can have at most one review because `danhgia.madatlich` is unique.
- One service can have many price bands and booking detail rows.
- `chitietcombo` joins a combo service to component services with a composite key.

## Items for the team to decide

- There is no constraint that `sosao` is between 1 and 5, nor that weight bands are ordered/non-overlapping or positive.
- Foreign keys allow `chitietcombo.macombo` to point to any service kind; the SINGLE/COMBO rule is application-level.
- `datlich` stores both foreign keys and snapshots such as pet name/type and contact information. This may be intentional historical data; confirm the update policy before changing anything.
- The SQL dump's table definitions have mixed explicit table options. Check the imported database's actual charset/collation and engine if Hibernate validation or text storage behaves unexpectedly.
- The dump contains no seed data and no business-flow document.
