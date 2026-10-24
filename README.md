# Hệ thống đặt lịch Spa thú cưng

Đây là nền tảng dự án đặt lịch spa thú cưng của nhóm. Frontend và backend là hai ứng dụng riêng; file MariaDB hiện có là nguồn chuẩn để ánh xạ entity. Giai đoạn này chuẩn bị cấu trúc project và mapping database, chưa triển khai nghiệp vụ.

## Công nghệ sử dụng

- Frontend: React, Vite, JavaScript, React Router, Axios
- Backend: Spring Boot, Java 23, Maven, Spring Web, Spring Data JPA, Validation, Security, OAuth2 Client, Spring Mail
- Database: MySQL/MariaDB chạy qua XAMPP

## Cấu trúc dự án

```text
Spa-Pet-Booking-System/
├── backend/
│   ├── .mvn/
│   └── src/
│       └── main/
│           ├── java/com/petspa/petbooking/
│           │   ├── config/
│           │   ├── controller/
│           │   ├── dto/
│           │   │   ├── request/
│           │   │   └── response/
│           │   ├── entity/
│           │   │   └── enums/
│           │   ├── exception/
│           │   ├── mail/
│           │   ├── payment/
│           │   │   └── vnpay/
│           │   ├── repository/
│           │   ├── security/
│           │   ├── service/
│           │   └── util/
│           └── resources/
├── database/
├── docs/
├── frontend/
│   ├── public/
│   │   └── rive/
│   └── src/
│       ├── api/
│       ├── assets/
│       │   ├── icons/
│       │   └── images/
│       │       ├── common/
│       │       ├── home/
│       │       ├── pets/
│       │       └── services/
│       ├── components/
│       │   ├── booking/
│       │   ├── common/
│       │   ├── home/
│       │   │   ├── AboutSection/
│       │   │   ├── Hero/
│       │   │   ├── ReviewsSection/
│       │   │   └── ServicesSection/
│       │   ├── layout/
│       │   │   ├── admin/
│       │   │   └── user/
│       │   ├── pet/
│       │   ├── review/
│       │   └── service/
│       ├── context/
│       ├── hooks/
│       ├── layouts/
│       ├── pages/
│       │   ├── admin/
│       │   │   ├── bookings/
│       │   │   ├── customers/
│       │   │   ├── dashboard/
│       │   │   ├── pets/
│       │   │   ├── services/
│       │   │   └── staff/
│       │   ├── auth/
│       │   ├── customer/
│       │   │   ├── booking/
│       │   │   ├── pets/
│       │   │   └── profile/
│       │   └── public/
│       ├── routes/
│       ├── styles/
│       └── utils/
└── uploads/
    ├── pets/
    └── services/
```

## Yêu cầu môi trường

- JDK 23
- Node.js và npm
- XAMPP có MySQL/MariaDB
- IntelliJ IDEA hoặc VS Code
- Project không sử dụng tính năng Java preview

## Chuẩn bị database

1. Khởi động MySQL trong XAMPP.
2. Import `database/spathucung.sql` vào database `spathucung`.


## Chạy backend

Từ thư mục gốc của project trên Windows:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Hoặc mở thư mục `backend` bằng IntelliJ và chạy `com.petspa.petbooking.PetSpaApplication` với JDK 23. Trên macOS/Linux, chạy `./mvnw` từ thư mục `backend`.

Cấu hình database đọc từ các biến `DB_URL`, `DB_USERNAME` và `DB_PASSWORD`. Mặc định local là `localhost:3306/spathucung`, username `root`, mật khẩu rỗng. Nếu cấu hình XAMPP của bạn khác, hãy đặt lại các biến này. Có thể đổi cổng backend bằng `SERVER_PORT` (mặc định `8080`). Project không chứa thông tin đăng nhập production.

## Chạy frontend

```powershell
cd frontend
npm install
npm run dev
```

- Giao diện người dùng (placeholder): <http://localhost:5173>
- Giao diện admin (placeholder): <http://localhost:5173/admin>
- Backend: <http://localhost:8080>

Axios đọc URL backend từ `VITE_API_BASE_URL`. Sao chép `frontend/.env.example` thành `.env.local` để cấu hình URL local.

## Cấu hình tích hợp trong tương lai

Google OAuth2, VNPay và email hiện mới được chuẩn bị dependency/cấu hình, chưa có chức năng thực tế. Email sẽ dùng các biến `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME` và `MAIL_PASSWORD`. Khi triển khai Google Login, dùng `GOOGLE_CLIENT_ID` và `GOOGLE_CLIENT_SECRET`. Cấu hình merchant và khóa ký VNPay sẽ được bổ sung bằng biến môi trường ở giai đoạn tích hợp thanh toán. Không commit credential thật.

## Phạm vi hiện tại

Entity đã được ánh xạ và các package nền tảng đã được tạo để nhóm tiếp tục phát triển. Đăng ký, đăng nhập, booking, thanh toán, gửi email, CRUD admin và các API nghiệp vụ khác chưa được triển khai trong giai đoạn này.
