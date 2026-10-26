import { Link } from 'react-router-dom'
import { ROUTES } from '../../constants/routes.js'
import { formatDuration } from '../../utils/bookingDuration.js'
import { formatVnd } from '../../utils/bookingPrice.js'
import PetAvatar from './PetAvatar.jsx'

function formatDate(date) {
  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(`${date}T12:00:00`))
}

export default function BookingSuccess({ booking, draft }) {
  return (
    <section className="booking-success" aria-labelledby="booking-success-title">
      <div className="booking-success__mark" aria-hidden="true">
        <svg viewBox="0 0 56 56" focusable="false"><path d="m15 29 9 9 18-20" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
      <p className="booking-step-heading__eyebrow">Lịch hẹn tại MEOMEO</p>
      <h1 id="booking-success-title">Đặt lịch thành công!</h1>
      <p className="booking-success__intro">{draft.paymentMethod === 'VNPAY' ? 'Lịch của bé đã được ghi nhận. Thanh toán VNPay sẽ được kết nối trong phiên bản tiếp theo.' : 'Boss đã có lịch spa rồi. Tụi mình mong sớm được đón hai bạn.'}</p>

      <div className="booking-success__code">
        <span>Mã lịch hẹn</span>
        <strong>{booking.bookingCode}</strong>
      </div>

      <div className="booking-success__appointment">
        <div className="booking-success__pet"><PetAvatar pet={draft.pet} /><span><strong>{draft.pet.name}</strong><small>{draft.pet.breed || draft.pet.species} · {draft.pet.weightKg} kg</small></span></div>
        <div><small>Ngày & giờ</small><strong>{formatDate(draft.date)} · {draft.startTime}–{draft.endTime}</strong></div>
        <div><small>Chuyên viên</small><strong>{draft.employee.name}</strong></div>
        <div><small>Dịch vụ · {formatDuration(draft.totalDuration)}</small><strong>{formatVnd(draft.totalPrice)}</strong></div>
      </div>

      <div className="booking-success__actions">
        <Link className="button button--primary booking-action-button" to={ROUTES.BOOKINGS}>Xem lịch đặt của tôi <span aria-hidden="true">↗</span></Link>
        <Link className="booking-text-button" to={ROUTES.HOME}>Về trang chủ</Link>
      </div>
    </section>
  )
}
