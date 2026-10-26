import { useEffect, useState } from 'react'
import PetAvatar from './PetAvatar.jsx'
import { formatDuration } from '../../utils/bookingDuration.js'
import { formatVnd } from '../../utils/bookingPrice.js'

export default function BookingSummary({ pet, items, date, startTime, endTime, employee, totalDuration, totalPrice }) {
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia('(min-width: 900px)').matches)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(min-width: 900px)')
    const update = () => setIsDesktop(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  const bookingDate = date
    ? new Intl.DateTimeFormat('vi-VN', { day: 'numeric', month: 'long' }).format(new Date(`${date}T12:00:00`))
    : ''

  return (
    <details className="booking-summary" open={isDesktop || expanded} onToggle={(event) => !isDesktop && setExpanded(event.currentTarget.open)}>
      <summary className="booking-summary__toggle">
        <span className="booking-summary__title">Lịch hẹn của bạn</span>
        <span className="booking-summary__amount">{totalPrice ? formatVnd(totalPrice) : 'Tạm tính'}</span>
        <span className="booking-summary__chevron" aria-hidden="true">⌄</span>
      </summary>
      <div className="booking-summary__body">
        <h2>Tóm tắt lịch spa</h2>

        <div className="booking-summary__pet">
          {pet ? (
            <>
              <PetAvatar pet={pet} />
              <span><strong>{pet.name}</strong><small>{pet.breed || pet.species} · {pet.weightKg} kg</small></span>
            </>
          ) : <span className="booking-summary__empty">Chọn bạn nhỏ đi spa</span>}
        </div>

        <div className="booking-summary__section">
          <h3>Dịch vụ</h3>
          {items.length ? (
            <ul>{items.map((item) => <li key={item.id}><span>{item.name}</span><b>{formatVnd(item.priceVnd)}</b></li>)}</ul>
          ) : <p className="booking-summary__empty">Dịch vụ sẽ hiện ở đây</p>}
        </div>

        <div className="booking-summary__facts">
          <div><span>Thời lượng</span><strong>{totalDuration ? formatDuration(totalDuration) : 'Sau khi chọn dịch vụ'}</strong></div>
          <div><span>Ngày</span><strong>{bookingDate || 'Chưa chọn'}</strong></div>
          <div><span>Giờ</span><strong>{startTime ? `${startTime} – ${endTime}` : 'Chưa chọn'}</strong></div>
          <div><span>Chuyên viên</span><strong>{employee?.name || 'Chưa chọn'}</strong></div>
        </div>

        <div className="booking-summary__total"><span>Tạm tính</span><strong>{totalPrice ? formatVnd(totalPrice) : '—'}</strong></div>
        <p className="booking-summary__caption">Giá có thể thay đổi nếu cân nặng của bé được cập nhật tại spa.</p>
      </div>
    </details>
  )
}
