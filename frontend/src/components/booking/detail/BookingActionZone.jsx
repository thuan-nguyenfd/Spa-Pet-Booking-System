import { useState } from 'react'
import { Link } from 'react-router-dom'
import arrowRightIcon from '../../../assets/icons/booking/arrow-right.svg'
import { ROUTES } from '../../../constants/routes.js'
import { getBookingActions } from '../../../utils/bookingDetail.js'

function formatDate(value) {
  if (!value) return 'Ngày hẹn chưa được cập nhật'
  const date = new Date(`${value}T12:00:00`)
  if (Number.isNaN(date.getTime())) return 'Ngày hẹn chưa được cập nhật'
  return new Intl.DateTimeFormat('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' }).format(date)
}

export default function BookingActionZone({ booking, onCancel }) {
  const [cancelExpanded, setCancelExpanded] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [paymentNotice, setPaymentNotice] = useState('')
  const actions = getBookingActions(booking)

  function submitCancellation(event) {
    event.preventDefault()
    onCancel(cancelReason.trim() || null)
    setCancelExpanded(false)
    setCancelReason('')
  }

  return (
    <section className="booking-detail-page__actions" aria-labelledby="booking-detail-actions-title">
      <div className="booking-detail-page__action-heading">
        <div>
          <p className="booking-detail-page__field-label">Lịch hẹn của bạn</p>
          <h2 id="booking-detail-actions-title">Quản lý lịch hẹn</h2>
        </div>
      </div>

      {actions.canReschedule || actions.canPay || actions.canCancel ? (
        <div className="booking-detail-page__action-list">
          {actions.canReschedule && (
            <Link className="booking-detail-page__button booking-detail-page__button--primary booking-detail-page__button--reschedule" to={ROUTES.BOOKING_RESCHEDULE(booking.id)}>
              <span className="booking-detail-page__reschedule-label">Đổi lịch</span> <img className="booking-detail-page__action-arrow" src={arrowRightIcon} alt="" />
            </Link>
          )}
          {actions.canPay && (
            <button className="booking-detail-page__button booking-detail-page__button--secondary" type="button" onClick={() => setPaymentNotice('Thanh toán VNPay sẽ được kết nối trong phiên bản tiếp theo.')}>
              Thanh toán VNPay
            </button>
          )}
          {actions.canCancel && (
            <button
              className="booking-detail-page__cancel-trigger"
              type="button"
              aria-expanded={cancelExpanded}
              aria-controls={`booking-cancel-${booking.id}`}
              onClick={() => setCancelExpanded((expanded) => !expanded)}
            >
              {cancelExpanded ? 'Đóng phần hủy lịch' : 'Hủy lịch'}
            </button>
          )}
        </div>
      ) : (
        <p className="booking-detail-page__action-message">
          {booking.bookingStatus === 'PENDING' && booking.paymentStatus === 'PAID'
            ? 'Lịch hẹn đã được thanh toán. Nếu cần hủy, vui lòng liên hệ MEOMEO để được hỗ trợ.'
            : booking.bookingStatus === 'CONFIRMED'
              ? 'Lịch hẹn đã được MEOMEO xác nhận.'
              : booking.bookingStatus === 'COMPLETED'
                ? 'Cảm ơn bạn đã để MEOMEO chăm sóc bé.'
                : booking.bookingStatus === 'CANCELLED'
                  ? 'Lịch hẹn này đã kết thúc.'
                  : 'Các thao tác sẽ hiển thị khi trạng thái lịch hẹn được cập nhật.'}
        </p>
      )}

      {paymentNotice && <p className="booking-detail-page__payment-notice" role="status">{paymentNotice}</p>}

      {cancelExpanded && actions.canCancel && (
        <form className="booking-detail-page__cancel-form" id={`booking-cancel-${booking.id}`} onSubmit={submitCancellation}>
          <h3>Bạn muốn hủy lịch này?</h3>
          <p className="booking-detail-page__cancel-summary">
            <strong>{booking.pet.name || 'Bé yêu'}</strong>
            <span>{formatDate(booking.appointment.date)} · {booking.appointment.startTime}–{booking.appointment.endTime}</span>
          </p>
          <label htmlFor={`booking-cancel-reason-${booking.id}`}>Lý do hủy <span>(không bắt buộc)</span></label>
          <textarea
            id={`booking-cancel-reason-${booking.id}`}
            rows="3"
            value={cancelReason}
            onChange={(event) => setCancelReason(event.target.value)}
            placeholder="Chia sẻ lý do để MEOMEO hỗ trợ bạn tốt hơn"
          />
          <p className="booking-detail-page__cancel-warning">Hành động này không thể hoàn tác.</p>
          <div className="booking-detail-page__cancel-actions">
            <button className="booking-detail-page__button booking-detail-page__button--quiet" type="button" onClick={() => setCancelExpanded(false)}>Giữ lịch</button>
            <button className="booking-detail-page__button booking-detail-page__button--danger" type="submit">Xác nhận hủy</button>
          </div>
        </form>
      )}
    </section>
  )
}
