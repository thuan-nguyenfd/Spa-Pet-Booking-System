import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PetAvatar from '../../../components/booking/PetAvatar.jsx'
import searchIcon from '../../../assets/icons/booking/look.svg'
import { ROUTES } from '../../../constants/routes.js'
import { bookingService } from '../../../services/bookingService.js'
import { formatVnd } from '../../../utils/bookingPrice.js'
import '../../../styles/my-bookings.css'

const FILTERS = [
  { id: 'ALL', label: 'Tất cả' },
  { id: 'UPCOMING', label: 'Sắp tới' },
  { id: 'COMPLETED', label: 'Đã hoàn thành' },
  { id: 'CANCELLED', label: 'Đã hủy' },
]

const BOOKING_STATUS = {
  PENDING: { label: 'Chờ xác nhận', tone: 'pending' },
  CONFIRMED: { label: 'Đã xác nhận', tone: 'confirmed' },
  COMPLETED: { label: 'Hoàn thành', tone: 'completed' },
  CANCELLED: { label: 'Đã hủy', tone: 'cancelled' },
}

const PAYMENT_STATUS = {
  UNPAID: 'Chưa thanh toán',
  PAID: 'Đã thanh toán',
}

function matchesFilter(booking, filter) {
  if (filter === 'UPCOMING') return ['PENDING', 'CONFIRMED'].includes(booking.bookingStatus)
  if (filter === 'COMPLETED' || filter === 'CANCELLED') return booking.bookingStatus === filter
  return true
}

function normalizeSearchText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('vi-VN')
    .replace(/đ/g, 'd')
}

function matchesSearch(booking, searchQuery) {
  const query = normalizeSearchText(searchQuery.trim())
  if (!query) return true

  const date = formatAppointmentDate(booking.appointment.date)
  const fields = [
    booking.code,
    booking.pet.name,
    booking.pet.breed,
    booking.pet.species,
    booking.pet.weight,
    booking.employee.name,
    booking.appointment.date,
    `${date.weekday} ${date.day} ${date.monthYear}`,
    BOOKING_STATUS[booking.bookingStatus]?.label,
    PAYMENT_STATUS[booking.paymentStatus],
    getPaymentMethodLabel(booking.payment.method),
    ...booking.services.map((service) => service.name),
  ]

  return fields.some((field) => normalizeSearchText(field).includes(query))
}

function getPaymentMethodLabel(method) {
  if (method === 'CASH') return 'Thanh toán tại spa'
  if (method === 'VNPAY') return 'VNPay'
  return 'Phương thức thanh toán'
}

function formatAppointmentDate(value) {
  if (!value) return { day: '—', monthYear: 'Chưa có ngày', weekday: '' }
  const date = new Date(`${value}T12:00:00`)
  if (Number.isNaN(date.getTime())) return { day: '—', monthYear: 'Chưa có ngày', weekday: '' }

  return {
    day: new Intl.DateTimeFormat('vi-VN', { day: 'numeric' }).format(date),
    monthYear: new Intl.DateTimeFormat('vi-VN', { month: 'long', year: 'numeric' }).format(date),
    weekday: new Intl.DateTimeFormat('vi-VN', { weekday: 'long' }).format(date),
  }
}

function BookingStatus({ status }) {
  const statusInfo = BOOKING_STATUS[status] ?? { label: 'Đang cập nhật', tone: 'unknown' }
  return (
    <span className={`my-bookings-page__status my-bookings-page__status--${statusInfo.tone}`}>
      <span className="my-bookings-page__status-dot" aria-hidden="true" />
      {statusInfo.label}
    </span>
  )
}

function BookingListItem({ booking, isNext }) {
  const { day, monthYear, weekday } = formatAppointmentDate(booking.appointment.date)
  const displayedServices = booking.services.slice(0, 2)
  const remainingServices = Math.max(booking.services.length - displayedServices.length, 0)
  const paymentMethod = getPaymentMethodLabel(booking.payment.method)
  const paymentStatus = PAYMENT_STATUS[booking.paymentStatus] ?? 'Trạng thái thanh toán đang cập nhật'

  return (
    <li className="my-bookings-page__list-item">
      <article className={`my-bookings-page__booking${isNext ? ' my-bookings-page__booking--next' : ''}`} aria-labelledby={`booking-pet-${booking.id}`}>
        <div className="my-bookings-page__date" aria-label={`${weekday} ${day} ${monthYear}, ${booking.appointment.startTime} đến ${booking.appointment.endTime}`}>
          <span className="my-bookings-page__date-weekday">{weekday}</span>
          <span className="my-bookings-page__date-day">{day}</span>
          <span className="my-bookings-page__date-month">{monthYear}</span>
          <span className="my-bookings-page__date-time">{booking.appointment.startTime}–{booking.appointment.endTime}</span>
        </div>

        <div className="my-bookings-page__pet">
          <PetAvatar pet={booking.pet} className="my-bookings-page__pet-avatar" />
          <div className="my-bookings-page__pet-copy">
            <span className="my-bookings-page__code">{booking.code}</span>
            <h2 id={`booking-pet-${booking.id}`}>{booking.pet.name || 'Thú cưng'}</h2>
            <p>{booking.pet.breed || booking.pet.species}{booking.pet.weight ? ` · ${booking.pet.weight} kg` : ''}</p>
          </div>
        </div>

        <div className="my-bookings-page__services">
          <div className="my-bookings-page__service-group">
            <span className="my-bookings-page__field-label">Dịch vụ</span>
            <ul>
              {displayedServices.map((service) => <li key={service.bookingDetailId ?? service.id}>{service.name}</li>)}
              {remainingServices > 0 && <li className="my-bookings-page__more-services">+{remainingServices} dịch vụ</li>}
            </ul>
          </div>
          <div className="my-bookings-page__employee">
            <span className="my-bookings-page__field-label">Chuyên viên</span>
            <strong>{booking.employee.name || 'Sẽ cập nhật'}</strong>
          </div>
        </div>

        <div className="my-bookings-page__aside">
          <div className="my-bookings-page__payment">
            <BookingStatus status={booking.bookingStatus} />
            <span>{paymentMethod}</span>
            <span>{paymentStatus}</span>
          </div>
          <div className="my-bookings-page__action">
            <div className="my-bookings-page__total">
              <span>Tổng thanh toán</span>
              <strong>{formatVnd(booking.totalPrice)}</strong>
            </div>
            <Link className="my-bookings-page__detail-link" to={ROUTES.BOOKING_DETAIL(booking.id)}>
              Xem chi tiết <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </article>
    </li>
  )
}

function BookingSkeleton() {
  return (
    <div className="my-bookings-page__skeleton" role="status" aria-label="Đang tải lịch hẹn">
      {[0, 1, 2].map((item) => (
        <div className="my-bookings-page__skeleton-row" key={item} aria-hidden="true">
          <span className="my-bookings-page__skeleton-date" />
          <span className="my-bookings-page__skeleton-pet" />
          <span className="my-bookings-page__skeleton-services" />
          <span className="my-bookings-page__skeleton-status" />
        </div>
      ))}
      <span className="my-bookings-page__visually-hidden">Đang tải lịch hẹn của bạn…</span>
    </div>
  )
}

function getEmptyState(filter, hasAnyBooking) {
  if (!hasAnyBooking) {
    return {
      title: 'Chưa có lịch hẹn nào',
      message: 'Một buổi spa thơm tho đang chờ bạn và bé chọn ngày ghé MEOMEO.',
      showBookingLink: true,
    }
  }

  if (filter === 'UPCOMING') {
    return {
      title: 'Chưa có lịch hẹn sắp tới',
      message: 'Bạn có thể chọn một ngày mới để bé ghé spa chăm sóc.',
      showBookingLink: true,
    }
  }

  if (filter === 'COMPLETED') {
    return { title: 'Chưa có buổi hẹn hoàn thành', message: 'Những lần ghé spa đã xong sẽ được lưu lại ở đây.', showBookingLink: false }
  }

  return { title: 'Không có lịch hẹn đã hủy', message: 'Mong rằng các buổi hẹn sắp tới đều diễn ra thật vui.', showBookingLink: false }
}

function BookingEmptyState({ filter, hasAnyBooking, searchQuery, onClearSearch }) {
  if (searchQuery.trim()) {
    return (
      <div className="my-bookings-page__empty my-bookings-page__empty--search">
        <h2>Không tìm thấy lịch hẹn phù hợp</h2>
        <p>Thử tìm bằng mã lịch, tên thú cưng, dịch vụ hoặc chuyên viên.</p>
        <button className="my-bookings-page__clear-search" type="button" onClick={onClearSearch}>Xóa từ khóa tìm kiếm</button>
      </div>
    )
  }

  const content = getEmptyState(filter, hasAnyBooking)
  return (
    <div className="my-bookings-page__empty">
      <h2>{content.title}</h2>
      <p>{content.message}</p>
      {content.showBookingLink && <Link to={ROUTES.BOOKING}>Đặt lịch ngay <span aria-hidden="true">→</span></Link>}
    </div>
  )
}

function sortBookings(bookings) {
  const upcomingStatus = new Set(['PENDING', 'CONFIRMED'])
  return [...bookings].sort((left, right) => {
    const leftUpcoming = upcomingStatus.has(left.bookingStatus)
    const rightUpcoming = upcomingStatus.has(right.bookingStatus)
    if (leftUpcoming !== rightUpcoming) return leftUpcoming ? -1 : 1

    const dateOrder = left.appointment.date.localeCompare(right.appointment.date)
    return leftUpcoming ? dateOrder : -dateOrder
  })
}

export default function MyBookingsPage() {
  const [filter, setFilter] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [bookings, setBookings] = useState([])
  const [loadState, setLoadState] = useState('loading')

  const loadBookings = useCallback(async () => {
    setLoadState('loading')
    try {
      const result = await bookingService.getMyBookings()
      setBookings(result)
      setLoadState('ready')
    } catch {
      setLoadState('error')
    }
  }, [])

  useEffect(() => { loadBookings() }, [loadBookings])

  const sortedBookings = useMemo(() => sortBookings(bookings), [bookings])
  const filteredBookings = useMemo(() => sortedBookings.filter((booking) => (
    matchesFilter(booking, filter) && matchesSearch(booking, searchQuery)
  )), [sortedBookings, filter, searchQuery])
  const nextBookingId = sortedBookings.find((booking) => ['PENDING', 'CONFIRMED'].includes(booking.bookingStatus))?.id

  return (
    <div className="my-bookings-page" lang="vi">
      <div className="my-bookings-page__inner">
        <header className="my-bookings-page__header">
          <p className="my-bookings-page__context">Lịch hẹn tại MEOMEO</p>
          <h1>Lịch đặt của tôi</h1>
          <p className="my-bookings-page__intro">Theo dõi những buổi hẹn sắp tới và lưu lại hành trình chăm sóc của bé.</p>
        </header>

        <div className="my-bookings-page__search" role="search">
          <label htmlFor="my-bookings-search">Tìm lịch hẹn</label>
          <div className="my-bookings-page__search-control">
            <img src={searchIcon} alt="" aria-hidden="true" />
            <input
              id="my-bookings-search"
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Mã lịch, thú cưng, dịch vụ, chuyên viên"
              autoComplete="off"
            />
            {searchQuery && (
              <button type="button" aria-label="Xóa từ khóa tìm kiếm" onClick={() => setSearchQuery('')}>
                <span aria-hidden="true">×</span>
              </button>
            )}
          </div>
        </div>

        <nav className="my-bookings-page__filters" aria-label="Lọc lịch hẹn">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={filter === item.id}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {loadState === 'loading' && <BookingSkeleton />}

        {loadState === 'error' && (
          <div className="my-bookings-page__error" role="alert">
            <p>Chưa tải được lịch hẹn.</p>
            <button type="button" onClick={loadBookings}>Thử lại</button>
          </div>
        )}

        {loadState === 'ready' && filteredBookings.length > 0 && (
          <ul className="my-bookings-page__list" aria-label="Các lịch hẹn">
            {filteredBookings.map((booking) => (
              <BookingListItem key={booking.id} booking={booking} isNext={booking.id === nextBookingId} />
            ))}
          </ul>
        )}

        {loadState === 'ready' && filteredBookings.length === 0 && (
          <BookingEmptyState
            filter={filter}
            hasAnyBooking={bookings.length > 0}
            searchQuery={searchQuery}
            onClearSearch={() => setSearchQuery('')}
          />
        )}
      </div>
    </div>
  )
}
