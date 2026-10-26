import bathPhoto from '../assets/images/services/dog-shower-animal-photography.webp'
import trimPhoto from '../assets/images/services/white-shih-tzu-trimmed.jpg'
import brushPhoto from '../assets/images/services/brushing-out-the-pyrenees-2.jpg'
import comboPhoto from '../assets/images/services/sage-mix.jpg'

const priceBands = (upTo5, upTo10, upTo20, over20) => [
  { maxWeightKg: 5, priceVnd: upTo5 },
  { maxWeightKg: 10, priceVnd: upTo10 },
  { maxWeightKg: 20, priceVnd: upTo20 },
  { maxWeightKg: null, priceVnd: over20 },
]

// Mirrors the current DichVu fields and adds GiaDichVu-style weight bands.
export const MOCK_SERVICES = [
  {
    id: 1,
    name: 'Tắm thơm & sấy lông',
    category: 'SINGLE',
    durationMinutes: 60,
    imageUrl: bathPhoto,
    description: 'Làm sạch nhẹ nhàng, sấy khô và chải lại bộ lông.',
    priceBands: priceBands(120000, 150000, 190000, 230000),
  },
  {
    id: 2,
    name: 'Cắt tỉa tạo kiểu',
    category: 'SINGLE',
    durationMinutes: 90,
    imageUrl: trimPhoto,
    description: 'Tỉa gọn theo dáng lông và sự thoải mái của boss.',
    priceBands: priceBands(180000, 230000, 290000, 360000),
  },
  {
    id: 3,
    name: 'Chải lông & gỡ rối',
    category: 'SINGLE',
    durationMinutes: 30,
    imageUrl: brushPhoto,
    description: 'Gỡ rối vừa tay, giúp bộ lông mềm và tơi hơn.',
    priceBands: priceBands(80000, 100000, 140000, 180000),
  },
  {
    id: 4,
    name: 'Gói chăm sóc trọn buổi',
    category: 'COMBO',
    durationMinutes: 150,
    imageUrl: comboPhoto,
    description: 'Kết hợp tắm, sấy, chải lông và chăm chút diện mạo.',
    priceBands: priceBands(320000, 390000, 490000, 590000),
  },
]
