import PetAvatar from '../PetAvatar.jsx'
import { formatDuration, getTotalDuration } from '../../../utils/bookingDuration.js'
import { formatVnd } from '../../../utils/bookingPrice.js'
import BookingActionZone from './BookingActionZone.jsx'
import BookingReviewSection from './BookingReviewSection.jsx'

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

function formatAppointmentDate(value) {
  if (!value) return null
  const date = new Date(`${value}T12:00:00`)
  if (Number.isNaN(date.getTime())) return null

  return {
    day: new Intl.DateTimeFormat('vi-VN', { day: 'numeric' }).format(date),
    monthYear: new Intl.DateTimeFormat('vi-VN', { month: 'long', year: 'numeric' }).format(date),
    weekday: new Intl.DateTimeFormat('vi-VN', { weekday: 'long' }).format(date),
  }
}

function formatDisplayDate(value) {
  if (!value) return ''
  const date = new Date(`${value}T12:00:00`)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
}

function formatDisplayDateTime(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

function appointmentDateTime(date, time) {
  return date && time ? `${date}T${time}` : undefined
}

function getPaymentMethod(method) {
  if (method === 'CASH') return 'Thanh toán tại spa'
  if (method === 'VNPAY') return 'VNPay'
  return 'Phương thức khác'
}

function getInitials(name) {
  return String(name || 'MEOMEO')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toLocaleUpperCase('vi-VN')
}

function BookingDetailHeader({ booking }) {
  const status = BOOKING_STATUS[booking.bookingStatus] ?? { label: 'Đang cập nhật', tone: 'unknown' }

  return (
    <header className="booking-detail-page__header">
      <div>
        <p className="booking-detail-page__code-label">Mã lịch hẹn <span>{booking.code || 'Đang cập nhật'}</span></p>
        <h1>Lịch chăm sóc của {booking.pet.name || 'bé'}</h1>
      </div>
      <p className={`booking-detail-page__status booking-detail-page__status--${status.tone}`}>
        <span aria-hidden="true" />
        {status.label}
      </p>
    </header>
  )
}

function AppointmentSchedule({ booking }) {
  const date = formatAppointmentDate(booking.appointment.date)
  const totalDuration = getTotalDuration(booking.services)

  return (
    <section className="booking-detail-page__schedule" aria-labelledby="booking-detail-schedule-title">
      <h2 className="booking-detail-page__visually-hidden" id="booking-detail-schedule-title">Ngày và giờ hẹn</h2>
      <div className="booking-detail-page__schedule-date">
        <span className="booking-detail-page__schedule-weekday">{date?.weekday ?? 'Ngày hẹn'}</span>
        <strong>{date?.day ?? '—'}</strong>
        <span className="booking-detail-page__schedule-month">{date?.monthYear ?? 'Chưa có ngày'}</span>
      </div>
      <div className="booking-detail-page__schedule-times">
        <div className="booking-detail-page__schedule-time">
          <span>Bắt đầu</span>
          <time dateTime={appointmentDateTime(booking.appointment.date, booking.appointment.startTime)}>
            {booking.appointment.startTime || '—'}
          </time>
        </div>
        <div className="booking-detail-page__schedule-duration">
          <span aria-hidden="true" />
          <span>{formatDuration(totalDuration) || 'Thời lượng chưa rõ'}</span>
        </div>
        <div className="booking-detail-page__schedule-time booking-detail-page__schedule-time--end">
          <span>Kết thúc dự kiến</span>
          <time dateTime={appointmentDateTime(booking.appointment.date, booking.appointment.endTime)}>
            {booking.appointment.endTime || '—'}
          </time>
        </div>
      </div>
    </section>
  )
}

function PetAndEmployee({ booking }) {
  const petDetails = [booking.pet.breed, booking.pet.species, booking.pet.weight ? `${booking.pet.weight} kg` : '']
    .filter(Boolean)
    .join(' · ')

  return (
    <section className="booking-detail-page__people" aria-label="Thú cưng và chuyên viên">
      <div className="booking-detail-page__pet">
        <PetAvatar pet={booking.pet} className="booking-detail-page__pet-avatar" />
        <div>
          <p className="booking-detail-page__field-label">Thú cưng</p>
          <h2>{booking.pet.name || 'Bé yêu'}</h2>
          <p>{petDetails || 'Thông tin sẽ được cập nhật'}</p>
        </div>
      </div>

      <div className="booking-detail-page__employee">
        {booking.employee.avatarUrl ? (
          <img className="booking-detail-page__employee-avatar" src={booking.employee.avatarUrl} alt="" />
        ) : (
          <span className="booking-detail-page__employee-avatar booking-detail-page__employee-avatar--initials" aria-hidden="true">
            {getInitials(booking.employee.name)}
          </span>
        )}
        <div>
          <p className="booking-detail-page__field-label">Chuyên viên</p>
          <h2>{booking.employee.name || 'MEOMEO sẽ cập nhật'}</h2>
          <p>Phụ trách buổi chăm sóc này</p>
        </div>
      </div>
    </section>
  )
}

function ServiceSnapshot({ booking }) {
  const services = booking.services ?? []
  const totalDuration = getTotalDuration(services)

  return (
    <section className="booking-detail-page__services" aria-labelledby="booking-detail-services-title">
      <header className="booking-detail-page__section-heading">
        <h2 id="booking-detail-services-title">Dịch vụ đã đặt</h2>
        <span>{services.length} dịch vụ</span>
      </header>

      {services.length ? (
        <ul className="booking-detail-page__service-list">
          {services.map((service, index) => (
            <li key={service.bookingDetailId ?? service.id ?? index}>
              <div>
                <h3>{service.name || 'Dịch vụ spa'}</h3>
                <p>{formatDuration(service.durationMinutes) || 'Thời lượng chưa rõ'}</p>
              </div>
              <strong>{formatVnd(service.price)}</strong>
            </li>
          ))}
        </ul>
      ) : (
        <p className="booking-detail-page__quiet-copy">Không có dịch vụ trong lịch hẹn này.</p>
      )}

      <div className="booking-detail-page__service-totals">
        <div>
          <span>Tổng thời lượng</span>
          <strong>{formatDuration(totalDuration) || 'Chưa xác định'}</strong>
        </div>
        <div className="booking-detail-page__grand-total">
          <span>Tổng cộng</span>
          <strong>{formatVnd(booking.totalPrice)}</strong>
        </div>
      </div>
    </section>
  )
}

function PaymentAndNotes({ booking }) {
  const paymentStatus = PAYMENT_STATUS[booking.paymentStatus] ?? 'Đang cập nhật'
  const paidAt = formatDisplayDateTime(booking.payment.paidAt)

  return (
    <aside className="booking-detail-page__aside">
      <section className="booking-detail-page__payment" aria-labelledby="booking-detail-payment-title">
        <h2 id="booking-detail-payment-title">Thanh toán</h2>
        <strong className="booking-detail-page__payment-amount">{formatVnd(booking.payment.amount || booking.totalPrice)}</strong>
        <dl>
          <div><dt>Phương thức</dt><dd>{getPaymentMethod(booking.payment.method)}</dd></div>
          <div><dt>Trạng thái</dt><dd>{paymentStatus}</dd></div>
        </dl>
        {paidAt && <p className="booking-detail-page__paid-at">Thanh toán lúc {paidAt}</p>}
      </section>

      {booking.note?.trim() && (
        <section className="booking-detail-page__note" aria-labelledby="booking-detail-note-title">
          <h2 id="booking-detail-note-title">Ghi chú cho spa</h2>
          <p>“{booking.note}”</p>
        </section>
      )}

      {booking.bookingStatus === 'CANCELLED' && booking.cancellationReason && (
        <section className="booking-detail-page__cancellation-reason" aria-labelledby="booking-detail-cancellation-title">
          <h2 id="booking-detail-cancellation-title">Lý do hủy</h2>
          <p>“{booking.cancellationReason}”</p>
        </section>
      )}
    </aside>
  )
}

function BookingProgress({ status }) {
  if (status === 'CANCELLED') {
    return (
      <section className="booking-detail-page__progress" aria-labelledby="booking-detail-progress-title">
        <h2 id="booking-detail-progress-title">Tiến trình lịch hẹn</h2>
        <ol className="booking-detail-page__progress-list booking-detail-page__progress-list--cancelled">
          <li className="is-complete"><span aria-hidden="true" /><span>Đã đặt</span></li>
          <li className="is-cancelled" aria-current="step"><span aria-hidden="true" /><span>Đã hủy</span></li>
        </ol>
      </section>
    )
  }

  const currentIndex = { PENDING: 0, CONFIRMED: 1, COMPLETED: 2 }[status]
  if (currentIndex === undefined) return null

  const steps = ['Đã đặt', 'Đã xác nhận', 'Hoàn thành']
  const descriptions = {
    PENDING: 'Lịch hẹn đang chờ MEOMEO xác nhận.',
    CONFIRMED: 'Lịch hẹn đã được MEOMEO xác nhận.',
    COMPLETED: 'Buổi chăm sóc đã hoàn tất.',
  }

  return (
    <section className="booking-detail-page__progress" aria-labelledby="booking-detail-progress-title">
      <h2 id="booking-detail-progress-title">Tiến trình lịch hẹn</h2>
      <ol className="booking-detail-page__progress-list">
        {steps.map((label, index) => {
          const state = index < currentIndex ? 'is-complete' : index === currentIndex ? 'is-current' : ''
          return (
            <li className={state} key={label} aria-current={index === currentIndex ? 'step' : undefined}>
              <span aria-hidden="true" />
              <span>{label}</span>
            </li>
          )
        })}
      </ol>
      <p>{descriptions[status]}</p>
    </section>
  )
}

export function BookingDetailContent({ booking, onCancel, onSubmitReview }) {
  return (
    <>
      <BookingDetailHeader booking={booking} />
      <AppointmentSchedule booking={booking} />
      <PetAndEmployee booking={booking} />

      <div className="booking-detail-page__information-grid">
        <ServiceSnapshot booking={booking} />
        <PaymentAndNotes booking={booking} />
      </div>

      <BookingProgress status={booking.bookingStatus} />
      <BookingActionZone booking={booking} onCancel={onCancel} />
      <BookingReviewSection booking={booking} onSubmit={onSubmitReview} />
    </>
  )
}

export function BookingDetailSkeleton() {
  return (
    <div className="booking-detail-page__skeleton" role="status" aria-label="Đang tải chi tiết lịch hẹn">
      <span className="booking-detail-page__skeleton-line booking-detail-page__skeleton-line--back" />
      <span className="booking-detail-page__skeleton-line booking-detail-page__skeleton-line--title" />
      <span className="booking-detail-page__skeleton-schedule" />
      <span className="booking-detail-page__skeleton-line booking-detail-page__skeleton-line--people" />
      <span className="booking-detail-page__visually-hidden">Đang tải chi tiết lịch hẹn…</span>
    </div>
  )
}

export function BookingDetailMessage({ title, message, action }) {
  return (
    <section className="booking-detail-page__message" aria-live="polite">
      <h1>{title}</h1>
      {message && <p>{message}</p>}
      {action}
    </section>
  )
}

export { formatDisplayDate }
