# Refactor cấu trúc frontend MEOMEO

Đã chuyển 90 file sang kiến trúc theo feature cho Public, Authentication và Customer. Nội dung được lấy từ working tree hiện hữu, bao gồm các thay đổi chưa commit trước khi refactor. Không sửa backend, database, URL route, quy tắc nghiệp vụ, JSX hiển thị, selector CSS hoặc nội dung tiếng Việt.

## Tổ chức và di chuyển

| Đường dẫn cũ trong `frontend/src` | Đường dẫn mới |
| --- | --- |
| `App.jsx` | `app/App.jsx` |
| `routes/AppRoutes.jsx` | `app/routes/AppRoutes.jsx` |
| `constants/routes.js` | `app/routes/routePaths.js` |
| `pages/index.js` | `app/routes/pages.js` |
| `services/dataSource.js` | `app/config/dataSource.js` |
| `api/apiClient.js` | `shared/api/apiClient.js` |
| `services/mockRequest.js` | `shared/api/mockRequest.js` |
| Public/Customer/Auth trong `layouts/` | `user/layouts/` |
| Header, Footer, CustomerAccountNav | `user/layouts/components/` |
| `pages/public/` | `user/features/{home,about,contact,errors}/pages/` |
| `components/home/`, `components/about/` | Component trong feature tương ứng; data ở `data/` |
| `features/services/` | `user/features/catalog/`; `servicePhotos.js` ở `data/` |
| `features/{auth,profile,pets}/` | `user/features/{auth,profile,pets}/` |
| `features/auth/AuthProvider.jsx` | `user/features/auth/providers/AuthProvider.jsx` |
| `components/ui/AccountField.jsx` | `user/features/auth/components/AccountField.jsx` |
| `pages/auth/ForgotPasswordPage.jsx` | `user/features/auth/pages/ForgotPasswordPage.jsx` |
| `pages/customer/booking/` | `user/features/bookings/pages/` |
| `components/booking/` | `user/features/bookings/components/create/` và `detail/` |
| Booking/availability/staff services và mocks | `user/features/bookings/services/` và `mocks/` |
| `utils/bookingMapper.js` | `user/features/bookings/mappers/bookingMapper.js` |
| Booking utils và constants | `user/features/bookings/utils/` và `constants/` |
| Catalog service và mock services | `user/features/catalog/services/` và `mocks/` |
| `mocks/pets.js` | `user/features/pets/mocks/pets.js` |
| Customer service, mapper, repository và mock customer | `user/features/profile/{services,mappers,mocks}/` |
| CSS booking/about/catalog/errors | `styles/` của feature tương ứng |
| `styles/account.css` | `user/styles/account.css` |

Giữ `styles/global.css` ở cấp gốc. `account.css` dùng chung cho Auth, Profile và Pets nên đặt dưới `user/styles/`. Không tạo các thư mục con rỗng. Bỏ các `.gitkeep` không còn cần thiết ở hooks/layouts/utils; giữ nguyên assets.

## Import và export

Đã cập nhật đường dẫn tương đối của imports, barrel exports, provider, route, service, mock, mapper, utility, CSS và assets. Giữ nguyên tên named/default exports và thứ tự import. Dynamic import `HeroRiveCat.jsx` vẫn hoạt động. Chỉ sửa URL tương đối của SVG trong `booking-reschedule.css`; mọi khai báo CSS còn lại giữ nguyên.

`main.jsx` vẫn bọc ứng dụng bởi một AuthProvider ở cùng scope như trước. Không thay đổi bảo vệ route hay các URL Public/Customer/Admin. Các đường dẫn public `/rive/hero/hero-cat.riv` và `/animations/404-pet.lottie` giữ nguyên. Không cần alias hoặc thay đổi Vite configuration.

Các trang Booking tiếp tục truy cập dữ liệu Pets, Catalog và Customer qua service hiện có, không import trực tiếp mock. Những chỗ tái sử dụng helper giữa feature được giữ nguyên để tránh thay đổi logic; kiểm tra đồ thị import ở cấp module không có vòng phụ thuộc.

## Hai petService và dữ liệu customer

`src/services/petService.js` trước refactor chỉ re-export `petService` từ `features/pets/services/petService.js`. Nó không có logic hoặc kho dữ liệu riêng. Đã chuyển implementation thật vào `user/features/pets/services/petService.js`, cập nhật Booking dùng trực tiếp và xóa lớp re-export không còn consumer. Vẫn chỉ có một implementation và một trạng thái module.

`profileService.js` quản lý đọc/sửa profile; `customerService.js` cung cấp thông tin khách hiện tại cho booking, giữ cả fallback hiện hữu. `customerMapper.js` ánh xạ trường SQL sang model frontend, bao gồm helper cho pet. `customerRepository.js` giữ kho tài khoản/thú cưng, thông tin đăng nhập trong bộ nhớ và cơ chế localStorage/sessionStorage dùng chung; chỉ di chuyển, không nhân bản. `customer.js` là dữ liệu fallback. Kho repository nằm trong `profile/mocks/`, tiếp tục được Auth/Pets/Booking dùng như trước. Repository khởi tạo thú cưng từ `pets/mocks/pets.js`; không đổi seed hoặc persistence.

## Tương thích Admin

Giữ nguyên từng byte tất cả file `src/pages/admin/` và `src/layouts/AdminLayout.jsx`. Giữ nguyên `src/components/common/PlaceholderPage.jsx` vì các trang Admin import trực tiếp đường dẫn này. Contact và Forgot Password cũng tiếp tục dùng component đó. Không di chuyển component này sang shared để tránh phải sửa Admin hoặc tạo wrapper dư thừa.

Admin hiện là các trang placeholder của dự án; kiểm tra xác nhận chúng render như trước, không khẳng định có nghiệp vụ Admin hoàn chỉnh. Router vẫn khai báo cùng route, quyền truy cập và cách render như trước; không tự thêm AdminLayout vào router.

## Kiểm chứng

- Build ngay trước refactor thành công; `npm run build` sau refactor thành công.
- Toàn bộ JS/CSS/assets trong hai build giống nhau từng byte, bao gồm chunk lazy của Rive.
- Đối chiếu 120 file gốc: chỉ đường dẫn tương đối thay đổi; logic, JSX, CSS và dữ liệu giữ nguyên. Admin/assets được kiểm tra byte trực tiếp. Tất cả tham chiếu tương đối trong JS/JSX/CSS tồn tại.
- `git diff --check` thành công.
- `package.json` không có script lint hoặc test; không khai báo đã chạy các script này.
- Chrome headless, viewport 1440×900: đối chiếu nội dung DOM, URL sau điều hướng và ảnh của 24 route trước/sau: Home, About, Contact, danh mục, chi tiết dịch vụ, login/register/forgot-password/logout, profile, pets, booking, lịch sử, chi tiết, đổi lịch, booking đã hoàn tất, 404 và toàn bộ 7 route Admin. Không ảnh lỗi, runtime exception hoặc console error trong lượt này. Dùng reduced motion và đưa tab lên trước khi so sánh để ổn định animation/timer của môi trường kiểm tra.
- Ảnh chụp danh mục `/services` trước/sau tại cùng viewport giống nhau từng byte. Không thực hiện đối chiếu pixel mọi trang hoặc mọi kích thước màn hình.
- Luồng trình duyệt hiện hữu: 39 kiểm tra qua cho validation, login sai/đúng, đăng ký/trùng email, logout, ghi nhớ/khôi phục phiên, sửa/hủy profile, CRUD và soft delete pet, phân tách dữ liệu tài khoản, guest thêm pet và hoàn tất booking mock. Kiểm tra ảnh và overflow login/register tại 1440 và 390. Không runtime exception, console warning hoặc error.
- Thêm 9 kiểm tra gọi service thật trong trình duyệt cho slot/staff khả dụng, lưu đổi lịch, chặn hủy booking đã trả tiền, hủy booking chưa trả tiền, lưu đánh giá/chặn đánh giá trùng và lịch sử phản ánh thay đổi. Đây là kiểm tra service trong browser, không phải thao tác UI đầy đủ của đổi lịch/hủy/đánh giá.
- Payment UI được render qua chi tiết booking và dữ liệu/guard thanh toán được kiểm tra; không có tích hợp cổng thanh toán thật và không kiểm tra giao dịch thật.

Artifact kiểm tra cục bộ nằm trong `frontend/node_modules/.cache/`: `refactor-runtime-results.json`, `refactor-customer-flow-results.json`, `refactor-booking-results.json`, ảnh `refactor-4175-services.png` và `refactor-4176-services.png`. Chúng là cache không được đưa vào source.

Không phát hiện vấn đề mới do refactor trong các kiểm tra trên. Các giới hạn mock hiện hữu được giữ nguyên: cấu hình khác `mock` vẫn báo chưa cấu hình máy chủ, mật khẩu đăng ký chỉ ở bộ nhớ, booking mới trả kết quả mock theo logic hiện có.

## Nối Spring Boot sau này

Thêm API implementation trong `user/features/<feature>/services/`, dùng Axios client có sẵn ở `shared/api/apiClient.js` với `VITE_API_BASE_URL`. UI/hook tiếp tục gọi interface service hiện tại. Đặt ánh xạ DTO ở `mappers/` của domain, giữ hợp đồng dữ liệu của UI.

`app/config/dataSource.js` vẫn đọc `VITE_DATA_SOURCE` và mặc định `mock`; giá trị khác vẫn báo chưa cấu hình như trước. Auth/Profile/Pets đã dùng `selectService`; Booking/Catalog hiện gọi mock trực tiếp trong lớp service như trước. Khi tích hợp backend cần triển khai adapter thật và kết nối cơ chế chọn nguồn ở những lớp này, không chỉ đổi biến môi trường. Refactor này không thêm endpoint hoặc giả lập API mode.

## Cây thư mục cuối cùng

`frontend/public/animations/` và `frontend/public/rive/` giữ nguyên. Cây `frontend/src/`:

```text
src/
├── app/
│   ├── config/
│   │   └── dataSource.js
│   ├── routes/
│   │   ├── AppRoutes.jsx
│   │   ├── pages.js
│   │   └── routePaths.js
│   └── App.jsx
├── assets/
│   ├── brand/
│   │   └── logoheader.png
│   ├── custom-footer/
│   │   ├── catdogfooter.png
│   │   └── catdogfooter2.png
│   ├── icons/
│   │   └── booking/
│   │       ├── arrow-down.svg
│   │       ├── arrow-left-short.svg
│   │       ├── arrow-left.svg
│   │       ├── arrow-right-short.svg
│   │       ├── arrow-right.svg
│   │       ├── arrow-up.svg
│   │       ├── check-circle.svg
│   │       ├── look.svg
│   │       └── plus-circle.svg
│   ├── images/
│   │   ├── editorial/
│   │   │   ├── golden.jpg
│   │   │   ├── portrait.jpg
│   │   │   └── SOURCES.md
│   │   └── services/
│   │       ├── brushing-out-the-pyrenees-2.jpg
│   │       ├── credits.json
│   │       ├── dog-shower-animal-photography.webp
│   │       ├── sage-mix.jpg
│   │       └── white-shih-tzu-trimmed.jpg
│   └── .gitkeep
├── components/
│   └── common/
│       └── PlaceholderPage.jsx
├── layouts/
│   └── AdminLayout.jsx
├── pages/
│   └── admin/
│       ├── bookings/
│       │   ├── AdminBookingDetailPage.jsx
│       │   └── AdminBookingsPage.jsx
│       ├── customers/
│       │   └── AdminCustomersPage.jsx
│       ├── dashboard/
│       │   └── AdminDashboardPage.jsx
│       ├── pets/
│       │   └── AdminPetsPage.jsx
│       ├── services/
│       │   └── AdminServicesPage.jsx
│       └── staff/
│           └── AdminStaffPage.jsx
├── shared/
│   └── api/
│       ├── apiClient.js
│       └── mockRequest.js
├── styles/
│   └── global.css
├── user/
│   ├── features/
│   │   ├── about/
│   │   │   ├── components/
│   │   │   │   ├── AboutElements.jsx
│   │   │   │   └── AboutTabs.jsx
│   │   │   ├── data/
│   │   │   │   └── aboutData.js
│   │   │   ├── pages/
│   │   │   │   └── AboutPage.jsx
│   │   │   └── styles/
│   │   │       └── about.css
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   └── AccountField.jsx
│   │   │   ├── pages/
│   │   │   │   ├── AccountAccessPage.jsx
│   │   │   │   ├── ForgotPasswordPage.jsx
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   ├── LogoutPage.jsx
│   │   │   │   └── RegisterPage.jsx
│   │   │   ├── providers/
│   │   │   │   └── AuthProvider.jsx
│   │   │   ├── services/
│   │   │   │   └── authService.js
│   │   │   └── validation/
│   │   │       └── accountValidation.js
│   │   ├── bookings/
│   │   │   ├── components/
│   │   │   │   ├── create/
│   │   │   │   │   ├── AddPetModal.jsx
│   │   │   │   │   ├── BookingReviewStep.jsx
│   │   │   │   │   ├── BookingStepper.jsx
│   │   │   │   │   ├── BookingSuccess.jsx
│   │   │   │   │   ├── BookingSummary.jsx
│   │   │   │   │   ├── PetAvatar.jsx
│   │   │   │   │   ├── PetSelectionStep.jsx
│   │   │   │   │   ├── ScheduleSelectionStep.jsx
│   │   │   │   │   └── ServiceSelectionStep.jsx
│   │   │   │   └── detail/
│   │   │   │       ├── BookingActionZone.jsx
│   │   │   │       ├── BookingDetailSections.jsx
│   │   │   │       └── BookingReviewSection.jsx
│   │   │   ├── constants/
│   │   │   │   └── bookingDomain.js
│   │   │   ├── mappers/
│   │   │   │   └── bookingMapper.js
│   │   │   ├── mocks/
│   │   │   │   ├── availability.js
│   │   │   │   ├── bookings.js
│   │   │   │   └── staff.js
│   │   │   ├── pages/
│   │   │   │   ├── BookingDetailPage.jsx
│   │   │   │   ├── BookingPage.jsx
│   │   │   │   ├── BookingReschedulePage.jsx
│   │   │   │   └── MyBookingsPage.jsx
│   │   │   ├── services/
│   │   │   │   ├── availabilityService.js
│   │   │   │   ├── bookingService.js
│   │   │   │   └── staffService.js
│   │   │   ├── styles/
│   │   │   │   ├── booking-detail.css
│   │   │   │   ├── booking-reschedule.css
│   │   │   │   ├── booking.css
│   │   │   │   └── my-bookings.css
│   │   │   └── utils/
│   │   │       ├── bookingDate.js
│   │   │       ├── bookingDetail.js
│   │   │       ├── bookingDuration.js
│   │   │       └── bookingPrice.js
│   │   ├── catalog/
│   │   │   ├── components/
│   │   │   │   └── ServiceState.jsx
│   │   │   ├── data/
│   │   │   │   └── servicePhotos.js
│   │   │   ├── hooks/
│   │   │   │   └── useServices.js
│   │   │   ├── mocks/
│   │   │   │   └── services.js
│   │   │   ├── pages/
│   │   │   │   ├── ServiceDetailPage.jsx
│   │   │   │   └── ServicesPage.jsx
│   │   │   ├── services/
│   │   │   │   └── serviceService.js
│   │   │   └── styles/
│   │   │       └── service-catalog.css
│   │   ├── contact/
│   │   │   └── pages/
│   │   │       └── ContactPage.jsx
│   │   ├── errors/
│   │   │   ├── pages/
│   │   │   │   └── NotFoundPage.jsx
│   │   │   └── styles/
│   │   │       └── not-found.css
│   │   ├── home/
│   │   │   ├── components/
│   │   │   │   ├── AboutSection.jsx
│   │   │   │   ├── Hero.jsx
│   │   │   │   ├── HeroRiveCat.jsx
│   │   │   │   ├── ReviewsSection.jsx
│   │   │   │   └── ServicesSection.jsx
│   │   │   ├── data/
│   │   │   │   └── homeData.js
│   │   │   └── pages/
│   │   │       └── HomePage.jsx
│   │   ├── pets/
│   │   │   ├── hooks/
│   │   │   │   └── usePets.js
│   │   │   ├── mocks/
│   │   │   │   └── pets.js
│   │   │   ├── pages/
│   │   │   │   └── PetsPage.jsx
│   │   │   └── services/
│   │   │       └── petService.js
│   │   └── profile/
│   │       ├── hooks/
│   │       │   └── useProfile.js
│   │       ├── mappers/
│   │       │   └── customerMapper.js
│   │       ├── mocks/
│   │       │   ├── customer.js
│   │       │   └── customerRepository.js
│   │       ├── pages/
│   │       │   └── ProfilePage.jsx
│   │       └── services/
│   │           ├── customerService.js
│   │           └── profileService.js
│   ├── layouts/
│   │   ├── components/
│   │   │   ├── CustomerAccountNav.jsx
│   │   │   ├── UserFooter.jsx
│   │   │   └── UserHeader.jsx
│   │   ├── AuthLayout.jsx
│   │   ├── CustomerLayout.jsx
│   │   └── PublicLayout.jsx
│   └── styles/
│       └── account.css
└── main.jsx
```
