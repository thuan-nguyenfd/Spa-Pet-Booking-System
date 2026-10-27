import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import arrowLeftIcon from '../../../assets/icons/booking/arrow-left.svg'
import { ROUTES } from '../../../constants/routes.js'
import { bookingService } from '../../../services/bookingService.js'
import { formatDuration, getTotalDuration } from '../../../utils/bookingDuration.js'
import '../../../styles/booking-detail.css'

const MOCK_START_TIMES = ['09:00', '10:30', '13:00', '14:30', '15:00']

function dateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // taste-skill-ignore
  const day = String(date.getDate()).padStart(2, '0') // taste-skill-ignore
  return `${year}-${month}-${day}`
}

function getTomorrowKey() {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return dateKey(tomorrow)
}

function formatDate(value, options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) {
  if (!value) return 'Chưa có ngày hẹn'
  const date = new Date(`${value}T12:00:00`)
  if (Number.isNaN(date.getTime())) return 'Chưa có ngày hẹn'
  return new Intl.DateTimeFormat('vi-VN', options).format(date)
}

function durationInMinutes(booking) {
  return getTotalDuration(booking?.services ?? [])
}

function BookingRescheduleMessage({ title, children, action }) {
  return (
    <section className="booking-reschedule__message" role="status">
      <h2>{title}</h2>
      {children && <p>{children}</p>}
      {action}
    </section>
  )
}

export default function BookingReschedulePage() {
  const { bookingId } = useParams()
  const [booking, setBooking] = useState(null)
  const [savedBooking, setSavedBooking] = useState(null)
  const [loadState, setLoadState] = useState('loading')
  const [selectedDate, setSelectedDate] = useState(getTomorrowKey)
  const [selectedTime, setSelectedTime] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    let active = true
    setBooking(null)
    setSavedBooking(null)
    setLoadState('loading')
    setSelectedDate(getTomorrowKey())
    setSelectedTime('')
    setSaveError('')

    bookingService.getBookingById(bookingId)
      .then((result) => {
        if (!active) return
        setBooking(result)
        setLoadState(result ? 'ready' : 'not-found')
      })
      .catch(() => {
        if (active) setLoadState('error')
      })

    return () => { active = false }
  }, [bookingId])

  const duration = durationInMinutes(booking)
  const availableTimes = useMemo(() => MOCK_START_TIMES.filter((time) => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes + duration <= 18 * 60
  }), [duration])

  async function submitReschedule(event) {
    event.preventDefault()
    if (!booking || !selectedDate || !selectedTime) return

    setSaving(true)
    setSaveError('')
    try {
      const result = await bookingService.rescheduleBooking(booking.id, {
        date: selectedDate,
        startTime: selectedTime,
      })
      setSavedBooking(result)
    } catch {
      setSaveError('Chưa thể cập nhật lịch hẹn. Bạn thử chọn lại ngày hoặc khung giờ nhé.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="booking-detail-page" lang="vi">
      <div className="booking-detail-page__inner">
        <Link className="booking-detail-page__back" to={ROUTES.BOOKING_DETAIL(bookingId)}>
          <img className="booking-detail-page__back-icon" src={arrowLeftIcon} alt="" /> Chi tiết lịch hẹn
        </Link>

        <header className="booking-reschedule__header">
          <p className="booking-detail-page__code-label">Mã lịch hẹn <span>{booking?.code || 'Đang tải'}</span></p>
          <h1>Đổi lịch hẹn</h1>
          <p>Chọn ngày và giờ phù hợp cho buổi chăm sóc tiếp theo.</p>
        </header>

        {loadState === 'loading' && <div className="booking-reschedule__loading" aria-label="Đang tải lịch hẹn" />}

        {loadState === 'error' && (
          <BookingRescheduleMessage title="Chưa tải được lịch hẹn." >
            Bạn thử quay lại chi tiết lịch hẹn và mở lại thao tác đổi lịch nhé.
          </BookingRescheduleMessage>
        )}

        {loadState === 'not-found' && (
          <BookingRescheduleMessage
            title="Không tìm thấy lịch hẹn này."
            action={<Link className="booking-detail-page__button booking-detail-page__button--primary" to={ROUTES.BOOKINGS}>Về lịch đặt của tôi</Link>}
          />
        )}

        {loadState === 'ready' && booking && savedBooking && (
          <BookingRescheduleMessage
            title="Đã cập nhật lịch hẹn trong bản xem trước."
            action={<Link className="booking-detail-page__button booking-detail-page__button--primary" to={ROUTES.BOOKING_DETAIL(bookingId)}>Xem lịch hẹn</Link>}
          >
            Lịch mới của {savedBooking.pet.name}: {formatDate(savedBooking.appointment.date)} lúc {savedBooking.appointment.startTime}–{savedBooking.appointment.endTime}.
          </BookingRescheduleMessage>
        )}

        {loadState === 'ready' && booking && !savedBooking && booking.bookingStatus !== 'PENDING' && (
          <BookingRescheduleMessage
            title="Lịch hẹn này chưa thể đổi."
            action={<Link className="booking-detail-page__button booking-detail-page__button--primary" to={ROUTES.BOOKING_DETAIL(bookingId)}>Quay lại chi tiết</Link>}
          >
            Bản xem trước chỉ cho phép đổi lịch đang chờ xác nhận.
          </BookingRescheduleMessage>
        )}

        {loadState === 'ready' && booking && !savedBooking && booking.bookingStatus === 'PENDING' && (
          <div className="booking-reschedule__layout">
            <form className="booking-reschedule__form" onSubmit={submitReschedule}>
              <section aria-labelledby="booking-reschedule-date-title">
                <h2 id="booking-reschedule-date-title">Chọn ngày mới</h2>
                <label htmlFor="booking-reschedule-date">Ngày hẹn</label>
                <input
                  id="booking-reschedule-date"
                  type="date"
                  min={getTomorrowKey()}
                  value={selectedDate}
                  onChange={(event) => {
                    setSelectedDate(event.target.value)
                    setSelectedTime('')
                    setSaveError('')
                  }}
                  required
                />
              </section>

              <section aria-labelledby="booking-reschedule-time-title">
                <div className="booking-reschedule__section-heading">
                  <h2 id="booking-reschedule-time-title">Chọn giờ bắt đầu</h2>
                  {selectedDate && <span>{formatDate(selectedDate, { day: 'numeric', month: 'long' })}</span>}
                </div>
                {availableTimes.length > 0 ? (
                  <div className="booking-reschedule__slots" role="group" aria-label="Khung giờ mẫu">
                    {availableTimes.map((time) => (
                      <button
                        aria-pressed={selectedTime === time}
                        className="booking-reschedule__slot"
                        key={time}
                        onClick={() => {
                          setSelectedTime(time)
                          setSaveError('')
                        }}
                        type="button"
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="booking-reschedule__empty">Thời lượng dịch vụ không phù hợp với các khung giờ mẫu.</p>
                )}
                <p className="booking-reschedule__hint">Khung giờ mẫu trong giờ hoạt động 09:00–18:00. Tình trạng thực tế cần được xác nhận với spa.</p>
              </section>

              {saveError && <p className="booking-reschedule__error" role="alert">{saveError}</p>}

              <div className="booking-reschedule__actions">
                <button className="booking-detail-page__button booking-detail-page__button--primary" disabled={!selectedTime || saving} type="submit">
                  {saving ? 'Đang cập nhật…' : 'Xác nhận đổi lịch'}
                </button>
                <Link className="booking-reschedule__cancel" to={ROUTES.BOOKING_DETAIL(bookingId)}>Giữ lịch hiện tại</Link>
              </div>
            </form>

            <aside className="booking-reschedule__summary" aria-labelledby="booking-reschedule-summary-title">
              <h2 id="booking-reschedule-summary-title">Lịch hiện tại</h2>
              <p className="booking-reschedule__pet-name">{booking.pet.name || 'Bé yêu'}</p>
              <p className="booking-reschedule__current-date">{formatDate(booking.appointment.date)}</p>
              <p className="booking-reschedule__current-time">{booking.appointment.startTime}–{booking.appointment.endTime}</p>
              <p className="booking-reschedule__duration">Tổng thời lượng · {formatDuration(duration)}</p>
              <ul>
                {booking.services.map((service) => <li key={service.id ?? service.name}>{service.name}</li>)}
              </ul>
            </aside>
          </div>
        )}
      </div>
    </div>
  )
}
