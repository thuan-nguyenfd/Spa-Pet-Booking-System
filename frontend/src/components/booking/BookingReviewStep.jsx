import PetAvatar from './PetAvatar.jsx'
import { formatDuration } from '../../utils/bookingDuration.js'
import { formatVnd } from '../../utils/bookingPrice.js'

function displayDate(date) {
  if (!date) return ''
  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(`${date}T12:00:00`))
}

export default function BookingReviewStep({
  customer,
  pet,
  items,
  employee,
  date,
  startTime,
  endTime,
  totalDuration,
  totalPrice,
  note,
  paymentMethod,
  onNoteChange,
  onPaymentChange,
  error,
}) {
  return (
    <section className="booking-step-content" aria-labelledby="review-step-title">
      <div className="booking-step-heading">
        <p className="booking-step-heading__eyebrow">Bước 4 · Xác nhận</p>
        <h2 id="review-step-title">Mình cùng xem lại lịch hẹn nhé.</h2>
        <p>Mọi thông tin đã sẵn sàng. Bạn có thể quay lại chỉnh sửa bất cứ lúc nào.</p>
      </div>

      <div className="booking-review">
        <section className="booking-review-section" aria-labelledby="customer-info-title">
          <div className="booking-review-section__heading"><h3 id="customer-info-title">Thông tin liên hệ</h3><span>Đã đăng nhập</span></div>
          <div className="booking-customer-info">
            <div><small>Họ tên</small><strong>{customer.fullName}</strong></div>
            <div><small>Số điện thoại</small><strong>{customer.phone}</strong></div>
            <div className="booking-customer-info__email"><small>Email</small><strong>{customer.email}</strong></div>
          </div>
        </section>

        <section className="booking-review-section" aria-labelledby="pet-review-title">
          <div className="booking-review-section__heading"><h3 id="pet-review-title">Bạn nhỏ đi spa</h3></div>
          <div className="booking-review-pet">
            <PetAvatar pet={pet} />
            <div><strong>{pet.name}</strong><span>{pet.breed || pet.species} <i aria-hidden="true">·</i> {pet.weightKg} kg</span></div>
          </div>
        </section>

        <section className="booking-review-section" aria-labelledby="services-review-title">
          <div className="booking-review-section__heading"><h3 id="services-review-title">Dịch vụ đã chọn</h3><span>{formatDuration(totalDuration)}</span></div>
          <ul className="booking-review-services">
            {items.map((item) => (
              <li key={item.id}>
                <span><strong>{item.name}</strong><small>{formatDuration(item.durationMinutes)}</small></span>
                <b>{formatVnd(item.priceVnd)}</b>
              </li>
            ))}
          </ul>
        </section>

        <section className="booking-review-section" aria-labelledby="appointment-review-title">
          <div className="booking-review-section__heading"><h3 id="appointment-review-title">Lịch hẹn</h3></div>
          <div className="booking-review-appointment">
            <div><small>Ngày</small><strong>{displayDate(date)}</strong></div>
            <div><small>Thời gian</small><strong>{startTime} <span aria-hidden="true">→</span> {endTime}</strong></div>
            <div><small>Chuyên viên</small><strong>{employee.name}</strong></div>
          </div>
        </section>

        <label className="booking-field booking-review-note">
          <span>Ghi chú cho spa <small>(không bắt buộc)</small></span>
          <textarea value={note} onChange={(event) => onNoteChange(event.target.value)} maxLength={500} rows={3} placeholder="Ví dụ: Bé hơi sợ máy sấy…" />
          <small className="booking-note-count">{note.length}/500</small>
        </label>

        <fieldset className="booking-payment-fieldset">
          <legend>Phương thức thanh toán</legend>
          <label className={`booking-payment-option${paymentMethod === 'CASH' ? ' is-selected' : ''}`}>
            <input type="radio" name="paymentMethod" value="CASH" checked={paymentMethod === 'CASH'} onChange={() => onPaymentChange('CASH')} />
            <span className="booking-payment-option__text"><strong>Thanh toán tại spa</strong><small>Thanh toán trực tiếp sau khi sử dụng dịch vụ.</small></span>
            <span className="booking-payment-option__mark" aria-hidden="true" />
          </label>
          <label className={`booking-payment-option${paymentMethod === 'VNPAY' ? ' is-selected' : ''}`}>
            <input type="radio" name="paymentMethod" value="VNPAY" checked={paymentMethod === 'VNPAY'} onChange={() => onPaymentChange('VNPAY')} />
            <span className="booking-payment-option__text"><strong>VNPay</strong><small>Thanh toán trực tuyến an toàn qua VNPay.</small></span>
            <span className="booking-payment-option__provider" aria-hidden="true">VNPay</span>
            <span className="booking-payment-option__mark" aria-hidden="true" />
          </label>
        </fieldset>

        <div className="booking-review-total"><span>Tạm tính</span><strong>{formatVnd(totalPrice)}</strong></div>
        {error && <p className="booking-inline-error" role="alert">{error}</p>}
      </div>
    </section>
  )
}
