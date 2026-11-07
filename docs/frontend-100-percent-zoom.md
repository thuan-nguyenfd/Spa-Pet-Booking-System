# Chuẩn hóa MEOMEO User frontend cho zoom 100%

Đã chỉnh kích thước thật trong CSS của từng nhóm trang, giữ bố cục và nhận diện hiện tại. Không dùng `zoom`, scale toàn ứng dụng, thay root font-size, ép viewport hoặc che tràn ngang để đạt kết quả.

## File thay đổi trong công việc này

| File dưới `frontend/src/` | Nội dung |
| --- | --- |
| `main.jsx` | Import stylesheet kích thước dành riêng cho User |
| `user/styles/desktop.css` (mới) | Token User, header, menu tài khoản, hero, các section Home và footer |
| `user/styles/account.css` | Login/register/logout, profile, pets và form dùng chung |
| `user/features/about/styles/about.css` | Typography, cột nội dung, tab, ảnh và khoảng cách About |
| `user/features/catalog/styles/service-catalog.css` | Danh mục, chi tiết, bộ lọc, bảng giá, CTA và các cột |
| `user/features/bookings/styles/booking.css` | Stepper, chọn pet/dịch vụ/lịch/nhân viên, sidebar, xác nhận, thành công, modal |
| `user/features/bookings/styles/booking-detail.css` | Chi tiết lịch, ngày giờ, dịch vụ, thanh toán, hủy và đánh giá |
| `user/features/bookings/styles/booking-reschedule.css` | Cột lịch mới/biên nhận, khung giờ và thông báo thành công |
| `user/features/bookings/styles/my-bookings.css` | Lịch sử, tìm kiếm, bộ lọc và hàng booking co giãn |
| `user/features/errors/styles/not-found.css` | Chữ, vùng Lottie và bố cục trang 404 |
| `user/features/auth/styles/auth-placeholder.css` (mới) | Kích thước placeholder Forgot Password được giới hạn riêng cho User |
| `user/features/auth/pages/ForgotPasswordPage.jsx` | Thêm wrapper và import CSS riêng, giữ nội dung và chức năng cũ |

`src/styles/global.css`, các component nghiệp vụ, routes, service, mock, API, backend và database không được sửa trong lượt chuẩn hóa kích thước này. Các thay đổi chưa commit từ công việc trước được giữ lại.

## Quyết định về kích thước

Chỉ kích hoạt các điều chỉnh desktop chính từ 1100px. Không đổi font-size của `html`/`body`; chữ kế thừa trong `.meomeo-home` dùng 14,5px ở desktop. Bốn token nhỏ nằm trong User shell: header 68px, container Booking tối đa 1350px, chi tiết tối đa 1090px và control 44px.

Chữ phụ 12–13px hiện có không bị nhân đồng loạt với 0,9. Giữ chữ có thể đọc được và vùng bấm quan trọng khoảng 44px. Giữ nguyên font family, weight, màu, gradient, border, ảnh, SVG, Rive, Lottie và các thông số animation.

Một số phép đo tại ảnh vật lý 1440×900:

| Thành phần | Bản cũ ở mốc 90% tương đương | Bản mới ở 100% |
| --- | ---: | ---: |
| Header | 68,4px | 68px |
| Hero | 621px | 621px |
| H1 Home | 97,2px | 97px |
| H1 Catalog | 50,4px | 50px |
| H1 Booking | 29,7px | 30px |
| H1 chi tiết booking | 28,8px | 29px |
| H1 đổi lịch | 25,2px | 25,5px |
| H1 Profile | 39,6px | 40px |
| H1 form đăng nhập | 36px | 36px |
| Input tài khoản | 43,2px | 44px |
| Sidebar Booking ở 1440px | 342px | 342px |

Các giá trị là kích thước CSS hoặc kích thước CSS nhân 0,9 của mốc tham chiếu, không phải phép đo mức giống nhau của toàn bộ ảnh.

## Điều chỉnh cho laptop

- Header có logo/nav nhỏ hơn, khoảng cách linh hoạt và tên tài khoản có thể xuống dòng.
- Tiêu đề Home dùng `clamp()` và giảm thêm trong khoảng 1100–1350px để giữ hai dòng chính. Chiều cao hero và player Rive vẫn liên kết qua biến cũ; không crop hoặc scale ứng dụng.
- Phần giới thiệu cạnh tiêu đề “Dịch vụ cho boss” được phép xuống dòng trong cột co giãn, thay cho `nowrap` và `flex: none`.
- Footer dùng cột `minmax(0, …)` và cho phép email/địa chỉ xuống dòng.
- Ảnh Login không còn buộc tối thiểu 740–800px trên laptop thấp; dùng mốc 580/650px theo chiều cao màn hình. Form cao hoặc có lỗi validation vẫn cuộn dọc tự nhiên.
- Profile/Pets dùng cột `minmax(0, …)`, tên dài xuống dòng, các nhóm nút được wrap. Input giữ chiều cao 44px ở desktop.
- Catalog giới hạn container và giảm khoảng trống giữa hai cột; bộ lọc, giá/CTA và thông tin dịch vụ có thể wrap.
- Booking dùng sidebar 300px ở laptop tới 1350px, thay cho mốc cứng 360–380px; cột nội dung còn lại co giãn. Giảm ảnh/padding của service option, giữ khung giờ/nút dễ bấm. Stepper desktop cho phép nhãn xuống dòng thay vì ellipsis.
- Sidebar Booking giữ cơ chế cuộn nội bộ đã có khi nội dung cao hơn màn hình; không cắt bỏ thông tin. Modal được giới hạn theo `100svh`, có cuộn nội dung.
- Lịch sử booking dùng cột linh hoạt; tên dịch vụ được xuống dòng thay vì cắt bằng ellipsis. Có bố cục hai cột ở màn hình dưới 1100px.
- Chi tiết booking có cột thông tin/giá co giãn; sửa bố cục lịch sử và chi tiết ở màn hình nhỏ để tránh tràn ngang trong kiểm tra bổ sung 390px.

Ở desktop, bỏ việc `overflow: clip` của User shell bằng override `overflow: visible`; lỗi tràn phải được sửa tại thành phần tạo ra nó. Việc crop ảnh và player trong frame, sr-only hoặc scroll container đúng chức năng vẫn được giữ nguyên.

## Mốc 90% và đối chiếu hình ảnh

Không điều khiển được nút zoom thật của Chrome trong bộ tự động hóa hiện tại. Mốc thay thế: viewport CSS 1600×1000 với device scale factor 0,9, cho ảnh PNG vật lý 1440×900. Bản 100% dùng viewport CSS 1440×900 và device scale factor 1. Cách này tái hiện quan hệ CSS pixel/physical pixel và breakpoint của zoom 90% ở mốc so sánh, nhưng không đại diện cho mọi khác biệt giữa browser zoom thật, OS scaling và raster hóa font.

Đã chụp bản cũ ở 100%, bản cũ ở mốc 90% tương đương và bản mới ở 100%. Mốc 90% có Home, Login, Catalog, Booking, chi tiết, đổi lịch và Profile; thêm 26 trạng thái tương tác Booking/tài khoản/About/Catalog. Đã xem trực tiếp các ảnh trước/sau đại diện, gồm Home, form Login, Booking, chi tiết/đổi lịch, Profile, About, modal, chọn dịch vụ/lịch, xác nhận thanh toán, form đánh giá, dropdown và Lottie 404. Không khẳng định khớp pixel toàn ứng dụng.

Các ảnh cho thấy hierarchy chữ, kích thước hero, form và sidebar gần với mốc được duyệt. Một số khác biệt có chủ đích để dễ dùng hơn: chữ phụ được giữ đủ lớn, input làm tròn thành 44px, dòng chữ linh hoạt và sidebar laptop nhỏ hơn. Rive/Lottie được xem khi đã render; nội dung animation không bị thay.

## Kiểm tra đã thực hiện

| Kiểm tra | Kết quả |
| --- | --- |
| `npm run build` | Thành công |
| `git diff --check` | Thành công |
| Lint/test script | `package.json` không khai báo; không báo đã chạy script không tồn tại |
| Route × viewport | 126 lượt: 18 route × 7 kích thước, không runtime exception |
| Trạng thái tương tác | 156 lượt: 26 trạng thái × 6 kích thước desktop/laptop, không runtime exception |
| Đo layout | Không phát hiện tràn ngang, text bị cắt theo phép đo, modal vượt viewport hoặc Booking stage/sidebar chồng nhau trong các lượt trên |
| Kiểm tra tài khoản có sẵn | 39 kiểm tra qua; không console warning/error hoặc runtime exception |
| Dữ liệu/nghiệp vụ | Đối chiếu 28 module service/mock/mapper/utils/hook/validation với snapshot trước refactor: nội dung giữ nguyên, chỉ khác đường dẫn di chuyển từ công việc trước |
| Admin | File nguồn giữ nguyên từng byte; ảnh `/admin` trước/sau tại 1440×900 giống nhau từng byte |

Sáu kích thước chính: **1920×1080, 1600×900, 1440×900, 1366×768, 1280×800, 1280×720**. Kiểm tra bổ sung route ở **390×844**; bộ tài khoản có thêm Login/Register tại 390px.

18 route: `/`, `/about`, `/services`, `/services/1`, `/login`, `/register`, `/forgot-password`, `/profile`, `/pets`, `/booking`, `/bookings`, `/bookings/27`, `/bookings/28`, `/bookings/24`, `/bookings/27/reschedule`, `/missing` (404), `/logout`, `/admin`.

26 trạng thái: chọn pet; modal thêm pet; chọn dịch vụ; ngày/giờ; nhân viên; xác nhận VNPay mock; đặt lịch thành công; chọn lịch mới và đổi lịch thành công; form hủy và hủy thành công; form đánh giá và gửi thành công; sửa profile; thêm pet; dropdown tài khoản; năm tab About; ba bộ lọc Catalog; đổi mức cân nặng; validation Register. Các thao tác sử dụng UI hiện hữu, dữ liệu chỉ nằm trong profile Chrome thử nghiệm riêng.

39 kiểm tra tài khoản bao gồm validation, đăng nhập sai/đúng, đăng ký/trùng email, logout, ghi nhớ/khôi phục phiên, sửa/hủy profile, CRUD và soft delete pet, phân tách dữ liệu tài khoản và guest hoàn tất booking mock.

## Giới hạn

Kiểm tra bằng Chrome headless trên máy hiện tại, không thay thế kiểm tra trên màn hình vật lý của mọi laptop hoặc các trình duyệt khác. Các route/state được đo layout tự động; chỉ các ảnh đại diện được xem trực tiếp, không xem từng ảnh của mọi tổ hợp. Không phát hiện lỗi layout còn lại trong phạm vi kiểm tra, nhưng không khẳng định không tồn tại lỗi với mọi dữ liệu có thể nhập.

Không triển khai Forgot Password thật (trang này vẫn là placeholder hiện có), không tích hợp thanh toán thật và không thay đổi mock hoặc nghiệp vụ. Contact đã được bỏ trước công việc này; thông tin liên hệ vẫn ở About và không tạo lại route/page mới.

Giữ nguyên `src/pages/admin/`, `src/layouts/AdminLayout.jsx` và global root styles. Stylesheet chung mới chỉ áp dụng dưới `.meomeo-home`; stylesheet Forgot Password chỉ áp dụng dưới `.user-auth-placeholder`.

Artifact cục bộ: `frontend/node_modules/.cache/zoom-before/`, `zoom-after/`, `zoom-comparison.json`, `zoom-customer-flow-results.json`. Hai file `report.json` ở mỗi thư mục ảnh và `states/report.json` ghi kết quả chi tiết. Đây là cache thử nghiệm, không phải mã nguồn ứng dụng.
