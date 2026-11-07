# MEOMEO customer frontend

## Cập nhật thiết kế editorial

Theo yêu cầu làm lại giao diện: đăng nhập/đăng ký sử dụng ảnh lớn nền vàng và form mở; profile/pets dùng thanh điều hướng tài khoản, thông tin chia bằng đường kẻ, pet không có ảnh dùng chữ cái tên bé. Dịch vụ chuyển sang danh mục dạng hàng, ảnh lớn và giá/CTA riêng; chi tiết dùng bảng giá radio tối giản. CSS mới giới hạn trong trang tài khoản và catalogue; không sửa thiết kế booking/Home/Admin.

Thêm `/logout` và `LogoutPage.jsx`: dropdown chuyển tới màn hình đăng xuất, trang này xóa phiên rồi hiển thị liên kết đăng nhập lại/trang chủ. Chuyển route trước khi xóa phiên tránh xung đột với redirect của trang được bảo vệ.

Ảnh editorial mới chỉ phục vụ prototype, nguồn ghi tại `src/assets/images/editorial/SOURCES.md`. Chưa có ảnh chụp riêng của thương hiệu; không dùng ảnh stock làm ảnh thú cưng của khách. Trang catalogue thay ảnh qua `features/services/servicePhotos.js`, giữ nguyên ảnh booking/Home. Xem trực tiếp ảnh login/register/logout, danh sách dịch vụ, chi tiết và account ở `.taste-skill/`. Functional browser checks của auth/pets và catalogue đều đạt sau thiết kế lại. Các giới hạn của bộ checker marketing và ngân sách tài nguyên cũ mô tả bên dưới vẫn áp dụng.

## Phạm vi

Đã thay bốn placeholder tại `/login`, `/register`, `/profile`, `/pets` bằng giao diện tiếng Việt có thao tác mock. Chỉ profile và pets yêu cầu phiên khách hàng. Các route booking tiếp tục truy cập được bởi guest theo yêu cầu triển khai mới nhất. Đây là mô phỏng phía trình duyệt; SQL vẫn yêu cầu `datlich.manguoidung NOT NULL`, nên luồng guest thật cần thống nhất lại trước khi nối backend.

## Cấu trúc

- `src/features/auth`: trang đăng nhập/đăng ký, validation, auth service và AuthProvider dùng chung toàn ứng dụng.
- `src/features/profile`: trang cá nhân, hook quản lý tải/sửa/lưu/hủy và profile service.
- `src/features/pets`: trang quản lý thú cưng, hook cho form và các thao tác, pet service dùng chung.
- `src/components/ui/AccountField.jsx`: nhãn, input, lỗi liên kết bằng ARIA, nút hiện/ẩn mật khẩu.
- `src/services/mock/customerRepository.js`: nguồn dữ liệu tài khoản/thú cưng duy nhất.
- `src/services/customerMapper.js`: ánh xạ tên trường SQL sang model frontend; không coi schema là hợp đồng REST đã được duyệt.
- `src/services/petService.js`: export tương thích cho booking, không duy trì kho mock riêng.
- `src/styles/account.css`: CSS giới hạn vào các trang mới.

Giữ vị trí các trang/component booking đã hoàn thành để giảm thay đổi vào màn hình được duyệt. Xóa các placeholder cũ của bốn tính năng, sửa barrel export và router. Admin không thay đổi.

## Dữ liệu và phiên dùng thử

Tài khoản mẫu: `minhthuan@meomeo.vn`, mật khẩu `Meomeo123!`.

Thông tin tài khoản, pet và trạng thái pet được lưu dưới khóa localStorage `meomeo:customers:v1`. Phiên dùng thử lưu ID ở sessionStorage; chọn ghi nhớ sẽ lưu ID ở localStorage. Không tạo JWT, token hoặc OAuth giả. Mật khẩu đăng ký chỉ giữ trong Map ở bộ nhớ, không ghi xuống trình duyệt; sau tải lại trang, tài khoản mới không thể đăng nhập lại bằng mật khẩu đó. Phiên đăng nhập đã mở vẫn được khôi phục. Đây là giới hạn được thông báo trong mục tài khoản dùng thử của giao diện.

Google chỉ hiển thị thông báo bản trình diễn. Dữ liệu thú cưng lọc bằng ownerId và status; tài khoản mới bắt đầu với danh sách rỗng. Guest có danh sách pet tạm riêng trong bộ nhớ. Các booking mẫu thuộc tài khoản số 1; tài khoản đăng ký khác không thấy hoặc sửa chúng. Luồng booking mock hiện hữu không được nâng cấp thành backend hay hệ thống lưu booking hoàn chỉnh trong công việc này.

Ảnh JPG/PNG/WebP dưới 2 MB chỉ xem trước trong bộ nhớ. Khi ghi dữ liệu, loại bỏ data/blob URL khỏi bản lưu, không lưu ảnh lớn vào localStorage. Tải lại trang sẽ bỏ ảnh xem trước.

## Mapping SQL

Nguồn: `database/spathucung.sql`, không sửa schema hoặc backend.

| SQL nguoidung | Model |
|---|---|
| manguoidung, hoten, email | id, fullName, email |
| sodienthoai nullable, UNIQUE | phone nullable; không bắt buộc và kiểm tra trùng |
| nhacungcap LOCAL/GOOGLE | provider; hiển thị phương thức đăng nhập |
| vaitro, trangthai | role, status |
| ngaytao, ngaycapnhat | createdAt, updatedAt |

Không đọc/đưa `matkhau`, `googleid` ra UI. Email là định danh chỉ đọc trong profile, giới hạn 100 ký tự. Số điện thoại không bắt buộc, kiểm tra 9–15 chữ số (có thể có dấu +).

| SQL thucung | Model |
|---|---|
| mathucung, manguoidung | id, ownerId |
| tenthucung varchar(100) | name |
| loaithucung DOG/CAT/OTHER | type và species tiếng Việt cho booking cũ |
| giong nullable varchar(100) | breed nullable |
| cannang decimal(5,2) | weightKg, > 0 và <= 999.99, tối đa 2 số thập phân |
| hinhanh nullable | imageUrl, preview chỉ trong phiên |
| trangthai mặc định 1 | status; gỡ chuyển thành 0 |
| ngaytao, ngaycapnhat | createdAt, updatedAt |

`avatarTone` chỉ phục vụ trình bày. Không xóa bản ghi pet hoặc sửa snapshot thú cưng trong lịch sử booking. Các khóa ngoại datlich/thucung có ON UPDATE CASCADE, không có ON DELETE CASCADE.

## Nối Spring Boot sau này

Thay mock implementation trong chính các module sau, giữ nguyên interface mà UI sử dụng:

- `features/auth/services/authService.js`: login, register, logout, getCurrentUser.
- `features/profile/services/profileService.js`: getProfile, updateProfile.
- `features/pets/services/petService.js`: getMyPets, getPetById, createPet, updatePet, deletePet.

`services/dataSource.js` đọc `VITE_DATA_SOURCE=mock`; giá trị khác báo chưa cấu hình để tránh âm thầm dùng mock khi tưởng đã nối API. Chưa có API adapter. Dùng Axios client có sẵn khi DTO, endpoint và cơ chế auth được backend xác nhận; tài liệu này không đặt ra URL API giả.

Backend cần tự xác định customer từ phiên xác thực, kiểm tra quyền sở hữu, trạng thái, tính duy nhất email/số điện thoại và áp dụng validation. ID lưu trên trình duyệt hiện tại chỉ phục vụ demo.

## Kiểm tra

Build: `npm run build --prefix frontend` đạt; `git diff --check` đạt. Browser Chrome headless kiểm tra validation, đăng ký trùng email, đăng nhập sai/đúng, hiện mật khẩu, thông báo Google, ghi nhớ phiên và khôi phục sau reload, cập nhật header, sửa/hủy profile có phone rỗng, CRUD pet, soft delete, pet xuất hiện ở booking, dữ liệu hai tài khoản, logout và redirect. Guest đã đi hết form và nhận mã booking mock. Smoke test services, booking detail, reschedule và Admin đều render. Không ghi nhận React runtime exception hoặc console warning/error trong các luồng kiểm tra. Kết quả chi tiết: `frontend/node_modules/.cache/customer-flow-results.json` (artifact local). Ảnh bốn giao diện ở `.taste-skill/customer-*.png` được xem trực tiếp; kiểm tra overflow và ảnh lỗi tại 1440/390.

Taste Skill layout checker có cảnh báo `edge-left`, `lines`, `screen-short`, `hero-fold`: công cụ nhận diện form là hero marketing và không hiểu lề trong panel của bố cục ứng dụng chia đôi. Không áp dụng yêu cầu hero một màn hình cho form tài khoản; không có tràn ngang. Perf trên Vite dev báo dung lượng/request/JS và logo gốc gần 3.8 MB; không đạt toàn bộ ngân sách perf. Logo và cách tải bundle cũ nằm ngoài phạm vi thiết kế mới, được giữ để bảo toàn giao diện. Không có request ảnh lỗi; FCP/LCP, layout shift và long-task checks đạt trong lần chạy local. Không coi kết quả local là đo hiệu năng production.

Home, services, booking form/list/detail/reschedule, Footer và Admin không sửa JSX/CSS thiết kế. Header chỉ thay nguồn trạng thái/tên/đăng xuất, giữ markup và CSS hiện hữu. Chưa có baseline ảnh tự động để khẳng định pixel-perfect cho mọi màn hình cũ; việc bảo toàn được kiểm tra bằng diff phạm vi và smoke test.
