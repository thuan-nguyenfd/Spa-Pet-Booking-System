import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PetAvatar from '../../../components/booking/PetAvatar.jsx'
import ScheduleSelectionStep from '../../../components/booking/ScheduleSelectionStep.jsx'
import arrowLeft from '../../../assets/icons/booking/arrow-left.svg'
import arrowDown from '../../../assets/icons/booking/arrow-down.svg'
import checkCircle from '../../../assets/icons/booking/check-circle.svg'
import { ROUTES } from '../../../constants/routes.js'
import { bookingService } from '../../../services/bookingService.js'
import { getTotalDuration, addMinutesToTime, formatDuration } from '../../../utils/bookingDuration.js'
import { todayIsoDate } from '../../../utils/bookingDate.js'
import { getBookingActions } from '../../../utils/bookingDetail.js'
import { formatVnd } from '../../../utils/bookingPrice.js'
import '../../../styles/booking.css'
import '../../../styles/booking-detail.css'
import '../../../styles/booking-reschedule.css'

function dateAfterDays(days, from = todayIsoDate()) {
  const date = new Date(`${from}T12:00:00`)
  date.setDate(date.getDate() + days)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` // taste-skill-ignore: the date input uses ISO calendar dates.
}

function formatAppointmentDate(value, options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) {
  if (!value) return 'Ngày hẹn chưa được cập nhật'
  const date = new Date(`${value}T12:00:00`)
  if (Number.isNaN(date.getTime())) return 'Ngày hẹn chưa được cập nhật'
  return new Intl.DateTimeFormat('vi-VN', options).format(date)
}

export default function BookingReschedulePage() {
  const { bookingId } = useParams()
  const [booking, setBooking] = useState(null)
  const [successBooking, setSuccessBooking] = useState(null)
  const [loadState, setLoadState] = useState('loading')
  const [retry, setRetry] = useState(0)
  const [date, setDate] = useState(() => dateAfterDays(1))
  const [time, setTime] = useState(null)
  const [employeeId, setEmployeeId] = useState(null)
  const [employees, setEmployees] = useState([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [calendarWeek, setCalendarWeek] = useState(null)
  const canReschedule = getBookingActions(booking).canReschedule
  const currentDateOffset = Math.max(0, Math.ceil((new Date(`${date}T12:00:00`) - new Date(`${todayIsoDate()}T12:00:00`)) / 86400000))
  const initialCalendarWeek = Math.max(0, Math.floor((currentDateOffset - 1) / 7) * 7)

  useEffect(() => {
    let active = true
    setBooking(null)
    setSuccessBooking(null)
    setLoadState('loading')
    setTime(null)
    setEmployees([])
    setCalendarWeek(null)
    setError('')
    bookingService.getBookingById(bookingId).then((result) => {
      if (!active) return
      setBooking(result)
      setLoadState(result ? 'ready' : 'not-found')
      setEmployeeId(null)
      if (result) setDate(dateAfterDays(1))
    }).catch(() => { if (active) setLoadState('error') })
    return () => { active = false }
  }, [bookingId, retry])

  const duration = getTotalDuration(booking?.services ?? [])
  const endTime = time ? addMinutesToTime(time, duration) : null
  const employee = employees.find((person) => person.id === employeeId)
  const selectDate = useCallback((value) => {
    setDate(value)
    setTime(null)
    setEmployeeId(null)
    setEmployees([])
    setError('')
  }, [])
  const selectTime = useCallback((value) => {
    setTime(value)
    setEmployees([])
    setError('')
    setEmployeeId(null)
  }, [])
  const selectEmployee = useCallback((id) => {
    setEmployeeId(id)
    setError('')
  }, [])
  const availableEmployees = useCallback((members) => setEmployees(members), [])
  const changed = booking && (date !== booking.appointment.date || time !== booking.appointment.startTime || employeeId !== booking.employee.id)

  async function submit() {
    if (busy || !employee || !time || !changed) return
    setBusy(true)
    setError('')
    try {
      const updatedBooking = await bookingService.rescheduleBooking(booking.id, { date, startTime: time, employeeId })
      setBooking(updatedBooking)
      setDate(updatedBooking.appointment.date)
      setTime(updatedBooking.appointment.startTime)
      setEmployeeId(updatedBooking.employee.id)
      setSuccessBooking(updatedBooking)
    } catch (submitError) {
      setError(submitError.message || 'Chưa cập nhật được lịch. Bạn thử lại nhé.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="booking-detail-page booking-reschedule-page" lang="vi">
      <div className="booking-detail-page__inner">
        <Link className="booking-detail-page__back" to={ROUTES.BOOKING_DETAIL(bookingId)}><img className="booking-detail-page__back-icon" src={arrowLeft} alt="" /> Chi tiết lịch hẹn</Link>
        <header className="booking-detail-page__header booking-reschedule-page__header">
          <div>
            <p className="booking-detail-page__code-label">{booking?.code || 'Lịch hẹn của bạn'}</p>
            <h1>Một ngày khác, vẫn trọn chăm sóc.</h1>
            <p>Ngày mới, người chăm sóc phù hợp — những dịch vụ bé yêu thích vẫn được giữ nguyên.</p>
          </div>
        </header>

        {loadState === 'loading' && <div className="booking-loading-line" role="status"><span />Đang chuẩn bị lịch hẹn…</div>}
        {loadState === 'error' && <section className="booking-detail-page__message" role="alert"><h2>Chưa tải được lịch hẹn</h2><button className="booking-text-button" type="button" onClick={() => setRetry((count) => count + 1)}>Thử lại →</button></section>}
        {loadState === 'not-found' && <section className="booking-detail-page__message"><h2>Không tìm thấy lịch hẹn</h2><Link to={ROUTES.BOOKINGS}>Về lịch của tôi</Link></section>}
        {booking && !canReschedule && <section className="booking-detail-page__message"><h2>Lịch này không thể tự đổi</h2><p>Chỉ lịch đang chờ xác nhận mới được tự đổi. MEOMEO có thể hỗ trợ bạn qua trang liên hệ.</p><Link to={ROUTES.CONTACT}>Liên hệ spa</Link></section>}

        {booking && canReschedule && <div className="reschedule-layout">
          <div className="reschedule-stage" data-ui>
            <fieldset disabled={busy} className="reschedule-fields">
              <ScheduleSelectionStep
                rescheduling
                excludeBookingId={booking.id}
                weekOffset={calendarWeek ?? initialCalendarWeek}
                onWeekChange={setCalendarWeek}
                dateOffset={1}
                onDateChange={(value) => {
                  const offset = Math.floor((new Date(`${value}T12:00:00`) - new Date(`${todayIsoDate()}T12:00:00`)) / 86400000)
                  if (Number.isFinite(offset)) setCalendarWeek(Math.max(0, Math.floor((offset - 1) / 7) * 7))
                }}
                date={date}
                totalDuration={duration}
                startTime={time}
                endTime={endTime}
                employeeId={employeeId}
                onSelectDate={selectDate}
                onSelectTime={selectTime}
                onSelectEmployee={selectEmployee}
                onAvailableEmployees={availableEmployees}
              />
            </fieldset>
          </div>

          <aside className="reschedule-receipt" aria-label="So sánh lịch cũ và lịch mới">
            <div className="reschedule-pet"><PetAvatar pet={booking.pet} /><div><h2>{booking.pet.name}</h2><p>{formatDuration(duration)} · {formatVnd(booking.totalPrice)}</p></div></div>
            <section className="reschedule-before"><h3>Lịch hiện tại</h3><p>{formatAppointmentDate(booking.appointment.date, { day: 'numeric', month: 'long', year: 'numeric' })}</p><strong>{booking.appointment.startTime}–{booking.appointment.endTime}</strong><p>{booking.employee.name}</p></section>
            <div className="reschedule-arrow" aria-hidden="true"><img src={arrowDown} alt="" /></div>
            <section className="reschedule-after" aria-live="polite"><h3>Lịch mới</h3><p>{formatAppointmentDate(date, { day: 'numeric', month: 'long', year: 'numeric' })}</p><strong>{time ? `${time}–${endTime}` : 'Chưa chọn giờ'}</strong><p>{employee?.name || 'Chọn chuyên viên phù hợp'}</p></section>
            <p className="reschedule-policy">Thú cưng, dịch vụ và tổng tiền được giữ nguyên.{booking.paymentStatus === 'PAID' && ' Khoản thanh toán của bạn được giữ lại cho lịch này.'}</p>
            <details className="reschedule-services"><summary>Dịch vụ đã đặt</summary><ul>{booking.services.map((service) => <li key={service.serviceId}>{service.name}</li>)}</ul></details>
            {error && <p className="booking-inline-error" role="alert">{error}</p>}
            <button className="booking-action-button" type="button" onClick={submit} disabled={busy || !employee || !time || !changed}>{busy ? 'Đang cập nhật…' : 'Xác nhận đổi lịch'}</button>
            {!time && <p className="reschedule-helper">Chọn giờ và chuyên viên để xác nhận.</p>}
            {!successBooking && <Link className="booking-text-button" to={ROUTES.BOOKING_DETAIL(booking.id)}>Giữ lịch hiện tại</Link>}
          </aside>
        </div>}
        {successBooking && <aside className="reschedule-toast" role="status" aria-live="polite">
          <img className="reschedule-toast__mark" src={checkCircle} alt="" />
          <div><strong>Đổi lịch thành công</strong><p>Lịch của {successBooking.pet.name} đã chuyển sang {formatAppointmentDate(successBooking.appointment.date, { day: 'numeric', month: 'numeric', year: 'numeric' })} · {successBooking.appointment.startTime}–{successBooking.appointment.endTime}.</p><Link to={ROUTES.BOOKING_DETAIL(successBooking.id)}>Xem chi tiết lịch hẹn</Link></div>
          <button type="button" aria-label="Đóng thông báo" onClick={() => setSuccessBooking(null)}>×</button>
        </aside>}
      </div>
    </div>
  )
}
