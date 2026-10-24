import bathPhoto from '../../assets/images/services/dog-shower-animal-photography.webp'
import trimPhoto from '../../assets/images/services/white-shih-tzu-trimmed.jpg'
import brushPhoto from '../../assets/images/services/brushing-out-the-pyrenees-2.jpg'
import comboPhoto from '../../assets/images/services/sage-mix.jpg'

// Shape follows database/spathucung.sql: dichvu + UI-only image attribution lives separately.
export const SERVICES = [
  {
    madichvu: 1,
    ten: 'Tắm thơm & sấy lông',
    loaidichvu: 'SINGLE',
    thoiluongphut: 60,
    hinhanh: bathPhoto,
    mota: 'Làm sạch nhẹ nhàng, sấy khô và chải lại bộ lông.',
    trangthai: 1,
  },
  {
    madichvu: 2,
    ten: 'Cắt tỉa tạo kiểu',
    loaidichvu: 'SINGLE',
    thoiluongphut: 90,
    hinhanh: trimPhoto,
    mota: 'Tỉa gọn theo dáng lông và sự thoải mái của boss.',
    trangthai: 1,
  },
  {
    madichvu: 3,
    ten: 'Chải lông & gỡ rối',
    loaidichvu: 'SINGLE',
    thoiluongphut: 30,
    hinhanh: brushPhoto,
    mota: 'Gỡ rối vừa tay, giữ lớp lông mềm và tơi hơn.',
    trangthai: 1,
  },
  {
    madichvu: 4,
    ten: 'Gói chăm sóc trọn buổi',
    loaidichvu: 'COMBO',
    thoiluongphut: 150,
    hinhanh: comboPhoto,
    mota: 'Kết hợp tắm, sấy, chải lông và chăm chút diện mạo.',
    trangthai: 1,
  },
]

export const SERVICE_CREDITS = {
  1: {
    label: 'Dog shower, animal photography · CC0',
    title: 'Dog shower, animal photography',
    creator: 'rawpixel',
    licence: 'CC0 1.0',
    source: 'rawpixel',
    href: 'https://www.rawpixel.com/image/6025967/photo-image-public-domain-person-dog',
  },
  2: {
    label: 'White Shih tzu Trimmed · CC BY-SA 3.0',
    title: 'White Shih tzu Trimmed',
    creator: 'Cenedlaetholwr Cymreig',
    licence: 'CC BY-SA 3.0',
    source: 'Wikimedia Commons',
    href: 'https://commons.wikimedia.org/w/index.php?curid=98875190',
  },
  3: {
    label: 'Brushing Out the Pyrenees 2 · CC BY-SA 2.0',
    title: 'Brushing Out the Pyrenees 2',
    creator: 'Monkey Mash Button',
    licence: 'CC BY-SA 2.0',
    source: 'Flickr',
    href: 'https://www.flickr.com/photos/62698615@N08/7192358190',
  },
  4: {
    label: 'Sage Mix · CC BY-SA 2.0',
    title: 'Sage Mix',
    creator: 'anglerp1',
    licence: 'CC BY-SA 2.0',
    source: 'Flickr',
    href: 'https://www.flickr.com/photos/88869149@N00/457382511',
  },
}

export const SAMPLE_REVIEWS = [
  {
    id: 1,
    userName: 'Ngọc Anh',
    petName: 'Mochi',
    rating: 5,
    comment: 'Mochi về nhà thơm tho, lông mềm mà vẫn rất thoải mái.',
  },
  {
    id: 2,
    userName: 'Gia Linh',
    petName: 'Bắp',
    rating: 5,
    comment: 'Mình thích nhất là có thời lượng rõ để dễ sắp xếp lịch.',
  },
  {
    id: 3,
    userName: 'Thanh Hà',
    petName: 'Đậu',
    rating: 5,
    comment: 'Bộ lông được chải gọn, nhìn Đậu nhẹ nhõm hẳn.',
  },
]

export const CONTACT_INFO = {
  phone: '09xx xxx xxx',
  email: 'hello@meomeo.vn',
  address: 'Địa chỉ spa sẽ cập nhật',
}
